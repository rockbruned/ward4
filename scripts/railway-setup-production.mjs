#!/usr/bin/env node
/**
 * Railway production setup: custom domains + NEXT_PUBLIC_SITE_URL.
 *
 * Prerequisites: `railway login` and project linked (or RAILWAY_TOKEN set).
 *
 *   npm run railway:setup
 */

import { PRODUCTION, SITE_URL_VAR } from "./lib/production-config.mjs";
import { commandExists, loadDotEnv, run, tryParseJson } from "./lib/run.mjs";
import {
  formatDnsInstructions,
  parseRailwayDomainJson,
} from "./lib/dns-records.mjs";

const { apexDomain, wwwDomain, siteUrl, railway } = PRODUCTION;
const domains = [apexDomain, wwwDomain];

function log(section, message) {
  console.log(`\n[${section}] ${message}`);
}

function railwayArgs(extra = []) {
  return ["--service", railway.serviceId, ...extra];
}

function ensureRailwayCli() {
  if (!commandExists("railway")) {
    throw new Error(
      "Railway CLI not found. Install: npm i -g @railway/cli then run `railway login`.",
    );
  }
}

function checkRailwayAuth() {
  const whoami = run("railway", ["whoami"]);
  if (!whoami.ok) {
    throw new Error(
      "Not logged in to Railway. Run `railway login` (or set RAILWAY_TOKEN).",
    );
  }
  log("railway", whoami.stdout || "authenticated");

  const status = run("railway", ["status", "--json"]);
  if (!status.ok) {
    log(
      "railway",
      "Project not linked. Run `railway link` and select don-rockbrune-ward4 / production.",
    );
    return false;
  }

  const parsed = tryParseJson(status.stdout);
  const linkedName = parsed?.name;
  if (linkedName && linkedName !== railway.serviceName) {
    log(
      "railway",
      `Linked project is "${linkedName}" (expected ${railway.serviceName}). Continuing with --service ${railway.serviceId}.`,
    );
  } else {
    log("railway", `Linked to ${linkedName ?? railway.serviceName}`);
  }

  return true;
}

function railwayDomain(domain) {
  const created = run("railway", [
    "domain",
    domain,
    "--service",
    railway.serviceId,
    "--json",
  ]);

  if (created.ok) {
    const payload = tryParseJson(created.stdout);
    if (payload) {
      return { ok: true, source: "create", ...parseRailwayDomainJson(payload) };
    }
    return { ok: true, source: "create", domain, records: [], raw: created.stdout };
  }

  const combined = created.combined.toLowerCase();
  if (
    combined.includes("unauthorized") ||
    combined.includes("please run `railway login`")
  ) {
    return {
      ok: false,
      domain,
      error: "unauthorized",
      message: created.combined,
    };
  }

  if (
    combined.includes("already") ||
    combined.includes("exists") ||
    combined.includes("duplicate")
  ) {
    const status = run("railway", [
      "domain",
      "status",
      domain,
      ...railwayArgs(["--json"]),
    ]);
    if (status.ok) {
      const payload = tryParseJson(status.stdout);
      if (payload) {
        return { ok: true, source: "status", ...parseRailwayDomainJson(payload) };
      }
    }

    const listed = run("railway", ["domain", "list", ...railwayArgs(["--json"])]);
    if (listed.ok) {
      const payload = tryParseJson(listed.stdout);
      const items = payload?.domains ?? [];
      const match = items.find((item) => item.domain === domain);
      if (match) {
        const detail = run("railway", [
          "domain",
          "status",
          domain,
          ...railwayArgs(["--json"]),
        ]);
        if (detail.ok) {
          return {
            ok: true,
            source: "status",
            ...parseRailwayDomainJson(tryParseJson(detail.stdout)),
          };
        }
        return { ok: true, source: "list", domain, records: [] };
      }
    }
  }

  return {
    ok: false,
    domain,
    error: "domain_command_failed",
    message: created.combined || `railway domain ${domain} failed`,
  };
}

function ensureSiteUrl() {
  const listed = run("railway", ["variable", "list", ...railwayArgs(["--json"])]);
  if (!listed.ok) {
    log("env", `Could not list variables: ${listed.combined}`);
    return { set: false, skipped: true, reason: listed.combined };
  }

  const vars = tryParseJson(listed.stdout) ?? {};
  const current = vars[SITE_URL_VAR];

  if (current && current.trim() === siteUrl) {
    log("env", `${SITE_URL_VAR} already set to ${siteUrl}`);
    return { set: false, skipped: true, current };
  }

  if (current) {
    log("env", `${SITE_URL_VAR} is "${current}" — updating to ${siteUrl}`);
  } else {
    log("env", `Setting ${SITE_URL_VAR}=${siteUrl}`);
  }

  const set = run("railway", [
    "variable",
    "set",
    `${SITE_URL_VAR}=${siteUrl}`,
    ...railwayArgs(["--skip-deploys"]),
  ]);

  if (!set.ok) {
    return { set: false, error: set.combined };
  }

  return { set: true, value: siteUrl };
}

export async function setupRailway(options = {}) {
  const { skipDomains = false, skipEnv = false } = options;
  const result = {
    ok: true,
    domains: [],
    env: null,
    errors: [],
    dnsInstructions: "",
  };

  ensureRailwayCli();
  checkRailwayAuth();

  if (!skipDomains) {
    log("domains", `Adding ${domains.join(" and ")}…`);

    for (const domain of domains) {
      const outcome = railwayDomain(domain);
      if (outcome.ok) {
        log(
          "domains",
          `${domain}: ${outcome.source === "create" ? "created" : "already configured"}`,
        );
        result.domains.push({
          domain: outcome.domain || domain,
          records: outcome.records ?? [],
        });
      } else {
        result.ok = false;
        result.errors.push(outcome);
        log("domains", `${domain}: FAILED — ${outcome.message}`);
      }
    }
  }

  if (!skipEnv) {
    result.env = ensureSiteUrl();
    if (result.env?.error) {
      result.ok = false;
      result.errors.push({ step: "env", message: result.env.error });
    }
  }

  result.dnsInstructions = formatDnsInstructions(result.domains);

  console.log("\n--- DNS records for your registrar ---\n");
  console.log(result.dnsInstructions);
  console.log(
    "\nAdd these at your DNS provider (Cloudflare, Namecheap, etc.).",
  );
  console.log(
    "Apex (@) usually needs CNAME/ALIAS/ANAME — not a plain A record.",
  );
  console.log(
    "Optional Cloudflare automation: copy scripts/dns-cloudflare.example.mjs → dns-cloudflare.mjs",
  );

  if (result.errors.some((e) => e.error === "unauthorized")) {
    console.log(
      "\n⚠ Domain API returned Unauthorized even though `railway whoami` works.",
    );
    console.log(
      "  Try: `railway login` again, or set RAILWAY_TOKEN to a project token from",
    );
    console.log(
      "  Railway → don-rockbrune-ward4 → Settings → Tokens → production.",
    );
    console.log(
      "  Then re-run: npm run railway:setup",
    );
  }

  return result;
}

const isMain =
  process.argv[1]?.replace(/\\/g, "/").endsWith("railway-setup-production.mjs") ??
  false;

if (isMain) {
  loadDotEnv();
  setupRailway()
    .then((result) => {
      process.exit(result.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    });
}

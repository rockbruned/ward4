#!/usr/bin/env node
/**
 * EXAMPLE — Cloudflare DNS automation for Railway custom domains.
 *
 * Copy to scripts/dns-cloudflare.mjs (gitignored) and run after railway:setup:
 *
 *   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ZONE_ID=yyy node scripts/dns-cloudflare.mjs
 *
 * Or pipe Railway JSON:
 *   railway domain donrockbrune.com --json | node scripts/dns-cloudflare.mjs --stdin
 *
 * Requires a Cloudflare API token with Zone.DNS Edit for the zone.
 * Apex CNAME works on Cloudflare via CNAME flattening (proxy optional; grey cloud until TLS).
 */

import { readFileSync } from "node:fs";
import { parseRailwayDomainJson } from "./lib/dns-records.mjs";
import { PRODUCTION } from "./lib/production-config.mjs";

const CF_API = "https://api.cloudflare.com/client/v4";

function parseArgs(argv) {
  const flags = { stdin: false, dryRun: false, file: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--stdin") flags.stdin = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--file") flags.file = argv[++i] ?? "";
  }
  return flags;
}

async function readInput(flags) {
  if (flags.stdin) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString("utf8");
  }
  if (flags.file) {
    return readFileSync(flags.file, "utf8");
  }

  return JSON.stringify({
    note: "example",
    domains: [
      {
        domain: PRODUCTION.apexDomain,
        records: [
          { type: "CNAME", host: "@", value: "YOUR_RAILWAY_TARGET.up.railway.app" },
          { type: "TXT", host: "_railway-verify", value: "railway-verify=TOKEN" },
        ],
      },
      {
        domain: PRODUCTION.wwwDomain,
        records: [
          { type: "CNAME", host: "www", value: "YOUR_RAILWAY_TARGET.up.railway.app" },
          { type: "TXT", host: "_railway-verify.www", value: "railway-verify=TOKEN" },
        ],
      },
    ],
  });
}

function collectDomains(payload) {
  if (payload?.domains && Array.isArray(payload.domains)) {
    return payload.domains.map((entry) =>
      entry.records
        ? entry
        : parseRailwayDomainJson(entry),
    );
  }

  const single = parseRailwayDomainJson(payload);
  if (single.records.length) return [single];
  return [];
}

async function cfRequest(token, zoneId, method, path, body) {
  const response = await fetch(`${CF_API}/zones/${zoneId}/dns_records${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join("; ") ?? response.statusText;
    throw new Error(`Cloudflare API error: ${msg}`);
  }
  return json.result;
}

function recordName(host) {
  const apex = PRODUCTION.apexDomain;
  if (host === "@") return apex;
  if (host.includes(".")) return host.endsWith(apex) ? host : `${host}.${apex}`;
  return `${host}.${apex}`;
}

async function upsertRecord(token, zoneId, { type, host, value }, dryRun) {
  const normalizedName = recordName(host);

  const record = {
    type,
    name: normalizedName,
    content: value,
    ttl: 1,
    proxied: false,
  };

  if (dryRun) {
    console.log(`[dry-run] ${type} ${normalizedName} → ${value}`);
    return;
  }

  const list = await cfRequest(
    token,
    zoneId,
    "GET",
    `?type=${type}&name=${encodeURIComponent(normalizedName)}`,
  );

  if (list?.length) {
    const id = list[0].id;
    await cfRequest(token, zoneId, "PUT", `/${id}`, record);
    console.log(`Updated ${type} ${normalizedName}`);
  } else {
    await cfRequest(token, zoneId, "POST", "", record);
    console.log(`Created ${type} ${normalizedName}`);
  }
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();

  if (!token || !zoneId) {
    console.error(
      "Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID.\n" +
        "Create a token at https://dash.cloudflare.com/profile/api-tokens with Zone → DNS → Edit.\n" +
        "Zone ID: Cloudflare dashboard → domain → Overview → API (right column).",
    );
    process.exit(1);
  }

  const flags = parseArgs(process.argv.slice(2));
  const raw = await readInput(flags);
  const payload = JSON.parse(raw);
  const domains = collectDomains(payload);

  if (!domains.length) {
    console.error("No DNS records found in input. Run npm run railway:setup first.");
    process.exit(1);
  }

  for (const { domain, records } of domains) {
    console.log(`\nCloudflare DNS for ${domain}:`);
    for (const record of records) {
      await upsertRecord(token, zoneId, record, flags.dryRun);
    }
  }

  console.log("\nDone. DNS may take a few minutes to propagate; Railway will issue TLS after TXT verifies.");
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});

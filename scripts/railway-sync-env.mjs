#!/usr/bin/env node
/**
 * Sync selected .env values to the Railway web service (no secrets logged).
 *
 * Prerequisites: `railway login` and project linked (or RAILWAY_TOKEN set).
 *
 *   npm run railway:sync-env
 *   npm run railway:sync-env -- --postgres-ref --deploy --verify-chat
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { PRODUCTION } from "./lib/production-config.mjs";
import { commandExists, loadDotEnv, run, tryParseJson } from "./lib/run.mjs";

const { siteUrl, railway } = PRODUCTION;

const SYNC_VARS = [
  { key: "RESEND_API_KEY", secret: true, stdin: true },
  { key: "RESEND_FROM_EMAIL" },
  { key: "CHAT_NOTIFY_EMAIL" },
  { key: "CONTACT_EMAIL" },
];

const POSTGRES_REF = "${{Postgres.DATABASE_URL}}";
const DATABASE_URL_KEY = "DATABASE_URL";

function log(section, message) {
  console.log(`\n[${section}] ${message}`);
}

function railwayArgs(extra = []) {
  return ["--service", railway.serviceId, ...extra];
}

function parseArgs(argv) {
  const flags = {
    postgresRef: false,
    deploy: false,
    verifyChat: false,
  };

  for (const arg of argv) {
    if (arg === "--postgres-ref") flags.postgresRef = true;
    else if (arg === "--deploy") flags.deploy = true;
    else if (arg === "--verify-chat") flags.verifyChat = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return flags;
}

function printHelp() {
  console.log(`Sync local .env → Railway (${railway.serviceName})

Usage:
  npm run railway:sync-env
  npm run railway:sync-env -- --postgres-ref --deploy --verify-chat

Syncs: RESEND_API_KEY (stdin), RESEND_FROM_EMAIL, CHAT_NOTIFY_EMAIL, CONTACT_EMAIL

Options:
  --postgres-ref   Set DATABASE_URL=\${{Postgres.DATABASE_URL}} on the web service
  --deploy         Run npm run deploy after syncing variables
  --verify-chat    POST /api/chat on ${siteUrl}; prints emailSent boolean only
`);
}

/** Parse KEY=VALUE from .env file (does not mutate process.env). */
function readDotEnv(path = ".env") {
  const values = {};
  if (!existsSync(path)) return values;

  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }

  return values;
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
}

function listRailwayVars() {
  const listed = run("railway", ["variable", "list", ...railwayArgs(["--json"])]);
  if (!listed.ok) {
    throw new Error(`Could not list Railway variables: ${listed.combined}`);
  }
  return tryParseJson(listed.stdout) ?? {};
}

function runRailwaySet(key, value, { stdin = false } = {}) {
  const skipDeploy = ["--skip-deploys"];
  if (stdin) {
    const result = spawnSync(
      "railway",
      ["variable", "set", key, "--stdin", ...railwayArgs(skipDeploy)],
      {
        encoding: "utf8",
        shell: true,
        input: value,
        env: process.env,
      },
    );
    const stdout = (result.stdout ?? "").trim();
    const stderr = (result.stderr ?? "").trim();
    return {
      ok: result.status === 0,
      combined: [stdout, stderr].filter(Boolean).join("\n"),
    };
  }

  return run("railway", [
    "variable",
    "set",
    `${key}=${value}`,
    ...railwayArgs(skipDeploy),
  ]);
}

function syncVariable(key, localValue, remoteVars) {
  const remote = remoteVars[key];

  if (localValue === undefined || localValue === "") {
    log("sync", `${key}: skipped (not in local .env or empty)`);
    return { key, status: "skipped", reason: "missing_local" };
  }

  if (remote !== undefined && remote === localValue) {
    log("sync", `${key}: already-set`);
    return { key, status: "already-set" };
  }

  const spec = SYNC_VARS.find((v) => v.key === key);
  const set = runRailwaySet(key, localValue, { stdin: spec?.stdin ?? false });

  if (!set.ok) {
    log("sync", `${key}: FAILED — ${set.combined}`);
    return { key, status: "failed", error: set.combined };
  }

  log("sync", `${key}: set`);
  return { key, status: "set" };
}

function syncEnvFromDotenv(localEnv, remoteVars) {
  const results = [];

  for (const { key } of SYNC_VARS) {
    results.push(syncVariable(key, localEnv[key], remoteVars));
  }

  return results;
}

function syncPostgresRef(remoteVars) {
  const remote = remoteVars[DATABASE_URL_KEY];

  if (remote === POSTGRES_REF) {
    log("sync", `${DATABASE_URL_KEY}: already-set (Postgres reference)`);
    return { key: DATABASE_URL_KEY, status: "already-set" };
  }

  const set = run("railway", [
    "variable",
    "set",
    `${DATABASE_URL_KEY}=${POSTGRES_REF}`,
    ...railwayArgs(["--skip-deploys"]),
  ]);

  if (!set.ok) {
    log("sync", `${DATABASE_URL_KEY}: FAILED — ${set.combined}`);
    return { key: DATABASE_URL_KEY, status: "failed", error: set.combined };
  }

  log("sync", `${DATABASE_URL_KEY}: set (Postgres reference)`);
  return { key: DATABASE_URL_KEY, status: "set" };
}

function runDeploy() {
  log("deploy", "Running npm run deploy…");
  const deploy = run("npm", ["run", "deploy"]);
  if (!deploy.ok) {
    log("deploy", `FAILED — ${deploy.combined}`);
    return { ok: false, error: deploy.combined };
  }
  log("deploy", "Triggered (railway up --detach)");
  return { ok: true };
}

async function verifyChat() {
  const url = `${siteUrl.replace(/\/$/, "")}/api/chat`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "railway:sync-env verify (automated test — safe to ignore)",
    }),
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`verify-chat: non-JSON response from ${url} (${response.status})`);
  }

  if (typeof payload.emailSent !== "boolean") {
    throw new Error(
      `verify-chat: response missing emailSent boolean (${response.status})`,
    );
  }

  console.log(String(payload.emailSent));
  return payload.emailSent;
}

export async function syncRailwayEnv(options = {}) {
  const { postgresRef = false, deploy = false, verifyChat: doVerify = false } =
    options;

  ensureRailwayCli();
  checkRailwayAuth();

  const localEnv = readDotEnv();
  if (Object.keys(localEnv).length === 0) {
    log("sync", "No .env file found or file is empty — nothing to read locally");
  }

  log("sync", `Reading from .env → Railway service ${railway.serviceId}`);

  const remoteVars = listRailwayVars();
  const results = syncEnvFromDotenv(localEnv, remoteVars);

  if (postgresRef) {
    results.push(syncPostgresRef(remoteVars));
  }

  const failed = results.filter((r) => r.status === "failed");
  let ok = failed.length === 0;

  if (deploy && ok) {
    const deployResult = runDeploy();
    if (!deployResult.ok) {
      ok = false;
      failed.push({ key: "deploy", status: "failed", error: deployResult.error });
    }
  }

  if (doVerify) {
    if (!ok) {
      throw new Error("Skipping --verify-chat because sync or deploy failed");
    }
    await verifyChat();
  }

  return { ok, results, failed };
}

const isMain =
  process.argv[1]?.replace(/\\/g, "/").endsWith("railway-sync-env.mjs") ?? false;

if (isMain) {
  loadDotEnv();

  let flags;
  try {
    flags = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    printHelp();
    process.exit(1);
  }

  syncRailwayEnv(flags)
    .then((result) => {
      process.exit(result.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    });
}

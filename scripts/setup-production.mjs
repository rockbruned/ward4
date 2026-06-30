#!/usr/bin/env node
/**
 * One-command production setup orchestrator.
 *
 *   npm run setup:production
 *   npm run setup:production -- --github
 *   RAILWAY_TOKEN=xxx npm run setup:production -- --github --push
 */

import { loadDotEnv } from "./lib/run.mjs";
import { setupRailway } from "./railway-setup-production.mjs";
import { setupGitHub } from "./github-setup.mjs";
import { PRODUCTION } from "./lib/production-config.mjs";

function parseArgs(argv) {
  const flags = {
    github: false,
    push: false,
    skipRailway: false,
    skipEnv: false,
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg === "--github") flags.github = true;
    else if (arg === "--push") flags.push = true;
    else if (arg === "--skip-railway") flags.skipRailway = true;
    else if (arg === "--skip-env") flags.skipEnv = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return flags;
}

function printHelp() {
  console.log(`Production setup — ${PRODUCTION.siteUrl}

Usage:
  npm run setup:production              Railway domains + env + DNS instructions
  npm run setup:production -- --github  Also configure GitHub repo + RAILWAY_TOKEN secret

Options:
  --github       Run scripts/github-setup.mjs (needs RAILWAY_TOKEN, gh auth login)
  --push         With --github: git push after setup (requires at least one commit)
  --skip-railway Skip railway domain / env steps
  --skip-env     Skip NEXT_PUBLIC_SITE_URL only
  --dry-run      GitHub steps only (no writes)

Manual steps (cannot fully automate without registrar API):
  • DNS at your registrar (or Cloudflare — see scripts/dns-cloudflare.example.mjs)
  • railway login (once per machine)
  • Initial git commit before --push
`);
}

async function main() {
  loadDotEnv();
  const flags = parseArgs(process.argv.slice(2));
  let exitCode = 0;

  console.log(`=== Production setup: ${PRODUCTION.siteUrl} ===\n`);

  if (!flags.skipRailway) {
    const railway = await setupRailway({ skipEnv: flags.skipEnv });
    if (!railway.ok) exitCode = 1;
  } else {
    console.log("Skipping Railway setup (--skip-railway).");
  }

  if (flags.github) {
    console.log("\n=== GitHub setup ===\n");
    try {
      await setupGitHub({ push: flags.push, dryRun: flags.dryRun });
    } catch (err) {
      console.error(err.message);
      exitCode = 1;
    }
  }

  console.log("\n=== Automated vs manual ===\n");
  console.log("| Step | Automated | Command / notes |");
  console.log("|------|-----------|-----------------|");
  console.log("| Railway custom domains | Yes (CLI) | `npm run railway:setup` |");
  console.log("| NEXT_PUBLIC_SITE_URL | Yes (CLI) | set by railway:setup |");
  console.log("| DNS CNAME + TXT | Partial | Registrar UI, or Cloudflare API example script |");
  console.log("| GitHub repo + secret | Yes (gh CLI) | `RAILWAY_TOKEN=xxx npm run setup:production -- --github` |");
  console.log("| CI deploy on push | Yes | after secret + push to main |");
  console.log("| TLS certificate | Automatic | after DNS verifies (Railway) |");
  console.log("\nSee docs/DEPLOY.md for the full matrix.");

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});

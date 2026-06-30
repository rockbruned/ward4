#!/usr/bin/env node
/**
 * One-time GitHub repo + RAILWAY_TOKEN secret setup (uses `gh` CLI).
 *
 *   RAILWAY_TOKEN=xxx node scripts/github-setup.mjs
 *   RAILWAY_TOKEN=xxx node scripts/github-setup.mjs --repo rockbruned/in-ward4 --push
 *
 * Does NOT commit code — create a commit first if the repo is empty.
 */

import { spawnSync } from "node:child_process";
import { commandExists, loadDotEnv, run, tryParseJson } from "./lib/run.mjs";
import { PRODUCTION } from "./lib/production-config.mjs";

function parseArgs(argv) {
  const flags = {
    push: false,
    private: true,
    dryRun: false,
    repo: process.env.GITHUB_REPO ?? "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--push") flags.push = true;
    else if (arg === "--public") flags.private = false;
    else if (arg === "--private") flags.private = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--repo") {
      flags.repo = argv[++i] ?? "";
    }
  }

  return flags;
}

function ghUser() {
  const result = run("gh", ["api", "user", "-q", ".login"]);
  return result.ok ? result.stdout.trim() : "";
}

function defaultRepoName() {
  const fromEnv = process.env.GITHUB_REPO;
  if (fromEnv) return fromEnv;

  const user = ghUser();
  const name = process.env.GITHUB_REPO_NAME ?? "in-ward4";
  return user ? `${user}/${name}` : name;
}

function hasCommits() {
  const result = run("git", ["rev-parse", "--verify", "HEAD"]);
  return result.ok;
}

function currentBranch() {
  const result = run("git", ["branch", "--show-current"]);
  return result.ok && result.stdout ? result.stdout : "main";
}

function remoteUrl(repo) {
  return `https://github.com/${repo}.git`;
}

function ensureGh() {
  if (!commandExists("gh")) {
    throw new Error(
      "GitHub CLI (`gh`) not found. Install from https://cli.github.com and run `gh auth login`.",
    );
  }

  const auth = run("gh", ["auth", "status"]);
  if (!auth.ok) {
    throw new Error("Not authenticated with GitHub. Run `gh auth login`.");
  }
}

function ensureRailwayToken() {
  const token = process.env.RAILWAY_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "RAILWAY_TOKEN is not set. Export a Railway project token:\n" +
        "  Railway → don-rockbrune-ward4 → Settings → Tokens → production\n" +
        "  RAILWAY_TOKEN=xxx node scripts/github-setup.mjs",
    );
  }
  return token;
}

function repoExists(repo) {
  const view = run("gh", ["repo", "view", repo, "--json", "name"]);
  return view.ok;
}

function createRepo(repo, isPrivate, dryRun) {
  const [owner, name] = repo.includes("/")
    ? repo.split("/", 2)
    : [ghUser(), repo];

  const fullName = owner && name ? `${owner}/${name}` : repo;
  const createArgs = [
    "repo",
    "create",
    name ?? repo,
    isPrivate ? "--private" : "--public",
  ];

  if (hasCommits()) {
    createArgs.push("--source=.", "--remote=origin");
  }

  if (owner && owner !== ghUser()) {
    createArgs.push(`--org=${owner}`);
  }

  if (dryRun) {
    console.log(`[dry-run] gh ${createArgs.join(" ")}`);
    return { created: false, repo: fullName };
  }

  const created = run("gh", createArgs);
  if (!created.ok) {
    throw new Error(`Failed to create repo: ${created.combined}`);
  }

  return { created: true, repo: fullName };
}

function ensureRemote(repo, dryRun) {
  const existing = run("git", ["remote", "get-url", "origin"]);
  const url = remoteUrl(repo);

  if (existing.ok) {
    if (existing.stdout.includes(repo)) {
      console.log(`Git remote origin already points at ${repo}`);
      return;
    }
    console.log(`Updating origin → ${url}`);
    if (!dryRun) {
      const set = run("git", ["remote", "set-url", "origin", url]);
      if (!set.ok) throw new Error(set.combined);
    }
    return;
  }

  console.log(`Adding origin → ${url}`);
  if (!dryRun) {
    const add = run("git", ["remote", "add", "origin", url]);
    if (!add.ok) throw new Error(add.combined);
  }
}

function setRailwaySecret(token, dryRun) {
  console.log("Setting GitHub Actions secret RAILWAY_TOKEN…");

  if (dryRun) {
    console.log("[dry-run] gh secret set RAILWAY_TOKEN (value from env)");
    return;
  }

  const result = spawnSync("gh", ["secret", "set", "RAILWAY_TOKEN"], {
    input: token,
    encoding: "utf8",
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error(
      `gh secret set failed: ${[result.stdout, result.stderr].filter(Boolean).join("\n")}`,
    );
  }

  console.log("Secret RAILWAY_TOKEN configured.");
}

function pushToGitHub(dryRun) {
  if (!hasCommits()) {
    console.log(
      "\nNo git commits yet — skipping push. Create an initial commit, then:",
    );
    console.log("  git push -u origin main");
    return { pushed: false, reason: "no_commits" };
  }

  const branch = currentBranch();
  console.log(`Pushing branch ${branch} to origin…`);

  if (dryRun) {
    console.log(`[dry-run] git push -u origin ${branch}`);
    return { pushed: false, dryRun: true };
  }

  const push = run("git", ["push", "-u", "origin", branch]);
  if (!push.ok) {
    throw new Error(`git push failed: ${push.combined}`);
  }

  console.log("Push complete.");
  return { pushed: true, branch };
}

export async function setupGitHub(options = {}) {
  const flags = { ...parseArgs(process.argv.slice(2)), ...options };
  const repo = flags.repo || defaultRepoName();
  const token = ensureRailwayToken();
  ensureGh();

  console.log(`GitHub setup for ${repo} (Railway: ${PRODUCTION.railway.serviceName})`);

  if (repoExists(repo)) {
    console.log(`Repository ${repo} already exists.`);
    ensureRemote(repo, flags.dryRun);
  } else {
    console.log(`Creating repository ${repo}…`);
    const { repo: fullName } = createRepo(repo, flags.private, flags.dryRun);
    flags.repo = fullName;
  }

  setRailwaySecret(token, flags.dryRun);

  let pushResult = null;
  if (flags.push) {
    pushResult = pushToGitHub(flags.dryRun);
  } else {
    console.log("\nSkipping push (pass --push to push after committing).");
  }

  console.log("\nNext: push to main to trigger .github/workflows/deploy.yml");

  return {
    ok: true,
    repo: flags.repo || repo,
    push: pushResult,
  };
}

const isMain =
  process.argv[1]?.replace(/\\/g, "/").endsWith("github-setup.mjs") ?? false;

if (isMain) {
  loadDotEnv();
  setupGitHub()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    });
}

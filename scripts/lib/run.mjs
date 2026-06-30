import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

export function commandExists(cmd) {
  const checker = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checker, [cmd], { encoding: "utf8", shell: true });
  return result.status === 0;
}

export function run(cmd, args = [], options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: true,
    env: { ...process.env, ...options.env },
    cwd: options.cwd,
  });

  const stdout = (result.stdout ?? "").trim();
  const stderr = (result.stderr ?? "").trim();

  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout,
    stderr,
    combined: [stdout, stderr].filter(Boolean).join("\n"),
  };
}

export function tryParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Load KEY=VALUE lines from .env into process.env when unset (no secrets logged). */
export function loadDotEnv(path = ".env") {
  try {
    if (!existsSync(path)) return;
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
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional convenience only
  }
}

import { Pool } from "pg";

export type ChatMessageRecord = {
  message: string;
  name?: string;
  email?: string;
  referrer?: string;
  followUpExpected: boolean;
  moderated?: boolean;
};

let pool: Pool | null = null;
let tableReady: Promise<boolean> | null = null;

function getConnectionString(): string | undefined {
  return process.env.DATABASE_URL?.trim() || undefined;
}

function getPool(): Pool | null {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    const useSsl =
      process.env.NODE_ENV === "production" &&
      !connectionString.includes("localhost") &&
      !connectionString.includes("127.0.0.1");

    pool = new Pool({
      connectionString,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
  }

  return pool;
}

async function ensureTable(): Promise<boolean> {
  const db = getPool();
  if (!db) {
    console.warn(
      "[chat] DATABASE_URL not set — messages will not be stored in Postgres",
    );
    return false;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT,
      email TEXT,
      message TEXT NOT NULL,
      referrer TEXT,
      follow_up_expected BOOLEAN NOT NULL DEFAULT false,
      moderated BOOLEAN NOT NULL DEFAULT false
    )
  `);

  return true;
}

async function isTableReady(): Promise<boolean> {
  if (!getConnectionString()) {
    console.warn(
      "[chat] DATABASE_URL not set — messages will not be stored in Postgres",
    );
    return false;
  }

  if (!tableReady) {
    tableReady = ensureTable().catch((err) => {
      tableReady = null;
      throw err;
    });
  }

  return tableReady;
}

export async function saveChatMessage(
  record: ChatMessageRecord,
): Promise<{ saved: boolean; error?: string }> {
  try {
    const ready = await isTableReady();
    if (!ready) {
      return { saved: false, error: "database_not_configured" };
    }

    const db = getPool();
    if (!db) {
      return { saved: false, error: "database_not_configured" };
    }

    await db.query(
      `INSERT INTO chat_messages
        (name, email, message, referrer, follow_up_expected, moderated)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        record.name ?? null,
        record.email ?? null,
        record.message,
        record.referrer ?? null,
        record.followUpExpected,
        record.moderated ?? false,
      ],
    );

    return { saved: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    console.error("[chat] failed to save message:", message);
    return { saved: false, error: message };
  }
}

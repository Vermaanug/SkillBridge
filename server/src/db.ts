import neo4j, { Driver, Session } from "neo4j-driver";
import "dotenv/config";

const { COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD } = process.env;
if (!COGNODB_URI || !COGNODB_USER || !COGNODB_PASSWORD) {
  // Fail loudly at boot rather than on the first request — easier to diagnose.
  console.error(
    "[db] Missing CognoDB connection env vars. Copy .env.example to .env and fill in " +
      "COGNODB_URI, COGNODB_USER and COGNODB_PASSWORD from console.cognodb.com.",
  );
}

let driver: Driver | null = null;

/** Lazily creates (once) and returns the shared driver instance. */
export function getDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      COGNODB_URI as string,
      neo4j.auth.basic(COGNODB_USER as string, COGNODB_PASSWORD as string),
      { maxConnectionPoolSize: 20 },
    );
  }
  return driver;
}

/** Verifies connectivity once at startup so the server logs a clear error instead of hanging. */
export async function verifyConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    await getDriver().verifyConnectivity();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Runs a single Cypher statement inside a managed session and closes the
 * session afterwards. Every query in this app goes through here so we never
 * forget to close a session or leave a leaked connection behind.
 */
export async function runQuery<T = Record<string, unknown>>(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const session: Session = getDriver().session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

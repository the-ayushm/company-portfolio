import type { PoolConfig } from "pg";

/**
 * Builds the pg connection config, enabling TLS for hosted Postgres
 * (Supabase, Render, Neon, …) and leaving local Docker unencrypted.
 *
 * Shared by the runtime client (src/lib/db/prisma.ts) and the CLI scripts
 * (prisma/seed.ts, scripts/create-admin.ts) so they behave identically.
 * Not marked "server-only" so the tsx scripts can import it.
 */
export function pgConfig(connectionString: string): PoolConfig {
  const isLocal =
    /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(connectionString) || /[?&]sslmode=disable/.test(connectionString);
  return {
    connectionString,
    // `require` encrypts without verifying the CA chain — fine for managed providers
    // and avoids bundling each provider's root certificate.
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
  };
}

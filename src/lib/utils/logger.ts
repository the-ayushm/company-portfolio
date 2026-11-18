type Level = "info" | "warn" | "error";

/** Minimal structured logger (JSON in production, readable in dev). */
function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  const entry = { level, msg, time: new Date().toISOString(), ...meta };
  const line = process.env.NODE_ENV === "production" ? JSON.stringify(entry) : `[${level}] ${msg}`;
  const extra = process.env.NODE_ENV === "production" ? [] : meta ? [meta] : [];
  if (level === "error") console.error(line, ...extra);
  else if (level === "warn") console.warn(line, ...extra);
  else console.info(line, ...extra);
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta),
};

export function errorMeta(err: unknown): Record<string, unknown> {
  if (err instanceof Error) return { error: err.message, name: err.name };
  return { error: String(err) };
}

import "server-only";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Local-disk image storage for admin uploads.
 * Files are written to UPLOAD_DIR (default ./storage/uploads) and served by
 * /uploads/[...path]. For serverless hosting, replace saveImage/readImage
 * with an object store (S3, R2, …) — callers only depend on the returned URL.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/png": { ext: "png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/webp": { ext: "webp", magic: (b) => b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" },
  "image/gif": { ext: "gif", magic: (b) => b.toString("ascii", 0, 3) === "GIF" },
  "image/avif": { ext: "avif", magic: (b) => b.toString("ascii", 4, 12).startsWith("ftypavi") },
};

export const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export function uploadDir(): string {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.UPLOAD_DIR || "storage/uploads");
}

export class UploadError extends Error {}

export async function saveImage(file: File): Promise<{ url: string; bytes: number }> {
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 5 MB or smaller.");
  const type = TYPES[file.type];
  if (!type) throw new UploadError("Only PNG, JPEG, WebP, GIF or AVIF images are allowed.");

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!type.magic(buffer)) throw new UploadError("The file content does not match its image type.");

  const now = new Date();
  const sub = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const name = `${randomUUID()}.${type.ext}`;
  const dir = path.join(uploadDir(), sub);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer, { flag: "wx" });
  return { url: `/uploads/${sub}/${name}`, bytes: buffer.length };
}

/** Resolves a public /uploads path to a file, refusing anything outside UPLOAD_DIR. */
export async function readImage(segments: string[]): Promise<{ data: Buffer; mime: string } | null> {
  if (segments.some((s) => !/^[\w\-.]+$/.test(s) || s === ".." || s === ".")) return null;
  const base = uploadDir();
  const full = path.resolve(base, ...segments);
  if (!full.startsWith(base + path.sep)) return null;
  const ext = path.extname(full).slice(1).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return null;
  try {
    const s = await stat(full);
    if (!s.isFile()) return null;
    return { data: await readFile(full), mime };
  } catch {
    return null;
  }
}

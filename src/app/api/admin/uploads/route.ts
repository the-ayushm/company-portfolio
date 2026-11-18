import { NextResponse } from "next/server";
import { jsonError, withAdmin } from "@/lib/api/http";
import { MAX_UPLOAD_BYTES, saveImage, UploadError } from "@/lib/uploads/storage";

/** POST /api/admin/uploads — multipart/form-data with a single `file` field. Returns { url, bytes }. */
export const POST = withAdmin(async (req) => {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_UPLOAD_BYTES + 64_000) return jsonError(413, "PAYLOAD_TOO_LARGE", "Images must be 5 MB or smaller.");
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return jsonError(400, "NO_FILE", "Attach an image in the `file` field.");
  try {
    const saved = await saveImage(file);
    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) return jsonError(400, "INVALID_FILE", err.message);
    throw err;
  }
});

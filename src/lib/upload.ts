import { put } from '@vercel/blob';
import crypto from 'crypto';

// Allowed image MIME types (both declared and detected via magic bytes)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type AllowedType = typeof ALLOWED_TYPES[number];

// Maximum upload size: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Magic byte signatures for each allowed type
const MAGIC_BYTES: Record<AllowedType, { bytes: number[]; offset?: number }[]> = {
  'image/jpeg': [{ bytes: [0xff, 0xd8, 0xff] }],
  'image/png':  [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  'image/webp': [{ bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }],
  'image/gif':  [
    { bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] },
    { bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] },
  ],
};

// Map detected MIME type to a safe file extension
const MIME_TO_EXT: Record<AllowedType, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
};

/**
 * Validates an uploaded file against:
 *   1. File size (max 5 MB)
 *   2. Declared MIME type (must be an allowed image type)
 *   3. Magic bytes (actual file content must match the declared type)
 *
 * Returns the validated buffer and a safe file extension, or throws on failure.
 */
function validateImageFile(file: File, buffer: Buffer): { ext: string } {
  // 1. Size check
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
  }

  // 2. Declared MIME type check
  const declaredType = file.type as AllowedType;
  if (!ALLOWED_TYPES.includes(declaredType)) {
    throw new Error(
      `Invalid file type "${file.type}". Only JPEG, PNG, WebP, and GIF images are allowed.`
    );
  }

  // 3. Magic bytes check — prevents Content-Type spoofing
  const signatures = MAGIC_BYTES[declaredType];
  const isValid = signatures.some((sig) => {
    const offset = sig.offset ?? 0;
    return sig.bytes.every((byte, i) => buffer[offset + i] === byte);
  });

  if (!isValid) {
    throw new Error(
      'File content does not match its declared type. The upload has been rejected.'
    );
  }

  return { ext: MIME_TO_EXT[declaredType] };
}

/**
 * Saves a validated image file to Vercel Blob and returns
 * its public URL path.
 *
 * Uses a cryptographically random UUID filename — never the original filename —
 * which prevents path traversal attacks and filename collisions.
 */
export async function saveImageFile(file: File, subDir: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate before uploading
  const { ext } = validateImageFile(file, buffer);

  // Safe filename: timestamp + UUID — no user-controlled characters
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const blobPath = `images/${subDir}/${filename}`;

  const blob = await put(blobPath, buffer, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

/**
 * Standard image upload handler for form actions.
 *
 * - If a real image file was uploaded, validates and saves it, then returns its public path.
 * - If no file was uploaded, falls back to the hidden `existingPathKey` field (current stored path).
 * - Returns `null` if truly nothing is available.
 */
export async function processImageUpload(
  formData: FormData,
  subDir: string,
  fileKey: string = 'imageFile',
  existingPathKey: string = 'imagePath'
): Promise<string | null> {
  const imageFile = formData.get(fileKey) as File | null;

  if (imageFile && imageFile.size > 0) {
    return saveImageFile(imageFile, subDir);
  }

  const existingPath = (formData.get(existingPathKey) as string | null)?.trim() ?? '';
  return existingPath || null;
}

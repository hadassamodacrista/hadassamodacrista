export const ADMIN_COOKIE_NAME = "hadassa_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (const b of buf) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const str = atob(padded + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS });
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  const payloadB64 = base64url(enc.encode(payload));
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  return `${payloadB64}.${base64url(sig)}`;
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  try {
    const key = await hmacKey(secret);
    const enc = new TextEncoder();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(sigB64),
      enc.encode(payloadB64)
    );
    if (!valid) return false;
    const payload = JSON.parse(new TextDecoder().decode(base64urlToBytes(payloadB64)));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

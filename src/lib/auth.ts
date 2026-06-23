import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "kwest_secret_key_2026_vault_circle";

// ─── Password Hashing (PBKDF2-SHA512) ─────────────────────────────
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === originalHash;
  } catch {
    return false;
  }
}

// ─── Native JWT (HMAC-SHA256) ────────────────────────────────────
function base64url(buf: Buffer): string {
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export function signToken(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerStr = base64url(Buffer.from(JSON.stringify(header)));
  const payloadStr = base64url(Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })));

  const signature = crypto.createHmac("sha256", JWT_SECRET)
    .update(`${headerStr}.${payloadStr}`)
    .digest();

  return `${headerStr}.${payloadStr}.${base64url(signature)}`;
}

export function verifyToken(token: string): any | null {
  try {
    const [headerStr, payloadStr, signatureStr] = token.split(".");
    if (!headerStr || !payloadStr || !signatureStr) return null;

    const expectedSignature = base64url(
      crypto.createHmac("sha256", JWT_SECRET)
        .update(`${headerStr}.${payloadStr}`)
        .digest()
    );

    if (expectedSignature !== signatureStr) return null;

    const payload = JSON.parse(base64urlDecode(payloadStr));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }

    return payload;
  } catch {
    return null;
  }
}

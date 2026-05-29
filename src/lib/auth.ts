import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE  = "hentak_admin";
const secret  = () => new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "hentak-fallback-secret-change-this"
);

export async function createSession(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function verifyRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export { COOKIE };

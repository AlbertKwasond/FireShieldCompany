import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getJwtKey() {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'The application cannot start without a secure session key.'
    );
  }
  return new TextEncoder().encode(secretKey);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  pending2FA?: boolean;
  tempSecret?: string;
}

export async function encrypt(payload: SessionPayload, expiresIn: string = '24h') {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtKey());
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, getJwtKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie || '');

  if (!session?.userId) {
    return null;
  }

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

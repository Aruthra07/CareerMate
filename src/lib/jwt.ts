import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'careermate-super-secret-key-change-in-production-12345'
);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function signJWT(payload: JWTPayload, expiresIn = '7d'): Promise<string> {
  const expiration = new Date();
  if (expiresIn.endsWith('d')) {
    expiration.setDate(expiration.getDate() + parseInt(expiresIn));
  } else if (expiresIn.endsWith('h')) {
    expiration.setHours(expiration.getHours() + parseInt(expiresIn));
  } else {
    expiration.setDate(expiration.getDate() + 7); // Default 7 days
  }

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiration.getTime() / 1000))
    .sign(SECRET_KEY);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

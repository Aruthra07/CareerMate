import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';
import { signJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token: googleToken, email, name } = body;

    const mockEmail = email || 'google-user@example.com';
    const mockName = name || 'Google User';

    let user: any;

    try {
      user = await prisma.user.upsert({
        where: { email: mockEmail },
        update: { name: mockName },
        create: {
          email: mockEmail,
          passwordHash: 'google-oauth-external-hashed',
          name: mockName,
          role: 'USER',
        },
      });
    } catch (e) {
      console.warn('DB fail, writing google login to memory');
      const exists = mockDbStore.users.find(u => u.email === mockEmail);
      if (exists) {
        user = exists;
      } else {
        user = {
          id: 'mock-google-' + Math.random().toString(36).substring(2, 9),
          email: mockEmail,
          name: mockName,
          role: 'USER',
        };
        mockDbStore.users.push(user);
      }
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (err: any) {
    return NextResponse.json({ error: 'Google auth failed', details: err.message }, { status: 500 });
  }
}

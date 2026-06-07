import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';
import { signJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
    }

    // --- REGISTER ACTION ---
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Missing registration details' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser: any;

      try {
        // Attempt database write
        newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase().trim(),
            passwordHash: hashedPassword,
            name: name.trim(),
            role: email.includes('admin') ? 'ADMIN' : 'USER',
          },
        });
      } catch (dbErr) {
        // Fallback: Store in mock memory
        console.warn('Database error, register writing to mock store', dbErr);
        
        // Check if user already exists in mock
        const exists = mockDbStore.users.find(u => u.email === email.toLowerCase().trim());
        if (exists) {
          return NextResponse.json({ error: 'User already exists (mock store)' }, { status: 400 });
        }

        newUser = {
          id: 'mock-' + Math.random().toString(36).substring(2, 9),
          email: email.toLowerCase().trim(),
          name: name.trim(),
          role: email.includes('admin') ? 'ADMIN' : 'USER',
          lang: 'EN',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockDbStore.users.push({ ...newUser, passwordHash: hashedPassword });
      }

      // Generate JWT session token
      const token = await signJWT({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      });

      // Set cookie securely
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    // --- LOGIN ACTION ---
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Missing login credentials' }, { status: 400 });
      }

      let user: any = null;
      let passwordMatches = false;

      try {
        // Find user in database
        user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (user) {
          passwordMatches = await bcrypt.compare(password, user.passwordHash);
        }
      } catch (dbErr) {
        // Fallback: Retrieve user from mock store
        console.warn('Database error, login reading from mock store', dbErr);
        user = mockDbStore.users.find(u => u.email === email.toLowerCase().trim());
        if (user) {
          passwordMatches = await bcrypt.compare(password, user.passwordHash);
        }
      }

      if (!user || !passwordMatches) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Generate JWT session token
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

      // Set cookie securely
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // --- LOGOUT ACTION ---
    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    console.error('Auth API Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

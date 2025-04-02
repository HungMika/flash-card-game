// frontend/middleware.ts
import { getCurrUser } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  // 🟢 Nếu không có accessToken -> Chuyển về /auth
  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const userData = await getCurrUser();

    if (!userData) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (request.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error verifying accessToken:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};

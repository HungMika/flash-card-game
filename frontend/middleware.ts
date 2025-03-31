import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  if (!accessToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken.value}` },
        credentials: 'include',
      },
    );

    if (!apiResponse.ok) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  } catch (error) {
    console.error('Error verifying accessToken:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

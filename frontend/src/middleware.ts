// frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard']; // bạn có thể thêm route khác nếu muốn

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const currentPath = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // 🔒 Nếu chưa có token và vào trang cần bảo vệ → chuyển về /auth
  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 🔁 Nếu đã có token mà vào /auth → chuyển về dashboard
  if (accessToken && currentPath === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'], // middleware chỉ áp cho đúng các route cần
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/features/dashboard/components/header';
import { useAuthStore } from '@/services/auth-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem('auth-user'); // Vì bạn dùng Zustand persist
      if (!localUser || !JSON.parse(localUser).state.user) {
        router.push('/auth'); // Không có user => redirect auth
      }
    }
  }, [user, router]);

  if (!user) {
    return null; // Hoặc loading spinner
  }

  return (
    <div>
      <DashboardHeader />
      {children}
    </div>
  );
}

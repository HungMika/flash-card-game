'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const RequireAuthentication = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('auth-user');
      if (!storedAuth) {
        router.push('/auth');
        return;
      }

      try {
        const parsed = JSON.parse(storedAuth);
        if (!parsed?.state?.user) {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Failed to parse auth-user from localStorage', error);
        router.push('/auth');
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  return <>{children}</>;
};

'use client';

import { Button } from '@/components/ui/button';
import { getUser, removeUser } from '@/lib/storage';
import { logoutUser } from '@/lib/auth-log-out';
import { logOut } from '@/services/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
}

export const DashboardHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currUser = getUser();
    if (!currUser) {
      console.error('User not found');
      //logOut();
    } else {
      setUser(currUser);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await logOut();
      removeUser();
      router.replace('/auth');
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold">Chào mừng, {user.username}!</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <Button variant="outline" onClick={handleLogOut}>
        Đăng xuất
      </Button>
    </header>
  );
};

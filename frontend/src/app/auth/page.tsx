'use client';

import { AuthScreen } from '@/features/auth/components/auth-screen';
import { useAuthRedirect } from '@/hooks/auth-require';

const AuthPage = () => {
  const { user, hasHydrated } = useAuthRedirect({
    redirectIfFound: true,
    redirectTo: '/dashboard',
  });

  if (!hasHydrated) {
    return null;
  }

  if (user) {
    return null;
  }

  return <AuthScreen />;
};

export default AuthPage;

// frontend/src/features/auth/components/auth-screen.tsx
'use client';

import React, { useState, useEffect } from 'react';

import { SignInflow } from '../api/auth-types';

import { SignInCard } from './sign-in-card';
import { SignUpCard } from './sign-up-card';
import { ForgotPasswordCard } from './forgot-password-card';

import { useRouter } from 'next/navigation';
import { getCurrUser } from '@/services/user';

export const AuthScreen = () => {
  const [state, setState] = useState<SignInflow>('SignIn');
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const userData = await getCurrUser();
        if (userData) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    checkUser();
  }, []);

  return (
    <div className="h-full flex items-center justify-center bg-blue-400">
      <div className="md:h-auto md:w-[420px]">
        {state === 'SignIn' && <SignInCard setstate={setState} />}
        {state === 'SignUp' && <SignUpCard setstate={setState} />}
        {state === 'ForgotPassword' && (
          <ForgotPasswordCard setstate={setState} />
        )}
      </div>
    </div>
  );
};

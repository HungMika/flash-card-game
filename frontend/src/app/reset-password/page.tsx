// frontend/src/features/auth/components/ResetPasswordCard.tsx
'use client';

import React, { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/services/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  console.log('render reset password');

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!newPassword || !confirmPassword) {
      return setError('Please enter all required information!');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match!');
    }

    try {
      setPending(true);
      await resetPassword(token || '', newPassword);
      toast.success('Password reset successfully!');
      router.push('/auth');
    } catch (error) {
      setError('Failed to reset password!');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300 p-4">
      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            ref={newPasswordRef}
            className="w-full p-2 pr-10 border rounded-md"
          />
          <div
            onClick={toggleShowPassword}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            ref={confirmPasswordRef}
            className="w-full p-2 pr-10 border rounded-md"
          />
          <div
            onClick={toggleShowConfirmPassword}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {pending ? 'Processing...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}

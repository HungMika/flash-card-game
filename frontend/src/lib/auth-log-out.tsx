'use client';

import { logOut } from '@/services/auth';
import { removeUser } from './storage';

export async function logoutUser() {
  try {
    await logOut();
    removeUser();
  } catch (error) {
    console.error('Logout failed', error);
  }
}

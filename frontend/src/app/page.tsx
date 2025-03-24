import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken');

  if (!accessToken) {
    redirect('/auth');
  }

  redirect('/dashboard');
}
//frontend\src\app\auth\page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { safeParseJsonCookie } from '@/lib/auth/cookies';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hayagriva_admin_token')?.value;
  const userCookie = cookieStore.get('hayagriva_user')?.value;

  if (!token && !userCookie) {
    redirect('/login');
  }

  const user = safeParseJsonCookie(userCookie);

  if (user?.role === 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  redirect('/hub');
}

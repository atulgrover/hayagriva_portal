// admin-panel/src/app/register/page.tsx
import { redirect } from 'next/navigation';

export default function RegisterRedirectPage() {
  redirect('/login?tab=register');
}

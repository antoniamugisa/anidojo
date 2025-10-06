import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect users to the auth page when they visit the site
  redirect('/auth');
}

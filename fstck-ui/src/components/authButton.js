'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading…</p>;
  if (session) {
    return (
      <div className="flex flex-shrink-0 items-center">
        <p className="mr-4">Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return <button onClick={() => signIn('google')}>Sign in</button>;
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ensureAccountWithWorkspace, signIn } from '../auth-store';

export default function SetupSalimAccountPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Creating Posterly account...');

  useEffect(() => {
    try {
      ensureAccountWithWorkspace(
        'SALIM KARAKKAD',
        'salimkrd01@gmail.com',
        '12345678',
      );
      signIn('salimkrd01@gmail.com', '12345678');
      setMessage('Account created. Redirecting to dashboard...');
      router.replace('/dashboard');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Account setup failed.');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-6 text-[#05081f]">
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <img
          src="/posterly_simple_logo_transparent.svg"
          alt=""
          className="mx-auto h-12 w-12"
        />
        <h1 className="mt-4 text-xl font-black">Posterly Account Setup</h1>
        <p className="mt-3 text-slate-600">{message}</p>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { signUp } from '../auth-store';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please complete all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      signUp(name, email, password);
      router.push('/dashboard');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Signup failed.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef0f3] px-6 text-[#050b22]">
      <section className="w-full max-w-[420px]">
        <AuthLogo />

        <form onSubmit={handleSubmit} className="mt-10 rounded-xl border border-slate-300/80 bg-white p-7 shadow-md shadow-slate-300/60">
          <h1 className="text-2xl font-black">Create account</h1>
          <p className="mt-3 text-base text-slate-500">
            Sign up to start creating result posters
          </p>
          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

          <div className="mt-10 space-y-4">
            <AuthInput name="name" label="Name" placeholder="Enter your name" type="text" />
            <AuthInput name="email" label="Email" placeholder="Enter your email" type="email" />
            <AuthInput name="password" label="Password" placeholder="Enter your password" type="password" />
            <AuthInput name="confirmPassword" label="Confirm Password" placeholder="Confirm your password" type="password" />
          </div>

          <button type="submit" className="mt-5 w-full rounded-lg bg-[#4338ff] px-4 py-3 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
            Create Account
          </button>

          <div className="mt-7 border-t border-slate-300 pt-7 text-center text-lg text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#4338ff]">
              Sign in here
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

function AuthInput({ name, label, placeholder, type }: { name: string; label: string; placeholder: string; type: string }) {
  return (
    <label className="block">
      <span className="text-base font-medium">{label}</span>
      <input name={name} type={type} placeholder={placeholder} className="mt-2 h-10 w-full rounded-md border border-slate-300 px-4 text-base outline-none transition placeholder:text-slate-500 focus:border-[#4338ff] focus:ring-2 focus:ring-[#4338ff]/15" />
    </label>
  );
}

function AuthLogo() {
  return (
    <Link href="/" className="mx-auto flex w-fit items-center gap-3">
      <img src="/posterly_simple_logo_transparent.svg" alt="" className="h-10 w-10" />
      <span className="flex items-baseline text-2xl font-black tracking-[-0.02em]">
        Poster<span className="text-[#4338ff]">ly</span>
      </span>
    </Link>
  );
}

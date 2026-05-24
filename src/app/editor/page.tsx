'use client';

import Link from 'next/link';
import { Download, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

const initialPoster = {
  title: 'Design Summit 2026',
  subtitle: 'Ideas, craft, and creative systems',
  date: 'June 18, 2026',
  venue: 'Main Hall',
};

export default function EditorPage() {
  const [poster, setPoster] = useState(initialPoster);
  const [theme, setTheme] = useState('blue');

  const themeClass = useMemo(() => {
    if (theme === 'navy') return 'from-[#050b22] via-[#171d3a] to-[#352bff]';
    if (theme === 'soft') return 'from-[#f4f3ff] via-[#6f68ff] to-[#352bff]';
    return 'from-[#4637ff] via-[#352bff] to-[#050b22]';
  }, [theme]);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-6 py-8 text-[#050b22]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[360px_1fr]">
        <aside>
          <nav className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-lg font-black">
              Poster<span className="text-[#352bff]">ly</span>
            </Link>
            <Link href="/templates" className="text-sm font-bold text-[#352bff]">
              Templates
            </Link>
          </nav>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-indigo-100">
            <h1 className="text-2xl font-black">Poster editor</h1>
            <div className="mt-5 space-y-4">
              {Object.entries(poster).map(([key, value]) => (
                <label key={key} className="block">
                  <span className="text-sm font-semibold capitalize text-slate-600">
                    {key}
                  </span>
                  <input
                    value={value}
                    onChange={(event) =>
                      setPoster((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#352bff] focus:ring-2 focus:ring-[#352bff]/15"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-600">Theme</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {['blue', 'navy', 'soft'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTheme(item)}
                    className={`rounded-md border px-3 py-2 text-sm capitalize ${
                      theme === item
                        ? 'border-[#352bff] bg-[#352bff] text-white'
                        : 'border-slate-200 bg-white text-[#050b22]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPoster(initialPoster)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-[#f4f3ff]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-md bg-[#352bff] px-4 py-2 text-sm font-bold text-white hover:bg-[#271dff]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export
              </button>
            </div>
          </div>
        </aside>

        <section className="flex min-h-[720px] items-center justify-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-indigo-100">
          <div className={`flex aspect-[4/5] w-full max-w-lg flex-col justify-between bg-gradient-to-br ${themeClass} p-10 text-white shadow-2xl shadow-indigo-200`}>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/75">
                {poster.subtitle}
              </p>
              <h2 className="mt-8 text-5xl font-black leading-tight">
                {poster.title}
              </h2>
            </div>
            <div className="border-t border-white/30 pt-6">
              <p className="text-2xl font-bold">{poster.date}</p>
              <p className="mt-2 text-lg text-white/80">{poster.venue}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

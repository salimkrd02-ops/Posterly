'use client';

import { ImageIcon, Plus } from 'lucide-react';
import { DashboardShell } from '../components';
import { useActiveEvent } from '../use-active-event';

export default function DashboardTemplatesPage() {
  const { activeEvent, ready } = useActiveEvent();

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="PROGRAM POSTERS:Templates"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="PROGRAM POSTERS:Templates">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Poster Templates</h1>
            <p className="mt-2 text-sm text-slate-600">
              Design and manage reusable poster templates for {activeEvent.name}
            </p>
          </header>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <button className="flex min-h-10 w-full min-w-[210px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto">
              <Plus className="h-4 w-4" />
              Create New Template
            </button>
            <button className="flex min-h-10 w-full min-w-[230px] items-center justify-center whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto">
              Explore Public Templates
            </button>
          </div>
        </div>

        <section className="flex min-h-[420px] items-center justify-center pt-10 text-center">
          <div>
            <ImageIcon className="mx-auto h-16 w-16 text-slate-500" strokeWidth={1.8} />
            <h2 className="mt-5 text-xl font-medium text-[#05081f]">
              No templates found
            </h2>
            <p className="mt-4 text-sm text-slate-600">
              Get started by creating your first poster template!
            </p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

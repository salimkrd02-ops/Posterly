'use client';

import { FileText, Plus } from 'lucide-react';
import { DashboardShell } from '../components';
import { useActiveEvent } from '../use-active-event';

export default function TeamStatusTemplatesPage() {
  const { activeEvent, ready } = useActiveEvent();

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="TEAM STATUS:Templates"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="TEAM STATUS:Templates">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">
              Team Status Templates for {activeEvent.name}
            </h1>
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/60">
              <FileText className="h-7 w-7 text-slate-500" />
            </div>
            <h2 className="mt-5 text-xl font-black">
              No Team Status Templates Yet
            </h2>
            <p className="mt-4 text-base text-slate-600">
              You haven&apos;t created any team status templates yet. Get started by creating your first one!
            </p>
            <button className="mt-7 rounded-lg bg-[#4338ff] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
              Create Your First Template
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

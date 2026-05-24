'use client';

import { CirclePlus, ImageIcon } from 'lucide-react';
import { DashboardShell } from '../components';
import { useActiveEvent } from '../use-active-event';

export default function FramedPostsPage() {
  const { activeEvent, ready } = useActiveEvent();

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="FRAMED POSTS:Templates"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="FRAMED POSTS:Templates">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Framed Post Templates</h1>
            <p className="mt-2 text-sm text-slate-600">{activeEvent.name}</p>
          </header>

          <button className="flex min-h-10 w-full min-w-[150px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto">
            <CirclePlus className="h-4 w-4" />
            Create New
          </button>
        </div>

        <section className="flex min-h-[420px] items-center justify-center pt-10 text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/60">
              <ImageIcon className="h-7 w-7 text-slate-500" />
            </div>
            <h2 className="mt-5 text-xl font-black text-[#05081f]">
              No Framed Post Templates Yet
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Start by creating your first framed post template.
            </p>
            <button className="mt-7 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4338ff] px-5 py-3 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
              <CirclePlus className="h-4 w-4" />
              Create New Template
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

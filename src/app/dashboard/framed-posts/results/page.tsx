'use client';

import { ImageIcon, Plus } from 'lucide-react';
import { DashboardShell } from '../../components';
import { useActiveEvent } from '../../use-active-event';

export default function FramedPostResultsPage() {
  const { activeEvent, ready } = useActiveEvent();

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="FRAMED POSTS:My Posts"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="FRAMED POSTS:My Posts">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Manage Framed Posts</h1>
            <p className="mt-3 text-xl text-slate-600">
              View, create, edit, and generate framed posts for event:{' '}
              <span className="font-bold">{activeEvent.name}</span>
            </p>
          </header>

          <button className="flex min-h-10 w-full min-w-[240px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto">
            <Plus className="h-4 w-4" />
            Create New Framed Post
          </button>
        </div>

        <section className="mt-9 rounded-xl border border-slate-300 bg-white p-6 shadow-sm shadow-slate-300/60">
          <div className="grid gap-4 lg:grid-cols-[1fr_170px_170px]">
            <input
              placeholder="Search your framed posts..."
              className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#352bff] focus:ring-2 focus:ring-[#352bff]/15"
            />
            <select className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-600">
              <option>All Status</option>
            </select>
            <select className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-600">
              <option>Sort by Date</option>
            </select>
          </div>
        </section>

        <section className="flex min-h-[430px] items-center justify-center text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/60">
              <ImageIcon className="h-7 w-7 text-slate-500" />
            </div>
            <h2 className="mt-5 text-xl font-black">No Framed Posts Yet</h2>
            <p className="mt-4 text-base text-slate-600">
              You haven&apos;t created any framed posts yet. Get started by creating your first one!
            </p>
            <button className="mt-7 rounded-lg bg-[#4338ff] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
              Create Your First Framed Post
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

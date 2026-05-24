'use client';

import Link from 'next/link';
import {
  BarChart3,
  FileText,
  ImageIcon,
  KeyRound,
  Tags,
  UsersRound,
} from 'lucide-react';
import { DashboardShell } from './components';
import { getCategories, getTeams } from './event-store';
import { useActiveEvent } from './use-active-event';
import { getCurrentUser } from '../auth-store';

export default function DashboardPage() {
  const { activeEvent, ready } = useActiveEvent({ redirect: false });

  if (!ready) return null;

  const currentUser = getCurrentUser();
  const displayName = currentUser?.name || currentUser?.email || 'user@gmail.com';
  const eventTeams = activeEvent
    ? getTeams().filter((team) => team.eventId === activeEvent.id)
    : [];
  const eventCategories = activeEvent
    ? getCategories().filter((category) => category.eventId === activeEvent.id)
    : [];
  const cards = [
    {
      icon: FileText,
      title: 'Program Templates',
      value: '0',
      text: 'Total program poster templates',
      link: 'View Templates',
    },
    {
      icon: BarChart3,
      title: 'Program Results',
      value: '0',
      text: 'Total program poster results',
      link: 'View Results',
    },
    {
      icon: KeyRound,
      eyebrow: 'API Access',
      title: 'External Apps',
      text: 'Create event API keys for result ingestion and poster generation',
      link: 'Open Integrations',
    },
    {
      icon: UsersRound,
      title: 'Team Status Templates',
      value: '0',
      text: 'Total team status poster templates',
      link: 'View Team Templates',
    },
    {
      icon: BarChart3,
      title: 'Team Status Results',
      value: '0',
      text: 'Total team status poster results',
      link: 'View Team Results',
    },
    {
      icon: ImageIcon,
      title: 'Framed Post Templates',
      value: '0',
      text: 'Total framed post templates',
      link: 'View Framed Templates',
    },
    {
      icon: UsersRound,
      title: 'Teams',
      value: String(eventTeams.length),
      text: 'Total teams for the event',
      link: 'View Teams',
    },
    {
      icon: Tags,
      title: 'Categories',
      value: String(eventCategories.length),
      text: 'Total categories for the event',
      link: 'View Categories',
    },
  ];

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1640px]">
        <header>
          <h1 className="text-2xl font-black">Welcome, {displayName}!</h1>
            <h2 className="mt-5 text-2xl font-black text-[#4338ff]">
            Current Event: {activeEvent?.name ?? 'No event selected'}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {activeEvent
              ? 'Overview for the selected event.'
              : 'No events created yet. Create your first event to get started.'}
          </p>
          {!activeEvent ? (
            <Link
              href="/dashboard/events"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#4338ff] px-5 py-2 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]"
            >
              Create Event
            </Link>
          ) : null}
        </header>

        <section className="mt-9 grid gap-6 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="min-h-[170px] rounded-xl border border-slate-300 bg-white p-6 shadow-sm shadow-slate-300/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {card.eyebrow ? (
                      <p className="mb-8 text-base font-medium">{card.eyebrow}</p>
                    ) : (
                      <h3 className="text-base font-medium">{card.title}</h3>
                    )}
                  </div>
                  <Icon className="h-4 w-4 text-slate-500" />
                </div>

                {card.eyebrow ? (
                  <h3 className="text-2xl font-black">{card.title}</h3>
                ) : (
                  <p className="mt-9 text-2xl font-black">{card.value}</p>
                )}
                <p className="mt-1 text-sm text-slate-500">{card.text}</p>
                <Link href="#" className="mt-3 inline-block text-base font-medium text-[#4338ff]">
                  {card.link}
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </DashboardShell>
  );
}

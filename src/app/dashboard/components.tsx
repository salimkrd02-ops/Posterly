'use client';

import Link from 'next/link';
import { getCurrentUser, signOut } from '../auth-store';
import {
  BarChart3,
  Check,
  CalendarDays,
  FileText,
  Folder,
  ImageIcon,
  KeyRound,
  Layers3,
  LogOut,
  Medal,
  Trophy,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getActiveEventId,
  getCategories,
  getEvents,
  getTeams,
  setActiveEventId,
} from './event-store';

const navGroups = [
  {
    title: 'EVENT',
    items: [
      { icon: CalendarDays, label: 'Events', count: 1, href: '/dashboard/events' },
      { icon: KeyRound, label: 'Integrations', href: '#' },
      { icon: Trophy, label: 'Public Page', href: '#' },
      { icon: ImageIcon, label: 'Images', href: '#' },
    ],
  },
  {
    title: 'PROGRAM POSTERS',
    items: [
      { icon: FileText, label: 'Templates', count: 5, href: '/dashboard/templates' },
      { icon: BarChart3, label: 'Results', count: 1, href: '/dashboard/results' },
    ],
  },
  {
    title: 'TEAM STATUS',
    items: [
      { icon: Trophy, label: 'Templates', count: 2, href: '/dashboard/team-status-templates' },
      { icon: BarChart3, label: 'Results', href: '/dashboard/team-status-results' },
    ],
  },
  {
    title: 'FRAMED POSTS',
    items: [
      { icon: Layers3, label: 'Templates', count: 1, href: '/dashboard/framed-posts' },
      { icon: Layers3, label: 'My Posts', href: '/dashboard/framed-posts/results' },
    ],
  },
  {
    title: 'CERTIFICATES',
    items: [
      { icon: FileText, label: 'Templates', href: '/dashboard/certificate-templates' },
      { icon: Medal, label: 'Results', href: '/dashboard/certificate-results' },
    ],
  },
  {
    title: 'DATA',
    items: [
      { icon: UsersRound, label: 'Teams', count: 2, href: '/dashboard/teams' },
      { icon: Folder, label: 'Categories', count: 7, href: '/dashboard/categories' },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { icon: UserPlus, label: 'Team Members', href: '/dashboard/team-members' },
    ],
  },
];

export function DashboardShell({
  children,
  active = '',
}: {
  children: ReactNode;
  active?: string;
}) {
  const router = useRouter();
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [activeEventId, setActiveEventIdState] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [currentUserName, setCurrentUserName] = useState('User');
  const [currentUserEmail, setCurrentUserEmail] = useState('user@gmail.com');
  const [authReady, setAuthReady] = useState(false);
  const [eventMenuOpen, setEventMenuOpen] = useState(false);

  useEffect(() => {
    function syncSidebar() {
      const storedEvents = getEvents();
      const selectedEventId = getActiveEventId() ?? '';
      const user = getCurrentUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setAuthReady(true);
      const fallbackName = user?.email ? user.email.split('@')[0] : 'User';

      setEvents(storedEvents.map((event) => ({ id: event.id, name: event.name })));
      setActiveEventIdState(selectedEventId);
      setCurrentUserName(user?.name || fallbackName);
      setCurrentUserEmail(user?.email || 'user@gmail.com');
      setCounts({
        Events: storedEvents.length,
        'PROGRAM POSTERS:Templates': 0,
        'PROGRAM POSTERS:Results': 0,
        'TEAM STATUS:Templates': 0,
        'TEAM STATUS:Results': 0,
        'FRAMED POSTS:Templates': 0,
        'FRAMED POSTS:My Posts': 0,
        'CERTIFICATES:Templates': 0,
        'CERTIFICATES:Results': 0,
        'DATA:Teams': selectedEventId
          ? getTeams().filter((team) => team.eventId === selectedEventId).length
          : 0,
        'DATA:Categories': selectedEventId
          ? getCategories().filter((category) => category.eventId === selectedEventId).length
          : 0,
      });
    }

    syncSidebar();
    window.addEventListener('storage', syncSidebar);
    window.addEventListener('posterly:data-changed', syncSidebar);

    return () => {
      window.removeEventListener('storage', syncSidebar);
      window.removeEventListener('posterly:data-changed', syncSidebar);
    };
  }, [router]);

  function selectSidebarEvent(eventId: string) {
    setActiveEventId(eventId);
    setActiveEventIdState(eventId);
    window.dispatchEvent(new Event('posterly:data-changed'));
    window.location.reload();
  }

  if (!authReady) return null;

  return (
    <main className="min-h-screen bg-[#f3f4f7] text-[#050b22]">
      <aside className="fixed inset-y-0 left-0 hidden w-[242px] flex-col border-r border-slate-200 bg-white lg:flex">
        <Link href="/" className="flex h-[56px] items-center gap-3 border-b border-slate-200 px-4">
          <img src="/posterly_simple_logo_transparent.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-black">
            Poster<span className="text-[#352bff]">ly</span>
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Active Event
          </p>
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setEventMenuOpen((open) => !open)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-left text-sm text-slate-700 shadow-sm"
              aria-expanded={eventMenuOpen}
            >
              <span className="truncate">
                {events.find((event) => event.id === activeEventId)?.name ??
                  'Select event'}
              </span>
              <span className="text-slate-400">⌄</span>
            </button>
            {eventMenuOpen ? (
            <div className="absolute left-0 top-[42px] z-50 w-[310px] overflow-hidden rounded-md border border-slate-300 bg-white shadow-lg shadow-slate-300/60">
              {events.map((event) => {
                const selected = activeEventId === event.id;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      setEventMenuOpen(false);
                      selectSidebarEvent(event.id);
                    }}
                    className={`flex h-10 w-full items-center justify-between px-3 text-left text-sm ${
                      selected
                        ? 'bg-[#d9eddd] text-[#0b7a22]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{event.name}</span>
                    {selected ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
              {events.length === 0 ? (
                <Link
                  href="/dashboard/events"
                  className="block px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
                >
                  Create an event
                </Link>
              ) : null}
            </div>
            ) : null}
          </div>

          <nav className="mt-7 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {group.title}
                </p>
                <div className="mt-3 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      active === item.label || active === `${group.title}:${item.label}`;
                    return (
                      <Link
                        key={`${group.title}-${item.label}`}
                        href={item.href}
                        className={`flex h-9 items-center gap-3 rounded-md px-2 text-[15px] font-medium ${
                          isActive
                            ? 'bg-[#eeedff] text-[#4338ff]'
                            : 'text-slate-600 hover:bg-[#f4f3ff] hover:text-[#4338ff]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {typeof counts[`${group.title}:${item.label}`] === 'number' ||
                        typeof counts[item.label] === 'number' ? (
                          <span className="rounded-md bg-[#eeedff] px-2 py-0.5 text-xs font-bold text-[#4338ff]">
                            {counts[`${group.title}:${item.label}`] ?? counts[item.label] ?? 0}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eeedff] text-sm font-black text-[#4338ff]">
            {getInitials(currentUserName || currentUserEmail)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-5 text-[#05081f]">
              {currentUserName}
            </p>
            <p className="truncate text-xs leading-4 text-slate-500">
              {currentUserEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              window.location.href = '/login';
            }}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <section className="min-h-screen px-6 py-6 lg:ml-[242px]">{children}</section>
    </main>
  );
}

function getInitials(value: string) {
  const displayName = value.includes('@') ? value.split('@')[0] : value;
  const words = displayName.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  CheckCircle2,
  Menu,
  DatabaseZap,
  Download,
  FileImage,
  Grid2X2,
  ImageIcon,
  Layers3,
  LogOut,
  Palette,
  PencilLine,
  Settings2,
  Share2,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';
import type { ReactNode, SVGProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, signOut, UserRecord } from './auth-store';

const benefits = [
  'Save Countless Hours',
  'Professional Look, Zero Hassle',
  'Boost Audience Engagement',
  'No Design Degree Required',
  'Perfect for Any Event Type',
  'Centralized & Organized',
  'Consistent Branding',
  'Mobile-Friendly Access',
];

const steps = [
  {
    icon: Settings2,
    title: 'Setup Your Event',
    text: 'Create your event, then add relevant categories and participating teams. This organizes all your data.',
  },
  {
    icon: PencilLine,
    title: 'Design Templates',
    text: 'Craft beautiful, reusable poster templates for both program results and team standings using our visual editor.',
  },
  {
    icon: FileImage,
    title: 'Input Results Data',
    text: 'Quickly enter winner details and scores for programs, or team scores and title parts for status updates.',
  },
  {
    icon: ImageIcon,
    title: 'Generate & Share',
    text: 'Instantly produce professional posters from your templates and data. Download and share every achievement!',
  },
];

const features = [
  {
    icon: Layers3,
    title: 'Dual Poster Types',
    text: 'Generate beautiful posters for individual Program Results and comprehensive Team Standings or Point Statuses.',
  },
  {
    icon: PencilLine,
    title: 'Visual Template Editor',
    text: 'Craft pixel-perfect, reusable templates with an intuitive drag-and-drop interface. Customize fonts, colors, backgrounds, and layouts.',
  },
  {
    icon: Boxes,
    title: 'Event-Centric Workflow',
    text: 'Organize all your assets, templates, results data, teams, and categories under distinct events for streamlined management.',
  },
  {
    icon: DatabaseZap,
    title: 'Dynamic Data Integration',
    text: 'Seamlessly map your event data like names, scores, and categories directly into your poster designs for instant visuals.',
  },
  {
    icon: Palette,
    title: 'Rich Customization',
    text: 'Fine-tune every aspect of your poster with Google Fonts, custom colors, text alignment, background styles, and precise positioning.',
  },
  {
    icon: Share2,
    title: 'Instant Export & Sharing',
    text: 'Generate high-quality PNG images of your posters with a single click, perfectly optimized for print or sharing on social media.',
  },
];

const teamNames = ['Vadi Badr', 'Vadi Quba', 'Vadi Hasan'];

export default function HomePage() {
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [category, setCategory] = useState('Senior');
  const [winners, setWinners] = useState([
    { pos: '1', name: 'Yusuf Al-Andalusi', team: 'Vadi Badr' },
    { pos: '2', name: 'Fatima Al-Zahra', team: 'Vadi Quba' },
    { pos: '3', name: 'Ali Al-Farsi', team: 'Vadi Hasan' },
  ]);
  const [titleParts, setTitleParts] = useState(['Final', 'Point', 'Status']);
  const [scores, setScores] = useState([
    { team: 'Vadi Badr', score: '581' },
    { team: 'Vadi Quba', score: '579' },
    { team: 'Vadi Hasan', score: '580' },
  ]);
  const [frameImage, setFrameImage] = useState<string | null>(null);

  const standingsTitle = titleParts.filter(Boolean).join(' ');
  const sortedScores = useMemo(
    () => [...scores].sort((a, b) => Number(b.score) - Number(a.score)),
    [scores],
  );

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    signOut();
    setCurrentUser(null);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#050b22]">
      <nav className="hidden h-[92px] items-center justify-between border-b border-slate-200 bg-white/50 px-8 sm:px-16 md:flex">
        <Link href="/" className="flex items-center gap-3">
          <PosterlyLogo />
        </Link>
        {currentUser ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-5 rounded-md px-3 py-2 text-xl hover:bg-white"
              aria-expanded={accountOpen}
              aria-haspopup="menu"
            >
              <UserRound className="h-6 w-6" />
              <span>{currentUser.email}</span>
            </button>
            {accountOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-md border border-slate-200 bg-white text-base shadow-lg shadow-slate-300/50"
              >
                <div className="px-5 py-4 font-medium text-[#050b22]">
                  My Account
                </div>
                <Link
                  href="/dashboard"
                  role="menuitem"
                  className="flex items-center gap-4 border-t border-slate-200 px-5 py-4 font-medium hover:bg-slate-50"
                >
                  <Grid2X2 className="h-5 w-5 text-slate-500" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 border-t border-slate-200 px-5 py-4 text-left font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-5 text-lg">
            <Link href="/login" className="font-medium hover:text-[#3b32ff]">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-[#352bff] px-4 py-2 font-bold text-white shadow-sm hover:bg-[#271dff]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <PosterlyLogo compact />
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#05081f] hover:bg-[#f4f3ff]"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-[82vw] max-w-[340px] transform flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <PosterlyLogo compact />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#05081f] hover:bg-[#f4f3ff]"
            >
              Home
            </Link>
            {currentUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#05081f] hover:bg-[#f4f3ff]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#05081f] hover:bg-[#f4f3ff]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-[#05081f] hover:bg-[#f4f3ff]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          {currentUser ? (
            <div className="space-y-3">
              <p className="truncate text-sm font-medium text-slate-600">
                {currentUser.email}
              </p>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold text-[#05081f] hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold text-[#05081f] hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center md:min-h-[860px] md:px-6">
        <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-[#3b32ff]/25 bg-white px-4 py-3 text-base font-medium text-[#3b32ff] shadow-sm md:mb-12 md:px-6 md:text-xl">
          <Star className="h-5 w-5 text-[#352bff]" />
          Organize Everything by Event!
        </div>
        <h1 className="max-w-6xl text-4xl font-black leading-tight sm:text-6xl lg:text-8xl">
          Create Striking
          <span className="block bg-gradient-to-r from-[#4637ff] via-[#352bff] to-[#271dff] bg-clip-text text-transparent">
            Result Posters.
          </span>
          <span className="block text-3xl sm:text-5xl lg:text-6xl">
            Effortlessly. Instantly. <em>Beautifully.</em>
          </span>
        </h1>
        <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-600 sm:text-2xl sm:leading-10">
          Posterly is your ultimate platform for crafting professional posters
          for program winners and team standings. Convert data into captivating
          visuals with our intuitive, event-driven workflow.
        </p>
        <button
          type="button"
          onClick={() => router.push(currentUser ? '/dashboard' : '/login')}
          className="mt-10 flex min-h-12 w-full max-w-sm items-center justify-center gap-3 rounded-lg bg-[#4338ff] px-6 py-3 text-lg font-bold text-white shadow-lg shadow-indigo-900/15 hover:bg-[#372ee6] sm:mt-16 sm:inline-flex sm:w-auto sm:max-w-none sm:px-7 sm:py-4 sm:text-2xl"
        >
          <Boxes className="h-6 w-6" />
          Go to Dashboard
        </button>
      </section>

      <DemoHeader />
      <ProgramDemo
        category={category}
        setCategory={setCategory}
        winners={winners}
        setWinners={setWinners}
      />
      <TeamDemo
        titleParts={titleParts}
        setTitleParts={setTitleParts}
        scores={scores}
        setScores={setScores}
        standingsTitle={standingsTitle}
        sortedScores={sortedScores}
      />
      <FramedDemo frameImage={frameImage} setFrameImage={setFrameImage} />

      <section className="px-6 py-24">
        <SectionTitle
          title="Everything You Need, All in One Place"
          subtitle="Posterly simplifies poster creation with powerful, easy-to-use features."
        />
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg bg-white p-8 shadow-md shadow-indigo-100">
                <IconBadge icon={Icon} />
                <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                <p className="mt-4 text-lg leading-8 text-slate-600">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24">
        <SectionTitle
          title="Get Stunning Posters in 4 Simple Steps"
          subtitle="From setting up your event to sharing eye-catching results."
        />
        <div className="mx-auto mt-16 grid max-w-7xl gap-7 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="relative rounded-lg bg-white p-8 text-center shadow-md shadow-slate-200">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eeedff]">
                  <Icon className="h-9 w-9 text-[#3b32ff]" />
                  <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#352bff] text-lg font-black text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <SectionTitle
          title="Unlock the Power of Visual Results"
          subtitle="Posterly offers tangible benefits for any event organizer."
        />
        <div className="mx-auto mt-16 flex max-w-7xl flex-wrap justify-center gap-4">
          {benefits.map((benefit) => (
            <span key={benefit} className="inline-flex items-center gap-2 rounded-full bg-[#eeedff] px-4 py-1 text-sm font-medium text-[#3b32ff]">
              <CheckCircle2 className="h-4 w-4 text-[#352bff]" />
              {benefit}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <img
          src="/posterly_simple_logo_transparent.svg"
          alt=""
          className="mx-auto h-16 w-16"
        />
        <h2 className="mt-6 text-5xl font-black">
          Ready to Elevate Your Event Announcements?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-slate-600">
          Join Posterly today and start creating result posters that captivate
          and celebrate. It&apos;s free to get started, and powerful enough to
          grow with you.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center gap-3 rounded-lg bg-[#3b32ff] px-6 py-3 text-lg font-bold text-white shadow-lg shadow-indigo-900/15 hover:bg-[#2920e8]"
        >
          <CheckCircle2 className="h-5 w-5" />
          Back to My Dashboard
        </Link>
      </section>
    </main>
  );
}

function DemoHeader() {
  return (
    <section className="px-6 pb-12 pt-6 text-center">
      <h2 className="text-5xl font-black">See It in Action</h2>
      <p className="mx-auto mt-5 max-w-xl text-xl leading-8 text-slate-600">
        Try it out! Edit the data below and watch the posters update in real-time.
      </p>
    </section>
  );
}

function PosterlyLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/posterly_simple_logo_transparent.svg"
        alt=""
        className={compact ? 'h-9 w-9' : 'h-12 w-12'}
      />
      <span
        className={`flex items-baseline font-black tracking-[-0.02em] text-[#050b22] ${
          compact ? 'text-xl' : 'text-[34px]'
        }`}
      >
        Poster<span className="text-[#352bff]">ly</span>
      </span>
    </span>
  );
}

function LogoMark({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="posterlyBlue" x1="42" y1="12" x2="84" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4637ff" />
          <stop offset="1" stopColor="#271dff" />
        </linearGradient>
        <linearGradient id="posterlyTeal" x1="22" y1="28" x2="58" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#11c8bd" />
          <stop offset="1" stopColor="#05a99a" />
        </linearGradient>
        <linearGradient id="posterlyCoral" x1="10" y1="42" x2="38" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6044" />
          <stop offset="1" stopColor="#ff785f" />
        </linearGradient>
      </defs>
      <path
        d="M12 42L27 53V83H12V42Z"
        fill="url(#posterlyCoral)"
        filter="drop-shadow(0 8px 12px rgb(5 11 34 / 0.12))"
      />
      <path
        d="M29 28L47 41V84L29 73V28Z"
        fill="url(#posterlyTeal)"
        filter="drop-shadow(0 8px 12px rgb(5 11 34 / 0.12))"
      />
      <path
        d="M44 17H66C79.3 17 89 26.7 89 40C89 53.3 79.3 63 66 63H59V86L44 76V17Z"
        fill="url(#posterlyBlue)"
        filter="drop-shadow(0 10px 16px rgb(5 11 34 / 0.16))"
      />
      <path
        d="M66.5 32C68.2 40.2 72.8 44.8 81 46.5C72.8 48.2 68.2 52.8 66.5 61C64.8 52.8 60.2 48.2 52 46.5C60.2 44.8 64.8 40.2 66.5 32Z"
        fill="white"
      />
    </svg>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-black">{title}</h2>
      <p className="mt-5 text-xl text-slate-600">{subtitle}</p>
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: typeof Sparkles }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eeedff]">
      <Icon className="h-8 w-8 text-[#3b32ff]" />
    </div>
  );
}

function ProgramDemo({
  category,
  setCategory,
  winners,
  setWinners,
}: {
  category: string;
  setCategory: (value: string) => void;
  winners: { pos: string; name: string; team: string }[];
  setWinners: (value: { pos: string; name: string; team: string }[]) => void;
}) {
  return (
    <section className="px-6 pb-20">
      <h2 className="text-center text-3xl font-black">Program Result Poster Demo</h2>
      <select className="mx-auto mt-7 block w-80 rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm">
        <option>Sahityolsav Poster Template 1</option>
      </select>
      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md shadow-slate-200">
          <h3 className="text-xl font-bold">Customize Program Data</h3>
          <p className="mt-2 text-slate-600">Edit the fields to see the poster change.</p>
          <label className="mt-8 block text-sm font-semibold">Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 rounded-md border border-slate-300 px-4 py-3"
          >
            <option>Senior</option>
            <option>Junior</option>
            <option>General</option>
          </select>
          <hr className="my-6" />
          <h4 className="text-xl font-bold">Winners</h4>
          <div className="mt-4 space-y-4">
            {winners.map((winner, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[70px_1fr_130px]">
                <LabeledInput
                  label="Pos."
                  value={winner.pos}
                  onChange={(value) => updateWinner(index, 'pos', value, winners, setWinners)}
                />
                <LabeledInput
                  label="Name"
                  value={winner.name}
                  onChange={(value) => updateWinner(index, 'name', value, winners, setWinners)}
                />
                <label className="text-sm">
                  <span>Team</span>
                  <select
                    value={winner.team}
                    onChange={(event) => updateWinner(index, 'team', event.target.value, winners, setWinners)}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                  >
                    {teamNames.map((team) => (
                      <option key={team}>{team}</option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
        </div>
        <PosterShell targetId="program-result-poster" filename="program-result-poster.jpg">
          <div id="program-result-poster" className="relative flex aspect-[4/5] w-[300px] flex-col justify-between overflow-hidden bg-[#ffbe5c] p-10 text-black">
            <div className="absolute bottom-0 right-0 h-40 w-44 rounded-t-full bg-[#3b1d14]" />
            <div className="absolute bottom-28 right-16 h-24 w-24 rounded-full bg-[#352bff]" />
            <div className="relative z-10">
              <p className="text-xs">Result No: 101</p>
              <h3 className="mt-3 text-lg font-black">{category}</h3>
              <p className="font-bold">Quran Recitation</p>
            </div>
            <ol className="relative z-10 text-sm font-bold">
              {winners.map((winner) => (
                <li key={winner.pos}>
                  {winner.pos} {winner.name}
                  <span className="block pl-4 text-xs font-normal">{winner.team}</span>
                </li>
              ))}
            </ol>
          </div>
        </PosterShell>
      </div>
    </section>
  );
}

function TeamDemo({
  titleParts,
  setTitleParts,
  scores,
  setScores,
  standingsTitle,
  sortedScores,
}: {
  titleParts: string[];
  setTitleParts: (value: string[]) => void;
  scores: { team: string; score: string }[];
  setScores: (value: { team: string; score: string }[]) => void;
  standingsTitle: string;
  sortedScores: { team: string; score: string }[];
}) {
  return (
    <section className="px-6 pb-20">
      <h2 className="text-center text-3xl font-black">Team Standings Poster Demo</h2>
      <select className="mx-auto mt-7 block w-80 rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm">
        <option>Template 1</option>
      </select>
      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md shadow-slate-200">
          <h3 className="text-xl font-bold">Customize Team Data</h3>
          <p className="mt-2 text-slate-600">Edit scores and titles to see updates.</p>
          <label className="mt-8 block text-sm font-semibold">Title Parts</label>
          <div className="mt-2 space-y-3">
            {titleParts.map((part, index) => (
              <input
                key={index}
                value={part}
                onChange={(event) => {
                  const next = [...titleParts];
                  next[index] = event.target.value;
                  setTitleParts(next);
                }}
                className="w-full rounded-md border border-slate-300 px-4 py-3"
              />
            ))}
          </div>
          <hr className="my-6" />
          <h4 className="text-xl font-bold">Teams & Scores</h4>
          <div className="mt-4 space-y-4">
            {scores.map((row, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span>Team Name</span>
                  <select
                    value={row.team}
                    onChange={(event) => {
                      const next = [...scores];
                      next[index] = { ...row, team: event.target.value };
                      setScores(next);
                    }}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                  >
                    {teamNames.map((team) => (
                      <option key={team}>{team}</option>
                    ))}
                  </select>
                </label>
                <LabeledInput
                  label="Score"
                  value={row.score}
                  onChange={(value) => {
                    const next = [...scores];
                    next[index] = { ...row, score: value };
                    setScores(next);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <PosterShell targetId="team-standings-poster" filename="team-standings-poster.jpg">
          <div id="team-standings-poster" className="relative aspect-[4/5] w-[300px] overflow-hidden bg-[#100a35] p-10 text-white">
            <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-blue-400 blur-sm" />
            <div className="relative z-10">
              <h3 className="text-lg font-black">
                {standingsTitle.split(' ').map((word, index) => (
                  <span key={index} className={index === 1 ? 'text-yellow-300' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h3>
              <div className="mt-7 space-y-1 text-sm font-bold">
                {sortedScores.map((row) => (
                  <p key={row.team}>
                    {row.team} <span className="text-yellow-300">{row.score}</span>
                  </p>
                ))}
              </div>
            </div>
            <Trophy className="absolute bottom-16 right-12 h-16 w-16 text-white/80" />
          </div>
        </PosterShell>
      </div>
    </section>
  );
}

function FramedDemo({
  frameImage,
  setFrameImage,
}: {
  frameImage: string | null;
  setFrameImage: (value: string | null) => void;
}) {
  return (
    <section className="px-6 pb-24">
      <h2 className="text-center text-3xl font-black">Framed Post Demo</h2>
      <select className="mx-auto mt-7 block w-80 rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm">
        <option>Sahityolsav Frame Template 1</option>
      </select>
      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="min-h-[520px] rounded-lg bg-white p-6 shadow-md shadow-slate-200">
          <h3 className="text-xl font-bold">Customize Framed Post</h3>
          <p className="mt-2 text-slate-600">Select an image and adjust its position within the frame.</p>
          <label className="mt-8 block text-sm font-semibold">Content Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setFrameImage(URL.createObjectURL(file));
            }}
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3"
          />
          <hr className="my-6" />
        </div>
        <div className="rounded-lg bg-white p-5 shadow-md shadow-slate-200">
          <div id="framed-post-poster" className="relative aspect-square overflow-hidden rounded-md bg-slate-300">
            {frameImage ? (
              <img src={frameImage} alt="Selected framed post content" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-600">
                No Content Image Selected
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-7 left-1/2 flex w-[70%] -translate-x-1/2 items-end justify-between text-[10px] font-bold text-white">
              <span>SSF<br />SECTOR NAME</span>
              <Sparkles className="h-10 w-10" />
              <span>2026<br />05,06 October</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadPosterAsJpg('framed-post-poster', 'framed-post.jpg')}
            className="mx-auto mt-5 flex items-center gap-2 rounded-md bg-[#352bff] px-6 py-3 font-bold text-white hover:bg-[#271dff]"
          >
            <Download className="h-5 w-5" />
            Download Framed Post
          </button>
          <Note />
        </div>
      </div>
    </section>
  );
}

function PosterShell({
  children,
  targetId,
  filename,
}: {
  children: ReactNode;
  targetId: string;
  filename: string;
}) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md shadow-slate-200">
      <div className="flex min-h-[430px] items-center justify-center">{children}</div>
      <button
        type="button"
        onClick={() => downloadPosterAsJpg(targetId, filename)}
        className="mx-auto mt-7 flex items-center gap-2 rounded-md bg-[#352bff] px-6 py-3 font-bold text-white hover:bg-[#271dff]"
      >
        <Download className="h-5 w-5" />
        Download Poster
      </button>
      <Note />
    </div>
  );
}

async function downloadPosterAsJpg(targetId: string, filename: string) {
  const element = document.getElementById(targetId);
  if (!element) return;

  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 3,
    useCORS: true,
  });
  const image = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.href = image;
  link.download = filename;
  link.click();
}

function Note() {
  return (
    <div className="mt-5 rounded-md bg-slate-100 px-5 py-3 text-center text-sm text-slate-500">
      Note: All text, colors, fonts, and layouts are fully customizable in the template editor.
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </label>
  );
}

function updateWinner(
  index: number,
  key: 'pos' | 'name' | 'team',
  value: string,
  winners: { pos: string; name: string; team: string }[],
  setWinners: (value: { pos: string; name: string; team: string }[]) => void,
) {
  const next = [...winners];
  next[index] = { ...next[index], [key]: value };
  setWinners(next);
}

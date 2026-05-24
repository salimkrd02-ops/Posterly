'use client';

import { EllipsisVertical, Pencil, Plus, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardShell } from '../components';
import { getTeams, makeCreatedDate, makeId, saveTeams, TeamRecord } from '../event-store';
import { getActiveWorkspaceId } from '../../auth-store';
import { useActiveEvent } from '../use-active-event';

export default function TeamsPage() {
  const { activeEvent, ready } = useActiveEvent();
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editTeam, setEditTeam] = useState<TeamRecord | null>(null);

  useEffect(() => {
    if (!activeEvent) return;
    setTeams(getTeams().filter((team) => team.eventId === activeEvent.id));
  }, [activeEvent]);

  function persistScopedTeams(nextScopedTeams: TeamRecord[]) {
    if (!activeEvent) return;
    const otherTeams = getTeams().filter((team) => team.eventId !== activeEvent.id);
    saveTeams([...otherTeams, ...nextScopedTeams]);
    setTeams(nextScopedTeams);
  }

  function createTeam(name: string) {
    if (!activeEvent) return;
    persistScopedTeams([
      ...teams,
      {
        id: makeId('team'),
        workspaceId: getActiveWorkspaceId() ?? 'default-workspace',
        eventId: activeEvent.id,
        name,
        created: makeCreatedDate(),
      },
    ]);
    setCreateOpen(false);
  }

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="DATA:Teams"><p>Please create or select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="DATA:Teams">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Manage Teams</h1>
            <p className="mt-3 text-xl text-slate-600">
              View, create, edit, and delete teams for event:{' '}
              <span className="font-bold">{activeEvent.name}</span>
            </p>
          </header>

          <button type="button" onClick={() => setCreateOpen(true)} className="flex min-h-10 w-full min-w-[180px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto">
            <Plus className="h-4 w-4" />
            Create New Team
          </button>
        </div>

        {teams.length > 0 ? (
          <section className="mt-9 grid max-w-[530px] gap-4">
            {teams.map((team) => (
              <article key={team.id} className="relative min-h-[136px] rounded-xl border border-slate-300 bg-white p-6 shadow-lg shadow-slate-300/40">
                <h2 className="text-lg font-bold">{team.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Created: {team.created}</p>
                <button
                  type="button"
                  onClick={() => setActiveMenuId((current) => (current === team.id ? null : team.id))}
                  className="absolute bottom-8 right-8 rounded-md p-1 hover:bg-slate-100"
                  aria-label={`${team.name} actions`}
                  aria-expanded={activeMenuId === team.id}
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>
                {activeMenuId === team.id ? (
                  <div className="absolute bottom-4 right-14 z-20 w-40 rounded-md border border-slate-300 bg-white py-2 shadow-lg shadow-slate-300/70">
                    <p className="px-3 pb-2 text-base font-medium">Actions</p>
                    <button onClick={() => { setActiveMenuId(null); setEditTeam(team); }} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                      <Pencil className="h-4 w-4 text-slate-500" />
                      Edit
                    </button>
                    <button onClick={() => { persistScopedTeams(teams.filter((item) => item.id !== team.id)); setActiveMenuId(null); }} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 text-slate-500" />
                      Delete
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : (
          <section className="flex min-h-[430px] items-center justify-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/60">
                <UsersRound className="h-7 w-7 text-slate-500" />
              </div>
              <h2 className="mt-5 text-xl font-black text-[#05081f]">No Teams Yet</h2>
              <p className="mt-4 text-base text-slate-600">
                You haven&apos;t created any teams yet. Get started by creating your first one!
              </p>
              <button type="button" onClick={() => setCreateOpen(true)} className="mt-7 rounded-lg bg-[#4338ff] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
                Create Your First Team
              </button>
            </div>
          </section>
        )}
      </div>

      {createOpen ? <CreateTeamModal onClose={() => setCreateOpen(false)} onCreate={createTeam} /> : null}
      {editTeam ? (
        <EditTeamModal
          team={editTeam}
          onClose={() => setEditTeam(null)}
          onUpdate={(updatedTeam) => {
            persistScopedTeams(teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)));
            setEditTeam(null);
          }}
        />
      ) : null}
    </DashboardShell>
  );
}

function CreateTeamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [teamName, setTeamName] = useState('');

  return <TeamModal title="Create New Team" subtitle="Create a new team to organize your status updates." value={teamName} setValue={setTeamName} primary="Create Team" onClose={onClose} onPrimary={() => onCreate(teamName || 'Untitled Team')} />;
}

function EditTeamModal({ team, onClose, onUpdate }: { team: TeamRecord; onClose: () => void; onUpdate: (team: TeamRecord) => void }) {
  const [teamName, setTeamName] = useState(team.name);

  return <TeamModal title="Edit Team" subtitle="Make changes to your team here. Click save when you're done." value={teamName} setValue={setTeamName} primary="Update Team" onClose={onClose} onPrimary={() => onUpdate({ ...team, name: teamName || team.name })} />;
}

function TeamModal({
  title,
  subtitle,
  value,
  setValue,
  primary,
  onClose,
  onPrimary,
}: {
  title: string;
  subtitle: string;
  value: string;
  setValue: (value: string) => void;
  primary: string;
  onClose: () => void;
  onPrimary: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
      <section className="w-full max-w-[404px] rounded-lg border border-slate-300 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-600 hover:bg-slate-100">×</button>
        </div>
        <form className="mt-8 space-y-4">
          <label className="grid grid-cols-[82px_1fr] items-center gap-3">
            <span className="text-center text-sm font-medium leading-4">Team<br />Name</span>
            <input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g., Alpha Team" className="h-10 rounded-md border border-[#4338ff] bg-white px-3 text-sm outline-none ring-2 ring-[#4338ff]/20" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onPrimary} className="rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">{primary}</button>
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}

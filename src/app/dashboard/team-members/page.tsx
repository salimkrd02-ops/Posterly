'use client';

import { Plus, UserPlus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import {
  canManageUsers,
  getInvitations,
  getWorkspaceUsers,
  InvitationRecord,
  inviteWorkspaceUser,
  UserRole,
} from '../../auth-store';
import { DashboardShell } from '../components';
import { useActiveEvent } from '../use-active-event';

export default function TeamMembersPage() {
  const { ready } = useActiveEvent({ redirect: false });
  const [members, setMembers] = useState<ReturnType<typeof getWorkspaceUsers>>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState('');
  const [canInvite, setCanInvite] = useState(false);

  function refresh() {
    setMembers(getWorkspaceUsers());
    setInvitations(getInvitations().filter((invite) => invite.status === 'pending'));
    setCanInvite(canManageUsers());
  }

  useEffect(() => {
    refresh();
  }, []);

  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const role = String(formData.get('role') ?? 'Viewer') as Exclude<UserRole, 'Owner'>;

    try {
      inviteWorkspaceUser(email, role);
      setInviteOpen(false);
      refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Invite failed.');
    }
  }

  if (!ready) return null;

  return (
    <DashboardShell active="WORKSPACE:Team Members">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Team Members</h1>
            <p className="mt-3 text-xl text-slate-600">
              Invite users and manage workspace access.
            </p>
          </header>

          {canInvite ? (
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="flex min-h-10 w-full min-w-[170px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Invite User
            </button>
          ) : null}
        </div>

        <section className="mt-9 grid gap-4 xl:grid-cols-2">
          {members.map((member) => (
            <article key={member.id} className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm shadow-slate-300/50">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eeedff] font-black text-[#4338ff]">
                  {(member.user?.name || member.user?.email || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold">{member.user?.name ?? 'Unknown user'}</h2>
                  <p className="text-sm text-slate-500">{member.user?.email}</p>
                </div>
                <span className="ml-auto rounded-md bg-[#eeedff] px-3 py-1 text-sm font-bold text-[#4338ff]">
                  {member.role}
                </span>
              </div>
            </article>
          ))}
        </section>

        {invitations.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-lg font-black">Pending Invitations</h2>
            <div className="mt-3 grid gap-3 xl:grid-cols-2">
              {invitations.map((invite) => (
                <article key={invite.id} className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
                  <p className="font-bold">{invite.invitedEmail}</p>
                  <p className="mt-1 text-sm text-slate-500">Role: {invite.role}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
          <section className="w-full max-w-[420px] rounded-lg border border-slate-300 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black">Invite User</h2>
                <p className="mt-2 text-sm text-slate-500">Connect another account to this workspace.</p>
              </div>
              <button type="button" onClick={() => setInviteOpen(false)} className="rounded-md p-1 text-slate-600 hover:bg-slate-100">×</button>
            </div>
            {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
            <form onSubmit={submitInvite} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input name="email" type="email" required placeholder="user@example.com" className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#4338ff] focus:ring-2 focus:ring-[#4338ff]/15" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Role</span>
                <select name="role" className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#4338ff] focus:ring-2 focus:ring-[#4338ff]/15">
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setInviteOpen(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
                  <UserPlus className="h-4 w-4" />
                  Send Invite
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </DashboardShell>
  );
}

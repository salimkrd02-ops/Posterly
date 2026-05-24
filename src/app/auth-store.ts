'use client';

export type UserRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type WorkspaceRecord = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

export type WorkspaceMemberRecord = {
  id: string;
  workspaceId: string;
  userId: string;
  role: UserRole;
  status: 'active' | 'pending';
  createdAt: string;
};

export type InvitationRecord = {
  id: string;
  workspaceId: string;
  invitedEmail: string;
  invitedBy: string;
  role: Exclude<UserRole, 'Owner'>;
  status: 'pending' | 'accepted';
  token: string;
  createdAt: string;
  expiresAt: string;
};

const USERS_KEY = 'posterly:users';
const WORKSPACES_KEY = 'posterly:workspaces';
const MEMBERS_KEY = 'posterly:workspaceMembers';
const INVITATIONS_KEY = 'posterly:invitations';
const SESSION_USER_ID_KEY = 'posterly:sessionUserId';
const ACTIVE_WORKSPACE_ID_KEY = 'posterly:activeWorkspaceId';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('posterly:data-changed'));
}

function nowDate() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUsers() {
  return readJson<UserRecord[]>(USERS_KEY, []);
}

export function getWorkspaces() {
  return readJson<WorkspaceRecord[]>(WORKSPACES_KEY, []);
}

export function getWorkspaceMembers() {
  return readJson<WorkspaceMemberRecord[]>(MEMBERS_KEY, []);
}

export function getInvitations() {
  return readJson<InvitationRecord[]>(INVITATIONS_KEY, []);
}

export function getCurrentUser() {
  const userId = window.localStorage.getItem(SESSION_USER_ID_KEY);
  return getUsers().find((user) => user.id === userId) ?? null;
}

export function getActiveWorkspaceId() {
  return window.localStorage.getItem(ACTIVE_WORKSPACE_ID_KEY);
}

export function setActiveWorkspaceId(workspaceId: string) {
  window.localStorage.setItem(ACTIVE_WORKSPACE_ID_KEY, workspaceId);
  window.dispatchEvent(new Event('posterly:data-changed'));
}

export function getActiveWorkspace() {
  const workspaceId = getActiveWorkspaceId();
  return getWorkspaces().find((workspace) => workspace.id === workspaceId) ?? null;
}

export function getCurrentMembership() {
  const user = getCurrentUser();
  const workspaceId = getActiveWorkspaceId();
  if (!user || !workspaceId) return null;

  return (
    getWorkspaceMembers().find(
      (member) =>
        member.userId === user.id &&
        member.workspaceId === workspaceId &&
        member.status === 'active',
    ) ?? null
  );
}

export function canManageUsers() {
  const role = getCurrentMembership()?.role;
  return role === 'Owner' || role === 'Admin';
}

export function canCreateOrDeleteData() {
  const role = getCurrentMembership()?.role;
  return role === 'Owner' || role === 'Admin';
}

export function canEditData() {
  const role = getCurrentMembership()?.role;
  return role === 'Owner' || role === 'Admin' || role === 'Editor';
}

export function signUp(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user: UserRecord = {
    id: makeId('user'),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: nowDate(),
  };
  const workspace: WorkspaceRecord = {
    id: makeId('workspace'),
    name: `${user.name || user.email}'s Workspace`,
    ownerId: user.id,
    createdAt: nowDate(),
  };
  const member: WorkspaceMemberRecord = {
    id: makeId('member'),
    workspaceId: workspace.id,
    userId: user.id,
    role: 'Owner',
    status: 'active',
    createdAt: nowDate(),
  };

  writeJson(USERS_KEY, [...users, user]);
  writeJson(WORKSPACES_KEY, [...getWorkspaces(), workspace]);
  writeJson(MEMBERS_KEY, [...getWorkspaceMembers(), member]);
  window.localStorage.setItem(SESSION_USER_ID_KEY, user.id);
  setActiveWorkspaceId(workspace.id);
  acceptPendingInvitationsForUser(user);

  return user;
}

export function ensureAccountWithWorkspace(
  name: string,
  email: string,
  password: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = getUsers().find((user) => user.email === normalizedEmail);

  if (existingUser) {
    window.localStorage.setItem(SESSION_USER_ID_KEY, existingUser.id);
    acceptPendingInvitationsForUser(existingUser);

    const membership =
      getWorkspaceMembers().find(
        (member) => member.userId === existingUser.id && member.status === 'active',
      ) ??
      getWorkspaceMembers().find((member) => member.userId === existingUser.id);

    if (membership) setActiveWorkspaceId(membership.workspaceId);
    return existingUser;
  }

  return signUp(name, normalizedEmail, password);
}

export function signIn(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find(
    (item) => item.email === normalizedEmail && item.password === password,
  );
  if (!user) throw new Error('Invalid email or password.');

  window.localStorage.setItem(SESSION_USER_ID_KEY, user.id);
  acceptPendingInvitationsForUser(user);

  const firstMembership = getWorkspaceMembers().find(
    (member) => member.userId === user.id && member.status === 'active',
  );
  if (firstMembership) setActiveWorkspaceId(firstMembership.workspaceId);

  return user;
}

export function signOut() {
  window.localStorage.removeItem(SESSION_USER_ID_KEY);
  window.localStorage.removeItem(ACTIVE_WORKSPACE_ID_KEY);
  window.localStorage.removeItem('posterly:activeEventId');
  window.dispatchEvent(new Event('posterly:data-changed'));
}

export function inviteWorkspaceUser(
  invitedEmail: string,
  role: Exclude<UserRole, 'Owner'>,
) {
  const user = getCurrentUser();
  const workspaceId = getActiveWorkspaceId();
  if (!user || !workspaceId || !canManageUsers()) {
    throw new Error('You do not have permission to invite users.');
  }

  const invitation: InvitationRecord = {
    id: makeId('invite'),
    workspaceId,
    invitedEmail: invitedEmail.trim().toLowerCase(),
    invitedBy: user.id,
    role,
    status: 'pending',
    token: makeId('token'),
    createdAt: nowDate(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  };

  writeJson(INVITATIONS_KEY, [...getInvitations(), invitation]);

  const invitedUser = getUsers().find((item) => item.email === invitation.invitedEmail);
  if (invitedUser) acceptPendingInvitationsForUser(invitedUser);

  return invitation;
}

export function acceptPendingInvitationsForUser(user: UserRecord) {
  const invitations = getInvitations();
  const members = getWorkspaceMembers();
  let changed = false;

  const nextInvitations = invitations.map((invitation) => {
    if (
      invitation.invitedEmail !== user.email ||
      invitation.status !== 'pending'
    ) {
      return invitation;
    }

    const alreadyMember = members.some(
      (member) =>
        member.userId === user.id && member.workspaceId === invitation.workspaceId,
    );
    if (!alreadyMember) {
      members.push({
        id: makeId('member'),
        workspaceId: invitation.workspaceId,
        userId: user.id,
        role: invitation.role,
        status: 'active',
        createdAt: nowDate(),
      });
    }
    changed = true;
    return { ...invitation, status: 'accepted' as const };
  });

  if (changed) {
    writeJson(MEMBERS_KEY, members);
    writeJson(INVITATIONS_KEY, nextInvitations);
  }
}

export function getWorkspaceUsers() {
  const workspaceId = getActiveWorkspaceId();
  if (!workspaceId) return [];
  const users = getUsers();
  return getWorkspaceMembers()
    .filter((member) => member.workspaceId === workspaceId)
    .map((member) => ({
      ...member,
      user: users.find((user) => user.id === member.userId) ?? null,
    }));
}

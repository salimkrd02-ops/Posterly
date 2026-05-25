'use client';

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  createdAt?: string;
};

export type WorkspaceRecord = {
  id: string;
  name: string;
  owner_id?: string;
  ownerId?: string;
  created_at?: string;
  createdAt?: string;
};

export type WorkspaceMemberRecord = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  user_id?: string;
  userId?: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: string;
  created_at?: string;
  createdAt?: string;
};

export type InvitationRecord = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  invited_email?: string;
  invitedEmail?: string;
  invited_by?: string;
  invitedBy?: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: string;
  token: string;
  created_at?: string;
  createdAt?: string;
  expires_at?: string;
  expiresAt?: string;
};

const USER_KEY = 'posterly_session_user';
const WORKSPACE_KEY = 'posterly_active_workspace_id';
const EVENT_KEY = 'posterly_active_event_id';
const LEGACY_USER_KEYS = [
  'posterly_current_user',
  'postergen_current_user',
  'posterly_user',
  'user',
];

function isBrowser() {
  return typeof window !== 'undefined';
}

function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function requestSync<T>(path: string, options: { method?: string; body?: unknown } = {}): T | null {
  if (!isBrowser()) return null;
  const xhr = new XMLHttpRequest();
  const user = readJson<UserRecord>(USER_KEY);
  xhr.open(options.method ?? 'GET', `/api/posterly/${path}`, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  if (user?.id) xhr.setRequestHeader('x-posterly-user-id', user.id);
  try {
    xhr.send(options.body ? JSON.stringify(options.body) : undefined);
  } catch {
    return null;
  }

  if (xhr.status < 200 || xhr.status >= 300) return null;
  try {
    return JSON.parse(xhr.responseText) as T;
  } catch {
    return null;
  }
}

function normalizeUser(user: UserRecord | null | undefined): UserRecord | null {
  if (!user?.id || !user.email) return null;
  if (user.email === 'user@gmail.com') return null;
  return {
    id: user.id,
    name: user.name || user.email.split('@')[0] || 'User',
    email: user.email,
    created_at: user.created_at ?? user.createdAt,
  };
}

function setSession(user: UserRecord, workspace?: WorkspaceRecord | null) {
  writeJson(USER_KEY, normalizeUser(user));
  if (workspace?.id) window.localStorage.setItem(WORKSPACE_KEY, workspace.id);
}

export function getCurrentUser(): UserRecord | null {
  const user = normalizeUser(readJson<UserRecord>(USER_KEY));
  if (user) return user;
  if (isBrowser()) {
    for (const key of LEGACY_USER_KEYS) {
      window.localStorage.removeItem(key);
    }
  }
  return null;
}

export function getUsers(): UserRecord[] {
  const user = getCurrentUser();
  return user ? [user] : [];
}

export function getWorkspaces(): WorkspaceRecord[] {
  const user = getCurrentUser();
  if (!user) return [];
  return requestSync<WorkspaceRecord[]>(`workspaces?userId=${encodeURIComponent(user.id)}`) ?? [];
}

export function getWorkspaceMembers(): WorkspaceMemberRecord[] {
  const membership = getCurrentMembership();
  return membership ? [membership] : [];
}

export function getInvitations(): InvitationRecord[] {
  return [];
}

export function getActiveWorkspaceId(): string | null {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(WORKSPACE_KEY);
  const workspaces = getWorkspaces();
  if (stored && workspaces.some((workspace) => workspace.id === stored)) return stored;
  const firstWorkspace = workspaces[0];
  if (!firstWorkspace) {
    window.localStorage.removeItem(WORKSPACE_KEY);
    return null;
  }
  window.localStorage.setItem(WORKSPACE_KEY, firstWorkspace.id);
  return firstWorkspace.id;
}

export function setActiveWorkspaceId(workspaceId: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(WORKSPACE_KEY, workspaceId);
}

export function getActiveWorkspace(): WorkspaceRecord | null {
  const workspaceId = getActiveWorkspaceId();
  if (!workspaceId) return null;
  return getWorkspaces().find((workspace) => workspace.id === workspaceId) ?? null;
}

export function getCurrentMembership(): WorkspaceMemberRecord | null {
  const user = getCurrentUser();
  const workspace = getActiveWorkspace();
  if (!user || !workspace) return null;
  const session = requestSync<{
    membership?: WorkspaceMemberRecord | null;
  }>(`session?userId=${encodeURIComponent(user.id)}`);
  return (
    session?.membership ?? {
      id: `${workspace.id}-${user.id}`,
      workspace_id: workspace.id,
      user_id: user.id,
      role: workspace.owner_id === user.id || workspace.ownerId === user.id ? 'Owner' : 'Admin',
      status: 'active',
    }
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
  const result = requestSync<{ user: UserRecord; workspace: WorkspaceRecord }>('auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });
  if (!result?.user) return null;
  setSession(result.user, result.workspace);
  return normalizeUser(result.user);
}

export function ensureAccountWithWorkspace(name: string, email: string, password: string) {
  const result = requestSync<{ user: UserRecord; workspace: WorkspaceRecord }>('auth/ensure-account', {
    method: 'POST',
    body: { name, email, password },
  });
  if (!result?.user) return null;
  setSession(result.user, result.workspace);
  return normalizeUser(result.user);
}

export function signIn(email: string, password: string) {
  const result = requestSync<{ user: UserRecord; workspace: WorkspaceRecord }>('auth/signin', {
    method: 'POST',
    body: { email, password },
  });
  if (!result?.user) return null;
  setSession(result.user, result.workspace);
  return normalizeUser(result.user);
}

export function signOut() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(WORKSPACE_KEY);
  window.localStorage.removeItem(EVENT_KEY);
}

export function inviteWorkspaceUser(email: string, role: 'Admin' | 'Editor' | 'Viewer') {
  const workspaceId = getActiveWorkspaceId();
  const user = getCurrentUser();
  if (!workspaceId || !user) return null;
  return {
    id: `${workspaceId}-${email}`,
    workspace_id: workspaceId,
    invited_email: email,
    invited_by: user.id,
    role,
    status: 'pending',
    token: `${workspaceId}-${Date.now()}`,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  } satisfies InvitationRecord;
}

export function acceptPendingInvitationsForUser() {
  return [];
}

export function getWorkspaceUsers() {
  const user = getCurrentUser();
  return user ? [{ user, membership: getCurrentMembership() }] : [];
}

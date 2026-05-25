'use client';

import { getActiveWorkspaceId } from '../auth-store';

export type EventRecord = {
  [key: string]: unknown;
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  logo?: string | null;
  logoUrl?: string | null;
  logoName?: string;
  created?: string;
  created_by?: string;
  createdBy?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
};

export type TeamRecord = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  event_id?: string;
  eventId?: string;
  name: string;
  created?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
};

export type CategoryRecord = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  event_id?: string;
  eventId?: string;
  name: string;
  created?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
};

const ACTIVE_EVENT_KEY = 'posterly_active_event_id';

function isBrowser() {
  return typeof window !== 'undefined';
}

function requestSync<T>(path: string, options: { method?: string; body?: unknown } = {}): T | null {
  if (!isBrowser()) return null;
  const xhr = new XMLHttpRequest();
  xhr.open(options.method ?? 'GET', `/api/posterly/${path}`, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
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

function workspaceQuery() {
  const workspaceId = getActiveWorkspaceId();
  return workspaceId ? `workspaceId=${encodeURIComponent(workspaceId)}` : null;
}

function normalizeEvent(event: EventRecord): EventRecord {
  return {
    ...event,
    workspaceId: event.workspaceId ?? event.workspace_id,
    logoUrl: event.logoUrl ?? event.logo ?? null,
    logoName: event.logoName ?? (event.logo || event.logoUrl ? 'Event logo selected.' : 'No logo selected.'),
    created: event.created ?? makeCreatedDate(event.created_at || event.createdAt ? new Date(event.created_at ?? event.createdAt ?? '') : new Date()),
    createdAt: event.createdAt ?? event.created_at,
    updatedAt: event.updatedAt ?? event.updated_at,
    createdBy: event.createdBy ?? event.created_by,
  };
}

function normalizeTeam(team: TeamRecord): TeamRecord {
  return {
    ...team,
    workspaceId: team.workspaceId ?? team.workspace_id,
    eventId: team.eventId ?? team.event_id,
    created: team.created ?? makeCreatedDate(team.created_at || team.createdAt ? new Date(team.created_at ?? team.createdAt ?? '') : new Date()),
    createdAt: team.createdAt ?? team.created_at,
    updatedAt: team.updatedAt ?? team.updated_at,
  };
}

function normalizeCategory(category: CategoryRecord): CategoryRecord {
  return {
    ...category,
    workspaceId: category.workspaceId ?? category.workspace_id,
    eventId: category.eventId ?? category.event_id,
    created: category.created ?? makeCreatedDate(category.created_at || category.createdAt ? new Date(category.created_at ?? category.createdAt ?? '') : new Date()),
    createdAt: category.createdAt ?? category.created_at,
    updatedAt: category.updatedAt ?? category.updated_at,
  };
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function makeCreatedDate(date = new Date()) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function getEvents(): EventRecord[] {
  const query = workspaceQuery();
  if (!query) return [];
  return (requestSync<EventRecord[]>(`events?${query}`) ?? []).map(normalizeEvent);
}

export function saveEvents(events: EventRecord[]) {
  const workspaceId = getActiveWorkspaceId();
  if (!workspaceId) return;
  requestSync('events/bulk', {
    method: 'POST',
    body: {
      workspaceId,
      events: events.map((event) => ({
        ...event,
        workspace_id: workspaceId,
        created_at: event.created_at ?? event.createdAt ?? new Date().toISOString(),
      })),
    },
  });
}

export function getActiveEventId(): string | null {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(ACTIVE_EVENT_KEY);
  if (!stored) return null;
  const exists = getEvents().some((event) => event.id === stored);
  if (!exists) {
    window.localStorage.removeItem(ACTIVE_EVENT_KEY);
    return null;
  }
  return stored;
}

export function setActiveEventId(eventId: string | null) {
  if (!isBrowser()) return;
  if (eventId) window.localStorage.setItem(ACTIVE_EVENT_KEY, eventId);
  else window.localStorage.removeItem(ACTIVE_EVENT_KEY);
}

export function getActiveEvent(): EventRecord | null {
  const activeEventId = getActiveEventId();
  if (!activeEventId) return null;
  return getEvents().find((event) => event.id === activeEventId) ?? null;
}

export function getTeams(): TeamRecord[] {
  const query = workspaceQuery();
  const eventId = getActiveEventId();
  if (!query || !eventId) return [];
  return (requestSync<TeamRecord[]>(`teams?${query}&eventId=${encodeURIComponent(eventId)}`) ?? []).map(normalizeTeam);
}

export function saveTeams(teams: TeamRecord[]) {
  const workspaceId = getActiveWorkspaceId();
  const eventId = getActiveEventId();
  if (!workspaceId || !eventId) return;
  requestSync('teams/bulk', {
    method: 'POST',
    body: {
      workspaceId,
      eventId,
      teams: teams.map((team) => ({
        ...team,
        workspace_id: workspaceId,
        event_id: eventId,
        created_at: team.created_at ?? team.createdAt ?? new Date().toISOString(),
      })),
    },
  });
}

export function getCategories(): CategoryRecord[] {
  const query = workspaceQuery();
  const eventId = getActiveEventId();
  if (!query || !eventId) return [];
  return (requestSync<CategoryRecord[]>(`categories?${query}&eventId=${encodeURIComponent(eventId)}`) ?? []).map(normalizeCategory);
}

export function saveCategories(categories: CategoryRecord[]) {
  const workspaceId = getActiveWorkspaceId();
  const eventId = getActiveEventId();
  if (!workspaceId || !eventId) return;
  requestSync('categories/bulk', {
    method: 'POST',
    body: {
      workspaceId,
      eventId,
      categories: categories.map((category) => ({
        ...category,
        workspace_id: workspaceId,
        event_id: eventId,
        created_at: category.created_at ?? category.createdAt ?? new Date().toISOString(),
      })),
    },
  });
}

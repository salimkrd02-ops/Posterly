'use client';

import { getActiveWorkspaceId } from '../auth-store';

export type EventRecord = {
  id: string;
  workspaceId?: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  logoUrl: string | null;
  logoName: string;
  created: string;
};

export type TeamRecord = {
  id: string;
  workspaceId?: string;
  eventId: string;
  name: string;
  created: string;
};

export type CategoryRecord = {
  id: string;
  workspaceId?: string;
  eventId: string;
  name: string;
  created: string;
};

const EVENTS_KEY = 'posterly:events';
const ACTIVE_EVENT_ID_KEY = 'posterly:activeEventId';
const TEAMS_KEY = 'posterly:teams';
const CATEGORIES_KEY = 'posterly:categories';

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
}

function notifyDataChanged() {
  window.dispatchEvent(new Event('posterly:data-changed'));
}

export function getEvents() {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  const events = readJson<EventRecord[]>(EVENTS_KEY, []);
  if (events.length === 0) return [];

  return events.filter((event) => event.workspaceId === workspaceId);
}

export function saveEvents(events: EventRecord[]) {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  const allEvents = readJson<EventRecord[]>(EVENTS_KEY, []);
  const otherWorkspaceEvents = allEvents.filter(
    (event) => event.workspaceId !== workspaceId,
  );
  writeJson(
    EVENTS_KEY,
    [
      ...otherWorkspaceEvents,
      ...events.map((event) => ({ ...event, workspaceId: event.workspaceId ?? workspaceId })),
    ],
  );
  notifyDataChanged();
}

export function getActiveEventId() {
  return window.localStorage.getItem(ACTIVE_EVENT_ID_KEY);
}

export function setActiveEventId(eventId: string) {
  if (eventId) {
    window.localStorage.setItem(ACTIVE_EVENT_ID_KEY, eventId);
  } else {
    window.localStorage.removeItem(ACTIVE_EVENT_ID_KEY);
  }
  notifyDataChanged();
}

export function getActiveEvent() {
  const activeEventId = getActiveEventId();
  if (!activeEventId) return null;
  return getEvents().find((event) => event.id === activeEventId) ?? null;
}

export function getTeams() {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  return readJson<TeamRecord[]>(TEAMS_KEY, []).filter(
    (team) => team.workspaceId === workspaceId,
  );
}

export function saveTeams(teams: TeamRecord[]) {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  const allTeams = readJson<TeamRecord[]>(TEAMS_KEY, []);
  const otherWorkspaceTeams = allTeams.filter(
    (team) => team.workspaceId !== workspaceId,
  );
  writeJson(TEAMS_KEY, [
    ...otherWorkspaceTeams,
    ...teams.map((team) => ({
      ...team,
      workspaceId: team.workspaceId ?? workspaceId,
    })),
  ]);
  notifyDataChanged();
}

export function getCategories() {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  return readJson<CategoryRecord[]>(CATEGORIES_KEY, []).filter(
    (category) => category.workspaceId === workspaceId,
  );
}

export function saveCategories(categories: CategoryRecord[]) {
  const workspaceId = getActiveWorkspaceId() ?? 'default-workspace';
  const allCategories = readJson<CategoryRecord[]>(CATEGORIES_KEY, []);
  const otherWorkspaceCategories = allCategories.filter(
    (category) => category.workspaceId !== workspaceId,
  );
  writeJson(CATEGORIES_KEY, [
    ...otherWorkspaceCategories,
    ...categories.map((category) => ({
      ...category,
      workspaceId: category.workspaceId ?? workspaceId,
    })),
  ]);
  notifyDataChanged();
}

export function makeCreatedDate() {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

type RouteContext = {
  params: { path?: string[] };
};

type EventPayload = {
  id?: string;
  name?: string;
  organizer?: string;
  date?: string;
  location?: string;
  logo?: string | null;
  created_by?: string;
  createdBy?: string;
  created_at?: string;
  createdAt?: string;
};

type NamedPayload = {
  id?: string;
  name?: string;
  created_at?: string;
  createdAt?: string;
};

const now = () => new Date().toISOString();
const id = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function sqlValue(value: unknown) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function query<T = Record<string, unknown>>(statement: string): Promise<T[]> {
  return prisma.$queryRawUnsafe<T[]>(statement);
}

async function execute(statement: string) {
  return prisma.$executeRawUnsafe(statement);
}

async function safeExecute(statement: string) {
  try {
    await execute(statement);
  } catch {
    // Existing deployments may already have a table/column from an older build.
  }
}

async function ensureTables() {
  await execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      invited_email TEXT NOT NULL,
      invited_by TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      organizer TEXT,
      date TEXT,
      location TEXT,
      logo TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await execute(`
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      related_ids TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await Promise.all([
    safeExecute('ALTER TABLE users ADD COLUMN password_hash TEXT'),
    safeExecute('ALTER TABLE events ADD COLUMN workspace_id TEXT'),
    safeExecute('ALTER TABLE events ADD COLUMN logo TEXT'),
    safeExecute('ALTER TABLE events ADD COLUMN created_by TEXT'),
    safeExecute('ALTER TABLE events ADD COLUMN updated_at TEXT'),
    safeExecute('ALTER TABLE categories ADD COLUMN workspace_id TEXT'),
    safeExecute('ALTER TABLE categories ADD COLUMN event_id TEXT'),
    safeExecute('ALTER TABLE categories ADD COLUMN updated_at TEXT'),
    safeExecute('ALTER TABLE teams ADD COLUMN workspace_id TEXT'),
    safeExecute('ALTER TABLE teams ADD COLUMN event_id TEXT'),
    safeExecute('ALTER TABLE teams ADD COLUMN updated_at TEXT'),
    safeExecute('ALTER TABLE templates ADD COLUMN workspace_id TEXT'),
    safeExecute('ALTER TABLE templates ADD COLUMN event_id TEXT'),
    safeExecute('ALTER TABLE results ADD COLUMN workspace_id TEXT'),
    safeExecute('ALTER TABLE results ADD COLUMN event_id TEXT'),
  ]);
}

async function getUserByEmail(email: string) {
  const rows = await query(`SELECT id, name, email, created_at FROM users WHERE lower(email) = lower(${sqlValue(email)}) LIMIT 1`);
  return rows[0] ?? null;
}

async function getPasswordUserByEmail(email: string) {
  const rows = await query(`SELECT * FROM users WHERE lower(email) = lower(${sqlValue(email)}) LIMIT 1`);
  return rows[0] ?? null;
}

async function getOrCreateWorkspace(user: { id: string; name: string; email: string }) {
  const existing = await query(`
    SELECT w.*
    FROM workspaces w
    INNER JOIN workspace_members wm ON wm.workspace_id = w.id
    WHERE wm.user_id = ${sqlValue(user.id)} AND wm.status = 'active'
    ORDER BY w.created_at ASC
    LIMIT 1
  `);

  if (existing[0]) return existing[0];

  const workspaceId = id();
  const memberId = id();
  const createdAt = now();
  await execute(`
    INSERT INTO workspaces (id, name, owner_id, created_at)
    VALUES (${sqlValue(workspaceId)}, ${sqlValue(`${user.name || user.email}'s Workspace`)}, ${sqlValue(user.id)}, ${sqlValue(createdAt)})
  `);
  await execute(`
    INSERT INTO workspace_members (id, workspace_id, user_id, role, status, created_at)
    VALUES (${sqlValue(memberId)}, ${sqlValue(workspaceId)}, ${sqlValue(user.id)}, 'Owner', 'active', ${sqlValue(createdAt)})
  `);

  return { id: workspaceId, name: `${user.name || user.email}'s Workspace`, owner_id: user.id, created_at: createdAt };
}

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function error(message: string, status = 400) {
  return response({ error: message }, status);
}

export async function GET(request: NextRequest, context: RouteContext) {
  await ensureTables();
  const params = context.params;
  const path = params.path?.join('/') ?? '';
  const search = request.nextUrl.searchParams;
  const workspaceId = search.get('workspaceId');
  const eventId = search.get('eventId');
  const userId = request.headers.get('x-posterly-user-id') ?? search.get('userId');

  if (path === 'session') {
    if (!userId) return response({ user: null, workspace: null, membership: null });
    const users = await query(`SELECT id, name, email, created_at FROM users WHERE id = ${sqlValue(userId)} LIMIT 1`);
    if (!users[0]) return response({ user: null, workspace: null, membership: null });
    const workspace = await getOrCreateWorkspace(users[0] as { id: string; name: string; email: string });
    const memberships = await query(`
      SELECT * FROM workspace_members
      WHERE user_id = ${sqlValue(userId)} AND workspace_id = ${sqlValue((workspace as { id: string }).id)}
      LIMIT 1
    `);
    return response({ user: users[0], workspace, membership: memberships[0] ?? null });
  }

  if (path === 'workspaces') {
    if (!userId) return response([]);
    const rows = await query(`
      SELECT w.*
      FROM workspaces w
      INNER JOIN workspace_members wm ON wm.workspace_id = w.id
      WHERE wm.user_id = ${sqlValue(userId)} AND wm.status = 'active'
      ORDER BY w.created_at ASC
    `);
    return response(rows);
  }

  if (!workspaceId) return error('workspaceId is required');

  if (path === 'events') {
    const rows = await query(`SELECT * FROM events WHERE workspace_id = ${sqlValue(workspaceId)} ORDER BY created_at ASC`);
    return response(rows);
  }

  if (path === 'teams') {
    if (!eventId) return response([]);
    const rows = await query(`
      SELECT * FROM teams
      WHERE workspace_id = ${sqlValue(workspaceId)} AND event_id = ${sqlValue(eventId)}
      ORDER BY created_at ASC
    `);
    return response(rows);
  }

  if (path === 'categories') {
    if (!eventId) return response([]);
    const rows = await query(`
      SELECT * FROM categories
      WHERE workspace_id = ${sqlValue(workspaceId)} AND event_id = ${sqlValue(eventId)}
      ORDER BY created_at ASC
    `);
    return response(rows);
  }

  if (path === 'counts') {
    const eventFilter = eventId ? ` AND event_id = ${sqlValue(eventId)}` : ' AND 1 = 0';
    const [events, teams, categories, templates, results] = await Promise.all([
      query<{ count: number }>(`SELECT COUNT(*) as count FROM events WHERE workspace_id = ${sqlValue(workspaceId)}`),
      query<{ count: number }>(`SELECT COUNT(*) as count FROM teams WHERE workspace_id = ${sqlValue(workspaceId)}${eventFilter}`),
      query<{ count: number }>(`SELECT COUNT(*) as count FROM categories WHERE workspace_id = ${sqlValue(workspaceId)}${eventFilter}`),
      query<{ count: number }>(`SELECT COUNT(*) as count FROM templates WHERE workspace_id = ${sqlValue(workspaceId)}${eventFilter}`),
      query<{ count: number }>(`SELECT COUNT(*) as count FROM results WHERE workspace_id = ${sqlValue(workspaceId)}${eventFilter}`),
    ]);
    return response({
      events: Number(events[0]?.count ?? 0),
      teams: Number(teams[0]?.count ?? 0),
      categories: Number(categories[0]?.count ?? 0),
      templates: Number(templates[0]?.count ?? 0),
      results: Number(results[0]?.count ?? 0),
    });
  }

  return error('Unknown endpoint', 404);
}

export async function POST(request: NextRequest, context: RouteContext) {
  await ensureTables();
  const params = context.params;
  const path = params.path?.join('/') ?? '';
  const body = await request.json().catch(() => ({}));
  const updatedAt = now();

  if (path === 'auth/signup' || path === 'auth/ensure-account') {
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!name || !email || !password) return error('Name, email, and password are required');

    const existing = await getUserByEmail(email);
    if (existing && path === 'auth/signup') return error('Account already exists', 409);

    const user =
      existing ??
      {
        id: id(),
        name,
        email,
        created_at: updatedAt,
      };

    if (!existing) {
      await execute(`
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES (${sqlValue(user.id)}, ${sqlValue(name)}, ${sqlValue(email)}, ${sqlValue(password)}, ${sqlValue(updatedAt)})
      `);
    }

    const workspace = await getOrCreateWorkspace(user as { id: string; name: string; email: string });
    return response({ user, workspace });
  }

  if (path === 'auth/signin') {
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const user = await getPasswordUserByEmail(email);
    if (!user || user.password_hash !== password) return error('Invalid email or password', 401);
    const workspace = await getOrCreateWorkspace(user as { id: string; name: string; email: string });
    return response({
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
      workspace,
    });
  }

  const workspaceId = body.workspaceId;
  const eventId = body.eventId;
  if (!workspaceId && !['auth/signup', 'auth/signin', 'auth/ensure-account'].includes(path)) {
    return error('workspaceId is required');
  }

  if (path === 'events/bulk') {
    const events: EventPayload[] = Array.isArray(body.events) ? body.events : [];
    const keepIds = events.map((event: EventPayload) => event.id).filter(Boolean);
    const deleteClause = keepIds.length ? ` AND id NOT IN (${keepIds.map(sqlValue).join(', ')})` : '';
    await execute(`DELETE FROM events WHERE workspace_id = ${sqlValue(workspaceId)}${deleteClause}`);
    for (const event of events) {
      const createdAt = event.created_at ?? event.createdAt ?? updatedAt;
      await execute(`
        INSERT INTO events (id, workspace_id, name, organizer, date, location, logo, created_by, created_at, updated_at)
        VALUES (
          ${sqlValue(event.id ?? id())},
          ${sqlValue(workspaceId)},
          ${sqlValue(event.name)},
          ${sqlValue(event.organizer)},
          ${sqlValue(event.date)},
          ${sqlValue(event.location)},
          ${sqlValue(event.logo)},
          ${sqlValue(event.created_by ?? event.createdBy)},
          ${sqlValue(createdAt)},
          ${sqlValue(updatedAt)}
        )
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          organizer = excluded.organizer,
          date = excluded.date,
          location = excluded.location,
          logo = excluded.logo,
          updated_at = excluded.updated_at
      `);
    }
    return response({ ok: true });
  }

  if (path === 'teams/bulk') {
    if (!eventId) return error('eventId is required');
    const teams: NamedPayload[] = Array.isArray(body.teams) ? body.teams : [];
    const keepIds = teams.map((team: NamedPayload) => team.id).filter(Boolean);
    const deleteClause = keepIds.length ? ` AND id NOT IN (${keepIds.map(sqlValue).join(', ')})` : '';
    await execute(`DELETE FROM teams WHERE workspace_id = ${sqlValue(workspaceId)} AND event_id = ${sqlValue(eventId)}${deleteClause}`);
    for (const team of teams) {
      const createdAt = team.created_at ?? team.createdAt ?? updatedAt;
      await execute(`
        INSERT INTO teams (id, workspace_id, event_id, name, created_at, updated_at)
        VALUES (${sqlValue(team.id ?? id())}, ${sqlValue(workspaceId)}, ${sqlValue(eventId)}, ${sqlValue(team.name)}, ${sqlValue(createdAt)}, ${sqlValue(updatedAt)})
        ON CONFLICT(id) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at
      `);
    }
    return response({ ok: true });
  }

  if (path === 'categories/bulk') {
    if (!eventId) return error('eventId is required');
    const categories: NamedPayload[] = Array.isArray(body.categories) ? body.categories : [];
    const keepIds = categories.map((category: NamedPayload) => category.id).filter(Boolean);
    const deleteClause = keepIds.length ? ` AND id NOT IN (${keepIds.map(sqlValue).join(', ')})` : '';
    await execute(`DELETE FROM categories WHERE workspace_id = ${sqlValue(workspaceId)} AND event_id = ${sqlValue(eventId)}${deleteClause}`);
    for (const category of categories) {
      const createdAt = category.created_at ?? category.createdAt ?? updatedAt;
      await execute(`
        INSERT INTO categories (id, workspace_id, event_id, name, created_at, updated_at)
        VALUES (${sqlValue(category.id ?? id())}, ${sqlValue(workspaceId)}, ${sqlValue(eventId)}, ${sqlValue(category.name)}, ${sqlValue(createdAt)}, ${sqlValue(updatedAt)})
        ON CONFLICT(id) DO UPDATE SET name = excluded.name, updated_at = excluded.updated_at
      `);
    }
    return response({ ok: true });
  }

  return error('Unknown endpoint', 404);
}

'use client';

import {
  ClipboardCopy,
  EllipsisVertical,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { DashboardShell } from '../components';
import {
  EventRecord,
  getActiveWorkspaceId,
  getActiveEventId,
  getEvents,
  makeCreatedDate,
  makeId,
  saveEvents,
  setActiveEventId,
} from '../event-store';

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<EventRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getEvents());
    setSelectedEventId(getActiveEventId());
  }, []);

  function persistEvents(nextEvents: EventRecord[]) {
    setEvents(nextEvents);
    saveEvents(nextEvents);
  }

  function updateEvent(nextEvent: EventRecord) {
    persistEvents(events.map((event) => (event.id === nextEvent.id ? nextEvent : event)));
    setEditEvent(null);
  }

  function createEvent(nextEvent: Omit<EventRecord, 'id' | 'created'>) {
    persistEvents([
      ...events,
      {
        ...nextEvent,
        id: makeId('event'),
        workspaceId: getActiveWorkspaceId() ?? 'default-workspace',
        created: makeCreatedDate(),
      },
    ]);
    setCreateOpen(false);
  }

  function deleteEvent(id: string) {
    const nextEvents = events.filter((event) => event.id !== id);
    persistEvents(nextEvents);
    if (getActiveEventId() === id) {
      setActiveEventId(nextEvents[0]?.id ?? '');
    }
    setActiveMenuId(null);
  }

  return (
    <DashboardShell active="Events">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Manage Events</h1>
            <p className="mt-3 text-xl text-slate-600">
              View, create, edit, and delete your events
            </p>
            <div className="mt-1 flex gap-2">
              <input
                placeholder="Search events..."
                className="h-10 w-[365px] rounded-md border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#352bff] focus:ring-2 focus:ring-[#352bff]/15"
              />
              <button className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium">
                All ({events.length})
              </button>
            </div>
          </header>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex min-h-10 w-full min-w-[190px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </button>
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              menuOpen={activeMenuId === event.id}
              onToggleMenu={() =>
                setActiveMenuId((current) => (current === event.id ? null : event.id))
              }
              onEdit={() => {
                setActiveMenuId(null);
                setEditEvent(event);
              }}
              onDelete={() => deleteEvent(event.id)}
              onSelect={() => {
                setActiveEventId(event.id);
                setSelectedEventId(event.id);
              }}
              selected={selectedEventId === event.id}
            />
          ))}
        </section>
      </div>

      {editEvent ? (
        <EditEventModal
          eventDetails={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdate={updateEvent}
        />
      ) : null}
      {createOpen ? (
        <CreateEventModal onClose={() => setCreateOpen(false)} onCreate={createEvent} />
      ) : null}
    </DashboardShell>
  );
}

function EventCard({
  event,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onSelect,
  selected,
}: {
  event: EventRecord;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <article
      className={`relative min-h-[294px] rounded-xl border bg-white p-6 shadow-sm shadow-slate-300/60 ${
        selected ? 'border-[#4338ff] ring-2 ring-[#4338ff]/20' : 'border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-black">{event.name}</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Organizer: {event.organizer}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </div>
          <p className="mt-5 text-xs text-slate-500">Created: {event.created}</p>
        </div>
        <button
          type="button"
          onClick={onToggleMenu}
          className="mt-36 rounded-md p-1 hover:bg-slate-100"
          aria-label="Event options"
          aria-expanded={menuOpen}
        >
          <EllipsisVertical className="h-5 w-5" />
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-6 top-[210px] z-20 w-[210px] rounded-md border border-slate-300 bg-white py-2 shadow-lg shadow-slate-300/70">
          <p className="px-3 pb-2 text-base font-medium">Actions</p>
          <button onClick={onEdit} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <Pencil className="h-4 w-4 text-slate-500" />
            Edit
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <KeyRound className="h-4 w-4 text-slate-500" />
            Integrations
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            <ClipboardCopy className="h-4 w-4 text-slate-500" />
            Copy Results Page URL
          </button>
          <button onClick={onDelete} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 text-slate-500" />
            Delete
          </button>
        </div>
      ) : null}

      <div className="mt-9 grid grid-cols-2 gap-2">
        <button className="flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-center text-sm font-medium leading-5 hover:bg-[#f4f3ff]">
          <KeyRound className="h-4 w-4" />
          Integrations
        </button>
        <button
          type="button"
          onClick={onSelect}
          className="flex min-h-9 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-center text-sm font-medium leading-5 hover:bg-[#f4f3ff]"
        >
          {selected ? 'Selected Event' : 'Select Event'}
        </button>
      </div>
    </article>
  );
}

function CreateEventModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (details: Omit<EventRecord, 'id' | 'created'>) => void;
}) {
  const [draft, setDraft] = useState<Omit<EventRecord, 'id' | 'created'>>({
    name: '',
    organizer: '',
    date: '',
    location: '',
    logoUrl: null,
    logoName: 'No logo selected.',
  });

  function updateDraft(key: keyof Omit<EventRecord, 'id' | 'created'>, value: string | null) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraft((current) => ({
      ...current,
      logoUrl: URL.createObjectURL(file),
      logoName: file.name,
    }));
  }

  return (
    <EventModal title="Create New Event" subtitle="Create a new event to get started." onClose={onClose}>
      <ModalInput label="Name" value={draft.name} onChange={(value) => updateDraft('name', value)} />
      <ModalInput label="Organizer" value={draft.organizer} onChange={(value) => updateDraft('organizer', value)} />
      <ModalInput label="Date(s)" value={draft.date} onChange={(value) => updateDraft('date', value)} />
      <ModalInput label="Location" value={draft.location} onChange={(value) => updateDraft('location', value)} />
      <LogoInput logoName={draft.logoName} logoUrl={draft.logoUrl} onChange={handleLogoChange} compact />
      <ModalActions
        primaryLabel="Create Event"
        onCancel={onClose}
        onPrimary={() =>
          onCreate({
            ...draft,
            name: draft.name || 'Untitled Event',
            organizer: draft.organizer || 'Organizer',
            date: draft.date || 'Date not set',
            location: draft.location || 'Location not set',
          })
        }
      />
    </EventModal>
  );
}

function EditEventModal({
  eventDetails,
  onClose,
  onUpdate,
}: {
  eventDetails: EventRecord;
  onClose: () => void;
  onUpdate: (details: EventRecord) => void;
}) {
  const [draft, setDraft] = useState(eventDetails);

  function updateDraft(key: keyof EventRecord, value: string | null) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDraft((current) => ({
      ...current,
      logoUrl: URL.createObjectURL(file),
      logoName: file.name,
    }));
  }

  return (
    <EventModal title="Edit Event" subtitle="Make changes to your event" onClose={onClose}>
      <ModalInput label="Name" value={draft.name} onChange={(value) => updateDraft('name', value)} />
      <ModalInput label="Organizer" value={draft.organizer} onChange={(value) => updateDraft('organizer', value)} />
      <ModalInput label="Date(s)" value={draft.date} onChange={(value) => updateDraft('date', value)} />
      <ModalInput label="Location" value={draft.location} onChange={(value) => updateDraft('location', value)} />
      <LogoInput logoName={draft.logoName} logoUrl={draft.logoUrl} onChange={handleLogoChange} />
      <ModalActions primaryLabel="Update Event" onCancel={onClose} onPrimary={() => onUpdate(draft)} />
    </EventModal>
  );
}

function EventModal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
      <section className="w-full max-w-[404px] rounded-lg border border-slate-300 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-600 hover:bg-slate-100">
            ×
          </button>
        </div>
        <form className="mt-8 space-y-4">{children}</form>
      </section>
    </div>
  );
}

function ModalInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid grid-cols-[82px_1fr] items-center gap-3">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-[#352bff] focus:ring-2 focus:ring-[#352bff]/15"
      />
    </label>
  );
}

function LogoInput({
  logoName,
  logoUrl,
  onChange,
  compact = false,
}: {
  logoName: string;
  logoUrl: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-[82px_1fr] items-start gap-3">
      <label className={compact ? 'pt-2 text-sm font-medium' : 'pt-11 text-sm font-medium'}>Event Logo</label>
      <div>
        <input type="file" accept="image/*" onChange={onChange} className="w-full text-sm" />
        {compact ? null : <p className="mt-2 text-xs text-slate-500">Preview</p>}
        {compact ? null : (
          <div className="mt-1 flex h-[124px] w-[122px] items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 p-1 text-xs text-slate-500">
            {logoUrl ? <img src={logoUrl} alt="Event logo preview" className="h-full w-full object-contain" /> : 'Event logo preview'}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">
          {compact ? logoName : `Current: ${logoName}`}
          <br />
          Max file size: 2 MB
        </p>
      </div>
    </div>
  );
}

function ModalActions({
  primaryLabel,
  onCancel,
  onPrimary,
}: {
  primaryLabel: string;
  onCancel: () => void;
  onPrimary: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-slate-50">
        Cancel
      </button>
      <button type="button" onClick={onPrimary} className="rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
        {primaryLabel}
      </button>
    </div>
  );
}

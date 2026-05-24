'use client';

import { Folder, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardShell } from '../components';
import { CategoryRecord, getCategories, makeCreatedDate, makeId, saveCategories } from '../event-store';
import { getActiveWorkspaceId } from '../../auth-store';
import { useActiveEvent } from '../use-active-event';

const sahityolsavCategories = [
  'Lower primary',
  'Upper primary',
  'High school',
  'Higher secondary',
  'Junior',
  'Senior',
  'General',
];

export default function CategoriesPage() {
  const { activeEvent, ready } = useActiveEvent();
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryRecord | null>(null);

  useEffect(() => {
    if (!activeEvent) return;
    setCategories(getCategories().filter((category) => category.eventId === activeEvent.id));
  }, [activeEvent]);

  function persistScopedCategories(nextScopedCategories: CategoryRecord[]) {
    if (!activeEvent) return;
    const otherCategories = getCategories().filter((category) => category.eventId !== activeEvent.id);
    saveCategories([...otherCategories, ...nextScopedCategories]);
    setCategories(nextScopedCategories);
  }

  function createCategory(name: string) {
    if (!activeEvent) return;
    persistScopedCategories([
      ...categories,
      {
        id: makeId('category'),
        workspaceId: getActiveWorkspaceId() ?? 'default-workspace',
        eventId: activeEvent.id,
        name,
        created: makeCreatedDate(),
      },
    ]);
    setCreateOpen(false);
  }

  function addSahityolsavCategories() {
    if (!activeEvent) return;

    const existingNames = new Set(
      categories.map((category) => category.name.trim().toLowerCase()),
    );
    const newCategories = sahityolsavCategories
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({
        id: makeId(`category-${name.toLowerCase().replace(/\s+/g, '-')}`),
        workspaceId: getActiveWorkspaceId() ?? 'default-workspace',
        eventId: activeEvent.id,
        name,
        created: makeCreatedDate(),
      }));

    persistScopedCategories([...categories, ...newCategories]);
  }

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="DATA:Categories"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="DATA:Categories">
      <div className="mx-auto max-w-[1640px]">
        <div className="flex flex-col items-start justify-between gap-6 xl:flex-row">
          <header>
            <h1 className="text-2xl font-black">Manage Categories</h1>
            <p className="mt-3 text-xl text-slate-600">
              View, create, edit, and delete categories for event:{' '}
              <span className="font-bold">{activeEvent.name}</span>
            </p>
          </header>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex min-h-10 w-full min-w-[210px] items-center justify-center gap-2 whitespace-normal rounded-lg bg-[#4338ff] px-5 py-2 text-center text-sm font-bold leading-5 text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6] sm:w-auto"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Create New Category</span>
            </button>
            <button
              type="button"
              onClick={addSahityolsavCategories}
              className="flex min-h-10 w-full min-w-[240px] items-center justify-center whitespace-normal rounded-md border border-slate-300 bg-white px-6 py-2 text-center text-sm font-medium leading-5 shadow-sm hover:bg-slate-50 sm:w-auto"
            >
              Add Sahityolsav Categories
            </button>
          </div>
        </div>

        {categories.length > 0 ? (
          <section className="mt-9 grid gap-6 xl:grid-cols-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="rounded-xl border border-slate-300 bg-white p-6 shadow-lg shadow-slate-300/40"
              >
                <h2 className="text-lg font-bold">{category.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Created: {category.created}</p>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={() => setEditCategory(category)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      persistScopedCategories(
                        categories.filter((item) => item.id !== category.id),
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="flex min-h-[430px] items-center justify-center text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200/60">
                <Folder className="h-7 w-7 text-slate-500" />
              </div>
              <h2 className="mt-5 text-xl font-black">No Categories Yet</h2>
              <p className="mt-4 text-base text-slate-600">
                You haven&apos;t created any categories yet. Get started by creating your first one!
              </p>
              <button type="button" onClick={() => setCreateOpen(true)} className="mt-7 rounded-lg bg-[#4338ff] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">
                Create Your First Category
              </button>
            </div>
          </section>
        )}
      </div>

      {createOpen ? <CreateCategoryModal onClose={() => setCreateOpen(false)} onCreate={createCategory} /> : null}
      {editCategory ? (
        <EditCategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onUpdate={(updatedCategory) => {
            persistScopedCategories(
              categories.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category,
              ),
            );
            setEditCategory(null);
          }}
        />
      ) : null}
    </DashboardShell>
  );
}

function CreateCategoryModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [categoryName, setCategoryName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
      <section className="w-full max-w-[404px] rounded-lg border border-slate-300 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">Create New Category</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Create a new category for the selected event.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-600 hover:bg-slate-100">×</button>
        </div>
        <form className="mt-8 space-y-4">
          <label className="grid grid-cols-[82px_1fr] items-center gap-3">
            <span className="text-sm font-medium">Name</span>
            <input autoFocus value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="e.g., Senior" className="h-10 rounded-md border border-[#4338ff] bg-white px-3 text-sm outline-none ring-2 ring-[#4338ff]/20" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => onCreate(categoryName || 'Untitled Category')} className="rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]">Create Category</button>
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EditCategoryModal({
  category,
  onClose,
  onUpdate,
}: {
  category: CategoryRecord;
  onClose: () => void;
  onUpdate: (category: CategoryRecord) => void;
}) {
  const [categoryName, setCategoryName] = useState(category.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-6">
      <section className="w-full max-w-[404px] rounded-lg border border-slate-300 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black">Edit Category</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Make changes to your category here. Click save when you&apos;re done.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
            aria-label="Close edit category modal"
          >
            ×
          </button>
        </div>

        <form className="mt-8 space-y-4">
          <label className="grid grid-cols-[82px_1fr] items-center gap-3">
            <span className="text-sm font-medium">Name</span>
            <input
              autoFocus
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="h-10 rounded-md border border-[#4338ff] bg-white px-3 text-sm outline-none ring-2 ring-[#4338ff]/20"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium shadow-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdate({ ...category, name: categoryName || category.name })
              }
              className="rounded-lg bg-[#4338ff] px-4 py-2 font-bold text-white shadow-sm shadow-indigo-200 hover:bg-[#372ee6]"
            >
              Update Category
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

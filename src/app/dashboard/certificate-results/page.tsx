'use client';

import { DashboardShell } from '../components';
import { useActiveEvent } from '../use-active-event';

export default function CertificateResultsPage() {
  const { activeEvent, ready } = useActiveEvent();

  if (!ready) return null;
  if (!activeEvent) return <DashboardShell active="CERTIFICATES:Results"><p>Please select an event first.</p></DashboardShell>;

  return (
    <DashboardShell active="CERTIFICATES:Results">
      <div className="mx-auto max-w-[1640px]">
        <header>
          <h1 className="text-2xl font-black">Certificate Results</h1>
          <p className="mt-3 text-xl text-slate-600">
            View generated certificates for:{' '}
            <span className="font-bold">{activeEvent.name}</span>
          </p>
        </header>

        <section className="mt-9 flex min-h-[172px] items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 text-center">
          <div>
            <h2 className="text-xl font-black">No Certificates Found</h2>
            <p className="mt-2 text-base">
              No certificates have been generated for this event yet.
            </p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

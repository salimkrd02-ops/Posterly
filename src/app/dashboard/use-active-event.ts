'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EventRecord, getActiveEvent } from './event-store';

export function useActiveEvent({ redirect = true } = {}) {
  const router = useRouter();
  const [activeEvent, setActiveEvent] = useState<EventRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const event = getActiveEvent();
    setActiveEvent(event);
    setReady(true);

    if (!event && redirect) {
      router.replace('/dashboard/events');
    }
  }, [redirect, router]);

  return { activeEvent, ready };
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setUserId, getUserId } from '@/app/lib/userId';

export function UserIdHandler({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urlUserId = searchParams.get('userId');
    const storedUserId = getUserId();

    if (urlUserId && urlUserId !== storedUserId) {
      setUserId(urlUserId);
      const newUrl = window.location.pathname + '?userId=' + encodeURIComponent(urlUserId);
      router.replace(newUrl, { scroll: false });
    } else if (!urlUserId && storedUserId) {
      const newUrl = window.location.pathname + '?userId=' + encodeURIComponent(storedUserId);
      router.replace(newUrl, { scroll: false });
    }

    setReady(true);
  }, [searchParams, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

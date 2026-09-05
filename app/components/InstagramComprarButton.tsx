'use client';

import { Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getUserId, setUserId } from '@/app/lib/userId';
import style from '@/app/styles/Home.module.css';
import { UTM } from '../lib/common';

export function InstagramComprarButton({ utm }: { utm: UTM }) {
  const router = useRouter();

  const handleClick = () => {
    let userId = getUserId();
    if (!userId) {
      userId =
        'user_' +
        Date.now() +
        '_' +
        Math.random().toString(36).substring(2, 11);
      setUserId(userId);
    }

    const params = new URLSearchParams({ userId });
    if (utm.source) params.set('utm_source', utm.source);
    if (utm.medium) params.set('utm_medium', utm.medium);
    if (utm.campaign) params.set('utm_campaign', utm.campaign);
    if (utm.content) params.set('utm_content', utm.content);

    router.push(`/comprar-inscritos-instagram?${params.toString()}`);
  };

  return (
    <button
      type='button'
      className={style.instagramButton}
      onClick={handleClick}
    >
      <Instagram size={18} />
      Comprar inscritos agora
    </button>
  );
}

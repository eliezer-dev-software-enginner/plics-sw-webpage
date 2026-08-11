'use client';

import { Instagram, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FOLLOWERS_TIERS, formatBRL } from '@/app/comprar-inscritos-instagram/constants';
import { getUserId, setUserId } from '@/app/lib/userId';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/NoveltyPopup.module.css';
import { UTM } from '../lib/common';

const DISMISSED_KEY = 'plics_seen_ig_followers_popup';

export function InstagramFollowersPopup({ utm }: { utm: UTM }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;
    setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }

  function handleGo() {
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

    localStorage.setItem(DISMISSED_KEY, 'true');
    router.push(`/comprar-inscritos-instagram?${params.toString()}`);
  }

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={dismiss}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button
          type='button'
          className={styles.closeButton}
          onClick={dismiss}
          aria-label='Fechar'
        >
          <X size={16} />
        </button>

        <div className={styles.banner}>
          <span className={styles.badge}>
            <Sparkles size={13} />
            Novidade
          </span>
          <h2 className={styles.title}>
            Agora dá pra comprar inscritos para o Instagram
          </h2>
        </div>

        <div className={styles.body}>
          <p className={styles.text}>
            Aumente a credibilidade do seu perfil com entrega gradual e
            segura, pagando via PIX.
          </p>

          <ul className={styles.priceList}>
            {FOLLOWERS_TIERS.map((tier) => (
              <li key={tier.quantity} className={styles.priceItem}>
                <span className={styles.priceQuantity}>
                  {tier.quantity.toLocaleString('pt-BR')} inscritos
                </span>
                <span className={styles.priceValue}>
                  {formatBRL(tier.price)}
                </span>
              </li>
            ))}
          </ul>

          <button type='button' className={styles.ctaButton} onClick={handleGo}>
            <Instagram size={18} />
            Comprar inscritos agora
          </button>

          <button type='button' className={styles.dismissLink} onClick={dismiss}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}

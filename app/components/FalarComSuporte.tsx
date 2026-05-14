'use client';

import { HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import styles from './FalarComSuporte.module.css';

export default function FalarComSuporteComponent() {
  return (
    <>
      {process.env.NEXT_PUBLIC_SUPORTE_CONTATO && (
        <div className={styles.suporte}>
          <HeadphonesIcon size={18} className={styles.suporteIcon} />
          <span className={styles.suporteText}>Precisa de ajuda?</span>
          <Link
            href={process.env.NEXT_PUBLIC_SUPORTE_CONTATO}
            className={styles.suporteLink}
            target='_blank'
          >
            Falar com suporte
          </Link>
        </div>
      )}
    </>
  );
}

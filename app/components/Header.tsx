import { Download, LifeBuoy, MoveRight } from 'lucide-react';
import Link from 'next/link';

import styles from '@/app/styles/header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href='/' className={styles.brand}>
          Plics-SW
        </Link>

        <nav className={styles.actions}>
          <a
            href={process.env.NEXT_PUBLIC_SUPORTE_CONTATO}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.ghostButton}
          >
            <LifeBuoy size={16} />
            <span className={styles.ghostButtonLabel}>Suporte</span>
          </a>

          <Link href='/#baixar' className={styles.ghostButton}>
            <Download size={16} />
            <span className={styles.ghostButtonLabel}>Baixar</span>
          </Link>

          <Link href='/comprar-plics-sw' className={styles.primaryButton}>
            Começar Agora
            <MoveRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

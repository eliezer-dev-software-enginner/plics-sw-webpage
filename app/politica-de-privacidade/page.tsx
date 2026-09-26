//app/politica-de-privacidade/page.tsx
import { ExternalLink, Mail, ShieldCheck } from 'lucide-react';

import type { Metadata } from 'next';

import { Header } from '@/app/components/Header';
import styles from '@/app/styles/politica.module.css';
import {
  POLICY_FOOTER_NOTE,
  POLICY_LEAD,
  POLICY_UPDATED_AT,
  policySections,
} from './constants';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Plics-SW',
  description:
    'Política de Privacidade do Plics SW: como o aplicativo coleta, utiliza, armazena e protege as informações dos usuários, de acordo com a LGPD.',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.section}>
        <div className={styles.inner}>
          <header className={styles.pageHeader}>
            <div className={styles.label}>Plics SW</div>
            <h1 className={styles.title}>Política de Privacidade</h1>

            <div className={styles.updatedAt}>
              <ShieldCheck size={14} />
              Última atualização: {POLICY_UPDATED_AT}
            </div>

            {POLICY_LEAD.map((text) => (
              <p key={text} className={styles.lead}>
                {text}
              </p>
            ))}
          </header>

          <div className={styles.card}>
            {policySections.map((section) => (
              <article key={section.id} className={styles.block} id={section.id}>
                <h2 className={styles.blockTitle}>
                  <span className={styles.blockNumber}>{section.number}</span>
                  {section.title}
                </h2>

                {section.paragraphs?.map((text) => (
                  <p key={text} className={styles.paragraph}>
                    {text}
                  </p>
                ))}

                {section.items && (
                  <ul className={styles.list}>
                    {section.items.map((item) => (
                      <li key={item} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.paragraphsAfter?.map((text) => (
                  <p key={text} className={styles.paragraph}>
                    {text}
                  </p>
                ))}

                {section.links && (
                  <div className={styles.links}>
                    {section.links.map((link) => {
                      const isMail = link.href.startsWith('mailto:');

                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          className={styles.linkButton}
                          {...(isMail
                            ? {}
                            : { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {isMail ? <Mail size={14} /> : <ExternalLink size={14} />}
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>

          <p className={styles.footerNote}>{POLICY_FOOTER_NOTE}</p>
        </div>
      </section>
    </div>
  );
}

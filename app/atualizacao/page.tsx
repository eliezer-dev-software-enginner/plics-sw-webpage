import { CheckCircle, MoveRight } from 'lucide-react';

import { DownloadButtons } from '@/app/components/DownloadButtons';
import { Header } from '@/app/components/Header';
import { getLatestRelease } from '@/app/lib/githubRelease';
import styles from '@/app/styles/atualizacao.module.css';

export const metadata = {
  title: 'Atualização — Plics-SW',
};

export default async function AtualizacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ versao?: string }>;
}) {
  const { versao } = await searchParams;
  const release = await getLatestRelease();
  const upToDate = !!versao && !!release?.version && versao === release.version;

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.label}>Atualização do Plics SW</div>

          {upToDate ? (
            <>
              <h1 className={styles.title}>Você já está atualizado!</h1>
              <div className={styles.upToDate}>
                <CheckCircle size={18} />
                Versão {versao} é a mais recente
              </div>
              <p className={styles.subtitle}>
                Não precisa baixar nada — seu Plics SW já está na última
                versão disponível.
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>
                {versao ? 'Nova versão disponível!' : 'Baixe a versão mais recente'}
              </h1>

              {versao && release?.version && (
                <div className={styles.versionsCard}>
                  <div className={styles.versionBlock}>
                    <span className={styles.versionLabel}>Sua versão</span>
                    <span className={styles.versionValue}>{versao}</span>
                  </div>
                  <MoveRight className={styles.arrow} size={20} />
                  <div className={styles.versionBlock}>
                    <span className={styles.versionLabel}>Nova versão</span>
                    <span className={`${styles.versionValue} ${styles.versionValueNew}`}>
                      {release.version}
                    </span>
                  </div>
                </div>
              )}

              <p className={styles.subtitle}>
                Baixe o instalador abaixo, feche o Plics SW e instale por cima
                da versão atual — seus dados e sua licença continuam intactos.
              </p>

              {release && <DownloadButtons release={release} />}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

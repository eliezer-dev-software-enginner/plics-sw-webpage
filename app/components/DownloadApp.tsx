import { Download } from 'lucide-react';

import { getLatestRelease } from '@/app/lib/githubRelease';
import styles from '@/app/styles/download.module.css';

// Download livre do instalador (Windows/Linux) — sempre a última release do
// GitHub. A licença (paga) é o que libera o uso completo do app, não o download.
export async function DownloadApp() {
  const release = await getLatestRelease();

  if (!release || (!release.downloadWindows && !release.downloadLinux)) {
    return null;
  }

  return (
    <section className={styles.section} id='baixar'>
      <div className={styles.inner}>
        <div className={styles.label}>Download gratuito</div>
        <h2 className={styles.title}>Baixe o Plics SW agora</h2>
        <p className={styles.subtitle}>
          O instalador é livre para Windows e Linux. Baixe, instale e adquira
          sua licença vitalícia quando quiser liberar o uso completo.
        </p>

        <div className={styles.grid}>
          {release.downloadWindows && (
            <a
              href={release.downloadWindows}
              className={styles.button}
              rel='noopener noreferrer'
            >
              <div className={styles.iconWrap}>
                <Download size={20} />
              </div>
              <div className={styles.buttonText}>
                <span className={styles.buttonLabel}>Download</span>
                <span className={styles.buttonPlatform}>Windows (.msi)</span>
              </div>
            </a>
          )}

          {release.downloadLinux && (
            <a
              href={release.downloadLinux}
              className={styles.button}
              rel='noopener noreferrer'
            >
              <div className={styles.iconWrap}>
                <Download size={20} />
              </div>
              <div className={styles.buttonText}>
                <span className={styles.buttonLabel}>Download</span>
                <span className={styles.buttonPlatform}>Linux (.deb)</span>
              </div>
            </a>
          )}
        </div>

        {release.version && (
          <p className={styles.version}>Versão {release.version}</p>
        )}
      </div>
    </section>
  );
}

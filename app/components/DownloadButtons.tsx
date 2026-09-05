import { Download } from 'lucide-react';

import { LatestRelease } from '@/app/lib/githubRelease';
import styles from '@/app/styles/download.module.css';

// Grid de botões Windows/Linux, compartilhado entre a seção de download da home
// (DownloadApp) e a página /atualizacao (link enviado pelo próprio app quando
// encontra uma versão nova).
export function DownloadButtons({ release }: { release: LatestRelease }) {
  if (!release.downloadWindows && !release.downloadLinux) return null;

  return (
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
  );
}

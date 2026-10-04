import { Store } from 'lucide-react';

import { LicensedDownloadForm } from '@/app/components/LicensedDownloadForm';
import { getLatestRelease } from '@/app/lib/githubRelease';
import styles from '@/app/styles/download.module.css';

const MICROSOFT_STORE_URL =
  'https://apps.microsoft.com/store/detail/9P20X36J46TM?cid=DevShareMCLPCS';

export async function DownloadApp() {
  const release = await getLatestRelease();

  return (
    <section className={styles.section} id='baixar'>
      <div className={styles.inner}>
        <div className={styles.label}>Download do Plics SW</div>
        <h2 className={styles.title}>Baixe o Plics SW</h2>
        <p className={styles.subtitle}>
          Instale no Windows pela Microsoft Store de forma rápida e segura.
        </p>

        <div className={styles.grid}>
          <a
            href={MICROSOFT_STORE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className={`${styles.button} ${styles.storeButton}`}
          >
            <div className={styles.iconWrap}>
              <Store size={20} />
            </div>
            <div className={styles.buttonText}>
              <span className={styles.buttonLabel}>Disponível na</span>
              <span className={styles.buttonPlatform}>Microsoft Store</span>
            </div>
          </a>
        </div>

        {release && (release.downloadWindows || release.downloadLinux) && (
          <div className={styles.licensedDownload}>
            <p className={styles.licensedDownloadTitle}>
              Já possui uma licença ou usa Linux?
            </p>
            <LicensedDownloadForm
              hasWindows={Boolean(release.downloadWindows)}
              hasLinux={Boolean(release.downloadLinux)}
            />
          </div>
        )}

        {release?.version && (
          <p className={styles.version}>Versão {release.version}</p>
        )}
      </div>
    </section>
  );
}

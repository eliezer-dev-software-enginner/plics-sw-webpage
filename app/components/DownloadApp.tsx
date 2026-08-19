import { DownloadButtons } from '@/app/components/DownloadButtons';
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

        <DownloadButtons release={release} />

        {release.version && (
          <p className={styles.version}>Versão {release.version}</p>
        )}
      </div>
    </section>
  );
}

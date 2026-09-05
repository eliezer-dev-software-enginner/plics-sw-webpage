const REPO = 'eliezer-dev-software-enginner/plics-sw';

export type LatestRelease = {
  version: string;
  downloadWindows: string | null;
  downloadLinux: string | null;
};

type GithubAsset = {
  name: string;
  browser_download_url: string;
};

// Sempre busca a última release publicada no GitHub (não draft, não pre-release),
// em vez de depender de um link fixo configurado manualmente no .env que ficava
// desatualizado a cada nova versão do app.
export async function getLatestRelease(): Promise<LatestRelease | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    const assets: GithubAsset[] = data.assets ?? [];

    const downloadWindows =
      assets.find((a) => /\.(msi|exe)$/i.test(a.name))?.browser_download_url ??
      null;
    const downloadLinux =
      assets.find((a) => /\.(deb|appimage)$/i.test(a.name))
        ?.browser_download_url ?? null;

    return {
      version:
        typeof data.tag_name === 'string'
          ? data.tag_name.replace(/^v/i, '')
          : '',
      downloadWindows,
      downloadLinux,
    };
  } catch (error) {
    console.error('Erro ao buscar a última release do GitHub:', error);
    return null;
  }
}

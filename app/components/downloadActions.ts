'use server';

import { redirect } from 'next/navigation';

import { getLatestRelease } from '@/app/lib/githubRelease';

export type DownloadState = {
  error: string | null;
};

const LICENCAS_PRODUCAO = [
  '5fZl2OI7f2ksjc8YRzBRR0ycjsCzycXyrX',
  'Fh0OofMRVVE30elP6KvES4AuBBEYcK8qZIyXzL',
  '5Zlix2GJbCqM2vYcxWSHk3E5YI8bf2ePHAxaWK',
  'fBiO4l1qmTj3WdwhbU5At7UTAWiBuoBfk1FMXo',
] as const;

// TODO: substituir as licenças hardcoded por uma verificação forte no backend,
// vinculada à licença emitida e com controles contra abuso/reutilização indevida.
export async function requestLicensedDownload(
  _previousState: DownloadState,
  formData: FormData,
): Promise<DownloadState> {
  const license = String(formData.get('license') ?? '').trim();
  const platform = formData.get('platform');

  if (!license) {
    return { error: 'Informe sua licença para continuar.' };
  }

  if (!LICENCAS_PRODUCAO.includes(license as (typeof LICENCAS_PRODUCAO)[number])) {
    return { error: 'Licença inválida. Confira a chave informada e tente novamente.' };
  }

  if (platform !== 'windows' && platform !== 'linux') {
    return { error: 'Selecione uma plataforma válida.' };
  }

  const release = await getLatestRelease();
  const downloadUrl =
    platform === 'windows'
      ? release?.downloadWindows
      : release?.downloadLinux;

  if (!downloadUrl) {
    return {
      error: 'O instalador não está disponível no momento. Tente novamente mais tarde.',
    };
  }

  redirect(downloadUrl);
}

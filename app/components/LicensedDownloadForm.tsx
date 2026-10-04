'use client';

import { Download, KeyRound } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { requestLicensedDownload } from '@/app/components/downloadActions';
import type { DownloadState } from '@/app/components/downloadActions';
import styles from '@/app/styles/download.module.css';

const initialState: DownloadState = { error: null };

function DownloadButton({
  platform,
  label,
}: {
  platform: 'windows' | 'linux';
  label: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      name='platform'
      value={platform}
      className={styles.button}
      disabled={pending}
    >
      <div className={styles.iconWrap}>
        <Download size={20} />
      </div>
      <div className={styles.buttonText}>
        <span className={styles.buttonLabel}>
          {pending ? 'Validando...' : 'Download'}
        </span>
        <span className={styles.buttonPlatform}>{label}</span>
      </div>
    </button>
  );
}

export function LicensedDownloadForm({
  hasWindows,
  hasLinux,
}: {
  hasWindows: boolean;
  hasLinux: boolean;
}) {
  const [state, formAction] = useActionState(
    requestLicensedDownload,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor='download-license' className={styles.inputLabel}>
        Sua licença
      </label>
      <div className={styles.inputWrap}>
        <KeyRound size={19} aria-hidden='true' />
        <input
          id='download-license'
          name='license'
          type='text'
          className={styles.input}
          placeholder='Digite sua chave de licença'
          autoComplete='off'
          spellCheck={false}
          required
          aria-invalid={state.error ? 'true' : 'false'}
          aria-describedby={state.error ? 'download-error' : undefined}
        />
      </div>

      {state.error && (
        <p id='download-error' className={styles.error} role='alert'>
          {state.error}
        </p>
      )}

      <div className={styles.grid}>
        {hasWindows && (
          <DownloadButton platform='windows' label='Windows (.msi)' />
        )}
        {hasLinux && <DownloadButton platform='linux' label='Linux (.deb)' />}
      </div>
    </form>
  );
}

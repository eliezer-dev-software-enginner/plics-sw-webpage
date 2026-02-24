import { CheckCircle, Copy, Download, HeadphonesIcon } from 'lucide-react';
import {
  checkUserHasAccess,
  createPixPayment,
  grantTestAccess,
} from './actions';

import Link from 'next/link';
import PixPayment from './PixPayment';
import styles from '@/app/styles/comprar.module.css';

export const dynamic = 'force-dynamic';

async function getPixData() {
  const userId = 'guest_' + Date.now();
  const result = await createPixPayment(userId);
  return result;
}

async function getUserAccess(userId: string) {
  const result = await checkUserHasAccess(userId);
  return result;
}

async function simulatePurchase(userId: string) {
  'use server';
  await grantTestAccess(userId);
}

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; test?: string }>;
}) {
  const params = await searchParams;
  const userId = params.userId || 'guest_' + Date.now();

  if (params.test === 'success') {
    await simulatePurchase(userId);
  }

  const access = await getUserAccess(userId);

  if (access.hasAccess) {
    return (
      <div className={styles.container}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.successBadge}>
              <CheckCircle size={16} />
              <span>Compra confirmada</span>
            </div>
            <h1 className={styles.title}>Obrigado pela compra!</h1>
            <p className={styles.subtitle}>
              Sua licença e downloads estão prontos abaixo
            </p>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Sua Licença</h3>
                <span className={styles.cardBadge}>Ativa</span>
              </div>
              <div className={styles.licenseBox}>
                <code className={styles.license}>{access.license}</code>
                <button className={styles.copyBtn} title='Copiar licença'>
                  <Copy size={16} />
                </button>
              </div>
              <p className={styles.licenseHint}>
                Guarde esta chave em local seguro
              </p>
            </div>

            <div className={styles.downloadsCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Downloads</h3>
              </div>
              <div className={styles.downloadGrid}>
                {access.downloadWindows && (
                  <Link
                    href={access.downloadWindows}
                    className={styles.downloadButton}
                    target='_blank'
                  >
                    <div className={styles.downloadIcon}>
                      <Download size={20} />
                    </div>
                    <div className={styles.downloadText}>
                      <span className={styles.downloadLabel}>Download</span>
                      <span className={styles.downloadPlatform}>Windows</span>
                    </div>
                  </Link>
                )}
                {access.downloadLinux && (
                  <Link
                    href={access.downloadLinux}
                    className={styles.downloadButton}
                    target='_blank'
                  >
                    <div className={styles.downloadIcon}>
                      <Download size={20} />
                    </div>
                    <div className={styles.downloadText}>
                      <span className={styles.downloadLabel}>Download</span>
                      <span className={styles.downloadPlatform}>Linux</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {process.env.SUPORTE_CONTATO && (
              <div className={styles.suporte}>
                <HeadphonesIcon size={18} className={styles.suporteIcon} />
                <span className={styles.suporteText}>Precisa de ajuda?</span>
                <Link
                  href={process.env.SUPORTE_CONTATO}
                  className={styles.suporteLink}
                  target='_blank'
                >
                  Falar com suporte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const pixData = await getPixData();

  return (
    <div className={styles.container}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.preBadge}>
            <span className={styles.dot} />
            <span>Pagamento seguro via PIX</span>
          </div>
          <h1 className={styles.title}>Adquira seu aplicativo agora</h1>
          <p className={styles.subtitle}>
            Licença entregue instantaneamente após a confirmação do pagamento
          </p>
        </div>

        <div className={styles.wrapper}>
          <PixPayment pixData={pixData} />
        </div>
      </div>
    </div>
  );
}

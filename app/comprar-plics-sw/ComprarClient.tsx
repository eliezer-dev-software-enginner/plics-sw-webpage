'use client';

import { checkUserHasAccess, createPixPayment, grantTestAccess } from './actions';
import PixPayment from './PixPayment';
import styles from '@/app/styles/comprar.module.css';
import { CheckCircle, Copy, Download, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '@/app/lib/userId';
import { useEffect, useState } from 'react';

interface AccessData {
  hasAccess: boolean;
  license: string | null;
  downloadWindows: string | null;
  downloadLinux: string | null;
}

interface PixData {
  success: boolean;
  paymentId?: string;
  qrCodeBase64?: string | null;
  qrCode?: string | null;
  status?: string;
  error?: string;
}

export default function ComprarClient({ testMode }: { testMode?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessData, setAccessData] = useState<AccessData | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);

  useEffect(() => {
    async function checkAccess() {
      const userId = getUserId();
      
      if (testMode && userId) {
        await grantTestAccess(userId);
      }

      const result = await checkUserHasAccess(userId || '');
      setHasAccess(result.hasAccess);
      setAccessData({
        hasAccess: result.hasAccess,
        license: result.license || null,
        downloadWindows: result.downloadWindows || null,
        downloadLinux: result.downloadLinux || null,
      });

      if (!result.hasAccess) {
        const pixResult = await createPixPayment(userId || 'guest_' + Date.now());
        setPixData(pixResult);
      }

      setLoading(false);
    }

    checkAccess();
  }, [testMode]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccess && accessData) {
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
                <code className={styles.license}>{accessData.license}</code>
                <button 
                  className={styles.copyBtn} 
                  title='Copiar licença'
                  onClick={() => accessData.license && navigator.clipboard.writeText(accessData.license)}
                >
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
                {accessData.downloadWindows && (
                  <Link
                    href={accessData.downloadWindows}
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
                {accessData.downloadLinux && (
                  <Link
                    href={accessData.downloadLinux}
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

            {process.env.NEXT_PUBLIC_SUPORTE_CONTATO && (
              <div className={styles.suporte}>
                <HeadphonesIcon size={18} className={styles.suporteIcon} />
                <span className={styles.suporteText}>Precisa de ajuda?</span>
                <Link
                  href={process.env.NEXT_PUBLIC_SUPORTE_CONTATO}
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
          {pixData && <PixPayment pixData={pixData} />}
        </div>
      </div>
    </div>
  );
}

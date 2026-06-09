//app/comprar-plics-sw/ComprarClient.tsx

'use client';

import { getUserId, savePaymentId, setUserId } from '@/app/lib/userId';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  checkUserHasAccess,
  createPixPayment,
  grantTestAccess,
  syncPaymentStatus,
} from './actions';

import styles from '@/app/styles/comprar.module.css';
import Link from 'next/link';
import FalarComSuporteComponent from '../components/FalarComSuporte';
import PixPayment from './PixPayment';

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

export default function ComprarClient({
  testMode,
  initialPaymentId,
  userIdFromUrl,
}: {
  testMode?: boolean;
  initialPaymentId?: string;
  userIdFromUrl?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessData, setAccessData] = useState<AccessData | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        let userId = userIdFromUrl || getUserId();

        if (!userId) {
          userId = getUserId();
        }

        if (userIdFromUrl && userIdFromUrl !== getUserId()) {
          setUserId(userIdFromUrl);
        }

        if (testMode && userId) {
          await grantTestAccess(userId);
        }

        const result = await checkUserHasAccess(userId || '');

        if (result.hasAccess) {
          setHasAccess(true);
          setAccessData({
            hasAccess: result.hasAccess,
            license: result.license || null,
            downloadWindows: result.downloadWindows || null,
            downloadLinux: result.downloadLinux || null,
          });
          return;
        }

        if (initialPaymentId) {
          savePaymentId(initialPaymentId);

          const syncResult = await syncPaymentStatus(
            initialPaymentId,
            userId || '',
          );

          if (syncResult.accessGranted) {
            savePaymentId(initialPaymentId);
            window.location.reload();
            return;
          }

          if (syncResult.isExpired) {
            const pixResult = await createPixPayment(
              userId || 'guest_' + Date.now(),
            );
            setPixData(pixResult);

            if (pixResult.paymentId) {
              savePaymentId(pixResult.paymentId);
              const url = new URL(window.location.href);
              url.searchParams.set('paymentId', pixResult.paymentId);
              window.history.replaceState({}, '', url.toString());
            }
          } else {
            setPixData({
              success: true,
              paymentId: initialPaymentId,
              qrCodeBase64: syncResult.qrCodeBase64 ?? null,
              qrCode: syncResult.qrCode ?? null,
              status: syncResult.status || 'pending',
            });
          }
        } else {
          const pixResult = await createPixPayment(
            userId || 'guest_' + Date.now(),
          );
          setPixData(pixResult);

          if (pixResult.paymentId) {
            savePaymentId(pixResult.paymentId);
            const url = new URL(window.location.href);
            url.searchParams.set('paymentId', pixResult.paymentId);
            window.history.replaceState({}, '', url.toString());
          }
        }
      } catch (error) {
        setPixData({
          success: false,
          error: error instanceof Error ? error.message : 'Erro inesperado',
        });
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [testMode, initialPaymentId, userIdFromUrl]);

  const handleCheckPayment = async () => {
    if (!pixData?.paymentId) return;

    setCheckingPayment(true);
    const userId = getUserId();
    const result = await syncPaymentStatus(pixData.paymentId, userId || '');

    if (result.accessGranted) {
      savePaymentId(pixData.paymentId);
      window.location.reload();
      return;
    }

    setCheckingPayment(false);
  };

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
                  onClick={() =>
                    accessData.license &&
                    navigator.clipboard.writeText(accessData.license)
                  }
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

            <FalarComSuporteComponent />
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

          {pixData?.paymentId && (
            <button
              onClick={handleCheckPayment}
              disabled={checkingPayment}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
              {checkingPayment
                ? 'Verificando...'
                : 'Já paguei! Verificar pagamento'}
            </button>
          )}

          <FalarComSuporteComponent />
        </div>
      </div>
    </div>
  );
}

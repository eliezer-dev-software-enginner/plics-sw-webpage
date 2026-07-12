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
import Image from 'next/image';
import Link from 'next/link';
import { PixPaymentResult } from 'pix-payment';
import FalarComSuporteComponent from '../components/FalarComSuporte';
import PixPaymentHolder from './components/pix-payment-holder';

interface AccessData {
  hasAccess: boolean;
  license: string | null;
  downloadWindows: string | null;
  downloadLinux: string | null;
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
  const [pixData, setPixData] = useState<PixPaymentResult | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerExpired, setTimerExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasAccess || timerExpired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasAccess, timerExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
        console.log(result);

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

            const paymentId = pixResult.data?.paymentId;
            if (paymentId) {
              savePaymentId(paymentId);
              const url = new URL(window.location.href);
              url.searchParams.set('paymentId', paymentId);
              window.history.replaceState({}, '', url.toString());
            }
          } else {
            setPixData({
              success: true,
              error: null,
              data: {
                paymentId: initialPaymentId,
                qrCodeBase64: syncResult.qrCodeBase64 ?? null,
                qrCode: syncResult.qrCode ?? null,
                status: syncResult.status || 'pending',
              },
            });
          }
        } else {
          const pixResult = await createPixPayment(
            userId || 'guest_' + Date.now(),
          );

          setPixData(pixResult);
          const paymentId = pixResult.data?.paymentId;
          if (paymentId) {
            savePaymentId(paymentId);
            const url = new URL(window.location.href);
            url.searchParams.set('paymentId', paymentId);
            window.history.replaceState({}, '', url.toString());
          }
        }
      } catch (error: any) {
        setPixData(null);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [testMode, initialPaymentId, userIdFromUrl]);

  const handleCheckPayment = async () => {
    const paymentId = pixData?.data?.paymentId;
    if (paymentId) return;

    setCheckingPayment(true);
    const userId = getUserId();
    const result = await syncPaymentStatus(paymentId!, userId || '');

    if (result.accessGranted) {
      savePaymentId(paymentId!);
      window.location.reload();
      return;
    }

    setCheckingPayment(false);
  };

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
          {!timerExpired && (
            <div className={styles.urgencyCard}>
              <div className={styles.urgencyTimer}>
                <span className={styles.urgencyTimerLabel}>
                  Oferta expira em
                </span>
                <span className={styles.urgencyTimerValue}>
                  {String(minutes).padStart(2, '0')}:
                  {String(seconds).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.urgencyContent}>
                <div className={styles.urgencyImageWrap}>
                  <Image
                    src='/banner_vertical_anuncio.png'
                    width={380}
                    height={676}
                    alt='Banner Plics SW'
                    className={styles.urgencyImage}
                  />
                </div>

                <div className={styles.urgencyTextContent}>
                  <p className={styles.urgencyHeadline}>
                    🚨{' '}
                    <strong>
                      Seu concorrente já sabe exatamente o que tem em estoque. E
                      você?
                    </strong>
                  </p>

                  <p className={styles.urgencyBody}>
                    Enquanto você perde tempo procurando produtos, conferindo
                    preços manualmente e corrigindo erros de cadastro, outros
                    negócios estão vendendo mais e atendendo melhor.
                  </p>

                  <p className={styles.urgencyBody}>
                    Cada produto sem cadastro, preço errado ou estoque
                    desatualizado significa dinheiro saindo do seu bolso.
                  </p>

                  <p className={styles.urgencyBody}>
                    Com o <strong>Plics SW</strong>, você cadastra seus produtos
                    de forma rápida e organizada, controla o estoque em tempo
                    real e mantém todas as informações do seu negócio em um só
                    lugar.
                  </p>

                  <ul className={styles.urgencyList}>
                    <li>✅ Cadastro completo de produtos</li>
                    <li>✅ Controle de estoque simplificado</li>
                    <li>✅ Organização de categorias e preços</li>
                    <li>✅ Menos erros e mais produtividade</li>
                    <li>✅ Compra única, sem mensalidades</li>
                  </ul>

                  <p className={styles.urgencyBody}>
                    <strong>Não fique para trás.</strong>
                  </p>

                  <p className={styles.urgencyBody}>
                    Quem organiza melhor o negócio toma decisões mais rápidas,
                    atende melhor os clientes e vende mais.
                  </p>

                  <p className={styles.urgencyFooter}>
                    🔥 Comece hoje mesmo a profissionalizar sua gestão com o
                    Plics SW.
                  </p>

                  <p className={styles.urgencyTagline}>
                    Plics SW — Menos planilhas. Mais controle. Mais resultados.
                  </p>
                </div>
              </div>
            </div>
          )}

          <PixPaymentHolder
            loading={loading}
            pixData={pixData}
            handleCheckPayment={handleCheckPayment}
            checkingPayment={checkingPayment}
            errorMessage={errorMessage}
          />

          <FalarComSuporteComponent />
        </div>
      </div>
    </div>
  );
}

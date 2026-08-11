'use client';

import {
  clearInstagramFollowersPaymentId,
  getSavedInstagramFollowersPaymentId,
  getUserId,
  saveInstagramFollowersPaymentId,
  setUserId,
} from '@/app/lib/userId';
import { CheckCircle, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  createInstagramFollowersPixPayment,
  getInstagramOrder,
  refreshInstagramOrderStatus,
  syncInstagramPaymentStatus,
} from './actions';

import type { InstagramFollowersOrder } from '@prisma/client';
import styles from '@/app/styles/comprarInstagram.module.css';
import Image from 'next/image';
import { PixPaymentResult } from 'pix-payment';
import { toast } from 'react-toastify';
import FalarComSuporteComponent from '../components/FalarComSuporte';
import { UTM } from '../lib/common';
import PixPaymentHolder from './components/pix-payment-holder';
import { FOLLOWERS_TIERS, formatBRL, getTierByQuantity } from './constants';
import { installTestModeConsoleFlag, isTestModeEnabled } from './testMode';

type Phase = 'loading' | 'form' | 'payment' | 'success';

export default function ComprarClient({
  initialPaymentId,
  userIdFromUrl,
  utm,
}: {
  initialPaymentId?: string;
  userIdFromUrl?: string;
  utm: UTM;
}) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(
    null,
  );
  const [instagramLink, setInstagramLink] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixPaymentResult | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [orderData, setOrderData] = useState<InstagramFollowersOrder | null>(
    null,
  );
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    installTestModeConsoleFlag();
    setTestMode(isTestModeEnabled());
  }, []);

  useEffect(() => {
    async function init() {
      try {
        let userId = userIdFromUrl || getUserId();
        if (!userId) userId = getUserId();

        if (userIdFromUrl && userIdFromUrl !== getUserId()) {
          setUserId(userIdFromUrl);
        }

        const pid = initialPaymentId || getSavedInstagramFollowersPaymentId();

        if (pid) {
          await loadPayment(pid);
        } else {
          setPhase('form');
        }
      } catch (error: any) {
        setErrorMessage(error.message);
        setPhase('form');
      }
    }

    init();
  }, [initialPaymentId, userIdFromUrl]);

  async function loadPayment(pid: string) {
    setPaymentId(pid);

    const result = await syncInstagramPaymentStatus(pid);

    if (!result.success) {
      clearInstagramFollowersPaymentId();
      setPhase('form');
      return;
    }

    if (result.accessGranted) {
      saveInstagramFollowersPaymentId(pid);
      setOrderData((result.order as InstagramFollowersOrder) ?? null);
      setPhase('success');
      return;
    }

    if (result.isExpired) {
      clearInstagramFollowersPaymentId();
      setPhase('form');
      return;
    }

    const order = await getInstagramOrder(pid);
    setOrderData(order);

    setPixData({
      success: true,
      error: null,
      data: {
        paymentId: pid,
        qrCodeBase64: result.qrCodeBase64 ?? null,
        qrCode: result.qrCode ?? null,
        status: result.status || 'pending',
      },
    });

    saveInstagramFollowersPaymentId(pid);
    setPhase('payment');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!selectedQuantity) {
      setFormError('Selecione a quantidade de inscritos');
      return;
    }

    if (!instagramLink.trim()) {
      setFormError('Informe o link ou @usuário do seu perfil do Instagram');
      return;
    }

    setSubmitting(true);

    try {
      const userId = getUserId() || `guest_${Date.now()}`;

      const pixResult = await createInstagramFollowersPixPayment(
        userId,
        instagramLink,
        selectedQuantity,
        utm,
        isTestModeEnabled(),
      );

      setPixData(pixResult);

      const pid = pixResult.data?.paymentId;

      if (pid) {
        saveInstagramFollowersPaymentId(pid);
        setPaymentId(pid);

        const url = new URL(window.location.href);
        url.searchParams.set('paymentId', pid);
        window.history.replaceState({}, '', url.toString());

        const order = await getInstagramOrder(pid);
        setOrderData(order);
      }

      setPhase('payment');
    } catch (error: any) {
      setFormError(error.message || 'Erro ao gerar pagamento');
    } finally {
      setSubmitting(false);
    }
  }

  const handleCheckPayment = async () => {
    if (!paymentId) return;

    setCheckingPayment(true);
    const result = await syncInstagramPaymentStatus(paymentId);

    if (result.accessGranted) {
      setOrderData((result.order as InstagramFollowersOrder) ?? null);
      setPhase('success');
      setCheckingPayment(false);
      return;
    }

    setCheckingPayment(false);
  };

  const handleRefreshStatus = async () => {
    if (!paymentId) return;

    setRefreshingStatus(true);
    const result = await refreshInstagramOrderStatus(paymentId);

    if (result.success) {
      const order = await getInstagramOrder(paymentId);
      setOrderData(order);
    } else {
      toast.error(result.error || 'Erro ao consultar status do pedido', {
        position: 'bottom-center',
        autoClose: 3000,
      });
    }

    setRefreshingStatus(false);
  };

  if (phase === 'loading') {
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

  if (phase === 'success') {
    return (
      <div className={styles.container}>
        {testMode && (
          <div className={styles.testModeBadge}>🧪 MODO TESTE</div>
        )}
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.successBadge}>
              <CheckCircle size={16} />
              <span>Pagamento confirmado</span>
            </div>
            <h1 className={styles.title}>Pedido enviado!</h1>
            <p className={styles.subtitle}>
              Seus inscritos começam a chegar em breve. Acompanhe o status
              abaixo
            </p>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Seu pedido</h3>
                <span
                  className={`${styles.statusBadge} ${getStatusBadgeClass(orderData?.status)}`}
                >
                  {getStatusLabel(orderData?.status)}
                </span>
              </div>

              <div className={styles.summaryGrid}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Quantidade</span>
                  <span className={styles.summaryValue}>
                    {orderData?.quantity
                      ? `${orderData.quantity.toLocaleString('pt-BR')} inscritos`
                      : '-'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Perfil</span>
                  <span className={styles.summaryValue}>
                    {orderData?.instagramLink || '-'}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Valor pago</span>
                  <span className={styles.summaryValue}>
                    {orderData?.amount ? formatBRL(orderData.amount) : '-'}
                  </span>
                </div>
                {orderData?.smmOrderId && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Nº do pedido</span>
                    <span className={styles.summaryValue}>
                      {orderData.smmOrderId}
                    </span>
                  </div>
                )}
                {orderData?.smmStatus && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      Status no painel
                    </span>
                    <span className={styles.summaryValue}>
                      {orderData.smmStatus}
                    </span>
                  </div>
                )}
              </div>

              {orderData?.status === 'error' && (
                <p className={styles.formError} style={{ marginTop: '1rem' }}>
                  Houve um problema ao enviar seu pedido ao painel. Nossa
                  equipe de suporte já foi notificada — fale conosco abaixo
                  para agilizar.
                </p>
              )}

              {orderData?.smmOrderId && (
                <button
                  onClick={handleRefreshStatus}
                  disabled={refreshingStatus}
                  className={styles.refreshButton}
                >
                  {refreshingStatus
                    ? 'Consultando...'
                    : 'Atualizar status do pedido'}
                </button>
              )}
            </div>

            <FalarComSuporteComponent />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'payment') {
    const price = orderData?.amount ?? 0;
    const quantity = orderData?.quantity ?? selectedQuantity ?? 0;

    return (
      <div className={styles.container}>
        {testMode && (
          <div className={styles.testModeBadge}>🧪 MODO TESTE</div>
        )}
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.preBadge}>
              <span className={styles.dot} />
              <span>Pagamento seguro via PIX</span>
            </div>
            <h1 className={styles.title}>Finalize seu pagamento</h1>
            <p className={styles.subtitle}>
              Assim que o PIX for confirmado, enviamos seu pedido
              automaticamente para entrega
            </p>
          </div>

          <div className={styles.wrapper}>
            {orderData && (
              <div className={styles.card}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Quantidade</span>
                    <span className={styles.summaryValue}>
                      {quantity.toLocaleString('pt-BR')} inscritos
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Perfil</span>
                    <span className={styles.summaryValue}>
                      {orderData.instagramLink}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <PixPaymentHolder
              loading={false}
              pixData={pixData}
              handleCheckPayment={handleCheckPayment}
              checkingPayment={checkingPayment}
              errorMessage={errorMessage}
              price={price}
              quantity={quantity}
            />

            <FalarComSuporteComponent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {testMode && <div className={styles.testModeBadge}>🧪 MODO TESTE</div>}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.preBadge}>
            <Instagram size={14} />
            <span>Entrega gradual e segura</span>
          </div>
          <h1 className={styles.title}>Comprar inscritos no Instagram</h1>
          <p className={styles.subtitle}>
            Escolha a quantidade, informe seu perfil e pague via PIX. A
            entrega começa assim que o pagamento é confirmado
          </p>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.bannerWrap}>
            <Image
              src='/instagram-comprar-inscritos.png'
              width={1254}
              height={1254}
              alt='Compre inscritos para Instagram'
              className={styles.bannerImage}
              priority
            />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Escolha a quantidade</h3>
              </div>

              <div className={styles.tierGrid}>
                {FOLLOWERS_TIERS.map((tier) => (
                  <button
                    type='button'
                    key={tier.quantity}
                    className={`${styles.tierCard} ${
                      selectedQuantity === tier.quantity
                        ? styles.tierCardSelected
                        : ''
                    }`}
                    onClick={() => setSelectedQuantity(tier.quantity)}
                  >
                    <span className={styles.tierQuantity}>
                      {tier.quantity.toLocaleString('pt-BR')}
                    </span>
                    <span className={styles.tierPrice}>
                      {formatBRL(tier.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor='instagramLink'>
                  Link ou @usuário do perfil
                </label>
                <input
                  id='instagramLink'
                  className={styles.textInput}
                  placeholder='https://instagram.com/seuperfil ou @seuperfil'
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                />
                <span className={styles.helperText}>
                  O perfil precisa estar público durante a entrega
                </span>
              </div>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting
                ? 'Gerando pagamento...'
                : selectedQuantity
                  ? `Pagar ${formatBRL(getTierByQuantity(selectedQuantity)?.price ?? 0)} via PIX`
                  : 'Continuar'}
            </button>
          </form>

          <div className={styles.card}>
            <ul className={styles.trustList}>
              <li>✅ Não pedimos sua senha do Instagram</li>
              <li>✅ Pagamento único via PIX, sem assinatura</li>
              <li>✅ Entrega gradual para maior segurança da conta</li>
            </ul>
          </div>

          <FalarComSuporteComponent />
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status?: string | null) {
  switch (status) {
    case 'submitted':
      return styles.statusSubmitted;
    case 'processing':
      return styles.statusProcessing;
    case 'error':
      return styles.statusError;
    default:
      return styles.statusPending;
  }
}

function getStatusLabel(status?: string | null) {
  switch (status) {
    case 'submitted':
      return 'Pedido enviado';
    case 'processing':
      return 'Processando';
    case 'error':
      return 'Erro no envio';
    default:
      return 'Aguardando';
  }
}

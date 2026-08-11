'use client';

import { getUserId, setUserId } from '@/app/lib/userId';
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
  const [lastOrderPaymentId, setLastOrderPaymentId] = useState<string | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

        if (initialPaymentId) {
          await loadPayment(initialPaymentId);
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

  // Só usada no carregamento inicial (ex.: aba aberta com ?paymentId= já aprovado).
  // Não redireciona para nova aba — se já está aprovado, mostra o sucesso aqui mesmo.
  async function loadPayment(pid: string) {
    setPaymentId(pid);

    const result = await syncInstagramPaymentStatus(pid);

    if (!result.success) {
      setPhase('form');
      return;
    }

    if (result.accessGranted) {
      setOrderData((result.order as InstagramFollowersOrder) ?? null);
      setPhase('success');
      return;
    }

    if (result.isExpired) {
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

    setPhase('payment');
  }

  // Enquanto aguarda o PIX, verifica automaticamente a cada 5s — sem depender do clique manual.
  useEffect(() => {
    if (phase !== 'payment' || !paymentId) return;

    const interval = setInterval(() => {
      pollPaymentStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [phase, paymentId]);

  function buildOrderUrl(pid: string): string {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('paymentId', pid);
    return url.toString();
  }

  function openOrderInNewTab(pid: string) {
    // Navegadores bloqueiam window.open() quando não há um gesto direto do
    // usuário (ex.: disparado por setInterval) — por isso sempre deixamos um
    // link de fallback visível em lastOrderPaymentId, caso o popup seja bloqueado.
    window.open(buildOrderUrl(pid), '_blank');
  }

  // Limpa o pagamento/pedido em andamento. `keepFormValues` mantém a quantidade e o
  // link já preenchidos (caso de pagamento expirado — o usuário só precisa gerar um
  // novo PIX). Sem isso, também zera o formulário (caso de compra concluída).
  function resetPaymentState(keepFormValues: boolean) {
    setPhase('form');
    setPaymentId(null);
    setPixData(null);
    setOrderData(null);
    setErrorMessage('');

    if (!keepFormValues) {
      setSelectedQuantity(null);
      setInstagramLink('');
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('paymentId');
    window.history.replaceState({}, '', url.toString());
  }

  function resetToForm() {
    resetPaymentState(false);
  }

  async function pollPaymentStatus() {
    if (!paymentId) return;
    const pid = paymentId;

    const result = await syncInstagramPaymentStatus(pid);

    if (result.accessGranted) {
      toast.success(
        'Pagamento confirmado! Abrimos os detalhes do pedido em uma nova aba.',
        { position: 'bottom-center', autoClose: 4000 },
      );
      openOrderInNewTab(pid);
      resetToForm();
      setLastOrderPaymentId(pid);
      return;
    }

    if (result.isExpired) {
      toast.error(
        'O pagamento PIX expirou. Gere um novo pagamento para continuar.',
        { position: 'bottom-center', autoClose: 4000 },
      );
      resetPaymentState(true);
    }
  }

  function handleSubmit(e: React.FormEvent) {
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

    setShowConfirmModal(true);
  }

  async function confirmAndPay() {
    if (!selectedQuantity) return;

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
        setPaymentId(pid);

        const url = new URL(window.location.href);
        url.searchParams.set('paymentId', pid);
        window.history.replaceState({}, '', url.toString());

        const order = await getInstagramOrder(pid);
        setOrderData(order);
      }

      setShowConfirmModal(false);
      setPhase('payment');
    } catch (error: any) {
      setShowConfirmModal(false);
      setFormError(error.message || 'Erro ao gerar pagamento');
    } finally {
      setSubmitting(false);
    }
  }

  const handleCheckPayment = async () => {
    setCheckingPayment(true);
    await pollPaymentStatus();
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
          {lastOrderPaymentId && (
            <div className={styles.completedNotice}>
              <span>✅ Pedido enviado!</span>
              <span>
                Se a nova aba não abriu automaticamente,{' '}
                <a
                  href={buildOrderUrl(lastOrderPaymentId)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.completedLink}
                  onClick={() => setLastOrderPaymentId(null)}
                >
                  clique aqui para ver os detalhes
                </a>
                .
              </span>
            </div>
          )}

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

            <button type='submit' className={styles.submitButton}>
              {selectedQuantity
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

      {showConfirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !submitting && setShowConfirmModal(false)}
        >
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Confirme o perfil</h3>
            <p className={styles.modalText}>
              Vamos entregar{' '}
              <strong>
                {selectedQuantity?.toLocaleString('pt-BR')} inscritos
              </strong>{' '}
              para o perfil abaixo. Depois do pagamento não é possível
              alterar o link.
            </p>
            <div className={styles.modalLinkBox}>{instagramLink}</div>
            <div className={styles.modalActions}>
              <button
                type='button'
                className={styles.modalSecondaryButton}
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
              >
                Corrigir link
              </button>
              <button
                type='button'
                className={styles.modalPrimaryButton}
                onClick={confirmAndPay}
                disabled={submitting}
              >
                {submitting ? 'Gerando pagamento...' : 'Confirmar e pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
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

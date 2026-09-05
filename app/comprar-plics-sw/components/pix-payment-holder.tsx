'use client';

import PixPayment from '../PixPayment';
import { PixPaymentResult } from 'pix-payment';
import styles from '@/app/styles/comprar.module.css';

export default function PixPaymentHolder(props: {
  loading: boolean;
  pixData: PixPaymentResult | null;
  handleCheckPayment: () => Promise<void>;
  checkingPayment: boolean;
  errorMessage: string;
}) {
  const {
    loading,
    pixData,
    handleCheckPayment,
    checkingPayment,
    errorMessage,
  } = props;
  if (loading) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.wrapper}>
              <p>Carregando...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (errorMessage != '') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>Erro ao gerar pagamento</h1>
          <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {pixData && <PixPayment pixData={pixData} errorMessage={errorMessage} />}

      {pixData?.data?.paymentId && (
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
    </>
  );
}

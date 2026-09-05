'use client';

import PixPayment from '../PixPayment';
import { PixPaymentResult } from 'pix-payment';
import styles from '@/app/styles/comprarInstagram.module.css';

export default function PixPaymentHolder(props: {
  loading: boolean;
  pixData: PixPaymentResult | null;
  handleCheckPayment: () => Promise<void>;
  checkingPayment: boolean;
  errorMessage: string;
  price: number;
  quantity: number;
}) {
  const {
    loading,
    pixData,
    handleCheckPayment,
    checkingPayment,
    errorMessage,
    price,
    quantity,
  } = props;

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
      {pixData && (
        <PixPayment
          pixData={pixData}
          errorMessage={errorMessage}
          price={price}
          quantity={quantity}
        />
      )}

      {pixData?.data?.paymentId && (
        <button
          onClick={handleCheckPayment}
          disabled={checkingPayment}
          className={styles.refreshButton}
        >
          {checkingPayment
            ? 'Verificando...'
            : 'Já paguei! Verificar pagamento'}
        </button>
      )}
    </>
  );
}

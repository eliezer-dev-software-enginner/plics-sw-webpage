'use client';

import { CheckCircle, Copy } from 'lucide-react';

import styles from '@/app/styles/PixPayment.module.css';
import { PixPaymentResult } from 'pix-payment';
import { toast } from 'react-toastify';
import { formatBRL } from './constants';

export default function PixPayment({
  pixData,
  errorMessage,
  price,
  quantity,
}: {
  pixData: PixPaymentResult;
  errorMessage: string;
  price: number;
  quantity: number;
}) {
  const handleCopyPixKey = () => {
    if (pixData.data?.qrCode) {
      navigator.clipboard.writeText(pixData.data.qrCode);

      toast.success('✅ Chave Pix copiada com sucesso!', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    }
  };

  if (!pixData.success) {
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
    <div className={styles.card}>
      <p className={styles.label}>Escaneie o QR Code para pagar:</p>

      <img
        src={`data:image/png;base64,${pixData.data?.qrCodeBase64}`}
        alt='PIX QR Code'
        className={styles.qrCode}
      />

      <button onClick={handleCopyPixKey} className={styles.button}>
        <Copy className={styles.icon} />
        Copiar Chave PIX — {quantity.toLocaleString('pt-BR')} inscritos por{' '}
        {formatBRL(price)}
      </button>

      <div className={styles.status}>
        <span>Status:</span>
        <span className={styles.statusText}>
          <CheckCircle className={styles.iconSmall} />
          {pixData.data?.status}
        </span>
      </div>

      {pixData.data?.paymentId && (
        <p className={styles.paymentId}>ID: {pixData.data.paymentId}</p>
      )}
    </div>
  );
}

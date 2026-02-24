'use client';

import { Copy, CheckCircle } from 'lucide-react';
import styles from '@/app/styles/PixPayment.module.css';

interface PixData {
  success: boolean;
  paymentId?: string;
  qrCodeBase64?: string | null;
  qrCode?: string | null;
  status?: string;
  error?: string;
}

export default function PixPayment({ pixData }: { pixData: PixData }) {
  const handleCopyPixKey = () => {
    if (pixData.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
    }
  };

  if (!pixData.success) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>
            Erro ao gerar pagamento
          </h1>
          <p className={styles.errorMessage}>{pixData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <p className={styles.label}>
        Escaneie o QR Code para pagar:
      </p>

      <img
        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
        alt="PIX QR Code"
        className={styles.qrCode}
      />

      <button
        onClick={handleCopyPixKey}
        className={styles.button}
      >
        <Copy className={styles.icon} />
        Copiar Chave PIX
      </button>

      <div className={styles.status}>
        <span>Status:</span>
        <span className={styles.statusText}>
          <CheckCircle className={styles.iconSmall} />
          {pixData.status}
        </span>
      </div>

      {pixData.paymentId && (
        <p className={styles.paymentId}>
          ID: {pixData.paymentId}
        </p>
      )}
    </div>
  );
}

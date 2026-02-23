'use client';

import { Copy, CheckCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Erro ao gerar pagamento
          </h1>
          <p className="text-gray-400">{pixData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-6 bg-gray-800 p-8 rounded-2xl shadow-xl">
      <p className="mb-4 font-semibold text-gray-300">
        Escaneie o QR Code para pagar:
      </p>

      <img
        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
        alt="PIX QR Code"
        className="w-64 h-64 mb-4 bg-white p-2 rounded-lg"
      />

      <button
        onClick={handleCopyPixKey}
        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 mb-4"
      >
        <Copy className="w-5 h-5" />
        Copiar Chave PIX
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Status:</span>
        <span className="text-yellow-400 font-semibold flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          {pixData.status}
        </span>
      </div>

      {pixData.paymentId && (
        <p className="text-xs text-gray-500 mt-2">
          ID: {pixData.paymentId}
        </p>
      )}
    </div>
  );
}

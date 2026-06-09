//app/comprar-plics-sw/actions.tsx

"use server";

import { getUserPurchases, grantUserAccess, savePayment } from "@/app/lib/db";

import { createPixService } from "@/app/lib/pixService";

export async function createPixPayment(userId: string) {
  "use server";

  try {
    const pixService = createPixService();
    const response = await pixService.createPayment({
      transactionAmount: 54.5,
      description: "PLICs - Licença de Uso do Aplicativo",
      payerEmail: process.env.EMAIL || "cliente@exemplo.com",
      payerFirstName: "Cliente",
      payerLastName: "PLICs",
      externalReference: userId,
    });

    const { id: paymentId, status, qrCodeBase64, qrCode } = response;

    if (paymentId && paymentId !== "undefined") {
      await savePayment(paymentId, userId, status);
    }

    return {
      success: true,
      paymentId,
      qrCodeBase64,
      qrCode,
      status,
    };
  } catch (error: any) {
    console.error("Erro ao criar pagamento PIX:", error);
    return {
      success: false,
      error: error.message || "Erro ao criar pagamento",
    };
  }
}

export async function checkPaymentStatus(paymentId: string) {
  "use server";

  try {
    const pixService = createPixService();
    const result = await pixService.getPayment(paymentId);

    return {
      success: true,
      status: result.status,
    };
  } catch (error: any) {
    console.error("Erro ao verificar pagamento:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function syncPaymentStatus(paymentId: string, userId: string) {
  "use server";

  try {
    const pixService = createPixService();
    const result = await pixService.getPayment(paymentId);
    const status = result.status;

    if (status === "approved") {
      await grantUserAccess(userId, paymentId);
      return { success: true, status, accessGranted: true };
    }

    return { success: true, status, accessGranted: false };
  } catch (error: any) {
    console.error("Erro ao sincronizar pagamento:", error);
    return { success: false, error: error.message };
  }
}

export async function checkUserHasAccess(userId: string) {
  "use server";

  try {
    const purchases = await getUserPurchases(userId);
    const hasAccess = purchases && purchases.length > 0;

    return {
      success: true,
      hasAccess,
      license: hasAccess ? process.env.LICENSA_APP : null,
      downloadWindows: process.env.DOWNLOAD_WINDOWS || null,
      downloadLinux: process.env.DOWNLOAD_LINUX || null,
    };
  } catch (error: any) {
    console.error("Erro ao verificar acesso:", error);
    return {
      success: false,
      hasAccess: false,
      error: error.message,
    };
  }
}

export async function grantTestAccess(userId: string) {
  "use server";

  try {
    await grantUserAccess(userId, "test_payment_" + Date.now());
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar acesso de teste:", error);
    return { success: false, error: error.message };
  }
}

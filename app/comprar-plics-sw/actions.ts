//app/comprar-plics-sw/actions.tsx

"use server";

import { getUserPurchases, grantUserAccess, savePayment } from "@/app/lib/db";

import { getPixService } from "@/app/lib/pixConfig";

export async function createPixPayment(userId: string) {
  "use server";

  try {
    const result = await getPixService().createPixPayment({
      value: 54.5,
      description: "PLICs - Licença de Uso do Aplicativo",
      email: process.env.EMAIL || "cliente@exemplo.com",
      firstName: "Cliente",
      lastName: "PLICs",
      externalRef: userId,
      notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")}/api/webhook`,
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Erro ao criar pagamento" };
    }

    const { paymentId, status, qrCodeBase64, qrCode } = result.data;

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
    const result = await getPixService().getPaymentById(paymentId);

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
    const result = await getPixService().getPaymentById(paymentId);
    const status = result.status;
    const transactionData = result.point_of_interaction?.transaction_data;

    if (status === "approved") {
      await grantUserAccess(userId, paymentId);
      return { success: true, status, accessGranted: true };
    }

    return {
      success: true,
      status,
      accessGranted: false,
      qrCodeBase64: transactionData?.qr_code_base64 ?? null,
      qrCode: transactionData?.qr_code ?? null,
    };
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

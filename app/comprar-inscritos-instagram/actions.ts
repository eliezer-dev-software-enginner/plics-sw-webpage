// app/comprar-inscritos-instagram/actions.ts

'use server';

import {
  getInstagramFollowersOrder,
  saveInstagramFollowersOrder,
  savePayment,
  updateInstagramFollowersOrderSmmStatus,
} from '@/app/lib/db';
import { getPixService } from '@/app/lib/pixConfig';
import { fulfillInstagramFollowersOrder } from '@/app/lib/smmFulfillment';
import { smmStatus } from '@/app/lib/smmApi';
import { mockSmmStatus } from '@/app/lib/smmApiMock';
import { UTM } from '../lib/common';
import { getTierByQuantity } from './constants';

export async function createInstagramFollowersPixPayment(
  userId: string,
  instagramLink: string,
  quantity: number,
  utm: UTM,
  testMode: boolean = false,
) {
  'use server';

  const tier = getTierByQuantity(quantity);
  if (!tier) throw new Error('Quantidade de inscritos inválida');

  const link = instagramLink.trim();
  if (!link) {
    throw new Error('Informe o link ou @usuário do perfil do Instagram');
  }

  const params = new URLSearchParams();
  params.set('userId', userId);
  params.set('product', 'instagram-followers');

  if (utm.source) params.set('utm_source', utm.source);
  if (utm.medium) params.set('utm_medium', utm.medium);
  if (utm.campaign) params.set('utm_campaign', utm.campaign);
  if (utm.content) params.set('utm_content', utm.content);

  const externalRef = params.toString();

  try {
    const result = await getPixService().createPixPayment({
      value: tier.price,
      description: `${tier.quantity} Inscritos Instagram`,
      email: process.env.EMAIL || 'cliente@exemplo.com',
      firstName: 'Cliente',
      lastName: 'Instagram',
      externalRef,
      notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')}/api/webhook`,
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Erro ao criar pagamento');
    }

    const { paymentId, status } = result.data;

    if (paymentId && paymentId !== 'undefined') {
      await savePayment(paymentId, userId, status, 'instagram-followers');
      await saveInstagramFollowersOrder(
        paymentId,
        userId,
        link,
        tier.quantity,
        tier.price,
        testMode,
      );
    }

    return result;
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX (inscritos Instagram):', error);
    throw new Error(error.message || 'Erro ao criar pagamento');
  }
}

export async function syncInstagramPaymentStatus(paymentId: string) {
  'use server';

  try {
    const result = await getPixService().getPaymentById(paymentId);
    const status = result.status;
    const transactionData = result.point_of_interaction?.transaction_data;

    if (status === 'approved') {
      const order = await fulfillInstagramFollowersOrder(paymentId);
      return { success: true, status, accessGranted: true, order };
    }

    const isExpired = status !== 'pending' && status !== 'in_process';

    return {
      success: true,
      status,
      accessGranted: false,
      isExpired,
      qrCodeBase64: isExpired
        ? null
        : (transactionData?.qr_code_base64 ?? null),
      qrCode: isExpired ? null : (transactionData?.qr_code ?? null),
    };
  } catch (error: any) {
    console.error('Erro ao sincronizar pagamento (Instagram):', error);
    return { success: false, error: error.message };
  }
}

export async function getInstagramOrder(paymentId: string) {
  'use server';

  return getInstagramFollowersOrder(paymentId);
}

export async function refreshInstagramOrderStatus(paymentId: string) {
  'use server';

  try {
    const order = await getInstagramFollowersOrder(paymentId);
    if (!order?.smmOrderId) {
      return {
        success: false,
        error: 'Pedido ainda não foi enviado ao painel',
      };
    }

    const result = order.testMode
      ? await mockSmmStatus(order.smmOrderId)
      : await smmStatus(order.smmOrderId);

    if (result?.error) {
      return { success: false, error: String(result.error) };
    }

    const status = String(result?.status ?? order.smmStatus ?? 'unknown');
    await updateInstagramFollowersOrderSmmStatus(paymentId, status);

    return {
      success: true,
      status,
      remains: result?.remains,
      startCount: result?.start_count,
    };
  } catch (error: any) {
    console.error('Erro ao consultar status do pedido (Instagram):', error);
    return {
      success: false,
      error: error.message || 'Erro ao consultar status do pedido',
    };
  }
}

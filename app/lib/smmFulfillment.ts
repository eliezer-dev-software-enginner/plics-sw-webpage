// app/lib/smmFulfillment.ts

import {
  claimInstagramFollowersOrderForFulfillment,
  getInstagramFollowersOrder,
  markInstagramFollowersOrderError,
  markInstagramFollowersOrderSubmitted,
} from '@/app/lib/db';
import { smmOrder } from '@/app/lib/smmApi';
import { mockSmmOrder } from '@/app/lib/smmApiMock';

/**
 * Envia o pedido de inscritos/seguidores Instagram ao painel SMM após o pagamento
 * ser aprovado. Idempotente: pode ser chamada tanto pelo webhook quanto pelo polling
 * do cliente sem duplicar o pedido, pois a reivindicação (`claim`) é atômica no banco.
 */
export async function fulfillInstagramFollowersOrder(paymentId: string) {
  const order = await getInstagramFollowersOrder(paymentId);
  if (!order) return null;

  if (order.status === 'submitted' || order.status === 'processing') {
    return order;
  }

  const claimed = await claimInstagramFollowersOrderForFulfillment(paymentId);
  if (!claimed) {
    return getInstagramFollowersOrder(paymentId);
  }

  const serviceId = process.env.SMM_SERVICE_ID_INSTAGRAM_FOLLOWERS;
  if (!serviceId && !order.testMode) {
    await markInstagramFollowersOrderError(
      paymentId,
      'SMM_SERVICE_ID_INSTAGRAM_FOLLOWERS não configurado',
    );
    return getInstagramFollowersOrder(paymentId);
  }

  try {
    const orderParams = {
      service: serviceId || 'test-service',
      link: order.instagramLink,
      quantity: String(order.quantity),
    };

    const response = order.testMode
      ? await mockSmmOrder(orderParams)
      : await smmOrder(orderParams);

    if (response?.error) {
      await markInstagramFollowersOrderError(paymentId, String(response.error));
      return getInstagramFollowersOrder(paymentId);
    }

    const smmOrderId = response?.order != null ? String(response.order) : null;

    if (!smmOrderId) {
      await markInstagramFollowersOrderError(
        paymentId,
        `Resposta inesperada do painel SMM: ${JSON.stringify(response)}`,
      );
      return getInstagramFollowersOrder(paymentId);
    }

    await markInstagramFollowersOrderSubmitted(paymentId, smmOrderId);
    return getInstagramFollowersOrder(paymentId);
  } catch (error: any) {
    await markInstagramFollowersOrderError(
      paymentId,
      error.message || 'Erro ao criar pedido no painel SMM',
    );
    return getInstagramFollowersOrder(paymentId);
  }
}

import { getPayment, grantUserAccess, updatePaymentStatus } from '@/app/lib/db';

import { getPixService } from '@/app/lib/pixConfig';
import { fulfillInstagramFollowersOrder } from '@/app/lib/smmFulfillment';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ status: 'ok', webhook: 'configured' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const searchParams = new URL(req.url).searchParams;

    const type = body?.type ?? searchParams.get('type');

    // Mercado Pago também notifica outros tópicos (merchant_order, etc.) —
    // ignora com 200 para não gerar erro nem reenvios.
    if (type && type !== 'payment') {
      return Response.json({ received: true, ignored: type });
    }

    // O id pode vir no body (data.id) ou na query string (?data.id=...)
    const paymentId = body?.data?.id ?? searchParams.get('data.id');

    if (!paymentId) {
      console.log('⚠️ Webhook sem paymentId:', body);
      return Response.json({ received: true, ignored: 'missing-payment-id' });
    }

    const paymentIdStr = String(paymentId);

    // Se for ID de teste do Mercado Pago, retorna sucesso
    if (paymentIdStr === '123456') {
      console.log('📝 Teste de webhook recebido');
      return Response.json({ received: true, test: true });
    }

    const result = await getPixService().getPaymentById(paymentIdStr);

    const novoStatus: string = result.status || 'unknown';

    const params = new URLSearchParams(result.external_reference ?? '');

    const userId = params.get('userId');
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');

    console.log({
      userId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    });

    const paymentData = await getPayment(paymentIdStr);

    // O MP dispara a notificação assim que o PIX é criado — pode chegar antes
    // do savePayment() do server action terminar. Nesse caso adia com 200 em
    // vez de errar: a notificação de status aprovado (ou o polling do cliente)
    // processa quando o registro existir.
    if (!paymentData?.id) {
      console.log(
        '⏳ Pagamento ainda não registrado localmente, adiando:',
        paymentIdStr,
      );
      return Response.json({ received: true, deferred: true });
    }

    await updatePaymentStatus(paymentIdStr, novoStatus);

    if (novoStatus === 'approved') {
      console.log('✅ Pagamento aprovado:', paymentId);

      if (paymentData.product === 'instagram-followers') {
        await fulfillInstagramFollowersOrder(paymentIdStr);
      } else {
        if (paymentData.userId) {
          await grantUserAccess(paymentData.userId, paymentIdStr);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error.message || error);

    return Response.json(
      {
        error: 'Erro no webhook',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}

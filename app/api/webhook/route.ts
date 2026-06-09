import { getPayment, grantUserAccess, updatePaymentStatus } from "@/app/lib/db";
import { getPixService } from "@/app/lib/pixConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ status: "ok", webhook: "configured" });
}

export async function POST(req: Request) {
  try {
    let body = await req.json();

    const paymentId = body?.data?.id;

    if (!paymentId)
      return Response.json(
        { error: "paymentId não encontrado" },
        { status: 400 },
      );

    const paymentIdStr = String(paymentId);

    // Se for ID de teste do Mercado Pago, retorna sucesso
    if (paymentIdStr === "123456") {
      console.log("📝 Teste de webhook recebido");
      return Response.json({ received: true, test: true });
    }

    const result = await getPixService().getPaymentById(paymentIdStr);

    const novoStatus: string = result.status || "unknown";

    await updatePaymentStatus(paymentIdStr, novoStatus);

    if (novoStatus === "approved") {
      console.log("✅ Pagamento aprovado:", paymentId);

      const paymentData = await getPayment(paymentIdStr);

      if (paymentData?.userId) {
        console.log("Liberar acesso para userId:", paymentData.userId);
        await grantUserAccess(paymentData.userId, paymentIdStr);
      }
    }

    return Response.json({ received: true });
  } catch (error: any) {
    console.error("Erro no webhook:", error.message || error);

    return Response.json(
      {
        error: "Erro no webhook",
        message: error.message || "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

// app/lib/smmApiMock.ts
//
// Substitui smmApi.ts quando o pedido está em modo de teste (ver
// app/comprar-inscritos-instagram/testMode.ts) — nenhuma chamada de rede é feita
// ao painel smmoficial.com, então nenhum pedido real é criado nem cobrado.

export async function mockSmmOrder(
  data: Record<string, string>,
): Promise<{ order: string }> {
  console.log('🧪 [SMM MOCK] Pedido simulado (não enviado ao painel real):', data);
  return { order: `TEST-${Date.now()}` };
}

export async function mockSmmStatus(orderId: string): Promise<{
  charge: string;
  start_count: string;
  status: string;
  remains: string;
  currency: string;
}> {
  const createdAt = Number(orderId.replace('TEST-', '')) || Date.now();
  const elapsedMs = Date.now() - createdAt;

  const completed = elapsedMs > 30_000;

  return {
    charge: '0.00',
    start_count: '100',
    status: completed ? 'Completed' : 'In progress',
    remains: completed ? '0' : '50',
    currency: 'BRL',
  };
}

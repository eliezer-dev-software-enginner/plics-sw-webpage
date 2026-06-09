//app/comprar-plics-sw/page.tsx

import ComprarClient from './ComprarClient';

export const dynamic = 'force-dynamic';

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; test?: string; paymentId?: string }>;
}) {
  const params = await searchParams;
  const testMode = params.test === 'success';
  const userIdFromUrl = params.userId;
  const initialPaymentId = params.paymentId;

  return (
    <ComprarClient
      testMode={testMode}
      initialPaymentId={initialPaymentId}
      userIdFromUrl={userIdFromUrl}
    />
  );
}

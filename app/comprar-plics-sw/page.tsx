//app/comprar-plics-sw/page.tsx

import { getUtmFromSearchParams } from '../lib/common';
import ComprarClient from './ComprarClient';

export const dynamic = 'force-dynamic';

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{
    userId?: string;
    test?: string;
    paymentId?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  }>;
}) {
  const params = await searchParams;

  const testMode = params.test === 'success';
  const userIdFromUrl = params.userId;
  const initialPaymentId = params.paymentId;

  const utm = getUtmFromSearchParams(params);

  return (
    <ComprarClient
      testMode={testMode}
      initialPaymentId={initialPaymentId}
      userIdFromUrl={userIdFromUrl}
      utm={utm}
    />
  );
}

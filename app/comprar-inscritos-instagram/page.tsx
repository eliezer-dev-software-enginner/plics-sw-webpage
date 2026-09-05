//app/comprar-inscritos-instagram/page.tsx

import { getUtmFromSearchParams } from '../lib/common';
import ComprarClient from './ComprarClient';

export const dynamic = 'force-dynamic';

export default async function ComprarInscritosInstagram({
  searchParams,
}: {
  searchParams: Promise<{
    userId?: string;
    paymentId?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  }>;
}) {
  const params = await searchParams;

  const userIdFromUrl = params.userId;
  const initialPaymentId = params.paymentId;

  const utm = getUtmFromSearchParams(params);

  return (
    <ComprarClient
      initialPaymentId={initialPaymentId}
      userIdFromUrl={userIdFromUrl}
      utm={utm}
    />
  );
}

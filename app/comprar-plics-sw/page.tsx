import ComprarClient from './ComprarClient';

export const dynamic = 'force-dynamic';

export default async function Comprar({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; test?: string }>;
}) {
  const params = await searchParams;
  const testMode = params.test === 'success';
  const userIdFromUrl = params.userId;

  return <ComprarClient testMode={testMode} userIdFromUrl={userIdFromUrl} />;
}

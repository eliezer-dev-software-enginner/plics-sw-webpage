import style from '@/app/styles/Home.module.css';
import ChildMotivos from './components/ChildMotivos';
import ChildPresentation from './components/ChildPresentation';
import { getUtmFromSearchParams } from './lib/common';

export default async function App({
  searchParams,
}: {
  searchParams: Promise<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  }>;
}) {
  const params = await searchParams;
  const utm = getUtmFromSearchParams(params);

  return (
    <div className={style.container}>
      <ChildPresentation />
      <ChildMotivos />
    </div>
  );
}

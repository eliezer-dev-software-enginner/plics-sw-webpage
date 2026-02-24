import { createPixPayment, checkUserHasAccess, grantTestAccess } from './actions';
import PixPayment from './PixPayment';
import styles from '@/app/styles/comprar.module.css';
import { Download } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPixData() {
  const userId = 'guest_' + Date.now();
  const result = await createPixPayment(userId);
  return result;
}

async function getUserAccess(userId: string) {
  const result = await checkUserHasAccess(userId);
  return result;
}

async function simulatePurchase(userId: string) {
  'use server';
  await grantTestAccess(userId);
}

export default async function Comprar({ searchParams }: { searchParams: Promise<{ userId?: string; test?: string }> }) {
  const params = await searchParams;
  const userId = params.userId || 'guest_' + Date.now();
  
  if (params.test === 'success') {
    await simulatePurchase(userId);
  }
  
  const access = await getUserAccess(userId);
  
  if (access.hasAccess) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Obrigado pela compra!
            </h1>
            <h2 className={styles.subtitle}>
              Abaixo estão os downloads e sua licença
            </h2>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Sua Licença</h3>
              <p className={styles.license}>{access.license}</p>
            </div>

            <div className={styles.downloads}>
              <h3 className={styles.cardTitle}>Downloads</h3>
              {access.downloadWindows && (
                <Link 
                  href={access.downloadWindows} 
                  className={styles.downloadButton}
                  target="_blank"
                >
                  <Download className={styles.icon} />
                  Windows
                </Link>
              )}
              {access.downloadLinux && (
                <Link 
                  href={access.downloadLinux} 
                  className={styles.downloadButton}
                  target="_blank"
                >
                  <Download className={styles.icon} />
                  Linux
                </Link>
              )}
            </div>

            {process.env.SUPORTE_CONTATO && (
              <div className={styles.suporte}>
                <p>Precisa de ajuda?</p>
                <Link 
                  href={process.env.SUPORTE_CONTATO}
                  className={styles.suporteLink}
                  target="_blank"
                >
                  Fale com o suporte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const pixData = await getPixData();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Realize já a compra do seu aplicativo
          </h1>
          <h2 className={styles.subtitle}>
            Você recebe a licença na hora junto com o aplicativo
          </h2>
        </div>

        <div className={styles.wrapper}>
          <PixPayment pixData={pixData} />
        </div>
      </div>
    </div>
  );
}

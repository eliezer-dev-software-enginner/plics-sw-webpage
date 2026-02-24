import { createPixPayment } from './actions';
import PixPayment from './PixPayment';
import styles from '@/app/styles/comprar.module.css';

export const dynamic = 'force-dynamic';

async function getPixData() {
  const userId = 'guest_' + Date.now();
  const result = await createPixPayment(userId);
  return result;
}

export default async function Comprar() {
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

      <footer className={styles.footer}>
        <p>&copy; 202 PLICs. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

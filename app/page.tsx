import {
  ArrowRight,
  CheckCircle,
  Shield,
  ShoppingCart,
  WifiOff,
} from 'lucide-react';

import Image from 'next/image';
import style from '@/app/styles/Home.module.css';
import { ComprarButton } from '@/app/components/ComprarButton';

export default function App() {
  return (
    <div className={style.container}>
      <main>
        {/* Hero */}
        <section className={style.hero}>
          <h1>Seu negócio merece um salto na gestão com a Plics-SW</h1>
          <h2>
            Sistema ERP completo e totalmente offline. Fique no controle total
            das suas vendas, estoque e financeiro sem depender de internet ou
            mensalidades abusivas.
          </h2>
          <ComprarButton variant="primary" />

          <div className={style.dashboard_preview}>
            <Image
              src={'/plics-sw-home.png'}
              width={1000}
              height={560}
              alt={'Imagem: Interface do Sistema Plics-SW Dashboard'}
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </section>

        {/* Vantagens */}
        <section className={style.features}>
          <div className={style.feature_card}>
            <WifiOff size={40} />
            <h3>100% Offline</h3>
            <p>
              Trabalhe de onde quiser. Suas informações ficam salvas localmente
              com total segurança.
            </p>
          </div>
          <div className={style.feature_card}>
            <Shield size={40} />
            <h3>Pagamento Único</h3>
            <p>
              Esqueça mensalidades. Você paga uma vez e o sistema é seu para
              sempre.
            </p>
          </div>
          <div className={style.feature_card}>
            <CheckCircle size={40} />
            <h3>Gestão Completa</h3>
            <p>
              Controle vendas, compras, estoque e financeiro em uma única
              interface intuitiva.
            </p>
          </div>
        </section>

        {/* Preço */}
        <section className={style.pricing}>
          <h2>Oferta Exclusiva</h2>
          <p>
            Tudo o que você precisa para crescer por um preço que cabe no seu
            bolso.
          </p>

          <div className={style.price_tag}>
            <span className={style.old_price}>De R$ 73,99</span>
            <span className={style.new_price}>R$ 54,50</span>
            <p className={style.price_info}>
              Sem taxas escondidas. Licença vitalícia.
            </p>
            <ComprarButton variant="accent" />
          </div>
        </section>
      </main>
    </div>
  );
}

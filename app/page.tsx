import {
  ArrowRight,
  CheckCircle,
  Shield,
  ShoppingCart,
  WifiOff,
} from 'lucide-react';

import Image from 'next/image';
import style from '@/app/styles/Home.module.css';

/**
 * Nota: Como estamos em um ambiente de arquivo único, simulei a lógica de CSS Modules
 * usando um objeto de estilos e classes CSS injetadas.
 * Em um projeto Next.js real, você moveria o conteúdo da tag <style> para 'Home.module.css'.
 */

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
          <button className={style.cta_button}>
            Começar Agora <ArrowRight size={20} />
          </button>

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
            <button
              className={style.cta_button}
              style={{ backgroundColor: 'var(--accent)', color: '#000' }}
            >
              <ShoppingCart size={20} /> Comprar Já
            </button>
          </div>
        </section>

        <footer
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.9rem',
          }}
        >
          © {new Date().getFullYear()} Plics-SW - Gestão para Pequenos Negócios.
        </footer>
      </main>
    </div>
  );
}

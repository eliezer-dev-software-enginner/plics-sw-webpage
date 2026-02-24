import { CheckCircle, Shield, WifiOff } from 'lucide-react';

import { ComprarButton } from '@/app/components/ComprarButton';
import Image from 'next/image';
import style from '@/app/styles/Home.module.css';

export default function App() {
  return (
    <div className={style.container}>
      {/* Grain overlay */}
      <div className={style.grain} aria-hidden='true' />

      <main>
        {/* ── Hero ─────────────────────────────────── */}
        <section className={style.hero}>
          <div className={style.heroBg} aria-hidden='true'>
            <div className={style.heroBgGlow} />
            <div className={style.heroBgGrid} />
          </div>

          <div className={style.heroInner}>
            <div className={style.heroLabel}>
              <span className={style.heroDot} />
              Sistema ERP · Licença Vitalícia
            </div>

            <h1 className={style.heroTitle}>
              Gestão completa.
              <br />
              <span className={style.heroAccent}>Sem internet.</span>
              <br />
              Sem mensalidade.
            </h1>

            <p className={style.heroSubtitle}>
              O Plics-SW é um ERP 100% offline que coloca você no controle total
              das suas vendas, estoque e financeiro — pague uma vez e use para
              sempre.
            </p>

            <div className={style.heroCta}>
              <ComprarButton variant='primary' />
              <div className={style.heroMeta}>
                <span>✓ Entrega imediata</span>
                <span>✓ Licença vitalícia</span>
                <span>✓ Sem mensalidade</span>
              </div>
            </div>

            <div className={style.dashboardWrap}>
              <div className={style.dashboardFrame}>
                <div className={style.dashboardBar}>
                  <span />
                  <span />
                  <span />
                </div>
                <Image
                  src='/plics-sw-home.png'
                  width={1000}
                  height={560}
                  alt='Interface do Sistema Plics-SW Dashboard'
                  className={style.dashboardImg}
                  priority
                />
              </div>
              <div className={style.dashboardGlow} aria-hidden='true' />
            </div>
          </div>
        </section>

        {/* ── Vantagens ────────────────────────────── */}
        <section className={style.features}>
          <div className={style.featuresInner}>
            <div className={style.featuresSectionLabel}>Por que Plics-SW</div>
            <h2 className={style.featuresTitle}>
              Tudo que seu negócio precisa,
              <br />
              sem complicação
            </h2>

            <div className={style.featureGrid}>
              <div className={style.featureCard}>
                <div className={style.featureIconWrap}>
                  <WifiOff size={24} />
                </div>
                <h3>100% Offline</h3>
                <p>
                  Trabalhe de onde quiser. Seus dados ficam salvos localmente,
                  seguros e sempre disponíveis — internet opcional.
                </p>
              </div>

              <div
                className={`${style.featureCard} ${style.featureCardHighlight}`}
              >
                <div className={style.featureIconWrap}>
                  <Shield size={24} />
                </div>
                <h3>Pagamento Único</h3>
                <p>
                  Esqueça assinaturas e cobranças mensais. Você paga uma vez e o
                  sistema é seu para sempre — sem pegadinha.
                </p>
                <div className={style.featureCardGlow} aria-hidden='true' />
              </div>

              <div className={style.featureCard}>
                <div className={style.featureIconWrap}>
                  <CheckCircle size={24} />
                </div>
                <h3>Gestão Completa</h3>
                <p>
                  Vendas, compras, estoque e financeiro integrados em uma
                  interface intuitiva, projetada para o dia a dia do negócio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Preço ────────────────────────────────── */}
        <section className={style.pricing}>
          <div className={style.pricingBg} aria-hidden='true' />
          <div className={style.pricingInner}>
            <div className={style.pricingLeft}>
              <div className={style.pricingLabel}>Oferta de lançamento</div>
              <h2 className={style.pricingTitle}>
                Invista uma vez.
                <br />
                Use para sempre.
              </h2>
              <p className={style.pricingDescription}>
                Sem taxas escondidas, sem renovação anual. Uma licença vitalícia
                com todas as funcionalidades desbloqueadas desde o primeiro dia.
              </p>
              <ul className={style.pricingPerks}>
                <li>
                  <CheckCircle size={16} /> Licença vitalícia para 1 CNPJ
                </li>
                <li>
                  <CheckCircle size={16} /> Atualizações gratuitas
                </li>
                <li>
                  <CheckCircle size={16} /> Suporte por 6 meses
                </li>
                <li>
                  <CheckCircle size={16} /> Windows &amp; Linux
                </li>
              </ul>
            </div>

            <div className={style.pricingCard}>
              <div className={style.pricingCardInner}>
                <span className={style.oldPrice}>De R$ 73,99</span>
                <div className={style.newPriceWrap}>
                  <span className={style.currency}>R$</span>
                  <span className={style.newPrice}>54</span>
                  <span className={style.cents}>,50</span>
                </div>
                <p className={style.priceNote}>pagamento único · via PIX</p>
                <ComprarButton variant='accent' />
                <p className={style.priceSecurity}>
                  🔒 Pagamento seguro · Licença entregue na hora
                </p>
              </div>
              <div className={style.pricingCardGlow} aria-hidden='true' />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import {
  BarChart3,
  CheckCircle,
  Database,
  Headphones,
  Package,
  Shield,
  User,
  WifiOff,
  Zap,
} from 'lucide-react';
import { getPriceFormatado, getPriceFormatadoArray } from './lib/common';

import { ComprarButton } from '@/app/components/ComprarButton';
import style from '@/app/styles/Home.module.css';
import Image from 'next/image';
import { SuporteButton } from './components/SuporteButton';

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
              <SuporteButton />
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

        {/* ── Versatilidade ────────────────────────────── */}
        <section className={style.versatilidade}>
          <div className={style.versatilidadeInner}>
            <h2 className={style.versatilidadeTitle}>
              Sistema PDV completo para o seu segmento
            </h2>
            <p className={style.versatilidadeText}>
              Bares, Floriculturas, Barbearias, Lojas de roupa, Mercearia, o que
              você imaginar. Atendemos todos os segmentos do varejo, comércio e
              serviços! E amamos receber os pequenos e novos negócios.
            </p>

            <div className={style.versatilidadeCard}>
              <div className={style.versatilidadeCardFrame}>
                <div className={style.dashboardBar}>
                  <span />
                  <span />
                  <span />
                </div>
                <Image
                  src='/mulher-usando-pdv.png'
                  width={1000}
                  height={560}
                  alt='Interface do Sistema Plics-SW Dashboard'
                  className={style.dashboardImg}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefícios ──────────────────────────── */}
        <section className={style.benefits}>
          <div className={style.benefitsInner}>
            <h2 className={style.benefitsTitle}>
              Conte com o PLICs SW para fazer a{' '}
              <span className={style.heroAccent}>gestão completa</span>
              <br />
              do seu negócio
            </h2>
            <p className={style.benefitsSubtitle}>
              Automatize processos e ganhe tempo para focar no crescimento do
              seu negócio.
            </p>

            <div className={style.benefitsGrid}>
              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <Zap size={22} />
                </div>
                <h3>Fácil de usar</h3>
                <p>
                  Faça a gestão do seu negócio com uma plataforma simples de
                  usar.
                </p>
              </div>

              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <Package size={22} />
                </div>
                <h3>Controle de Estoque</h3>
                <p>
                  Controle de estoque integrado e automatizado para otimizar
                  suas operações.
                </p>
              </div>

              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <Headphones size={22} />
                </div>
                <h3>Suporte Completo</h3>
                <p>
                  Conte com nosso suporte para te apoiar em todos os momentos.
                </p>
              </div>

              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <CheckCircle size={22} />
                </div>
                <h3>Gestão Completa</h3>
                <p>
                  Vendas, compras, estoque e financeiro integrados em um só
                  lugar.
                </p>
              </div>

              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <Database size={22} />
                </div>
                <h3>Informações Integradas</h3>
                <p>
                  Todas as informações do seu negócio organizadas em um só
                  lugar, sem planilhas.
                </p>
              </div>

              <div className={style.benefitCard}>
                <div className={style.benefitIconWrap}>
                  <BarChart3 size={22} />
                </div>
                <h3>Decisões Melhores</h3>
                <p>
                  Relatórios que te ajudam a ter uma visão analítica consolidada
                  do seu negócio.
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
                  <CheckCircle size={16} /> Suporte vitalício via WhatsApp e
                  Telegram
                </li>
                <li>
                  <CheckCircle size={16} /> Windows &amp; Linux
                </li>
              </ul>
            </div>

            <div className={style.pricingCard}>
              <div className={style.pricingCardInner}>
                <span className={style.oldPrice}>
                  De {getPriceFormatado(process.env.NEXT_PUBLIC_PRECO_DE!)}
                </span>
                <div className={style.newPriceWrap}>
                  <span className={style.currency}>R$</span>
                  <span className={style.newPrice}>
                    {getPriceFormatadoArray(process.env.NEXT_PUBLIC_PRECO!)[0]}
                  </span>
                  <span className={style.cents}>
                    {getPriceFormatadoArray(process.env.NEXT_PUBLIC_PRECO!)[1]}
                  </span>
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

        {/* ── Depoimentos ──────────────────────────── */}
        <section className={style.testimonials}>
          <div className={style.testimonialsInner}>
            <div className={style.featuresSectionLabel}>Depoimentos</div>
            <h2 className={style.featuresTitle}>O que nossos clientes dizem</h2>

            <div className={style.testimonialGrid}>
              <div className={style.testimonialCard}>
                <div className={style.testimonialCardImg}>
                  <User size={32} />
                </div>
                <div className={style.testimonialQuote} aria-hidden='true'>
                  &ldquo;
                </div>
                <p className={style.testimonialText}>
                  O PLICs SW transformou a gestão da minha loja. Agora tenho
                  controle total do estoque e das vendas, tudo offline e sem
                  complicação.
                </p>
                <div className={style.testimonialAuthor}>
                  <strong>Ana Silva</strong>
                  <span>Proprietária da BS Store</span>
                </div>
              </div>

              <div
                className={`${style.testimonialCard} ${style.testimonialCardHighlight}`}
              >
                <div className={style.testimonialCardImg}>
                  <User size={32} />
                </div>
                <div className={style.testimonialQuote} aria-hidden='true'>
                  &ldquo;
                </div>
                <p className={style.testimonialText}>
                  Paguei uma vez e uso para sempre. Melhor investimento que fiz
                  para meu negócio. O suporte é rápido e sempre me ajudam quando
                  preciso.
                </p>
                <div className={style.testimonialAuthor}>
                  <strong>Carlos Oliveira</strong>
                  <span>Fundador da OFC Materiais</span>
                </div>
                <div className={style.testimonialCardGlow} aria-hidden='true' />
              </div>

              <div className={style.testimonialCard}>
                <div className={style.testimonialCardImg}>
                  <User size={32} />
                </div>
                <div className={style.testimonialQuote} aria-hidden='true'>
                  &ldquo;
                </div>
                <p className={style.testimonialText}>
                  Finalmente um sistema simples de usar que não precisa de
                  internet. Atendo meus clientes na loja e em feiras sem
                  preocupação.
                </p>
                <div className={style.testimonialAuthor}>
                  <strong>Juliana Costa</strong>
                  <span>Floricultura Primavera</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

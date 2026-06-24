# DECISIONS.md — Decisões Arquiteturais

## 001 — Integração com Emulador PIX

**Data:** 2026-06-09
**Status:** Implementado

### Decisão
Integrar `pix-emulator-mercado-pago` como servidor standalone para ambiente de desenvolvimento, através de uma camada de abstração (`PixService`) que alterna entre emulador (dev) e SDK oficial (prod). O emulador não é dependência de código — `pixService.ts` faz HTTP fetch diretamente.

### Alternativas Consideradas
1. Manter apenas SDK oficial do Mercado Pago
2. Criar mock manual inline

### Motivo
- Permite testar fluxo completo de pagamento sem credenciais reais
- Emulador já implementa API compatível com Mercado Pago
- Transição futura para pacote GitHub é direta (basta publicar e referenciar a URL do servidor)

### Arquivos Criados
- `app/lib/pixConfig.ts` — instância do `PixService` do pacote `pix-payment`

### Arquivos Removidos
- `app/lib/pixService.ts` — substituído pelo pacote `pix-payment`

### Arquivos Modificados
- `package.json` — adicionado `pix-payment`
- `app/comprar-plics-sw/actions.ts` — refatorado para usar `pix-payment`
- `app/api/webhook/route.ts` — refatorado para usar `pix-payment`
- `.env.local` — adicionado `PIX_EMULATOR_URL` e `NEXT_PUBLIC_APP_URL`

### Funcionamento
- **Dev** (`NODE_ENV !== 'production'`): `EmulatorPixService` faz HTTP fetch para `localhost:3001`
- **Prod**: `MercadoPagoPixService` usa SDK `mercadopago` (comportamento original)

---

## 002 — Nova seção "Benefícios" na LandingPage

**Data:** 2026-06-24
**Status:** Implementado

### Decisão
Adicionar uma nova seção de benefícios na LandingPage entre as seções "Versatilidade" e "Preço", com grid 3×2 de cards destacando facilidade de uso, controle de estoque, suporte, gestão completa, informações integradas e decisões melhores.

### Motivo
Conteúdo extraído do site Bling (bling.com.br) para enriquecer a página com copy mais direcionada a benefícios do PLICs SW, sem relação de parceria — apenas inspiração de copywriting.

### Arquivos Modificados
- `app/page.tsx` — adicionada seção `<section className={style.benefits}>` com 6 cards
- `app/styles/Home.module.css` — adicionados estilos `.benefits`, `.benefitCard`, etc.

### Conteúdo Adicionado
- "Conte com o PLICs SW para fazer a gestão completa do seu negócio"
- "Automatize processos e ganhe tempo para focar no crescimento do seu negócio"
- Cards: Fácil de usar, Controle de Estoque, Suporte Completo, Gestão Completa, Informações Integradas, Decisões Melhores

---

## 003 — Seção "Depoimentos" na LandingPage

**Data:** 2026-06-24
**Status:** Implementado

### Decisão
Adicionar seção de depoimentos de clientes entre "Benefícios" e "Preço", com 3 cards em grid contendo quote decorativo, texto do depoimento, avatar com iniciais em gradiente dourado, nome e negócio.

### Motivo
Fortalecer prova social antes da seção de preço, seguindo padrão observado no site Bling que usa depoimentos de clientes reais.

### Arquivos Modificados
- `app/page.tsx` — adicionada seção `<section className={style.testimonials}>` após Pricing, com 3 cards contendo imagem placeholder gradiente + quote + texto + autor
- `app/styles/Home.module.css` — adicionados estilos `.testimonials`, `.testimonialCard`, `.testimonialCardImg`, `.testimonialAuthor`, etc.

### Card do Dashboard
- Borda com gradiente sutil via `::before` pseudo-elemento com `mask-composite`
- Sombra mais rica com transição no hover
- Glow inferior ampliado

---

## 004 — Timer de escassez e persuasão na página de compra

**Data:** 2026-06-24
**Status:** Implementado

### Decisão
Adicionar contagem regressiva de 4 minutos em vermelho na página `/comprar-plics-sw`, com texto de persuasão explorando "medo de ficar para trás".

### Motivo
Técnica de conversão (escassez + prova social negativa) para aumentar a taxa de finalização de compras.

### Arquivos Modificados
- `app/comprar-plics-sw/ComprarClient.tsx` — adicionado `useEffect` com timer de 240s, estado `timeLeft`/`timerExpired`, e UI do card de urgência
- `app/styles/comprar.module.css` — estilos `.urgencyCard`, `.urgencyTimer`, `.urgencyText` com vermelho e pulsação na borda

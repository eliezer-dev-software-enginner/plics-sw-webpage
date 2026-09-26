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

### Iterações
1. Timer de 4min + texto inicial de persuasão
2. Substituída copy para versão focada em estoque com checklist e tagline final
3. Adicionado banner lateral `banner_vertical_anuncio.png` com layout flex (image + texto)
4. Aumentado `max-width` do conteúdo para 920px e imagem para 380px em telas grandes

### Arquivos Modificados
- `app/comprar-plics-sw/ComprarClient.tsx` — adicionado `useEffect` com timer de 240s, estado `timeLeft`/`timerExpired`, UI do card de urgência, copy do anúncio, import do `Image` e banner
- `app/styles/comprar.module.css` — estilos `.urgencyCard`, `.urgencyTimer`, `.urgencyText`, `.urgencyContent`, `.urgencyImageWrap`, `.urgencyTagline`; aumentado `max-width` do `.content` para 920px

---

## 005 — Verificar status do paymentId do localStorage ao acessar tela de pagamento

**Data:** 2026-07-12
**Status:** Implementado

### Decisão
Ao acessar a tela de pagamento sem `paymentId` na URL, primeiro consultar o `paymentId` salvo no localStorage. Se existir, verificar seu status via `syncPaymentStatus`. Se estiver expirado, gerar um novo pagamento e substituir no localStorage. Se estiver pendente, exibir o QR code existente. Se não houver paymentId salvo, criar um novo (comportamento anterior).

### Motivo
Evitar gerar pagamentos desnecessários quando o usuário retorna à tela de pagamento com um paymentId ainda válido salvo. Se o pagamento anterior expirou, automaticamente cria um novo e atualiza o localStorage.

### Fluxo Resultante
1. Usuário acessa `/comprar-plics-sw` sem `paymentId` na URL
2. Código verifica localStorage por `plics_payment_id`
3. Se encontrado → consulta status via `syncPaymentStatus`
   - Aprovado → recarrega página (mostra tela de sucesso)
   - Expirado → cria novo pagamento, salva novo paymentId no localStorage e na URL
   - Pendente → exibe QR code do pagamento existente
4. Se não encontrado no localStorage → cria pagamento novo (comportamento original)

### Arquivos Modificados
- `app/comprar-plics-sw/ComprarClient.tsx` — adicionado import de `getSavedPaymentId`, lógica de verificação no bloco `else` do `useEffect`

---

## 006 — Rota estática "Política de Privacidade"

**Data:** 2026-09-26
**Status:** Implementado

### Decisão
Criar a rota `/politica-de-privacidade` como página de conteúdo estático (server component sem `'use client'`, sem actions), com o texto legal em `constants.ts` e o estilo em `app/styles/politica.module.css`. Link de acesso no `<footer>` global do `layout.tsx`.

### Alternativas Consideradas
1. Deixar o texto hardcoded no JSX
2. Usar MDX para o conteúdo

### Motivo
- A Microsoft Store (e a LGPD) exigem uma URL pública de Política de Privacidade acessível pelo app; o footer global é o ponto de descoberta padrão e não polui o nav de conversão.
- Isolar o texto em `constants.ts` segue o padrão já usado em `comprar-inscritos-instagram/constants.ts` e facilita atualizar a data/versão sem tocar no markup.
- Tema claro "warm paper" (mesmo de `/atualizacao`) para manter coerência com `<Header />`; o tema escuro é exclusivo do funil de compra.
- Sem novas tecnologias: Next.js App Router + CSS Module, como já define `AI_RULES.md`.

### Arquivos Criados
- `app/politica-de-privacidade/page.tsx` — metadata própria (`Política de Privacidade — Plics-SW`) + render das seções
- `app/politica-de-privacidade/constants.ts` — `policySections` (12 seções numeradas), `POLICY_LEAD`, `POLICY_UPDATED_AT` (28/07/2026), `POLICY_FOOTER_NOTE`
- `app/styles/politica.module.css` — classes camelCase, card branco, badge de "última atualização", links em pill

### Arquivos Modificados
- `app/layout.tsx` — import de `next/link` + link "Política de Privacidade" no footer

### Verificação
- `npx tsc --noEmit` sem erros; `npm run lint` sem avisos/erros nos arquivos novos
- `npx next build` → rota listada como `○ (Static) /politica-de-privacidade` (prerenderizada)

---

## 007 — Sitemap e Robots (Metadata Routes)

**Data:** 2026-09-26
**Status:** Implementado

### Decisão
Adicionar `app/sitemap.ts` e `app/robots.ts` (Metadata Routes do Next.js 16, sem dependência externa) e centralizar a URL base em `getBaseUrl()` no `app/lib/common.ts`.

### Alternativas Consideradas
1. Gerar o sitemap via `next-sitemap` (dependência nova)
2. Manter as URLs hardcoded em cada arquivo

### Motivo
- O projeto não tinha `sitemap.xml` nem `robots.txt`; a política de privacidade recém-criada precisa ser rastreável.
- `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → `localhost:3000` já era o padrão usado nos dois `actions.ts`; extrair para `getBaseUrl()` remove a duplicação e passa a ser a única fonte de URL base.
- `lastmod` da política vem de `POLICY_UPDATED_AT` ("28 de julho de 2026"), convertido para `Date`; o resto usa a data do build.

### Arquivos Criados
- `app/sitemap.ts` — 5 rotas (`/`, as 2 de compra, `/atualizacao`, `/politica-de-privacidade`); `/api/webhook` fica de fora
- `app/robots.ts` — `Allow: /`, `Disallow: /api/`, referência ao sitemap

### Arquivos Modificados
- `app/lib/common.ts` — nova função `getBaseUrl()`
- `app/comprar-plics-sw/actions.ts`, `app/comprar-inscritos-instagram/actions.ts` — `notificationUrl` agora usa `getBaseUrl()`

### Verificação
- `next build` → `○ /sitemap.xml` e `○ /robots.txt`; XML conferido em runtime (`next start`)

---

## 008 — Renomeação da rota para `/impulsionar-instagram`

**Data:** 2026-09-26
**Status:** Implementado

### Decisão
Renomear a rota `/comprar-inscritos-instagram` para `/impulsionar-instagram` (com redirect 308 da URL antiga em `next.config.ts`) e renomear o CSS Module `comprarInstagram.module.css` para `impulsionarInstagram.module.css`.

### Alternativas Consideradas
1. Manter a URL antiga e encurtar apenas a copy
2. Renomear sem redirect

### Motivo
- A URL longa estava atrapalhando a criação de anúncios no YouTube; `/impulsionar-instagram` é curta, legível e mais fácil de ditar.
- O redirect 308 preserva links e anúncios que ainda apontem para a URL antiga (inclusive os parâmetros de UTM).
- O CSS Module acompanha o nome da rota, como já acontece com `comprar.module.css`, `atualizacao.module.css` e `politica.module.css`.
- A chave de localStorage `plics_ig_test_mode` **não** mudou (é chave de storage, não URL) — o modo de teste continua funcionando.

### Arquivos Movidos (via `git mv`, preservando histórico)
- `app/comprar-inscritos-instagram/` → `app/impulsionar-instagram/`
- `app/styles/comprarInstagram.module.css` → `app/styles/impulsionarInstagram.module.css`

### Arquivos Modificados
- `app/components/InstagramComprarButton.tsx`, `app/components/InstagramFollowersPopup.tsx` — `router.push` e import de `constants.ts`
- `app/impulsionar-instagram/ComprarClient.tsx`, `app/impulsionar-instagram/components/pix-payment-holder.tsx` — import do CSS Module
- `app/page.tsx` — import de `@/app/impulsionar-instagram/constants`
- `app/sitemap.ts` — URL da rota
- `next.config.ts` — `redirects()` com 308 para a URL antiga
- `README.md`, `docs/CONTEXT.md`, `docs/TODO.md` — referências ao caminho

### Verificação
- `npx tsc --noEmit` limpo; `npm run lint` sem novos problemas (28 pré-existentes, inalterados)
- `next build` → `ƒ /impulsionar-instagram`
- `next start` → `GET /comprar-inscritos-instagram?utm_source=youtube` responde **308** com `Location: /impulsionar-instagram?utm_source=youtube`; `GET /impulsionar-instagram` responde **200**



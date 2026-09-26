# CONTEXT.md — Contexto do Projeto

## Projeto
**plics-sw-website** — Site comercial do aplicativo PLICs SW. Plataforma de venda com pagamento via PIX (Mercado Pago) e entrega de licenças.

## Estrutura Atual

```
plics-sw-website/
├── app/
│   ├── api/webhook/route.ts     — Webhook de notificação de pagamento (usa PixService)
│   ├── comprar-plics-sw/        — Rota de compra do aplicativo (licença via PIX)
│   │   ├── actions.ts           — Server Actions (usa PixService)
│   │   ├── ComprarClient.tsx    — Componente cliente principal
│   │   ├── page.tsx             — Página server component
│   │   ├── PixPayment.tsx       — Componente de exibição do QR Code
│   │   └── components/          — pix-payment-holder
│   ├── impulsionar-instagram/    — Rota de compra de inscritos/seguidores Instagram
│   │   ├── actions.ts           — Server Actions (PIX + pedido no painel SMM)
│   │   ├── ComprarClient.tsx    — Componente cliente principal (polling a cada 5s)
│   │   ├── PixPayment.tsx       — Exibição do QR Code
│   │   ├── page.tsx             — Página server component
│   │   ├── constants.ts         — Tiers (500/1k/2k/5k) com preços próprios
│   │   ├── testMode.ts          — Flag de teste via console (habilitarTeste())
│   │   └── components/          — pix-payment-holder
│   ├── atualizacao/             — Rota de download da última release (usa getLatestRelease)
│   │   └── page.tsx             — Página server component (estática, com <Header />)
│   ├── politica-de-privacidade/ — Rota da Política de Privacidade (estática, LGPD)
│   │   ├── page.tsx             — Server component (estática, com <Header />)
│   │   └── constants.ts         — Texto da política (12 seções) + data de atualização
│   ├── sitemap.ts               — Metadata route: /sitemap.xml
│   ├── robots.ts                — Metadata route: /robots.txt (bloqueia /api/)
│   ├── components/              — Componentes reutilizáveis (Header, botões, popups, suporte)
│   ├── lib/
│   │   ├── common.ts            — Utilitários (UTM, isProductionMode, getBaseUrl)
│   │   ├── db.ts                — Prisma client e queries (Payment, UserPurchase, InstagramFollowersOrder)
│   │   ├── githubRelease.ts     — Última release do GitHub (usada em /atualizacao)
│   │   ├── pixConfig.ts         — ★ PixService do pacote pix-payment (emulador em dev / SDK em prod)
│   │   ├── smmApi.ts            — Cliente do painel SMM (API v2 form-urlencoded)
│   │   ├── smmApiMock.ts        — Mock usado no modo de teste (pedido não vai ao painel)
│   │   ├── smmFulfillment.ts    — Envia pedido ao painel após pagamento aprovado (idempotente)
│   │   ├── mercadoPago.ts       — Configuração do Mercado Pago SDK (apenas prod)
│   │   └── userId.ts            — Gerenciamento de userId
│   ├── styles/                  — CSS Modules (Home, comprar, impulsionarInstagram, atualizacao, politica, header, NoveltyPopup, PixPayment)
│   └── page.tsx                 — LandingPage (Hero, Features, Versatilidade, Benefícios, Depoimentos, Pricing)
├── prisma/schema.prisma         — Modelos Payment, UserPurchase e InstagramFollowersOrder
├── docs/
│   ├── AI_RULES.md
│   ├── CONTEXT.md
│   ├── DECISIONS.md
│   └── TODO.md
└── package.json                 — Inclui dependência pix-payment (git) e mercadopago SDK
```

## Status Atual

- **Dev**: `PixService` usa emulador (`pix-emulator-mercado-pago`, `localhost:3001`) — `NODE_ENV === 'development'`
- **Prod**: `PixService` usa SDK oficial `mercadopago` (token `MP_ACCESS_TOKEN_PROD`)
- Webhook `/api/webhook` recebe notificações do emulador ou do MP real

### Fluxo de pagamento (ambas as rotas)

1. Server action cria o PIX no MP/emulador e salva `Payment` no banco (rota Instagram salva também `InstagramFollowersOrder`).
2. O cliente faz polling a cada 5s (`syncPaymentStatus` / `syncInstagramPaymentStatus`) consultando o MP direto — não depende do webhook.
3. No Instagram, quando aprovado, `fulfillInstagramFollowersOrder` envia o pedido ao painel SMM (idempotente via `claim` atômico no banco). O webhook também dispara isso.

### Webhook — comportamento importante

- O MP dispara a notificação `payment.created` assim que o PIX é criado, **antes** do server action terminar o `savePayment()`. O webhook faz `getPayment()` primeiro: se o registro ainda não existir, responde `200 { received, deferred }` (não gera erro nem reenvios do MP).
- O `paymentId` pode vir no body (`data.id`) ou na query string (`?data.id=...`).
- Tópicos não-`payment` (ex.: `merchant_order`) são ignorados com 200.
- Notificação sem `paymentId` também responde 200 (evita reenvio infinito).
- Sempre responde 200 ao MP; erros reais (5xx) ficam só no log.

### UI da rota Instagram

- Após gerar o PIX, a tela do QR abre imediatamente; o carregamento do pedido (`getInstagramOrder`) roda em segundo plano para não travar o "Gerando pagamento".
- Quando aprovado, abre os detalhes do pedido em nova aba (com link de fallback caso o popup seja bloqueado) e volta o formulário zerado.

### Páginas de conteúdo estático

- `/atualizacao` e `/politica-de-privacidade` são rotas estáticas (prerenderizadas) que renderizam `<Header />` dentro de um `.container` de tema claro.
- O `<Header />` **não** está no `layout.tsx` — cada página que quiser nav precisa renderizá-lo. O `<footer>` é inline no `layout.tsx` (com link para a Política de Privacidade).
- Tema claro "warm paper" das páginas de conteúdo: bg `#faf9f6`, texto `#1c1a16`, muted `#78716c`, azul `#2563eb`, cards brancos com borda `rgba(28, 26, 22, 0.1)`. O tema escuro (`#0a0a0f`) é exclusivo do funil de compra.

### SEO — URLs e metadata routes

- Rotas públicas: `/`, `/comprar-plics-sw`, `/impulsionar-instagram`, `/atualizacao`, `/politica-de-privacidade`.
- `app/sitemap.ts` e `app/robots.ts` são Metadata Routes do Next.js (`/sitemap.xml` e `/robots.txt`, ambos estáticos). O `robots.txt` bloqueia `/api/`.
- URL base em todo o projeto via `getBaseUrl()` (`app/lib/common.ts`): `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → `http://localhost:3000`.
- `next.config.ts` tem redirect **308** de `/comprar-inscritos-instagram` → `/impulsionar-instagram` (URL curta para anúncios no YouTube; não remover enquanto houver links/anúncios antigos no ar).

## Projeto Relacionado

**pix-emulator-mercado-pago** — Emulador local do Mercado Pago PIX
- Express 5, TypeScript, ESM
- Porta 3001 (default)
- Para usar: `cd ../pix-emulator-mercado-pago && npm run dev`

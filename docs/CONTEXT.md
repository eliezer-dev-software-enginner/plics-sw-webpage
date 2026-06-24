# CONTEXT.md — Contexto do Projeto

## Projeto
**plics-sw-website** — Site comercial do aplicativo PLICs SW. Plataforma de venda com pagamento via PIX (Mercado Pago) e entrega de licenças.

## Estrutura Atual

```
plics-sw-website/
├── app/
│   ├── api/webhook/route.ts     — Webhook de notificação de pagamento (usa PixService)
│   ├── comprar-plics-sw/
│   │   ├── actions.ts           — Server Actions (usa PixService)
│   │   ├── ComprarClient.tsx    — Componente cliente principal
│   │   ├── page.tsx             — Página server component
│   │   └── PixPayment.tsx       — Componente de exibição do QR Code
│   ├── components/              — Componentes reutilizáveis
│   ├── lib/
│   │   ├── common.ts            — Utilitários (isProductionMode)
│   │   ├── db.ts                — Prisma client e queries
│   │   ├── mercadoPago.ts       — Configuração do Mercado Pago SDK (apenas prod)
│   │   ├── pixService.ts        — ★ Abstração: emulador (dev) / SDK (prod)
│   │   └── userId.ts            — Gerenciamento de userId
│   ├── styles/                  — CSS Modules
│   │   └── Home.module.css      — Estilos da LandingPage (+ Benefícios, Depoimentos)
│   └── page.tsx                 — LandingPage (Hero, Features, Versatilidade, Benefícios, Depoimentos, Pricing)
├── prisma/schema.prisma         — Modelos Payment e UserPurchase
├── docs/
│   ├── AI_RULES.md
│   ├── CONTEXT.md
│   ├── DECISIONS.md
│   └── TODO.md
└── package.json                 — Inclui dependência local do emulador
```

## Status Atual

- **Dev**: `PixService` usa `EmulatorPixService` → HTTP para `localhost:3001`
- **Prod**: `PixService` usa `MercadoPagoPixService` → SDK oficial
- Webhook `/api/webhook` recebe notificações do emulador ou do MP real

## Projeto Relacionado

**pix-emulator-mercado-pago** — Emulador local do Mercado Pago PIX
- Express 5, TypeScript, ESM
- Porta 3001 (default)
- Para usar: `cd ../pix-emulator-mercado-pago && npm run dev`

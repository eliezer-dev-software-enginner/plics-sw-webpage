This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# plics-sw-webpage

EMULADOR:
LINUX:

cd /home/eliezer/Desktop/dev/pix-emulator-mercado-pago

## Modo de teste — Comprar inscritos Instagram

A página `/comprar-inscritos-instagram` integra com o painel SMM real (smmoficial.com) para
entregar os pedidos após o pagamento. Para testar o fluxo sem criar pedidos reais (sem gastar
dinheiro no painel):

1. Abra a página `/comprar-inscritos-instagram` no navegador.
2. Abra o console do DevTools e digite:
   ```js
   habilitarTeste()
   ```
   A página recarrega e um badge amarelo "🧪 MODO TESTE" aparece fixo no canto da tela.
3. Complete o fluxo normalmente (seleção de quantidade, link do Instagram, pagamento PIX). O
   pedido é salvo com `testMode: true` e, ao ser aprovado, o pedido ao painel SMM é **simulado**
   (`app/lib/smmApiMock.ts`) — nenhuma requisição real é feita a smmoficial.com. O `smmOrderId`
   fica como `TEST-<timestamp>` e o status simulado evolui de "In progress" para "Completed" após
   ~30s.
4. Para desativar o modo de teste:
   ```js
   desabilitarTeste()
   ```

O flag fica salvo no `localStorage` do navegador (`plics_ig_test_mode`), então continua ativo
entre recarregamentos até ser desligado manualmente. Já o `testMode` de cada pedido é persistido
no banco (`InstagramFollowersOrder.testMode`), então o fulfillment simulado funciona corretamente
mesmo quando disparado pelo webhook do Mercado Pago (que não tem acesso ao `localStorage`).

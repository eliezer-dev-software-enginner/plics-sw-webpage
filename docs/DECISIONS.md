# DECISIONS.md — Decisões Arquiteturais

## 001 — Integração com Emulador PIX

**Data:** 2026-06-09
**Status:** Implementado

### Decisão
Integrar `pix-emulator-mercado-pago` como dependência local para ambiente de desenvolvimento, através de uma camada de abstração (`PixService`) que alterna entre emulador (dev) e SDK oficial (prod).

### Alternativas Consideradas
1. Manter apenas SDK oficial do Mercado Pago
2. Criar mock manual inline

### Motivo
- Permite testar fluxo completo de pagamento sem credenciais reais
- Emulador já implementa API compatível com Mercado Pago
- Transição futura para pacote GitHub é direta (trocar `file:` por `git+https://`)

### Arquivos Criados
- `app/lib/pixService.ts` — abstração com interface `IPixService`

### Arquivos Modificados
- `package.json` — dependência local adicionada
- `app/comprar-plics-sw/actions.ts` — refatorado para usar PixService
- `app/api/webhook/route.ts` — refatorado para usar PixService
- `.env.local` — adicionado `PIX_EMULATOR_URL` e `NEXT_PUBLIC_APP_URL`

### Funcionamento
- **Dev** (`NODE_ENV !== 'production'`): `EmulatorPixService` faz HTTP fetch para `localhost:3001`
- **Prod**: `MercadoPagoPixService` usa SDK `mercadopago` (comportamento original)

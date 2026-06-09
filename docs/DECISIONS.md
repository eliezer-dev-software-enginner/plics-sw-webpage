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

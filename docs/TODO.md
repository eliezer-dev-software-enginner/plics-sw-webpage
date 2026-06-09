# TODO.md — Tarefas e Próximos Passos

## Pendentes

- [ ] Testar fluxo completo: emulador rodando + site em dev
- [ ] Ajustar webhook default do emulador (`/api/checkout/webhook` → `/api/webhook`) se necessário
- [ ] (Futuro) Migrar dependência local para pacote GitHub

## Concluídas

- [x] Criar docs (AI_RULES, CONTEXT, DECISIONS, TODO)
- [x] Adicionar dependência local `mercadopago-pix-emulator` no package.json
- [x] Criar `app/lib/pixService.ts` com interface IPixService
- [x] Implementar `EmulatorPixService` (dev) e `MercadoPagoPixService` (prod)
- [x] Refatorar `actions.ts` para usar PixService
- [x] Refatorar `webhook/route.ts` para usar PixService
- [x] Adicionar `PIX_EMULATOR_URL` e `NEXT_PUBLIC_APP_URL` no .env.local

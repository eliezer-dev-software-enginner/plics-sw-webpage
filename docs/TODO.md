# TODO.md — Tarefas e Próximos Passos

## Pendentes

- [ ] (Futuro) Migrar dependência local para pacote GitHub
- [ ] Ajustar webhook default do emulador (`/api/checkout/webhook` → `/api/webhook`) se necessário
## Concluídas

- [x] Adicionar seção "Benefícios" na LandingPage com conteúdo inspirado no bling.com.br
- [x] Adicionar seção "Depoimentos" com cards de imagem (avatar com iniciais) + texto

- [x] Criar docs (AI_RULES, CONTEXT, DECISIONS, TODO)
- [x] Adicionar dependência local `mercadopago-pix-emulator` no package.json
- [x] Criar `app/lib/pixService.ts` com interface IPixService
- [x] Implementar `EmulatorPixService` (dev) e `MercadoPagoPixService` (prod)
- [x] Refatorar `actions.ts` e `webhook/route.ts` para usar PixService
- [x] Adicionar `PIX_EMULATOR_URL` e `NEXT_PUBLIC_APP_URL` no .env.local
- [x] Corrigir geração de novo userId a cada clique em "Começar Agora"
- [x] Salvar `paymentId` no localStorage para reuso entre sessões
- [x] Testar fluxo completo: emulador + site em dev

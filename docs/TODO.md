# TODO.md — Tarefas e Próximos Passos
## Pendentes

- [ ] Remover o redirect 308 de `/comprar-inscritos-instagram` depois que os anúncios/links antigos saírem do ar
- [ ] Considerar URL curta ainda menor para o YouTube (ex.: `/instagram` ou uma vanity URL no domínio)
- [ ] Decidir se a Política de Privacidade também entra no nav do `<Header />` (hoje só no footer)
- [ ] (Futuro) Migrar dependência local para pacote GitHub
- [ ] Ajustar webhook default do emulador (`/api/checkout/webhook` → `/api/webhook`) se necessário

## Concluídas

- [x] Renomear rota `/comprar-inscritos-instagram` → `/impulsionar-instagram` (com redirect 308 da URL antiga)
- [x] Criar `app/sitemap.ts` e `app/robots.ts` (Metadata Routes) + `getBaseUrl()` em `lib/common.ts`
- [x] Criar rota `/politica-de-privacidade` (texto da política em `constants.ts` + CSS Module próprio)
- [x] Adicionar link da Política de Privacidade no footer global

- [x] Verificar paymentId do localStorage ao acessar tela de pagamento (se expirado, gera novo)
- [x] Adicionar seção "Benefícios" na LandingPage com conteúdo inspirado no bling.com.br
- [x] Adicionar seção "Depoimentos" com cards de imagem (avatar com iniciais) + texto
- [x] Adicionar timer de escassez (4min) + texto de persuasão na página de compra
- [x] Adicionar banner vertical e ajustar largura do card de urgência

- [x] Criar docs (AI_RULES, CONTEXT, DECISIONS, TODO)
- [x] Adicionar dependência local `mercadopago-pix-emulator` no package.json
- [x] Criar `app/lib/pixService.ts` com interface IPixService
- [x] Implementar `EmulatorPixService` (dev) e `MercadoPagoPixService` (prod)
- [x] Refatorar `actions.ts` e `webhook/route.ts` para usar PixService
- [x] Adicionar `PIX_EMULATOR_URL` e `NEXT_PUBLIC_APP_URL` no .env.local
- [x] Corrigir geração de novo userId a cada clique em "Começar Agora"
- [x] Salvar `paymentId` no localStorage para reuso entre sessões
- [x] Testar fluxo completo: emulador + site em dev

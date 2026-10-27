# Plics SW — site

Site comercial do Plics SW, um aplicativo de gestão (ERP) para pequenos e médios negócios. Este repositório contém o **site**, não o código do aplicativo de desktop. A aplicação apresenta o produto, oferece downloads, recebe pagamentos PIX por licenças e inclui uma página para pedidos de impulsionamento no Instagram.

O site usa [Next.js](https://nextjs.org), React e TypeScript. Para conhecer o framework, consulte a [documentação do Next.js](https://nextjs.org/docs) e o tutorial [Learn Next.js](https://nextjs.org/learn). Pagamentos usam `pix-payment` e Mercado Pago; os registros são armazenados em PostgreSQL por meio do Prisma. A página de Instagram também se integra a um painel SMM após a aprovação do pagamento. O pacote está marcado como `private` em `package.json`.

## Executar localmente

É necessário ter Node.js e npm compatíveis com as dependências de `package.json`, além de um banco PostgreSQL acessível. O repositório inclui `package-lock.json` e não inclui um arquivo de exemplo para as variáveis de ambiente.

1. Instale as dependências na raiz do repositório:

   ```bash
   npm ci
   ```

   A instalação da dependência `pix-payment` requer acesso ao repositório Git indicado em `package.json`.

2. Configure as variáveis necessárias em `.env.local`, sem publicar valores secretos. `PRISMA_URL` é a URL de conexão com o PostgreSQL definida em `prisma/schema.prisma`. `MP_ACCESS_TOKEN_TEST` ou `MP_ACCESS_TOKEN_PROD` é exigido para criar pagamentos. Para o fluxo de compra da licença, configure também `PRECO`; a interface usa `NEXT_PUBLIC_PRECO` e `NEXT_PUBLIC_PRECO_DE` para exibir preços. `NEXT_PUBLIC_APP_URL` define a URL base usada nas notificações de pagamento; sem ela, o código usa `VERCEL_URL` ou `http://localhost:3000`.

   O desenvolvimento usa o emulador PIX quando `NODE_ENV` é `development`; `PIX_EMULATOR_URL` aponta para esse serviço externo, que **não faz parte deste repositório**. A configuração e o acesso ao emulador precisam ser providenciados separadamente. Para pedidos reais de Instagram, configure `SMM_API_KEY` e `SMM_SERVICE_ID_INSTAGRAM_FOLLOWERS`; `SMM_API_URL` é opcional. Outras variáveis usadas pelo site podem ser localizadas pelas referências a `process.env` no código.

3. Gere o cliente Prisma e inicie o servidor:

   ```bash
   npx prisma generate
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000). O esquema do banco está em `prisma/schema.prisma`; este repositório não contém migrações Prisma para criar suas tabelas. Os fluxos que acessam o banco exigem um esquema compatível já preparado.

`npm run build` gera o cliente Prisma e compila o site; `npm run start` inicia a versão compilada. `npm run lint` executa o ESLint. Veja os scripts em `package.json`.

## Páginas e fluxos

- `/`: apresentação do Plics SW, compra e opções de download.
- `/comprar-plics-sw`: pagamento PIX da licença e liberação de acesso após aprovação.
- `/impulsionar-instagram`: seleção de quantidade e perfil, pagamento PIX e acompanhamento do pedido. A rota existe, mas a divulgação do serviço na página inicial está desativada no código.
- `/atualizacao`: consulta da última versão e downloads disponíveis.
- `/politica-de-privacidade`: política de privacidade exibida no site.
- `/api/webhook`: recebimento de notificações de pagamento.

Os downloads de instaladores dependem dos arquivos da última release publicada no GitHub, consultada por `app/lib/githubRelease.ts`.

## Modo de teste — impulsionamento no Instagram

O modo de teste **simula somente o envio e a consulta do pedido ao painel SMM**. A criação e a confirmação do pagamento PIX ainda passam pelo serviço configurado em `app/lib/pixConfig.ts`; portanto, use um ambiente de pagamento de teste apropriado antes de percorrer o fluxo.

1. Abra `/impulsionar-instagram` no navegador e execute no console do DevTools:

   ```js
   habilitarTeste()
   ```

   A página recarrega e exibe o indicador `🧪 MODO TESTE`.
2. Escolha a quantidade, informe o perfil e conclua o fluxo PIX no ambiente configurado. O pedido é salvo com `testMode: true` no banco. Quando o pagamento é aprovado, `app/lib/smmApiMock.ts` substitui a chamada ao painel SMM. O identificador do pedido começa com `TEST-`; a consulta simulada retorna `In progress` e, após cerca de 30 segundos, `Completed`.
3. Para desativar o modo, execute:

   ```js
   desabilitarTeste()
   ```

A opção fica no `localStorage` do navegador (`plics_ig_test_mode`) até ser desativada. O estado de cada pedido também é persistido em `InstagramFollowersOrder.testMode`, permitindo que o webhook use a simulação quando processar um pagamento aprovado.

## Licença

Não há arquivo de licença neste repositório. As condições de uso e redistribuição do código precisam ser definidas pelos responsáveis pelo projeto.

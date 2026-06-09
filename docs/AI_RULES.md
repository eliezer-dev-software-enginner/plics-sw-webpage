# AI_RULES.md — Regras para Agentes de IA

## Diretrizes

1. **Leia este arquivo antes de qualquer ação.**
2. Não introduza tecnologias diferentes sem autorização explícita.
3. Siga os padrões existentes do projeto (Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma).
4. Sempre explique o plano antes de modificar arquivos.
5. Ao finalizar, registre em DECISIONS.md e atualize TODO.md e CONTEXT.md.

## Stack Aprovada

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma (PostgreSQL)
- Mercado Pago SDK (produção)
- Pix Emulator (desenvolvimento)

## Convenções

- Server Actions em arquivos `actions.ts`
- Componentes Client em arquivos `.tsx` com `'use client'`
- Estilos em CSS Modules em `app/styles/`
- Lib/services em `app/lib/`
- Rotas de API em `app/api/<rota>/route.ts`

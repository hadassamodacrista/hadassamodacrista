# Hadassa · Loja Online

Site de catálogo da Hadassa (moda cristã), com painel administrativo para você mesma cadastrar
produtos, definir preços e receber pagamentos online pelo Mercado Pago.

## O que já está pronto

- Catálogo público com busca e filtro por categoria (`/`)
- Página de cada produto com fotos, tamanhos, cores e botão "Comprar agora" (`/produto/[nome]`)
- Botão flutuante de WhatsApp em todo o site
- Painel administrativo protegido por senha (`/admin`):
  - Listar, criar, editar, excluir produtos
  - Upload de fotos
  - Ocultar/mostrar produtos sem excluir
  - Configurações da loja: nome, WhatsApp, Instagram, chaves do Mercado Pago
- Catálogo inicial com 36 vestidos/conjuntos de exemplo (fotos e nomes do site que você mandou de
  referência) — **veja o aviso importante sobre essas fotos logo abaixo**

## ⚠️ Sobre as fotos de exemplo

Para você já ver o site funcionando, o catálogo inicial foi criado com os nomes e fotos dos
vestidos do site brithamel.com.br (o fornecedor que você revende). Antes de divulgar o site
publicamente, confirme com a Brithamel se você pode usar as fotos deles no seu site, ou troque
pelas suas próprias fotos direto pelo painel admin (Editar produto → Fotos). É rápido: basta tirar
foto/print e subir por lá.

## Como rodar no seu computador

Pré-requisito: ter o [Node.js](https://nodejs.org) instalado (versão 20 ou mais recente).

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Depois abra http://localhost:3000 no navegador. O catálogo público fica em `/` e o painel admin em
`/admin`.

A senha inicial do admin é `hadassa2024` (definida no arquivo `.env`). **Antes de publicar o site**,
troque no arquivo `.env` tanto o `ADMIN_PASSWORD` (a senha) quanto o `ADMIN_SESSION_SECRET` (uma
frase aleatória qualquer, grande, que só o servidor conhece).

## Como publicar o site na internet (Vercel)

1. Crie uma conta gratuita em https://vercel.com (pode entrar com GitHub ou Google)
2. Suba este projeto para um repositório no GitHub (posso te ajudar com isso quando quiser)
3. No Vercel, clique em "Add New Project" e selecione o repositório
4. **Importante:** antes de publicar de verdade, o banco de dados precisa ser trocado. Hoje o site
   usa um arquivo local (SQLite) que funciona no seu computador, mas a Vercel não guarda arquivos
   entre uma visita e outra. Para produção, é preciso um banco de dados na nuvem — recomendo o
   [Neon](https://neon.tech) (Postgres, tem plano gratuito) ou o [Turso](https://turso.tech). Me
   avise quando quiser publicar de verdade que eu ajudo a fazer essa troca e configurar tudo.
5. O mesmo vale para as fotos enviadas pelo painel admin: hoje elas ficam salvas numa pasta do
   projeto, o que funciona local mas não persiste na Vercel. Nesse momento também configuramos um
   armazenamento de imagens (ex: Vercel Blob).

Ou seja: **o site já está pronto para você usar e testar agora, localmente.** Quando decidir
publicar para os clientes acessarem de verdade, me chame que eu ajusto banco de dados e
armazenamento de fotos para funcionar na nuvem — é rápido.

## Como configurar o Mercado Pago

1. Crie (ou entre na) sua conta em https://www.mercadopago.com.br
2. Acesse https://www.mercadopago.com.br/developers/panel/app e crie uma aplicação
3. Copie o **Access Token** (em Credenciais de produção, depois de ativar sua conta para vender)
4. No painel do site, vá em **Configurações** e cole o Access Token no campo correspondente
5. Pronto — o botão "Comprar agora" passa a redirecionar para o checkout do Mercado Pago

Enquanto o token não estiver configurado, o botão "Comprar agora" mostra uma mensagem pedindo para
o cliente falar pelo WhatsApp, então o site nunca fica "quebrado" para quem visita.

## Estrutura do projeto (para referência técnica)

- `src/app` — páginas do site (Next.js App Router)
- `src/app/admin` — painel administrativo
- `src/app/api` — rotas de backend (produtos, upload, checkout, configurações)
- `prisma/schema.prisma` — estrutura do banco de dados
- `public/products` — imagens dos produtos

## Comandos úteis

```bash
npm run dev        # roda o site em modo de desenvolvimento
npm run build      # gera a versão de produção
npm run db:push    # aplica o schema do banco de dados
npm run db:seed    # popula o banco com o catálogo inicial de exemplo
```

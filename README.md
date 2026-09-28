# NERA · Landing page para restaurantes

Landing page interativa com painel administrativo, feita com HTML, CSS e JavaScript puros + Supabase.

**Demo:** https://nera-restaurante.vercel.app · **Painel:** https://nera-restaurante.vercel.app/admin → "Ver painel como visitante"

## Funcionalidades

**Site público**
- Hero em tela cheia com slides automáticos e foto que se dissolve no fundo
- Cardápio com filtro por categoria, busca e modal com pedido direto no WhatsApp
- Galeria em mosaico com lightbox (teclado e swipe)
- Avaliações com nota média; novas avaliações entram em moderação
- Localização com mapa, horários (destaca o dia de hoje), rota e ligação
- Formulário de contato (dúvidas, reservas, eventos)

**Painel admin** (`/admin`)
- Visitas dos últimos 14 dias, **pratos mais clicados**, fotos mais vistas e cliques em botões
- Caixa de mensagens, moderação de avaliações e edição do cardápio (preço, destaque, ativo)
- Conta de demonstração **somente leitura**, com contatos dos clientes mascarados

## Arquitetura

- `public/` — site estático publicado na Vercel
- `public/js/config.js` — textos, contato, slides e galeria (troque aqui para outro restaurante)
- `supabase/schema.sql` — tabelas, **Row Level Security** e funções (RPC) do schema `nera`
- `supabase/seed.sql` — cardápio e avaliações iniciais
- `supabase/demo-lock.sql` — impede que a conta demo troque senha/e-mail

Segurança: o navegador usa apenas a chave pública; visitantes só conseguem **inserir** mensagens/avaliações
(pendentes), eventos passam por uma função que valida o tipo, e somente o papel `owner` lê contatos ou altera dados.

## Rodar localmente

```bash
npm run dev   # http://localhost:3000
```

# NERA · Landing page para restaurantes

Landing page interativa com painel administrativo, feita com HTML, CSS e JavaScript puros.

**Demo:** https://nera-restaurante.vercel.app · **Painel:** https://nera-restaurante.vercel.app/admin

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

## Como funciona

É um **template de demonstração**: não tem login nem banco de dados. Cada visitante recebe dados de exemplo
guardados no próprio navegador (`localStorage`), e tudo o que ele faz no site (abrir pratos, enviar mensagem,
avaliar) aparece na hora no painel. O botão "Restaurar exemplo" no painel volta tudo ao início.

- `public/js/config.js` — textos, contato, slides e galeria (troque aqui para outro restaurante)
- `public/js/data.js` — cardápio e dados de exemplo do painel
- `public/js/store.js` — "banco" local do template

## Rodar localmente

```bash
npm run dev   # http://localhost:3000
```

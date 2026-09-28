# NERA · Landing page para restaurantes

Landing page interativa + painel administrativo. Pensada como template reutilizável:
troque os dados em `data/seed.js` e o site vira outro restaurante.

## Rodar

```bash
npm install
npm run dev            # http://localhost:3000
```

- Site: `http://localhost:3000`
- Painel: `http://localhost:3000/admin` — senha padrão `admin123`
  (defina outra com `ADMIN_PASSWORD=... npm start`)

## O que tem

**Site público**
- Hero em tela cheia com 3 slides (inspirado no template Vivaia)
- Cardápio com filtro por categoria, busca (ícone de lupa) e modal do prato com "Pedir no WhatsApp"
- Galeria em mosaico com lightbox (setas do teclado e swipe no celular)
- Avaliações com nota média + formulário (entra em moderação)
- Localização com mapa, horários (destaca o dia de hoje), traçar rota e ligar
- Formulário de contato (dúvidas, reservas, eventos)
- Redes sociais e WhatsApp flutuante

**Painel admin**
- Visão geral: visitas do dia/14 dias, **pratos mais clicados**, fotos mais vistas, cliques em botões
- Mensagens: lidas/não lidas, responder por e-mail ou WhatsApp, excluir
- Avaliações: aprovar/ocultar/excluir
- Cardápio: preço, destaque e ativar/desativar prato

## Estrutura

```
server.js          API Express + auth do admin + rate limit
data/seed.js       dados iniciais (restaurante, cardápio, galeria)
data/db.json       "banco" gerado na 1ª execução (ignorado no git)
public/            index.html, admin.html, css/, js/
```

## Próximos passos sugeridos
- Trocar o JSON por banco real (Supabase/Postgres) e fazer deploy
- CRUD completo do cardápio e upload de fotos pelo painel
- Notificação (e-mail/WhatsApp) quando chegar mensagem nova
- Reservas com data/horário

// Dados de exemplo do template (cardápio, avaliações, mensagens e métricas iniciais).
export const MENU = [
  {
    "id": "spaghetti-gamberi",
    "name": "Spaghetti ai Gamberi",
    "category": "Massas",
    "price": 78,
    "description": "Spaghetti fresco, camarões salteados no alho, tomate-cereja confitado e salsinha.",
    "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "frutos do mar"
    ],
    "featured": true,
    "active": true
  },
  {
    "id": "fettuccine-ragu",
    "name": "Fettuccine al Ragù",
    "category": "Massas",
    "price": 72,
    "description": "Fettuccine na manteiga com ragu de costela cozida por 8 horas.",
    "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "da casa"
    ],
    "featured": true,
    "active": true
  },
  {
    "id": "penne-arrabbiata",
    "name": "Penne all’Arrabbiata",
    "category": "Massas",
    "price": 56,
    "description": "Molho de tomate San Marzano, pimenta calabresa e pecorino.",
    "image": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "picante",
      "vegetariano"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "farfalle-pesto",
    "name": "Farfalle al Pesto",
    "category": "Massas",
    "price": 58,
    "description": "Pesto de manjericão, pinoli tostados e tomates frescos.",
    "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "vegetariano"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "bife-chorizo",
    "name": "Bife de Chorizo",
    "category": "Carnes",
    "price": 96,
    "description": "Corte de 350 g na brasa com batatas rústicas e chimichurri.",
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "brasa"
    ],
    "featured": true,
    "active": true
  },
  {
    "id": "parrilla",
    "name": "Parrilla da Casa",
    "category": "Carnes",
    "price": 148,
    "description": "Espetinhos de frango, linguiça artesanal e legumes grelhados. Serve 2.",
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "para dividir"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "salmone",
    "name": "Salmone alla Griglia",
    "category": "Peixes",
    "price": 89,
    "description": "Salmão grelhado, vinagrete de maçã verde e verdes da estação.",
    "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "sem glúten"
    ],
    "featured": true,
    "active": true
  },
  {
    "id": "ravioli-verde",
    "name": "Ravioli Verde",
    "category": "Entradas",
    "price": 44,
    "description": "Ravioli de espinafre ao vapor com caldo de legumes e gengibre.",
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "vegetariano"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "insalata",
    "name": "Insalata Nera",
    "category": "Entradas",
    "price": 38,
    "description": "Folhas, queijo de cabra, azeitonas pretas, cebola roxa e cenoura.",
    "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "vegetariano"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "tartine",
    "name": "Tartine di Uovo",
    "category": "Entradas",
    "price": 36,
    "description": "Pão de fermentação natural, abacate, ovo mollet e espinafre.",
    "image": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=900&q=80&auto=format&fit=crop",
    "tags": [],
    "featured": false,
    "active": true
  },
  {
    "id": "panna-cotta",
    "name": "Panna Cotta",
    "category": "Sobremesas",
    "price": 32,
    "description": "Creme de baunilha com calda e morangos frescos.",
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "sem glúten"
    ],
    "featured": false,
    "active": true
  },
  {
    "id": "negroni",
    "name": "Negroni Affumicato",
    "category": "Drinks",
    "price": 42,
    "description": "Gin, Campari, vermute rosso e fumaça de alecrim.",
    "image": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80&auto=format&fit=crop",
    "tags": [
      "autoral"
    ],
    "featured": false,
    "active": true
  }
];

export const SAMPLE_REVIEWS = [
  {
    "name": "Mariana S.",
    "rating": 5,
    "text": "O spaghetti com camarão é surreal. Atendimento impecável e ambiente lindo.",
    "approved": true,
    "daysAgo": 47
  },
  {
    "name": "Rafael T.",
    "rating": 5,
    "text": "Melhor bife de chorizo da região. Voltarei com certeza!",
    "approved": true,
    "daysAgo": 29
  },
  {
    "name": "Juliana P.",
    "rating": 4,
    "text": "Drinks autorais excelentes. Só achei a espera um pouco longa no sábado.",
    "approved": true,
    "daysAgo": 14
  },
  {
    "name": "Bruno L.",
    "rating": 5,
    "text": "Levei minha família no domingo e todos amaram a parrilla. Porção generosa!",
    "approved": true,
    "daysAgo": 6
  },
  {
    "name": "Camila R.",
    "rating": 4,
    "text": "Panna cotta maravilhosa. Voltaria só pela sobremesa.",
    "approved": false,
    "daysAgo": 1
  }
];

export const SAMPLE_MESSAGES = [
  {
    "name": "Ana Souza",
    "email": "ana.souza@exemplo.com",
    "phone": "11 98888-7777",
    "subject": "Reserva",
    "text": "Olá! Vocês têm mesa para 6 pessoas no sábado às 20h?",
    "read": false,
    "hoursAgo": 3
  },
  {
    "name": "Pedro Martins",
    "email": "pedro@exemplo.com",
    "phone": "",
    "subject": "Evento privado",
    "text": "Gostaria de orçamento para um jantar de aniversário com 25 pessoas em novembro.",
    "read": false,
    "hoursAgo": 20
  },
  {
    "name": "Luiza Castro",
    "email": "",
    "phone": "11 97777-1234",
    "subject": "Delivery",
    "text": "Vocês entregam no Itaim Bibi? Qual o valor da taxa?",
    "read": true,
    "hoursAgo": 52
  }
];

// Perfil de visitas/cliques dos últimos 14 dias para o painel não começar vazio.
export const SAMPLE_VISITS = [38, 42, 35, 51, 64, 88, 73, 40, 45, 39, 57, 69, 94, 31];
export const SAMPLE_CLICKS = {
  'dish:spaghetti-gamberi': 128, 'dish:bife-chorizo': 104, 'dish:fettuccine-ragu': 87, 'dish:salmone': 66,
  'dish:parrilla': 58, 'dish:negroni': 51, 'dish:panna-cotta': 43, 'dish:penne-arrabbiata': 37,
  'dish:ravioli-verde': 29, 'dish:farfalle-pesto': 24, 'dish:insalata': 18, 'dish:tartine': 12,
  'gallery:g1': 61, 'gallery:g3': 48, 'gallery:g2': 40, 'gallery:g5': 33, 'gallery:g7': 27, 'gallery:g4': 19, 'gallery:g6': 14, 'gallery:g8': 11,
  'cta:pedido-whatsapp': 74, 'cta:hero-cardapio': 66, 'cta:rota': 31, 'cta:whatsapp-flutuante': 28, 'cta:social-instagram': 22, 'cta:ligar': 15,
};

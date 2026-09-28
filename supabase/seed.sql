-- Dados iniciais da NERA
insert into nera.menu_items (id, name, category, price, description, image, tags, featured, active, sort) values
  ('spaghetti-gamberi', 'Spaghetti ai Gamberi', 'Massas', 78, 'Spaghetti fresco, camarões salteados no alho, tomate-cereja confitado e salsinha.', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80&auto=format&fit=crop', array['frutos do mar']::text[], true, true, 0),
  ('fettuccine-ragu', 'Fettuccine al Ragù', 'Massas', 72, 'Fettuccine na manteiga com ragu de costela cozida por 8 horas.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80&auto=format&fit=crop', array['da casa']::text[], true, true, 1),
  ('penne-arrabbiata', 'Penne all’Arrabbiata', 'Massas', 56, 'Molho de tomate San Marzano, pimenta calabresa e pecorino.', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80&auto=format&fit=crop', array['picante', 'vegetariano']::text[], false, true, 2),
  ('farfalle-pesto', 'Farfalle al Pesto', 'Massas', 58, 'Pesto de manjericão, pinoli tostados e tomates frescos.', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80&auto=format&fit=crop', array['vegetariano']::text[], false, true, 3),
  ('bife-chorizo', 'Bife de Chorizo', 'Carnes', 96, 'Corte de 350 g na brasa com batatas rústicas e chimichurri.', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=900&q=80&auto=format&fit=crop', array['brasa']::text[], true, true, 4),
  ('parrilla', 'Parrilla da Casa', 'Carnes', 148, 'Espetinhos de frango, linguiça artesanal e legumes grelhados. Serve 2.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80&auto=format&fit=crop', array['para dividir']::text[], false, true, 5),
  ('salmone', 'Salmone alla Griglia', 'Peixes', 89, 'Salmão grelhado, vinagrete de maçã verde e verdes da estação.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80&auto=format&fit=crop', array['sem glúten']::text[], true, true, 6),
  ('ravioli-verde', 'Ravioli Verde', 'Entradas', 44, 'Ravioli de espinafre ao vapor com caldo de legumes e gengibre.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&q=80&auto=format&fit=crop', array['vegetariano']::text[], false, true, 7),
  ('insalata', 'Insalata Nera', 'Entradas', 38, 'Folhas, queijo de cabra, azeitonas pretas, cebola roxa e cenoura.', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80&auto=format&fit=crop', array['vegetariano']::text[], false, true, 8),
  ('tartine', 'Tartine di Uovo', 'Entradas', 36, 'Pão de fermentação natural, abacate, ovo mollet e espinafre.', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=900&q=80&auto=format&fit=crop', array[]::text[], false, true, 9),
  ('panna-cotta', 'Panna Cotta', 'Sobremesas', 32, 'Creme de baunilha com calda e morangos frescos.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80&auto=format&fit=crop', array['sem glúten']::text[], false, true, 10),
  ('negroni', 'Negroni Affumicato', 'Drinks', 42, 'Gin, Campari, vermute rosso e fumaça de alecrim.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80&auto=format&fit=crop', array['autoral']::text[], false, true, 11)
on conflict (id) do nothing;

insert into nera.reviews (name, rating, text, approved, created_at) values
  ('Mariana S.', 5, 'O spaghetti com camarão é surreal. Atendimento impecável e ambiente lindo.', true, '2026-08-12T20:10:00.000Z'),
  ('Rafael T.', 5, 'Melhor bife de chorizo da região. Voltarei com certeza!', true, '2026-08-30T21:40:00.000Z'),
  ('Juliana P.', 4, 'Drinks autorais excelentes. Só achei a espera um pouco longa no sábado.', true, '2026-09-14T22:05:00.000Z');

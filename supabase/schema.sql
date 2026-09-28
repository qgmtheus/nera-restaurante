-- =====================================================================
-- NERA · schema do banco (Supabase / Postgres)
-- Tudo fica no schema "nera" para que outras landing pages do portfólio
-- possam viver no mesmo projeto sem conflito.
-- =====================================================================
create schema if not exists nera;
grant usage on schema nera to anon, authenticated;

-- ---------- Tabelas ----------
create table nera.admins (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('owner', 'viewer'))
);

create table nera.menu_items (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  description text not null default '',
  image text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  sort int not null default 0
);

create table nera.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  text text not null check (char_length(text) between 1 and 600),
  rating int not null check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table nera.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text check (char_length(email) <= 120),
  phone text check (char_length(phone) <= 30),
  subject text not null default 'Dúvida' check (char_length(subject) <= 40),
  text text not null check (char_length(text) between 1 and 1500),
  read boolean not null default false,
  created_at timestamptz not null default now(),
  check (coalesce(email, '') <> '' or coalesce(phone, '') <> '')
);

create table nera.events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('visit', 'dish', 'gallery', 'cta')),
  ref text check (char_length(ref) <= 40),
  created_at timestamptz not null default now()
);
create index on nera.events (type, created_at);
create index on nera.reviews (approved, created_at desc);
create index on nera.messages (created_at desc);

-- ---------- Helpers ----------
create or replace function nera.role() returns text
language sql stable security definer set search_path = '' as $$
  select role from nera.admins where user_id = auth.uid()
$$;

create or replace function nera.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from nera.admins where user_id = auth.uid() and role = 'owner')
$$;

create or replace function nera.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from nera.admins where user_id = auth.uid())
$$;

-- Anti-flood simples: limita inserções públicas por minuto (global)
create or replace function nera.flood_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  execute format('select count(*) from nera.%I where created_at > now() - interval ''1 minute''', tg_table_name) into n;
  if n >= 20 then raise exception 'Muitas mensagens agora, tente em instantes.'; end if;
  return new;
end $$;
create trigger messages_flood before insert on nera.messages for each row execute function nera.flood_guard();
create trigger reviews_flood  before insert on nera.reviews  for each row execute function nera.flood_guard();

-- ---------- RLS ----------
alter table nera.admins     enable row level security;
alter table nera.menu_items enable row level security;
alter table nera.reviews    enable row level security;
alter table nera.messages   enable row level security;
alter table nera.events     enable row level security;

create policy "admins: ver o próprio papel" on nera.admins for select to authenticated using (user_id = (select auth.uid()));

create policy "menu: público vê ativos" on nera.menu_items for select to anon, authenticated using (active or (select nera.is_staff()));
create policy "menu: dono edita" on nera.menu_items for update to authenticated using ((select nera.is_owner())) with check ((select nera.is_owner()));

create policy "reviews: público vê aprovadas" on nera.reviews for select to anon, authenticated using (approved or (select nera.is_staff()));
create policy "reviews: público envia pendente" on nera.reviews for insert to anon, authenticated with check (approved = false);
create policy "reviews: dono modera" on nera.reviews for update to authenticated using ((select nera.is_owner())) with check ((select nera.is_owner()));
create policy "reviews: dono exclui" on nera.reviews for delete to authenticated using ((select nera.is_owner()));

create policy "messages: público envia" on nera.messages for insert to anon, authenticated with check (read = false);
create policy "messages: dono lê" on nera.messages for select to authenticated using ((select nera.is_owner()));
create policy "messages: dono edita" on nera.messages for update to authenticated using ((select nera.is_owner())) with check ((select nera.is_owner()));
create policy "messages: dono exclui" on nera.messages for delete to authenticated using ((select nera.is_owner()));
-- events: sem policies => só acessível pelas funções abaixo

grant select on nera.admins to authenticated;
grant select, update on nera.menu_items to anon, authenticated;
grant select, insert, update, delete on nera.reviews to anon, authenticated;
grant insert, select, update, delete on nera.messages to anon, authenticated;

-- ---------- RPCs ----------
-- Registro de eventos (visita, clique em prato/foto/botão)
create or replace function nera.track(p_type text, p_ref text default null) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_type not in ('visit', 'dish', 'gallery', 'cta') then raise exception 'evento inválido'; end if;
  if p_type = 'dish' and not exists (select 1 from nera.menu_items where id = p_ref) then raise exception 'prato inválido'; end if;
  insert into nera.events (type, ref) values (p_type, left(p_ref, 40));
end $$;

-- Painel: números agregados (dono e visitante demo)
create or replace function nera.dashboard() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not nera.is_staff() then raise exception 'não autorizado'; end if;
  select jsonb_build_object(
    'visits_today', (select count(*) from nera.events where type = 'visit' and created_at >= date_trunc('day', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'),
    'visits_total', (select count(*) from nera.events where type = 'visit'),
    'visits_by_day', (
      select coalesce(jsonb_agg(jsonb_build_object('date', d::date, 'visits', coalesce(c, 0)) order by d), '[]')
      from generate_series((now() at time zone 'America/Sao_Paulo')::date - 13, (now() at time zone 'America/Sao_Paulo')::date, interval '1 day') d
      left join (
        select (created_at at time zone 'America/Sao_Paulo')::date day, count(*) c
        from nera.events where type = 'visit' group by 1
      ) v on v.day = d::date),
    'clicks', (
      select coalesce(jsonb_object_agg(type || ':' || ref, c), '{}')
      from (select type, ref, count(*) c from nera.events where type <> 'visit' and ref is not null group by 1, 2) x),
    'unread_messages', (select count(*) from nera.messages where not read),
    'pending_reviews', (select count(*) from nera.reviews where not approved),
    'rating', (select round(avg(rating)::numeric, 1) from nera.reviews where approved)
  ) into result;
  return result;
end $$;

-- Mensagens: dono vê tudo; visitante demo vê com contato mascarado
create or replace function nera.list_messages() returns table (
  id uuid, name text, email text, phone text, subject text, text text, read boolean, created_at timestamptz
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not nera.is_staff() then raise exception 'não autorizado'; end if;
  return query
    select m.id, m.name,
      case when nera.is_owner() or m.email is null then m.email else regexp_replace(m.email, '^(.).*(@.*)$', '\1•••\2') end,
      case when nera.is_owner() or m.phone is null then m.phone else regexp_replace(m.phone, '\d(?=\d{2})', '•', 'g') end,
      m.subject, m.text, m.read, m.created_at
    from nera.messages m order by m.created_at desc;
end $$;

create or replace function nera.reset_stats() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not nera.is_owner() then raise exception 'não autorizado'; end if;
  delete from nera.events where true;
end $$;

revoke execute on all functions in schema nera from public;
grant execute on function nera.track(text, text) to anon, authenticated;
grant execute on function nera.dashboard(), nera.list_messages(), nera.reset_stats(), nera.role() to authenticated;
grant execute on function nera.is_owner(), nera.is_staff() to anon, authenticated;

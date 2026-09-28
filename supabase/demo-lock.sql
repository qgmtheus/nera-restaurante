-- Impede que a conta pública de demonstração (papel viewer) troque senha ou e-mail.
create or replace function nera.lock_viewer_credentials() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from nera.admins where user_id = old.id and role = 'viewer') then
    new.encrypted_password := old.encrypted_password;
    new.email := old.email;
    new.email_change := old.email_change;
    new.email_change_token_new := old.email_change_token_new;
  end if;
  return new;
end $$;
revoke execute on function nera.lock_viewer_credentials() from public, anon, authenticated;
drop trigger if exists lock_viewer_credentials on auth.users;
create trigger lock_viewer_credentials before update on auth.users
  for each row execute function nera.lock_viewer_credentials();

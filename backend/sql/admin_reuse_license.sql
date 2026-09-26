-- Applied to Supabase as migration "admin_reuse_license".
-- Brings a revoked key back: restore it to the same account, or recycle it
-- into a fresh unclaimed key.
create or replace function public.admin_reuse_license(p_key text, p_keep_account boolean, p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  lic public.licenses%rowtype;
  existing public.licenses%rowtype;
begin
  select * into lic from public.licenses
   where license_key_norm(key) = license_key_norm(p_key) for update;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;
  if lic.status <> 'revoked' then
    return jsonb_build_object('status', 'not_revoked');
  end if;

  if p_keep_account and lic.user_id is not null then
    -- One live key per account, same rule as admin_issue_license.
    select * into existing from public.licenses
     where user_id = lic.user_id and status <> 'revoked' and key <> lic.key
     limit 1;
    if found then
      return jsonb_build_object('status', 'already_licensed', 'key', existing.key);
    end if;

    update public.licenses
       set status = 'active',
           device_id = null,
           device_label = null,
           device_bound_at = null,
           last_switch_at = null
     where key = lic.key
    returning * into lic;
  else
    -- Recycle: back to a fresh, unclaimed key anyone can redeem.
    update public.licenses
       set status = 'unused',
           user_id = null,
           buyer_email = null,
           device_id = null,
           device_label = null,
           device_bound_at = null,
           previous_device_id = null,
           last_switch_at = null,
           switch_count = 0,
           activated_at = null,
           last_seen_at = null
     where key = lic.key
    returning * into lic;
  end if;

  insert into public.license_events (license_key, user_id, event, detail)
  values (lic.key, lic.user_id,
          case when lic.status = 'active' then 'restore' else 'recycle' end,
          jsonb_build_object('note', p_note));

  return jsonb_build_object('status', 'ok', 'key', lic.key, 'license_status', lic.status);
end;
$function$;

revoke all on function public.admin_reuse_license(text, boolean, text) from public, anon, authenticated;
grant execute on function public.admin_reuse_license(text, boolean, text) to service_role;

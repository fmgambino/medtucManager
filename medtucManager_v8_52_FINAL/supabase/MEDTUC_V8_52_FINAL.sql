-- MEDTUC Ticket Manager v8.52 FINAL HOTFIX
-- Ejecutar en Supabase SQL Editor antes de subir los archivos.
-- Corrige: permisos SuperAdmin, RLS de órdenes/tickets por rol/oficina/cuenta, ícono PWA instalable.

begin;

alter table public.app_settings
  add column if not exists app_icon_url text default 'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/cropped-icogob-1-180x180.png';

create unique index if not exists uq_role_module_permissions_role_module
on public.role_module_permissions(role_name, module_key);

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
select 'SuperAdmin', m, true,true,true,true,true,true
from unnest(array['dashboard','users','roles','orders','inventory','loans','tickets','offices','exceptions','logs','notifications','profile','settings']) as m
on conflict (role_name,module_key) do update set
  can_view=true, can_create=true, can_edit=true, can_delete=true, can_import=true, can_export=true, updated_at=now();

insert into public.role_module_permissions(role_name,module_key,can_view,can_create,can_edit,can_delete,can_import,can_export)
values
('Referente','dashboard',true,false,false,false,false,false),
('Referente','tickets',true,true,false,false,false,true),
('Referente','orders',true,false,false,false,false,true),
('Referente','notifications',true,false,false,false,false,true),
('Usuarios','dashboard',true,false,false,false,false,false),
('Usuarios','tickets',true,true,false,false,false,true),
('Usuarios','orders',true,false,false,false,false,true),
('Usuarios','notifications',true,false,false,false,false,true),
('Técnicos','dashboard',true,false,false,false,false,false),
('Técnicos','orders',true,true,true,false,false,true),
('Técnicos','tickets',true,true,true,false,false,true),
('Técnicos','loans',true,true,true,false,false,true),
('Técnicos','notifications',true,false,true,false,false,true),
('Técnicos','settings',true,false,false,false,false,false)
on conflict (role_name,module_key) do update set
  can_view=excluded.can_view, can_create=excluded.can_create, can_edit=excluded.can_edit,
  can_delete=excluded.can_delete, can_import=excluded.can_import, can_export=excluded.can_export, updated_at=now();

create or replace function public.medtuc_my_role()
returns text language sql stable security definer set search_path=public,auth as $$
  select coalesce((select role_name from public.profiles where id=auth.uid()),'')
$$;

grant execute on function public.medtuc_my_role() to authenticated;

create or replace function public.medtuc_is_superadmin()
returns boolean language sql stable security definer set search_path=public,auth as $$
  select lower(coalesce((select role_name from public.profiles where id=auth.uid()),'')) = 'superadmin'
$$;

grant execute on function public.medtuc_is_superadmin() to authenticated;

create or replace function public.medtuc_is_admin()
returns boolean language sql stable security definer set search_path=public,auth as $$
  select lower(coalesce((select role_name from public.profiles where id=auth.uid()),'')) in ('superadmin','admin')
$$;

grant execute on function public.medtuc_is_admin() to authenticated;

create or replace function public.medtuc_my_office()
returns text language sql stable security definer set search_path=public,auth as $$
  select lower(trim(coalesce((select office from public.profiles where id=auth.uid()),'')))
$$;

grant execute on function public.medtuc_my_office() to authenticated;

alter table public.profiles enable row level security;
alter table public.service_orders enable row level security;
alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;
alter table public.app_settings enable row level security;
alter table public.role_module_permissions enable row level security;

drop policy if exists medtuc_profiles_v852_select on public.profiles;
drop policy if exists medtuc_profiles_v852_write_admin on public.profiles;
create policy medtuc_profiles_v852_select on public.profiles for select to authenticated using (
  public.medtuc_is_admin() or id=auth.uid() or lower(trim(coalesce(office,''))) = public.medtuc_my_office()
);
create policy medtuc_profiles_v852_write_admin on public.profiles for all to authenticated using (public.medtuc_is_admin()) with check (public.medtuc_is_admin());

drop policy if exists medtuc_orders_v852_select on public.service_orders;
drop policy if exists medtuc_orders_v852_insert on public.service_orders;
drop policy if exists medtuc_orders_v852_update on public.service_orders;
drop policy if exists medtuc_orders_v852_delete on public.service_orders;
create policy medtuc_orders_v852_select on public.service_orders for select to authenticated using (
  public.medtuc_is_admin()
  or created_by = auth.uid()
  or assigned_to = auth.uid()
  or technician_user_id = auth.uid()
  or collaborator_assigned_to = auth.uid()
  or attended_by = auth.uid()
  or lower(coalesce(requester_email,'')) = lower(coalesce(auth.email(),''))
  or lower(trim(coalesce(office,''))) = public.medtuc_my_office()
);
create policy medtuc_orders_v852_insert on public.service_orders for insert to authenticated with check (
  public.medtuc_is_admin() or lower(public.medtuc_my_role()) in ('técnicos','tecnicos') or created_by = auth.uid()
);
create policy medtuc_orders_v852_update on public.service_orders for update to authenticated using (
  public.medtuc_is_admin() or assigned_to=auth.uid() or technician_user_id=auth.uid() or attended_by=auth.uid()
) with check (
  public.medtuc_is_admin() or assigned_to=auth.uid() or technician_user_id=auth.uid() or attended_by=auth.uid()
);
create policy medtuc_orders_v852_delete on public.service_orders for delete to authenticated using (public.medtuc_is_admin());

drop policy if exists medtuc_tickets_v852_select on public.support_tickets;
drop policy if exists medtuc_tickets_v852_insert on public.support_tickets;
drop policy if exists medtuc_tickets_v852_update on public.support_tickets;
drop policy if exists medtuc_tickets_v852_delete on public.support_tickets;
create policy medtuc_tickets_v852_select on public.support_tickets for select to authenticated using (
  public.medtuc_is_admin()
  or created_by = auth.uid()
  or assigned_to = auth.uid()
  or technician_user_id = auth.uid()
  or collaborator_assigned_to = auth.uid()
  or attended_by = auth.uid()
  or lower(coalesce(requester_email,'')) = lower(coalesce(auth.email(),''))
  or lower(trim(coalesce(office,''))) = public.medtuc_my_office()
);
create policy medtuc_tickets_v852_insert on public.support_tickets for insert to authenticated with check (created_by = auth.uid() or public.medtuc_is_admin());
create policy medtuc_tickets_v852_update on public.support_tickets for update to authenticated using (
  public.medtuc_is_admin() or lower(public.medtuc_my_role()) in ('técnicos','tecnicos') or created_by = auth.uid() or assigned_to=auth.uid() or technician_user_id=auth.uid()
) with check (
  public.medtuc_is_admin() or lower(public.medtuc_my_role()) in ('técnicos','tecnicos') or created_by = auth.uid() or assigned_to=auth.uid() or technician_user_id=auth.uid()
);
create policy medtuc_tickets_v852_delete on public.support_tickets for delete to authenticated using (public.medtuc_is_admin());

drop policy if exists medtuc_notifications_v852_select on public.notifications;
drop policy if exists medtuc_notifications_v852_insert on public.notifications;
drop policy if exists medtuc_notifications_v852_update on public.notifications;
drop policy if exists medtuc_notifications_v852_delete on public.notifications;
create policy medtuc_notifications_v852_select on public.notifications for select to authenticated using (
  public.medtuc_is_admin()
  or target_user = auth.uid()
  or lower(coalesce(target_role,'')) in (lower(public.medtuc_my_role()), lower(replace(public.medtuc_my_role(),'s','')))
  or created_by = auth.uid()
);
create policy medtuc_notifications_v852_insert on public.notifications for insert to authenticated with check (public.medtuc_is_admin() or created_by=auth.uid());
create policy medtuc_notifications_v852_update on public.notifications for update to authenticated using (public.medtuc_is_admin() or target_user=auth.uid() or created_by=auth.uid()) with check (public.medtuc_is_admin() or target_user=auth.uid() or created_by=auth.uid());
create policy medtuc_notifications_v852_delete on public.notifications for delete to authenticated using (public.medtuc_is_admin());

drop policy if exists medtuc_settings_v852_select on public.app_settings;
drop policy if exists medtuc_settings_v852_write on public.app_settings;
create policy medtuc_settings_v852_select on public.app_settings for select to authenticated using (true);
create policy medtuc_settings_v852_write on public.app_settings for all to authenticated using (public.medtuc_is_admin()) with check (public.medtuc_is_admin());

drop policy if exists medtuc_role_module_permissions_v852_select on public.role_module_permissions;
drop policy if exists medtuc_role_module_permissions_v852_write on public.role_module_permissions;
create policy medtuc_role_module_permissions_v852_select on public.role_module_permissions for select to authenticated using (public.medtuc_is_admin() or lower(role_name)=lower(public.medtuc_my_role()));
create policy medtuc_role_module_permissions_v852_write on public.role_module_permissions for all to authenticated using (public.medtuc_is_superadmin()) with check (public.medtuc_is_superadmin());

commit;

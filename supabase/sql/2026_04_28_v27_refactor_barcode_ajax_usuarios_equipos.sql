-- ISM Robosoft v27 - Refactor integral solicitado
-- Ejecutar en Supabase SQL Editor después de los parches anteriores.

create extension if not exists pgcrypto;

-- Cursos/divisiones base idempotentes para que se guarden alumnos.
insert into public.courses(name, level)
select x.name, x.name from (values ('1º'),('2º'),('3º'),('4º'),('5º'),('6º'),('7º')) as x(name)
on conflict do nothing;

insert into public.divisions(course_id, name)
select c.id, d.name
from public.courses c cross join (values ('A'),('B'),('C')) as d(name)
where not exists (select 1 from public.divisions v where v.course_id = c.id and lower(v.name)=lower(d.name));

-- Vista ABM enriquecida: Curso y División aparecen en edición y detalle.
drop view if exists public.users_abm_view cascade;
create or replace view public.users_abm_view as
select
  p.id,
  p.full_name,
  coalesce(u.email, '') as email,
  p.dni,
  p.birth_date,
  p.whatsapp,
  p.avatar_url,
  p.title,
  p.is_active,
  p.created_at,
  p.updated_at,
  r.name as role_name,
  r.code as role_code,
  jsonb_build_object('name', r.name, 'code', r.code) as roles,
  c.name as student_course_name,
  d.name as student_division_name,
  c.name as course_name,
  d.name as division_name,
  jsonb_build_object('name', c.name) as courses,
  jsonb_build_object('name', d.name) as divisions
from public.profiles p
left join auth.users u on u.id = p.id
left join public.roles r on r.id = p.role_id
left join public.courses c on c.id = p.student_course_id
left join public.divisions d on d.id = p.student_division_id;

grant select on public.users_abm_view to authenticated;

-- RPC de equipos con nombres de integrantes, cursos y divisiones.
drop function if exists public.admin_list_teams_full_v27();
create or replace function public.admin_list_teams_full_v27()
returns table(
  id uuid,
  name text,
  project text,
  description text,
  logo_url text,
  mentor_id uuid,
  mentor_backup_id uuid,
  student_ids uuid[],
  teachers text[],
  courses text[],
  divisions text[],
  student_names text[],
  members jsonb
)
language sql security definer set search_path=public as $$
select
  t.id,
  t.name,
  coalesce(t.description, '') as project,
  coalesce(t.description, '') as description,
  t.logo_url,
  t.teacher_id as mentor_id,
  t.backup_teacher_id as mentor_backup_id,
  coalesce(array_agg(distinct tm.profile_id) filter (where tm.profile_id is not null), '{}'::uuid[]) as student_ids,
  array_remove(array[mt.full_name, mb.full_name], null)::text[] as teachers,
  coalesce(array_agg(distinct c.name) filter (where c.name is not null), '{}'::text[]) as courses,
  coalesce(array_agg(distinct d.name) filter (where d.name is not null), '{}'::text[]) as divisions,
  coalesce(array_agg(distinct sp.full_name) filter (where sp.full_name is not null), '{}'::text[]) as student_names,
  coalesce(jsonb_agg(distinct jsonb_build_object(
    'id', sp.id,
    'name', sp.full_name,
    'course', c.name,
    'division', d.name,
    'role_in_team', tm.role_in_team,
    'is_leader', tm.is_leader
  )) filter (where sp.id is not null), '[]'::jsonb) as members
from public.teams t
left join public.profiles mt on mt.id = t.teacher_id
left join public.profiles mb on mb.id = t.backup_teacher_id
left join public.team_members tm on tm.team_id = t.id
left join public.profiles sp on sp.id = tm.profile_id
left join public.courses c on c.id = coalesce(sp.student_course_id, t.course_id)
left join public.divisions d on d.id = coalesce(sp.student_division_id, t.division_id)
group by t.id, mt.full_name, mb.full_name
order by t.updated_at desc nulls last, t.created_at desc;
$$;

grant execute on function public.admin_list_teams_full_v27() to authenticated;

-- Compatibilidad: los clientes viejos que llaman v23 reciben la versión corregida.
create or replace function public.admin_list_teams_full_v23()
returns table(id uuid,name text,project text,description text,logo_url text,mentor_id uuid,mentor_backup_id uuid,student_ids uuid[],teachers text[],courses text[],divisions text[],members jsonb)
language sql security definer set search_path=public as $$
  select id,name,project,description,logo_url,mentor_id,mentor_backup_id,student_ids,teachers,courses,divisions,members
  from public.admin_list_teams_full_v27();
$$;

grant execute on function public.admin_list_teams_full_v23() to authenticated;

-- Marcado de notificaciones consistente, usado por el botón limpiar contador.
create or replace function public.mark_notification_read(p_notification_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.notifications set read_at = now() where id = p_notification_id;
end;
$$;
grant execute on function public.mark_notification_read(uuid) to authenticated;

-- Realtime recomendado para todos los módulos tocados.
alter publication supabase_realtime add table public.inventory_assets;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.teams;
alter publication supabase_realtime add table public.team_members;

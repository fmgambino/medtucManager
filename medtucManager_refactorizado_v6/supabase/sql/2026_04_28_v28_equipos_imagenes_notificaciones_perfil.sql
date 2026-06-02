-- ISM Robosoft v28 - Equipos, imágenes masivas, notificaciones persistentes y perfil alumno

create or replace function public.set_notifications_read_state_v28(
  p_notification_ids uuid[],
  p_read boolean default true
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
begin
  update public.notifications
     set read_at = case when coalesce(p_read,true) then now() else null end
   where id = any(p_notification_ids);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function public.set_notifications_read_state_v28(uuid[], boolean) to authenticated, anon;

create or replace function public.admin_list_teams_full_v28()
returns table(
  id uuid,
  name text,
  project text,
  description text,
  mentor_id uuid,
  mentor_backup_id uuid,
  student_ids uuid[],
  teachers text[],
  courses text[],
  divisions text[],
  logo_url text,
  members jsonb,
  student_names text[]
)
language sql
security definer
set search_path = public
as $$
  select
    t.id,
    t.name,
    coalesce(t.description, '') as project,
    coalesce(t.description, '') as description,
    t.teacher_id as mentor_id,
    t.backup_teacher_id as mentor_backup_id,
    coalesce(array_agg(distinct tm.profile_id) filter (where tm.role_in_team = 'student' and tm.profile_id is not null), '{}')::uuid[] as student_ids,
    coalesce(array_remove(array[mentor.full_name, backup.full_name], null), '{}')::text[] as teachers,
    coalesce(array_agg(distinct c.name) filter (where c.name is not null), '{}')::text[] as courses,
    coalesce(array_agg(distinct d.name) filter (where d.name is not null), '{}')::text[] as divisions,
    coalesce(t.logo_url, '') as logo_url,
    coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'id', p.id,
        'profile_id', p.id,
        'name', p.full_name,
        'full_name', p.full_name,
        'avatar_url', coalesce(p.avatar_url, './assets/avatar-default.svg'),
        'role_in_team', coalesce(tm.role_in_team, 'student'),
        'course', coalesce(cp.name, ''),
        'division', coalesce(dp.name, '')
      )) filter (where p.id is not null), '[]'::jsonb
    ) ||
    coalesce(jsonb_build_array(
      case when mentor.id is null then null else jsonb_build_object('id', mentor.id, 'profile_id', mentor.id, 'name', mentor.full_name, 'full_name', mentor.full_name, 'avatar_url', coalesce(mentor.avatar_url, './assets/avatar-default.svg'), 'role_in_team', 'mentor') end,
      case when backup.id is null then null else jsonb_build_object('id', backup.id, 'profile_id', backup.id, 'name', backup.full_name, 'full_name', backup.full_name, 'avatar_url', coalesce(backup.avatar_url, './assets/avatar-default.svg'), 'role_in_team', 'mentor_backup') end
    ), '[]'::jsonb) - 'null' as members,
    coalesce(array_agg(distinct p.full_name) filter (where tm.role_in_team = 'student' and p.full_name is not null), '{}')::text[] as student_names
  from public.teams t
  left join public.profiles mentor on mentor.id = t.teacher_id
  left join public.profiles backup on backup.id = t.backup_teacher_id
  left join public.team_members tm on tm.team_id = t.id
  left join public.profiles p on p.id = tm.profile_id
  left join public.courses cp on cp.id = p.student_course_id
  left join public.divisions dp on dp.id = p.student_division_id
  left join public.courses c on c.id = t.course_id or c.id = p.student_course_id
  left join public.divisions d on d.id = t.division_id or d.id = p.student_division_id
  group by t.id, mentor.id, backup.id;
$$;

grant execute on function public.admin_list_teams_full_v28() to authenticated, anon;

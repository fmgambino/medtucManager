window.sb = (() => {
  const cfg = window.APP_CONFIG || {};
  const enabled = Boolean(
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_ANON_KEY.includes('PEGAR_AQUI') &&
    !cfg.SUPABASE_URL.includes('TU-PROYECTO') &&
    window.supabase
  );
  const client = enabled ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;

  const roleLabel = { administrator: 'Administrador', teacher: 'Docente', student: 'Alumno' };
  const roleCodeFromLabel = { Administrador: 'administrator', Docente: 'teacher', Alumno: 'student' };

  async function findCourseIdByName(name) {
    const clean = String(name || '').trim();
    if (!clean) return null;
    const { data, error } = await assertClient().from('courses').select('id, name').ilike('name', clean).limit(1).maybeSingle();
    if (error) throw error;
    return data?.id || null;
  }

  async function findDivisionIdByName(name, courseId=null) {
    const clean = String(name || '').trim();
    if (!clean) return null;
    let q = assertClient().from('divisions').select('id, name, course_id').ilike('name', clean).limit(1);
    if (courseId) q = q.eq('course_id', courseId);
    const { data, error } = await q.maybeSingle();
    if (error) throw error;
    return data?.id || null;
  }

function getPublicBaseUrl() {
  const raw = (cfg.SITE_URL || '').trim().replace(/\/$/, '');
  const loc = window.location;
  const dir = loc.pathname.replace(/[^/]*$/, '').replace(/\/$/, '');
  if (loc.hostname === '127.0.0.1' || loc.hostname === 'localhost') return `${loc.origin}${dir}`.replace(/\/$/, '');
  if (raw) return raw;
  return `${loc.origin}${dir}`.replace(/\/$/, '');
}

  function assertClient() {
    if (!client) throw new Error('Supabase no está configurado. Pegá tu ANON KEY en config.js.');
    return client;
  }
  function normalizeProfile(row) {
    const code = row?.roles?.code || row?.role_code || (row?.role_name === 'Administrador' ? 'administrator' : row?.role_name === 'Docente' ? 'teacher' : row?.role_name === 'Alumno' ? 'student' : 'student');
    return {
      id: row.id,
      name: row.full_name || row.name || 'Usuario',
      full_name: row.full_name || row.name || 'Usuario',
      role: roleLabel[code] || row?.roles?.name || 'Alumno',
      role_code: code,
      email: row.email || '',
      whatsapp: row.whatsapp || '-',
      dni: row.dni || '-',
      status: row.is_active === false ? 'Inactivo' : 'Activo',
      avatar_url: row.avatar_url || './assets/avatar-default.svg',
      birth_date: row.birth_date || '',
      title: row.title || '',
      certificates: row.certificates || '',
      student_course_name: row.student_course_name || row.course_name || row.courses?.name || row.course || '',
      student_division_name: row.student_division_name || row.division_name || row.divisions?.name || row.division || '',
      course: row.student_course_name || row.course_name || row.courses?.name || row.course || '',
      division: row.student_division_name || row.division_name || row.divisions?.name || row.division || '',
      mentor_id: row.mentor_id || row.teacher_id || null,
      mentor_backup_id: row.mentor_backup_id || null,
      student_ids: row.student_ids || []
    };
  }
  function normalizeCurrentUser(row) {
    const profile = normalizeProfile(row);
    const code = profile.role_code || (profile.role === 'Administrador' ? 'administrator' : profile.role === 'Docente' ? 'teacher' : profile.role === 'Alumno' ? 'student' : 'student');
    return { ...profile, role: code, role_label: roleLabel[code] || profile.role || 'Alumno' };
  }

  function normalizeInventory(row) {
    return {
      id: row.id,
      code: row.code || row.asset_code || '-',
      item: row.item || row.name || '-',
      type: row.type || 'Equipo',
      serial: row.serial || row.serial_number || '',
      barcode: row.barcode || '-',
      status: row.status || 'Disponible',
      condition: row.condition || row.condition_note || 'Sin observaciones',
      assignedTo: row.assigned_to || row.assignedTo || '-',
      requestedAt: row.requested_at || '-',
      returnedAt: row.returned_at || '-',
      teacher: row.teacher || '-',
      location: row.location || '-',
      category: row.category || row.category_name || '',
      brand: row.brand || row.brand_name || '',
      supplier: row.supplier || row.supplier_name || row.company || '',
      location_detail: row.location_detail || row.locacion || '',
      zone: row.zone || row.zona || '',
      image_url: row.image_url || row.image || '',
      quantity: Number(row.quantity ?? row.cantidad ?? 1) || 1
    };
  }


  function normalizeTeamPerson(member) {
    if (!member) return null;
    if (typeof member === 'string') return { name: member, role_in_team: 'student', avatar_url: './assets/avatar-default.svg' };
    const profile = member.profile || member.profiles || member.user || member;
    return {
      id: profile.id || member.profile_id || member.id || '',
      name: profile.full_name || profile.name || member.full_name || member.name || '-',
      role_in_team: member.role_in_team || member.role || (member.is_leader ? 'mentor' : 'student'),
      avatar_url: profile.avatar_url || member.avatar_url || './assets/avatar-default.svg',
      course: profile.student_course_name || profile.course_name || (profile.courses && profile.courses.name) || member.course || '',
      division: profile.student_division_name || profile.division_name || (profile.divisions && profile.divisions.name) || member.division || ''
    };
  }

  function normalizeTeam(row) {
    const rawMembers = Array.isArray(row.members) ? row.members.map(normalizeTeamPerson).filter(Boolean) : [];
    const teachers = Array.isArray(row.teachers) ? row.teachers : [];
    const teacherPeople = rawMembers.filter(m => /mentor|teacher|docente|leader/i.test(String(m.role_in_team || '')));
    const studentPeople = rawMembers.filter(m => !/mentor|teacher|docente|leader/i.test(String(m.role_in_team || '')) && !teachers.includes(m.name));
    const studentNames = Array.isArray(row.student_names) && row.student_names.length ? row.student_names.filter(n => !teachers.includes(n)) : studentPeople.map(m => m.name).filter(Boolean);
    const uniq = (arr, fn) => { const seen = new Set(); return (arr || []).filter(x => { const k = fn(x); if (seen.has(k)) return false; seen.add(k); return true; }); };
    const cleanTeachers = uniq(teachers, x => String(x || '').toLowerCase());
    const cleanTeacherPeople = uniq((teacherPeople.length ? teacherPeople : cleanTeachers.map(name => ({ name, role_in_team:'mentor', avatar_url:'./assets/avatar-default.svg' }))), x => String(x.id || x.name || '').toLowerCase());
    const cleanStudentPeople = uniq(studentPeople, x => String(x.id || x.name || '').toLowerCase());
    const cleanStudentNames = uniq(studentNames, x => String(x || '').toLowerCase());
    return { id: row.id, name: row.name, project: row.project || '', description: row.description || '', mentor_id: row.mentor_id || null, mentor_backup_id: row.mentor_backup_id || null, student_ids: Array.isArray(row.student_ids) ? uniq(row.student_ids.map(String), x => x) : [], teachers: cleanTeachers, teacher_people: cleanTeacherPeople, students: Array.isArray(row.student_ids) ? uniq(row.student_ids.map(String), x=>x).length : (cleanStudentNames.length || row.students || 0), courses: Array.isArray(row.courses) ? row.courses : [], divisions: Array.isArray(row.divisions) ? row.divisions : [], logo_url: row.logo_url || '', members: uniq(rawMembers, x => String(x.id || x.name || '').toLowerCase() + '|' + String(x.role_in_team || '')), student_people: cleanStudentPeople, student_names: cleanStudentNames };
  }

  return {
    enabled,
    client,
    client,
    isReady: () => enabled,
    async signIn(email, password) {
      const { data, error } = await assertClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    async signOut() {
      if (!client) return;
      return client.auth.signOut();
    },
    async getSession() {
      if (!client) return { data: { session: null } };
      return client.auth.getSession();
    },
async sendPasswordReset(email) {
  const base = getPublicBaseUrl();
  const cleanEmail = String(email || '').trim().toLowerCase();
  let { data, error } = await assertClient().auth.resetPasswordForEmail(cleanEmail, { redirectTo: `${base}/reset-password.html` });
  if (error && /Unable to process request|500/i.test(error.message || '')) {
    ({ data, error } = await assertClient().auth.resetPasswordForEmail(cleanEmail));
  }
  if (error) throw error;
  return data;
},
    async updatePassword(password) {
      const { data, error } = await assertClient().auth.updateUser({ password });
      if (error) throw error;
      return data;
    },
    async registerInactive(payload) {
      const email = String(payload.email || '').trim().toLowerCase();
      const roleCode = roleCodeFromLabel[payload.role] || payload.role || 'student';
      const base = getPublicBaseUrl();
      const { data, error } = await assertClient().auth.signUp({
        email,
        password: payload.password,
        options: { emailRedirectTo: `${base}/index.html`, data: { full_name: payload.full_name || payload.name, role_code: roleCode, requested_role: roleCode } }
      });
      if (error) throw error;
      try { await client.rpc('admin_upsert_profile_by_email', { p_email: email, p_full_name: payload.full_name || payload.name, p_role_code: roleCode, p_dni: null, p_whatsapp: null, p_birth_date: null, p_title: null, p_avatar_url: './assets/avatar-default.svg', p_is_active: false }); } catch (_) {}
      await client.auth.signOut().catch(() => {});
      return data;
    },
    async inviteUserByAdmin(payload) {
      const email = String(payload.email || '').trim().toLowerCase();
      const roleCode = roleCodeFromLabel[payload.role] || payload.role || 'student';
      const base = getPublicBaseUrl();
      const body = { ...payload, email, role_code: roleCode, redirect_to: `${base}/reset-password.html` };
      const functionNames = ['admin-create-user', 'rapid-service'];
      const errors = [];
      for (const fnName of functionNames) {
        try {
          const { data, error } = await assertClient().functions.invoke(fnName, { body });
          if (error) throw error;
          if (data?.error) throw new Error(data.error);
          return data;
        } catch (fnError) {
          errors.push(`${fnName}: ${fnError.message || fnError}`);
        }
      }
      throw new Error('No se pudo invocar la Edge Function para crear usuarios. Verificá que exista admin-create-user o rapid-service, que esté deployada y que los secrets SERVICE_ROLE_KEY / SUPABASE_ANON_KEY / SUPABASE_URL estén cargados. Detalle: ' + errors.join(' | '));
    },

    async fetchProfile() {
      if (!client) return null;
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError) throw userError;
      if (!user) return null;
      try { await client.rpc('ensure_current_user_profile'); } catch (_) {}
      const { data, error } = await client
        .from('profiles')
        .select('*, roles:role_id(name, code), courses:student_course_id(name), divisions:student_division_id(name), subjects:teacher_subject_id(name)')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return normalizeCurrentUser({ id: user.id, full_name: user.email?.split('@')[0], email: user.email, role_code: 'administrator' });
      return normalizeCurrentUser({ ...data, email: user.email });
    },
    async listProfiles() {
      const client = assertClient();
      let res = await client.from('users_abm_view').select('*').order('created_at', { ascending: false });
      if (res.error) {
        res = await client
          .from('profiles')
          .select('*, roles:role_id(name, code), courses:student_course_id(name), divisions:student_division_id(name)')
          .order('created_at', { ascending: false });
      }
      if (res.error) throw res.error;
      return (res.data || []).map(normalizeProfile);
    },
    async updateProfile(id, payload) {
      const body = {
        full_name: payload.full_name || payload.name,
        dni: payload.dni || null,
        whatsapp: payload.whatsapp || null,
        title: payload.title || null,
        is_active: payload.status !== 'Inactivo'
      };
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
      const { error } = await assertClient().from('profiles').update(body).eq('id', id);
      if (error) throw error;
    },
    async signUpUser(payload) {
      return this.inviteUserByAdmin(payload);
    },
    async upsertUserProfile(payload) {
      const email = String(payload.email || '').trim().toLowerCase();
      const roleCode = roleCodeFromLabel[payload.role] || payload.role || 'student';
      const courseId = roleCode === 'student' ? await findCourseIdByName(payload.student_course_name || payload.course || payload.course_name) : null;
      const divisionId = roleCode === 'student' ? await findDivisionIdByName(payload.student_division_name || payload.division || payload.division_name, courseId) : null;
      const { data, error } = await assertClient().rpc('admin_upsert_profile_by_email', {
        p_email: email,
        p_full_name: payload.full_name || payload.name,
        p_role_code: roleCode,
        p_dni: payload.dni || null,
        p_whatsapp: payload.whatsapp || null,
        p_birth_date: payload.birth_date || null,
        p_title: roleCode === 'student' ? null : (payload.title || null),
        p_avatar_url: payload.avatar_url || './assets/avatar-default.svg',
        p_is_active: payload.status !== 'Inactivo',
        p_student_course_id: courseId,
        p_student_division_id: divisionId
      });
      if (error) throw error;
      return data;
    },
    async deleteProfile(id) {
      const client = assertClient();
      const profileId = String(id);
      const rpc = await client.rpc('admin_delete_profile', { p_profile_id: profileId });
      if (!rpc.error) return;
      // Fallback para bases antiguas: limpia referencias que bloquean profiles por FK
      // (por ejemplo notifications_created_by_fkey / notifications_recipient_profile_id_fkey).
      const cleanup = [
        client.from('notifications').delete().or(`created_by.eq.${profileId},recipient_profile_id.eq.${profileId}`),
        client.from('user_audit_log').delete().or(`profile_id.eq.${profileId},changed_by.eq.${profileId}`),
        client.from('team_members').delete().eq('profile_id', profileId),
        client.from('inventory_asset_status_history').update({ changed_by: null }).eq('changed_by', profileId),
        client.from('inventory_location_history').update({ changed_by: null }).eq('changed_by', profileId),
        client.from('inventory_barcode_labels').update({ printed_by: null }).eq('printed_by', profileId),
        client.from('inventory_transactions').update({ created_by: null }).eq('created_by', profileId),
        client.from('inventory_transactions').update({ related_profile_id: null }).eq('related_profile_id', profileId),
        client.from('inventory_loans').update({ requester_profile_id: null }).eq('requester_profile_id', profileId),
        client.from('inventory_loans').update({ teacher_profile_id: null }).eq('teacher_profile_id', profileId),
        client.from('inventory_loans').update({ created_by: null }).eq('created_by', profileId),
        client.from('inventory_loans').update({ approved_by: null }).eq('approved_by', profileId),
        client.from('inventory_assets').update({ current_holder_profile_id: null }).eq('current_holder_profile_id', profileId),
        client.from('teams').update({ teacher_id: null }).eq('teacher_id', profileId),
        client.from('teams').update({ backup_teacher_id: null }).eq('backup_teacher_id', profileId)
      ];
      for (const op of cleanup) { try { await op; } catch (_) {} }
      const direct = await client.from('profiles').delete().eq('id', profileId);
      if (direct.error) throw direct.error;
    },
    async updateProfileFull(id, payload) {
      const roleCode = roleCodeFromLabel[payload.role] || payload.role || null;
      let roleId = null;
      if (roleCode) {
        const { data: role, error: roleError } = await assertClient().from('roles').select('id').eq('code', roleCode).maybeSingle();
        if (roleError) throw roleError;
        roleId = role?.id || null;
      }
      const courseId = roleCode === 'student' ? await findCourseIdByName(payload.student_course_name || payload.course || payload.course_name) : null;
      const divisionId = roleCode === 'student' ? await findDivisionIdByName(payload.student_division_name || payload.division || payload.division_name, courseId) : null;
      const body = {
        full_name: payload.full_name || payload.name,
        role_id: roleId || undefined,
        dni: payload.dni || null,
        whatsapp: payload.whatsapp || null,
        avatar_url: payload.avatar_url || undefined,
        birth_date: payload.birth_date || null,
        title: (roleCode === 'student') ? null : (payload.title || null),
        student_course_id: roleCode === 'student' ? courseId : null,
        student_division_id: roleCode === 'student' ? divisionId : null,
        is_active: payload.status !== 'Inactivo',
        updated_at: new Date().toISOString()
      };
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
      const { error } = await assertClient().from('profiles').update(body).eq('id', String(id));
      if (error) throw error;
    },
    async updateMyAvatar(avatarUrl) {
      const { data: { user }, error: userError } = await assertClient().auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No hay sesión activa');
      const { error } = await assertClient().from('profiles').update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (error) throw error;
    },
    async listTeams() {
      const primary = await assertClient().rpc('admin_list_teams_full_v28');
      if (!primary.error) return (primary.data || []).map(normalizeTeam);
      const fallback = await assertClient().rpc('admin_list_teams_full_v23');
      if (fallback.error) throw primary.error;
      return (fallback.data || []).map(normalizeTeam);
    },
    async saveTeam(payload) {
      const { data, error } = await assertClient().rpc('admin_save_team_full_v23', {
        p_team_id: payload.id || null,
        p_name: payload.name,
        p_project: payload.project || null,
        p_description: payload.description || null,
        p_mentor_id: payload.mentor_id || null,
        p_mentor_backup_id: payload.mentor_backup_id || null,
        p_student_ids: payload.student_ids || [],
        p_logo_url: payload.logo_url || null
      });
      if (error) throw error;
      return data;
    },
    async deleteTeam(id) {
      const { error } = await assertClient().rpc('admin_delete_team_v23', { p_team_id: String(id) });
      if (error) throw error;
    },

    async listRoles() {
      const { data, error } = await assertClient().from('roles').select('id, code, name, description, role_permissions(permissions(code))').order('name');
      if (error) throw error;
      return (data || []).map(r => ({ id:r.id, code:r.code, name:r.name, description:r.description, permissions:(r.role_permissions || []).map(x => x.permissions?.code).filter(Boolean) }));
    },
    async saveRole(payload) {
      const cleanCode = String(payload.code || '').trim().toLowerCase().replace(/\s+/g, '_');
      const row = { code: cleanCode, name: payload.name, description: payload.description || null, is_system: ['administrator','teacher','student'].includes(cleanCode), updated_at: new Date().toISOString() };
      if (payload.id && /^[0-9a-f-]{36}$/i.test(String(payload.id))) row.id = payload.id;
      const { data: role, error } = await assertClient().from('roles').upsert(row, { onConflict:'code' }).select('id').single();
      if (error) throw error;
      const roleId = role.id;
      await assertClient().from('role_permissions').delete().eq('role_id', roleId);
      if (payload.permissions?.length) {
        const { data: perms, error: permsError } = await assertClient().from('permissions').select('id, code').in('code', payload.permissions);
        if (permsError) throw permsError;
        const rows = (perms || []).map(p => ({ role_id: roleId, permission_id: p.id }));
        if (rows.length) { const { error: rpError } = await assertClient().from('role_permissions').insert(rows); if (rpError) throw rpError; }
      }
    },
    async deleteRole(id) {
      const { error } = await assertClient().from('roles').delete().eq('id', id).eq('is_system', false);
      if (error) throw error;
    },
    async listInventoryConditions() {
      const client = assertClient();
      const rpc = await client.rpc('list_inventory_conditions_v22');
      if (!rpc.error && Array.isArray(rpc.data)) {
        return rpc.data.map(c => ({
          id: c.id,
          name: String(c.name || '').trim(),
          color: /^#[0-9a-f]{6}$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : '#64748b',
          sort_order: c.sort_order || 100
        })).filter(c => c.name).sort((a,b) => (a.sort_order - b.sort_order) || a.name.localeCompare(b.name, 'es'));
      }
      const { data, error } = await client
        .from('inventory_conditions')
        .select('id, name, color, sort_order, is_active, updated_at')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []).map(c => ({
        id: c.id,
        name: String(c.name || '').trim().replace(/\s+/g, ' '),
        color: /^#[0-9a-f]{6}$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : '#64748b',
        sort_order: c.sort_order || 100
      })).filter(c => c.name);
    },
    async saveInventoryCondition(name, color = '#64748b', options = {}) {
      const client = assertClient();
      const cleanName = String(name || '').trim().replace(/\s+/g, ' ');
      const cleanColor = /^#[0-9a-f]{6}$/i.test(String(color || '').trim()) ? String(color).trim() : '#64748b';
      if (!cleanName) throw new Error('Ingresá el nombre de la condición');
      const { data, error } = await client.rpc('inventory_condition_save_v23', {
        p_name: cleanName,
        p_color: cleanColor,
        p_fail_on_duplicate: Boolean(options.failOnDuplicate)
      });
      if (error) throw error;
      return data;
    },
    async updateInventoryAsset(id, payload) {
      const assetId = String(id || '').trim();
      if (!assetId || assetId === 'null' || assetId === 'undefined') throw new Error('No existe el activo seleccionado');
      const { error } = await assertClient().rpc('admin_update_inventory_asset_v24', {
        p_asset_id: assetId,
        p_name: payload.item,
        p_category: payload.category || payload.type || 'General',
        p_serial_number: payload.serial || null,
        p_barcode: payload.barcode || null,
        p_status: payload.status || 'Disponible',
        p_condition_note: payload.condition || null,
        p_location_code: payload.location_code || null,
        p_brand: payload.brand || null,
        p_supplier: payload.supplier || null,
        p_location_detail: payload.location_detail || null,
        p_zone: payload.zone || null,
        p_image_url: payload.image_url || null,
        p_quantity: payload.quantity ?? null,
        p_tracking_mode: payload.type || null,
        p_asset_code: payload.code || null
      });
      if (error) throw error;
    },
    async listTeams() {
      const primary = await assertClient().rpc('admin_list_teams_full_v28');
      if (!primary.error) return (primary.data || []).map(normalizeTeam);
      const fallback = await assertClient().rpc('admin_list_teams_full_v23');
      if (fallback.error) throw primary.error;
      return (fallback.data || []).map(normalizeTeam);
    },
    async listLoans() {
      const { data, error } = await assertClient().from('loans_frontend_view').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(l => ({ id:l.id, requester_id:l.requester_id || l.requester_profile_id, requester:l.requester || '-', team:l.team || '-', date:(l.requested_at||l.use_date||'').slice(0,10), from:l.from_time || '-', to:l.to_time || '-', items:l.items || [], notes:l.notes || '-', status:l.status_label || l.status }));
    },
    async updateLoanStatus(id, status) {
      const c = assertClient();
      const label = String(status || '').toLowerCase();
      const statusMap = { 'pendiente':'abierto', 'aprobado':'aprobado', 'rechazado':'rechazado', 'devuelto':'cerrado', 'cerrado':'cerrado', 'retirado':'retirado', 'vencido':'vencido', 'cancelado':'cancelado' };
      const dbStatus = statusMap[label] || label || 'abierto';
      const direct = await c.from('inventory_loans').update({ status: dbStatus, updated_at: new Date().toISOString(), approved_at: ['aprobado','retirado'].includes(dbStatus) ? new Date().toISOString() : undefined }).eq('id', id);
      if (!direct.error) return;
      const rpc = await c.rpc('admin_update_loan_status', { p_loan_id: id, p_status_label: status });
      if (rpc.error) {
        const msg = String(rpc.error.message || '');
        if (rpc.error.code === '23505' || msg.includes('uq_notifications_exact_dedupe') || msg.includes('duplicate key')) return;
        throw rpc.error;
      }
    },
    async createLoanRequest(payload) {
      const { data, error } = await assertClient().rpc('create_loan_request', {
        p_team: payload.course,
        p_use_date: payload.date,
        p_from_time: payload.from,
        p_to_time: payload.to,
        p_items: payload.selected || [],
        p_notes: payload.notes || null
      });
      if (error) throw error;
      return data;
    },
    async sendNotification(payload) {
      const { error } = await assertClient().rpc('send_notification', {
        p_title: payload.title,
        p_message: payload.message,
        p_target: payload.target,
        p_recipient_ids: payload.recipientIds || [],
        p_section: payload.section || 'notifications'
      });
      if (error) throw error;
    },

    async listNotifications() {
      const c = assertClient();
      const { data: userData } = await c.auth.getUser();
      const uid = userData?.user?.id || '';
      let q = c.from('notifications').select('id,title,message,section,created_by,created_at,read_at,recipient_profile_id').order('created_at', { ascending: false }).limit(1000);
      if (uid) q = q.eq('recipient_profile_id', uid);
      const { data, error } = await q;
      if (error) throw error;
      const seen = new Set();
      return (data || []).map(n => ({ id:n.id, title:n.title, message:n.message, sender:'Sistema', sender_name:'Sistema', unread: !n.read_at, section:n.section || 'notifications', created_at:n.created_at, read_at:n.read_at || null, recipient_profile_id:n.recipient_profile_id || '' }))
        .filter(n => { const k=[n.title,n.message,n.recipient_profile_id,String(n.created_at||'').slice(0,16)].join('|'); if(seen.has(k)) return false; seen.add(k); return true; });
    },

    async markNotificationRead(id) {
      return this.markNotifications([id], true);
    },
    async markNotifications(ids, read = true) {
      const list = (ids || []).map(String).filter(Boolean);
      if (!list.length) return;
      const { data: userData } = await assertClient().auth.getUser();
      let q = assertClient().from('notifications').update({ read_at: read ? new Date().toISOString() : null }).in('id', list);
      if (userData?.user?.id) q = q.eq('recipient_profile_id', userData.user.id);
      const { error } = await q;
      if (error) throw error;
    },
    async listPermissions() {
      const { data, error } = await assertClient().from('permissions').select('code, name, module').order('module').order('code');
      if (error) throw error;
      return data || [];
    },
    async bulkDeleteInventoryAssets(ids) {
      const { error } = await assertClient().rpc('bulk_soft_delete_inventory_assets', { p_asset_ids: ids || [] });
      if (error) throw error;
    },
    async bulkUpdateInventoryAssets(ids, changes) {
      const list = (ids || []).map(String).filter(Boolean);
      if (!list.length) return;
      const hasRpcChanges = Boolean(changes?.status || changes?.condition || changes?.brand || changes?.type || changes?.supplier || changes?.serial || changes?.location_code || changes?.location_detail || changes?.zone || (changes?.quantity !== null && changes?.quantity !== undefined));
      if (hasRpcChanges) {
        const { error } = await assertClient().rpc('bulk_update_inventory_assets_v23', {
          p_asset_ids: list,
          p_status: changes?.status || null,
          p_condition_note: changes?.condition || null,
          p_brand: changes?.brand || null,
          p_type: changes?.type || null,
          p_supplier: changes?.supplier || null,
          p_serial_number: changes?.serial || null,
          p_location_code: changes?.location_code || null,
          p_location_detail: changes?.location_detail || null,
          p_zone: changes?.zone || null,
          p_quantity: changes?.quantity ?? null
        });
        if (error) throw error;
      }
      if (changes?.image_url) {
        const img = String(changes.image_url).trim();
        const rpcImg = await assertClient().rpc('bulk_update_inventory_asset_images_v29', { p_asset_ids: list, p_image_url: img });
        if (rpcImg.error) {
          const direct = await assertClient().from('inventory_assets').update({ image_url: img, updated_at: new Date().toISOString() }).in('id', list);
          if (direct.error) throw direct.error;
        }
      }
    },

    async listInventory() {
      const { data, error } = await assertClient()
        .from('inventory_frontend_view')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(0, 4999);
      if (error) throw error;
      return (data || []).map(normalizeInventory);
    },
    async importInventoryAssets(items) {
      const out = { inserted: 0, skipped: 0, errors: [] };
      for (let i = 0; i < (items || []).length; i++) {
        try { await this.createInventoryAsset(items[i]); out.inserted++; }
        catch (e) { const msg = e?.message || String(e); if (/duplicado|existe|unique/i.test(msg)) { out.skipped++; out.errors.push('Fila '+(i+2)+': '+msg); continue; } throw e; }
      }
      return out;
    },
    async createInventoryAsset(payload) {
      const { data, error } = await assertClient().rpc('admin_create_inventory_asset_v24', {
        p_name: payload.item,
        p_category: payload.category || payload.type || 'General',
        p_asset_code: payload.code || null,
        p_serial_number: payload.serial || null,
        p_barcode: payload.barcode || null,
        p_location_code: payload.location_code || 'LAB-ROB',
        p_condition_note: payload.condition || null,
        p_brand: payload.brand || null,
        p_supplier: payload.supplier || null,
        p_location_detail: payload.location_detail || null,
        p_zone: payload.zone || null,
        p_image_url: payload.image_url || null,
        p_quantity: payload.quantity ?? 1,
        p_tracking_mode: payload.type || 'Equipo'
      });
      if (error) throw error;
      return data;
    },

    async listSupportTickets() {
      const { data, error } = await assertClient()
        .from('support_tickets_frontend_view')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 4999);
      if (error) {
        const fallback = await assertClient().from('support_tickets').select('*').order('created_at', { ascending: false }).range(0, 4999);
        if (fallback.error) throw error;
        return fallback.data || [];
      }
      return data || [];
    },
    async listTicketIncidents() {
      const { data, error } = await assertClient().from('support_ticket_incidents').select('id, name, color, sort_order, is_active').eq('is_active', true).order('sort_order').order('name');
      if (error) throw error;
      return data || [];
    },
    async listTicketStatuses() {
      const { data, error } = await assertClient().from('support_ticket_statuses').select('code, name, color, sort_order, is_active').eq('is_active', true).order('sort_order');
      if (error) throw error;
      return data || [];
    },
    async saveSupportTicket(payload) {
      const row = { ...payload, updated_at: new Date().toISOString() };
      const rpc39 = await assertClient().rpc('support_ticket_save_v39', { p_ticket: row });
      if (!rpc39.error) return rpc39.data;
      const rpc38 = await assertClient().rpc('support_ticket_save_v38', { p_ticket: row });
      if (!rpc38.error) return rpc38.data;
      const rpc = await assertClient().rpc('support_ticket_save_v37', { p_ticket: row });
      if (!rpc.error) return rpc.data;
      const clean = { ...row };
      if (!clean.id) delete clean.id;
      if (!payload.id) delete clean.ticket_number;
      const { data, error } = await assertClient().from('support_tickets').insert(clean).select('*').single();
      if (error) throw error;
      return data;
    },
    async deleteSupportTickets(ids) {
      const list = (ids || []).map(String).filter(Boolean);
      if (!list.length) return;
      const rpc = await assertClient().rpc('support_ticket_delete_v37', { p_ids: list });
      if (!rpc.error) return;
      const { error } = await assertClient().from('support_tickets').delete().in('id', list);
      if (error) throw error;
    },
    async bulkUpdateSupportTickets(ids, changes) {
      const list = (ids || []).map(String).filter(Boolean);
      if (!list.length) return;
      const rpc = await assertClient().rpc('support_ticket_bulk_update_v37', { p_ids: list, p_changes: { ...changes, updated_at: new Date().toISOString() } });
      if (!rpc.error) return;
      const { error } = await assertClient().from('support_tickets').update({ ...changes, updated_at: new Date().toISOString() }).in('id', list);
      if (error) throw error;
    },
    async saveTicketIncident(payload) {
      const clean = { name: String(payload.name || '').trim(), color: payload.color || '#64748b', sort_order: Number(payload.sort_order || 100), is_active: true };
      const rpc = await assertClient().rpc('admin_upsert_support_ticket_incident', { p_name: clean.name, p_color: clean.color, p_sort_order: clean.sort_order });
      if (!rpc.error) return rpc.data;
      const { data, error } = await assertClient().from('support_ticket_incidents').upsert(clean, { onConflict:'name' }).select('*').single();
      if (error) throw error;
      return data;
    },
    async getAppSetting(key) {
      const { data, error } = await assertClient().from('app_settings').select('value').eq('key', key).maybeSingle();
      if (error) throw error;
      return data?.value || null;
    },
    async saveAppSetting(key, value) {
      const { data: userData } = await assertClient().auth.getUser();
      const { error } = await assertClient().from('app_settings').upsert({ key, value, updated_by: userData?.user?.id || null, updated_at: new Date().toISOString() }, { onConflict:'key' });
      if (error) throw error;
    },

    async logUserLogin() {
      const c = assertClient();
      const { data: userData } = await c.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return null;
      const rpc = await c.rpc('notify_user_login_v39');
      if (!rpc.error) return true;
      const { data: me } = await c.from('profiles').select('id,full_name,role_id,roles:role_id(name,code)').eq('id', uid).maybeSingle();
      const actor = me?.full_name || userData.user.email || 'Usuario';
      const role = me?.roles?.name || me?.roles?.code || '-';
      const now = new Date().toISOString();
      await c.from('user_sessions').insert({ profile_id: uid, login_at: now, last_seen_at: now, user_agent: navigator.userAgent }).select('id').maybeSingle().then(r => { try { if (r?.data?.id) sessionStorage.setItem('ism_session_row_id', r.data.id); } catch(_){} });
      const { data: admins } = await c.from('profiles').select('id,full_name,roles:role_id(code,name)').neq('id', uid);
      const targets = (admins || []).filter(p => ['admin','administrador','administrator'].includes(String(p.roles?.code || p.roles?.name || '').toLowerCase()));
      const message = `Usuario: ${actor} · Rol: ${role} · Fecha: ${new Date().toLocaleString('es-AR', { timeZone:'America/Argentina/Buenos_Aires' })}`;
      for (const p of targets) {
        const exists = await c.from('notifications').select('id').eq('recipient_profile_id', p.id).eq('title','Inicio de sesión').eq('message', message).maybeSingle();
        if (!exists.data) await c.from('notifications').insert({ recipient_profile_id:p.id, title:'Inicio de sesión', message, section:'access', created_by:uid, created_at:now }).then(()=>{},()=>{});
      }
      return true;
    },
    async logUserLogout() {
      const c = assertClient();
      const { data: userData } = await c.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return null;
      const now = new Date().toISOString();
      const sid = sessionStorage.getItem('ism_session_row_id');
      if (sid) await c.from('user_sessions').update({ logout_at: now, last_seen_at: now }).eq('id', sid).then(()=>{},()=>{});
      return true;
    },
    async createSupportTicketNotification(ticket) {
      const rpc39 = await assertClient().rpc('notify_support_ticket_event_v39', { p_ticket_id: ticket.id || null, p_action: 'creado' });
      if (!rpc39.error) return rpc39.data;
      const rpc38 = await assertClient().rpc('notify_support_ticket_event_v38', { p_ticket_id: ticket.id || null, p_action: 'creado' });
      if (!rpc38.error) return rpc38.data;
      const rpc = await assertClient().rpc('notify_support_ticket_event', { p_ticket_id: ticket.id || null, p_action: 'creado' });
      if (rpc.error) throw rpc.error;
      return rpc.data;
    },
    async softDeleteInventoryAsset(id) {
      const { error } = await assertClient().from('inventory_assets').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    }
  };
})();

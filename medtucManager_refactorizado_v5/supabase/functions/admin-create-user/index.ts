import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function normalizeRole(role: unknown) {
  const raw = String(role || 'student').trim().toLowerCase()
  if (['administrador', 'administrator', 'admin', 'superadmin'].includes(raw)) return 'administrator'
  if (['docente', 'teacher', 'profesor'].includes(raw)) return 'teacher'
  if (['alumno', 'student', 'estudiante'].includes(raw)) return 'student'
  return raw || 'student'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 200)

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

    if (!SUPABASE_URL) return json({ ok: false, error: 'Falta secret SUPABASE_URL en Edge Functions > Secrets.' })
    if (!SERVICE_ROLE_KEY) return json({ ok: false, error: 'Falta secret SERVICE_ROLE_KEY o SUPABASE_SERVICE_ROLE_KEY en Edge Functions > Secrets.' })

    const authorization = req.headers.get('Authorization') || ''
    if (!authorization.toLowerCase().startsWith('bearer ')) {
      return json({ ok: false, error: 'No llegó Authorization Bearer desde la webapp. Cerrá sesión, volvé a iniciar sesión y reintentá.' })
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    })

    const { data: requesterData, error: requesterError } = await userClient.auth.getUser()
    const requester = requesterData?.user
    if (requesterError || !requester) {
      return json({ ok: false, error: `No autorizado: sesión inválida. ${requesterError?.message || ''}`.trim() })
    }

    const { data: me, error: meError } = await admin
      .from('profiles')
      .select('id, is_active, full_name, roles:role_id(code,name)')
      .eq('id', requester.id)
      .maybeSingle()

    if (meError) return json({ ok: false, error: `No se pudo leer el perfil administrador: ${meError.message}` })

    const roleObj = Array.isArray(me?.roles) ? me?.roles?.[0] : me?.roles
    const myRole = normalizeRole(roleObj?.code || roleObj?.name || requester.user_metadata?.role_code)
    const isActive = me?.is_active !== false
    if (!isActive || !['administrator', 'admin', 'superadmin'].includes(myRole)) {
      return json({
        ok: false,
        error: `Solo administradores activos pueden crear usuarios. Tu perfil actual es: activo=${String(isActive)}, rol=${myRole || 'sin_rol'}. Revisá profiles.role_id y roles.code.`,
      })
    }

    const body = await req.json().catch(() => ({}))
    const email = String(body.email || '').trim().toLowerCase()
    const fullName = String(body.full_name || body.name || '').trim()
    const roleCode = normalizeRole(body.role_code || body.role)
    const password = String(body.password || '').trim() || crypto.randomUUID() + 'aA1!'

    if (!email) return json({ ok: false, error: 'El email es obligatorio.' })
    if (!fullName) return json({ ok: false, error: 'El nombre completo es obligatorio.' })

    let userId: string | undefined
    const { data: usersPage, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (listError) return json({ ok: false, error: `No se pudieron listar usuarios Auth: ${listError.message}` })

    const existing = usersPage.users.find((u) => u.email?.toLowerCase() === email)
    if (existing) {
      userId = existing.id
      const { error: updAuthError } = await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
        user_metadata: { ...(existing.user_metadata || {}), full_name: fullName, role_code: roleCode },
      })
      if (updAuthError) return json({ ok: false, error: `No se pudo actualizar Auth user: ${updAuthError.message}` })
    } else {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role_code: roleCode },
      })
      if (createError) return json({ ok: false, error: `No se pudo crear Auth user: ${createError.message}` })
      userId = created.user?.id
    }

    if (!userId) return json({ ok: false, error: 'No se obtuvo ID del usuario Auth.' })

    const { data: roleRow, error: roleError } = await admin.from('roles').select('id').eq('code', roleCode).maybeSingle()
    if (roleError) return json({ ok: false, error: `No se pudo leer rol ${roleCode}: ${roleError.message}` })
    if (!roleRow?.id) return json({ ok: false, error: `No existe el rol ${roleCode} en public.roles.` })

    const profilePayload = {
      id: userId,
      role_id: roleRow.id,
      full_name: fullName,
      dni: body.dni || null,
      whatsapp: body.whatsapp || null,
      birth_date: body.birth_date || null,
      avatar_url: body.avatar_url || './assets/avatar-default.svg',
      title: roleCode === 'student' ? null : (body.title || null),
      is_active: body.status === 'Inactivo' ? false : true,
      updated_at: new Date().toISOString(),
    }

    const { error: profileError } = await admin.from('profiles').upsert(profilePayload, { onConflict: 'id' })
    if (profileError) return json({ ok: false, error: `Usuario Auth creado, pero falló perfil: ${profileError.message}` })

    return json({ ok: true, user_id: userId, email, generated_password: body.password ? false : true })
  } catch (error) {
    return json({ ok: false, error: error?.message || String(error) })
  }
})

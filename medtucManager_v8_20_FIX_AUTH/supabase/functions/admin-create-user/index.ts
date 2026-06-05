import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Método no permitido." }, 405);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_KEY") ||
      "";

    if (!SUPABASE_URL) throw new Error("Falta variable SUPABASE_URL en la Edge Function.");
    if (!ANON_KEY) throw new Error("Falta variable SUPABASE_ANON_KEY en la Edge Function.");
    if (!SERVICE_ROLE_KEY) {
      throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY. Configure el Service Role Key en Supabase → Edge Functions → Secrets y redeploy.");
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      throw new Error("No llegó el JWT del SuperAdmin. Cierre sesión, vuelva a ingresar y reintente.");
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: me, error: meErr } = await userClient.auth.getUser();
    if (meErr || !me?.user) throw new Error(`Sesión inválida: ${meErr?.message || "usuario no encontrado"}`);

    const { data: myProfile, error: profileErr } = await admin
      .from("profiles")
      .select("role_name,is_active")
      .eq("id", me.user.id)
      .maybeSingle();
    if (profileErr) throw profileErr;
    if (!myProfile?.is_active || myProfile.role_name !== "SuperAdmin") {
      return json({ success: false, error: "Sólo SuperAdmin puede crear usuarios o modificar contraseñas." }, 403);
    }

    const body = await req.json();
    const email = String(body.p_email || body.email || "").trim().toLowerCase();
    const fullName = String(body.p_full_name || body.full_name || "").trim();
    const roleNameRaw = String(body.p_role_name || body.role_name || "Usuarios").trim();
    const roleName = roleNameRaw === "Tecnicos" ? "Técnicos" : roleNameRaw;
    const office = body.p_office ?? body.office ?? null;
    const phone = body.p_phone ?? body.phone ?? null;
    const isActive = body.p_is_active ?? body.is_active ?? true;
    const password = String(body.p_password || body.password || "");

    if (!email) throw new Error("Email obligatorio.");
    if (!fullName) throw new Error("Nombre completo obligatorio.");
    if (!["SuperAdmin", "Admin", "Técnicos", "Usuarios"].includes(roleName)) throw new Error("Perfil inválido.");
    if (password && password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");

    let userId: string | null = null;
    let page = 1;
    let existing: any = null;

    while (!existing) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (listErr) throw listErr;
      existing = list.users.find((u) => u.email?.toLowerCase() === email) || null;
      if (existing || list.users.length < 1000) break;
      page++;
    }

    if (existing) {
      userId = existing.id;
      const attrs: Record<string, unknown> = {
        email_confirm: true,
        user_metadata: { ...(existing.user_metadata || {}), full_name: fullName, role_name: roleName },
      };
      if (password) attrs.password = password;
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, attrs);
      if (updErr) throw updErr;
    } else {
      if (!password) throw new Error("Para crear usuario nuevo indique contraseña mínima de 6 caracteres.");
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role_name: roleName },
      });
      if (createErr) throw createErr;
      userId = created.user.id;
    }

    const { data: profile, error: upsertErr } = await admin
      .from("profiles")
      .upsert({
        id: userId,
        email,
        full_name: fullName,
        role_name: roleName,
        office,
        phone,
        is_active: isActive,
        source: "EDGE_AUTH",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })
      .select("*")
      .single();
    if (upsertErr) throw upsertErr;

    return json({ success: true, id: userId, profile });
  } catch (e) {
    console.error("admin-create-user error", e);
    return json({ success: false, error: e?.message || String(e) }, 400);
  }
});

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SERVICE_ROLE_KEY =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
      throw new Error("Faltan secrets: SUPABASE_URL, SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY.");
    }

    const authHeader = req.headers.get("Authorization") || "";

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: me, error: meErr } = await userClient.auth.getUser();

    if (meErr || !me?.user) {
      return json({
        success: false,
        error: "Sesión inválida. Cierre sesión e ingrese nuevamente como SuperAdmin.",
      }, 401);
    }

    const { data: myProfile, error: profileErr } = await admin
      .from("profiles")
      .select("role_name,is_active")
      .eq("id", me.user.id)
      .maybeSingle();

    if (profileErr) throw profileErr;

    if (!myProfile?.is_active || myProfile.role_name !== "SuperAdmin") {
      return json({ success: false, error: "Sólo un SuperAdmin puede administrar usuarios." }, 403);
    }

    const body = await req.json();

    const incomingId = String(body.p_id || body.id || "").trim();
    const email = String(body.p_email || body.email || "").trim().toLowerCase();
    const fullName = String(body.p_full_name || body.full_name || "").trim();
    let roleName = String(body.p_role_name || body.role_name || "Usuarios").trim();

    if (roleName === "Tecnicos") roleName = "Técnicos";

    const office = body.p_office ?? body.office ?? null;
    const phone = body.p_phone ?? body.phone ?? null;
    const isActive = body.p_is_active ?? body.is_active ?? true;
    const password = String(body.p_password || body.password || "").trim();

    if (!email) throw new Error("Email obligatorio.");
    if (!fullName) throw new Error("Nombre completo obligatorio.");
    if (!["SuperAdmin", "Admin", "Técnicos", "Usuarios"].includes(roleName)) {
      throw new Error(`Perfil inválido: ${roleName}`);
    }

    let userId: string | null = incomingId || null;

    if (!userId) {
      const { data: existingProfile, error: profileSearchErr } = await admin
        .from("profiles")
        .select("id,email")
        .eq("email", email)
        .maybeSingle();

      if (profileSearchErr) throw profileSearchErr;
      if (existingProfile?.id) userId = existingProfile.id;
    }

    if (userId) {
      /*
        FIX v8.24:
        Tu Supabase Auth falla con:
        - Database error loading user
        - Database error checking email
        Por eso NO usamos updateUserById para usuarios existentes.
        Actualizamos contraseña mediante RPC SECURITY DEFINER y luego actualizamos public.profiles.
      */
      if (password) {
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }

        const { error: passErr } = await admin.rpc("superadmin_set_user_password", {
          p_user_id: userId,
          p_password: password,
        });

        if (passErr) {
          throw new Error(`No se pudo actualizar la contraseña en Auth: ${passErr.message}`);
        }
      }
    } else {
      if (!password || password.length < 6) {
        throw new Error("Para crear usuario nuevo indique una contraseña mínima de 6 caracteres.");
      }

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role_name: roleName, office },
      });

      if (createErr) throw createErr;

      userId = created?.user?.id || null;

      if (!userId) {
        throw new Error("No se pudo crear el usuario en Supabase Auth.");
      }
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
        source: "EDGE_AUTH_V8_24_RPC_PASSWORD",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })
      .select("*")
      .single();

    if (upsertErr) throw upsertErr;

    return json({ success: true, id: userId, profile, version: "EDGE_AUTH_V8_24_RPC_PASSWORD" });
  } catch (e: any) {
    console.error("EDGE ERROR:", e);
    return json({ success: false, error: e?.message || "Error interno desconocido." }, 400);
  }
});

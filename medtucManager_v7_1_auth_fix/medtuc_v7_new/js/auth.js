'use strict';

const cfg = window.APP_CONFIG || {};
const hasSupabaseConfig = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
const supa = hasSupabaseConfig
  ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null;

const Toast = window.Swal
  ? Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2800, timerProgressBar: true })
  : null;

const $ = (selector, root = document) => root.querySelector(selector);
const valueOf = (selector) => ($(selector)?.value || '').trim();

function currentBaseUrl() {
  if (cfg.SITE_URL) return cfg.SITE_URL.replace(/\/$/, '');
  const path = window.location.pathname.replace(/\/[^/]*$/, '');
  return `${window.location.origin}${path}`.replace(/\/$/, '');
}

function pageUrl(file) {
  return `${currentBaseUrl()}/${file}`;
}

function showError(title, err) {
  const msg = err?.message || String(err || 'Error desconocido');
  if (window.Swal) return Swal.fire({ icon: 'error', title, text: msg });
  alert(`${title}\n${msg}`);
}

function showOk(title, text = '') {
  if (window.Swal) return Swal.fire({ icon: 'success', title, text });
  alert(text ? `${title}\n${text}` : title);
}

function requireClient() {
  if (!supa) {
    throw new Error('No se pudo inicializar Supabase. Revisá js/config.js: SUPABASE_URL y SUPABASE_ANON_KEY.');
  }
  return supa;
}

async function ensureNoAppIfLogged() {
  if (!supa) return;
  const isLogin = /(?:^|\/)index\.html$/.test(location.pathname) || location.pathname.endsWith('/');
  if (!isLogin) return;
  const { data } = await supa.auth.getSession();
  if (data?.session) window.location.href = './app.html';
}

async function ensureProfile(user) {
  let { data: prof, error } = await supa
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;

  if (!prof) {
    await supa.rpc('ensure_current_user_profile').catch(() => null);
    const retry = await supa
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (retry.error) throw retry.error;
    prof = retry.data;
  }

  if (!prof) {
    throw new Error('El usuario existe en Auth, pero no tiene perfil en public.profiles. Ejecutá el SQL de seed SuperAdmin incluido en /supabase.');
  }

  if (!prof.is_active) {
    await supa.auth.signOut();
    throw new Error('Usuario inactivo. Solicite autorización al SuperAdmin.');
  }

  return prof;
}

async function loginWithEmail(email, password) {
  requireClient();
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail || !password) throw new Error('Ingresá email y contraseña.');

  const { data, error } = await supa.auth.signInWithPassword({
    email: cleanEmail,
    password
  });
  if (error) throw error;
  if (!data?.user) throw new Error('Supabase no devolvió usuario autenticado.');

  await ensureProfile(data.user);
  return data;
}

function bindLoginForm() {
  const form = $('#loginForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = valueOf('#email');
    const password = $('#password')?.value || '';

    try {
      if (window.Swal) Swal.showLoading();
      await loginWithEmail(email, password);
      await showOk('Acceso validado', 'Bienvenido al panel institucional.');
      window.location.href = './app.html';
    } catch (err) {
      showError('No se pudo iniciar sesión', err);
    }
  });
}

function bindGoogleAuth() {
  const btn = $('#googleBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      requireClient();
      const { error } = await supa.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: pageUrl('app.html') }
      });
      if (error) throw error;
    } catch (err) {
      showError('No se pudo iniciar sesión con Google', err);
    }
  });
}

function bindRegister() {
  const btn = $('#registerBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (!window.Swal) return;

    const { value: form } = await Swal.fire({
      title: 'Crear usuario institucional',
      html: `
        <input id="rname" class="swal2-input" placeholder="Nombre completo">
        <input id="remail" class="swal2-input" type="email" placeholder="Email institucional">
        <select id="rrole" class="swal2-select">
          <option value="Usuarios">Usuarios</option>
          <option value="Técnicos">Técnicos</option>
          <option value="Admin">Admin</option>
        </select>
        <input id="rpass" class="swal2-input" type="password" placeholder="Contraseña provisoria">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear usuario',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const full_name = valueOf('#rname');
        const email = valueOf('#remail').toLowerCase();
        const role_name = valueOf('#rrole') || 'Usuarios';
        const password = $('#rpass')?.value || '';
        if (!full_name || !email || !password) {
          Swal.showValidationMessage('Completá nombre, email y contraseña.');
          return false;
        }
        if (password.length < 6) {
          Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres.');
          return false;
        }
        return { full_name, email, role_name, password };
      }
    });

    if (!form) return;

    try {
      requireClient();
      const { data, error } = await supa.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            role_name: form.role_name
          },
          emailRedirectTo: pageUrl('app.html')
        }
      });
      if (error) throw error;

      // Si Supabase entrega sesión inmediata, intentamos dejar el perfil creado/actualizado.
      // Si requiere confirmación por correo, lo hará el trigger SQL: create_profile_for_new_user().
      if (data?.session && data?.user) {
        await supa.from('profiles').upsert({
          id: data.user.id,
          email: form.email,
          full_name: form.full_name,
          role_name: form.role_name,
          is_active: form.role_name === 'Usuarios'
        }).throwOnError();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Usuario registrado',
        text: 'Si la confirmación por email está activa, revise el correo. El SuperAdmin puede activar y ajustar permisos desde Usuarios/Roles.'
      });
    } catch (err) {
      showError('No se pudo crear el usuario', err);
    }
  });
}

function bindRecover() {
  const form = $('#recoverForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = valueOf('#recoverEmail') || valueOf('#email');

    try {
      requireClient();
      if (!email) throw new Error('Ingresá el email institucional.');
      const { error } = await supa.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: pageUrl('reset-password.html')
      });
      if (error) throw error;
      await showOk('Enlace enviado', 'Revise su correo y siga el enlace para definir una nueva contraseña.');
    } catch (err) {
      showError('No se pudo enviar el enlace', err);
    }
  });
}

function bindResetPassword() {
  const form = $('#resetPasswordForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const pass1 = $('#newPassword')?.value || '';
    const pass2 = $('#newPassword2')?.value || '';

    try {
      requireClient();
      if (pass1.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
      if (pass1 !== pass2) throw new Error('Las contraseñas no coinciden.');

      const { error } = await supa.auth.updateUser({ password: pass1 });
      if (error) throw error;
      await showOk('Contraseña actualizada', 'Ya puede iniciar sesión con la nueva contraseña.');
      window.location.href = './index.html';
    } catch (err) {
      showError('No se pudo actualizar la contraseña', err);
    }
  });
}

async function handleAuthRedirects() {
  if (!supa) return;

  // Supabase puede devolver tokens en hash. detectSessionInUrl los procesa; esperamos un instante.
  if (location.hash.includes('access_token') || location.search.includes('code=')) {
    await supa.auth.getSession().catch(() => null);
  }
}

function initParticles() {
  if (!window.tsParticles || !$('#particles')) return;
  window.tsParticles.load('particles', {
    particles: {
      number: { value: 55 },
      color: { value: '#ffffff' },
      links: { enable: true, color: '#ffffff', opacity: 0.22 },
      move: { enable: true, speed: 0.8 },
      opacity: { value: 0.45 },
      size: { value: { min: 1, max: 3 } }
    },
    background: { color: 'transparent' }
  }).catch(() => null);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => null);
  }
}

(async function initAuth() {
  try {
    await handleAuthRedirects();
    bindLoginForm();
    bindGoogleAuth();
    bindRegister();
    bindRecover();
    bindResetPassword();
    initParticles();
    registerServiceWorker();
    await ensureNoAppIfLogged();
  } catch (err) {
    console.error(err);
    showError('Error de autenticación', err);
  }
})();

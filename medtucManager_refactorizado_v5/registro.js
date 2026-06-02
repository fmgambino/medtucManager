const authMessage = document.getElementById('authMessage');
const registerForm = document.getElementById('registerForm');
function setMsg(text, type='info') { if (authMessage) { authMessage.textContent = text || ''; authMessage.dataset.type = type; } }
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    if (!window.sb?.enabled) throw new Error('Supabase no está configurado.');
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    if (!fullName || !email || password.length < 6) throw new Error('Completá nombre, email y una contraseña de al menos 6 caracteres.');
    setMsg('Registrando solicitud...');
    await window.sb.registerInactive({ full_name: fullName, email, password, role });
    setMsg('Solicitud registrada. Tu cuenta queda inactiva hasta que un administrador la autorice.', 'ok');
    registerForm.reset();
  } catch (error) {
    setMsg(error.message || 'No se pudo registrar la solicitud.', 'error');
    console.error('Registro:', error);
  }
});

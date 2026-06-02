const authMessage = document.getElementById('authMessage');
const recoverForm = document.getElementById('recoverForm');
function setMsg(text, type='info') { if (authMessage) { authMessage.textContent = text || ''; authMessage.dataset.type = type; } }
recoverForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    if (!window.sb?.enabled) throw new Error('Supabase no está configurado.');
    const email = document.getElementById('recoverEmail').value.trim().toLowerCase();
    setMsg('Enviando email de recuperación...');
    await window.sb.sendPasswordReset(email);
    setMsg('Si el email existe, recibirá un enlace para cambiar la contraseña.', 'ok');
    recoverForm.reset();
  } catch (error) {
    setMsg(error.message || 'No se pudo enviar la recuperación.', 'error');
    console.error('Recuperar contraseña:', error);
  }
});

const msg = document.getElementById('resetMessage');
function setResetMsg(t, type='info'){ msg.textContent=t; msg.dataset.type=type; }
document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const p1 = document.getElementById('newPassword').value;
  const p2 = document.getElementById('repeatPassword').value;
  if (p1 !== p2) return setResetMsg('Las contraseñas no coinciden.', 'error');
  try { setResetMsg('Guardando...'); await window.sb.updatePassword(p1); setResetMsg('Contraseña actualizada. Ya podés ingresar.', 'ok'); }
  catch(error){ setResetMsg(error.message || 'No se pudo actualizar la contraseña.', 'error'); console.error(error); }
});

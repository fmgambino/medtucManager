window.ISMUsuarios = window.ISMUsuarios || {};
window.ISMUsuarios.list = () => window.sb?.listProfiles?.();
window.ISMUsuarios.create = (payload) => window.sb?.upsertUserProfile?.(payload);
window.ISMUsuarios.update = (id, payload) => window.sb?.updateProfileFull?.(id, payload);
window.ISMUsuarios.remove = (id) => window.sb?.deleteProfile?.(id);

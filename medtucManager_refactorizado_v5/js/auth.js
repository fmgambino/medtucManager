window.ISMAuth = window.ISMAuth || {};
window.ISMAuth.requireSession = async () => window.sb?.getSession?.();
window.ISMAuth.signOut = async () => window.sb?.signOut?.();

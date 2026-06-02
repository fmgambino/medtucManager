window.ISMUtils = window.ISMUtils || {};
// Utilidades compartidas. La lógica principal usa funciones globales de js/app.js para compatibilidad con GitHub Pages.
window.ISMUtils.normalizeText = (value) => String(value ?? '').trim();
window.ISMUtils.toCsvValue = (value) => `"${String(value ?? '').replaceAll('\"','\"\"')}"`;

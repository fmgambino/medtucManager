window.ISMUI = window.ISMUI || {};
window.ISMUI.alertError = (title, error) => Swal.fire({ icon:'error', title, text: error?.message || String(error || '') });
window.ISMUI.alertOk = (title, text='') => Swal.fire({ icon:'success', title, text });

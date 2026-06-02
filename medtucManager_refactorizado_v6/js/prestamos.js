window.ISMPrestamos = window.ISMPrestamos || {};
window.ISMPrestamos.list = () => window.sb?.listLoans?.();
window.ISMPrestamos.updateStatus = (id, status) => window.sb?.updateLoanStatus?.(id, status);

window.ISMInventario = window.ISMInventario || {};
window.ISMInventario.list = () => window.sb?.listInventory?.();
window.ISMInventario.create = (payload) => window.sb?.createInventoryAsset?.(payload);
window.ISMInventario.update = (id, payload) => window.sb?.updateInventoryAsset?.(id, payload);
window.ISMInventario.remove = (id) => window.sb?.softDeleteInventoryAsset?.(id);

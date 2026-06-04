'use strict';

const cfg = window.APP_CONFIG || {};
const supa = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
});
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const ico = {
  dashboard:'<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  users:'<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  roles:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
  orders:'<svg class="icon" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-6 6a2 2 0 0 1-2.8-2.8l6-6a6 6 0 0 1 7.9-7.9l-3.3 2.9Z"/></svg>',
  inventory:'<svg class="icon" viewBox="0 0 24 24"><path d="m21 16-9 5-9-5V8l9-5 9 5Z"/><path d="M3.3 7.5 12 12l8.7-4.5"/><path d="M12 22V12"/></svg>',
  loans:'<svg class="icon" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  tickets:'<svg class="icon" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7h18M8 11h8M8 15h5"/></svg>',
  bell:'<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  profile:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
  settings:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
  logout:'<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  view:'<svg viewBox="0 0 24 24" class="icon"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit:'<svg viewBox="0 0 24 24" class="icon"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" class="icon"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  print:'<svg viewBox="0 0 24 24" class="icon"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>'
};

const state = { user:null, profile:null, settings:{}, page:'dashboard', rows:{}, statuses:[], permissions:[], selected:{}, pagination:{ orders:{page:1,size:10} } };
const modules = [
  ['dashboard','Dashboard',ico.dashboard], ['users','Usuarios',ico.users], ['roles','Roles y Permisos',ico.roles], ['orders','Órdenes de Servicio',ico.orders],
  ['inventory','Inventario',ico.inventory], ['loans','Gestión de Préstamos',ico.loans], ['tickets','Soporte Ticket',ico.tickets],
  ['notifications','Notificaciones',ico.bell], ['profile','Mi Perfil',ico.profile], ['settings','Configuraciones',ico.settings], ['logout','Cerrar Sesión',ico.logout]
];
const crud = {
  users:{table:'profiles',title:'Usuarios',desc:'ABM de usuarios institucionales y perfiles autorizados.',fields:['full_name','email','role_name','office','phone','is_active'],labels:['Nombre completo','Email','Perfil','Oficina/Repartición','Teléfono','Activo'],select:'*'},
  roles:{table:'roles',title:'Roles y Permisos',desc:'Perfiles institucionales: SuperAdmin, Admin, Técnicos y Usuarios.',fields:['name','description','is_system'],labels:['Perfil','Descripción','Sistema'],select:'*'},
  inventory:{table:'inventory_items',title:'Inventario',desc:'Stock, insumos, equipos y trazabilidad por código/serie.',fields:['code','name','category','brand','model','serial_number','stock','min_stock','location','status','condition','notes'],labels:['Código','Nombre','Categoría','Marca','Modelo','N° Serie','Stock','Stock mínimo','Ubicación','Estado','Condición','Notas'],select:'*'},
  loans:{table:'loans',title:'Gestión de Préstamos',desc:'Solicitudes, aprobaciones, devoluciones y seguimiento.',fields:['requester_name','requester_email','office','item_description','quantity','start_at','due_at','status','observations'],labels:['Solicitante','Email','Oficina','Insumo/Equipo','Cantidad','Inicio','Vencimiento','Estado','Observaciones'],select:'*'},
  tickets:{table:'support_tickets',title:'Soporte Ticket',desc:'Tickets recibidos desde el formulario público /soporteticket.',fields:['requester_name','requester_email','requester_phone','office','area','subject','incidence_type','description','priority','status'],labels:['Solicitante','Email','Teléfono','Oficina','Área','Asunto','Incidencia','Descripción','Prioridad','Estado'],select:'*'},
  notifications:{table:'notifications',title:'Notificaciones',desc:'Avisos automáticos, cambios de estado y auditoría operativa.',fields:['title','body','module','target_role','is_read'],labels:['Título','Detalle','Módulo','Perfil destino','Leída'],select:'*'}
};

function fmt(v) { if (v === true) return '<span class="badge ok">Activo</span>'; if (v === false) return '<span class="badge danger">Inactivo</span>'; if (v === null || v === undefined || v === '') return '-'; if (String(v).includes('T')) return new Date(v).toLocaleString('es-AR'); return esc(v); }
function page(title, desc) { $('#pageTitle').textContent = title; $('#pageDesc').textContent = desc || ''; }
async function count(table) { const { count, error } = await supa.from(table).select('*', { count:'exact', head:true }); return error ? 0 : (count || 0); }
async function safeRpc(name, args) { try { const { error } = await supa.rpc(name, args || {}); if (error) console.warn('RPC', name, error.message); } catch (e) { console.warn('RPC no disponible', name, e.message); } }

async function init() {
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) throw new Error('Falta configurar js/config.js con SUPABASE_URL y SUPABASE_ANON_KEY.');
  const { data:{ session }, error } = await supa.auth.getSession();
  if (error) throw error;
  if (!session) { window.location.replace('./index.html'); return; }
  state.user = session.user;
  await safeRpc('ensure_current_user_profile');
  await loadProfile();
  await loadSettings();
  await loadPermissions();
  renderShell();
  await route('dashboard');
  subscribeRealtime();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>null);
}
async function loadProfile(){
  const { data, error } = await supa.from('profiles').select('*').eq('id', state.user.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('El usuario autenticado no tiene perfil en public.profiles. Ejecutá supabase/seed_superadmin_profile.sql.');
  if (!data.is_active) { await supa.auth.signOut(); throw new Error('Usuario inactivo.'); }
  state.profile = data;
}
async function loadSettings(){
  const { data, error } = await supa.from('app_settings').select('*').eq('id',1).maybeSingle();
  if (error) console.warn(error.message);
  state.settings = data || {};
  applySettings();
}
async function loadPermissions(){
  state.permissions = [];
  const role = state.profile?.role_name;
  if (role === 'SuperAdmin') return;
  const { data } = await supa.from('roles').select('id,name,role_permissions(permissions(code))').eq('name', role).maybeSingle();
  state.permissions = (data?.role_permissions || []).map(x => x.permissions?.code).filter(Boolean);
}
function can(code){ return state.profile?.role_name === 'SuperAdmin' || state.permissions.includes(code); }
function applySettings(){
  const s = state.settings || {};
  const map = { primary_color:'--primary', secondary_color:'--secondary', accent_color:'--accent', background_color:'--bg', card_color:'--card' };
  Object.entries(map).forEach(([k,css]) => { if (s[k]) document.documentElement.style.setProperty(css, s[k]); });
  document.body.classList.toggle('light', localStorage.theme === 'light');
}
function renderShell(){
  const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
  const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
  const mobileMain = [
    ['dashboard','Dashboard',ico.dashboard],
    ['inventory','Inventario',ico.inventory],
    ['orders','Órdenes',ico.orders],
    ['tickets','Tickets',ico.tickets]
  ];
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?'🌙':'☀️'}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}</button><button class="avatar-action" id="avatarBtn" title="Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
  $('#themeBtn').onclick = () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); };
  $('#fullBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  $('#notifyBtn').onclick = () => route('notifications');
  $('#notifyBtn').addEventListener('mouseenter', showNotificationPreview);
  $('#notifyBtn').addEventListener('mouseleave', () => setTimeout(()=>document.querySelector('.notification-popover')?.remove(), 400));
  $('#avatarBtn').onclick = () => route('profile');
  $('#logoutBtn').onclick = () => route('logout');
  $('#mobileMoreBtn').onclick = openMobileMenu;
}

function syncNavActive(){
  $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === state.page));
}

function openMobileMenu(){
  const rest = modules.filter(m => !['dashboard','inventory','orders','tickets'].includes(m[0]));
  const html = `<div class="mobile-menu-sheet"><button class="sheet-theme" onclick="toggleThemeFromMenu()">${localStorage.theme==='light'?'Modo oscuro':'Modo claro'} ${localStorage.theme==='light'?'🌙':'☀️'}</button>${rest.map(m=>`<button class="mobile-menu-item" data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</div>`;
  Swal.fire({title:'Menú',html,showConfirmButton:false,showCloseButton:true,customClass:{popup:'tm-modal mobile-menu-modal'}});
  setTimeout(()=>$$('.mobile-menu-item').forEach(b=>b.onclick=()=>{Swal.close(); route(b.dataset.page);}),50);
}
window.toggleThemeFromMenu = function(){ localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; Swal.close(); applySettings(); renderShell(); route(state.page); };
async function route(p){
  if (p === 'logout') { await supa.auth.signOut(); window.location.replace('./index.html'); return; }
  state.page = p;
  syncNavActive();
  if (p === 'dashboard') return renderDashboard();
  if (p === 'orders') return renderOrders();
  if (p === 'settings') return renderSettings();
  if (p === 'profile') return renderProfile();
  if (p === 'notifications') return renderNotifications();
  if (crud[p]) return renderCrud(p);
}
async function renderDashboard(){
  page('Dashboard','Vista ejecutiva del sistema institucional.');
  const [users, orders, tickets, inv] = await Promise.all([count('profiles'), count('service_orders'), count('support_tickets'), count('inventory_items')]);
  $('#content').innerHTML = `<div class="grid"><div class="card kpi"><h3>Usuarios</h3><b>${users}</b><p>Perfiles autorizados.</p></div><div class="card kpi"><h3>Órdenes</h3><b>${orders}</b><p>Órdenes técnicas registradas.</p></div><div class="card kpi"><h3>Tickets</h3><b>${tickets}</b><p>Solicitudes recibidas.</p></div><div class="card kpi"><h3>Inventario</h3><b>${inv}</b><p>Activos e insumos.</p></div></div><div class="card"><h2>Centro operativo</h2><p>Gestión integrada de tickets, órdenes técnicas, inventario, préstamos, usuarios, roles, permisos, notificaciones y reportes PDF/CSV.</p><div class="module-actions"><button class="btn primary" onclick="route('tickets')">Ver tickets</button><button class="btn" onclick="route('orders')">Ver órdenes</button><button class="btn" onclick="route('inventory')">Ver inventario</button></div></div>`;
}
async function renderCrud(key){
  const c = crud[key]; page(c.title, c.desc);
  let query = supa.from(c.table).select(c.select).order('created_at', { ascending:false });
  const { data, error } = await query;
  if (error) return showPanelError(error);
  let rows = data || [];
  if (key === 'roles') rows = rows.filter(r => ['SuperAdmin','Admin','Técnicos','Usuarios'].includes(r.name));
  state.rows[key] = rows; state.selected[key] = new Set();
  const columns = c.fields.slice(0, 6);
  const bulk = `<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('${key}',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEdit('${key}')">Editar selección</button><button class="btn danger" onclick="bulkDelete('${key}')">Eliminar selección</button><span id="sel_${key}">0 seleccionados</span></div>`;
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>${c.title}</h2><p>Acciones disponibles: ver, editar, eliminar, selección masiva, importar CSV, exportar CSV y PDF A4.</p></div><div class="module-actions"><button class="btn primary" onclick="openForm('${key}')">Nuevo</button><button class="btn" onclick="importCsv('${key}')">Importar CSV</button><button class="btn" onclick="exportCsv('${key}')">Exportar CSV</button><button class="btn" onclick="exportPdf('${key}')">PDF A4</button></div></div><input class="search" placeholder="Buscar en ${c.title}..." oninput="filterRows(this.value)">${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th>${columns.map((f,i)=>`<th>${esc(c.labels[i])}</th>`).join('')}<th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(r=>rowHtml(key,r,columns)).join('')}</tbody></table></div>${bulk}</div>`;
}
function rowHtml(key, r, columns){ return `<tr data-id="${r.id}" data-search="${esc(Object.values(r).join(' ').toLowerCase())}"><td class="select-col"><input type="checkbox" onchange="toggleOne('${key}','${r.id}',this.checked)"></td>${columns.map(f=>`<td>${fmt(r[f])}</td>`).join('')}<td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewRow('${key}','${r.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openForm('${key}','${r.id}')">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="deleteRow('${key}','${r.id}')">${ico.trash}</button></td></tr>`; }
window.toggleOne = (key,id,checked) => { state.selected[key] ||= new Set(); checked ? state.selected[key].add(id) : state.selected[key].delete(id); updateSelectedCount(key); };
window.toggleAll = (key, checked) => { state.selected[key] = new Set(); $$('#rowsBody tr').forEach(tr=>{ const cb=tr.querySelector('input[type="checkbox"]'); if(cb){ cb.checked=checked; if(checked) state.selected[key].add(tr.dataset.id); }}); updateSelectedCount(key); };
function selectedIds(key){ return Array.from(state.selected[key] || []); }
function updateSelectedCount(key){ $$(`#sel_${key}`).forEach(el=>el.textContent=`${selectedIds(key).length} seleccionados`); }
window.bulkDelete = async (key) => { const ids=selectedIds(key); if(!ids.length) return Swal.fire({icon:'info',title:'Sin selección',text:'Seleccione al menos un registro.'}); const ok=await Swal.fire({icon:'warning',title:`Eliminar ${ids.length} registros`,text:'Esta acción no se puede deshacer.',showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; const table=key==='orders'?'service_orders':crud[key].table; const {error}=await supa.from(table).delete().in('id',ids); if(error)return Swal.fire({icon:'error',title:'No se pudo eliminar',text:error.message}); await notify('Eliminación masiva', `${state.profile.full_name} eliminó ${ids.length} registros en ${key}.`, key, null); route(key); };
window.bulkEdit = async (key) => { const ids=selectedIds(key); if(!ids.length) return Swal.fire({icon:'info',title:'Sin selección',text:'Seleccione al menos un registro.'}); const c=crud[key]; let options=''; if(key==='users') options=inputHtml('is_active','Activo',true)+inputHtml('role_name','Perfil','Usuarios'); else if(key==='notifications') options=inputHtml('is_read','Leída',true); else if(key==='tickets'||key==='loans') options=inputHtml('status','Estado','Pendiente'); else if(key==='inventory') options=inputHtml('status','Estado','Disponible'); else options='<p>Para este módulo la edición masiva permite eliminar por selección.</p>'; const {value}=await Swal.fire({title:`Editar ${ids.length} registros`,html:`<div class="swal-grid">${options}</div>`,width:760,showCancelButton:true,confirmButtonText:'Aplicar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(['is_active','role_name','is_read','status'])}); if(!value)return; Object.keys(value).forEach(k=>value[k]===null&&delete value[k]); const table=key==='orders'?'service_orders':c.table; const {error}=await supa.from(table).update(value).in('id',ids); if(error)return Swal.fire({icon:'error',title:'No se pudo actualizar',text:error.message}); await notify('Edición masiva', `${state.profile.full_name} actualizó ${ids.length} registros en ${c.title}.`, key, null); route(key); };
window.filterRows = (q) => { q = String(q||'').toLowerCase(); $$('#rowsBody tr').forEach(tr => tr.style.display = tr.dataset.search.includes(q) ? '' : 'none'); };
function inputHtml(id,label,value,type='text'){
  const val = value ?? '';
  if (typeof value === 'boolean' || id === 'is_active' || id === 'is_system' || id === 'is_read' || id === 'telegram_enabled' || id === 'is_final') return `<label>${esc(label)}<select id="f_${id}"><option value="true" ${(value===true || val==='true')?'selected':''}>Sí</option><option value="false" ${(value===false || val==='false')?'selected':''}>No</option></select></label>`;
  if (id === 'role_name' || id === 'target_role') return `<label>${esc(label)}<select id="f_${id}">${['SuperAdmin','Admin','Técnicos','Usuarios'].map(x=>`<option value="${x}" ${val===x?'selected':''}>${x}</option>`).join('')}</select></label>`;
  if (id === 'status') return `<label>${esc(label)}<select id="f_${id}">${['Pendiente','Asignado','En proceso','Resuelto','Cerrado','Cancelado','Devuelto','Aprobado'].map(x=>`<option value="${x}" ${val===x?'selected':''}>${x}</option>`).join('')}</select></label>`;
  if (id === 'priority') return `<label>${esc(label)}<select id="f_${id}">${['Baja','Media','Alta','Urgente'].map(x=>`<option value="${x}" ${val===x?'selected':''}>${x}</option>`).join('')}</select></label>`;
  if (['description','notes','observations','body','accessories','fault_description','technical_report','solution','diagnosis'].includes(id)) return `<label class="full">${esc(label)}<textarea id="f_${id}">${esc(val)}</textarea></label>`;
  return `<label>${esc(label)}<input id="f_${id}" type="${type}" value="${esc(val)}"></label>`;
}
function collect(fields){
  const data = {};
  fields.forEach(f => {
    const el = $('#f_' + f); if (!el) return;
    if (el.type === 'color') data[f] = el.value;
    else if (el.value === 'true' || el.value === 'false') data[f] = el.value === 'true';
    else if (['stock','min_stock','quantity'].includes(f)) data[f] = Number(el.value || 0);
    else data[f] = el.value || null;
  });
  return data;
}
window.openForm = async (key, id=null) => {
  const c = crud[key]; const row = id ? (state.rows[key]||[]).find(x=>x.id===id) : {};
  const html = `<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${key==='users'?`<img src="${esc(row?.avatar_url||'assets/avatar-default.svg')}" onerror="this.src='assets/avatar-default.svg'">`:ico[key==='inventory'?'inventory':key==='tickets'?'tickets':key==='loans'?'loans':'users']}</div><p>${id?'Actualice la información institucional del registro.':'Complete los datos solicitados para generar el registro.'}</p></div><div class="swal-grid">${c.fields.map((f,i)=>inputHtml(f,c.labels[i],row?.[f])).join('')}</div></div>`;
  const { value } = await Swal.fire({ title: id ? `Editar ${c.title}` : `Nuevo ${c.title}`, html, width: 860, showCancelButton:true, confirmButtonText:'Guardar', cancelButtonText:'Cancelar', customClass:{popup:'tm-modal'}, preConfirm:()=>collect(c.fields) });
  if (!value) return;
  try {
    let res;
    if (id) res = await supa.from(c.table).update(value).eq('id', id);
    else res = await supa.from(c.table).insert(value);
    if (res.error) throw res.error;
    await notify(`${id?'Actualización':'Nuevo registro'} en ${c.title}`, `${state.profile.full_name} realizó una operación en ${c.title}.`, key, id);
    await Swal.fire({icon:'success',title:'Guardado correctamente'});
    route(key);
  } catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
};
window.viewRow = (key,id) => { const row=(state.rows[key]||[]).find(x=>x.id===id); const c=crud[key]; const avatar = row?.avatar_url || 'assets/avatar-default.svg'; const html = key==='users' ? `<div class="detail-card user-detail"><img class="detail-avatar" src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><h3>${esc(row.full_name||row.email||'Usuario')}</h3><span class="profile-pill">${esc(row.role_name||'')}</span><div class="detail-grid"><p><b>Email</b><span>${esc(row.email||'-')}</span></p><p><b>Oficina</b><span>${esc(row.office||'-')}</span></p><p><b>Teléfono</b><span>${esc(row.phone||'-')}</span></p><p><b>Estado</b><span>${row.is_active?'Activo':'Inactivo'}</span></p></div></div>` : `<div class="detail-card"><h3>${esc(c.title)}</h3><div class="detail-grid">${Object.entries(row||{}).filter(([k])=>!['id'].includes(k)).map(([k,v])=>`<p><b>${esc(k)}</b><span>${fmt(v)}</span></p>`).join('')}</div></div>`; Swal.fire({title:'Detalle del registro',html,width:860,customClass:{popup:'tm-modal'}}); };
window.deleteRow = async (key,id) => { const c=crud[key]; const ok=await Swal.fire({icon:'warning',title:'¿Eliminar registro?',text:'Esta acción no se puede deshacer.',showCancelButton:true,confirmButtonText:'Eliminar',cancelButtonText:'Cancelar'}); if(!ok.isConfirmed)return; const {error}=await supa.from(c.table).delete().eq('id',id); if(error)return Swal.fire({icon:'error',title:'No se pudo eliminar',text:error.message}); await notify(`Eliminación en ${c.title}`, `${state.profile.full_name} eliminó un registro.`, key, id); route(key); };
async function loadStatuses(){ const {data,error}=await supa.from('service_order_statuses').select('*').order('sort_order'); if(error) console.warn(error.message); state.statuses=data||[]; }
async function renderOrders(){
  page('Órdenes de Servicio','Trazabilidad técnica institucional, sin importes ni conceptos comerciales.');
  await loadStatuses();
  const { data, error } = await supa.from('service_orders').select('*, service_order_statuses(name,color)').order('received_at',{ascending:false});
  if (error) return showPanelError(error);
  const rows = data || []; state.rows.orders = rows; state.selected.orders = new Set();
  const pg = state.pagination.orders || {page:1,size:10};
  const total = rows.length; const pages = Math.max(1, Math.ceil(total/pg.size)); if(pg.page>pages)pg.page=pages;
  const start = (pg.page-1)*pg.size; const pageRows = rows.slice(start,start+pg.size);
  const pager = `<div class="pager"><label>Listar <select onchange="setOrderPageSize(this.value)">${[5,10,25,50,100,500].map(n=>`<option value="${n}" ${pg.size==n?'selected':''}>${n}</option>`).join('')}</select></label><div><button class="btn" ${pg.page<=1?'disabled':''} onclick="changeOrderPage(-1)">← Atrás</button><span>Página ${pg.page} de ${pages} · ${total} registros</span><button class="btn" ${pg.page>=pages?'disabled':''} onclick="changeOrderPage(1)">Siguiente →</button></div></div>`;
  const bulk = `<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('orders',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEditOrders()">Cambiar estado</button><button class="btn danger" onclick="bulkDelete('orders')">Eliminar selección</button><span id="sel_orders">0 seleccionados</span></div>`;
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>Órdenes técnicas</h2><p>Registro de ingreso, atención, estados, informe técnico, insumos utilizados, notas y entrega.</p></div><div class="module-actions"><button class="btn primary" onclick="openOrder()">Nueva orden</button><button class="btn" onclick="openStatusManager()">Estados</button><button class="btn" onclick="importCsv('orders')">Importar SATMANAGER CSV</button><button class="btn" onclick="exportCsv('orders')">Exportar CSV</button><button class="btn" onclick="exportPdf('orders')">PDF A4</button></div></div><input class="search" placeholder="Buscar por orden, cliente, oficina, equipo, marca, modelo, serie o falla..." oninput="filterRows(this.value)">${pager}${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th><th>Orden</th><th>Ingreso original</th><th>Solicitante/Oficina</th><th>Equipo</th><th>Falla</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${pageRows.map(orderRow).join('')}</tbody></table></div>${bulk}${pager}</div>`;
}
window.setOrderPageSize=(v)=>{ state.pagination.orders.size=Number(v); state.pagination.orders.page=1; renderOrders(); };
window.changeOrderPage=(d)=>{ state.pagination.orders.page+=d; renderOrders(); };
function orderRow(o){ const st=o.service_order_statuses||{}; return `<tr data-id="${o.id}" data-search="${esc(Object.values(o).join(' ').toLowerCase())}"><td class="select-col"><input type="checkbox" onchange="toggleOne('orders','${o.id}',this.checked)"></td><td><b>#${esc(o.satmanager_order || o.order_number)}</b></td><td>${fmt(o.received_at)}${o.imported_at?`<br><small>Importado: ${fmt(o.imported_at)}</small>`:''}</td><td>${esc(o.requester_name||'-')}<br><small>${esc(o.office||'')}</small></td><td>${esc([o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' · '))}</td><td>${esc(o.fault_description||'-')}</td><td><span class="badge" style="color:${esc(st.color||'#94a3b8')}">${esc(st.name||'Sin estado')}</span></td><td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewOrder('${o.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openOrder('${o.id}')">${ico.edit}</button><button class="icon-mini" title="Ingreso" onclick="printOrder('${o.id}','ingreso')">${ico.print}</button><button class="icon-mini" title="Entrega" onclick="printOrder('${o.id}','entrega')">${ico.print}</button><button class="icon-mini" title="Nota" onclick="makeNote('${o.id}')">✍</button><button class="icon-mini danger" title="Eliminar" onclick="deleteOrder('${o.id}')">${ico.trash}</button></td></tr>`; }
window.bulkEditOrders = async () => { const ids=selectedIds('orders'); if(!ids.length) return Swal.fire({icon:'info',title:'Sin selección'}); await loadStatuses(); const html=`<div class="swal-grid"><label>Nuevo estado<select id="f_status_id">${state.statuses.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label></div>`; const {value}=await Swal.fire({title:`Cambiar estado en ${ids.length} órdenes`,html,width:650,showCancelButton:true,confirmButtonText:'Aplicar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(['status_id'])}); if(!value)return; const {error}=await supa.from('service_orders').update({status_id:value.status_id,updated_by:state.user.id}).in('id',ids); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); await Promise.all(ids.map(id=>supa.from('service_order_history').insert({service_order_id:id,action:'Cambio masivo de estado',new_value:value.status_id,user_id:state.user.id}))); await notify('Cambio masivo de estado', `${state.profile.full_name} cambió el estado de ${ids.length} órdenes.`, 'orders', null); renderOrders(); };
window.openOrder = async (id=null) => {
  await loadStatuses(); const o = id ? (state.rows.orders||[]).find(x=>x.id===id) : {};
  const statusSelect = `<label>Estado<select id="f_status_id">${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const html = `<div class="tm-form order-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.orders}</div><p>${id?'Actualizar trazabilidad técnica, estado e informe de la orden.':'Registrar ingreso de equipo/solicitud con datos compatibles con el sistema legado.'}</p></div><div class="swal-grid">${statusSelect}${inputHtml('satmanager_order','Orden / referencia',o?.satmanager_order)}${inputHtml('requester_name','Solicitante / Cliente',o?.requester_name)}${inputHtml('requester_email','Email',o?.requester_email)}${inputHtml('requester_phone','Teléfono',o?.requester_phone)}${inputHtml('office','Oficina/Repartición',o?.office)}${inputHtml('address','Dirección',o?.address)}${inputHtml('equipment_type','Tipo de equipo',o?.equipment_type)}${inputHtml('brand','Marca',o?.brand)}${inputHtml('model','Modelo',o?.model)}${inputHtml('serial_number','N° de serie',o?.serial_number)}${inputHtml('priority','Prioridad',o?.priority||'Media')}${inputHtml('accessories','Accesorios',o?.accessories)}${inputHtml('fault_description','Falla declarada',o?.fault_description)}${inputHtml('technical_report','Informe técnico',o?.technical_report)}${inputHtml('solution','Solución / Observaciones',o?.solution)}</div></div>`;
  const fields=['status_id','satmanager_order','requester_name','requester_email','requester_phone','office','address','equipment_type','brand','model','serial_number','priority','accessories','fault_description','technical_report','solution'];
  const oldStatus=o?.status_id;
  const {value}=await Swal.fire({title:id?'Editar orden de servicio':'Nueva orden de servicio',html,width:980,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(fields)});
  if(!value)return;
  try{ value.updated_by=state.user.id; if(!id)value.created_by=state.user.id; if(!value.fault_description)value.fault_description='Sin descripción'; const res=id?await supa.from('service_orders').update(value).eq('id',id):await supa.from('service_orders').insert(value).select('id').single(); if(res.error)throw res.error; const oid=id||res.data?.id; if(id && oldStatus!==value.status_id){ await supa.from('service_order_history').insert({service_order_id:id,action:'Cambio de estado',previous_value:oldStatus,new_value:value.status_id,user_id:state.user.id}); } await notify(id?'Orden actualizada':'Nueva orden de servicio', `${state.profile.full_name} ${id?'actualizó':'registró'} una orden técnica.`, 'orders', oid); await Swal.fire({icon:'success',title:'Orden guardada'}); renderOrders(); }catch(e){Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message});}
};
window.openStatusManager = async () => {
  await loadStatuses();
  const list = state.statuses.map(s=>`<div class="status-line"><span class="badge" style="color:${s.color}">${esc(s.name)}</span><button onclick="editStatus('${s.id}')">Editar</button></div>`).join('');
  Swal.fire({title:'Estados de órdenes',html:`<div>${list}</div><hr><button class="btn primary" onclick="editStatus()">Agregar estado</button>`,showConfirmButton:false,showCloseButton:true});
};
window.editStatus = async (id=null) => { const s=id?state.statuses.find(x=>x.id===id):{}; const html=`${inputHtml('name','Nombre',s?.name)}<label>Color<input id="f_color" type="color" value="${s?.color||'#7c5cff'}"></label>${inputHtml('sort_order','Orden',s?.sort_order||0)}${inputHtml('is_final','Estado final',!!s?.is_final)}`; const {value}=await Swal.fire({title:id?'Editar estado':'Nuevo estado',html,showCancelButton:true,preConfirm:()=>collect(['name','color','sort_order','is_final'])}); if(!value)return; value.sort_order=Number(value.sort_order||0); const res=id?await supa.from('service_order_statuses').update(value).eq('id',id):await supa.from('service_order_statuses').insert(value); if(res.error)return Swal.fire({icon:'error',title:'Error',text:res.error.message}); await Swal.fire({icon:'success',title:'Estado guardado'}); renderOrders(); };
window.viewOrder = async (id) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const {data:hist}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false}); const html=`<div class="detail-card order-detail"><div class="order-num">Orden #${esc(o.satmanager_order||o.order_number)}</div><div class="detail-grid"><p><b>Ingreso</b><span>${fmt(o.received_at)}</span></p><p><b>Estado</b><span>${esc(o.service_order_statuses?.name||'Sin estado')}</span></p><p><b>Solicitante</b><span>${esc(o.requester_name||'-')}</span></p><p><b>Oficina</b><span>${esc(o.office||'-')}</span></p><p><b>Equipo</b><span>${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · ')||'-')}</span></p><p><b>N° serie</b><span>${esc(o.serial_number||'-')}</span></p><p class="full"><b>Falla</b><span>${esc(o.fault_description||'-')}</span></p><p class="full"><b>Informe técnico</b><span>${esc(o.technical_report||'-')}</span></p><p class="full"><b>Solución</b><span>${esc(o.solution||'-')}</span></p></div><h4>Historial</h4><div class="history-list">${(hist||[]).map(h=>`<div><b>${fmt(h.created_at)}</b><span>${esc(h.action)} ${esc(h.previous_value||'')} → ${esc(h.new_value||'')}</span></div>`).join('')||'<small>Sin movimientos registrados.</small>'}</div></div>`; Swal.fire({title:'Detalle de Orden de Servicio',html,width:980,customClass:{popup:'tm-modal'}}); };
window.deleteOrder = async (id) => { const ok=await Swal.fire({icon:'warning',title:'¿Eliminar orden?',showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; const {error}=await supa.from('service_orders').delete().eq('id',id); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); renderOrders(); };
window.printOrder = (id,type) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const title=type==='entrega'?'Constancia de entrega de equipo':'Constancia de ingreso de equipo'; const logo=state.settings.logo_light_url || state.settings.logo_dark_url || ''; const copy=(label)=>`<section class="copy"><div class="rotulo">${logo?`<img src="${esc(logo)}">`:''}<div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box"><b>Orden:</b> ${esc(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${esc(o.service_order_statuses?.name||'')}<br><b>Ingreso original:</b> ${fmt(o.received_at)}<br><b>Solicitante:</b> ${esc(o.requester_name||'')}<br><b>Oficina/Repartición:</b> ${esc(o.office||'')}<br><b>Teléfono:</b> ${esc(o.requester_phone||'')}</div><div class="box"><b>Equipo:</b> ${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '))}<br><b>N° serie:</b> ${esc(o.serial_number||'')}<br><b>Accesorios:</b> ${esc(o.accessories||'')}</div><div class="box"><b>Falla / Informe:</b><br>${esc(type==='entrega'?(o.technical_report||o.solution||o.fault_description):o.fault_description)}</div><p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`; const html=`<html><head><title>${title}</title><style>@page{size:A4;margin:12mm}body{font-family:Arial;margin:0;color:#111}.copy{border-bottom:2px dashed #777;padding:0 0 14px;margin-bottom:16px}.rotulo{display:flex;gap:16px;align-items:center;text-align:left;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px}.rotulo img{max-width:150px;max-height:46px;object-fit:contain}.box{border:1px solid #222;padding:10px;margin:10px 0;font-size:12px;line-height:1.55}h1{font-size:19px;margin:0 0 3px}.firmas{margin-top:28px;font-size:12px}</style></head><body>${copy(`Copia para la Oficina/Repartición: ${esc(o.office||'-')}`)}${copy('Copia para Dirección de Informática - Área Soporte Técnico')}</body></html>`; const w=window.open('','_blank'); w.document.write(html); w.document.close(); w.print(); };
window.makeNote = async (id) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const draft=`A quien corresponda:\n\nPor medio de la presente se solicita la provisión de insumos necesarios para la Orden de Servicio N° ${o.satmanager_order||o.order_number}, correspondiente al equipo ${[o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' / ')} de ${o.office||o.requester_name||'la repartición solicitante'}.\n\nMotivo técnico: ${o.fault_description||'Sin descripción'}.\n\nLa solicitud se realiza a efectos de garantizar la continuidad operativa del soporte técnico institucional.\n\nAtentamente.`; const {value}=await Swal.fire({title:'Nota institucional',html:`<textarea id="noteBody" class="swal2-textarea" style="height:260px">${esc(draft)}</textarea>`,width:900,showCancelButton:true,confirmButtonText:'Guardar nota',preConfirm:()=>$('#noteBody').value}); if(!value)return; const {error}=await supa.from('service_order_notes').insert({service_order_id:id,note_type:'compra',title:'Solicitud de insumos',body:value,created_by:state.user.id}); if(error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); Swal.fire({icon:'success',title:'Nota guardada'}); };
async function renderNotifications(){
  const c=crud.notifications; page(c.title,c.desc);
  const {data,error}=await supa.from('notifications').select('*').order('created_at',{ascending:false});
  if(error) return showPanelError(error);
  const rows=data||[]; state.rows.notifications=rows; state.selected.notifications=new Set();
  const bulk=`<div class="bulkbar notif-tools"><label class="checkline"><input type="checkbox" onchange="toggleAll('notifications',this.checked)"> Seleccionar todo</label><button class="btn" onclick="markSelectedNotifications(true)">Marcar leídas</button><button class="btn" onclick="markSelectedNotifications(false)">Marcar sin leer</button><button class="btn danger" onclick="bulkDelete('notifications')">Eliminar selección</button><span id="sel_notifications">0 seleccionados</span></div>`;
  $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Centro de notificaciones</h2><p>Un clic sobre una notificación sin leer la marca como leída y redirige al módulo correspondiente.</p></div><div class="module-actions"><button class="btn primary" onclick="sendInternalNotification()">Enviar notificación</button><button class="btn" onclick="exportCsv('notifications')">Exportar CSV</button><button class="btn" onclick="exportPdf('notifications')">PDF A4</button></div></div>${bulk}<div class="notification-list">${rows.map(n=>`<article class="notification-card ${n.is_read?'read':'unread'}" data-id="${n.id}"><input type="checkbox" onchange="toggleOne('notifications','${n.id}',this.checked);event.stopPropagation()"><div onclick="openNotification('${n.id}')"><h3>${esc(n.title)}</h3><p>${esc(n.body||'')}</p><small>${fmt(n.created_at)} · ${esc(n.module||'-')}</small></div><button class="badge ${n.is_read?'ok':'warn'}" onclick="toggleNotificationRead('${n.id}',${!n.is_read});event.stopPropagation()">${n.is_read?'Leída':'Sin leer'}</button></article>`).join('')||'<p>Sin notificaciones.</p>'}</div>${bulk}</div>`;
}
window.toggleNotificationRead=async(id,val)=>{ const {error}=await supa.from('notifications').update({is_read:val}).eq('id',id); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); renderNotifications(); };
window.markSelectedNotifications=async(val)=>{ const ids=selectedIds('notifications'); if(!ids.length)return Swal.fire({icon:'info',title:'Sin selección'}); const {error}=await supa.from('notifications').update({is_read:val}).in('id',ids); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); renderNotifications(); };
window.openNotification=async(id)=>{ const n=(state.rows.notifications||[]).find(x=>x.id===id); if(!n)return; if(!n.is_read) await supa.from('notifications').update({is_read:true}).eq('id',id); const moduleMap={orders:'orders','Órdenes de Servicio':'orders',tickets:'tickets','Soporte Ticket':'tickets',inventory:'inventory',Inventario:'inventory',loans:'loans',notifications:'notifications',users:'users',roles:'roles'}; route(moduleMap[n.module]||'dashboard'); };
window.sendInternalNotification=async()=>{ const html=`<div class="swal-grid"><label>Título<input id="f_title"></label><label>Perfil destino<select id="f_target_role">${['SuperAdmin','Admin','Técnicos','Usuarios'].map(x=>`<option value="${x}">${x}</option>`).join('')}</select></label><label>Módulo<select id="f_module">${modules.filter(m=>m[0]!=='logout').map(m=>`<option value="${m[0]}">${m[1]}</option>`).join('')}</select></label><label class="full">Detalle<textarea id="f_body"></textarea></label></div>`; const {value}=await Swal.fire({title:'Enviar notificación interna',html,width:760,showCancelButton:true,confirmButtonText:'Enviar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(['title','target_role','module','body'])}); if(!value)return; value.created_by=state.user.id; value.is_read=false; const {error}=await supa.from('notifications').insert(value); if(error)return Swal.fire({icon:'error',title:'No se pudo enviar',text:error.message}); Swal.fire({icon:'success',title:'Notificación enviada'}); renderNotifications(); };

async function renderSettings(){
  page('Configuraciones','Parámetros institucionales, logos, Telegram y paleta visual.'); const s=state.settings||{};
  $('#content').innerHTML = `<div class="settings-grid"><div class="card"><div class="module-head"><h2>Configuraciones generales</h2><button class="btn primary" onclick="saveSettings()">Guardar ahora</button></div><div class="form">${inputHtml('institution_name','Nombre de la institución',s.institution_name)}${inputHtml('institution_area','Subtítulo / Área',s.institution_area)}${inputHtml('logo_dark_url','Logo modo oscuro URL',s.logo_dark_url)}${inputHtml('logo_light_url','Logo modo claro URL',s.logo_light_url)}<img src="${esc(s.logo_dark_url||'assets/logo.svg')}" style="max-width:240px;background:#0f172a;padding:12px;border-radius:18px" onerror="this.src='assets/logo.svg'"></div></div><div class="card"><h2>Canal de Telegram</h2><div class="form">${inputHtml('telegram_enabled','Enviar copias a Telegram',!!s.telegram_enabled)}${inputHtml('telegram_bot_token','Bot Token',s.telegram_bot_token)}${inputHtml('telegram_chat_id','Chat ID / Canal',s.telegram_chat_id)}</div></div></div><div class="card"><div class="module-head"><h2>Paleta visual de la PWA</h2><button class="btn primary" onclick="saveSettings()">Guardar paleta</button></div><div class="color-grid">${[['primary_color','Primario'],['secondary_color','Secundario'],['accent_color','Acento'],['background_color','Fondo'],['card_color','Tarjetas']].map(([k,l])=>`<label>${l}<input id="f_${k}" type="color" value="${esc(s[k]||'#7c5cff')}"></label>`).join('')}</div></div>`;
}
window.saveSettings = async () => { const fields=['institution_name','institution_area','logo_dark_url','logo_light_url','telegram_enabled','telegram_bot_token','telegram_chat_id','primary_color','secondary_color','accent_color','background_color','card_color']; const data=collect(fields); data.id=1; data.updated_at=new Date().toISOString(); const {error}=await supa.from('app_settings').upsert(data,{onConflict:'id'}); if(error)return Swal.fire({icon:'error',title:'No se pudo guardar configuración',text:error.message}); await loadSettings(); Swal.fire({icon:'success',title:'Configuración guardada'}); renderShell(); route('settings'); };
function renderProfile(){ page('Mi Perfil','Datos personales, rol institucional y foto.'); const p=state.profile; $('#content').innerHTML=`<div class="card"><div class="module-head"><h2>${esc(p.full_name)}</h2><button class="btn primary" onclick="editProfile()">Editar datos</button></div><p><b>Email:</b> ${esc(p.email)}</p><p><b>Perfil:</b> ${esc(p.role_name)}</p><p><b>Oficina:</b> ${esc(p.office||'-')}</p><p><b>Teléfono:</b> ${esc(p.phone||'-')}</p></div>`; }
window.editProfile = async () => { state.rows.users = [state.profile]; await openForm('users', state.profile.id); await loadProfile(); };
async function notify(title, body, module, entity_id){ try { await supa.from('notifications').insert({title, body, module, entity_id, target_role:'SuperAdmin', created_by:state.user?.id}); } catch(_){} }
function showPanelError(e){ $('#content').innerHTML = `<div class="card"><h2>Error de Supabase</h2><p>${esc(e.message||e)}</p><p>Verifique SQL, RLS y perfil activo SuperAdmin.</p></div>`; }
window.exportCsv = (key) => { const rows = state.rows[key] || []; const csv = window.Papa ? Papa.unparse(rows) : JSON.stringify(rows,null,2); download(`${key}.csv`, csv, 'text/csv;charset=utf-8'); };
window.importCsv = (key) => { const input=$('#csvInput'); input.onchange=()=>{ const file=input.files[0]; if(!file)return; Papa.parse(file,{header:true,skipEmptyLines:true,complete:async r=>{try{const table=key==='orders'?'service_orders':crud[key].table; const rows=r.data.map(x=>mapImport(key,x)); const {error}=await supa.from(table).insert(rows); if(error)throw error; await Swal.fire({icon:'success',title:'Importación finalizada',text:`${rows.length} registros importados.`}); route(key);}catch(e){Swal.fire({icon:'error',title:'Error al importar',text:e.message});}}}); }; input.click(); };
function parseSatDate(v){ if(!v) return null; const s=String(v).trim(); const m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}:\d{2}))?/); if(m){let y=m[3].length===2?'20'+m[3]:m[3]; return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}T${m[4]||'00:00'}:00`; } return s; }
function mapImport(key,x){
  if(key!=='orders')return x;
  const get=(...ks)=>{ for(const k of ks){ if(x[k]!==undefined && x[k]!==null && String(x[k]).trim()!=='') return x[k]; } return null; };
  return {
    satmanager_order:get('Orden','orden','IdReparacion','idreparacion','NroOrden','Numero','Número','order','satmanager_order'),
    received_at: parseSatDate(get('Fecha','fecha','FechaIngreso','Ingreso','FecIngreso','received_at')) || undefined,
    imported_at:new Date().toISOString(),
    requester_name:get('Cliente','cliente','Nombre','RazonSocial','Solicitante','requester_name'),
    office:get('Oficina','office','Reparticion','Repartición','Dependencia','Area','Área','Cliente'),
    address:get('Direccion','Dirección','Domicilio','address'),
    requester_phone:get('Telefono','Teléfono','Tel','Celular','requester_phone'),
    equipment_type:get('Tipo de Equipo','TipoEquipo','Equipo','Tipo','equipment_type'),
    brand:get('Marca','marca','brand'),
    model:get('Modelo','modelo','model'),
    serial_number:get('Numero de Serie','Número de Serie','NroSerie','Serie','NSerie','serial_number'),
    accessories:get('Accesorios','accessories'),
    fault_description:get('Falla','Problema','Descripcion','Descripción','FallaDeclarada','fault_description') || 'Importado desde el sistema legado',
    technical_report:get('Informe','InformeTecnico','Reparacion','Solucion','technical_report'),
    observations:get('Observaciones','Notas','observations'),
    source:'SATMANAGER',
    created_by:state.user.id
  };
}
window.exportPdf = (key) => { const rows = state.rows[key] || []; const { jsPDF } = window.jspdf || {}; if(!jsPDF)return Swal.fire({icon:'error',title:'jsPDF no cargado'}); const doc = new jsPDF('l','mm','a4'); const logo = state.settings.logo_dark_url || state.settings.logo_light_url || ''; try{ if(logo) doc.addImage(logo,'PNG',14,8,36,14); }catch(e){} doc.setFontSize(15); doc.text('TICKET MANAGER - Ministerio de Educación Tucumán',55,14); doc.setFontSize(9); doc.text(`Reporte: ${key} · Fecha y hora: ${new Date().toLocaleString('es-AR')} · Usuario: ${state.profile.full_name}`,55,22); doc.setDrawColor(124,92,255); doc.line(14,27,283,27); const cols=Object.keys(rows[0]||{}).filter(k=>!String(rows[0]?.[k]).startsWith('[object')).slice(0,10); if(doc.autoTable) doc.autoTable({head:[cols],body:rows.map(r=>cols.map(c=>String(r[c]??''))),startY:33,styles:{fontSize:7},headStyles:{fillColor:[24,42,75]}}); else doc.text(JSON.stringify(rows,null,2).slice(0,3000),14,35); const h=doc.internal.pageSize.height; doc.setFontSize(8); doc.text('TICKET MANAGER © 2026 Tucumán - Argentina · by Ing. Fernando Gambino',14,h-8); doc.save(`reporte_${key}.pdf`); };
function download(name, data, type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href); }
async function showNotificationPreview(){
  document.querySelector('.notification-popover')?.remove();
  const {data}=await supa.from('notifications').select('*').order('created_at',{ascending:false}).limit(5);
  const box=document.createElement('div'); box.className='notification-popover';
  box.innerHTML=`<div class="np-head"><b>Notificaciones recientes</b><button onclick="route('notifications');document.querySelector('.notification-popover')?.remove()">Historial</button></div>${(data||[]).map(n=>`<div class="np-item"><b>${esc(n.title)}</b><small>${esc(n.body||'')}</small><em>${fmt(n.created_at)}</em></div>`).join('') || '<p>Sin notificaciones.</p>'}`;
  document.body.appendChild(box);
  const b=$('#notifyBtn').getBoundingClientRect(); box.style.top=(b.bottom+10)+'px'; box.style.right=(window.innerWidth-b.right)+'px';
}
function subscribeRealtime(){ ['profiles','roles','inventory_items','loans','support_tickets','service_orders','notifications','app_settings'].forEach(t=>{ supa.channel('rt_'+t).on('postgres_changes',{event:'*',schema:'public',table:t},payload=>{ if(t==='notifications') toast(payload.new?.title||'Notificación',payload.new?.body||''); }).subscribe(); }); }
function toast(t,b){ const div=document.createElement('div'); div.className='toast-note'; div.innerHTML=`<b>${esc(t)}</b><br><small>${esc(b)}</small>`; document.body.appendChild(div); setTimeout(()=>div.remove(),4500); }
window.route = route;


/* ========================= v8.5 institutional fixes =========================
   - contador real de notificaciones
   - header mobile compacto
   - cambio de foto desde header y Mi Perfil
   - limpiar contador
   - constancias con logo visible
   - importador SATMANAGER: CSV/JSON + guía MDB asistida
============================================================================ */
async function loadNotificationCount(){
  try{
    if(!state.user) return;
    const q = supa.from('notifications').select('*',{count:'exact',head:true}).eq('is_read',false);
    // para SuperAdmin cuenta todas; para otros perfiles cuenta global, por rol o usuario
    if(state.profile?.role_name !== 'SuperAdmin'){
      q.or(`target_user.eq.${state.user.id},target_role.eq.${state.profile?.role_name || ''},target_role.is.null`);
    }
    const {count,error}=await q;
    if(error) throw error;
    $$('.notif-badge-count').forEach(b=>{
      const n=count||0; b.textContent=n>99?'99+':String(n); b.hidden=n===0;
    });
  }catch(e){ console.warn('No se pudo actualizar contador', e.message); }
}

function renderShell(){
  const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
  const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
  const mobileMain = [
    ['dashboard','Dashboard',ico.dashboard],
    ['inventory','Inventario',ico.inventory],
    ['orders','Órdenes',ico.orders],
    ['tickets','Tickets',ico.tickets]
  ];
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?'🌙':'☀️'}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
  $('#themeBtn')?.addEventListener('click', () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); });
  $('#fullBtn')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('#notifyBtn')?.addEventListener('click', () => route('notifications'));
  $('#notifyBtn')?.addEventListener('mouseenter', showNotificationPreview);
  $('#notifyBtn')?.addEventListener('mouseleave', () => setTimeout(()=>document.querySelector('.notification-popover')?.remove(), 400));
  $('#avatarBtn')?.addEventListener('click', () => $('#avatarFileInput') ? $('#avatarFileInput').click() : route('profile'));
  $('#avatarFileInput')?.addEventListener('change', handleAvatarFile);
  $('#logoutBtn')?.addEventListener('click', () => route('logout'));
  $('#mobileMoreBtn')?.addEventListener('click', openMobileMenu);
  loadNotificationCount();
}

async function handleAvatarFile(ev){
  const file = ev.target.files?.[0];
  if(!file) return;
  try{
    const dataUrl = await fileToDataUrl(file);
    const {error} = await supa.from('profiles').update({avatar_url:dataUrl,updated_at:new Date().toISOString()}).eq('id',state.profile.id);
    if(error) throw error;
    state.profile.avatar_url = dataUrl;
    await Swal.fire({icon:'success',title:'Foto actualizada',timer:1200,showConfirmButton:false});
    renderShell();
    if(state.page==='profile') renderProfile();
  }catch(e){ Swal.fire({icon:'error',title:'No se pudo actualizar la foto',text:e.message}); }
  ev.target.value='';
}
function fileToDataUrl(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); }); }

function renderProfile(){
  page('Mi Perfil','Datos personales, rol institucional y foto.');
  const p=state.profile; const avatar=p.avatar_url||'assets/avatar-default.svg';
  $('#content').innerHTML=`<div class="profile-layout"><div class="card profile-card-pro"><div class="profile-cover"></div><div class="profile-avatar-wrap"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'" class="profile-avatar-xl"><button class="avatar-change" onclick="document.getElementById('avatarFileInput').click()">Cambiar foto</button></div><h2>${esc(p.full_name||'Usuario')}</h2><span class="profile-pill">${esc(p.role_name||'Usuarios')}</span><div class="profile-data-grid"><p><b>Email</b><span>${esc(p.email||'-')}</span></p><p><b>Oficina/Repartición</b><span>${esc(p.office||'-')}</span></p><p><b>Teléfono</b><span>${esc(p.phone||'-')}</span></p><p><b>Estado</b><span>${p.is_active?'Activo':'Inactivo'}</span></p></div><div class="module-actions center"><button class="btn primary" onclick="editProfile()">Editar datos</button><button class="btn" onclick="document.getElementById('avatarFileInput').click()">Adjuntar nueva foto</button></div></div><div class="card quick-card"><h2>Accesos rápidos</h2><button class="btn" onclick="route('notifications')">Notificaciones</button><button class="btn" onclick="route('inventory')">Inventario</button><button class="btn" onclick="route('orders')">Órdenes de Servicio</button></div></div>`;
}

async function renderNotifications(){
  const c=crud.notifications; page(c.title,c.desc);
  const {data,error}=await supa.from('notifications').select('*').order('created_at',{ascending:false});
  if(error) return showPanelError(error);
  const rows=data||[]; state.rows.notifications=rows; state.selected.notifications=new Set();
  const bulk=`<div class="bulkbar notif-tools"><label class="checkline"><input type="checkbox" onchange="toggleAll('notifications',this.checked)"> Seleccionar todo</label><button class="btn" onclick="markSelectedNotifications(true)">Marcar leídas</button><button class="btn" onclick="markSelectedNotifications(false)">Marcar sin leer</button><button class="btn danger" onclick="bulkDelete('notifications')">Eliminar selección</button><button class="btn" onclick="clearNotificationCounter()">Limpiar contador</button><span id="sel_notifications">0 seleccionados</span></div>`;
  $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Centro de notificaciones</h2><p>Un clic sobre una notificación sin leer la marca como leída y redirige al módulo correspondiente.</p></div><div class="module-actions"><button class="btn primary" onclick="sendInternalNotification()">Enviar notificación</button><button class="btn" onclick="exportCsv('notifications')">Exportar CSV</button><button class="btn" onclick="exportPdf('notifications')">PDF A4</button></div></div>${bulk}<div class="notification-list">${rows.map(n=>`<article class="notification-card ${n.is_read?'read':'unread'}" data-id="${n.id}"><input type="checkbox" onchange="toggleOne('notifications','${n.id}',this.checked);event.stopPropagation()"><div onclick="openNotification('${n.id}')"><h3>${esc(n.title)}</h3><p>${esc(n.body||'')}</p><small>${fmt(n.created_at)} · ${esc(n.module||'-')}</small></div><button class="badge ${n.is_read?'ok':'warn'}" onclick="toggleNotificationRead('${n.id}',${!n.is_read});event.stopPropagation()">${n.is_read?'Leída':'Sin leer'}</button></article>`).join('')||'<p>Sin notificaciones.</p>'}</div>${bulk}</div>`;
  loadNotificationCount();
}
window.clearNotificationCounter = async()=>{
  const ok=await Swal.fire({icon:'question',title:'Limpiar contador',text:'Se marcarán todas las notificaciones como leídas.',showCancelButton:true,confirmButtonText:'Limpiar'});
  if(!ok.isConfirmed) return;
  const {error}=await supa.from('notifications').update({is_read:true}).eq('is_read',false);
  if(error) return Swal.fire({icon:'error',title:'No se pudo limpiar',text:error.message});
  await loadNotificationCount();
  if(state.page==='notifications') renderNotifications();
};
window.toggleNotificationRead=async(id,val)=>{ const {error}=await supa.from('notifications').update({is_read:val}).eq('id',id); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); await loadNotificationCount(); renderNotifications(); };
window.markSelectedNotifications=async(val)=>{ const ids=selectedIds('notifications'); if(!ids.length)return Swal.fire({icon:'info',title:'Sin selección'}); const {error}=await supa.from('notifications').update({is_read:val}).in('id',ids); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); await loadNotificationCount(); renderNotifications(); };
window.openNotification=async(id)=>{ const n=(state.rows.notifications||[]).find(x=>x.id===id); if(!n)return; if(!n.is_read) await supa.from('notifications').update({is_read:true}).eq('id',id); await loadNotificationCount(); const moduleMap={orders:'orders','Órdenes de Servicio':'orders','Ordenes de Servicio':'orders',tickets:'tickets','Soporte Ticket':'tickets',inventory:'inventory',Inventario:'inventory',loans:'loans',notifications:'notifications',users:'users',roles:'roles'}; route(moduleMap[n.module]||'dashboard'); };

window.exportPdf = (key) => {
  const rows = state.rows[key] || []; const { jsPDF } = window.jspdf || {}; if(!jsPDF)return Swal.fire({icon:'error',title:'jsPDF no cargado'});
  const doc = new jsPDF('l','mm','a4');
  doc.setFillColor(8,17,31); doc.roundedRect(12,8,42,18,3,3,'F'); doc.setTextColor(255,255,255); doc.setFontSize(7); doc.text('Ministerio de',16,15); doc.text('Educación Tucumán',16,19);
  doc.setTextColor(10,18,32); doc.setFontSize(15); doc.text('TICKET MANAGER - Ministerio de Educación Tucumán',60,15); doc.setFontSize(9); doc.text(`Reporte: ${key} · Fecha y hora: ${new Date().toLocaleString('es-AR')} · Usuario: ${state.profile.full_name}`,60,23); doc.setDrawColor(124,92,255); doc.line(14,30,283,30);
  const cols=Object.keys(rows[0]||{}).filter(k=>!String(rows[0]?.[k]).startsWith('[object')).slice(0,10);
  if(doc.autoTable) doc.autoTable({head:[cols],body:rows.map(r=>cols.map(c=>String(r[c]??''))),startY:36,styles:{fontSize:7},headStyles:{fillColor:[24,42,75]}}); else doc.text(JSON.stringify(rows,null,2).slice(0,3000),14,38);
  const h=doc.internal.pageSize.height; doc.setFontSize(8); doc.text('TICKET MANAGER © 2026 Tucumán - Argentina · by Ing. Fernando Gambino',14,h-8); doc.save(`reporte_${key}.pdf`);
};

window.printOrder = (id,type) => {
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o) return;
  const title=type==='entrega'?'Constancia de entrega de equipo':'Constancia de ingreso de equipo';
  const logo=state.settings.logo_dark_url || state.settings.logo_light_url || '';
  const copy=(label)=>`<section class="copy"><div class="rotulo"><div class="logoBox">${logo?`<img src="${esc(logo)}" onerror="this.parentElement.innerHTML='<b>Ministerio de Educación Tucumán</b>'">`:'<b>Ministerio de Educación Tucumán</b>'}</div><div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box"><b>Orden:</b> ${esc(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${esc(o.service_order_statuses?.name||'')}<br><b>Ingreso original:</b> ${fmt(o.received_at)}<br><b>Solicitante:</b> ${esc(o.requester_name||'')}<br><b>Oficina/Repartición:</b> ${esc(o.office||'')}<br><b>Teléfono:</b> ${esc(o.requester_phone||'')}</div><div class="box"><b>Equipo:</b> ${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '))}<br><b>N° serie:</b> ${esc(o.serial_number||'')}<br><b>Accesorios:</b> ${esc(o.accessories||'')}</div><div class="box"><b>Falla / Informe:</b><br>${esc(type==='entrega'?(o.technical_report||o.solution||o.fault_description):o.fault_description)}</div><p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`;
  const html=`<html><head><title>${title}</title><style>@page{size:A4;margin:12mm}body{font-family:Arial;margin:0;color:#111}.copy{border-bottom:2px dashed #777;padding:0 0 14px;margin-bottom:16px}.rotulo{display:flex;gap:16px;align-items:center;text-align:left;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px}.logoBox{width:170px;min-height:54px;border-radius:8px;background:#0f172a;display:flex;align-items:center;justify-content:center;color:white;padding:8px}.logoBox img{max-width:155px;max-height:42px;object-fit:contain}.box{border:1px solid #222;padding:10px;margin:10px 0;font-size:12px;line-height:1.55}h1{font-size:19px;margin:0 0 3px}.firmas{margin-top:28px;font-size:12px}</style></head><body>${copy(`Copia para la Oficina/Repartición: ${esc(o.office||'-')}`)}${copy('Copia para Dirección de Informática - Área Soporte Técnico')}</body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400);
};

window.importCsv = (key) => {
  const input=$('#csvInput'); input.accept = key==='orders' ? '.csv,.json,.mdb,.MDB' : '.csv,.json';
  input.onchange=async()=>{ const file=input.files[0]; if(!file)return; const name=file.name.toLowerCase();
    try{
      if(name.endsWith('.mdb')){
        await Swal.fire({icon:'info',title:'Importación MDB asistida',html:'El navegador no puede leer directamente tablas Microsoft Access por seguridad. Esta versión acepta el archivo .MDB y deja incluido el conversor profesional <b>tools/mdb_to_csv.py</b> para generar CSV/JSON manteniendo nombres de tablas y columnas SATMANAGER. Luego importá el CSV/JSON generado desde este mismo botón.',width:760});
        input.value=''; return;
      }
      if(name.endsWith('.json')){
        const text=await file.text(); const parsed=JSON.parse(text); const rows=Array.isArray(parsed)?parsed:(parsed.rows||parsed.reparaciones||[]); return await importRows(key, rows);
      }
      Papa.parse(file,{header:true,skipEmptyLines:true,complete:async r=>{ await importRows(key,r.data); }});
    }catch(e){ Swal.fire({icon:'error',title:'Error al importar',text:e.message}); }
    finally{ input.value=''; }
  }; input.click();
};
async function importRows(key, rawRows){
  const table=key==='orders'?'service_orders':crud[key].table; const rows=(rawRows||[]).map(x=>mapImport(key,x));
  const {error}=await supa.from(table).insert(rows); if(error)throw error;
  await Swal.fire({icon:'success',title:'Importación finalizada',text:`${rows.length} registros importados.`}); route(key);
}

function subscribeRealtime(){
  ['profiles','roles','inventory_items','loans','support_tickets','service_orders','notifications','app_settings'].forEach(t=>{
    supa.channel('rt_'+t).on('postgres_changes',{event:'*',schema:'public',table:t},payload=>{
      if(t==='notifications'){ loadNotificationCount(); toast(payload.new?.title||'Notificación',payload.new?.body||''); }
      if(t===state.page || (t==='service_orders' && state.page==='orders')) route(state.page);
    }).subscribe();
  });
  loadNotificationCount();
}



/* ========================= v8.6 requested fixes =========================
   - seleccionar todo funcional en Notificaciones y todos los módulos
   - importador SATMANAGER enriquecido: técnico, códigos y oficina/cliente
   - menú lateral colapsable con clic en logo
   - orden de servicio con más datos del sistema legado
============================================================================ */
function toggleSidebarCollapse(){
  document.querySelector('.layout')?.classList.toggle('sidebar-collapsed');
  document.querySelector('.sidebar')?.classList.toggle('is-collapsed');
}
window.toggleSidebarCollapse = toggleSidebarCollapse;

window.toggleAll = (key, checked) => {
  state.selected[key] = new Set();
  const scope = document.getElementById('content') || document;
  const selectors = [
    '#rowsBody tr',
    '.notification-card[data-id]',
    'table tbody tr[data-id]'
  ];
  selectors.flatMap(sel => Array.from(scope.querySelectorAll(sel))).forEach(el=>{
    const id = el.dataset.id;
    const cb = el.querySelector('input[type="checkbox"]');
    if(cb){ cb.checked = checked; }
    if(checked && id) state.selected[key].add(id);
  });
  scope.querySelectorAll('.bulkbar input[type="checkbox"]').forEach(cb=>{ cb.checked = checked; });
  updateSelectedCount(key);
};

function normalizeSatDate(v){
  if(!v) return null;
  const s=String(v).trim();
  if(!s || s.toLowerCase()==='nan') return null;
  if(/^\d{4}-\d{2}-\d{2}/.test(s)) return s;
  const m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}:\d{2})(?::\d{2})?)?/);
  if(m){ let y=m[3].length===2 ? (Number(m[3])>40?'19':'20')+m[3] : m[3]; return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}T${m[4]||'12:00'}:00`; }
  return s;
}
function satGet(x,...ks){
  const norm = {}; Object.keys(x||{}).forEach(k=>norm[String(k).toLowerCase().replace(/[\s_\.áéíóúñ]/g,'')] = x[k]);
  for(const k of ks){
    if(x?.[k]!==undefined && x?.[k]!==null && String(x[k]).trim()!=='' && String(x[k]).toLowerCase()!=='nan') return x[k];
    const nk=String(k).toLowerCase().replace(/[\s_\.áéíóúñ]/g,'');
    if(norm[nk]!==undefined && norm[nk]!==null && String(norm[nk]).trim()!=='' && String(norm[nk]).toLowerCase()!=='nan') return norm[nk];
  }
  return null;
}
function stripMoneyNotes(v){ return String(v||'').replace(/\s*\|?\s*(Costo mano de obra original|Entrega original|Repuestos).*$/i,'').trim(); }
function mapImport(key,x){
  if(key!=='orders') return x;
  let raw = x.satmanager_raw;
  try{ if(typeof raw==='string') raw=JSON.parse(raw); }catch(_){ raw=null; }
  const r = raw && typeof raw==='object' ? {...raw, ...x} : x;
  const technician = satGet(r,'tecnico','Técnico','Tecnico','TecnicosNombre','TecnicoNombre','NombreTecnico','ReparacionesTecnico','technician_name');
  const order = satGet(r,'satmanager_order','Orden','orden','ReparacionesCodigo','IdReparacion','NroOrden','Numero','Número');
  const cliente = satGet(r,'Cliente','cliente','ClientesNombre','ClienteNombre','requester_name','Solicitante');
  const oficina = satGet(r,'office','Oficina','Reparticion','Repartición','Dependencia','Area','Área','Cliente','cliente','ClientesNombre','ClienteNombre','requester_name');
  const fecha = normalizeSatDate(satGet(r,'received_at','Fecha','fecha','ReparacionesFecha','FechaIngreso','Ingreso','FecIngreso'));
  const fin = normalizeSatDate(satGet(r,'finished_at','ReparacionesFechaTerminada','FechaTerminada','Terminada'));
  const entregada = normalizeSatDate(satGet(r,'delivered_at','ReparacionesFechaEntregado','FechaEntregado','Entregado','FechaEntrega'));
  const obsBase = stripMoneyNotes(satGet(r,'observations','Observaciones','Notas','notes'));
  const obs = [technician?`Profesional técnico: ${technician}`:'', obsBase].filter(Boolean).join(' | ');
  return {
    satmanager_order: order,
    satmanager_table: satGet(r,'satmanager_table') || 'REPARACIONES',
    satmanager_cliente_codigo: satGet(r,'ClientesCodigo','ClienteCodigo','client_code'),
    satmanager_equipo_codigo: satGet(r,'EquiposCodigo','EquipoCodigo','equipment_code'),
    satmanager_tecnico_codigo: satGet(r,'TecnicosCodigo','TecnicoCodigo','technician_code'),
    technician_name: technician,
    received_at: fecha || undefined,
    finished_at: fin || null,
    delivered_at: entregada || null,
    imported_at:new Date().toISOString(),
    requester_name: cliente,
    requester_email:satGet(r,'Email','email','requester_email'),
    requester_phone:satGet(r,'Telefono','Teléfono','Tel','Celular','requester_phone'),
    office: oficina,
    address:satGet(r,'Direccion','Dirección','Domicilio','address'),
    equipment_type:satGet(r,'Tipo de Equipo','TipoEquipo','TipoEquiposNombre','Equipo','Tipo','equipment_type'),
    brand:satGet(r,'Marca','marca','MarcasNombre','brand'),
    model:satGet(r,'Modelo','modelo','ModelosNombre','model'),
    serial_number:satGet(r,'Numero de Serie','Número de Serie','NroSerie','Serie','NSerie','EquiposNumeroSerie','serial_number'),
    accessories:satGet(r,'Accesorios','ReparacionesAccesorios','accessories'),
    fault_description:satGet(r,'Falla','ReparacionesFalla','Problema','Descripcion','Descripción','FallaDeclarada','fault_description') || 'Importado desde el sistema legado',
    technical_report:satGet(r,'Informe','ReparacionesInformeTecnico','InformeTecnico','Reparacion','technical_report'),
    diagnosis:satGet(r,'Diagnostico','Diagnóstico','diagnosis'),
    solution:satGet(r,'Solucion','Solución','solution'),
    observations: obs || null,
    priority:satGet(r,'priority','Prioridad') || 'Media',
    source:'SATMANAGER',
    satmanager_raw: raw || r,
    created_by:state.user?.id || null
  };
}

function orderRow(o){
  const st=o.service_order_statuses||{};
  const tech=o.technician_name || (String(o.observations||'').match(/Profesional técnico:\s*([^|]+)/)||[])[1] || '';
  const oficina=o.office || o.requester_name || '-';
  return `<tr data-id="${o.id}" data-search="${esc(Object.values(o).join(' ').toLowerCase())}"><td class="select-col"><input type="checkbox" onchange="toggleOne('orders','${o.id}',this.checked)"></td><td><b>#${esc(o.satmanager_order || o.order_number)}</b>${o.satmanager_tecnico_codigo?`<br><small>Téc. cód.: ${esc(o.satmanager_tecnico_codigo)}</small>`:''}</td><td>${fmt(o.received_at)}${o.imported_at?`<br><small>Importado: ${fmt(o.imported_at)}</small>`:''}</td><td>${esc(oficina)}<br><small>${esc(o.address||'')}</small></td><td>${esc(tech||'-')}</td><td>${esc([o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' · '))}</td><td>${esc(o.fault_description||'-')}</td><td><span class="badge" style="color:${esc(st.color||'#94a3b8')}">${esc(st.name||'Sin estado')}</span></td><td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewOrder('${o.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openOrder('${o.id}')">${ico.edit}</button><button class="icon-mini" title="Ingreso" onclick="printOrder('${o.id}','ingreso')">${ico.print}</button><button class="icon-mini" title="Entrega" onclick="printOrder('${o.id}','entrega')">${ico.print}</button><button class="icon-mini" title="Nota" onclick="makeNote('${o.id}')">✍</button><button class="icon-mini danger" title="Eliminar" onclick="deleteOrder('${o.id}')">${ico.trash}</button></td></tr>`;
}

window.viewOrder = async(id)=>{
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o)return;
  const tech=o.technician_name || (String(o.observations||'').match(/Profesional técnico:\s*([^|]+)/)||[])[1] || '-';
  const {data:hist}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false});
  const html=`<div class="detail-card order-detail"><h3>Orden #${esc(o.satmanager_order||o.order_number)}</h3><div class="detail-grid"><p><b>Ingreso original</b><span>${fmt(o.received_at)}</span></p><p><b>Estado</b><span>${esc(o.service_order_statuses?.name||'Sin estado')}</span></p><p><b>Oficina/Repartición</b><span>${esc(o.office||o.requester_name||'-')}</span></p><p><b>Solicitante</b><span>${esc(o.requester_name||'-')}</span></p><p><b>Profesional Técnico</b><span>${esc(tech)}</span></p><p><b>Dirección</b><span>${esc(o.address||'-')}</span></p><p><b>Equipo</b><span>${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · ')||'-')}</span></p><p><b>N° serie</b><span>${esc(o.serial_number||'-')}</span></p><p><b>Accesorios</b><span>${esc(o.accessories||'-')}</span></p><p><b>Tabla origen</b><span>${esc(o.satmanager_table||'REPARACIONES')}</span></p><p class="full"><b>Falla</b><span>${esc(o.fault_description||'-')}</span></p><p class="full"><b>Informe técnico</b><span>${esc(o.technical_report||'-')}</span></p><p class="full"><b>Solución / Observaciones</b><span>${esc(o.solution||o.observations||'-')}</span></p></div><h4>Historial</h4>${(hist||[]).map(h=>`<p class="history-line"><b>${fmt(h.created_at)}</b> · ${esc(h.action)} ${h.previous_value?`<small>${esc(h.previous_value)} → ${esc(h.new_value||'')}</small>`:''}</p>`).join('') || '<p>Sin movimientos registrados.</p>'}</div>`;
  Swal.fire({title:'Detalle de Orden de Servicio',html,width:980,customClass:{popup:'tm-modal'}});
};

window.openOrder = async(id=null)=>{
  await loadStatuses();
  const o=id?(state.rows.orders||[]).find(x=>x.id===id):{};
  const statusSelect=`<label>Estado<select id="f_status_id"><option value="">Sin estado</option>${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const html=`<div class="tm-form order-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.orders}</div><p>${id?'Actualizar trazabilidad técnica, estado e informe de la orden.':'Registrar una nueva orden técnica institucional.'}</p></div><div class="swal-grid">${statusSelect}${inputHtml('satmanager_order','Nº Orden',o?.satmanager_order)}${inputHtml('technician_name','Técnico que atiende',o?.technician_name)}${inputHtml('requester_name','Solicitante / Cliente',o?.requester_name)}${inputHtml('office','Oficina/Repartición',o?.office)}${inputHtml('requester_phone','Teléfono',o?.requester_phone)}${inputHtml('requester_email','Email',o?.requester_email)}${inputHtml('address','Dirección',o?.address)}${inputHtml('equipment_type','Tipo de equipo',o?.equipment_type)}${inputHtml('brand','Marca',o?.brand)}${inputHtml('model','Modelo',o?.model)}${inputHtml('serial_number','N° de serie',o?.serial_number)}${inputHtml('priority','Prioridad',o?.priority||'Media')}${inputHtml('accessories','Accesorios',o?.accessories)}${inputHtml('fault_description','Falla declarada',o?.fault_description)}${inputHtml('technical_report','Informe técnico',o?.technical_report)}${inputHtml('solution','Solución / Observaciones',o?.solution)}</div></div>`;
  const fields=['status_id','satmanager_order','technician_name','requester_name','office','requester_phone','requester_email','address','equipment_type','brand','model','serial_number','priority','accessories','fault_description','technical_report','solution'];
  const {value}=await Swal.fire({title:id?'Editar orden de servicio':'Nueva orden de servicio',html,width:920,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(fields)});
  if(!value)return;
  try{ value.updated_by=state.user.id; if(!id)value.created_by=state.user.id; if(!value.fault_description)value.fault_description='Sin descripción'; const res=id?await supa.from('service_orders').update(value).eq('id',id):await supa.from('service_orders').insert(value).select('id').single(); if(res.error)throw res.error; await notify(`${id?'Actualización':'Nueva'} Orden de Servicio`,`Se registró la Orden Nº ${value.satmanager_order || ''} - Estado actualizado.`, 'orders', id||res.data?.id); await Swal.fire({icon:'success',title:'Orden guardada'}); renderOrders(); }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
};

function renderShell(){
  const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
  const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
  const mobileMain = [['dashboard','Dashboard',ico.dashboard],['inventory','Inventario',ico.inventory],['orders','Órdenes',ico.orders],['tickets','Tickets',ico.tickets]];
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?'🌙':'☀️'}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  document.querySelector('.brand')?.addEventListener('click', toggleSidebarCollapse);
  $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
  $('#themeBtn')?.addEventListener('click', () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); });
  $('#fullBtn')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('#notifyBtn')?.addEventListener('click', () => route('notifications'));
  $('#notifyBtn')?.addEventListener('mouseenter', showNotificationPreview);
  $('#notifyBtn')?.addEventListener('mouseleave', () => setTimeout(()=>document.querySelector('.notification-popover')?.remove(), 400));
  $('#avatarBtn')?.addEventListener('click', () => $('#avatarFileInput') ? $('#avatarFileInput').click() : route('profile'));
  $('#avatarFileInput')?.addEventListener('change', handleAvatarFile);
  $('#logoutBtn')?.addEventListener('click', () => route('logout'));
  $('#mobileMoreBtn')?.addEventListener('click', openMobileMenu);
  loadNotificationCount();
}



/* ========================= v8.7 service orders / technicians / offices fixes ========================= */
function normText(v){ return String(v||'').trim(); }
function extractTechFromOrder(o){ return o?.technician_name || o?.professional_technician || (String(o?.observations||'').match(/Profesional técnico:\s*([^|]+)/i)||[])[1] || ''; }
async function loadTechnicianOptions(){
  const names=new Set();
  try{ const {data}=await supa.from('profiles').select('full_name,email,role_name,is_active').in('role_name',['Técnicos','Admin','SuperAdmin']).eq('is_active',true); (data||[]).forEach(p=>p.full_name&&names.add(p.full_name)); }catch(e){}
  try{ const {data}=await supa.from('satmanager_tecnicos').select('nombre,tecnico').limit(1000); (data||[]).forEach(t=>names.add(t.nombre||t.tecnico)); }catch(e){}
  try{ const {data}=await supa.from('service_orders').select('technician_name,observations').not('technician_name','is',null).limit(2000); (data||[]).forEach(o=>{ const n=extractTechFromOrder(o); if(n) names.add(n); }); }catch(e){}
  return Array.from(names).filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'));
}
async function loadOfficeOptions(){
  const names=new Set();
  try{ const {data}=await supa.from('offices').select('name').limit(2000); (data||[]).forEach(o=>o.name&&names.add(o.name)); }catch(e){}
  try{ const {data}=await supa.from('service_orders').select('office,requester_name,address').limit(3000); (data||[]).forEach(o=>{ if(o.office) names.add(o.office); if(o.requester_name) names.add(o.requester_name); }); }catch(e){}
  return Array.from(names).filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'));
}
function selectHtml(id,label,options,value,extra=''){
  const val=normText(value);
  const opts=[...new Set([val,...(options||[])].filter(Boolean))];
  return `<label>${esc(label)}<select id="f_${id}" ${extra}>${opts.map(x=>`<option value="${esc(x)}" ${x===val?'selected':''}>${esc(x)}</option>`).join('')}<option value="__manual__">+ Agregar / escribir otro...</option></select></label>`;
}
function fieldOrRaw(o, key, ...rawKeys){
  if(o?.[key]!==undefined && o?.[key]!==null && String(o[key]).trim()!=='') return o[key];
  const raw = typeof o?.satmanager_raw==='string' ? (()=>{try{return JSON.parse(o.satmanager_raw)}catch(_){return {}}})() : (o?.satmanager_raw||{});
  return satGet(raw, ...rawKeys) || '';
}

async function syncImportedCatalogs(rows){
  const offices=new Map(); const techs=new Map();
  (rows||[]).forEach(o=>{
    const office=normText(o.office||o.requester_name); if(office) offices.set(office,{name:office,address:o.address||null,phone:o.requester_phone||null,source:'SATMANAGER'});
    const tech=normText(o.technician_name||extractTechFromOrder(o)); if(tech) techs.set(tech,{nombre:tech,codigo:o.satmanager_tecnico_codigo||null,source:'SATMANAGER'});
  });
  try{ if(offices.size) await supa.from('offices').upsert(Array.from(offices.values()),{onConflict:'name'}); }catch(e){}
  try{ if(techs.size) await supa.from('satmanager_tecnicos').upsert(Array.from(techs.values()),{onConflict:'nombre'}); }catch(e){}
}

const __origMapImport_v87 = mapImport;
mapImport = function(key,x){
  if(key!=='orders') return __origMapImport_v87(key,x);
  let y = __origMapImport_v87(key,x);
  let raw = y.satmanager_raw;
  try{ if(typeof raw==='string') raw=JSON.parse(raw); }catch(_){ raw=null; }
  const r = raw && typeof raw==='object' ? {...raw, ...x} : {...x};
  const tech = satGet(r,'technician_name','Tecnico','Técnico','TecnicosNombre','NombreTecnico','TecnicosNombreCompleto','TecnicosApellidoNombre') || extractTechFromOrder(y);
  const cliente = satGet(r,'requester_name','Cliente','cliente','ClientesNombre','ClienteNombre','ClientesRazonSocial');
  y.technician_name = tech || y.technician_name || null;
  y.office = satGet(r,'office','Oficina','Reparticion','Repartición','Dependencia','Secretaria','Secretaría','Area','Área') || cliente || y.office || y.requester_name;
  y.requester_name = cliente || y.requester_name || y.office;
  y.address = satGet(r,'address','Direccion','Dirección','ClientesDireccion','Domicilio') || y.address;
  y.requester_phone = satGet(r,'requester_phone','Telefono','Teléfono','ClientesTelefono','Tel','Celular') || y.requester_phone;
  y.satmanager_order = satGet(r,'satmanager_order','ReparacionesCodigo','Orden','orden','NroOrden','Numero') || y.satmanager_order;
  y.satmanager_tecnico_codigo = satGet(r,'satmanager_tecnico_codigo','TecnicosCodigo','TecnicoCodigo') || y.satmanager_tecnico_codigo;
  y.satmanager_cliente_codigo = satGet(r,'satmanager_cliente_codigo','ClientesCodigo','ClienteCodigo') || y.satmanager_cliente_codigo;
  y.satmanager_equipo_codigo = satGet(r,'satmanager_equipo_codigo','EquiposCodigo','EquipoCodigo') || y.satmanager_equipo_codigo;
  return y;
};

async function importRows(key, rawRows){
  const table=key==='orders'?'service_orders':crud[key].table; const rows=(rawRows||[]).map(x=>mapImport(key,x));
  if(key==='orders') await syncImportedCatalogs(rows);
  const {error}=await supa.from(table).insert(rows);
  if(error)throw error;
  await Swal.fire({icon:'success',title:'Importación finalizada',text:`${rows.length} registros importados.`});
  route(key);
}

function orderRow(o){
  const st=o.service_order_statuses||{};
  const tech=extractTechFromOrder(o) || '-';
  const oficina=o.office || o.requester_name || '-';
  return `<tr data-id="${o.id}" data-search="${esc(Object.values(o).join(' ').toLowerCase())}">
    <td class="select-col"><input type="checkbox" onchange="toggleOne('orders','${o.id}',this.checked)"></td>
    <td><b>#${esc(o.satmanager_order || o.order_number)}</b>${o.satmanager_tecnico_codigo?`<br><small>Téc. cód.: ${esc(o.satmanager_tecnico_codigo)}</small>`:''}</td>
    <td>${fmt(o.received_at || o.original_received_at)}${o.imported_at?`<br><small>Importado: ${fmt(o.imported_at)}</small>`:''}</td>
    <td>${esc(oficina)}<br><small>${esc(o.address||'')}</small></td>
    <td>${esc(tech)}</td>
    <td>${esc([o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' · '))}</td>
    <td>${esc(o.fault_description||'-')}</td>
    <td><span class="badge" style="color:${esc(st.color||'#94a3b8')}">${esc(st.name||'Sin estado')}</span></td>
    <td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewOrder('${o.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openOrder('${o.id}')">${ico.edit}</button><button class="icon-mini" title="Ingreso" onclick="printOrder('${o.id}','ingreso')">${ico.print}</button><button class="icon-mini" title="Entrega" onclick="printOrder('${o.id}','entrega')">${ico.print}</button><button class="icon-mini" title="Nota" onclick="makeNote('${o.id}')">✍</button><button class="icon-mini danger" title="Eliminar" onclick="deleteOrder('${o.id}')">${ico.trash}</button></td>
  </tr>`;
}

async function renderOrders(){
  page('Órdenes de Servicio','Trazabilidad técnica institucional, sin importes ni conceptos comerciales.');
  await loadStatuses();
  const { data, error } = await supa.from('service_orders').select('*, service_order_statuses(name,color)').order('received_at',{ascending:false});
  if (error) return showPanelError(error);
  const rows = data || []; state.rows.orders = rows; state.selected.orders = new Set();
  const pg = state.pagination.orders || {page:1,size:10};
  const total = rows.length; const pages = Math.max(1, Math.ceil(total/pg.size)); if(pg.page>pages)pg.page=pages;
  const start = (pg.page-1)*pg.size; const pageRows = rows.slice(start,start+pg.size);
  const pager = `<div class="pager"><label>Listar <select onchange="setOrderPageSize(this.value)">${[5,10,25,50,100,500].map(n=>`<option value="${n}" ${pg.size==n?'selected':''}>${n}</option>`).join('')}</select></label><div><button class="btn" ${pg.page<=1?'disabled':''} onclick="changeOrderPage(-1)">← Atrás</button><span>Página ${pg.page} de ${pages} · ${total} registros</span><button class="btn" ${pg.page>=pages?'disabled':''} onclick="changeOrderPage(1)">Siguiente →</button></div></div>`;
  const bulk = `<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('orders',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEditOrders()">Cambiar estado</button><button class="btn danger" onclick="bulkDelete('orders')">Eliminar selección</button><span id="sel_orders">0 seleccionados</span></div>`;
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>Órdenes técnicas</h2><p>Registro de ingreso, profesional técnico, oficina/repartición, estados, informe técnico, insumos utilizados, notas y entrega.</p></div><div class="module-actions"><button class="btn primary" onclick="openOrder()">Nueva orden</button><button class="btn" onclick="openStatusManager()">Estados</button><button class="btn" onclick="importCsv('orders')">Importar SATMANAGER CSV/MDB</button><button class="btn" onclick="exportCsv('orders')">Exportar CSV</button><button class="btn" onclick="exportPdf('orders')">PDF A4</button></div></div><input class="search" placeholder="Buscar por orden, técnico, oficina, equipo, marca, modelo, serie o falla..." oninput="filterRows(this.value)">${pager}${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th><th>Orden</th><th>Ingreso original</th><th>Oficina/Repartición</th><th>Profesional Técnico</th><th>Equipo</th><th>Falla / Diagnóstico</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${pageRows.map(orderRow).join('')}</tbody></table></div>${bulk}${pager}</div>`;
}
window.renderOrders = renderOrders;

window.openOrder = async(id=null)=>{
  await loadStatuses();
  const o=id?(state.rows.orders||[]).find(x=>x.id===id):{};
  const techOptions=await loadTechnicianOptions();
  const officeOptions=await loadOfficeOptions();
  const statusSelect=`<label>Estado<select id="f_status_id"><option value="">Sin estado</option>${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const techSelect=selectHtml('technician_name','Profesional técnico que atiende',techOptions,extractTechFromOrder(o),`onchange="if(this.value==='__manual__'){this.outerHTML='<input id=\'f_technician_name\' placeholder=\'Nombre del profesional técnico\'>'}"`);
  const officeSelect=selectHtml('office','Oficina / Repartición / Secretaría',officeOptions,o?.office||o?.requester_name,`onchange="if(this.value==='__manual__'){this.outerHTML='<input id=\'f_office\' placeholder=\'Nombre de oficina/repartición\'>'}"`);
  const html=`<div class="tm-form order-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.orders}</div><p>${id?'Actualizar trazabilidad técnica, estado e informe de la orden.':'Registrar una nueva orden técnica institucional.'}</p></div><div class="swal-grid">${statusSelect}${inputHtml('satmanager_order','Nº Orden',o?.satmanager_order)}${techSelect}${inputHtml('requester_name','Solicitante / Referente',o?.requester_name)}${officeSelect}${inputHtml('requester_phone','Teléfono',o?.requester_phone)}${inputHtml('requester_email','Email',o?.requester_email)}${inputHtml('address','Dirección',o?.address)}${inputHtml('equipment_type','Tipo de equipo',o?.equipment_type)}${inputHtml('brand','Marca',o?.brand)}${inputHtml('model','Modelo',o?.model)}${inputHtml('serial_number','N° de serie',o?.serial_number)}${inputHtml('priority','Prioridad',o?.priority||'Media')}${inputHtml('accessories','Accesorios / Insumos asociados',o?.accessories)}${inputHtml('fault_description','Falla / Diagnóstico',o?.fault_description)}${inputHtml('technical_report','Informe técnico',o?.technical_report)}${inputHtml('solution','Solución / Observaciones',o?.solution||o?.observations)}</div></div>`;
  const fields=['status_id','satmanager_order','technician_name','requester_name','office','requester_phone','requester_email','address','equipment_type','brand','model','serial_number','priority','accessories','fault_description','technical_report','solution'];
  const oldStatus=o?.status_id||null;
  const {value}=await Swal.fire({title:id?'Editar orden de servicio':'Nueva orden de servicio',html,width:980,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(fields)});
  if(!value)return;
  if(value.technician_name==='__manual__') value.technician_name=null;
  if(value.office==='__manual__') value.office=null;
  try{
    value.updated_by=state.user.id; if(!id)value.created_by=state.user.id; if(!value.fault_description)value.fault_description='Sin descripción';
    const res=id?await supa.from('service_orders').update(value).eq('id',id).select('id,status_id').single():await supa.from('service_orders').insert(value).select('id,status_id').single();
    if(res.error)throw res.error;
    const oid=id||res.data?.id;
    if(value.office){ try{ await supa.from('offices').upsert({name:value.office,address:value.address||null,phone:value.requester_phone||null,source:'PWA'},{onConflict:'name'}); }catch(_){ } }
    if(value.technician_name){ try{ await supa.from('satmanager_tecnicos').upsert({nombre:value.technician_name,source:'PWA'},{onConflict:'nombre'}); }catch(_){ } }
    if(id && oldStatus!==value.status_id){ await supa.from('service_order_history').insert({service_order_id:id,action:'Cambio de estado',previous_value:oldStatus,new_value:value.status_id,user_id:state.user.id}); }
    await notify(`${id?'Actualización':'Nueva'} Orden de Servicio`,`Orden Nº ${value.satmanager_order || ''} · Técnico: ${value.technician_name||'-'} · Oficina: ${value.office||'-'}`, 'orders', oid);
    await Swal.fire({icon:'success',title:'Orden guardada'}); renderOrders();
  }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
};

window.viewOrder = async(id)=>{
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o)return;
  const tech=extractTechFromOrder(o) || '-';
  const {data:hist}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false});
  const html=`<div class="detail-card order-detail"><h3>Orden #${esc(o.satmanager_order||o.order_number)}</h3><div class="detail-grid"><p><b>Ingreso original</b><span>${fmt(o.received_at||o.original_received_at)}</span></p><p><b>Estado</b><span>${esc(o.service_order_statuses?.name||'Sin estado')}</span></p><p><b>Profesional técnico</b><span>${esc(tech)}</span></p><p><b>Oficina/Repartición</b><span>${esc(o.office||o.requester_name||'-')}</span></p><p><b>Solicitante / Referente</b><span>${esc(o.requester_name||'-')}</span></p><p><b>Dirección</b><span>${esc(o.address||'-')}</span></p><p><b>Equipo</b><span>${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · ')||'-')}</span></p><p><b>N° serie</b><span>${esc(o.serial_number||'-')}</span></p><p><b>Accesorios / Insumos</b><span>${esc(o.accessories||'-')}</span></p><p><b>Tabla origen</b><span>${esc(o.satmanager_table||'REPARACIONES')}</span></p><p class="full"><b>Falla / Diagnóstico</b><span>${esc(o.fault_description||'-')}</span></p><p class="full"><b>Informe técnico</b><span>${esc(o.technical_report||'-')}</span></p><p class="full"><b>Solución / Observaciones</b><span>${esc(o.solution||o.observations||'-')}</span></p></div><h4>Historial</h4>${(hist||[]).map(h=>`<p class="history-line"><b>${fmt(h.created_at)}</b> · ${esc(h.action)} ${h.previous_value?`<small>${esc(h.previous_value)} → ${esc(h.new_value||'')}</small>`:''}</p>`).join('') || '<p>Sin movimientos registrados.</p>'}</div>`;
  Swal.fire({title:'Detalle de Orden de Servicio',html,width:980,customClass:{popup:'tm-modal'}});
};

window.exportPdf = (key) => {
  const rows = state.rows[key] || []; const { jsPDF } = window.jspdf || {}; if(!jsPDF)return Swal.fire({icon:'error',title:'jsPDF no cargado'});
  const doc = new jsPDF('l','mm','a4');
  doc.setFillColor(255,255,255); doc.roundedRect(12,8,42,18,3,3,'S'); doc.setTextColor(15,23,42); doc.setFontSize(7); doc.text('Ministerio de',16,15); doc.text('Educación Tucumán',16,19);
  doc.setFontSize(15); doc.text('TICKET MANAGER - Ministerio de Educación Tucumán',60,15); doc.setFontSize(9); doc.text(`Reporte: ${key} · Fecha y hora: ${new Date().toLocaleString('es-AR')} · Usuario: ${state.profile.full_name}`,60,23); doc.setDrawColor(124,92,255); doc.line(14,30,283,30);
  let cols;
  if(key==='orders') cols=['satmanager_order','received_at','technician_name','office','requester_name','equipment_type','brand','model','serial_number','accessories','fault_description','technical_report','solution'];
  else cols=Object.keys(rows[0]||{}).filter(k=>!String(rows[0]?.[k]).startsWith('[object')).slice(0,10);
  const headers=cols.map(c=>({satmanager_order:'Orden',received_at:'Ingreso',technician_name:'Profesional Técnico',office:'Oficina/Repartición',requester_name:'Solicitante',equipment_type:'Tipo',brand:'Marca',model:'Modelo',serial_number:'N° serie',accessories:'Accesorios/Insumos',fault_description:'Falla/Diagnóstico',technical_report:'Informe técnico',solution:'Solución'}[c]||c));
  if(doc.autoTable) doc.autoTable({head:[headers],body:rows.map(r=>cols.map(c=>String((c==='technician_name'?extractTechFromOrder(r):r[c])??''))),startY:36,styles:{fontSize:6,cellPadding:1.5},headStyles:{fillColor:[24,42,75]},columnStyles:{10:{cellWidth:50},11:{cellWidth:45},12:{cellWidth:40}}}); else doc.text(JSON.stringify(rows,null,2).slice(0,3000),14,38);
  const h=doc.internal.pageSize.height; doc.setFontSize(8); doc.text('TICKET MANAGER © 2026 Tucumán - Argentina · by Ing. Fernando Gambino',14,h-8); doc.save(`reporte_${key}.pdf`);
};

window.printOrder = (id,type) => {
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o) return;
  const title=type==='entrega'?'Constancia de entrega de equipo':'Constancia de ingreso de equipo';
  const tech=extractTechFromOrder(o) || '-';
  const logoText='<div class="logoText"><b>Ministerio de</b><br>Educación Tucumán</div>';
  const copy=(label)=>`<section class="copy"><div class="rotulo"><div class="logoBox">${logoText}</div><div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box"><b>Orden:</b> ${esc(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${esc(o.service_order_statuses?.name||'')}<br><b>Ingreso original:</b> ${fmt(o.received_at)}<br><b>Profesional Técnico:</b> ${esc(tech)}<br><b>Solicitante:</b> ${esc(o.requester_name||'')}<br><b>Oficina/Repartición:</b> ${esc(o.office||'')}<br><b>Teléfono:</b> ${esc(o.requester_phone||'')}</div><div class="box"><b>Equipo:</b> ${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '))}<br><b>N° serie:</b> ${esc(o.serial_number||'')}<br><b>Accesorios/Insumos:</b> ${esc(o.accessories||'')}</div><div class="box"><b>Falla / Informe:</b><br>${esc(type==='entrega'?(o.technical_report||o.solution||o.fault_description):o.fault_description)}</div><p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`;
  const html=`<html><head><title>${title}</title><style>@page{size:A4;margin:12mm}body{font-family:Arial;margin:0;color:#111}.copy{border-bottom:2px dashed #777;padding:0 0 14px;margin-bottom:16px}.rotulo{display:flex;gap:16px;align-items:center;text-align:left;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px}.logoBox{width:170px;min-height:54px;border-radius:8px;background:#fff;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;color:#0f172a;padding:8px}.logoText{font-size:12px;line-height:1.2}.box{border:1px solid #222;padding:10px;margin:10px 0;font-size:12px;line-height:1.55}h1{font-size:19px;margin:0 0 3px}.firmas{margin-top:28px;font-size:12px}</style></head><body>${copy(`Copia para la Oficina/Repartición: ${esc(o.office||'-')}`)}${copy('Copia para Dirección de Informática - Área Soporte Técnico')}</body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400);
};

window.bulkEditOrders = async () => { const ids=selectedIds('orders'); if(!ids.length) return Swal.fire({icon:'info',title:'Sin selección'}); await loadStatuses(); const html=`<div class="swal-grid"><label>Nuevo estado<select id="f_status_id">${state.statuses.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label></div>`; const {value}=await Swal.fire({title:`Cambiar estado en ${ids.length} órdenes`,html,width:650,showCancelButton:true,confirmButtonText:'Aplicar',customClass:{popup:'tm-modal'},preConfirm:()=>collect(['status_id'])}); if(!value)return; const {error}=await supa.from('service_orders').update({status_id:value.status_id,updated_by:state.user.id}).in('id',ids); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); await Promise.all(ids.map(id=>supa.from('service_order_history').insert({service_order_id:id,action:'Cambio masivo de estado',new_value:value.status_id,user_id:state.user.id}))); await notify('Cambio masivo de estado', `${state.profile.full_name} cambió el estado de ${ids.length} órdenes.`, 'orders', null); renderOrders(); };


/* ========================= v8.8 fixes =========================
   - Sincronización real SATMANAGER técnicos/oficinas -> Auth + profiles
   - Módulo Usuarios con botón Actualizar Técnicos
   - Selector de técnico en Órdenes desde profiles rol Técnicos
   - Favicon y header mobile con ícono oficial compacto
============================================================================ */
const TM_FAVICON_URL = 'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/cropped-icogob-1-180x180.png';
function setOfficialFavicon(){
  let l=document.querySelector("link[rel='icon']");
  if(!l){ l=document.createElement('link'); l.rel='icon'; document.head.appendChild(l); }
  l.href=TM_FAVICON_URL;
  let a=document.querySelector("link[rel='apple-touch-icon']");
  if(!a){ a=document.createElement('link'); a.rel='apple-touch-icon'; document.head.appendChild(a); }
  a.href=TM_FAVICON_URL;
}
setOfficialFavicon();

async function fetchTechnicianProfiles(){
  let list=[];
  try{
    const {data,error}=await supa.from('profiles')
      .select('id,email,full_name,role_name,is_active')
      .eq('role_name','Técnicos')
      .eq('is_active',true)
      .order('full_name');
    if(!error && data) list=data.filter(x=>!['fernando.m.gambino@gmail.com','electronicagambino@gmail.com'].includes(String(x.email||'').toLowerCase()));
  }catch(_){ }
  if(list.length) return list.map(x=>({id:x.id,name:x.full_name,email:x.email,source:'profiles'}));
  try{
    const {data,error}=await supa.from('satmanager_tecnicos').select('nombre,email,is_active').eq('is_active',true).order('nombre');
    if(!error && data) return data.map(x=>({id:null,name:x.nombre,email:x.email,source:'satmanager_tecnicos'}));
  }catch(_){ }
  return [];
}
async function fetchOffices(){
  try{
    const {data,error}=await supa.from('offices').select('name,address,phone,email,is_active').eq('is_active',true).order('name');
    if(!error && data?.length) return data;
  }catch(_){ }
  try{
    const {data,error}=await supa.from('service_orders').select('office,address,requester_phone').not('office','is',null).limit(5000);
    if(!error && data){
      const map=new Map(); data.forEach(o=>{ if(o.office && !map.has(o.office)) map.set(o.office,{name:o.office,address:o.address,phone:o.requester_phone}); });
      return [...map.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),'es'));
    }
  }catch(_){ }
  return [];
}

window.syncTechniciansAndOffices = async () => {
  const wait = Swal.fire({title:'Actualizando usuarios técnicos',html:'Sincronizando profesionales técnicos y oficinas/reparticiones desde el sistema legado...',allowOutsideClick:false,didOpen:()=>Swal.showLoading()});
  try{
    const {data,error}=await supa.rpc('sync_satmanager_tecnicos_to_profiles');
    if(error) throw error;
    await wait;
    await Swal.fire({icon:'success',title:'Sincronización finalizada',html:`<b>Técnicos creados/actualizados:</b> ${data?.technicians ?? '-'}<br><b>Oficinas actualizadas:</b> ${data?.offices ?? '-'}`});
    route('users');
  }catch(e){
    await wait;
    Swal.fire({icon:'error',title:'No se pudo sincronizar',html:`${esc(e.message||String(e))}<br><br>Ejecutá primero <b>supabase/schema_med_tuc_ticket_manager_v8_8.sql</b> en Supabase SQL Editor.`});
  }
};

async function renderCrud(key){
  const c = crud[key]; page(c.title, c.desc);
  let query = supa.from(c.table).select(c.select).order('created_at', { ascending:false });
  const { data, error } = await query;
  if (error) return showPanelError(error);
  let rows = data || [];
  if (key === 'roles') rows = rows.filter(r => ['SuperAdmin','Admin','Técnicos','Usuarios'].includes(r.name));
  state.rows[key] = rows; state.selected[key] = new Set();
  const columns = c.fields.slice(0, 6);
  const bulk = `<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('${key}',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEdit('${key}')">Editar selección</button><button class="btn danger" onclick="bulkDelete('${key}')">Eliminar selección</button><span id="sel_${key}">0 seleccionados</span></div>`;
  const syncBtn = key==='users' ? `<button class="btn success" onclick="syncTechniciansAndOffices()">Actualizar técnicos</button>` : '';
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>${c.title}</h2><p>${key==='users'?'Usuarios institucionales sincronizados con Supabase Auth, perfiles y técnicos del sistema legado.':'Acciones disponibles: ver, editar, eliminar, selección masiva, importar CSV, exportar CSV y PDF A4.'}</p></div><div class="module-actions">${syncBtn}<button class="btn primary" onclick="openForm('${key}')">Nuevo</button><button class="btn" onclick="importCsv('${key}')">Importar CSV</button><button class="btn" onclick="exportCsv('${key}')">Exportar CSV</button><button class="btn" onclick="exportPdf('${key}')">PDF A4</button></div></div><input class="search" placeholder="Buscar en ${c.title}..." oninput="filterRows(this.value)">${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th>${columns.map((f,i)=>`<th>${esc(c.labels[i])}</th>`).join('')}<th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(r=>rowHtml(key,r,columns)).join('')}</tbody></table></div>${bulk}</div>`;
}

function technicianSelectHtml(current){
  const cur=String(current||'');
  const list=state.techProfiles||[];
  return `<label>Profesional técnico que atiende<select id="f_technician_name"><option value="">Sin asignar</option>${list.map(t=>`<option value="${esc(t.name)}" ${cur===t.name?'selected':''}>${esc(t.name)}${t.email?` · ${esc(t.email)}`:''}</option>`).join('')}<option value="__manual__">+ Agregar / escribir otro...</option></select><input id="f_technician_manual" class="manual-extra" placeholder="Nuevo profesional técnico" style="display:none;margin-top:8px"></label>`;
}
function officeSelectHtml(current){
  const cur=String(current||'');
  const list=state.offices||[];
  return `<label>Oficina/Repartición<select id="f_office"><option value="">Sin oficina</option>${list.map(o=>`<option value="${esc(o.name)}" data-address="${esc(o.address||'')}" data-phone="${esc(o.phone||'')}" ${cur===o.name?'selected':''}>${esc(o.name)}</option>`).join('')}<option value="__manual__">+ Agregar / escribir otra...</option></select><input id="f_office_manual" class="manual-extra" placeholder="Nueva oficina/repartición" style="display:none;margin-top:8px"></label>`;
}

window.openOrder = async(id=null)=>{
  await loadStatuses();
  state.techProfiles = await fetchTechnicianProfiles();
  state.offices = await fetchOffices();
  const o=id?(state.rows.orders||[]).find(x=>x.id===id):{};
  const statusSelect=`<label>Estado<select id="f_status_id"><option value="">Sin estado</option>${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const html=`<div class="tm-form order-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.orders}</div><p>${id?'Actualizar trazabilidad técnica, estado e informe de la orden.':'Registrar una nueva orden técnica institucional.'}</p></div><div class="swal-grid">${statusSelect}${inputHtml('satmanager_order','Nº Orden',o?.satmanager_order)}${technicianSelectHtml(extractTechFromOrder(o))}${inputHtml('requester_name','Solicitante / Referente',o?.requester_name)}${officeSelectHtml(o?.office)}${inputHtml('requester_phone','Teléfono',o?.requester_phone)}${inputHtml('requester_email','Email',o?.requester_email)}${inputHtml('address','Dirección',o?.address)}${inputHtml('equipment_type','Tipo de equipo',o?.equipment_type)}${inputHtml('brand','Marca',o?.brand)}${inputHtml('model','Modelo',o?.model)}${inputHtml('serial_number','N° de serie',o?.serial_number)}${inputHtml('priority','Prioridad',o?.priority||'Media')}${inputHtml('accessories','Accesorios / Insumos asociados',o?.accessories)}${inputHtml('fault_description','Falla / Diagnóstico',o?.fault_description)}${inputHtml('technical_report','Informe técnico',o?.technical_report)}${inputHtml('solution','Solución / Observaciones',o?.solution||o?.observations)}</div></div>`;
  const fields=['status_id','satmanager_order','requester_name','requester_phone','requester_email','address','equipment_type','brand','model','serial_number','priority','accessories','fault_description','technical_report','solution'];
  const oldStatus=o?.status_id||null;
  const {value}=await Swal.fire({title:id?'Editar orden de servicio':'Nueva orden de servicio',html,width:980,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{
    const tech=$('#f_technician_name'), tm=$('#f_technician_manual'), off=$('#f_office'), om=$('#f_office_manual');
    if(tech) tech.onchange=()=>{ tm.style.display=tech.value==='__manual__'?'block':'none'; };
    if(off) off.onchange=()=>{ om.style.display=off.value==='__manual__'?'block':'none'; const opt=off.selectedOptions[0]; if(opt && off.value!=='__manual__'){ const a=opt.dataset.address, ph=opt.dataset.phone; if(a && $('#f_address') && !$('#f_address').value) $('#f_address').value=a; if(ph && $('#f_requester_phone') && !$('#f_requester_phone').value) $('#f_requester_phone').value=ph; } };
  },preConfirm:()=>{
    const data=collect(fields);
    data.technician_name = $('#f_technician_name')?.value === '__manual__' ? ($('#f_technician_manual')?.value || null) : ($('#f_technician_name')?.value || null);
    data.professional_technician = data.technician_name;
    data.office = $('#f_office')?.value === '__manual__' ? ($('#f_office_manual')?.value || null) : ($('#f_office')?.value || null);
    return data;
  }});
  if(!value)return;
  try{
    value.updated_by=state.user.id; if(!id)value.created_by=state.user.id; if(!value.fault_description)value.fault_description='Sin descripción';
    const res=id?await supa.from('service_orders').update(value).eq('id',id).select('id,status_id').single():await supa.from('service_orders').insert(value).select('id,status_id').single();
    if(res.error)throw res.error;
    const oid=id||res.data?.id;
    if(value.office){ try{ await supa.from('offices').upsert({name:value.office,address:value.address||null,phone:value.requester_phone||null,source:'PWA'},{onConflict:'name'}); }catch(_){ } }
    if(value.technician_name){ try{ await supa.from('satmanager_tecnicos').upsert({nombre:value.technician_name,email:null,source:'PWA'},{onConflict:'nombre'}); }catch(_){ } }
    if(id && oldStatus!==value.status_id){ await supa.from('service_order_history').insert({service_order_id:id,action:'Cambio de estado',previous_value:oldStatus,new_value:value.status_id,user_id:state.user.id}); }
    await notify(`${id?'Actualización':'Nueva'} Orden de Servicio`,`Orden Nº ${value.satmanager_order || ''} · Técnico: ${value.technician_name||'-'} · Oficina: ${value.office||'-'}`, 'orders', oid);
    await Swal.fire({icon:'success',title:'Orden guardada'}); renderOrders();
  }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
};

function renderShell(){
  setOfficialFavicon();
  const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
  const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
  const mobileMain = [['dashboard','Dashboard',ico.dashboard],['inventory','Inventario',ico.inventory],['orders','Órdenes',ico.orders],['tickets','Tickets',ico.tickets]];
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${TM_FAVICON_URL}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?'🌙':'☀️'}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  document.querySelector('.brand')?.addEventListener('click', toggleSidebarCollapse);
  $$('.nav button,.mobile-dock button[data-page]').forEach(b=>b.onclick=()=>route(b.dataset.page));
  $('#mobileMoreBtn').onclick = openMobileMenu;
  $('#themeBtn')?.addEventListener('click', toggleTheme);
  $('#fullBtn')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('#notifyBtn').onclick = () => route('notifications');
  $('#notifyBtn').onmouseenter = showNotificationPreview;
  $('#avatarBtn').onclick = () => changeAvatar();
  $('#logoutBtn').onclick = () => route('logout');
  loadNotificationCount();
}



/* ========================= v8.9 correcciones integrales solicitadas ========================= */
ico.sun = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
ico.moon = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
ico.exit = '<svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
ico.note = '<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 18h4"/></svg>';

function cleanLegacyText(v){ return String(v||'').replace(/Técnico\s+SATMANAGER\s*:\s*/gi,'Profesional técnico: ').replace(/SATMANAGER\s*[-:]?\s*/gi,'').replace(/Profesional técnico:\s*/gi,'Profesional técnico: ').replace(/\s*\|?\s*(Costo mano de obra original|Entrega original):\s*0(?:\.0)?/gi,'').trim(); }
function toggleTheme(){ localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); }
window.toggleTheme = toggleTheme;
window.toggleThemeFromMenu = function(){ Swal.close(); toggleTheme(); };

async function changeAvatar(){
  const input=document.createElement('input'); input.type='file'; input.accept='image/png,image/jpeg,image/webp,image/svg+xml';
  input.onchange=async()=>{
    const file=input.files?.[0]; if(!file) return;
    if(file.size>900*1024) return Swal.fire({icon:'warning',title:'Imagen demasiado grande',text:'Usá una imagen menor a 900 KB para guardarla en el perfil.'});
    const dataUrl=await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
    const {error}=await supa.from('profiles').update({avatar_url:dataUrl,updated_at:new Date().toISOString()}).eq('id',state.user.id);
    if(error) return Swal.fire({icon:'error',title:'No se pudo actualizar la foto',text:error.message});
    state.profile.avatar_url=dataUrl; renderShell(); route('profile');
  };
  input.click();
}
window.changeAvatar = changeAvatar;

async function dashboardStatusCounts(){
  const rows = state.rows.orders || [];
  const now = new Date();
  const oldDays = d => d ? (now - new Date(d))/(1000*60*60*24) : 0;
  return {
    urgent: rows.filter(o=>String(o.priority||'').toLowerCase()==='urgente').length,
    pending: rows.filter(o=>/pendiente|asignada|sin estado/i.test(o.service_order_statuses?.name||'Sin estado')).length,
    late: rows.filter(o=>!(/entregada|cancelada/i.test(o.service_order_statuses?.name||'')) && oldDays(o.received_at)>7).length,
    ready: rows.filter(o=>/lista|terminada/i.test(o.service_order_statuses?.name||'')).length
  };
}

renderDashboard = async function(){
  page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
  const [users,tickets,inv] = await Promise.all([count('profiles'),count('support_tickets'),count('inventory_items')]);
  await loadStatuses();
  const {data:orders}=await supa.from('service_orders').select('*, service_order_statuses(name,color)').order('received_at',{ascending:false}).limit(5000);
  state.rows.orders=orders||[];
  const total=state.rows.orders.length;
  const c=await dashboardStatusCounts();
  const byStatus={}; state.rows.orders.forEach(o=>{ const k=o.service_order_statuses?.name||'Sin estado'; byStatus[k]=(byStatus[k]||0)+1; });
  const month=new Date(); const y=month.getFullYear(), m=month.getMonth();
  const first=new Date(y,m,1), last=new Date(y,m+1,0); const start=(first.getDay()+6)%7;
  const cells=[]; for(let i=0;i<start;i++) cells.push(''); for(let d=1; d<=last.getDate(); d++) cells.push(d); while(cells.length%7) cells.push('');
  const ordersByDay={}; state.rows.orders.forEach(o=>{ const dt=new Date(o.received_at); if(dt.getFullYear()===y && dt.getMonth()===m){ const dd=dt.getDate(); (ordersByDay[dd]=ordersByDay[dd]||[]).push(o); } });
  const statBars=Object.entries(byStatus).map(([k,v])=>`<div class="dash-bar"><span>${esc(k)}</span><b>${v}</b><i style="width:${Math.max(6,Math.min(100,(v/Math.max(1,total))*100))}%"></i></div>`).join('');
  $('#content').innerHTML=`<div class="dash-grid-v89">
    <article class="metric-card"><span>Usuarios</span><b>${users}</b><small>Perfiles autorizados</small></article>
    <article class="metric-card"><span>Órdenes</span><b>${total}</b><small>Órdenes técnicas registradas</small></article>
    <article class="metric-card warn"><span>Urgentes</span><b>${c.urgent}</b><small>Prioridad crítica</small></article>
    <article class="metric-card danger"><span>Atrasadas</span><b>${c.late}</b><small>Más de 7 días abiertas</small></article>
    <article class="metric-card"><span>Tickets</span><b>${tickets}</b><small>Solicitudes recibidas</small></article>
    <article class="metric-card"><span>Inventario</span><b>${inv}</b><small>Activos e insumos</small></article>
  </div>
  <div class="dash-two">
    <section class="card"><div class="module-head"><div><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p></div></div><div class="alert-grid"><div class="alert-pill danger">${c.urgent} urgentes</div><div class="alert-pill warn">${c.pending} pendientes</div><div class="alert-pill danger">${c.late} atrasadas</div><div class="alert-pill ok">${c.ready} listas/terminadas</div></div><h3>Estados</h3><div class="bars">${statBars||'<p>Sin órdenes registradas.</p>'}</div></section>
    <section class="card"><div class="module-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${month.toLocaleDateString('es-AR',{month:'long',year:'numeric'})}</p></div><button class="btn" onclick="route('orders')">Ver órdenes</button></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===new Date().getDate()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,3).map(o=>`<button onclick="route('orders')">OS ${esc(o.satmanager_order||o.order_number)} · ${esc(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
  </div>`;
};

window.printOrder = (id,type) => {
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o) return;
  const title=type==='entrega'?'Constancia de egreso / entrega de equipo':'Constancia de ingreso de equipo';
  const logo='https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/mnisteriodeeducacion.webp';
  const short=(v,n=260)=>{ v=cleanLegacyText(v||''); return v.length>n ? v.slice(0,n-1)+'…' : v; };
  const tech=short(extractTechFromOrder(o)||o.technician_name||o.professional_technician||'-',80).replace(/^Profesional técnico:\s*/i,'');
  const falla= type==='entrega' ? short(o.technical_report||o.solution||o.observations||o.fault_description,280) : short(o.fault_description,260);
  const egresoExtra = type==='entrega' ? `<div class="box compact"><b>Detalle de egreso:</b><br><b>Informe técnico:</b> ${esc(short(o.technical_report||'-',210))}<br><b>Solución / Observaciones:</b> ${esc(short(o.solution||o.observations||'-',210))}</div>` : '';
  const copy=(label)=>`<section class="copy"><div class="rotulo"><div class="logoBox"><img src="${logo}"></div><div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box"><b>Orden:</b> ${esc(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${esc(o.service_order_statuses?.name||'')}<br><b>Ingreso original:</b> ${fmt(o.received_at)}<br><b>Profesional Técnico:</b> ${esc(tech)}<br><b>Solicitante:</b> ${esc(short(o.requester_name||'',90))}<br><b>Oficina/Repartición:</b> ${esc(short(o.office||'',120))}<br><b>Teléfono:</b> ${esc(short(o.requester_phone||'',40))}</div><div class="box"><b>Equipo:</b> ${esc(short([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '),120))}<br><b>N° serie:</b> ${esc(short(o.serial_number||'',80))}<br><b>Accesorios/Insumos:</b> ${esc(short(o.accessories||'',150))}</div><div class="box"><b>Falla / Informe:</b><br>${esc(falla)}</div>${egresoExtra}<p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`;
  const html=`<html><head><title>${title}</title><style>@page{size:A4;margin:7mm}*{box-sizing:border-box}html,body{font-family:Arial;margin:0;color:#111;font-size:10.5px}.copy{height:138mm;overflow:hidden;border-bottom:1.5px dashed #777;padding:0 0 5mm;margin-bottom:5mm;page-break-inside:avoid}.copy:last-child{border-bottom:0;margin-bottom:0}.rotulo{display:flex;gap:10px;align-items:center;text-align:left;border-bottom:1.5px solid #111;padding-bottom:5px;margin-bottom:6px}.logoBox{width:138px;height:42px;border:1px solid #ddd;border-radius:6px;display:flex;align-items:center;justify-content:center;padding:4px;flex:0 0 auto}.logoBox img{max-width:126px;max-height:34px;object-fit:contain}.box{border:1px solid #222;padding:6px;margin:5px 0;font-size:10.4px;line-height:1.32}.box.compact{font-size:9.8px;line-height:1.25}h1{font-size:15px;margin:0 0 2px}.firmas{margin-top:13px;font-size:10.5px}</style></head><body>${copy(`Copia para la Oficina/Repartición: ${esc(o.office||'-')}`)}${copy('Copia para Dirección de Informática - Área Soporte Técnico')}</body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),450);
};

window.makeNote = async (id) => {
  const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o) return;
  const offices = await fetchOffices().catch(()=>[]);
  const draft=`A quien corresponda:\n\nPor medio de la presente se solicita la provisión de insumos necesarios para la Orden de Servicio N° ${o.satmanager_order||o.order_number}, correspondiente al equipo ${[o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' / ')} de ${o.office||o.requester_name||'la repartición solicitante'}.\n\nMotivo técnico: ${o.fault_description||'Sin descripción'}.\n\nLa solicitud se realiza a efectos de garantizar la continuidad operativa del soporte técnico institucional.\n\nAtentamente.`;
  const html=`<div class="note-modal-pro"><div class="note-icon" title="Nota institucional">${ico.note}</div><div class="note-field"><label>Oficina/Repartición destino</label><select id="noteOffice">${offices.map(x=>`<option value="${esc(x.name)}" ${x.name===(o.office||'')?'selected':''}>${esc(x.name)}</option>`).join('')}<option value="Otra Oficina/Repartición">Otra Oficina/Repartición</option></select></div><div class="note-field"><label>Firma institucional</label><select id="noteSigner"><option value="Profesional Técnico: ${esc(extractTechFromOrder(o)||state.profile.full_name)}">Profesional Técnico: ${esc(extractTechFromOrder(o)||state.profile.full_name)}</option><option value="Director de Dirección de Informática: Ing. Gerardo Toro">Director de Dirección de Informática: Ing. Gerardo Toro</option></select></div><textarea id="noteBody" class="note-textarea">${esc(draft)}</textarea><div class="note-actions"><button class="btn" type="button" onclick="printInstitutionalNote()">Imprimir PDF A4</button></div></div>`;
  window.__currentNoteOrder=o;
  const {value}=await Swal.fire({title:'Nota institucional',html,width:1100,showCancelButton:true,confirmButtonText:'Guardar nota',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal note-wide'},preConfirm:()=>({body:$('#noteBody').value, office:$('#noteOffice').value, signer:$('#noteSigner').value})});
  if(!value)return;
  const full=`Destino: ${value.office}\nFirma: ${value.signer}\n\n${value.body}`;
  const {error}=await supa.from('service_order_notes').insert({service_order_id:id,note_type:'compra',title:'Nota institucional / Solicitud de insumos',body:full,created_by:state.user.id});
  if(error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); Swal.fire({icon:'success',title:'Nota guardada'});
};

window.printInstitutionalNote = function(){
  const o=window.__currentNoteOrder||{}; const logo='https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/mnisteriodeeducacion.webp';
  const office=$('#noteOffice')?.value||''; const signer=$('#noteSigner')?.value||''; const body=$('#noteBody')?.value||'';
  const html=`<html><head><title>Nota institucional</title><style>@page{size:A4;margin:18mm}body{font-family:Arial;color:#111}.head{display:flex;gap:18px;align-items:center;border-bottom:2px solid #111;padding-bottom:12px}.head img{width:180px;object-fit:contain}.head h1{font-size:20px;margin:0}.meta{font-size:12px;border:1px solid #333;padding:10px;margin:18px 0}.body{white-space:pre-wrap;font-size:14px;line-height:1.65}.firma{margin-top:45px;text-align:right}</style></head><body><div class="head"><img src="${logo}"><div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>Nota institucional</b></div></div><div class="meta"><b>Orden de Servicio:</b> ${esc(o.satmanager_order||o.order_number||'-')}<br><b>Destino:</b> ${esc(office)}<br><b>Fecha:</b> ${new Date().toLocaleString('es-AR')}</div><div class="body">${esc(body)}</div><div class="firma">______________________________<br>${esc(signer)}</div></body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),400);
};

window.sendInternalNotification = async()=>{
  const {data:profiles}=await supa.from('profiles').select('id,email,full_name,role_name').eq('is_active',true).order('full_name');
  const options=(profiles||[]).map(p=>`<option value="${p.id}" data-email="${esc(p.email||'')}">${esc(p.full_name||p.email)} · ${esc(p.role_name||'')}</option>`).join('');
  const html=`<div class="swal-grid"><label>Usuario destino<select id="f_target_user"><option value="">Todos / por perfil</option>${options}</select></label>${inputHtml('target_role','Perfil destino','')}${inputHtml('title','Título','')}${inputHtml('body','Mensaje','')}<label class="checkline"><input id="f_send_email" type="checkbox"> También preparar envío por email</label></div>`;
  const {value}=await Swal.fire({title:'Enviar notificación',html,width:780,showCancelButton:true,confirmButtonText:'Enviar',preConfirm:()=>({target_user:$('#f_target_user').value||null,target_role:$('#f_target_role').value||null,title:$('#f_title').value,body:$('#f_body').value,send_email:$('#f_send_email').checked})});
  if(!value) return;
  const {error}=await supa.from('notifications').insert({title:value.title,body:value.body,module:'notifications',target_role:value.target_role,target_user:value.target_user,created_by:state.user.id});
  if(error) return Swal.fire({icon:'error',title:'No se pudo enviar',text:error.message});
  if(value.send_email){
    let to=''; if(value.target_user){ const p=(profiles||[]).find(x=>x.id===value.target_user); to=p?.email||''; }
    const url=`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(value.title)}&body=${encodeURIComponent(value.body)}`; window.open(url,'_blank');
  }
  await Swal.fire({icon:'success',title:'Notificación enviada'}); if(state.page==='notifications') renderNotifications();
};

function renderShell(){
  if (typeof setOfficialFavicon === 'function') setOfficialFavicon();
  const logo = (localStorage.theme === 'light' ? (state.settings.logo_light_url||'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/mnisteriodeeducacion.webp') : (state.settings.logo_dark_url||'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/MINISTERIO-DE-EDUCACION-blanco.png')) || 'assets/logo.svg';
  const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
  const themeIcon = localStorage.theme==='light' ? ico.moon : ico.sun;
  const mobileMain = [['dashboard','Dashboard',ico.dashboard],['inventory','Inventario',ico.inventory],['orders','Órdenes',ico.orders],['tickets','Tickets',ico.tickets]];
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only" id="themeBtn" title="Cambiar tema">${themeIcon}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.exit}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  document.querySelector('.brand')?.addEventListener('click', toggleSidebarCollapse);
  $$('.nav button,.mobile-dock button[data-page]').forEach(b=>b.onclick=()=>route(b.dataset.page));
  $('#mobileMoreBtn').onclick = openMobileMenu;
  $('#themeBtn')?.addEventListener('click', toggleTheme);
  $('#fullBtn')?.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('#notifyBtn').onclick = () => route('notifications');
  $('#notifyBtn').onmouseenter = (typeof showNotifyPreview === 'function' ? showNotifyPreview : showNotificationPreview);
  $('#avatarBtn').onclick = changeAvatar;
  $('#logoutBtn').onclick = () => route('logout');
  loadNotificationCount();
}



/* ========================= v8.11 fixes =========================
   - Calendario Dashboard con navegación mensual, selector anual y detalle clickeable
   - Notificaciones paginadas: 5/10/25/50/100/500/1000 + anterior/siguiente
   - Popup de Orden con acciones rápidas arriba a la derecha
   - Ícono profesional para Nota institucional
============================================================================ */
ico.note = '<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>';
window.showNotifyPreview = window.showNotifyPreview || (typeof showNotificationPreview === 'function' ? showNotificationPreview : async()=>{});
state.pagination = state.pagination || {};
state.pagination.notifications = state.pagination.notifications || { page:1, size:10 };
state.dashboardCalendar = state.dashboardCalendar || { month:new Date().getMonth(), year:new Date().getFullYear() };

function dashboardMonthName(month, year){ return new Date(year, month, 1).toLocaleDateString('es-AR',{month:'long', year:'numeric'}); }
window.changeDashboardMonth = function(delta){
  const cal=state.dashboardCalendar || {month:new Date().getMonth(), year:new Date().getFullYear()};
  const d=new Date(cal.year, cal.month + delta, 1);
  state.dashboardCalendar={month:d.getMonth(), year:d.getFullYear()};
  renderDashboard();
};
window.changeDashboardYear = function(year){
  const y=parseInt(year,10); if(!Number.isFinite(y)) return;
  state.dashboardCalendar = state.dashboardCalendar || {month:new Date().getMonth(), year:new Date().getFullYear()};
  state.dashboardCalendar.year = y;
  renderDashboard();
};

async function renderDashboard(){
  page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
  const [ordersRes, usersRes, ticketsRes, invRes] = await Promise.all([
    supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false}),
    supa.from('profiles').select('*',{count:'exact'}),
    supa.from('support_tickets').select('*',{count:'exact'}),
    supa.from('inventory_items').select('*',{count:'exact'})
  ]);
  const orders=ordersRes.data||[]; state.rows.orders=orders;
  const now=new Date(); const sevenDaysMs=7*24*60*60*1000;
  const urgent=orders.filter(o=>o.priority==='Urgente').length;
  const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada'];
  const pending=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'')).length;
  const late=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>sevenDaysMs).length;
  const done=orders.filter(o=>doneNames.includes(o.service_order_statuses?.name||'')).length;
  const stats=[['Usuarios',usersRes.count||0,'Perfiles autorizados.'],['Órdenes',ordersRes.count||orders.length,'Órdenes técnicas registradas.'],['Urgentes',urgent,'Prioridad crítica'],['Atrasadas',late,'Más de 7 días abiertas'],['Tickets',ticketsRes.count||0,'Solicitudes recibidas'],['Inventario',invRes.count||0,'Activos e insumos']];
  const statusMap={}; orders.forEach(o=>{ const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1; });
  const cal=state.dashboardCalendar || {month:now.getMonth(), year:now.getFullYear()};
  const first=new Date(cal.year,cal.month,1); const last=new Date(cal.year,cal.month+1,0).getDate();
  const offset=(first.getDay()+6)%7; const cells=[]; for(let i=0;i<offset;i++)cells.push(null); for(let d=1;d<=last;d++)cells.push(d); while(cells.length%7)cells.push(null);
  const ordersByDay={}; orders.forEach(o=>{ const d=new Date(o.received_at||o.created_at); if(d.getFullYear()===cal.year && d.getMonth()===cal.month){ const day=d.getDate(); (ordersByDay[day]=ordersByDay[day]||[]).push(o); }});
  const yearOptions=[]; for(let y=now.getFullYear()-4;y<=now.getFullYear()+4;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
  $('#content').innerHTML=`
  <div class="dash-stats">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}"><small>${s[0]}</small><strong>${s[1]}</strong><span>${s[2]}</span></article>`).join('')}</div>
  <div class="dash-grid-v89">
    <section class="card"><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${done} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${esc(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('')}</section>
    <section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${dashboardMonthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select><button class="btn icon-only" onclick="changeDashboardMonth(-1)" title="Mes anterior">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)" title="Mes siguiente">→</button><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')" title="Abrir detalle">OS ${esc(o.satmanager_order||o.order_number)} · ${esc(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
  </div>`;
}

window.goNotificationsPage=function(delta){
  const p=state.pagination.notifications; p.page=Math.max(1,p.page+delta); renderNotifications();
};
window.setNotificationsPageSize=function(size){
  state.pagination.notifications={page:1,size:parseInt(size,10)||10}; renderNotifications();
};

async function renderNotifications(){
  const c=crud.notifications; page(c.title,c.desc);
  const pag=state.pagination.notifications || {page:1,size:10};
  const from=(pag.page-1)*pag.size; const to=from+pag.size-1;
  const {data,error,count}=await supa.from('notifications').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(from,to);
  if(error) return showPanelError(error);
  const rows=data||[]; state.rows.notifications=rows; state.selected.notifications=new Set();
  const total=count||0; const totalPages=Math.max(1,Math.ceil(total/pag.size)); if(pag.page>totalPages){pag.page=totalPages; return renderNotifications();}
  const pager=`<div class="pager notif-pager"><label>Listar <select onchange="setNotificationsPageSize(this.value)">${[5,10,25,50,100,500,1000].map(n=>`<option value="${n}" ${pag.size===n?'selected':''}>${n}</option>`).join('')}</select></label><span>Página ${pag.page} de ${totalPages} · ${total} registros</span><button class="btn" onclick="goNotificationsPage(-1)" ${pag.page<=1?'disabled':''}>← Atrás</button><button class="btn" onclick="goNotificationsPage(1)" ${pag.page>=totalPages?'disabled':''}>Siguiente →</button></div>`;
  const bulk=`<div class="bulkbar notif-tools"><label class="checkline"><input type="checkbox" onchange="toggleAll('notifications',this.checked)"> Seleccionar todo</label><button class="btn" onclick="markSelectedNotifications(true)">Marcar leídas</button><button class="btn" onclick="markSelectedNotifications(false)">Marcar sin leer</button><button class="btn danger" onclick="bulkDelete('notifications')">Eliminar selección</button><button class="btn" onclick="clearNotificationCounter()">Limpiar contador</button><span id="sel_notifications">0 seleccionados</span></div>`;
  $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Centro de notificaciones</h2><p>Un clic sobre una notificación sin leer la marca como leída y redirige al módulo correspondiente.</p></div><div class="module-actions"><button class="btn primary" onclick="sendInternalNotification()">Enviar notificación</button><button class="btn" onclick="exportCsv('notifications')">Exportar CSV</button><button class="btn" onclick="exportPdf('notifications')">PDF A4</button></div></div>${pager}${bulk}<div class="notification-list">${rows.map(n=>`<article class="notification-card ${n.is_read?'read':'unread'}" data-id="${n.id}"><input type="checkbox" onchange="toggleOne('notifications','${n.id}',this.checked);event.stopPropagation()"><div onclick="openNotification('${n.id}')"><h3>${esc(n.title)}</h3><p>${esc(n.body||'')}</p><small>${fmt(n.created_at)} · ${esc(n.module||'-')}</small></div><button class="badge ${n.is_read?'ok':'warn'}" onclick="toggleNotificationRead('${n.id}',${!n.is_read});event.stopPropagation()">${n.is_read?'Leída':'Sin leer'}</button></article>`).join('')||'<p>Sin notificaciones.</p>'}</div>${pager}</div>`;
  loadNotificationCount();
}

window.viewOrder = async(id)=>{
  const o=(state.rows.orders||[]).find(x=>x.id===id) || (await supa.from('service_orders').select('*,service_order_statuses(name,color)').eq('id',id).maybeSingle()).data; if(!o)return;
  const tech=extractTechFromOrder(o) || '-';
  const {data:hist}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false});
  const actions=`<div class="order-detail-actions"><button class="icon-mini" title="Ir al módulo" onclick="Swal.close();route('orders')">${ico.orders}</button><button class="icon-mini" title="Editar" onclick="Swal.close();openOrder('${id}')">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="Swal.close();deleteOrder('${id}')">${ico.trash}</button></div>`;
  const html=`<div class="detail-card order-detail with-actions">${actions}<h3>Orden #${esc(o.satmanager_order||o.order_number)}</h3><div class="detail-grid"><p><b>Ingreso original</b><span>${fmt(o.received_at||o.original_received_at)}</span></p><p><b>Estado</b><span>${esc(o.service_order_statuses?.name||'Sin estado')}</span></p><p><b>Profesional técnico</b><span>${esc(tech)}</span></p><p><b>Oficina/Repartición</b><span>${esc(o.office||o.requester_name||'-')}</span></p><p><b>Solicitante / Referente</b><span>${esc(o.requester_name||'-')}</span></p><p><b>Dirección</b><span>${esc(o.address||'-')}</span></p><p><b>Equipo</b><span>${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · ')||'-')}</span></p><p><b>N° serie</b><span>${esc(o.serial_number||'-')}</span></p><p><b>Accesorios / Insumos</b><span>${esc(o.accessories||'-')}</span></p><p><b>Tabla origen</b><span>${esc(o.satmanager_table||'REPARACIONES')}</span></p><p class="full"><b>Falla / Diagnóstico</b><span>${esc(o.fault_description||'-')}</span></p><p class="full"><b>Informe técnico</b><span>${esc(o.technical_report||'-')}</span></p><p class="full"><b>Solución / Observaciones</b><span>${esc(o.solution||o.observations||'-')}</span></p></div><h4>Historial</h4>${(hist||[]).map(h=>`<p class="history-line"><b>${fmt(h.created_at)}</b> · ${esc(h.action)} ${h.previous_value?`<small>${esc(h.previous_value)} → ${esc(h.new_value||'')}</small>`:''}</p>`).join('') || '<p>Sin movimientos registrados.</p>'}</div>`;
  Swal.fire({title:'Detalle de Orden de Servicio',html,width:1040,customClass:{popup:'tm-modal'}});
};

init().catch(e => { console.error(e); Swal.fire({ icon:'error', title:'Error de inicio', text:e.message || String(e) }).then(()=>{ if(/perfil|session|auth/i.test(e.message||'')) window.location.replace('./index.html'); }); });


/* ========================= v8.12 SUPERADMIN + DASHBOARD + SELECT FIXES ========================= */
(function(){
  state.pagination = state.pagination || {};
  state.pagination.notifications = state.pagination.notifications || {page:1,size:10};
  state.dashboardCalendar = state.dashboardCalendar || {month:new Date().getMonth(), year:new Date().getFullYear()};

  window.isSuperAdmin = function(){ return String(state.profile?.role_name||'') === 'SuperAdmin'; };

  function safeUserFields(){ return ['full_name','email','role_name','office','phone','is_active']; }
  function userFormHtml(u={}){
    const roles=['SuperAdmin','Admin','Técnicos','Usuarios'];
    const canPass=window.isSuperAdmin();
    return `<div class="tm-form user-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.users}</div><p>Complete los datos solicitados para generar o actualizar el perfil institucional.</p></div><div class="swal-grid">
      <label>Nombre completo<input id="f_full_name" value="${esc(u.full_name||'')}"></label>
      <label>Email<input id="f_email" type="email" value="${esc(u.email||'')}"></label>
      <label>Perfil<select id="f_role_name">${roles.map(r=>`<option value="${r}" ${String(u.role_name||'Usuarios')===r?'selected':''}>${r}</option>`).join('')}</select></label>
      <label>Oficina/Repartición<input id="f_office" value="${esc(u.office||'')}"></label>
      <label>Teléfono<input id="f_phone" value="${esc(u.phone||'')}"></label>
      <label>Activo<select id="f_is_active"><option value="true" ${u.is_active!==false?'selected':''}>Sí</option><option value="false" ${u.is_active===false?'selected':''}>No</option></select></label>
      ${canPass?`<label class="full password-box"><b>Contraseña ${u.id?'nueva / modificar':'inicial'}</b><input id="f_password" type="password" placeholder="Ej: tecnico123456" autocomplete="new-password"><small>Disponible sólo para SuperAdmin. Para editar sin cambiar contraseña, dejar vacío.</small></label>`:''}
    </div></div>`;
  }

  const originalOpenFormV812 = window.openForm;
  window.openForm = async function(key,id=null){
    if(key !== 'users') return originalOpenFormV812 ? originalOpenFormV812(key,id) : null;
    if(!window.isSuperAdmin()) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Sólo SuperAdmin puede crear o editar usuarios.'});
    const row = id ? (state.rows.users||[]).find(x=>x.id===id) : {};
    const {value}=await Swal.fire({
      title:id?'Editar Usuario':'Nuevo Usuario', html:userFormHtml(row), width:900, showCancelButton:true,
      confirmButtonText:'Guardar', cancelButtonText:'Cancelar', customClass:{popup:'tm-modal'},
      preConfirm:()=>{
        const v=collect([...safeUserFields(),'password']);
        v.email=String(v.email||'').trim().toLowerCase();
        v.is_active = String(v.is_active)==='true' || v.is_active===true;
        if(!v.full_name || !v.email) { Swal.showValidationMessage('Nombre completo y email son obligatorios.'); return false; }
        if(v.password && String(v.password).length < 6) { Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres.'); return false; }
        return v;
      }
    });
    if(!value) return;
    try{
      const payload={ p_email:value.email, p_full_name:value.full_name, p_role_name:value.role_name||'Usuarios', p_office:value.office||null, p_phone:value.phone||null, p_is_active:value.is_active, p_password:value.password||null };
      let data=null, error=null;
      try {
        const fn = await supa.functions.invoke('admin-create-user', { body: payload });
        data = fn.data; error = fn.error;
      } catch(fnErr) { error = fnErr; }
      if(error){
        console.warn('Edge Function admin-create-user no disponible o falló, usando RPC fallback:', error.message || error);
        const rpc = await supa.rpc('superadmin_upsert_user_profile', payload);
        data = rpc.data; error = rpc.error;
      }
      if(error) throw error;
      await notify(id?'Actualización en Usuarios':'Nuevo usuario', `${state.profile.full_name} ${id?'actualizó':'creó'} el usuario ${value.email}.`, 'users', data?.id||id||null);
      await Swal.fire({icon:'success',title:'Usuario guardado',text:value.password?'Perfil y contraseña actualizados.':'Perfil actualizado.'});
      route('users');
    }catch(e){
      Swal.fire({icon:'error',title:'No se pudo guardar el usuario',html:`${esc(e.message||String(e))}<br><br>Ejecutá primero <b>supabase/schema_med_tuc_ticket_manager_v8_12.sql</b>.`});
    }
  };

  window.dashboardMonthName = window.dashboardMonthName || function(month, year){ return new Date(year, month, 1).toLocaleDateString('es-AR',{month:'long',year:'numeric'}); };
  window.changeDashboardMonth = function(delta){ const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; const d=new Date(cal.year,cal.month+(parseInt(delta,10)||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; renderDashboard(); };
  window.changeDashboardYear = function(y){ state.dashboardCalendar=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; state.dashboardCalendar.year=parseInt(y,10)||new Date().getFullYear(); renderDashboard(); };

  function actionButtons(key,r){
    if(key==='orders') return `<button class="icon-mini" onclick="viewOrder('${r.id}')">${ico.view}</button><button class="icon-mini" onclick="openOrder('${r.id}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteOrder('${r.id}')">${ico.trash}</button>`;
    if(key==='users') return `<button class="icon-mini" onclick="viewRecord('users','${r.id}')">${ico.view}</button><button class="icon-mini" onclick="openForm('users','${r.id}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('users','${r.id}')">${ico.trash}</button>`;
    if(key==='tickets') return `<button class="icon-mini" onclick="viewRecord('tickets','${r.id}')">${ico.view}</button><button class="icon-mini" onclick="openForm('tickets','${r.id}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('tickets','${r.id}')">${ico.trash}</button>`;
    if(key==='inventory') return `<button class="icon-mini" onclick="viewRecord('inventory','${r.id}')">${ico.view}</button><button class="icon-mini" onclick="openForm('inventory','${r.id}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('inventory','${r.id}')">${ico.trash}</button>`;
    return '';
  }
  window.openDashboardList = function(kind){
    const orders=state.rows.orders||[], users=state.rows.users||[], tickets=state.rows.tickets||[], inv=state.rows.inventory||[];
    const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada']; const now=new Date(); const seven=7*24*60*60*1000;
    let title='', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office'];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>o.priority==='Urgente'); key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>seven); key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status'];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock'];}
    const body=`<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${esc(c==='technician_name'?extractTechFromOrder(r):(r[c]??''))}</td>`).join('')}<td class="row-actions">${actionButtons(key,r)}</td></tr>`).join('')||'<tr><td colspan="9">Sin registros.</td></tr>'}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html:body,width:1100,customClass:{popup:'tm-modal dashboard-modal'}});
  };

  window.renderDashboard = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [ordersRes, usersRes, ticketsRes, invRes] = await Promise.all([
      supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false}),
      supa.from('profiles').select('*',{count:'exact'}).order('created_at',{ascending:false}),
      supa.from('support_tickets').select('*',{count:'exact'}).order('created_at',{ascending:false}),
      supa.from('inventory_items').select('*',{count:'exact'}).order('created_at',{ascending:false})
    ]);
    const orders=ordersRes.data||[], users=usersRes.data||[], tickets=ticketsRes.data||[], inv=invRes.data||[];
    state.rows.orders=orders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date(), sevenDaysMs=7*24*60*60*1000;
    const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada'];
    const urgent=orders.filter(o=>o.priority==='Urgente').length;
    const pending=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'')).length;
    const late=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>sevenDaysMs).length;
    const done=orders.filter(o=>doneNames.includes(o.service_order_statuses?.name||'')).length;
    const stats=[['users','Usuarios',usersRes.count||users.length,'Perfiles autorizados.'],['orders','Órdenes',ordersRes.count||orders.length,'Órdenes técnicas registradas.'],['urgent','Urgentes',urgent,'Prioridad crítica'],['late','Atrasadas',late,'Más de 7 días abiertas'],['tickets','Tickets',ticketsRes.count||tickets.length,'Solicitudes recibidas'],['inventory','Inventario',invRes.count||inv.length,'Activos e insumos']];
    const statusMap={}; orders.forEach(o=>{ const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1; });
    const cal=state.dashboardCalendar || {month:now.getMonth(), year:now.getFullYear()};
    const first=new Date(cal.year,cal.month,1), last=new Date(cal.year,cal.month+1,0).getDate(); const offset=(first.getDay()+6)%7; const cells=[]; for(let i=0;i<offset;i++)cells.push(null); for(let d=1;d<=last;d++)cells.push(d); while(cells.length%7)cells.push(null);
    const ordersByDay={}; orders.forEach(o=>{ const d=new Date(o.received_at||o.created_at); if(d.getFullYear()===cal.year && d.getMonth()===cal.month){ (ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o); }});
    const yearOptions=[]; for(let y=now.getFullYear()-5;y<=now.getFullYear()+5;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    $('#content').innerHTML=`<div class="dash-stats">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="openDashboardList('${s[0]}')" title="Ver listado"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}</div><div class="dash-grid-v89"><section class="card"><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${done} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${esc(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('')}</section><section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${dashboardMonthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)" title="Mes anterior">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)" title="Mes siguiente">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')" title="Abrir detalle">OS ${esc(o.satmanager_order||o.order_number)} · ${esc(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section></div>`;
  };
})();


/* ========================= v8.13 FINAL DASHBOARD OVERRIDE ========================= */
(function(){
  state.pagination = state.pagination || {};
  state.pagination.notifications = state.pagination.notifications || {page:1,size:10};
  state.dashboardCalendar = state.dashboardCalendar || {month:new Date().getMonth(), year:new Date().getFullYear()};
  window.dashboardMonthName = function(month, year){ return new Date(year, month, 1).toLocaleDateString('es-AR',{month:'long',year:'numeric'}); };
  window.changeDashboardMonth = function(delta){ const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; const d=new Date(cal.year, cal.month+(parseInt(delta,10)||0), 1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; window.renderDashboard(); };
  window.changeDashboardYear = function(y){ const now=new Date(); state.dashboardCalendar=state.dashboardCalendar||{month:now.getMonth(),year:now.getFullYear()}; state.dashboardCalendar.year=parseInt(y,10)||now.getFullYear(); window.renderDashboard(); };
  window.openDashboardList = window.openDashboardList || function(kind){ const map={users:'users',orders:'orders',urgent:'orders',late:'orders',tickets:'tickets',inventory:'inventory'}; route(map[kind]||'dashboard'); };

  window.renderDashboard = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [ordersRes, usersRes, ticketsRes, invRes] = await Promise.all([
      supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false}),
      supa.from('profiles').select('*',{count:'exact'}).order('created_at',{ascending:false}),
      supa.from('support_tickets').select('*',{count:'exact'}).order('created_at',{ascending:false}),
      supa.from('inventory_items').select('*',{count:'exact'}).order('created_at',{ascending:false})
    ]);
    if(ordersRes.error) return showPanelError(ordersRes.error);
    const orders=ordersRes.data||[], users=usersRes.data||[], tickets=ticketsRes.data||[], inv=invRes.data||[];
    state.rows.orders=orders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date(), sevenDaysMs=7*24*60*60*1000;
    const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada'];
    const urgent=orders.filter(o=>String(o.priority||'')==='Urgente').length;
    const pending=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'')).length;
    const late=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>sevenDaysMs).length;
    const done=orders.filter(o=>doneNames.includes(o.service_order_statuses?.name||'')).length;
    const stats=[
      ['users','Usuarios',usersRes.count??users.length,'Perfiles autorizados.'],
      ['orders','Órdenes',ordersRes.count??orders.length,'Órdenes técnicas registradas.'],
      ['urgent','Urgentes',urgent,'Prioridad crítica'],
      ['late','Atrasadas',late,'Más de 7 días abiertas'],
      ['tickets','Tickets',ticketsRes.count??tickets.length,'Solicitudes recibidas'],
      ['inventory','Inventario',invRes.count??inv.length,'Activos e insumos']
    ];
    const statusMap={}; orders.forEach(o=>{ const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1; });
    const cal=state.dashboardCalendar || {month:now.getMonth(), year:now.getFullYear()};
    const first=new Date(cal.year,cal.month,1), last=new Date(cal.year,cal.month+1,0).getDate();
    const offset=(first.getDay()+6)%7, cells=[]; for(let i=0;i<offset;i++)cells.push(null); for(let d=1;d<=last;d++)cells.push(d); while(cells.length%7)cells.push(null);
    const ordersByDay={}; orders.forEach(o=>{ const d=new Date(o.received_at||o.created_at); if(!isNaN(d) && d.getFullYear()===cal.year && d.getMonth()===cal.month){ (ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o); }});
    const yearOptions=[]; for(let y=now.getFullYear()-5;y<=now.getFullYear()+5;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    $('#content').innerHTML=`
      <div class="dash-stats">
        ${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="openDashboardList('${s[0]}')" title="Ver listado"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}
      </div>
      <div class="dash-grid-v89">
        <section class="card"><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${done} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${esc(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('')}</section>
        <section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${dashboardMonthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)" title="Mes anterior">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)" title="Mes siguiente">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')" title="Abrir detalle">OS ${esc(o.satmanager_order||o.order_number)} · ${esc(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
      </div>`;
  };
})();


/* ========================= v8.14 FINAL HOTFIX: Usuarios + Inventario + Dashboard actions ========================= */
(function(){
  const EYE='<svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF='<svg class="icon" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6"/><path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.1 4.3"/><path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 8 10 8a10.7 10.7 0 0 0 4.1-.8"/></svg>';
  function isSA(){ return String(state.profile?.role_name||'') === 'SuperAdmin'; }
  window.togglePasswordField=function(id,btn){ const el=document.getElementById(id); if(!el)return; el.type=el.type==='password'?'text':'password'; if(btn)btn.innerHTML=el.type==='password'?EYE:EYE_OFF; };
  const actionButton=(fn,icon,title,extra='')=>`<button class="icon-mini action-svg ${extra}" title="${esc(title)}" onclick="${fn}">${icon}</button>`;

  window.viewRecord = async function(key,id){
    let row=(state.rows[key]||[]).find(x=>String(x.id)===String(id));
    const table = key==='users'?'profiles':key==='inventory'?'inventory_items':key==='tickets'?'support_tickets':key==='orders'?'service_orders':(crud[key]?.table||key);
    if(!row && table){ const res=await supa.from(table).select('*').eq('id',id).maybeSingle(); if(res.error) return Swal.fire({icon:'error',title:'No se pudo abrir',text:res.error.message}); row=res.data; }
    if(!row) return Swal.fire({icon:'info',title:'Registro no encontrado'});
    let html='';
    if(key==='users'){
      const av=row.avatar_url||'assets/avatar-default.svg';
      html=`<div class="detail-card user-detail modern-detail"><img class="detail-avatar" src="${esc(av)}" onerror="this.src='assets/avatar-default.svg'"><h3>${esc(row.full_name||row.email||'Usuario')}</h3><span class="profile-pill">${esc(row.role_name||'-')}</span><div class="detail-grid"><p><b>Email</b><span>${esc(row.email||'-')}</span></p><p><b>Oficina/Repartición</b><span>${esc(row.office||'-')}</span></p><p><b>Teléfono</b><span>${esc(row.phone||'-')}</span></p><p><b>Activo</b><span>${row.is_active?'Sí':'No'}</span></p><p><b>Fuente</b><span>${esc(row.source||'-')}</span></p><p><b>Actualizado</b><span>${fmt(row.updated_at)}</span></p></div></div>`;
    } else if(key==='inventory'){
      const img=row.image_url||row.notes?.match(/https?:\/\/\S+/)?.[0]||'';
      html=`<div class="detail-card inventory-detail modern-detail">${img?`<img class="detail-item-img" src="${esc(img)}" onerror="this.style.display='none'">`:''}<h3>${esc(row.name||row.code||'Insumo / equipo')}</h3><span class="profile-pill">${esc(row.status||'Disponible')}</span><div class="detail-grid"><p><b>Código</b><span>${esc(row.code||'-')}</span></p><p><b>Categoría</b><span>${esc(row.category||'-')}</span></p><p><b>Marca</b><span>${esc(row.brand||'-')}</span></p><p><b>Empresa / proveedor</b><span>${esc(row.model||'-')}</span></p><p><b>N° serie</b><span>${esc(row.serial_number||'-')}</span></p><p><b>Stock</b><span>${esc(row.stock??0)}</span></p><p><b>Ubicación</b><span>${esc(row.location||'-')}</span></p><p><b>Condición</b><span>${esc(row.condition||'-')}</span></p></div></div>`;
    } else {
      const c=crud[key]||{title:'Registro'}; html=`<div class="detail-card modern-detail"><h3>${esc(c.title)}</h3><div class="detail-grid">${Object.entries(row).filter(([k])=>k!=='id').map(([k,v])=>`<p><b>${esc(k)}</b><span>${fmt(v)}</span></p>`).join('')}</div></div>`;
    }
    Swal.fire({title:'Detalle del registro',html,width:900,customClass:{popup:'tm-modal'}});
  };

  // Corrige acciones del popup de dashboard para que no dependan de funciones locales.
  window.openDashboardList = function(kind){
    const orders=state.rows.orders||[], users=state.rows.users||[], tickets=state.rows.tickets||[], inv=state.rows.inventory||[];
    const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada']; const now=new Date(); const seven=7*24*60*60*1000;
    let title='', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office'];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'')==='Urgente'); key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>seven); key='orders'; cols=['satmanager_order','office','technician_name','fault_description'];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status'];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock'];}
    const buttons=(r)=> key==='orders'
      ? `${actionButton(`viewOrder('${r.id}')`,ico.view,'Ver')}${actionButton(`openOrder('${r.id}')`,ico.edit,'Editar')}${actionButton(`deleteOrder('${r.id}')`,ico.trash,'Eliminar','danger')}`
      : `${actionButton(`viewRecord('${key}','${r.id}')`,ico.view,'Ver')}${actionButton(`openForm('${key}','${r.id}')`,ico.edit,'Editar')}${actionButton(`deleteRow('${key}','${r.id}')`,ico.trash,'Eliminar','danger')}`;
    const body=`<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${esc(c==='technician_name'?extractTechFromOrder(r):(r[c]??''))}</td>`).join('')}<td class="row-actions">${buttons(r)}</td></tr>`).join('')||'<tr><td colspan="9">Sin registros.</td></tr>'}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html:body,width:1120,customClass:{popup:'tm-modal dashboard-modal'}});
  };

  const previousOpenForm = window.openForm;
  function userFormV14(u={}){
    const roles=isSA()?['SuperAdmin','Admin','Técnicos','Usuarios']:['Admin','Técnicos','Usuarios'];
    return `<div class="tm-form user-form v14-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.users}</div><p>Complete los datos solicitados para generar o actualizar el perfil institucional.</p></div><div class="swal-grid">
      <label>Nombre completo<input id="f_full_name" value="${esc(u.full_name||'')}"></label>
      <label>Email<input id="f_email" type="email" value="${esc(u.email||'')}"></label>
      <label>Perfil<select id="f_role_name">${roles.map(r=>`<option value="${r}" ${String(u.role_name||'Usuarios')===r?'selected':''}>${r}</option>`).join('')}</select><small>Solamente SuperAdmin puede asignar otro SuperAdmin.</small></label>
      <label>Oficina/Repartición<input id="f_office" value="${esc(u.office||'')}"></label>
      <label>Teléfono<input id="f_phone" value="${esc(u.phone||'')}"></label>
      <label>Activo<select id="f_is_active"><option value="true" ${u.is_active!==false?'selected':''}>Sí</option><option value="false" ${u.is_active===false?'selected':''}>No</option></select></label>
      <label class="full password-box"><b>Contraseña ${u.id?'nueva / modificar':'inicial'}</b><div class="password-inline"><input id="f_password" type="password" placeholder="Ej: tecnico123456" autocomplete="new-password"><button type="button" class="icon-mini" onclick="togglePasswordField('f_password',this)">${EYE}</button></div><small>Disponible sólo para SuperAdmin. Para editar sin cambiar contraseña, dejar vacío.</small></label>
    </div></div>`;
  }
  function inventoryFormV14(row={}){
    return `<div class="tm-form inventory-form-pro v14-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.inventory}</div><p>${row.id?'Editar trazabilidad del insumo/equipo.':'Registrar nuevo insumo/equipo con trazabilidad, ubicación, serie, barcode e imagen.'}</p></div><div class="swal-grid">
      <label>Nombre / descripción<input id="f_name" value="${esc(row.name||'')}" placeholder="Ej. Arduino UNO"></label>
      <label>Categoría<input id="f_category" value="${esc(row.category||'Robótica / Sensores')}" placeholder="Robótica / Sensores"></label>
      <label>Marca<input id="f_brand" value="${esc(row.brand||'')}" placeholder="Ej. Arduino, ESPRESSIF"></label>
      <label>Empresa / proveedor<input id="f_model" value="${esc(row.model||'')}" placeholder="Ej. BQ Educación / SEMAK IOT LAB"></label>
      <label>Tipo<select id="f_item_type"><option ${String(row.category||'').toLowerCase().includes('equipo')?'selected':''}>Equipo</option><option ${String(row.category||'').toLowerCase().includes('insumo')?'selected':''}>Insumo</option></select></label>
      <label>Código interno<input id="f_code" value="${esc(row.code||'')}" placeholder="Opcional / SKU"></label>
      <label>Cantidad<input id="f_stock" type="number" min="0" value="${esc(row.stock??1)}"></label>
      <label>N° serie<input id="f_serial_number" value="${esc(row.serial_number||'')}" placeholder="Opcional"></label>
      <label>Barcode<input id="f_barcode" value="${esc(row.barcode||'')}" placeholder="Opcional, se genera si queda vacío"></label>
      <label>Ubicación general<select id="f_location"><option ${row.location==='Laboratorio de Robótica'?'selected':''}>Laboratorio de Robótica</option><option ${row.location==='Dirección de Informática'?'selected':''}>Dirección de Informática</option><option ${row.location==='Depósito'?'selected':''}>Depósito</option><option ${row.location==='Otro'?'selected':''}>Otro</option></select></label>
      <label>Locación física<input id="f_zone_location" value="${esc(row.notes?.match(/Locación física: ([^|]+)/)?.[1]?.trim()||'')}" placeholder="Gabinete, Maletín, Cajón"></label>
      <label>Zona<input id="f_zone" value="${esc(row.notes?.match(/Zona: ([^|]+)/)?.[1]?.trim()||'')}" placeholder="Ej. A1, A2, B3"></label>
      <label>Estado<select id="f_status"><option ${row.status==='Disponible'?'selected':''}>Disponible</option><option ${row.status==='Prestado'?'selected':''}>Prestado</option><option ${row.status==='Mantenimiento'?'selected':''}>Mantenimiento</option><option ${row.status==='Baja'?'selected':''}>Baja</option></select></label>
      <label>Stock mínimo<input id="f_min_stock" type="number" min="0" value="${esc(row.min_stock??0)}"></label>
      <label class="full">Condiciones<select id="f_condition" multiple size="6"><option ${String(row.condition||'').includes('C/CARGADOR')?'selected':''}>C/CARGADOR</option><option ${String(row.condition||'').includes('S/CARGADOR')?'selected':''}>S/CARGADOR</option><option ${String(row.condition||'').includes('COMPLETO')?'selected':''}>COMPLETO</option><option ${String(row.condition||'').includes('INCOMPLETO')?'selected':''}>INCOMPLETO</option><option ${String(row.condition||'').includes('Nuevo')?'selected':''}>Nuevo</option><option ${String(row.condition||'').includes('Usado')?'selected':''}>Usado</option></select><small>Puede seleccionar varias condiciones con Ctrl/Cmd.</small></label>
      <label class="full">Imagen del insumo/equipo<input id="f_image_url" value="${esc(row.image_url||'')}" placeholder="URL o imagen base64 opcional"></label>
      <label class="full">Notas<textarea id="f_notes" rows="4" placeholder="Observaciones internas">${esc(row.notes||'')}</textarea></label>
    </div></div>`;
  }
  window.openForm = async function(key,id=null){
    if(key==='users'){
      if(!isSA()) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Sólo SuperAdmin puede crear o editar usuarios.'});
      let row=id?(state.rows.users||[]).find(x=>String(x.id)===String(id)):{};
      if(id && !row){ const r=await supa.from('profiles').select('*').eq('id',id).maybeSingle(); row=r.data||{}; }
      const {value}=await Swal.fire({title:id?'Editar Usuario':'Nuevo Usuario',html:userFormV14(row||{}),width:900,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{
        const v=collect(['full_name','email','role_name','office','phone','is_active','password']);
        v.email=String(v.email||'').trim().toLowerCase(); v.is_active=String(v.is_active)==='true'||v.is_active===true;
        if(!v.full_name||!v.email){Swal.showValidationMessage('Nombre completo y email son obligatorios.'); return false;}
        if(v.role_name==='SuperAdmin'&&!isSA()){Swal.showValidationMessage('Sólo SuperAdmin puede asignar SuperAdmin.'); return false;}
        if(v.password&&String(v.password).length<6){Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres.'); return false;}
        return v;
      }});
      if(!value)return;
      const payload={p_email:value.email,p_full_name:value.full_name,p_role_name:value.role_name,p_office:value.office||null,p_phone:value.phone||null,p_is_active:value.is_active,p_password:value.password||null};
      const {data,error}=await supa.rpc('superadmin_upsert_user_profile',payload);
      if(error)return Swal.fire({icon:'error',title:'No se pudo guardar el usuario',text:error.message});
      await notify(id?'Actualización en Usuarios':'Nuevo usuario',`${state.profile.full_name} ${id?'actualizó':'creó'} el usuario ${value.email}.`,'users',data?.id||id||null);
      await Swal.fire({icon:'success',title:'Usuario guardado',timer:1400,showConfirmButton:false}); route('users'); return;
    }
    if(key==='inventory'){
      let row=id?(state.rows.inventory||[]).find(x=>String(x.id)===String(id)):{};
      if(id && !row){ const r=await supa.from('inventory_items').select('*').eq('id',id).maybeSingle(); row=r.data||{}; }
      const {value}=await Swal.fire({title:id?'Editar insumo / equipo':'Nuevo insumo / equipo',html:inventoryFormV14(row||{}),width:900,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{
        const v=collect(['name','category','brand','model','code','stock','serial_number','barcode','location','status','min_stock','condition','image_url','notes','zone','zone_location']);
        if(!v.name){Swal.showValidationMessage('Nombre / descripción es obligatorio.'); return false;}
        const type=document.getElementById('f_item_type')?.value||''; if(type && !String(v.category||'').toLowerCase().includes(type.toLowerCase())) v.category=type+(v.category?' / '+v.category:'');
        const cond=Array.from(document.getElementById('f_condition')?.selectedOptions||[]).map(o=>o.value); v.condition=cond.join(', ')||v.condition||'Nuevo';
        const extra=[]; if(v.zone_location) extra.push('Locación física: '+v.zone_location); if(v.zone) extra.push('Zona: '+v.zone); if(v.notes) extra.push(v.notes);
        v.notes=extra.join(' | ')||null; delete v.zone; delete v.zone_location;
        v.stock=Number(v.stock||0); v.min_stock=Number(v.min_stock||0); if(!v.barcode) v.barcode=String(Date.now()).slice(-12);
        return v;
      }});
      if(!value)return;
      const res=id?await supa.from('inventory_items').update(value).eq('id',id):await supa.from('inventory_items').insert(value);
      if(res.error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
      await Swal.fire({icon:'success',title:'Inventario guardado',timer:1400,showConfirmButton:false}); route('inventory'); return;
    }
    return previousOpenForm ? previousOpenForm(key,id) : null;
  };
})();


/* ========================= v8.15 FINAL HOTFIX: Auth UI + Dashboard actions + Mobile header ========================= */
(function(){
  const SVG = {
    view:'<svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    edit:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash:'<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
    go:'<svg class="icon" viewBox="0 0 24 24"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>'
  };
  const safeEsc = (v)=>String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const safeFmt = (v)=>{
    if(v===true) return 'Sí'; if(v===false) return 'No';
    if(v===null||v===undefined||v==='') return '-';
    const str=String(v); if(/^\d{4}-\d{2}-\d{2}/.test(str)){ const d=new Date(str); if(!isNaN(d)) return d.toLocaleString('es-AR'); }
    return safeEsc(str);
  };
  function iconBtn(fn, icon, title, extra=''){
    return `<button type="button" class="icon-mini action-svg ${extra}" title="${safeEsc(title)}" onclick="${fn}">${icon}</button>`;
  }
  function tableForRecord(title, row){
    return `<div class="detail-card modern-detail"><h3>${safeEsc(title)}</h3><div class="detail-grid">${Object.entries(row||{}).filter(([k])=>!['id','raw','satmanager_raw'].includes(k)).map(([k,v])=>`<p><b>${safeEsc(k)}</b><span>${safeFmt(v)}</span></p>`).join('')}</div></div>`;
  }
  window.viewRecord = async function(key,id){
    try{
      const table = key==='users'?'profiles':key==='inventory'?'inventory_items':key==='tickets'?'support_tickets':key==='orders'?'service_orders':(window.crud?.[key]?.table || ({roles:'roles',notifications:'notifications',loans:'loans'}[key]));
      let row = (window.state?.rows?.[key]||[]).find(x=>String(x.id)===String(id));
      if(!row && table){ const res=await supa.from(table).select('*').eq('id',id).maybeSingle(); if(res.error) throw res.error; row=res.data; }
      if(!row) return Swal.fire({icon:'info',title:'Registro no encontrado'});
      let html='';
      if(key==='users'){
        const av=row.avatar_url||'assets/avatar-default.svg';
        html=`<div class="detail-card user-detail modern-detail"><img class="detail-avatar" src="${safeEsc(av)}" onerror="this.src='assets/avatar-default.svg'"><h3>${safeEsc(row.full_name||row.email||'Usuario')}</h3><span class="profile-pill">${safeEsc(row.role_name||'-')}</span><div class="detail-grid"><p><b>Email</b><span>${safeEsc(row.email||'-')}</span></p><p><b>Oficina/Repartición</b><span>${safeEsc(row.office||'-')}</span></p><p><b>Teléfono</b><span>${safeEsc(row.phone||'-')}</span></p><p><b>Activo</b><span>${row.is_active?'Sí':'No'}</span></p><p><b>Fuente</b><span>${safeEsc(row.source||'-')}</span></p><p><b>Actualizado</b><span>${safeFmt(row.updated_at)}</span></p></div></div>`;
      }else if(key==='inventory'){
        const img=row.image_url||'';
        html=`<div class="detail-card inventory-detail modern-detail">${img?`<img class="detail-item-img" src="${safeEsc(img)}" onerror="this.style.display='none'">`:''}<h3>${safeEsc(row.name||row.code||'Insumo / equipo')}</h3><span class="profile-pill">${safeEsc(row.status||'Disponible')}</span><div class="detail-grid"><p><b>Código</b><span>${safeEsc(row.code||'-')}</span></p><p><b>Categoría</b><span>${safeEsc(row.category||'-')}</span></p><p><b>Marca</b><span>${safeEsc(row.brand||'-')}</span></p><p><b>Empresa / proveedor</b><span>${safeEsc(row.model||'-')}</span></p><p><b>N° serie</b><span>${safeEsc(row.serial_number||'-')}</span></p><p><b>Stock</b><span>${safeEsc(row.stock??0)}</span></p><p><b>Ubicación</b><span>${safeEsc(row.location||'-')}</span></p><p><b>Condición</b><span>${safeEsc(row.condition||'-')}</span></p></div></div>`;
      }else html=tableForRecord('Detalle del registro', row);
      Swal.fire({title:'Detalle del registro',html,width:920,customClass:{popup:'tm-modal'}});
    }catch(e){ Swal.fire({icon:'error',title:'No se pudo abrir',text:e.message||String(e)}); }
  };
  window.openDashboardList = function(kind){
    const sr=window.state?.rows||{}; const orders=sr.orders||[], users=sr.users||[], tickets=sr.tickets||[], inv=sr.inventory||[];
    const done=['Lista p/Retirar','Terminada','Finalizada','Entregada']; const now=new Date(); const seven=7*24*60*60*1000;
    let title='Registros', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office'];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'')==='Urgente'); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!done.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at))>seven); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status'];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock'];}
    const actions=(r)=> key==='orders'
      ? `${iconBtn(`viewOrder('${r.id}')`,SVG.view,'Ver')}${iconBtn(`openOrder('${r.id}')`,SVG.edit,'Editar')}${iconBtn(`deleteOrder('${r.id}')`,SVG.trash,'Eliminar','danger')}`
      : `${iconBtn(`viewRecord('${key}','${r.id}')`,SVG.view,'Ver')}${iconBtn(`openForm('${key}','${r.id}')`,SVG.edit,'Editar')}${iconBtn(`deleteRow('${key}','${r.id}')`,SVG.trash,'Eliminar','danger')}`;
    const html=`<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${safeEsc(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${safeEsc(r[c]??'')}</td>`).join('')}<td class="row-actions">${actions(r)}</td></tr>`).join('')||'<tr><td colspan="9">Sin registros.</td></tr>'}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:1120,customClass:{popup:'tm-modal dashboard-modal'}});
  };
})();

/* ========================= v8.16 URGENT HOTFIX: Auth rows + Dashboard counted lists ========================= */
(function(){
  const safe = (v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const doneNames=['Lista p/Retirar','Terminada','Finalizada','Entregada'];
  const sevenMs=7*24*60*60*1000;
  async function fetchRows(table, select='*', order='created_at'){
    let q=supa.from(table).select(select,{count:'exact'});
    if(order) q=q.order(order,{ascending:false});
    const r=await q;
    if(r.error){ console.warn('fetchRows',table,r.error.message); return {data:[],count:0,error:r.error}; }
    return {data:r.data||[],count:r.count??(r.data||[]).length,error:null};
  }
  window.renderDashboard = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [or,ur,tr,ir] = await Promise.all([
      fetchRows('service_orders','*,service_order_statuses(name,color)','received_at'),
      fetchRows('profiles','*','created_at'),
      fetchRows('support_tickets','*','created_at'),
      fetchRows('inventory_items','*','created_at')
    ]);
    const orders=or.data, users=ur.data, tickets=tr.data, inv=ir.data;
    state.rows.orders=orders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date();
    const urgent=orders.filter(o=>String(o.priority||'')==='Urgente').length;
    const pending=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'')).length;
    const late=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && !isNaN(new Date(o.received_at||o.created_at)) && (now-new Date(o.received_at||o.created_at))>sevenMs).length;
    const done=orders.filter(o=>doneNames.includes(o.service_order_statuses?.name||'')).length;
    const stats=[['users','Usuarios',ur.count,'Perfiles autorizados.'],['orders','Órdenes',or.count,'Órdenes técnicas registradas.'],['urgent','Urgentes',urgent,'Prioridad crítica'],['late','Atrasadas',late,'Más de 7 días abiertas'],['tickets','Tickets',tr.count,'Solicitudes recibidas'],['inventory','Inventario',ir.count,'Activos e insumos']];
    const statusMap={}; orders.forEach(o=>{const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1;});
    state.dashboardCalendar = state.dashboardCalendar || {month:now.getMonth(), year:now.getFullYear()};
    const cal=state.dashboardCalendar;
    const first=new Date(cal.year,cal.month,1), last=new Date(cal.year,cal.month+1,0).getDate();
    const offset=(first.getDay()+6)%7, cells=[]; for(let i=0;i<offset;i++) cells.push(null); for(let d=1;d<=last;d++) cells.push(d); while(cells.length%7) cells.push(null);
    const ordersByDay={}; orders.forEach(o=>{const d=new Date(o.received_at||o.created_at); if(!isNaN(d)&&d.getFullYear()===cal.year&&d.getMonth()===cal.month){(ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o);}});
    const yearOptions=[]; for(let y=now.getFullYear()-5;y<=now.getFullYear()+5;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    $('#content').innerHTML=`<div class="dash-stats">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="openDashboardList('${s[0]}')"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}</div><div class="dash-grid-v89"><section class="card"><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${done} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${safe(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('')}</section><section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${dashboardMonthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')">OS ${safe(o.satmanager_order||o.order_number)} · ${safe(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section></div>`;
  };
  window.changeDashboardMonth=function(delta){const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; const d=new Date(cal.year,cal.month+(parseInt(delta,10)||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; renderDashboard();};
  window.changeDashboardYear=function(y){state.dashboardCalendar=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; state.dashboardCalendar.year=parseInt(y,10)||new Date().getFullYear(); renderDashboard();};
  window.openDashboardList = async function(kind){
    if(!state.rows.orders?.length && kind!=='users') await renderDashboard();
    const orders=state.rows.orders||[], users=state.rows.users||[], tickets=state.rows.tickets||[], inv=state.rows.inventory||[];
    const now=new Date(); let title='Registros', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office'];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'')==='Urgente'); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!doneNames.includes(o.service_order_statuses?.name||'') && !isNaN(new Date(o.received_at||o.created_at)) && (now-new Date(o.received_at||o.created_at))>sevenMs); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status'];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock'];}
    const act=(r)=> key==='orders' ? `<button class="icon-mini" onclick="viewOrder('${r.id}')">${ico.view}</button><button class="icon-mini" onclick="Swal.close();route('orders');setTimeout(()=>openOrder('${r.id}'),400)">${ico.edit}</button><button class="icon-mini danger" onclick="deleteOrder('${r.id}')">${ico.trash}</button>` : `<button class="icon-mini" onclick="viewRecord('${key}','${r.id}')">${ico.view}</button><button class="icon-mini" onclick="Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${r.id}'),400)">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('${key}','${r.id}')">${ico.trash}</button>`;
    const html=`<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${safe(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${safe(r[c]??'')}</td>`).join('')}<td class="row-actions">${act(r)}</td></tr>`).join('')||'<tr><td colspan="9">Sin registros.</td></tr>'}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:1120,customClass:{popup:'tm-modal dashboard-modal'}});
  };
})();


/* ========================= v8.17 FINAL URGENTE: Login Auth, Dashboard modales y acciones robustas ========================= */
(function(){
  const esc17 = (v)=>String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const DONE17 = ['Lista p/Retirar','Terminada','Finalizada','Entregada','Cerrada'];
  const SEVEN17 = 7*24*60*60*1000;
  const svgBtn = (js,svg,title,cls='') => `<button class="icon-mini ${cls}" type="button" title="${esc17(title)}" onclick="${js}">${svg}</button>`;

  window.dashboardFetchRows17 = async function(table, select='*', order='created_at', limit=5000){
    try{
      let q = supa.from(table).select(select,{count:'exact'}).limit(limit);
      if(order) q = q.order(order,{ascending:false});
      const {data,error,count} = await q;
      if(error){ console.warn('dashboardFetchRows17', table, error.message); return {data:[],count:0,error}; }
      return {data:data||[],count:count ?? (data||[]).length,error:null};
    }catch(e){ console.warn('dashboardFetchRows17 exception', table, e); return {data:[],count:0,error:e}; }
  };

  window.dashboardMonthName = window.dashboardMonthName || function(month,year){return new Date(year,month,1).toLocaleDateString('es-AR',{month:'long',year:'numeric'});};
  window.changeDashboardMonth = function(delta){ const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; const d=new Date(cal.year,cal.month+(parseInt(delta,10)||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; window.renderDashboard(); };
  window.changeDashboardYear = function(y){ const now=new Date(); state.dashboardCalendar=state.dashboardCalendar||{month:now.getMonth(),year:now.getFullYear()}; state.dashboardCalendar.year=parseInt(y,10)||now.getFullYear(); window.renderDashboard(); };

  window.renderDashboard = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [or,ur,tr,ir] = await Promise.all([
      dashboardFetchRows17('service_orders','*,service_order_statuses(name,color)','received_at',5000),
      dashboardFetchRows17('profiles','*','created_at',5000),
      dashboardFetchRows17('support_tickets','*','created_at',5000),
      dashboardFetchRows17('inventory_items','*','created_at',5000)
    ]);
    const orders=or.data||[], users=ur.data||[], tickets=tr.data||[], inv=ir.data||[];
    state.rows.orders=orders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date();
    const urgent=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente').length;
    const pending=orders.filter(o=>!DONE17.includes(o.service_order_statuses?.name||'')).length;
    const late=orders.filter(o=>!DONE17.includes(o.service_order_statuses?.name||'') && !isNaN(new Date(o.received_at||o.created_at)) && (now-new Date(o.received_at||o.created_at))>SEVEN17).length;
    const done=orders.filter(o=>DONE17.includes(o.service_order_statuses?.name||'')).length;
    const stats=[
      ['users','Usuarios',users.length,'Perfiles autorizados.'],
      ['orders','Órdenes',orders.length,'Órdenes técnicas registradas.'],
      ['urgent','Urgentes',urgent,'Prioridad crítica'],
      ['late','Atrasadas',late,'Más de 7 días abiertas'],
      ['tickets','Tickets',tickets.length,'Solicitudes recibidas'],
      ['inventory','Inventario',inv.length,'Activos e insumos']
    ];
    const statusMap={}; orders.forEach(o=>{const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1;});
    state.dashboardCalendar=state.dashboardCalendar||{month:now.getMonth(),year:now.getFullYear()};
    const cal=state.dashboardCalendar;
    const first=new Date(cal.year,cal.month,1); const last=new Date(cal.year,cal.month+1,0).getDate();
    const offset=(first.getDay()+6)%7; const cells=[]; for(let i=0;i<offset;i++) cells.push(null); for(let d=1;d<=last;d++) cells.push(d); while(cells.length%7) cells.push(null);
    const ordersByDay={}; orders.forEach(o=>{const d=new Date(o.received_at||o.created_at); if(!isNaN(d)&&d.getFullYear()===cal.year&&d.getMonth()===cal.month){(ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o);}});
    const yearOptions=[]; for(let y=now.getFullYear()-5;y<=now.getFullYear()+5;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    $('#content').innerHTML = `
      <div class="dash-stats">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="openDashboardList('${s[0]}')"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}</div>
      <div class="dash-grid-v89">
        <section class="card"><h2>Alertas operativas</h2><p>Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${done} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${esc17(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('')||'<p>Sin estados registrados.</p>'}</section>
        <section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${dashboardMonthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)" title="Mes anterior">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)" title="Mes siguiente">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')">OS ${esc17(o.satmanager_order||o.order_number)} · ${esc17(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
      </div>`;
  };

  window.openDashboardList = async function(kind){
    const [or,ur,tr,ir] = await Promise.all([
      dashboardFetchRows17('service_orders','*,service_order_statuses(name,color)','received_at',5000),
      dashboardFetchRows17('profiles','*','created_at',5000),
      dashboardFetchRows17('support_tickets','*','created_at',5000),
      dashboardFetchRows17('inventory_items','*','created_at',5000)
    ]);
    const orders=or.data||[], users=ur.data||[], tickets=tr.data||[], inv=ir.data||[];
    state.rows.orders=orders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date(); let title='Registros contabilizados', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office'];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente'); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!DONE17.includes(o.service_order_statuses?.name||'') && !isNaN(new Date(o.received_at||o.created_at)) && (now-new Date(o.received_at||o.created_at))>SEVEN17); key='orders'; cols=['order_number','office','professional_technician','fault_description'];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status'];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock'];}
    const action=(r)=> key==='orders'
      ? `${svgBtn(`viewOrder('${r.id}')`,ico.view,'Ver')}${svgBtn(`Swal.close();route('orders');setTimeout(()=>openOrder('${r.id}'),350)`,ico.edit,'Editar')}${svgBtn(`deleteOrder('${r.id}')`,ico.trash,'Eliminar','danger')}`
      : `${svgBtn(`viewRecord('${key}','${r.id}')`,ico.view,'Ver')}${svgBtn(`Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${r.id}'),350)`,ico.edit,'Editar')}${svgBtn(`deleteRow('${key}','${r.id}')`,ico.trash,'Eliminar','danger')}`;
    const body = `<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${esc17(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${esc17(r[c]??'')}</td>`).join('')}<td class="row-actions">${action(r)}</td></tr>`).join('') || `<tr><td colspan="${cols.length+1}">Sin registros.</td></tr>`}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html:body,width:1120,customClass:{popup:'tm-modal dashboard-modal'}});
  };

  window.viewRecord = window.viewRecord || async function(key,id){
    const row=(state.rows[key]||[]).find(x=>x.id===id);
    if(!row) return Swal.fire({icon:'info',title:'Registro no encontrado'});
    Swal.fire({title:'Detalle',html:`<pre style="text-align:left;white-space:pre-wrap">${esc17(JSON.stringify(row,null,2))}</pre>`,width:860});
  };
})();

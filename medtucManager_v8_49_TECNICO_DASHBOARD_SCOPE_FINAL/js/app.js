'use strict';
/* app.js corregido v8.24 - FIX usuarios: envía p_id/id a admin-create-user */

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
  offices:'<svg class="icon" viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1M9 13h1M9 17h1M15 13h1M15 17h1"/></svg>',
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
  ['notifications','Notificaciones',ico.bell], ['offices','Dtos/Oficinas',ico.offices], ['profile','Mi Perfil',ico.profile], ['settings','Configuraciones',ico.settings], ['logout','Cerrar Sesión',ico.logout]
];
const crud = {
  users:{table:'profiles',title:'Usuarios',desc:'ABM de usuarios institucionales y perfiles autorizados.',fields:['full_name','email','role_name','office','phone','is_active'],labels:['Nombre completo','Email','Perfil','Oficina/Repartición','Teléfono','Activo'],select:'*'},
  roles:{table:'roles',title:'Roles y Permisos',desc:'Perfiles institucionales: SuperAdmin, Admin, Técnicos y Usuarios.',fields:['name','description','is_system'],labels:['Perfil','Descripción','Sistema'],select:'*'},
  inventory:{table:'inventory_items',title:'Inventario',desc:'Stock, insumos, equipos y trazabilidad por código/serie.',fields:['code','name','category','brand','model','serial_number','stock','min_stock','location','status','condition','notes'],labels:['Código','Nombre','Categoría','Marca','Modelo','N° Serie','Stock','Stock mínimo','Ubicación','Estado','Condición','Notas'],select:'*'},
  loans:{table:'loans',title:'Gestión de Préstamos',desc:'Solicitudes, aprobaciones, devoluciones y seguimiento.',fields:['requester_name','requester_email','office','item_description','quantity','start_at','due_at','status','observations'],labels:['Solicitante','Email','Oficina','Insumo/Equipo','Cantidad','Inicio','Vencimiento','Estado','Observaciones'],select:'*'},
  tickets:{table:'support_tickets',title:'Soporte Ticket',desc:'Tickets recibidos desde el formulario público /soporteticket.',fields:['requester_name','requester_email','requester_phone','office','area','subject','incidence_type','description','priority','status'],labels:['Solicitante','Email','Teléfono','Oficina','Área','Asunto','Incidencia','Descripción','Prioridad','Estado'],select:'*'},
  notifications:{table:'notifications',title:'Notificaciones',desc:'Avisos automáticos, cambios de estado y auditoría operativa.',fields:['title','body','module','target_role','is_read'],labels:['Título','Detalle','Módulo','Perfil destino','Leída'],select:'*'},
  offices:{table:'offices',title:'Dtos/Oficinas',desc:'Departamentos, reparticiones, oficinas, dependencias y habitaciones centralizadas para todos los módulos.',fields:['department','repartition','office_name','dependency','room','name','address','phone','email','is_active'],labels:['Departamento','Repartición','Oficina','Dependencia','Habitación','Nombre normalizado','Dirección','Teléfono','Email','Activo'],select:'*'}
};

function fmt(v) {
  if (v === true) return '<span class="badge ok">Activo</span>';
  if (v === false) return '<span class="badge danger">Inactivo</span>';
  if (v === null || v === undefined || v === '') return '-';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(s)) { const d = new Date(s); return isNaN(d.getTime()) ? esc(s) : d.toLocaleString('es-AR'); }
  return esc(v);
}
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" id="brandToggle" title="Colapsar/expandir menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}</button><button class="avatar-action" id="avatarBtn" title="Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
  $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
  $('#themeBtn').onclick = () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); };
  $('#brandToggle')?.addEventListener('click',()=>document.body.classList.toggle('sidebar-collapsed'));
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
  const html = `<div class="mobile-menu-sheet"><button class="sheet-theme" onclick="toggleThemeFromMenu()">${localStorage.theme==='light'?'Modo oscuro':'Modo claro'} ${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button>${rest.map(m=>`<button class="mobile-menu-item" data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</div>`;
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
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
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>Órdenes técnicas</h2><p>Registro de ingreso, profesional técnico, oficina, estados, informe técnico, insumos utilizados, notas y entrega.</p></div><div class="module-actions"><button class="btn primary" onclick="openOrder()">Nueva orden</button><button class="btn" onclick="openStatusManager()">Estados</button><button class="btn" onclick="importCsv('orders')">Importar SATMANAGER CSV/MDB</button><button class="btn" onclick="exportCsv('orders')">Exportar CSV</button><button class="btn" onclick="exportPdf('orders')">PDF A4</button></div></div><input class="search" placeholder="Buscar por orden, técnico, oficina, equipo, marca, modelo, serie o falla..." oninput="filterRows(this.value)">${pager}${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th><th>Orden</th><th>Ingreso original</th><th>Oficina/Repartición</th><th>Profesional Técnico</th><th>Equipo</th><th>Falla / Diagnóstico</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${pageRows.map(orderRow).join('')}</tbody></table></div>${bulk}${pager}</div>`;
}
window.renderOrders = renderOrders;

window.openOrder = async(id=null)=>{
  await loadStatuses();
  const o=id?(state.rows.orders||[]).find(x=>x.id===id):{};
  const techOptions=await loadTechnicianOptions();
  const officeOptions=await loadOfficeOptions();
  const statusSelect=`<label>Estado<select id="f_status_id"><option value="">Sin estado</option>${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const techSelect=selectHtml('technician_name','Profesional técnico que atiende',techOptions,extractTechFromOrder(o),`onchange="if(this.value==='__manual__'){this.outerHTML='<input id=\'f_technician_name\' placeholder=\'Nombre del profesional técnico\'>'}"`);
  const officeSelect=selectHtml('office','Oficina / Repartición / Secretaría',officeOptions,o?.office||o?.requester_name,`onchange="if(this.value==='__manual__'){this.outerHTML='<input id=\'f_office\' placeholder=\'Nombre de oficina\'>'}"`);
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
  const wait = Swal.fire({title:'Actualizando usuarios técnicos',html:'Sincronizando profesionales técnicos y oficinas desde el sistema legado...',allowOutsideClick:false,didOpen:()=>Swal.showLoading()});
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
  return `<label>Oficina/Repartición<select id="f_office"><option value="">Sin oficina</option>${list.map(o=>`<option value="${esc(o.name)}" data-address="${esc(o.address||'')}" data-phone="${esc(o.phone||'')}" ${cur===o.name?'selected':''}>${esc(o.name)}</option>`).join('')}<option value="__manual__">+ Agregar / escribir otra...</option></select><input id="f_office_manual" class="manual-extra" placeholder="Nueva oficina" style="display:none;margin-top:8px"></label>`;
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${TM_FAVICON_URL}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" title="Colapsar menú"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${themeIcon}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}<span class="notif-badge-count" hidden>0</span></button><button class="avatar-action" id="avatarBtn" title="Cambiar foto / Mi perfil"><img src="${esc(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${esc(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.exit}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${m[1]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
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
      const payload={ p_id:id||value.id||null, id:id||value.id||null, p_email:value.email, p_full_name:value.full_name, p_role_name:value.role_name||'Usuarios', p_office:value.office||null, p_phone:value.phone||null, p_is_active:value.is_active, p_password:value.password||null };
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


/* ========================= v8.18 FINAL: Auth estable + Usuarios/Inventario Pro ========================= */
(function(){
  const safe = (v)=>String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const validName = (v,email)=>{ const s=String(v||'').trim(); if(!s || s==='Invalid Date' || /^\d{4}-\d{2}-\d{2}/.test(s)) return String(email||'Usuario').split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); return s; };
  const asBool = (v)=> v===true || String(v)==='true';
  const svgImg = '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>';
  const svgPalette = '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 4-4 4h-1.5a1.5 1.5 0 0 0 0 3H17a5 5 0 0 1-5 3Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>';

  window.tmFmt = function(v){
    if(v===true) return '<span class="badge ok">Activo</span>';
    if(v===false) return '<span class="badge danger">Inactivo</span>';
    if(v===null || v===undefined || v==='') return '-';
    const s=String(v);
    if(/^\d{4}-\d{2}-\d{2}(T|\s)/.test(s)){ const d=new Date(s); return isNaN(d.getTime()) ? safe(s) : d.toLocaleString('es-AR'); }
    return safe(s);
  };

  async function fetchAll(table, select='*', order='created_at'){
    let q=supa.from(table).select(select).limit(5000);
    if(order) q=q.order(order,{ascending:false});
    const {data,error}=await q;
    if(error){ console.warn(table,error.message); return []; }
    return data||[];
  }

  window.renderUsers18 = async function(){
    page('Usuarios','ABM de usuarios institucionales y perfiles autorizados.');
    const {data,error}=await supa.from('profiles').select('*').order('created_at',{ascending:false}).limit(5000);
    if(error) return showPanelError(error);
    const rows=(data||[]).map(r=>({...r, full_name: validName(r.full_name,r.email)}));
    state.rows.users=rows; state.selected.users=new Set();
    const bulk=`<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('users',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEdit('users')">Editar selección</button><button class="btn danger" onclick="bulkDelete('users')">Eliminar selección</button><span id="sel_users">0 seleccionados</span></div>`;
    $('#content').innerHTML=`<div class="card users-card"><div class="module-head"><div><h2>Usuarios</h2><p>Usuarios sincronizados con Supabase Auth. Las contraseñas se gestionan mediante Edge Function segura.</p></div><div class="module-actions"><button class="btn primary" onclick="openForm('users')">Nuevo</button><button class="btn" onclick="syncProfilesFromAuth18()">Sincronizar Auth</button><button class="btn" onclick="exportCsv('users')">Exportar CSV</button><button class="btn" onclick="exportPdf('users')">PDF A4</button></div></div><input class="search" placeholder="Buscar usuario, email, perfil u oficina..." oninput="filterRows(this.value)">${bulk}<div class="table-wrap"><table><thead><tr><th></th><th>Nombre completo</th><th>Email</th><th>Perfil</th><th>Oficina/Repartición</th><th>Teléfono</th><th>Activo</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(userRow18).join('')||'<tr><td colspan="8">Sin usuarios.</td></tr>'}</tbody></table></div>${bulk}</div>`;
  };
  function userRow18(r){return `<tr data-id="${safe(r.id)}" data-search="${safe(Object.values(r).join(' ').toLowerCase())}"><td><input type="checkbox" onchange="toggleOne('users','${safe(r.id)}',this.checked)"></td><td><b>${safe(validName(r.full_name,r.email))}</b></td><td>${safe(r.email)}</td><td>${safe(r.role_name||'Usuarios')}</td><td>${safe(r.office||'-')}</td><td>${safe(r.phone||'-')}</td><td>${asBool(r.is_active)?'<span class="badge ok">Activo</span>':'<span class="badge danger">Inactivo</span>'}</td><td class="row-actions"><button class="icon-mini" onclick="viewRecord('users','${safe(r.id)}')">${ico.view}</button><button class="icon-mini" onclick="openForm('users','${safe(r.id)}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('users','${safe(r.id)}')">${ico.trash}</button></td></tr>`;}

  async function loadConditions18(){
    try{ const {data,error}=await supa.from('inventory_conditions').select('*').order('name'); if(error) throw error; return data||[]; }catch(e){ return [
      {name:'COMPLETO',color:'#22c55e'},{name:'Nuevo',color:'#3b82f6'},{name:'Usado',color:'#f59e0b'},{name:'C/CARGADOR',color:'#64748b'},{name:'S/CARGADOR',color:'#2563eb'}
    ]; }
  }
  function condBadge18(name,conds){ const c=(conds||[]).find(x=>String(x.name).toLowerCase()===String(name).toLowerCase()); const color=c?.color||'#64748b'; return `<span class="cond-badge" style="--cond:${safe(color)}"><i></i>${safe(name)}</span>`; }
  function parseConds18(v){ return String(v||'').split(',').map(s=>s.trim()).filter(Boolean); }

  window.renderInventory18 = async function(){
    page('Inventario','Trazabilidad por serie o código de barras, préstamos y devoluciones');
    const [items,conds]=await Promise.all([fetchAll('inventory_items','*','created_at'), loadConditions18()]);
    state.rows.inventory=items; state.inventoryConditions=conds; state.selected.inventory=new Set();
    const pager='<div class="pager"><label>Listar <select onchange="state.pagination.inventory={page:1,size:Number(this.value)};renderInventory18()">'+[5,10,25,50,100,500].map(n=>`<option value="${n}" ${(state.pagination.inventory?.size||5)==n?'selected':''}>${n}</option>`).join('')+'</select></label><span>'+items.length+' registros</span></div>';
    const size=state.pagination.inventory?.size||5, pageNo=state.pagination.inventory?.page||1, start=(pageNo-1)*size, pageRows=items.slice(start,start+size), pages=Math.max(1,Math.ceil(items.length/size));
    $('#content').innerHTML=`<div class="card inventory-card-pro"><div class="module-head"><div><h2>Control y trazabilidad</h2><p>Cada insumo permite saber quién lo tiene, marca, empresa/proveedor, locación, zona, estado y código de barras.</p></div><div class="module-actions"><button class="btn" onclick="importCsv('inventory')">Importar CSV</button><button class="btn" onclick="exportCsv('inventory')">Exportar CSV</button><button class="btn" onclick="printInventoryBarcodes18()">Imprimir barcodes</button><button class="btn" onclick="showInventoryCharts18()">Ver gráficos</button><button class="btn primary" onclick="openForm('inventory')">Nuevo insumo</button></div></div><input class="search" placeholder="Buscar por código, item, marca, empresa, serie, barcode, locación o zona" oninput="filterRows(this.value)"><select class="search"><option>Todos los estados</option></select><select class="search"><option>Todos los tipos</option></select><div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('inventory',this.checked)"> Seleccionar todo</label><button class="btn" onclick="generateSelectedCodes18()">Generar código</button><button class="btn" onclick="bulkEdit('inventory')">Editar selección</button><button class="btn danger" onclick="bulkDelete('inventory')">Eliminar selección</button><span id="sel_inventory">0 seleccionados</span></div>${pager}<div class="table-wrap"><table class="inventory-table-pro"><thead><tr><th></th><th>Código</th><th>Tipo</th><th>Marca</th><th>Empresa</th><th>N° serie</th><th>Barcode</th><th>Estado</th><th>Condición</th><th>Locación</th><th>Zona</th><th>Ubicación</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${pageRows.map(r=>inventoryRow18(r,conds)).join('')||'<tr><td colspan="13">Sin inventario.</td></tr>'}</tbody></table></div><div class="pager"><button class="btn" ${pageNo<=1?'disabled':''} onclick="state.pagination.inventory.page--;renderInventory18()">← Anterior</button><b>${pageNo} / ${pages}</b><button class="btn" ${pageNo>=pages?'disabled':''} onclick="state.pagination.inventory.page++;renderInventory18()">Siguiente →</button></div></div>`;
  };
  function inventoryRow18(r,conds){ const img=r.image_url||r.image||''; const code=r.code||r.sku||''; const barcode=r.barcode||code||r.serial_number||''; const condsHtml=parseConds18(r.condition).map(c=>condBadge18(c,conds)).join(' '); return `<tr data-id="${safe(r.id)}" data-search="${safe(Object.values(r).join(' ').toLowerCase())}"><td><input type="checkbox" onchange="toggleOne('inventory','${safe(r.id)}',this.checked)"></td><td><div class="inv-code-cell">${img?`<img src="${safe(img)}" onerror="this.src='assets/avatar-default.svg'">`:svgImg}<div><b>${safe(code||'-')}</b><small>${safe(r.name||'')}</small></div></div></td><td>${safe(r.item_type||r.type||r.category||'-')}</td><td>${safe(r.brand||'-')}</td><td>${safe(r.company||r.provider||r.model||'-')}</td><td>${safe(r.serial_number||'-')}</td><td><div class="barcode-mini"><span>${safe(barcode||'-')}</span></div></td><td><span class="badge ok">${safe(r.status||'Disponible')}</span></td><td>${condsHtml||'-'}</td><td>${safe(r.physical_location||r.location||'-')}</td><td>${safe(r.zone||'-')}</td><td>${safe(r.location||'-')}</td><td class="row-actions"><button class="icon-mini" onclick="viewRecord('inventory','${safe(r.id)}')">${ico.view}</button><button class="icon-mini" onclick="openForm('inventory','${safe(r.id)}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('inventory','${safe(r.id)}')">${ico.trash}</button></td></tr>`; }

  function inventoryForm18(r={},conds=[]){ const condOptions=(conds||[]).map(c=>`<option value="${safe(c.name)}" ${parseConds18(r.condition).includes(c.name)?'selected':''}>${safe(c.name)}</option>`).join(''); return `<div class="tm-form inventory-form-pro v18"><div class="swal-grid">
    <label>Nombre / descripción<input id="f_name" value="${safe(r.name||'')}" placeholder="Ej. Arduino UNO"></label><label>Categoría<input id="f_category" value="${safe(r.category||'')}" placeholder="Robótica / Sensores"></label>
    <label>Marca<input id="f_brand" value="${safe(r.brand||'')}" placeholder="Ej. Arduino, SetVeintiUno"></label><label>Empresa / proveedor<input id="f_company" value="${safe(r.company||r.provider||r.model||'')}" placeholder="Ej. BQ Educación"></label>
    <label>Tipo<select id="f_item_type"><option ${String(r.item_type||r.type||'Equipo')==='Equipo'?'selected':''}>Equipo</option><option ${String(r.item_type||r.type)==='Insumo'?'selected':''}>Insumo</option><option ${String(r.item_type||r.type)==='Herramienta'?'selected':''}>Herramienta</option></select></label><label>Código interno<input id="f_code" value="${safe(r.code||'')}" placeholder="Opcional"></label>
    <label>Cantidad<input id="f_stock" type="number" value="${safe(r.stock??r.quantity??1)}"></label><label>N° serie<input id="f_serial_number" value="${safe(r.serial_number||'')}" placeholder="Opcional"></label>
    <label>Barcode<input id="f_barcode" value="${safe(r.barcode||'')}" placeholder="Opcional, se genera solo"></label><label>Ubicación general<input id="f_location" value="${safe(r.location||'Laboratorio de Robótica')}"></label>
    <label>Locación física<input id="f_physical_location" value="${safe(r.physical_location||'')}" placeholder="Gabinete, Maletín, Cajón"></label><label>Zona<input id="f_zone" value="${safe(r.zone||'')}" placeholder="Ej. A1, A2, B3"></label>
    <label>Estado<select id="f_status"><option ${String(r.status||'Disponible')==='Disponible'?'selected':''}>Disponible</option><option ${String(r.status)==='Prestado'?'selected':''}>Prestado</option><option ${String(r.status)==='Mantenimiento'?'selected':''}>Mantenimiento</option><option ${String(r.status)==='Baja'?'selected':''}>Baja</option></select></label>
    <label class="full">Condiciones <button type="button" class="mini-add" onclick="addInventoryCondition18()">+</button>${svgPalette}<select id="f_condition" multiple size="5">${condOptions}</select><small>Podés seleccionar varias condiciones con Ctrl/Cmd. Usá + para crear una condición con color.</small></label>
    <label class="full">Imagen del insumo/equipo<input id="f_image_file" type="file" accept="image/*"><input id="f_image_url" value="${safe(r.image_url||'')}" placeholder="URL o imagen base64 opcional"></label>
    </div></div>`; }

  window.addInventoryCondition18 = async function(){
    const {value}=await Swal.fire({title:'Nueva condición',html:`<div class="swal-grid"><label>Nombre<input id="new_cond_name" placeholder="Ej. Reparado"></label><label>Color<input id="new_cond_color" type="color" value="#22c55e"></label></div>`,showCancelButton:true,confirmButtonText:'Agregar',customClass:{popup:'tm-modal'},preConfirm:()=>({name:$('#new_cond_name')?.value?.trim(), color:$('#new_cond_color')?.value})});
    if(!value?.name) return;
    try{ await supa.from('inventory_conditions').upsert({name:value.name,color:value.color},{onConflict:'name'}); }catch(e){}
    const sel=$('#f_condition'); if(sel){ const opt=document.createElement('option'); opt.value=value.name; opt.textContent=value.name; opt.selected=true; sel.appendChild(opt); }
  };

  async function imageToBase64(file){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.onerror=rej; fr.readAsDataURL(file); }); }

  const prevOpenForm18 = window.openForm;
  window.openForm = async function(key,id=null){
    if(key==='inventory'){
      const row=id?(state.rows.inventory||[]).find(x=>String(x.id)===String(id))||{}:{};
      const conds=await loadConditions18();
      const {value}=await Swal.fire({title:id?'Editar insumo / equipo':'Nuevo insumo / equipo',html:inventoryForm18(row,conds),width:900,showCancelButton:true,confirmButtonText:id?'Guardar cambios':'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal inventory-modal'},preConfirm:async()=>{
        const selected=Array.from($('#f_condition')?.selectedOptions||[]).map(o=>o.value).join(', ');
        let image=$('#f_image_url')?.value||null; const file=$('#f_image_file')?.files?.[0]; if(file) image=await imageToBase64(file);
        const payload={name:$('#f_name').value,category:$('#f_category').value,brand:$('#f_brand').value,model:$('#f_company').value,company:$('#f_company').value,item_type:$('#f_item_type').value,code:$('#f_code').value||null,stock:Number($('#f_stock').value||1),serial_number:$('#f_serial_number').value||null,barcode:$('#f_barcode').value||$('#f_code').value||$('#f_serial_number').value||null,location:$('#f_location').value,physical_location:$('#f_physical_location').value,zone:$('#f_zone').value,status:$('#f_status').value,condition:selected,image_url:image};
        if(!payload.name) {Swal.showValidationMessage('Nombre / descripción obligatorio.'); return false;} return payload;
      }});
      if(!value) return; const res=id?await supa.from('inventory_items').update(value).eq('id',id):await supa.from('inventory_items').insert(value); if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message}); await Swal.fire({icon:'success',title:'Inventario guardado',timer:1200,showConfirmButton:false}); renderInventory18(); return;
    }
    return prevOpenForm18 ? prevOpenForm18(key,id) : null;
  };

  window.viewRecord = async function(key,id){
    const row=(state.rows[key]||[]).find(x=>String(x.id)===String(id)); if(!row) return Swal.fire({icon:'info',title:'Registro no encontrado'});
    if(key==='users') return Swal.fire({title:'Detalle de usuario',html:`<div class="detail-card user-detail modern-detail"><img class="detail-avatar" src="${safe(row.avatar_url||'assets/avatar-default.svg')}" onerror="this.src='assets/avatar-default.svg'"><h3>${safe(validName(row.full_name,row.email))}</h3><span class="profile-pill">${safe(row.role_name||'-')}</span><div class="detail-grid"><p><b>Email</b><span>${safe(row.email||'-')}</span></p><p><b>Oficina</b><span>${safe(row.office||'-')}</span></p><p><b>Teléfono</b><span>${safe(row.phone||'-')}</span></p><p><b>Activo</b><span>${asBool(row.is_active)?'Sí':'No'}</span></p></div></div>`,width:760,customClass:{popup:'tm-modal'}});
    if(key==='inventory'){ const img=row.image_url||''; const conds=state.inventoryConditions||await loadConditions18(); return Swal.fire({title:'Detalle de inventario',html:`<div class="detail-card inventory-detail modern-detail">${img?`<img class="detail-item-img" src="${safe(img)}" onerror="this.style.display='none'">`:''}<h3>${safe(row.name||row.code||'Insumo / equipo')}</h3><span class="profile-pill">${safe(row.status||'Disponible')}</span><div class="detail-grid"><p><b>ID</b><span>${safe(row.id)}</span></p><p><b>Código</b><span>${safe(row.code||'-')}</span></p><p><b>Insumo</b><span>${safe(row.name||'-')}</span></p><p><b>Tipo</b><span>${safe(row.item_type||row.category||'-')}</span></p><p><b>N° serie</b><span>${safe(row.serial_number||'-')}</span></p><p><b>Código de barras</b><span>${safe(row.barcode||'-')}</span></p><p><b>Estado</b><span>${safe(row.status||'-')}</span></p><p><b>Condición</b><span>${parseConds18(row.condition).map(c=>condBadge18(c,conds)).join(' ')||'-'}</span></p><p><b>Ubicación</b><span>${safe(row.location||'-')}</span></p><p><b>Categoría</b><span>${safe(row.category||'-')}</span></p><p><b>Marca</b><span>${safe(row.brand||'-')}</span></p><p><b>Empresa / proveedor</b><span>${safe(row.company||row.model||'-')}</span></p><p><b>Locación física</b><span>${safe(row.physical_location||'-')}</span></p><p><b>Zona</b><span>${safe(row.zone||'-')}</span></p><p><b>Cantidad</b><span>${safe(row.stock??1)}</span></p></div></div>`,width:760,customClass:{popup:'tm-modal'}}); }
    return Swal.fire({title:'Detalle',html:`<pre style="text-align:left;white-space:pre-wrap">${safe(JSON.stringify(row,null,2))}</pre>`,width:860});
  };

  window.syncProfilesFromAuth18 = async function(){ await supa.rpc('ensure_current_user_profile').catch(()=>null); await renderUsers18(); };
  window.printInventoryBarcodes18 = function(){ window.print(); };
  window.showInventoryCharts18 = function(){ Swal.fire({title:'Gráficos de inventario',html:'<p>Los gráficos usan los registros actualmente cargados del inventario.</p>',customClass:{popup:'tm-modal'}}); };
  window.generateSelectedCodes18 = async function(){ const ids=Array.from(state.selected.inventory||[]); if(!ids.length) return Swal.fire({icon:'info',title:'Seleccione registros'}); for(const id of ids){ const code='SKU-'+String(id).slice(0,8).toUpperCase(); await supa.from('inventory_items').update({code}).eq('id',id); } renderInventory18(); };

  const oldRoute18 = window.route || route;
  try { route = window.route = async function(p){
    if(p==='users') return renderUsers18();
    if(p==='inventory') return renderInventory18();
    return oldRoute18(p);
  }; } catch(e){ window.route = async function(p){ if(p==='users') return renderUsers18(); if(p==='inventory') return renderInventory18(); return oldRoute18(p); }; }
})();


/* ========================= v8.19 FINAL: Auth UX + Usuarios + Inventario estable ========================= */
(function(){
  const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const validText = (v, fb='-') => {
    const s = String(v ?? '').trim();
    return (!s || s === 'Invalid Date' || s === 'null' || s === 'undefined') ? fb : s;
  };
  const nameFromEmail = (email) => String(email||'').split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
  const profileName = (u) => validText(u?.full_name, nameFromEmail(u?.email));
  const boolBadge = (v) => (v===false || String(v)==='false') ? '<span class="badge danger">Inactivo</span>' : '<span class="badge ok">Activo</span>';
  window.fmtProfileCell819 = (v, fb='-') => safe(validText(v, fb));

  const originalFmt819 = window.fmt;
  try {
    window.fmt = function(v){
      if (v === true) return '<span class="badge ok">Activo</span>';
      if (v === false) return '<span class="badge danger">Inactivo</span>';
      const s = String(v ?? '').trim();
      if (!s || s === 'Invalid Date' || s === 'null' || s === 'undefined') return '-';
      if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(s)) {
        const d = new Date(s);
        return isNaN(d.getTime()) ? safe(s) : d.toLocaleString('es-AR');
      }
      return safe(s);
    };
  } catch(e) {}

  async function getUsers819(){
    const { data, error } = await supa.from('profiles').select('*').order('created_at',{ascending:false});
    if(error) throw error;
    return (data||[]).map(u => ({
      ...u,
      full_name: profileName(u),
      role_name: validText(u.role_name,'Usuarios'),
      office: validText(u.office,'-')
    }));
  }

  window.renderUsers18 = window.renderUsers18 || async function(){};
  window.renderUsers819 = async function(){
    page('Usuarios','ABM de usuarios institucionales y perfiles autorizados.');
    let rows=[];
    try { rows = await getUsers819(); } catch(e){ return showPanelError(e); }
    state.rows.users = rows;
    const table = `<div class="card"><div class="module-head"><div><h2>Usuarios</h2><p>Usuarios institucionales sincronizados con Supabase Auth y perfiles del sistema.</p></div><div class="module-actions"><button class="btn primary" onclick="openForm('users')">Nuevo</button><button class="btn" onclick="exportCsv('users')">Exportar CSV</button><button class="btn" onclick="exportPdf('users')">PDF A4</button></div></div>
      <input class="search" placeholder="Buscar en Usuarios..." oninput="filterRows(this.value)">
      <div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('users',this.checked)"> Seleccionar todo</label><button class="btn" onclick="bulkEdit('users')">Editar selección</button><button class="btn danger" onclick="bulkDelete('users')">Eliminar selección</button><span id="sel_users">0 seleccionados</span></div>
      <div class="table-wrap"><table><thead><tr><th></th><th>Nombre completo</th><th>Email</th><th>Perfil</th><th>Oficina/Repartición</th><th>Teléfono</th><th>Activo</th><th>Acciones</th></tr></thead><tbody id="rowsBody">
        ${rows.map(u=>`<tr data-id="${safe(u.id)}" data-search="${safe(Object.values(u).join(' ').toLowerCase())}">
          <td><input type="checkbox" onchange="toggleOne('users','${safe(u.id)}',this.checked)"></td>
          <td>${safe(profileName(u))}</td><td>${safe(u.email||'-')}</td><td>${safe(validText(u.role_name,'Usuarios'))}</td><td>${safe(validText(u.office,'-'))}</td><td>${safe(validText(u.phone,'-'))}</td><td>${boolBadge(u.is_active)}</td>
          <td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewRecord('users','${safe(u.id)}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openForm('users','${safe(u.id)}')">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="deleteRow('users','${safe(u.id)}')">${ico.trash}</button></td>
        </tr>`).join('') || '<tr><td colspan="8">Sin usuarios.</td></tr>'}
      </tbody></table></div></div>`;
    $('#content').innerHTML = table;
  };

  function userForm819(u={}){
    const roles=['SuperAdmin','Admin','Técnicos','Usuarios'];
    const canSA=String(state.profile?.role_name||'')==='SuperAdmin';
    const currentRole = validText(u.role_name,'Usuarios');
    return `<div class="tm-form user-form v819"><div class="tm-form-header"><div class="tm-form-avatar">${ico.users}</div><p>Complete los datos solicitados para crear o actualizar el usuario institucional.</p></div><div class="swal-grid">
      <label>Nombre completo<input id="f_full_name" value="${safe(profileName(u))}" placeholder="Ej. Ing. Gerardo Toro"></label>
      <label>Email<input id="f_email" type="email" value="${safe(u.email||'')}" ${u.id?'readonly':''}></label>
      <label>Perfil<select id="f_role_name">${roles.map(r=>`<option value="${r}" ${currentRole===r?'selected':''} ${r==='SuperAdmin'&&!canSA?'disabled':''}>${r}</option>`).join('')}</select><small>Solamente SuperAdmin puede asignar otro SuperAdmin.</small></label>
      <label>Oficina/Repartición<input id="f_office" value="${safe(validText(u.office,''))}" placeholder="Dirección de Informática"></label>
      <label>Teléfono<input id="f_phone" value="${safe(validText(u.phone,''))}"></label>
      <label>Activo<select id="f_is_active"><option value="true" ${u.is_active!==false?'selected':''}>Sí</option><option value="false" ${u.is_active===false?'selected':''}>No</option></select></label>
      ${canSA?`<label class="full password-box"><b>Contraseña ${u.id?'nueva / modificar':'inicial'}</b><div class="password-row"><input id="f_password" type="password" placeholder="${u.id?'Dejar vacío para no cambiar':'Mínimo 6 caracteres'}" autocomplete="new-password"><button type="button" class="icon-mini" onclick="togglePasswordField('f_password',this)">${ico.view}</button></div><small>Para crear usuarios desde la PWA debe estar desplegada la Edge Function <b>admin-create-user</b>. Si no está desplegada, cree el usuario desde Authentication → Users y luego sincronice el perfil.</small></label>`:''}
    </div></div>`;
  }

  const oldOpenForm819 = window.openForm;
  window.openForm = async function(key,id=null){
    if(key==='users'){
      if(String(state.profile?.role_name||'')!=='SuperAdmin') return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Sólo SuperAdmin puede crear o editar usuarios.'});
      let row = id ? (state.rows.users||[]).find(x=>String(x.id)===String(id)) : {};
      row = row || {};
      const {value}=await Swal.fire({title:id?'Editar Usuario':'Nuevo Usuario',html:userForm819(row),width:900,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal user-modal'},preConfirm:()=>{
        const v={
          // FIX v8.24: enviar SIEMPRE el UUID del perfil/Auth al editar.
          // Sin p_id, la Edge Function intenta crear usuario y Supabase Auth devuelve 400/500.
          p_id: id || row?.id || null,
          id: id || row?.id || null,
          p_email: ($('#f_email')?.value||'').trim().toLowerCase(),
          p_full_name: ($('#f_full_name')?.value||'').trim(),
          p_role_name: $('#f_role_name')?.value||'Usuarios',
          p_office: ($('#f_office')?.value||'').trim()||null,
          p_phone: ($('#f_phone')?.value||'').trim()||null,
          p_is_active: String($('#f_is_active')?.value)==='true',
          p_password: $('#f_password')?.value||''
        };
        if(!v.p_email || !v.p_full_name) { Swal.showValidationMessage('Nombre completo y email son obligatorios.'); return false; }
        if(!id && (!v.p_password || v.p_password.length<6)) { Swal.showValidationMessage('Para crear usuario indique contraseña mínima de 6 caracteres.'); return false; }
        if(v.p_password && v.p_password.length<6) { Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres.'); return false; }
        return v;
      }});
      if(!value) return;
      try{
        const fn = await supa.functions.invoke('admin-create-user', { body:value });
        if(fn.error) throw fn.error;
        if(fn.data && fn.data.error) throw new Error(fn.data.error);
        await Swal.fire({icon:'success',title:'Usuario guardado',text:'Auth y perfil sincronizados correctamente.',timer:1400,showConfirmButton:false});
        await renderUsers819();
      }catch(e){
        await Swal.fire({icon:'error',title:'No se pudo guardar el usuario',html:`${safe(e.message||String(e))}<br><br><b>Verifique:</b> Edge Function <code>admin-create-user</code> desplegada y variable <code>SUPABASE_SERVICE_ROLE_KEY</code> configurada.`});
      }
      return;
    }
    return oldOpenForm819 ? oldOpenForm819(key,id) : null;
  };

  const oldViewRecord819 = window.viewRecord;
  window.viewRecord = async function(key,id){
    if(key==='users'){
      const row=(state.rows.users||[]).find(x=>String(x.id)===String(id));
      if(!row) return Swal.fire({icon:'info',title:'Usuario no encontrado'});
      return Swal.fire({title:'Detalle de usuario',html:`<div class="detail-card user-detail modern-detail"><img class="detail-avatar" src="${safe(row.avatar_url||'assets/avatar-default.svg')}" onerror="this.src='assets/avatar-default.svg'"><h3>${safe(profileName(row))}</h3><span class="profile-pill">${safe(validText(row.role_name,'Usuarios'))}</span><div class="detail-grid"><p><b>Email</b><span>${safe(row.email||'-')}</span></p><p><b>Oficina</b><span>${safe(validText(row.office,'-'))}</span></p><p><b>Teléfono</b><span>${safe(validText(row.phone,'-'))}</span></p><p><b>Activo</b><span>${row.is_active!==false?'Sí':'No'}</span></p><p><b>Fuente</b><span>${safe(validText(row.source,'-'))}</span></p></div></div>`,width:760,customClass:{popup:'tm-modal'}});
    }
    return oldViewRecord819 ? oldViewRecord819(key,id) : null;
  };

  // Route final: asegura que Usuarios use el render corregido.
  const routePrev819 = window.route || route;
  try {
    route = window.route = async function(p){
      if(p==='users') return renderUsers819();
      return routePrev819(p);
    };
  } catch(e) { window.route = async function(p){ if(p==='users') return renderUsers819(); return routePrev819(p); }; }

  // Aviso técnico claro cuando Supabase Auth devuelve 500.
  window.explainAuth500819 = function(){
    return 'Supabase Auth está devolviendo 500 en /auth/v1/token. Ejecute el SQL v8.19 para limpiar triggers rotos, confirmar usuarios y reparar identidades. Luego use Authentication → Users o la Edge Function para crear cuentas.';
  };
})();


/* ========================= v8.30 FINAL - RBAC + Oficinas/Reparticiones + permisos UI ========================= */
(function(){
  const safeHtml = (v)=> (typeof esc==='function'?esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const MODULE_DEFS_V830 = [
    ['dashboard','Dashboard'],['users','Usuarios'],['roles','Roles y Permisos'],['orders','Órdenes de Servicio'],['inventory','Inventario'],['loans','Gestión de Préstamos'],['tickets','Soporte Ticket'],['offices','Dtos/Oficinas'],['notifications','Notificaciones'],['profile','Mi Perfil'],['settings','Configuraciones']
  ];
  const ACTION_DEFS_V830 = [['view','Ver'],['create','Crear'],['edit','Editar'],['delete','Eliminar'],['import','Importar CSV'],['export','Exportar CSV/PDF']];
  const DEFAULT_ROLE_PERMS_V830 = {
    SuperAdmin: MODULE_DEFS_V830.reduce((a,m)=>{a[m[0]]=ACTION_DEFS_V830.map(x=>x[0]);return a;},{}),
    Admin: {dashboard:['view'],orders:['view','create','edit','export'],inventory:['view','create','edit','export'],loans:['view','create','edit','export'],tickets:['view','create','edit','export'],offices:['view'],notifications:['view','create'],profile:['view','edit']},
    'Técnicos': {dashboard:['view'],orders:['view','edit'],inventory:['view'],tickets:['view','edit'],notifications:['view'],profile:['view','edit']},
    Usuarios: {dashboard:['view'],tickets:['view','create'],loans:['view','create'],notifications:['view'],profile:['view','edit']}
  };
  window.rolePermsV830 = DEFAULT_ROLE_PERMS_V830;
  function roleName(){ return String(state.profile?.role_name||'Usuarios'); }
  function isSA830(){ return roleName()==='SuperAdmin'; }
  window.canModuleV830 = function(module, action='view'){
    if(isSA830()) return true;
    const p=(window.rolePermsV830?.[roleName()]||DEFAULT_ROLE_PERMS_V830[roleName()]||{});
    return (p[module]||[]).includes(action) || (action!=='view' && (p[module]||[]).includes('all'));
  };
  async function loadRolePermsV830(){
    try{
      const {data,error}=await supa.from('role_module_permissions').select('*');
      if(error) throw error;
      const out=JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMS_V830));
      (data||[]).forEach(r=>{ out[r.role_name] ||= {}; out[r.role_name][r.module_key] ||= []; if(r.can_view&&!out[r.role_name][r.module_key].includes('view'))out[r.role_name][r.module_key].push('view'); if(r.can_create&&!out[r.role_name][r.module_key].includes('create'))out[r.role_name][r.module_key].push('create'); if(r.can_edit&&!out[r.role_name][r.module_key].includes('edit'))out[r.role_name][r.module_key].push('edit'); if(r.can_delete&&!out[r.role_name][r.module_key].includes('delete'))out[r.role_name][r.module_key].push('delete'); if(r.can_import&&!out[r.role_name][r.module_key].includes('import'))out[r.role_name][r.module_key].push('import'); if(r.can_export&&!out[r.role_name][r.module_key].includes('export'))out[r.role_name][r.module_key].push('export'); });
      window.rolePermsV830=out;
    }catch(e){ console.warn('role_module_permissions fallback', e.message); }
  }
  const oldLoadPermissions830 = window.loadPermissions || (typeof loadPermissions!=='undefined'?loadPermissions:null);
  try{ window.loadPermissions = loadPermissions = async function(){ if(oldLoadPermissions830) await oldLoadPermissions830(); await loadRolePermsV830(); }; }catch(e){ window.loadPermissions=async()=>{await loadRolePermsV830();}; }

  function iconFor830(k){ return (ico && (ico[k]||ico.settings)) || ''; }
  function allowedModules830(){
    return modules.filter(m=> m[0]==='logout' || canModuleV830(m[0],'view'));
  }
  const oldRenderShell830 = window.renderShell || (typeof renderShell!=='undefined'?renderShell:null);
  window.renderShellV830 = function(){
    const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
    const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
    const filtered = allowedModules830();
    const mobileMain = filtered.filter(m=>['dashboard','inventory','orders','tickets','loans'].includes(m[0])).slice(0,4);
    document.getElementById('app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><img src="${safeHtml(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${safeHtml(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${safeHtml(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${filtered.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank">Invítame un Cafecito</a></div></aside><main class="main"><section class="topbar"><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?themeMoonSvg():themeSunSvg()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}</button><button class="avatar-action" id="avatarBtn" title="Mi perfil"><img src="${safeHtml(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${safeHtml(state.profile.full_name || state.profile.email)}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock">${mobileMain.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}<button id="mobileMoreBtn">☰<span>Más</span></button></nav></div>`;
    document.querySelectorAll('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
    $('#themeBtn').onclick = () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShellV830(); route(state.page); };
    $('#fullBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    $('#notifyBtn').onclick = () => route('notifications');
    $('#avatarBtn').onclick = () => route('profile');
    $('#logoutBtn').onclick = () => route('logout');
    $('#mobileMoreBtn').onclick = () => { const rest=filtered.filter(m=>!mobileMain.some(x=>x[0]===m[0])); Swal.fire({title:'Menú',html:`<div class="mobile-menu-sheet">${rest.map(m=>`<button class="mobile-menu-item" data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</div>`,showConfirmButton:false,showCloseButton:true,customClass:{popup:'tm-modal mobile-menu-modal'}}); setTimeout(()=>document.querySelectorAll('.mobile-menu-item').forEach(b=>b.onclick=()=>{Swal.close();route(b.dataset.page);}),80); };
  };
  try{ window.renderShell = renderShell = window.renderShellV830; }catch(e){ window.renderShell=window.renderShellV830; }

  async function fetchOffices830(){ try{ const {data,error}=await supa.from('offices').select('*').order('name'); if(error) throw error; return data||[]; }catch(e){ console.warn(e.message); return []; } }
  function officeName830(o){ return [o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name || '-'; }
  window.officeOptionsV830 = async function(selected=''){
    const rows=await fetchOffices830();
    return rows.map(o=>`<option value="${safeHtml(officeName830(o))}" ${String(selected)===officeName830(o)?'selected':''}>${safeHtml(officeName830(o))}</option>`).join('');
  };
  window.renderOfficesV830 = async function(){
    page('Dtos/Oficinas','Departamentos, reparticiones, oficinas, dependencias y habitaciones centralizadas para todos los módulos.');
    let rows=await fetchOffices830(); state.rows.offices=rows; state.selected.offices=new Set();
    const bulk=`<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('offices',this.checked)"> Seleccionar todo</label><button class="btn danger" onclick="bulkDelete('offices')">Eliminar selección</button><span id="sel_offices">0 seleccionados</span></div>`;
    $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Dtos/Oficinas</h2><p>Origen único para selects de Usuarios, Órdenes, Inventario, Préstamos, Tickets, Notificaciones y Mi Perfil.</p></div><div class="module-actions">${canModuleV830('offices','create')?`<button class="btn primary" onclick="openOfficeV830()">Nuevo</button><button class="btn" onclick="syncOfficesFromOrdersV830()">Sincronizar desde órdenes</button>`:''}<button class="btn" onclick="exportCsv('offices')">Exportar CSV</button><button class="btn" onclick="exportPdf('offices')">PDF A4</button></div></div><input class="search" placeholder="Buscar departamento, repartición, oficina, dependencia o habitación..." oninput="filterRows(this.value)">${bulk}<div class="table-wrap"><table><thead><tr><th></th><th>Departamento</th><th>Repartición</th><th>Oficina</th><th>Dependencia</th><th>Habitación</th><th>Activo</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(o=>`<tr data-id="${o.id}" data-search="${safeHtml(Object.values(o).join(' ').toLowerCase())}"><td><input type="checkbox" onchange="toggleOne('offices','${o.id}',this.checked)"></td><td>${safeHtml(o.department||'-')}</td><td>${safeHtml(o.repartition||'-')}</td><td>${safeHtml(o.office_name||o.name||'-')}</td><td>${safeHtml(o.dependency||'-')}</td><td>${safeHtml(o.room||'-')}</td><td>${o.is_active!==false?'<span class="badge ok">Activo</span>':'<span class="badge danger">Inactivo</span>'}</td><td class="row-actions"><button class="icon-mini" onclick="viewOfficeV830('${o.id}')">${ico.view}</button>${canModuleV830('offices','edit')?`<button class="icon-mini" onclick="openOfficeV830('${o.id}')">${ico.edit}</button>`:''}${canModuleV830('offices','delete')?`<button class="icon-mini danger" onclick="deleteOfficeV830('${o.id}')">${ico.trash}</button>`:''}</td></tr>`).join('')||'<tr><td colspan="8">Sin oficinas.</td></tr>'}</tbody></table></div>${bulk}</div>`;
  };
  window.openOfficeV830 = async function(id=null){
    if(!canModuleV830('offices',id?'edit':'create')) return Swal.fire({icon:'warning',title:'Sin permiso'});
    const r=id?(state.rows.offices||[]).find(x=>String(x.id)===String(id))||{}:{};
    const html=`<div class="tm-form"><div class="swal-grid"><label>Departamento<input id="f_department" value="${safeHtml(r.department||'')}" placeholder="Ej. Dirección de Informática"></label><label>Repartición<input id="f_repartition" value="${safeHtml(r.repartition||'')}"></label><label>Oficina<input id="f_office_name" value="${safeHtml(r.office_name||r.name||'')}"></label><label>Dependencia<input id="f_dependency" value="${safeHtml(r.dependency||'')}"></label><label>Habitación<input id="f_room" value="${safeHtml(r.room||'')}"></label><label>Activo<select id="f_is_active"><option value="true" ${r.is_active!==false?'selected':''}>Sí</option><option value="false" ${r.is_active===false?'selected':''}>No</option></select></label></div></div>`;
    const {value}=await Swal.fire({title:id?'Editar oficina':'Nueva oficina',html,width:850,showCancelButton:true,confirmButtonText:'Guardar',customClass:{popup:'tm-modal'},preConfirm:()=>{const v={department:$('#f_department').value.trim(),repartition:$('#f_repartition').value.trim(),office_name:$('#f_office_name').value.trim(),dependency:$('#f_dependency').value.trim(),room:$('#f_room').value.trim(),is_active:$('#f_is_active').value==='true'}; v.name=[v.department,v.repartition,v.office_name,v.dependency,v.room].filter(Boolean).join(' / '); if(!v.department&&!v.repartition&&!v.office_name){Swal.showValidationMessage('Indique al menos Departamento, Repartición u Oficina.');return false;} return v;}});
    if(!value)return;
    const q=id?await supa.from('offices').update(value).eq('id',id):await supa.from('offices').insert(value);
    if(q.error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:q.error.message});
    await Swal.fire({icon:'success',title:'Guardado',timer:1200,showConfirmButton:false}); renderOfficesV830();
  };
  window.viewOfficeV830 = function(id){ const r=(state.rows.offices||[]).find(x=>String(x.id)===String(id)); if(!r)return; Swal.fire({title:'Detalle oficina',html:`<div class="detail-grid"><p><b>Departamento</b><span>${safeHtml(r.department||'-')}</span></p><p><b>Repartición</b><span>${safeHtml(r.repartition||'-')}</span></p><p><b>Oficina</b><span>${safeHtml(r.office_name||r.name||'-')}</span></p><p><b>Dependencia</b><span>${safeHtml(r.dependency||'-')}</span></p><p><b>Habitación</b><span>${safeHtml(r.room||'-')}</span></p></div>`,customClass:{popup:'tm-modal'},width:720}); };
  window.deleteOfficeV830 = async function(id){ const ok=await Swal.fire({icon:'warning',title:'¿Eliminar oficina?',showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; const {error}=await supa.from('offices').delete().eq('id',id); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); renderOfficesV830(); };
  window.syncOfficesFromOrdersV830 = async function(){ const {error}=await supa.rpc('sync_offices_from_service_orders'); if(error)return Swal.fire({icon:'error',title:'No se pudo sincronizar',text:error.message}); await Swal.fire({icon:'success',title:'Oficinas actualizadas desde órdenes'}); renderOfficesV830(); };

  window.renderRolesPermsV830 = async function(){
    if(!isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    await loadRolePermsV830();
    const roles=['SuperAdmin','Admin','Técnicos','Usuarios'];
    const matrix=roles.map(role=>`<tr><td><b>${role}</b></td>${MODULE_DEFS_V830.map(([mk,ml])=>`<td><div class="perm-cell"><b>${ml}</b>${ACTION_DEFS_V830.map(([ak,al])=>`<label class="checkline"><input type="checkbox" data-role="${role}" data-module="${mk}" data-action="${ak}" ${(window.rolePermsV830[role]?.[mk]||[]).includes(ak)?'checked':''} ${role==='SuperAdmin'?'disabled':''}> ${al}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
    $('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales de la PWA.</p></div><div class="module-actions"><button class="btn primary" onclick="saveRolePermsV830()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${MODULE_DEFS_V830.map(m=>`<th>${m[1]}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>`;
  };
  window.saveRolePermsV830 = async function(){
    const roles=['Admin','Técnicos','Usuarios']; const rows=[];
    roles.forEach(role=>MODULE_DEFS_V830.forEach(([mk])=>{ const r={role_name:role,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false}; ACTION_DEFS_V830.forEach(([ak])=>{ const el=document.querySelector(`input[data-role="${role}"][data-module="${mk}"][data-action="${ak}"]`); if(el?.checked) r['can_'+ak]=true; }); rows.push(r); }));
    const del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin'); if(del.error)return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
    const ins=await supa.from('role_module_permissions').insert(rows); if(ins.error)return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
    await loadRolePermsV830(); await Swal.fire({icon:'success',title:'Permisos guardados'}); renderShellV830(); route('roles');
  };

  const oldRoute830 = window.route || (typeof route!=='undefined'?route:null);
  window.route = async function(p){
    if(p==='logout'){ await supa.auth.signOut(); window.location.replace('./index.html'); return; }
    if(p==='offices') { if(!canModuleV830('offices','view')) return Swal.fire({icon:'warning',title:'Sin permiso',text:'Su perfil no tiene acceso a este módulo.'}); state.page=p; syncNavActive?.(); return renderOfficesV830(); }
    if(p==='roles') { if(!canModuleV830('roles','view')) return Swal.fire({icon:'warning',title:'Sin permiso'}); state.page=p; syncNavActive?.(); return renderRolesPermsV830(); }
    if(!canModuleV830(p,'view') && p!=='profile'){ return Swal.fire({icon:'warning',title:'Sin permiso',text:'Su perfil no tiene permisos para acceder a este módulo.'}); }
    return oldRoute830 ? oldRoute830(p) : null;
  };
  try{ route=window.route; }catch(e){}

  // insertar módulo oficinas si no existe
  if(!modules.some(m=>m[0]==='offices')) modules.splice(Math.max(0, modules.findIndex(m=>m[0]==='notifications')),0,['offices','Dtos/Oficinas',ico.settings]);
  crud.offices={table:'offices',title:'Dtos/Oficinas',desc:'Departamentos, reparticiones, oficinas, dependencias y habitaciones.',fields:['department','repartition','office_name','dependency','room','is_active'],labels:['Departamento','Repartición','Oficina','Dependencia','Habitación','Activo'],select:'*'};

  // Wrapper acciones CRUD generales por permiso
  const oldOpenForm830=window.openForm;
  window.openForm=async function(key,id=null){ if(key==='offices') return openOfficeV830(id); if(key!=='users' && !canModuleV830(key,id?'edit':'create')) return Swal.fire({icon:'warning',title:'Sin permiso'}); return oldOpenForm830?oldOpenForm830(key,id):null; };
  const oldDeleteRow830=window.deleteRow; window.deleteRow=async function(key,id){ if(key==='offices') return deleteOfficeV830(id); if(!canModuleV830(key,'delete')) return Swal.fire({icon:'warning',title:'Sin permiso'}); return oldDeleteRow830?oldDeleteRow830(key,id):null; };
})();


/* ============================
   MEDTUC v8.31 overrides
   RBAC + Oficinas + paginación + UI
   ============================ */

function themeSunSvg(){return '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';}
function themeMoonSvg(){return '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>';}

(function injectV831Css(){
  if(document.getElementById('v831-css')) return;
  const st=document.createElement('style'); st.id='v831-css';
  st.textContent=`
    .sidebar .brand{cursor:pointer;user-select:none}
    body.sidebar-collapsed .sidebar{width:82px}
    body.sidebar-collapsed .brand div,body.sidebar-collapsed .nav span,body.sidebar-collapsed .sidebar-foot{display:none!important}
    body.sidebar-collapsed .layout{grid-template-columns:82px 1fr}
    body.sidebar-collapsed .brand{justify-content:center}
    body.sidebar-collapsed .brand img{max-width:44px}
    .tm-pager{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:12px 0}
    .tm-pager .pager-left,.tm-pager .pager-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .tm-pager select{width:auto;min-width:92px}
    .perm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:14px}
    .perm-card{background:rgba(255,255,255,.04);border:1px solid rgba(148,163,184,.24);border-radius:14px;padding:12px}
    .perm-card b{display:block;margin-bottom:8px}
    .perm-card label{display:flex;align-items:center;gap:8px;margin:5px 0;font-weight:600}
    .theme-svg svg{width:20px;height:20px}
  `;
  document.head.appendChild(st);
})();

function rbModuleLabel(m){
  return ({dashboard:'Dashboard',users:'Usuarios',roles:'Roles y Permisos',orders:'Órdenes de Servicio',inventory:'Inventario',loans:'Gestión de Préstamos',tickets:'Soporte Ticket',notifications:'Notificaciones',offices:'Dtos/Oficinas',settings:'Configuraciones',profile:'Mi Perfil'})[m]||m;
}
function rbActions(){return ['view','create','edit','delete','export','import'];}
function rbActionLabel(a){return ({view:'Ver',create:'Crear',edit:'Editar',delete:'Eliminar',export:'Exportar',import:'Importar'})[a]||a;}
function permCode(m,a){return `${m}.${a}`;}

async function fetchRolePermissionCodes(roleId){
  const {data,error}=await supa.from('role_permissions').select('permissions(code)').eq('role_id', roleId);
  if(error){ console.warn(error.message); return []; }
  return (data||[]).map(x=>x.permissions?.code).filter(Boolean);
}
async function saveRolePermissions(roleId,codes){
  const {data:perms,error:e1}=await supa.from('permissions').select('id,code').in('code', codes.length?codes:['__none__']);
  if(e1) throw e1;
  const {error:e2}=await supa.from('role_permissions').delete().eq('role_id', roleId);
  if(e2) throw e2;
  const rows=(perms||[]).map(p=>({role_id:roleId,permission_id:p.id}));
  if(rows.length){
    const {error:e3}=await supa.from('role_permissions').insert(rows);
    if(e3) throw e3;
  }
}
function canAction(module, action){
  if(state.profile?.role_name==='SuperAdmin') return true;
  return state.permissions?.includes(`${module}.${action}`);
}
function pagerHtml(key,total){
  state.pagination[key] ||= {page:1,size:10};
  const pg=state.pagination[key], pages=Math.max(1,Math.ceil(total/pg.size));
  if(pg.page>pages) pg.page=pages;
  return `<div class="tm-pager" data-key="${key}">
    <div class="pager-left"><span>Mostrar</span><select onchange="setPageSize('${key}',this.value)">${[5,10,25,50,100,500,1000].map(n=>`<option value="${n}" ${pg.size==n?'selected':''}>${n}</option>`).join('')}</select><span>registros</span></div>
    <div class="pager-right"><button class="btn" onclick="setPage('${key}',${pg.page-1})">← Atrás</button><span>Página ${pg.page} de ${pages} · ${total} registros</span><button class="btn" onclick="setPage('${key}',${pg.page+1})">Siguiente →</button></div>
  </div>`;
}
window.setPageSize=(key,val)=>{state.pagination[key] ||= {}; state.pagination[key].size=parseInt(val,10)||10; state.pagination[key].page=1; renderCrud(key);};
window.setPage=(key,page)=>{state.pagination[key] ||= {page:1,size:10}; state.pagination[key].page=Math.max(1,page); renderCrud(key);};

async function renderCrud(key){
  const c = crud[key]; page(c.title, c.desc);
  if(!canAction(key,'view') && !['profile'].includes(key)){
    $('#content').innerHTML='<div class="card"><h2>Acceso restringido</h2><p>Tu perfil no tiene permisos para ver este módulo.</p></div>'; return;
  }
  let query = supa.from(c.table).select(c.select);
  if(key !== 'roles') query = query.order('created_at', { ascending:false });
  const { data, error } = await query;
  if (error) return showPanelError(error);
  let rows = data || [];
  if (key === 'roles') rows = rows.filter(r => ['SuperAdmin','Admin','Técnicos','Usuarios'].includes(r.name));
  state.rows[key] = rows; state.selected[key] = new Set();
  const columns = c.fields.slice(0, key==='offices'?8:6);
  state.pagination[key] ||= {page:1,size:10};
  const pg=state.pagination[key]; const total=rows.length; const pages=Math.max(1,Math.ceil(total/pg.size)); if(pg.page>pages) pg.page=pages;
  const visible=rows.slice((pg.page-1)*pg.size, pg.page*pg.size);
  const bulk = `<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('${key}',this.checked)"> Seleccionar todo</label>${canAction(key,'edit')?`<button class="btn" onclick="bulkEdit('${key}')">Editar selección</button>`:''}${canAction(key,'delete')?`<button class="btn danger" onclick="bulkDelete('${key}')">Eliminar selección</button>`:''}<span id="sel_${key}">0 seleccionados</span></div>`;
  const syncBtn = key==='users' && canAction(key,'edit') ? `<button class="btn success" onclick="syncTechniciansAndOffices()">Actualizar técnicos</button>` : '';
  const newBtn = canAction(key,'create') ? `<button class="btn primary" onclick="openForm('${key}')">Nuevo</button>` : '';
  const importBtn = canAction(key,'import') ? `<button class="btn" onclick="importCsv('${key}')">Importar CSV</button>` : '';
  const exportBtn = canAction(key,'export') ? `<button class="btn" onclick="exportCsv('${key}')">Exportar CSV</button><button class="btn" onclick="exportPdf('${key}')">PDF A4</button>` : '';
  const pag=pagerHtml(key,total);
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>${c.title}</h2><p>${key==='offices'?'Datos centralizados para selects de usuarios, órdenes, inventario, préstamos, tickets, notificaciones y perfiles.':key==='roles'?'Configure módulos y acciones por perfil institucional.':'Acciones disponibles según permisos del perfil.'}</p></div><div class="module-actions">${syncBtn}${newBtn}${importBtn}${exportBtn}</div></div><input class="search" placeholder="Buscar en ${c.title}..." oninput="filterRows(this.value)">${pag}${bulk}<div class="table-wrap"><table><thead><tr><th class="select-col"></th>${columns.map((f,i)=>`<th>${esc(c.labels[i])}</th>`).join('')}<th>Acciones</th></tr></thead><tbody id="rowsBody">${visible.map(r=>rowHtml(key,r,columns)).join('')}</tbody></table></div>${bulk}${pag}</div>`;
}
function rowHtml(key, r, columns){
  const canEdit=canAction(key,'edit'), canDel=canAction(key,'delete');
  return `<tr data-id="${r.id}" data-search="${esc(Object.values(r).join(' ').toLowerCase())}"><td class="select-col"><input type="checkbox" onchange="toggleOne('${key}','${r.id}',this.checked)"></td>${columns.map(f=>`<td>${fmt(r[f])}</td>`).join('')}<td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewRow('${key}','${r.id}')">${ico.view}</button>${canEdit?`<button class="icon-mini" title="Editar" onclick="openForm('${key}','${r.id}')">${ico.edit}</button>`:''}${canDel?`<button class="icon-mini danger" title="Eliminar" onclick="deleteRow('${key}','${r.id}')">${ico.trash}</button>`:''}</td></tr>`;
}
window.filterRows = (q) => {
  const term=String(q||'').toLowerCase();
  $$('#rowsBody tr').forEach(tr=>tr.style.display=tr.dataset.search.includes(term)?'':'none');
};

const oldInputHtmlV831 = inputHtml;
inputHtml = function(id,label,value,type='text'){
  const val=value??'';
  if (['office','location','physical_location'].includes(id)){
    const list=state.offices||[];
    return `<label>${esc(label)}<select id="f_${id}"><option value="">Sin seleccionar</option>${list.map(o=>{const on=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name || ''; return `<option value="${esc(on)}" ${val===on||val===o.name||val===o.office_name?'selected':''}>${esc(on)}</option>`}).join('')}</select></label>`;
  }
  return oldInputHtmlV831(id,label,value,type);
};

const oldOpenFormV831 = window.openForm;
window.openForm = async function(key,id=null){
  if(key==='roles') return openRolePermissionsForm(id);
  state.offices = state.offices || await fetchOffices();
  return oldOpenFormV831(key,id);
};

async function openRolePermissionsForm(id){
  const row = id ? (state.rows.roles||[]).find(x=>x.id===id) : {};
  const roleName=row?.name||'Usuarios';
  const modulesList=['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','settings'];
  const current=id?await fetchRolePermissionCodes(id):[];
  const permHtml=modulesList.map(m=>`<div class="perm-card"><b>${esc(rbModuleLabel(m))}</b>${rbActions().map(a=>`<label><input type="checkbox" class="perm-check" value="${permCode(m,a)}" ${current.includes(permCode(m,a))?'checked':''}> ${rbActionLabel(a)}</label>`).join('')}</div>`).join('');
  const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.roles}</div><p>Defina módulos y acciones habilitadas para el perfil.</p></div><div class="swal-grid"><label>Perfil<input id="f_name" value="${esc(roleName)}" ${id?'readonly':''}></label><label>Descripción<input id="f_description" value="${esc(row?.description||'')}"></label><label>Sistema<select id="f_is_system"><option value="true" ${row?.is_system?'selected':''}>Sí</option><option value="false" ${!row?.is_system?'selected':''}>No</option></select></label></div><div class="perm-grid">${permHtml}</div></div>`;
  const {value}=await Swal.fire({title:id?'Editar Roles y Permisos':'Nuevo Rol',html,width:980,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>({name:$('#f_name').value.trim(),description:$('#f_description').value.trim(),is_system:$('#f_is_system').value==='true',codes:$$('.perm-check:checked').map(x=>x.value)})});
  if(!value) return;
  try{
    let roleId=id;
    const payload={name:value.name,description:value.description,is_system:value.is_system,updated_at:new Date().toISOString()};
    if(id){ const {error}=await supa.from('roles').update(payload).eq('id',id); if(error) throw error; }
    else { const {data,error}=await supa.from('roles').insert(payload).select('id').single(); if(error) throw error; roleId=data.id; }
    await saveRolePermissions(roleId,value.codes);
    await Swal.fire({icon:'success',title:'Permisos guardados'});
    await loadPermissions();
    route('roles');
  }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
}

const oldLoadProfileV831 = loadProfile;
loadProfile = async function(){
  await oldLoadProfileV831();
  if(state.profile?.role_name==='Tecnicos') state.profile.role_name='Técnicos';
};


/* ========================= v8.32 FINAL HOTFIX: UX, RBAC, offices selects, print & notifications ========================= */
(function(){
  const css = document.createElement('style');
  css.textContent = `
    .auth-body .login-left input{pointer-events:auto!important;user-select:text!important;caret-color:#7c5cff!important;color:#0f172a!important;background:#f7f4ff!important;position:relative!important;z-index:2!important}
    .auth-body .login-left label{pointer-events:auto!important;position:relative!important;z-index:2!important}
    .theme-svg .icon{width:21px;height:21px;stroke-width:1.9}.theme-svg svg{filter:none!important}
    .notify-trigger{position:relative}.notify-badge{position:absolute;right:-5px;top:-7px;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#ef4444;color:#fff;font-size:11px;font-weight:900;display:none;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(239,68,68,.38)}.notify-badge.show{display:flex}
    .sidebar.collapsed{width:92px;padding-inline:14px}.layout:has(.sidebar.collapsed){grid-template-columns:92px 1fr}.sidebar.collapsed .brand div,.sidebar.collapsed .nav span,.sidebar.collapsed .sidebar-foot{display:none}.sidebar.collapsed .brand{justify-content:center}.sidebar.collapsed .brand img{width:52px}.sidebar.collapsed .nav button{justify-content:center}
    .roles-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.roles-matrix table{min-width:1180px}.roles-matrix td{min-width:150px}.perm-cell label{line-height:1.2}
    @media print{.cut-line{border-top:1.5px dashed #777!important;width:100%!important;margin:10mm auto 8mm!important}.copy{min-height:auto!important;page-break-inside:avoid!important}.copy + .copy{margin-top:0!important}}
  `;
  document.head.appendChild(css);
})();

function tmSunIconV832(){return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.75v2.1M12 19.15v2.1M4.55 4.55l1.48 1.48M17.97 17.97l1.48 1.48M2.75 12h2.1M19.15 12h2.1M4.55 19.45l1.48-1.48M17.97 6.03l1.48-1.48"></path></svg>';}
function tmMoonIconV832(){return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.45A7.85 7.85 0 0 1 9.55 3.8 8.85 8.85 0 1 0 20.2 14.45Z"></path><path d="M15.8 4.2h.01M18.7 7.2h.01"></path></svg>';}
try{ themeSunSvg = tmSunIconV832; themeMoonSvg = tmMoonIconV832; }catch(_){ window.themeSunSvg=tmSunIconV832; window.themeMoonSvg=tmMoonIconV832; }

async function fetchOfficesV832(){
  try{ const {data,error}=await supa.from('offices').select('*').eq('is_active',true).order('department',{ascending:true}).order('repartition',{ascending:true}).order('office_name',{ascending:true}); if(error) throw error; return data||[]; }catch(e){ console.warn('fetchOfficesV832',e.message); return []; }
}
function officeLabelV832(o){ return [o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name || '-'; }
async function ensureOfficesV832(){ state.offices = await fetchOfficesV832(); return state.offices; }

const _inputHtmlV832 = inputHtml;
inputHtml = function(id,label,value,type='text'){
  const officeFields = ['office','location','physical_location','requester_office'];
  if(officeFields.includes(id)){
    const val = value ?? '';
    const list = state.offices || [];
    return `<label>${esc(label)}<select id="f_${id}"><option value="">Sin seleccionar</option>${list.map(o=>{const on=officeLabelV832(o); return `<option value="${esc(on)}" ${String(val)===on||String(val)===o.name||String(val)===o.office_name?'selected':''}>${esc(on)}</option>`}).join('')}</select></label>`;
  }
  return _inputHtmlV832(id,label,value,type);
};

const _openFormV832 = window.openForm;
window.openForm = async function(key,id=null){
  await ensureOfficesV832();
  return _openFormV832(key,id);
};

const _renderShellV832 = window.renderShellV830 || window.renderShell;
window.renderShellV830 = window.renderShell = function(){
  _renderShellV832();
  const brand = document.querySelector('.brand');
  if(brand){ brand.id='brandToggle'; brand.title='Colapsar/expandir menú'; brand.onclick=()=>document.querySelector('.sidebar')?.classList.toggle('collapsed'); }
  const t = document.getElementById('themeBtn');
  if(t){ t.classList.add('theme-svg'); t.innerHTML = localStorage.theme==='light' ? tmMoonIconV832() : tmSunIconV832(); }
  const n = document.getElementById('notifyBtn');
  if(n && !n.querySelector('.notify-badge')) n.insertAdjacentHTML('beforeend','<span id="notifyBadge" class="notify-badge">0</span>');
  updateNotificationCounterV832();
};

async function updateNotificationCounterV832(){
  try{
    if(!state?.profile) return;
    const {data,error}=await supa.from('notifications').select('id,target_role,target_user,is_read').eq('is_read',false).limit(500);
    if(error) throw error;
    const uid=state.user?.id, role=state.profile?.role_name;
    const count=(data||[]).filter(n=>!n.target_user && !n.target_role || n.target_user===uid || n.target_role===role).length;
    const badge=document.getElementById('notifyBadge');
    if(badge){ badge.textContent=count>99?'99+':String(count); badge.classList.toggle('show',count>0); }
  }catch(e){ console.warn('notification counter',e.message); }
}
window.updateNotificationCounterV832=updateNotificationCounterV832;

const _routeV832 = window.route;
window.route = async function(p){
  const r = await _routeV832(p);
  updateNotificationCounterV832();
  return r;
};

window.printOrder = function(id,type){
  const o=(state.rows.orders||[]).find(x=>String(x.id)===String(id)); if(!o) return;
  const isEntrega = type==='entrega';
  const title = isEntrega ? 'Constancia de egreso de equipo' : 'Constancia de ingreso de equipo';
  const logo = state.settings.logo_light_url || state.settings.logo_dark_url || '';
  const line = (label, val)=>`<b>${label}:</b> ${esc(val||'-')}<br>`;
  const falla = esc(o.fault_description||'-');
  const informe = esc(o.technical_report||'-');
  const solucion = esc(o.solution||o.observations||'-');
  const detail = isEntrega
    ? `<div class="box"><b>Detalle de egreso</b><br><b>Informe técnico:</b> ${informe}<br><b>Solución / Observaciones:</b> ${solucion}</div>`
    : `<div class="box"><b>Falla informada</b><br>${falla}</div>`;
  const copy=(label)=>`<section class="copy"><div class="rotulo">${logo?`<img src="${esc(logo)}">`:''}<div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box">${line('Orden',o.satmanager_order||o.order_number)}${line('Estado',o.service_order_statuses?.name||'')}${line('Ingreso original',fmt(o.received_at))}${line('Solicitante',o.requester_name)}${line('Oficina',o.office)}${line('Teléfono',o.requester_phone)}</div><div class="box">${line('Equipo',[o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '))}${line('N° serie',o.serial_number)}${line('Accesorios/Insumos',o.accessories)}</div>${detail}<p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`;
  const html=`<html><head><title>${title}</title><style>@page{size:A4;margin:10mm}body{font-family:Arial,sans-serif;margin:0;color:#111;font-size:11px}.copy{padding:0 0 7mm 0}.rotulo{display:flex;gap:12px;align-items:center;border-bottom:1px solid #111;padding-bottom:6px;margin-bottom:6px}.rotulo img{width:100px;max-height:46px;object-fit:contain}.rotulo h1{font-size:16px;margin:0}.box{border:1px solid #111;padding:7px;margin:5px 0;line-height:1.35}.firmas{margin-top:12px}.cut-line{border-top:1.5px dashed #777;width:100%;margin:9mm auto 7mm}.copy:last-child{padding-bottom:0}</style></head><body>${copy('Copia para Oficina/Repartición')}<div class="cut-line"></div>${copy('Copia para Dirección de Informática - Área Soporte Técnico')}<script>window.onload=()=>window.print()<\/script></body></html>`;
  const w=window.open('','_blank'); w.document.write(html); w.document.close();
};

function rbModuleLabel(m){return ({dashboard:'Dashboard',users:'Usuarios',roles:'Roles y Permisos',orders:'Órdenes de Servicio',inventory:'Inventario',loans:'Gestión de Préstamos',tickets:'Soporte Ticket',notifications:'Notificaciones',offices:'Dtos/Oficinas',settings:'Configuraciones',profile:'Mi Perfil'})[m]||m;}

window.renderRolesPermsV830 = async function(){
  if(!isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
  page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
  await loadRolePermsV830();
  const rr = await supa.from('roles').select('*').order('name');
  const roleRows = (rr.data||[]).filter(r=>r.name).sort((a,b)=>String(a.name).localeCompare(String(b.name),'es'));
  const roles = roleRows.length ? roleRows.map(r=>r.name) : ['SuperAdmin','Admin','Técnicos','Usuarios'];
  const matrix=roles.map(role=>`<tr><td><b>${esc(role)}</b></td>${MODULE_DEFS_V830.map(([mk,ml])=>`<td><div class="perm-cell"><b>${esc(rbModuleLabel(mk))}</b>${ACTION_DEFS_V830.map(([ak,al])=>`<label class="checkline"><input type="checkbox" data-role="${esc(role)}" data-module="${mk}" data-action="${ak}" ${(window.rolePermsV830[role]?.[mk]||[]).includes(ak)?'checked':''} ${role==='SuperAdmin'?'disabled':''}> ${al}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
  $('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales de la PWA.</p></div><div class="roles-toolbar"><button class="btn primary" onclick="newRoleProfileV832()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV830()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${MODULE_DEFS_V830.map(m=>`<th>${esc(rbModuleLabel(m[0]))}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>`;
};

window.newRoleProfileV832 = async function(){
  const {value}=await Swal.fire({title:'Nuevo perfil',html:`<div class="swal-grid"><label>Nombre del perfil<input id="f_role_name_new" placeholder="Ej. Mesa de Ayuda"></label><label>Descripción<input id="f_role_desc_new" placeholder="Descripción breve"></label></div>`,showCancelButton:true,confirmButtonText:'Crear',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{const name=$('#f_role_name_new').value.trim(); if(!name){Swal.showValidationMessage('Ingrese el nombre del perfil'); return false;} return {name,description:$('#f_role_desc_new').value.trim()};}});
  if(!value) return;
  const {error}=await supa.from('roles').insert({name:value.name,description:value.description,is_system:false});
  if(error) return Swal.fire({icon:'error',title:'No se pudo crear perfil',text:error.message});
  await supa.from('role_module_permissions').insert(MODULE_DEFS_V830.map(([mk])=>({role_name:value.name,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false})));
  await Swal.fire({icon:'success',title:'Perfil creado'}); route('roles');
};

window.saveRolePermsV830 = async function(){
  const roles=[...new Set(Array.from(document.querySelectorAll('[data-role]')).map(x=>x.dataset.role).filter(r=>r && r!=='SuperAdmin'))];
  const rows=[];
  roles.forEach(role=>MODULE_DEFS_V830.forEach(([mk])=>{ const r={role_name:role,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false}; ACTION_DEFS_V830.forEach(([ak])=>{ const el=document.querySelector(`input[data-role="${CSS.escape(role)}"][data-module="${mk}"][data-action="${ak}"]`); if(el?.checked) r['can_'+ak]=true; }); rows.push(r); }));
  const del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin'); if(del.error)return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
  const ins=await supa.from('role_module_permissions').insert(rows); if(ins.error)return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
  await loadRolePermsV830(); await Swal.fire({icon:'success',title:'Permisos guardados'}); renderShellV830(); route('roles');
};

// alias para selects de oficinas en tickets aunque el campo se llame office.
setTimeout(()=>updateNotificationCounterV832(),800);



/* ========================= v8.33 HOTFIX FINAL - navegación, RBAC, selects, notificaciones y PDFs ========================= */
(function(){
  const h = (v)=> (typeof esc==='function' ? esc(v ?? '') : String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const role = ()=> String(state?.profile?.role_name || 'Usuarios');
  window.isSA830 = window.isSA830 || (()=> role() === 'SuperAdmin');
  window.isSA833 = ()=> role() === 'SuperAdmin';
  const MODULES_833 = [
    ['dashboard','Dashboard'],['users','Usuarios'],['roles','Roles y Permisos'],['orders','Órdenes de Servicio'],
    ['inventory','Inventario'],['loans','Gestión de Préstamos'],['tickets','Soporte Ticket'],
    ['notifications','Notificaciones'],['offices','Dtos/Oficinas'],['profile','Mi Perfil'],['settings','Configuraciones']
  ];
  const ACTIONS_833 = [['view','Ver'],['create','Crear'],['edit','Editar'],['delete','Eliminar'],['import','Importar CSV'],['export','Exportar CSV/PDF']];
  const DEFAULT_PERMS_833 = {
    SuperAdmin: MODULES_833.reduce((a,m)=>{a[m[0]]=ACTIONS_833.map(x=>x[0]);return a;},{}),
    Admin: {dashboard:['view'],users:['view'],roles:['view'],orders:['view','create','edit','export'],inventory:['view','create','edit','export'],loans:['view','create','edit','export'],tickets:['view','create','edit','export'],notifications:['view','create','edit'],offices:['view','create','edit'],profile:['view','edit'],settings:['view']},
    'Técnicos': {dashboard:['view'],orders:['view','edit'],inventory:['view'],tickets:['view','edit'],notifications:['view'],profile:['view','edit']},
    Tecnicos: {dashboard:['view'],orders:['view','edit'],inventory:['view'],tickets:['view','edit'],notifications:['view'],profile:['view','edit']},
    Usuarios: {dashboard:['view'],tickets:['view','create'],loans:['view','create'],notifications:['view'],profile:['view','edit']}
  };
  window.rolePermsV830 = window.rolePermsV830 || structuredClone(DEFAULT_PERMS_833);
  async function loadRolePerms833(){
    try{
      const {data,error}=await supa.from('role_module_permissions').select('*');
      if(error) throw error;
      const out=structuredClone(DEFAULT_PERMS_833);
      (data||[]).forEach(r=>{
        out[r.role_name] ||= {};
        out[r.role_name][r.module_key] = [];
        if(r.can_view) out[r.role_name][r.module_key].push('view');
        if(r.can_create) out[r.role_name][r.module_key].push('create');
        if(r.can_edit) out[r.role_name][r.module_key].push('edit');
        if(r.can_delete) out[r.role_name][r.module_key].push('delete');
        if(r.can_import) out[r.role_name][r.module_key].push('import');
        if(r.can_export) out[r.role_name][r.module_key].push('export');
      });
      window.rolePermsV830 = out;
      return out;
    }catch(e){
      console.warn('RBAC fallback v8.33:', e?.message || e);
      window.rolePermsV830 = window.rolePermsV830 || DEFAULT_PERMS_833;
      return window.rolePermsV830;
    }
  }
  window.loadRolePermsV830 = loadRolePerms833;
  window.canModuleV830 = function(module, action='view'){
    if(window.isSA833()) return true;
    const rn = role() === 'Tecnicos' ? 'Técnicos' : role();
    const p = window.rolePermsV830?.[rn] || DEFAULT_PERMS_833[rn] || {};
    return (p[module] || []).includes(action);
  };
  window.syncNavActive = function(){
    $$('.nav button, .mobile-dock button[data-page]').forEach(b=>{
      b.classList.toggle('active', String(b.dataset.page) === String(state.page));
    });
  };
  function sunSvg833(){return `<svg class="icon icon-theme" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"/></svg>`;}
  function moonSvg833(){return `<svg class="icon icon-theme" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.4A8.4 8.4 0 0 1 9.6 3.8 8.8 8.8 0 1 0 20.2 14.4Z"/></svg>`;}
  window.themeSunSvg = sunSvg833;
  window.themeMoonSvg = moonSvg833;

  async function notificationCount833(){
    try{
      const uid=state.user?.id; const rn=role();
      let q=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false);
      if(uid) q=q.or(`target_user.eq.${uid},target_role.eq.${rn},target_role.is.null,target_user.is.null`);
      const {count,error}=await q;
      if(error) throw error;
      return count||0;
    }catch(e){
      try{ const {count}=await supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false); return count||0; }catch(_){ return 0; }
    }
  }
  window.updateNotificationCount833 = async function(){
    const n = await notificationCount833();
    const btn = document.getElementById('notifyBtn');
    if(!btn) return;
    let b = btn.querySelector('.notif-badge');
    if(!b){ b = document.createElement('span'); b.className='notif-badge'; btn.appendChild(b); }
    b.textContent = n>99 ? '99+' : String(n);
    b.style.display = n ? 'inline-flex' : 'none';
  };

  const oldRenderShell833 = window.renderShell || (typeof renderShell!=='undefined'?renderShell:null);
  window.renderShell = function(){
    const logo = (localStorage.theme === 'light' ? state.settings.logo_light_url : state.settings.logo_dark_url) || 'assets/logo.svg';
    const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
    const allowed = modules.filter(m => m[0]==='logout' || window.canModuleV830(m[0],'view') || m[0]==='profile');
    const mobileMain = allowed.filter(m=>['dashboard','inventory','orders','tickets','loans'].includes(m[0])).slice(0,4);
    $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" id="brandToggle" title="Colapsar/expandir menú"><img src="${h(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${h(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${h(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${allowed.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${h(m[1]).replace('Dtos/Oficinas/Reparticiones','Dtos/Oficinas')}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET & OS MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank">Invítame un Cafecito</a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${h(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?moonSvg833():sunSvg833()}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico.bell}</button><button class="avatar-action" id="avatarBtn" title="Mi perfil"><img src="${h(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${h(state.profile?.full_name || state.profile?.email || '')}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico.logout}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${m[0]}" aria-label="${h(m[1])}">${m[2]}<span>${h(m[1])}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
    $$('.nav button, .mobile-dock button[data-page]').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
    $('#themeBtn').onclick = () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); };
    $('#brandToggle')?.addEventListener('click',()=>document.body.classList.toggle('sidebar-collapsed'));
    $('#fullBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    $('#notifyBtn').onclick = () => route('notifications');
    $('#avatarBtn').onclick = () => route('profile');
    $('#logoutBtn').onclick = () => route('logout');
    $('#mobileMoreBtn').onclick = openMobileMenu;
    syncNavActive();
    updateNotificationCount833();
  };
  try{ renderShell = window.renderShell; }catch(e){}

  async function fetchOffices833(){
    const {data,error}=await supa.from('offices').select('id,name,department,repartition,office_name,dependency,room,address,is_active').eq('is_active',true).order('name');
    if(error) return [];
    return data||[];
  }
  function officeLabel833(o){
    return [o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name || '';
  }
  function officeSelect833(id,label,offices,value=''){
    const opts = [`<option value="">Sin seleccionar</option>`].concat((offices||[]).map(o=>{
      const val = o.name || officeLabel833(o);
      return `<option value="${h(val)}" data-address="${h(o.address||'')}" ${String(val)===String(value)?'selected':''}>${h(officeLabel833(o))}</option>`;
    }));
    return `<label>${h(label)}<select id="f_${id}">${opts.join('')}</select></label>`;
  }
  async function fetchInventory833(){
    const {data,error}=await supa.from('inventory_items').select('id,name,code,brand,model,serial_number,barcode,stock,status').order('name');
    if(error) return [];
    return data||[];
  }
  function inventorySelect833(id,label,items,value=''){
    const opts = [`<option value="">Sin seleccionar</option>`].concat((items||[]).map(it=>{
      const labelTxt = [it.name,it.brand,it.model,it.serial_number?`Serie ${it.serial_number}`:'',`Stock ${it.stock??0}`].filter(Boolean).join(' · ');
      return `<option value="${h(it.id)}" data-desc="${h(labelTxt)}" ${String(value)===String(it.id)?'selected':''}>${h(labelTxt)}</option>`;
    }));
    return `<label>${h(label)}<select id="f_${id}">${opts.join('')}</select></label>`;
  }

  const oldOpenForm833 = window.openForm;
  window.openForm = async function(key,id=null){
    if(key==='tickets'){
      const c=crud.tickets, row=id?(state.rows.tickets||[]).find(x=>x.id===id):{};
      const offices=await fetchOffices833();
      const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.tickets}</div><p>Complete los datos solicitados para generar el registro.</p></div><div class="swal-grid">
        <label>Solicitante<input id="f_requester_name" value="${h(row?.requester_name||'')}"></label>
        <label>Email<input id="f_requester_email" value="${h(row?.requester_email||'')}"></label>
        <label>Teléfono<input id="f_requester_phone" value="${h(row?.requester_phone||'')}"></label>
        ${officeSelect833('office','Oficina',offices,row?.office||'')}
        <label>Área<input id="f_area" value="${h(row?.area||'')}"></label>
        <label>Asunto<input id="f_subject" value="${h(row?.subject||'')}"></label>
        <label>Incidencia<input id="f_incidence_type" value="${h(row?.incidence_type||'')}"></label>
        <label class="full">Descripción<textarea id="f_description">${h(row?.description||'')}</textarea></label>
        <label>Prioridad<select id="f_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${row?.priority===x?'selected':''}>${x}</option>`).join('')}</select></label>
        <label>Estado<select id="f_status">${['Pendiente','Asignado','En proceso','Resuelto','Cerrado','Cancelado'].map(x=>`<option ${row?.status===x?'selected':''}>${x}</option>`).join('')}</select></label>
      </div></div>`;
      const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:860,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>({
        requester_name:$('#f_requester_name').value||'Sin solicitante',requester_email:$('#f_requester_email').value||null,requester_phone:$('#f_requester_phone').value||null,office:$('#f_office').value||null,area:$('#f_area').value||null,subject:$('#f_subject').value||'Sin asunto',incidence_type:$('#f_incidence_type').value||'General',description:$('#f_description').value||'Sin descripción',priority:$('#f_priority').value,status:$('#f_status').value
      })});
      if(!value) return;
      const res = id ? await supa.from(c.table).update(value).eq('id',id) : await supa.from(c.table).insert(value);
      if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
      await Swal.fire({icon:'success',title:'Guardado',timer:900,showConfirmButton:false});
      return route('tickets');
    }
    if(key==='loans'){
      const c=crud.loans, row=id?(state.rows.loans||[]).find(x=>x.id===id):{};
      const offices=await fetchOffices833(); const inv=await fetchInventory833();
      const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.loans}</div><p>Complete los datos solicitados para generar el registro.</p></div><div class="swal-grid">
        <label>Solicitante<input id="f_requester_name" value="${h(row?.requester_name||'')}"></label>
        <label>Email<input id="f_requester_email" value="${h(row?.requester_email||'')}"></label>
        ${officeSelect833('office','Oficina',offices,row?.office||'')}
        ${inventorySelect833('item_id','Insumo/Equipo',inv,row?.item_id||'')}
        <label>Cantidad<input id="f_quantity" type="number" min="1" value="${h(row?.quantity||1)}"></label>
        <label>Inicio<input id="f_start_at" type="datetime-local" value=""></label>
        <label>Vencimiento<input id="f_due_at" type="datetime-local" value=""></label>
        <label>Estado<select id="f_status">${['Pendiente','Aprobado','Entregado','Devuelto','Cancelado'].map(x=>`<option ${row?.status===x?'selected':''}>${x}</option>`).join('')}</select></label>
        <label class="full">Observaciones<textarea id="f_observations">${h(row?.observations||'')}</textarea></label>
      </div></div>`;
      const {value}=await Swal.fire({title:id?'Editar Gestión de Préstamos':'Nuevo Gestión de Préstamos',html,width:860,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{
        const sel=$('#f_item_id'); const opt=sel.options[sel.selectedIndex];
        return {requester_name:$('#f_requester_name').value||'Sin solicitante',requester_email:$('#f_requester_email').value||null,office:$('#f_office').value||null,item_id:sel.value||null,item_description:opt?.dataset?.desc||opt?.textContent||null,quantity:Number($('#f_quantity').value||1),start_at:$('#f_start_at').value||null,due_at:$('#f_due_at').value||null,status:$('#f_status').value,observations:$('#f_observations').value||null};
      }});
      if(!value) return;
      const res = id ? await supa.from(c.table).update(value).eq('id',id) : await supa.from(c.table).insert(value);
      if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
      await Swal.fire({icon:'success',title:'Guardado',timer:900,showConfirmButton:false});
      return route('loans');
    }
    return oldOpenForm833 ? oldOpenForm833(key,id) : null;
  };

  window.renderRolesPermsV830 = async function(){
    if(!window.isSA833()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    await loadRolePerms833();
    const rr = await supa.from('roles').select('*').order('name');
    const roles = (rr.data&&rr.data.length ? rr.data.map(r=>r.name) : ['SuperAdmin','Admin','Técnicos','Usuarios']);
    const matrix=roles.map(r=>`<tr><td><b>${h(r)}</b></td>${MODULES_833.map(([mk,ml])=>`<td><div class="perm-cell"><b>${h(ml)}</b>${ACTIONS_833.map(([ak,al])=>`<label class="checkline"><input type="checkbox" data-role="${h(r)}" data-module="${mk}" data-action="${ak}" ${(window.rolePermsV830[r]?.[mk]||[]).includes(ak)?'checked':''} ${r==='SuperAdmin'?'disabled':''}> ${h(al)}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
    $('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales de la PWA.</p></div><div class="module-actions"><button class="btn" onclick="newRoleV833()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV833()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${MODULES_833.map(m=>`<th>${h(m[1])}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>`;
  };
  window.newRoleV833 = async function(){
    const {value}=await Swal.fire({title:'Nuevo perfil',html:`<div class="swal-grid"><label>Nombre del perfil<input id="nr_name" placeholder="Ej. Mesa de Entrada"></label><label class="full">Descripción<textarea id="nr_desc"></textarea></label></div>`,showCancelButton:true,confirmButtonText:'Crear',customClass:{popup:'tm-modal'},preConfirm:()=>({name:$('#nr_name').value.trim(),description:$('#nr_desc').value.trim()||null,is_system:false})});
    if(!value?.name) return;
    const {error}=await supa.from('roles').insert(value);
    if(error) return Swal.fire({icon:'error',title:'No se pudo crear perfil',text:error.message});
    await Swal.fire({icon:'success',title:'Perfil creado'});
    route('roles');
  };
  window.saveRolePermsV833 = async function(){
    const roles=[...new Set(Array.from(document.querySelectorAll('[data-role]')).map(x=>x.dataset.role).filter(r=>r!=='SuperAdmin'))];
    const rows=[];
    roles.forEach(r=>MODULES_833.forEach(([mk])=>{
      const row={role_name:r,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false};
      ACTIONS_833.forEach(([ak])=>{ const el=document.querySelector(`input[data-role="${CSS.escape(r)}"][data-module="${mk}"][data-action="${ak}"]`); if(el?.checked) row['can_'+ak]=true; });
      rows.push(row);
    }));
    const del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin');
    if(del.error) return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
    const ins=await supa.from('role_module_permissions').insert(rows);
    if(ins.error) return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
    await loadRolePerms833();
    await Swal.fire({icon:'success',title:'Permisos guardados'});
    renderShell(); route('roles');
  };
  window.saveRolePermsV830 = window.saveRolePermsV833;

  // PDF ingreso/egreso compacto y sin duplicar Falla / Informe.
  window.printOrder = (id,type) => {
    const o=(state.rows.orders||[]).find(x=>x.id===id); if(!o) return;
    const isOut = type==='entrega';
    const title=isOut?'Constancia de egreso / entrega de equipo':'Constancia de ingreso de equipo';
    const logo=(state.settings.logo_light_url || state.settings.logo_dark_url || 'assets/logo.svg');
    const short=(v,n=280)=>{ v=(typeof cleanLegacyText==='function'?cleanLegacyText(v||''):String(v||'')); return v.length>n ? v.slice(0,n-1)+'…' : v; };
    const tech=short((typeof extractTechFromOrder==='function'?extractTechFromOrder(o):'')||o.technician_name||o.professional_technician||'-',80).replace(/^Profesional técnico:\s*/i,'');
    const falla = short(o.fault_description||'-',260);
    const informe = short(o.technical_report||'-',230);
    const solucion = short(o.solution||o.observations||'-',230);
    const detail = isOut
      ? `<div class="box"><b>Falla / Diagnóstico inicial:</b><br>${h(falla)}</div><div class="box compact"><b>Detalle de egreso:</b><br><b>Informe técnico:</b> ${h(informe)}<br><b>Solución / Observaciones:</b> ${h(solucion)}</div>`
      : `<div class="box"><b>Falla / Diagnóstico:</b><br>${h(falla)}</div>`;
    const copy=(label, last=false)=>`<section class="copy ${last?'last':''}"><div class="rotulo"><div class="logoBox"><img src="${h(logo)}"></div><div><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>${label}</small><br><small>Fecha y hora de impresión: ${new Date().toLocaleString('es-AR')}</small></div></div><div class="box"><b>Orden:</b> ${h(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${h(o.service_order_statuses?.name||'')}<br><b>Ingreso original:</b> ${fmt(o.received_at)}<br><b>Profesional Técnico:</b> ${h(tech)}<br><b>Solicitante:</b> ${h(short(o.requester_name||'',90))}<br><b>Oficina/Repartición:</b> ${h(short(o.office||'',120))}<br><b>Teléfono:</b> ${h(short(o.requester_phone||'',40))}</div><div class="box"><b>Equipo:</b> ${h(short([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '),120))}<br><b>N° serie:</b> ${h(short(o.serial_number||'',80))}<br><b>Accesorios/Insumos:</b> ${h(short(o.accessories||'',150))}</div>${detail}<p class="firmas">Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></section>`;
    const html=`<html><head><title>${h(title)}</title><style>@page{size:A4;margin:7mm}*{box-sizing:border-box}html,body{font-family:Arial;margin:0;color:#111;font-size:10.5px}.copy{min-height:132mm;max-height:136mm;overflow:hidden;padding:0 0 4mm;margin:0;page-break-inside:avoid}.copy:not(.last){border-bottom:1.5px dashed #777;margin-bottom:4mm}.rotulo{display:flex;gap:10px;align-items:center;text-align:left;border-bottom:1.5px solid #111;padding-bottom:5px;margin-bottom:5px}.logoBox{width:138px;height:42px;border:1px solid #ddd;border-radius:6px;display:flex;align-items:center;justify-content:center;padding:4px;flex:0 0 auto}.logoBox img{max-width:126px;max-height:34px;object-fit:contain}.box{border:1px solid #222;padding:5px;margin:4px 0;font-size:10.4px;line-height:1.26}.box.compact{font-size:9.8px;line-height:1.22}h1{font-size:15px;margin:0 0 2px}.firmas{margin-top:10px;font-size:10.5px;text-align:center}</style></head><body>${copy(`Copia para la Oficina/Repartición: ${h(o.office||'-')}`)}${copy('Copia para Dirección de Informática - Área Soporte Técnico',true)}</body></html>`;
    const w=window.open('','_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),450);
  };

  const oldRoute833 = window.route || (typeof route!=='undefined'?route:null);
  window.route = async function(p){
    if(p==='logout'){ await supa.auth.signOut(); window.location.replace('./index.html'); return; }
    state.page = p;
    syncNavActive();
    if(p==='roles') { if(!canModuleV830('roles','view')) return Swal.fire({icon:'warning',title:'Sin permiso'}); await renderRolesPermsV830(); syncNavActive(); updateNotificationCount833(); return; }
    if(p!=='profile' && !canModuleV830(p,'view')) return Swal.fire({icon:'warning',title:'Sin permiso',text:'Su perfil no tiene permisos para acceder a este módulo.'});
    const r = oldRoute833 ? await oldRoute833(p) : null;
    state.page = p;
    syncNavActive();
    updateNotificationCount833();
    return r;
  };
  try{ route = window.route; }catch(e){}

  // Ajustes de texto de módulo ya creado.
  try{
    const idx = modules.findIndex(m=>m[0]==='offices');
    if(idx>=0) modules[idx][1]='Dtos/Oficinas';
    if(crud.offices){ crud.offices.title='Dtos/Oficinas'; crud.offices.desc='Departamentos, reparticiones, oficinas, dependencias y habitaciones.'; }
  }catch(e){}

  setInterval(()=>updateNotificationCount833(), 30000);
})();


/* ========================= v8.34 FINAL HOTFIX =========================
   - Corrige acceso a Roles y Permisos (isSA830/renderRolesPermsV830).
   - Agrega módulo Excepciones visible solo SuperAdmin.
   - Corrige menú activo usando state.page real.
   - Carga Oficinas en Soporte Ticket y Préstamos.
   - Carga Inventario en Préstamos.
   - Refresca contador de notificaciones.
============================================================================ */
(function(){
  const $ = window.$ || ((s,r=document)=>r.querySelector(s));
  const $$ = window.$$ || ((s,r=document)=>Array.from(r.querySelectorAll(s)));
  const role = ()=>String(window.state?.profile?.role_name || state?.profile?.role_name || 'Usuarios');
  window.isSA830 = window.isSA830 || function(){ return role()==='SuperAdmin'; };
  window.isSuperAdminV834 = window.isSA830;

  const exceptionsIcon = '<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="m9 15 2 2 4-5"/></svg>';

  try{
    // Etiqueta definitiva.
    const off = modules.find(m=>m[0]==='offices');
    if(off) off[1] = 'Dtos/Oficinas';
    if(!modules.some(m=>m[0]==='exceptions')){
      const idx = modules.findIndex(m=>m[0]==='profile');
      modules.splice(idx>=0?idx:modules.length-1,0,['exceptions','Excepciones',exceptionsIcon]);
    }
  }catch(e){ console.warn('v8.34 modules patch', e); }

  const ACTIONS834 = [['view','Ver'],['create','Crear'],['edit','Editar'],['delete','Eliminar'],['import','Importar CSV'],['export','Exportar CSV/PDF']];
  const MODULES834 = [
    ['dashboard','Dashboard'],['users','Usuarios'],['roles','Roles y Permisos'],['orders','Órdenes de Servicio'],
    ['inventory','Inventario'],['loans','Gestión de Préstamos'],['tickets','Soporte Ticket'],
    ['notifications','Notificaciones'],['offices','Dtos/Oficinas'],['exceptions','Excepciones'],['profile','Mi Perfil'],['settings','Configuraciones']
  ];
  window.DEFAULT_ROLE_PERMS_V834 = {
    SuperAdmin: MODULES834.reduce((a,m)=>{a[m[0]]=ACTIONS834.map(x=>x[0]);return a;},{}),
    Admin: {dashboard:['view'],users:['view'],roles:['view'],orders:['view','create','edit','export'],inventory:['view','create','edit','export'],loans:['view','create','edit','export'],tickets:['view','create','edit','export'],offices:['view','create','edit'],notifications:['view','create'],profile:['view','edit']},
    'Técnicos': {dashboard:['view'],orders:['view','edit'],inventory:['view'],tickets:['view','edit'],notifications:['view'],profile:['view','edit']},
    Usuarios: {dashboard:['view'],tickets:['view','create'],loans:['view','create'],notifications:['view'],profile:['view','edit']}
  };

  window.loadRolePermsV834 = async function(){
    try{
      const {data,error} = await supa.from('role_module_permissions').select('*');
      if(error) throw error;
      const out = JSON.parse(JSON.stringify(window.DEFAULT_ROLE_PERMS_V834));
      (data||[]).forEach(r=>{
        out[r.role_name] ||= {};
        out[r.role_name][r.module_key] = [];
        ACTIONS834.forEach(([a])=>{ if(r['can_'+a]) out[r.role_name][r.module_key].push(a); });
      });
      window.rolePermsV830 = out;
      return out;
    }catch(e){
      console.warn('role_module_permissions fallback', e.message);
      window.rolePermsV830 = JSON.parse(JSON.stringify(window.DEFAULT_ROLE_PERMS_V834));
      return window.rolePermsV830;
    }
  };

  window.canModuleV830 = window.canModuleV834 = function(module, action='view'){
    if(window.isSA830()) return true;
    const p=(window.rolePermsV830 || window.DEFAULT_ROLE_PERMS_V834)[role()] || {};
    return (p[module]||[]).includes(action);
  };

  function titleCaseAction(a){ return ACTIONS834.find(x=>x[0]===a)?.[1] || a; }

  window.renderRolesPermsV830 = window.renderRolesPermsV834 = async function(){
    if(!window.isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    await window.loadRolePermsV834();

    let roles = ['SuperAdmin','Admin','Técnicos','Usuarios'];
    try{
      const {data}=await supa.from('roles').select('name').order('name');
      if(data?.length) roles=[...new Set(['SuperAdmin',...data.map(r=>r.name)])];
    }catch(e){}

    const matrix = roles.map(r=>`<tr><td><b>${esc(r)}</b></td>${MODULES834.map(([mk,ml])=>`
      <td><div class="perm-cell"><b>${esc(ml)}</b>
      ${ACTIONS834.map(([ak,al])=>`<label class="checkline"><input type="checkbox" data-role="${esc(r)}" data-module="${mk}" data-action="${ak}" ${(window.rolePermsV830?.[r]?.[mk]||[]).includes(ak)?'checked':''} ${r==='SuperAdmin'?'disabled':''}> ${esc(al)}</label>`).join('')}
      </div></td>`).join('')}</tr>`).join('');

    $('#content').innerHTML = `<div class="card roles-matrix">
      <div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales de la PWA.</p></div>
      <div class="module-actions"><button class="btn" onclick="newRoleV834()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV830()">Guardar permisos</button></div></div>
      <div class="table-wrap"><table><thead><tr><th>Perfil</th>${MODULES834.map(m=>`<th>${esc(m[1])}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>`;
  };

  window.newRoleV834 = async function(){
    const {value:form} = await Swal.fire({
      title:'Nuevo perfil',
      html:`<input id="nr_name" class="swal2-input" placeholder="Nombre del perfil"><textarea id="nr_desc" class="swal2-textarea" placeholder="Descripción"></textarea>`,
      showCancelButton:true, confirmButtonText:'Crear',
      preConfirm:()=>({name:$('#nr_name').value.trim(), description:$('#nr_desc').value.trim()})
    });
    if(!form) return;
    if(!form.name) return Swal.fire({icon:'warning',title:'Ingrese un nombre'});
    const {error}=await supa.from('roles').insert({name:form.name,description:form.description,is_system:false});
    if(error) return Swal.fire({icon:'error',title:'No se pudo crear perfil',text:error.message});
    await Swal.fire({icon:'success',title:'Perfil creado'});
    renderRolesPermsV830();
  };

  window.saveRolePermsV830 = async function(){
    const roles = [...new Set($$('input[data-role]').map(i=>i.dataset.role).filter(r=>r && r!=='SuperAdmin'))];
    const rows=[];
    roles.forEach(r=>MODULES834.forEach(([mk])=>{
      const row={role_name:r,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false};
      ACTIONS834.forEach(([ak])=>{ row['can_'+ak]=!!document.querySelector(`input[data-role="${CSS.escape(r)}"][data-module="${mk}"][data-action="${ak}"]`)?.checked; });
      rows.push(row);
    }));
    const del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin');
    if(del.error) return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
    const ins=await supa.from('role_module_permissions').insert(rows);
    if(ins.error) return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
    await window.loadRolePermsV834();
    await Swal.fire({icon:'success',title:'Permisos guardados'});
    renderShell(); route('roles');
  };

  window.syncNavActive = function(){
    $$('.nav button, .mobile-dock button[data-page]').forEach(b=>b.classList.toggle('active', String(b.dataset.page)===String(state.page)));
  };

  async function selectOptionsFrom(table, valueField, labelFn, whereActive=true){
    try{
      let q=supa.from(table).select('*');
      if(whereActive) q=q.eq('is_active',true);
      const {data,error}=await q;
      if(error) throw error;
      return (data||[]).map(r=>`<option value="${esc(r[valueField]||'')}">${esc(labelFn(r))}</option>`).join('');
    }catch(e){ console.warn('options',table,e.message); return ''; }
  }

  // Mejora formularios genéricos para campos Oficina e Insumo/Equipo.
  const oldOpenFormV834 = window.openCrudForm || window.openForm || null;
  async function patchSelectsInModal(){
    const officeSelects = $$('select[data-field="office"], select[name="office"], select#f_office');
    const officeOptions = `<option value="">Sin seleccionar</option>` + await selectOptionsFrom('offices','name', r=>r.name || r.office_name || r.department || 'Oficina');
    officeSelects.forEach(s=>{ if(s.options.length<=1) s.innerHTML=officeOptions; });

    const itemSelects = $$('select[data-field="item_description"], select[name="item_description"], select#f_item_description');
    const itemOptions = `<option value="">Sin seleccionar</option>` + await selectOptionsFrom('inventory_items','name', r=>`${r.name||''}${r.brand?' · '+r.brand:''}${r.serial_number?' · '+r.serial_number:''}`, false);
    itemSelects.forEach(s=>{ if(s.options.length<=1) s.innerHTML=itemOptions; });
  }
  document.addEventListener('click',()=>setTimeout(patchSelectsInModal,120),true);

  window.updateNotificationCountV834 = async function(){
    try{
      if(!state.user) return;
      let q=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false);
      if(role()!=='SuperAdmin') q=q.or(`target_user.eq.${state.user.id},target_role.eq.${role()},target_role.is.null`);
      const {count,error}=await q; if(error) throw error;
      $$('.notif-badge-count,.notify-badge,.badge-notifications').forEach(b=>{ const n=count||0; b.textContent=n>99?'99+':String(n); b.hidden=n===0; });
      const btn=$('#notifyBtn'); if(btn && !btn.querySelector('.notif-badge-count')) btn.insertAdjacentHTML('beforeend',`<span class="notif-badge-count"${(count||0)===0?' hidden':''}>${count||0}</span>`);
    }catch(e){ console.warn('notif count v834',e.message); }
  };

  window.renderExceptionsV834 = async function(){
    if(!window.isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Excepciones','Horarios laborales, licencias, vacaciones, tareas técnicas y reglas de asignación.');
    const [tasks, techs, exc] = await Promise.all([
      supa.from('task_types').select('*').order('name'),
      supa.from('profiles').select('id,full_name,email,role_name,is_active').eq('role_name','Técnicos').eq('is_active',true).order('full_name'),
      supa.from('technician_exceptions').select('*, profiles(full_name,email)').order('start_at',{ascending:false}).limit(100)
    ]);
    $('#content').innerHTML = `<div class="grid two">
      <div class="card"><div class="module-head"><div><h2>Tipos de tarea</h2><p>Defina capacidades técnicas asignables.</p></div><button class="btn primary" onclick="newTaskTypeV834()">Nueva tarea</button></div>
        <div class="table-wrap"><table><thead><tr><th>Tarea</th><th>Peso</th><th>Activo</th></tr></thead><tbody>${(tasks.data||[]).map(t=>`<tr><td>${esc(t.name)}<br><small>${esc(t.description||'')}</small></td><td>${esc(t.weight||1)}</td><td>${t.is_active?'Sí':'No'}</td></tr>`).join('')||'<tr><td colspan="3">Sin tareas.</td></tr>'}</tbody></table></div></div>
      <div class="card"><div class="module-head"><div><h2>Excepciones</h2><p>Licencias, vacaciones, horarios y otras indisponibilidades.</p></div><button class="btn primary" onclick="newExceptionV834()">Nueva excepción</button></div>
        <div class="table-wrap"><table><thead><tr><th>Técnico</th><th>Tipo</th><th>Desde</th><th>Hasta</th><th>Motivo</th></tr></thead><tbody>${(exc.data||[]).map(e=>`<tr><td>${esc(e.profiles?.full_name||'-')}</td><td>${esc(e.type)}</td><td>${fmt(e.start_at)}</td><td>${fmt(e.end_at)}</td><td>${esc(e.reason||'')}</td></tr>`).join('')||'<tr><td colspan="5">Sin excepciones.</td></tr>'}</tbody></table></div></div>
      <div class="card full"><h2>Técnicos activos</h2><div class="table-wrap"><table><thead><tr><th>Profesional</th><th>Email</th><th>Perfil</th></tr></thead><tbody>${(techs.data||[]).map(t=>`<tr><td>${esc(t.full_name)}</td><td>${esc(t.email)}</td><td>${esc(t.role_name)}</td></tr>`).join('')}</tbody></table></div></div>
    </div>`;
  };

  window.newTaskTypeV834 = async function(){
    const {value:f}=await Swal.fire({title:'Nueva tarea técnica',html:`<input id="tt_name" class="swal2-input" placeholder="Ej. Preparación de equipos"><textarea id="tt_desc" class="swal2-textarea" placeholder="Descripción"></textarea><input id="tt_weight" class="swal2-input" type="number" value="1" min="1" placeholder="Peso / complejidad">`,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>({name:$('#tt_name').value.trim(),description:$('#tt_desc').value.trim(),weight:Number($('#tt_weight').value||1)})});
    if(!f?.name) return;
    const {error}=await supa.from('task_types').insert({...f,is_active:true});
    if(error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message});
    renderExceptionsV834();
  };

  window.newExceptionV834 = async function(){
    const {data:techs}=await supa.from('profiles').select('id,full_name,email').eq('role_name','Técnicos').eq('is_active',true).order('full_name');
    const opts=(techs||[]).map(t=>`<option value="${t.id}">${esc(t.full_name)} · ${esc(t.email)}</option>`).join('');
    const {value:f}=await Swal.fire({title:'Nueva excepción',html:`<select id="ex_tech" class="swal2-select">${opts}</select><select id="ex_type" class="swal2-select"><option>Licencia</option><option>Vacaciones</option><option>Horario laboral</option><option>Otra excepción</option></select><input id="ex_start" class="swal2-input" type="datetime-local"><input id="ex_end" class="swal2-input" type="datetime-local"><textarea id="ex_reason" class="swal2-textarea" placeholder="Motivo / detalle"></textarea>`,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>({technician_id:$('#ex_tech').value,type:$('#ex_type').value,start_at:$('#ex_start').value,end_at:$('#ex_end').value,reason:$('#ex_reason').value})});
    if(!f?.technician_id) return;
    const {error}=await supa.from('technician_exceptions').insert(f);
    if(error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message});
    renderExceptionsV834();
  };

  const oldRouteV834 = window.route || route;
  window.route = async function(p){
    if(p==='logout'){ await supa.auth.signOut(); window.location.replace('./index.html'); return; }
    state.page = p;
    window.syncNavActive();
    if(p==='roles') { await renderRolesPermsV830(); window.syncNavActive(); window.updateNotificationCountV834(); return; }
    if(p==='exceptions') { await renderExceptionsV834(); window.syncNavActive(); window.updateNotificationCountV834(); return; }
    if(p!=='profile' && !window.canModuleV830(p,'view')) return Swal.fire({icon:'warning',title:'Sin permiso',text:'Su perfil no tiene permisos para acceder a este módulo.'});
    const r=await oldRouteV834(p);
    state.page=p; window.syncNavActive(); window.updateNotificationCountV834(); setTimeout(patchSelectsInModal,120); return r;
  };
  try{ route = window.route; }catch(e){}

  const oldRenderShellV834 = window.renderShell || renderShell;
  window.renderShell = function(){
    oldRenderShellV834();
    $$('.nav button span').forEach(s=>{ if(s.textContent.includes('Dtos/Oficinas/Reparticiones')) s.textContent='Dtos/Oficinas'; });
    window.syncNavActive();
    window.updateNotificationCountV834();
  };
  try{ renderShell = window.renderShell; }catch(e){}

  setInterval(window.updateNotificationCountV834, 20000);
})();


/* ========================= v8.35 FINAL - assignment, exceptions, roles fix ========================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const safe=(v)=> (typeof esc==='function'?esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  var isSA830 = window.isSA830 = function(){ return String(window.state?.profile?.role_name || state?.profile?.role_name || '') === 'SuperAdmin'; };
  window.isSA830 = isSA830;
  window.isSuperAdminV835 = isSA830;
  window.MODULES_835 = [
    ['dashboard','Dashboard'],['users','Usuarios'],['roles','Roles y Permisos'],['orders','Órdenes de Servicio'],
    ['inventory','Inventario'],['loans','Gestión de Préstamos'],['tickets','Soporte Ticket'],['exceptions','Excepciones'],
    ['notifications','Notificaciones'],['offices','Dtos/Oficinas'],['profile','Mi Perfil'],['settings','Configuraciones']
  ];
  window.ACTIONS_835 = [['view','Ver'],['create','Crear'],['edit','Editar'],['delete','Eliminar'],['import','Importar CSV'],['export','Exportar CSV/PDF']];
  window.rbModuleLabel = window.rbModuleLabel || ((m)=>Object.fromEntries(window.MODULES_835)[m]||m);
  function role(){ return String(state?.profile?.role_name||'Usuarios'); }

  function ensureMenu835(){
    try{
      const labels=Object.fromEntries(window.MODULES_835);
      if(Array.isArray(modules)){
        modules.forEach(m=>{ if(labels[m[0]]) m[1]=labels[m[0]]; });
        if(isSA830() && !modules.some(m=>m[0]==='exceptions')){
          const icoEx='<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18"/><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="m9 15 2 2 4-5"/></svg>';
          const idx=modules.findIndex(m=>m[0]==='notifications'); modules.splice(idx>=0?idx:modules.length-2,0,['exceptions','Excepciones',icoEx]);
        }
        if(!isSA830()){
          const i=modules.findIndex(m=>m[0]==='exceptions'); if(i>=0) modules.splice(i,1);
        }
      }
      if(window.crud?.offices){ crud.offices.title='Dtos/Oficinas'; crud.offices.desc='Departamentos, reparticiones, oficinas, dependencias y habitaciones.'; }
    }catch(e){ console.warn('ensureMenu835',e); }
  }

  window.syncNavActive = function(){ qa('.nav button, .mobile-dock button[data-page]').forEach(b=>b.classList.toggle('active', String(b.dataset.page)===String(state.page))); };

  function cleanNotificationBadges(){
    const btn=q('#notifyBtn'); if(!btn) return;
    const badges=qa('.notif-badge-count,.notify-badge,.badge-notifications',btn);
    badges.slice(1).forEach(b=>b.remove());
    let b=badges[0]; if(!b){ b=document.createElement('span'); b.className='notif-badge-count'; btn.appendChild(b); }
  }
  window.updateNotificationCountV835 = async function(){
    try{
      cleanNotificationBadges();
      let count=0;
      if(typeof supa!=='undefined'){
        const rpc=await supa.rpc('get_unread_notification_count');
        if(!rpc.error && typeof rpc.data==='number') count=rpc.data;
        else {
          let qry=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false);
          if(!isSA830()) qry=qry.or(`target_user.eq.${state.user?.id},target_role.eq.${role()},target_role.is.null`);
          const r=await qry; count=r.count||0;
        }
      }
      const btn=q('#notifyBtn'); const b=btn?.querySelector('.notif-badge-count');
      if(b){ b.textContent=count>99?'99+':String(count); b.hidden=count===0; }
    }catch(e){ console.warn('notif v835',e.message); }
  };
  window.updateNotificationCountV834 = window.updateNotificationCountV835;
  window.loadNotificationCount = window.updateNotificationCountV835;

  async function fetchOffices835(){
    const {data,error}=await supa.from('offices').select('*').eq('is_active',true).order('name'); if(error) return [];
    return data||[];
  }
  async function fetchTasks835(){
    const {data,error}=await supa.from('task_types').select('*').eq('is_active',true).order('name'); if(error) return [];
    return data||[];
  }
  async function fetchInventory835(){
    const {data,error}=await supa.from('inventory_items').select('*').order('name'); if(error) return [];
    return data||[];
  }
  async function fetchTechnicians835(){
    const {data,error}=await supa.from('profiles').select('id,full_name,email,role_name,is_active,work_days,work_start,work_end').in('role_name',['Técnicos','Tecnicos']).eq('is_active',true).order('full_name'); if(error) return [];
    return data||[];
  }
  function officeOptions835(rows,val=''){
    return `<option value="">Sin seleccionar</option>`+(rows||[]).map(o=>{ const label=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name; return `<option value="${safe(label)}" ${String(val)===label||String(val)===o.name?'selected':''}>${safe(label)}</option>`; }).join('');
  }
  function taskOptions835(rows,val=''){
    return `<option value="">Seleccione...</option>`+(rows||[]).map(t=>`<option value="${safe(t.name)}" ${String(val)===t.name?'selected':''}>${safe(t.name)}</option>`).join('')+`<option value="__new__">+ Agregar otro servicio...</option>`;
  }
  function inventoryOptions835(rows,val=''){
    return `<option value="">Sin seleccionar</option>`+(rows||[]).map(i=>{ const label=[i.name,i.brand,i.model,i.serial_number].filter(Boolean).join(' · '); return `<option value="${safe(label)}" ${String(val)===label||String(val)===i.name?'selected':''}>${safe(label)}</option>`; }).join('');
  }

  // Corrige formulario de Soporte Ticket interno y select de oficinas.
  window.openTicketFormV835 = async function(id=null){
    const row=id?(state.rows.tickets||[]).find(x=>x.id===id):{};
    const [offices,tasks]=await Promise.all([fetchOffices835(),fetchTasks835()]);
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico?.tickets||''}</div><p>Complete los datos solicitados para generar el ticket y asignar orden automáticamente.</p></div><div class="swal-grid">
      <label>Solicitante<input id="f_requester_name" value="${safe(row?.requester_name||'')}"></label>
      <label>Email<input id="f_requester_email" type="email" value="${safe(row?.requester_email||'')}"></label>
      <label>WhatsApp / Teléfono<input id="f_requester_phone" value="${safe(row?.requester_phone||'')}"></label>
      <label>Oficina<select id="f_office">${officeOptions835(offices,row?.office||'')}</select></label>
      <label>Área<input id="f_area" value="${safe(row?.area||'')}"></label>
      <label>Servicio solicitado<select id="f_service_type" onchange="if(this.value==='__new__'){document.getElementById('newTaskBox835').style.display='block'}">${taskOptions835(tasks,row?.service_type||row?.incidence_type||'')}</select></label>
      <label id="newTaskBox835" style="display:none">Nuevo servicio<input id="f_new_service_type" placeholder="Ej. Cableado estructurado"></label>
      <label>Cantidad de equipos a revisar<input id="f_equipment_count" type="number" min="1" value="${safe(row?.equipment_count||1)}"></label>
      <label>Prioridad<select id="f_priority"><option>Baja</option><option selected>Media</option><option>Alta</option><option>Urgente</option></select></label>
      <label class="full">Descripción del problema<textarea id="f_description">${safe(row?.description||'')}</textarea></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:920,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>({
      requester_name:q('#f_requester_name').value.trim(), requester_email:q('#f_requester_email').value.trim(), requester_phone:q('#f_requester_phone').value.trim(), office:q('#f_office').value,
      area:q('#f_area').value.trim(), service_type:q('#f_service_type').value==='__new__'?q('#f_new_service_type').value.trim():q('#f_service_type').value, incidence_type:q('#f_service_type').value==='__new__'?q('#f_new_service_type').value.trim():q('#f_service_type').value,
      equipment_count:parseInt(q('#f_equipment_count').value||'1',10), subject:q('#f_service_type').value==='__new__'?q('#f_new_service_type').value.trim():q('#f_service_type').value, description:q('#f_description').value.trim(), priority:q('#f_priority').value, status:row?.status||'Pendiente'
    })});
    if(!value) return;
    if(!value.requester_name || !value.office || !value.service_type || !value.description) return Swal.fire({icon:'warning',title:'Faltan datos obligatorios'});
    try{
      if(q('#f_service_type')?.value==='__new__' && value.service_type) await supa.from('task_types').upsert({name:value.service_type,description:'Creado desde Soporte Ticket',is_active:true},{onConflict:'name'});
      const res=id?await supa.from('support_tickets').update(value).eq('id',id):await supa.from('support_tickets').insert(value).select('*').single();
      if(res.error) throw res.error;
      await Swal.fire({icon:'success',title:'Ticket guardado'}); route('tickets');
    }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
  };

  // Corrige formulario de Gestión de Préstamos con inventario y oficinas.
  window.openLoanFormV835 = async function(id=null){
    const row=id?(state.rows.loans||[]).find(x=>x.id===id):{};
    const [offices,items]=await Promise.all([fetchOffices835(),fetchInventory835()]);
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico?.loans||''}</div><p>Complete los datos solicitados para generar el registro.</p></div><div class="swal-grid">
      <label>Solicitante<input id="f_requester_name" value="${safe(row?.requester_name||'')}"></label>
      <label>Email<input id="f_requester_email" value="${safe(row?.requester_email||'')}"></label>
      <label>Oficina<select id="f_office">${officeOptions835(offices,row?.office||'')}</select></label>
      <label>Insumo/Equipo<select id="f_item_description">${inventoryOptions835(items,row?.item_description||'')}</select></label>
      <label>Cantidad<input id="f_quantity" type="number" min="1" value="${safe(row?.quantity||1)}"></label>
      <label>Inicio<input id="f_start_at" type="datetime-local"></label>
      <label>Vencimiento<input id="f_due_at" type="datetime-local"></label>
      <label>Estado<select id="f_status"><option>Pendiente</option><option>Aprobado</option><option>Entregado</option><option>Devuelto</option><option>Rechazado</option></select></label>
      <label class="full">Observaciones<textarea id="f_observations">${safe(row?.observations||'')}</textarea></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Gestión de Préstamos':'Nuevo Gestión de Préstamos',html,width:860,showCancelButton:true,confirmButtonText:'Guardar',customClass:{popup:'tm-modal'},preConfirm:()=>({requester_name:q('#f_requester_name').value.trim(),requester_email:q('#f_requester_email').value.trim(),office:q('#f_office').value,item_description:q('#f_item_description').value,quantity:parseInt(q('#f_quantity').value||'1',10),start_at:q('#f_start_at').value||null,due_at:q('#f_due_at').value||null,status:q('#f_status').value,observations:q('#f_observations').value.trim()})});
    if(!value) return;
    try{ const res=id?await supa.from('loans').update(value).eq('id',id):await supa.from('loans').insert(value); if(res.error) throw res.error; await Swal.fire({icon:'success',title:'Registro guardado'}); route('loans'); }catch(e){ Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message}); }
  };

  // Intercepta formularios.
  const prevOpenForm835 = window.openForm || window.openCrudForm || null;
  window.openForm = async function(key,id=null){
    if(key==='tickets') return window.openTicketFormV835(id);
    if(key==='loans') return window.openLoanFormV835(id);
    return prevOpenForm835 ? prevOpenForm835(key,id) : null;
  };
  try{ openForm = window.openForm; }catch(e){}

  // Roles y permisos: elimina ReferenceError e incluye Excepciones.
  window.loadRolePermsV835 = async function(){
    const defaults={SuperAdmin:{},Admin:{},'Técnicos':{},Usuarios:{}};
    window.MODULES_835.forEach(([m])=>{ defaults.SuperAdmin[m]=['view','create','edit','delete','import','export']; });
    defaults.Admin={dashboard:['view'],users:['view'],roles:['view'],orders:['view','create','edit','export'],inventory:['view','create','edit','export'],loans:['view','create','edit','export'],tickets:['view','create','edit','export'],notifications:['view','create','edit'],offices:['view','create','edit'],profile:['view','edit'],settings:['view']};
    defaults['Técnicos']={dashboard:['view'],orders:['view','edit'],inventory:['view'],tickets:['view','edit'],notifications:['view'],profile:['view','edit']};
    defaults.Usuarios={dashboard:['view'],tickets:['view','create'],loans:['view','create'],notifications:['view'],profile:['view','edit']};
    try{ const {data,error}=await supa.from('role_module_permissions').select('*'); if(error) throw error; window.rolePermsV830={...defaults}; (data||[]).forEach(r=>{ window.rolePermsV830[r.role_name] ||= {}; window.rolePermsV830[r.role_name][r.module_key]=['view','create','edit','delete','import','export'].filter(a=>r['can_'+a]); }); }catch(e){ console.warn('rbac fallback v835',e.message); window.rolePermsV830=defaults; }
  };
  window.canModuleV830 = function(module, action='view'){
    if(isSA830()) return true; const rp=window.rolePermsV830||{}; return !!(rp[role()]?.[module]||[]).includes(action);
  };
  window.renderRolesPermsV830 = async function(){
    if(!isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    await window.loadRolePermsV835();
    const rr=await supa.from('roles').select('*').order('name');
    const roles=(rr.data&&rr.data.length?rr.data.map(r=>r.name):['SuperAdmin','Admin','Técnicos','Usuarios']);
    const matrix=roles.map(r=>`<tr><td><b>${safe(r)}</b></td>${window.MODULES_835.map(([mk,ml])=>`<td><div class="perm-cell"><b>${safe(ml)}</b>${window.ACTIONS_835.map(([ak,al])=>`<label class="checkline"><input type="checkbox" data-role="${safe(r)}" data-module="${mk}" data-action="${ak}" ${(window.rolePermsV830[r]?.[mk]||[]).includes(ak)?'checked':''} ${r==='SuperAdmin'?'disabled':''}> ${safe(al)}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
    q('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales de la PWA.</p></div><div class="module-actions"><button class="btn" onclick="newRoleV835()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV835()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${window.MODULES_835.map(m=>`<th>${safe(m[1])}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table></div></div>`;
  };
  window.newRoleV835 = async function(){
    const {value}=await Swal.fire({title:'Nuevo perfil',html:`<input id="nr_name" class="swal2-input" placeholder="Nombre del perfil"><textarea id="nr_desc" class="swal2-textarea" placeholder="Descripción"></textarea>`,showCancelButton:true,confirmButtonText:'Crear',preConfirm:()=>({name:q('#nr_name').value.trim(),description:q('#nr_desc').value.trim(),is_system:false})});
    if(!value?.name) return; const {error}=await supa.from('roles').insert(value); if(error) return Swal.fire({icon:'error',title:'No se pudo crear perfil',text:error.message}); await Swal.fire({icon:'success',title:'Perfil creado'}); renderRolesPermsV830();
  };
  window.saveRolePermsV835 = async function(){
    const roles=[...new Set(qa('input[data-role]').map(i=>i.dataset.role).filter(r=>r && r!=='SuperAdmin'))];
    const rows=[]; roles.forEach(r=>window.MODULES_835.forEach(([mk])=>{ const row={role_name:r,module_key:mk,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false}; window.ACTIONS_835.forEach(([ak])=>{row['can_'+ak]=!!document.querySelector(`input[data-role="${CSS.escape(r)}"][data-module="${mk}"][data-action="${ak}"]`)?.checked;}); rows.push(row); }));
    const del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin'); if(del.error)return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
    const ins=await supa.from('role_module_permissions').insert(rows); if(ins.error)return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
    await window.loadRolePermsV835(); await Swal.fire({icon:'success',title:'Permisos guardados'}); renderShell(); route('roles');
  };
  window.saveRolePermsV830=window.saveRolePermsV835;

  window.renderExceptionsV835 = async function(){
    if(!isSA830()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Excepciones','Horarios laborales, licencias, vacaciones, permisos de salida, tareas especiales y reglas de asignación aleatoria.');
    const [ex,techs,tasks]=await Promise.all([supa.from('technician_exceptions').select('*,profiles(full_name,email)').order('start_at',{ascending:false}).limit(500),fetchTechnicians835(),fetchTasks835()]);
    q('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Excepciones</h2><p>Los técnicos con excepciones activas quedan fuera de la asignación automática.</p></div><div class="module-actions"><button class="btn primary" onclick="newExceptionV835()">Nueva excepción</button><button class="btn" onclick="newTaskTypeV835()">Nueva tarea</button><button class="btn" onclick="exportCsv('exceptions')">Exportar CSV</button><button class="btn" onclick="exportExceptionsPdfV835()">PDF A4</button></div></div><div class="grid two"><div><h3>Excepciones cargadas</h3><div class="table-wrap"><table><thead><tr><th>Técnico</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Motivo</th><th>Acciones</th></tr></thead><tbody>${(ex.data||[]).map(e=>`<tr><td>${safe(e.profiles?.full_name||'-')}</td><td>${safe(e.type)}</td><td>${fmt(e.start_at)}</td><td>${fmt(e.end_at)}</td><td>${safe(e.reason||'')}</td><td><button class="icon-mini" onclick="deleteExceptionV835('${e.id}')">${ico.trash}</button></td></tr>`).join('')||'<tr><td colspan="6">Sin excepciones.</td></tr>'}</tbody></table></div></div><div><h3>Tareas técnicas</h3><div class="table-wrap"><table><thead><tr><th>Tarea</th><th>Peso</th><th>Activo</th></tr></thead><tbody>${(tasks||[]).map(t=>`<tr><td>${safe(t.name)}<br><small>${safe(t.description||'')}</small></td><td>${safe(t.weight||1)}</td><td>${t.is_active?'Sí':'No'}</td></tr>`).join('')}</tbody></table></div><h3>Técnicos activos</h3><div class="table-wrap"><table><tbody>${(techs||[]).map(t=>`<tr><td>${safe(t.full_name)}</td><td>${safe(t.email)}</td></tr>`).join('')}</tbody></table></div></div></div></div>`;
  };
  window.renderExceptionsV834=window.renderExceptionsV835;
  window.newTaskTypeV835 = async function(){ const {value}=await Swal.fire({title:'Nueva tarea',html:`<input id="tt_name" class="swal2-input" placeholder="Ej. Cableado Red"><textarea id="tt_desc" class="swal2-textarea" placeholder="Descripción"></textarea><input id="tt_weight" class="swal2-input" type="number" value="1" min="1">`,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>({name:q('#tt_name').value.trim(),description:q('#tt_desc').value.trim(),weight:Number(q('#tt_weight').value||1),is_active:true})}); if(!value?.name)return; const {error}=await supa.from('task_types').upsert(value,{onConflict:'name'}); if(error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); renderExceptionsV835(); };
  window.newExceptionV835 = async function(){ const techs=await fetchTechnicians835(); const opts=techs.map(t=>`<option value="${t.id}">${safe(t.full_name)} · ${safe(t.email)}</option>`).join(''); const types=['Tareas Especiales','Día de Vacaciones','Día Femenino','Licencia por Enfermedad','Permisos de Salidas','Otra excepción']; const {value}=await Swal.fire({title:'Nueva excepción',html:`<select id="ex_tech" class="swal2-select">${opts}</select><select id="ex_type" class="swal2-select">${types.map(x=>`<option>${x}</option>`).join('')}</select><input id="ex_start" class="swal2-input" type="datetime-local"><input id="ex_end" class="swal2-input" type="datetime-local"><textarea id="ex_reason" class="swal2-textarea" placeholder="Motivo / detalle"></textarea>`,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>({technician_id:q('#ex_tech').value,type:q('#ex_type').value,start_at:q('#ex_start').value,end_at:q('#ex_end').value||null,reason:q('#ex_reason').value,created_by:state.user?.id,is_active:true})}); if(!value?.technician_id||!value.start_at)return; const {error}=await supa.from('technician_exceptions').insert(value); if(error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); renderExceptionsV835(); };
  window.deleteExceptionV835 = async function(id){ const ok=await Swal.fire({icon:'warning',title:'Eliminar excepción',showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; await supa.from('technician_exceptions').delete().eq('id',id); renderExceptionsV835(); };
  window.exportExceptionsPdfV835 = function(){ const w=window.open('','_blank'); w.document.write(`<html><head><title>Excepciones</title><style>body{font-family:Arial;margin:20px}h1{font-size:18px}.head{border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:12px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #222;padding:6px;font-size:11px}</style></head><body><div class="head"><h1>Dirección de Informática - Área Soporte Técnico</h1><b>Reporte de Excepciones</b><br>Fecha y hora: ${new Date().toLocaleString('es-AR')}</div>${q('#content .table-wrap')?.innerHTML||''}</body></html>`); w.document.close(); setTimeout(()=>w.print(),300); };

  const previousRoute835 = window.route || route;
  window.route = async function(p){
    if(p==='logout'){ await supa.auth.signOut(); location.replace('./index.html'); return; }
    ensureMenu835(); state.page=p; syncNavActive();
    if(p==='roles'){ await renderRolesPermsV830(); state.page=p; syncNavActive(); updateNotificationCountV835(); return; }
    if(p==='exceptions'){ await renderExceptionsV835(); state.page=p; syncNavActive(); updateNotificationCountV835(); return; }
    if(p!=='profile' && !window.canModuleV830(p,'view')) return Swal.fire({icon:'warning',title:'Sin permiso',text:'Su perfil no tiene permisos para acceder a este módulo.'});
    const r=await previousRoute835(p); state.page=p; syncNavActive(); updateNotificationCountV835(); return r;
  };
  try{ route=window.route; }catch(e){}

  const previousShell835 = window.renderShell || renderShell;
  window.renderShell = function(){ ensureMenu835(); previousShell835(); qa('.nav button span').forEach(s=>{ if(s.textContent.includes('Dtos/Oficinas/Reparticiones')) s.textContent='Dtos/Oficinas'; }); syncNavActive(); updateNotificationCountV835(); };
  try{ renderShell=window.renderShell; }catch(e){}
  setInterval(updateNotificationCountV835,20000);
})();

/* ========================= v8.36 FINAL - UX/RBAC/Assignments/Loans/Dashboard Hotfix ========================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const safe=(v)=> (typeof esc==='function'?esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const currentRole=()=>String(state?.profile?.role_name||'Usuarios');
  const isSuper=()=>currentRole()==='SuperAdmin';
  const isPriv=()=>['SuperAdmin','Admin','Técnicos','Tecnicos','Profesional técnico','Profesional Técnico'].includes(currentRole());
  window.tmIsSuperAdmin836=isSuper;

  const moduleLabels836={dashboard:'Dashboard',users:'Usuarios',roles:'Roles y Permisos',orders:'Órdenes de Servicio',inventory:'Inventario',loans:'Gestión de Préstamos',tickets:'Soporte Ticket',notifications:'Notificaciones',offices:'Dtos/Oficinas',exceptions:'Excepciones',profile:'Mi Perfil',settings:'Configuraciones',logout:'Cerrar Sesión'};
  const moduleOrder836=['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','exceptions','profile','settings','logout'];
  const actionLabels836={view:'Ver',create:'Crear',edit:'Editar',delete:'Eliminar',import:'Importar CSV',export:'Exportar CSV/PDF'};
  const actions836=['view','create','edit','delete','import','export'];

  function normalizeMenu836(){
    try{
      if(Array.isArray(modules)){
        modules.forEach(m=>{ if(moduleLabels836[m[0]]) m[1]=moduleLabels836[m[0]]; });
        if(isSuper() && !modules.some(m=>m[0]==='exceptions')){
          const icoEx='<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="17" rx="2"/><path d="m9 15 2 2 4-5"/></svg>';
          const idx=modules.findIndex(m=>m[0]==='profile'); modules.splice(idx>=0?idx:modules.length-1,0,['exceptions','Excepciones',icoEx]);
        }
        if(!isSuper()){
          const idx=modules.findIndex(m=>m[0]==='exceptions'); if(idx>=0) modules.splice(idx,1);
        }
      }
      if(window.crud){
        if(crud.offices){crud.offices.title='Dtos/Oficinas'; crud.offices.desc='Departamentos, reparticiones, oficinas, dependencias y habitaciones.';}
        if(crud.loans){crud.loans.labels=['Solicitante','Email','Oficina','Insumo/Equipo','Cantidad','Inicio','Vencimiento','Estado','Observaciones'];}
      }
    }catch(e){console.warn('normalizeMenu836',e.message)}
  }
  window.syncNavActive=function(){
    qa('.nav button, .mobile-dock button[data-page]').forEach(b=>{
      const on=String(b.dataset.page)===String(state.page);
      b.classList.toggle('active',on);
      if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
      const sp=b.querySelector('span'); if(sp && moduleLabels836[b.dataset.page]) sp.textContent=moduleLabels836[b.dataset.page];
    });
  };

  function dedupeNotifyBadge836(){
    const btn=q('#notifyBtn'); if(!btn) return null;
    qa('.notify-badge,.badge-notifications',btn).forEach(x=>x.remove());
    const badges=qa('.notif-badge-count',btn);
    badges.slice(1).forEach(x=>x.remove());
    let b=badges[0];
    if(!b){ b=document.createElement('span'); b.className='notif-badge-count'; btn.appendChild(b); }
    return b;
  }
  window.updateNotificationCountV836=async function(){
    try{
      const b=dedupeNotifyBadge836(); if(!b) return;
      let qry=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false);
      if(!isSuper()) qry=qry.or(`target_user.eq.${state.user?.id},target_role.eq.${currentRole()},target_role.is.null`);
      const {count,error}=await qry;
      const n=error?0:(count||0);
      b.textContent=n>99?'99+':String(n); b.hidden=n<=0;
    }catch(e){console.warn('notif v836',e.message)}
  };
  window.updateNotificationCountV835=window.updateNotificationCountV836;
  window.updateNotificationCountV834=window.updateNotificationCountV836;
  window.loadNotificationCount=window.updateNotificationCountV836;

  async function fetchOffices(){ const {data}=await supa.from('offices').select('*').eq('is_active',true).order('name'); return data||[]; }
  async function fetchTasks(){ const {data}=await supa.from('task_types').select('*').eq('is_active',true).order('name'); return data||[]; }
  async function fetchInventory(){ const {data}=await supa.from('inventory_items').select('*').order('name'); return data||[]; }
  async function fetchTechnicians(){ const {data}=await supa.from('profiles').select('id,full_name,email,role_name,is_active,office,work_days,work_start,work_end').in('role_name',['Técnicos','Tecnicos']).eq('is_active',true).order('full_name'); return data||[]; }
  function officeOptions(rows,val=''){
    return `<option value="">Sin seleccionar</option>`+(rows||[]).map(o=>{ const label=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name; return `<option value="${safe(label)}" ${String(val)===label||String(val)===o.name?'selected':''}>${safe(label)}</option>`; }).join('');
  }
  function taskOptions(rows,val='',allowNew=false){
    return `<option value="">Seleccione...</option>`+(rows||[]).map(t=>`<option value="${safe(t.name)}" ${String(val)===String(t.name)?'selected':''}>${safe(t.name)}</option>`).join('')+(allowNew?`<option value="__new__">+ Crear nuevo servicio...</option>`:'');
  }
  function inventoryOptions(rows,val=''){
    return `<option value="">Sin seleccionar</option>`+(rows||[]).map(i=>{ const label=[i.name,i.brand,i.model,i.serial_number].filter(Boolean).join(' · '); return `<option value="${safe(i.id)}" data-label="${safe(label)}" ${String(val)===String(i.id)||String(val)===label||String(val)===i.name?'selected':''}>${safe(label)}</option>`; }).join('');
  }

  async function technicianAvailableNow(t, taskName=null){
    try{
      const now=new Date(); const day=now.getDay(); const hm=now.toTimeString().slice(0,5);
      const days=Array.isArray(t.work_days)?t.work_days.map(String):['1','2','3','4','5'];
      if(days.length && !days.includes(String(day))) return false;
      if(t.work_start && hm<String(t.work_start).slice(0,5)) return false;
      if(t.work_end && hm>String(t.work_end).slice(0,5)) return false;
      const {data:ex}=await supa.from('technician_exceptions').select('id').eq('technician_id',t.id).eq('is_active',true).lte('start_at',now.toISOString()).or(`end_at.is.null,end_at.gte.${now.toISOString()}`).limit(1);
      if((ex||[]).length) return false;
      if(taskName){
        const tt=await supa.from('task_types').select('id').eq('name',taskName).maybeSingle();
        if(tt.data?.id){
          const sk=await supa.from('technician_task_types').select('id').eq('technician_id',t.id).eq('task_type_id',tt.data.id).eq('is_active',true).limit(1);
          if(sk.data && sk.data.length===0) return false;
        }
      }
      return true;
    }catch(e){return true;}
  }
  async function chooseTechnicians(taskName, qty){
    const techs=await fetchTechnicians();
    const available=[];
    for(const t of techs){ if(await technicianAvailableNow(t,taskName)) available.push(t); }
    available.sort(()=>Math.random()-0.5);
    return {main:available[0]||null, coll:(Number(qty)>7?available[1]||null:null), available};
  }

  window.renderDashboard = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    let orderQuery=supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false});
    if(!isSuper() && ['Técnicos','Tecnicos','Profesional técnico','Profesional Técnico'].includes(currentRole())){
      orderQuery=orderQuery.or(`assigned_to.eq.${state.user.id},technician_user_id.eq.${state.user.id},collaborator_assigned_to.eq.${state.user.id}`);
    }
    const [users,ordersRes,tickets,inv]=await Promise.all([
      count('profiles'), orderQuery, count('support_tickets'), count('inventory_items')
    ]);
    const orders=ordersRes.data||[]; const totalOrders=ordersRes.count??orders.length;
    const today=new Date(); const overdue=orders.filter(o=>{ const d=new Date(o.received_at||o.created_at); return !['Terminada','Entregada','Lista p/Retirar'].includes(o.service_order_statuses?.name||'') && (today-d)>7*864e5; }).length;
    const urgent=orders.filter(o=>o.priority==='Urgente').length;
    const pending=orders.filter(o=>!['Terminada','Entregada'].includes(o.service_order_statuses?.name||'')).length;
    const byStatus={}; orders.forEach(o=>{ const s=o.service_order_statuses?.name||'Sin estado'; byStatus[s]=(byStatus[s]||0)+1; });
    $('#content').innerHTML=`<div class="grid dashboard-kpis"><div class="card kpi"><h3>Usuarios</h3><b>${users}</b><p>Perfiles autorizados.</p></div><div class="card kpi"><h3>Órdenes</h3><b>${totalOrders}</b><p>${isSuper()?'Órdenes técnicas registradas.':'Asignadas a su cuenta.'}</p></div><div class="card kpi warn"><h3>Urgentes</h3><b>${urgent}</b><p>Prioridad crítica</p></div><div class="card kpi danger"><h3>Atrasadas</h3><b>${overdue}</b><p>Más de 7 días abiertas</p></div><div class="card kpi"><h3>Tickets</h3><b>${tickets}</b><p>Solicitudes recibidas</p></div><div class="card kpi"><h3>Inventario</h3><b>${inv}</b><p>Activos e insumos</p></div></div><div class="grid two"><div class="card"><h2>Alertas operativas</h2><p>Resumen ${isSuper()?'general':'de órdenes asignadas al profesional técnico logueado'}.</p><div class="mini-stats"><b>${urgent} urgentes</b><b>${pending} pendientes</b><b>${overdue} atrasadas</b><b>${orders.filter(o=>['Terminada','Entregada','Lista p/Retirar'].includes(o.service_order_statuses?.name||'')).length} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(byStatus).map(([k,v])=>`<div class="status-line"><span>${safe(k)}</span><b>${v}</b></div>`).join('')||'<p>Sin órdenes asignadas.</p>'}</div><div class="card"><h2>Calendario de Órdenes de Servicio</h2><p>${today.toLocaleDateString('es-AR',{month:'long',year:'numeric'})}</p><div class="calendar-lite">${orders.slice(0,10).map(o=>`<article><b>OS ${safe(o.satmanager_order||o.order_number)}</b><span>${safe(o.requester_name||o.office||'-')}</span><small>${fmt(o.received_at)}</small></article>`).join('')||'<p>Sin órdenes.</p>'}</div><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div>`;
  };

  window.openTicketFormV836=async function(id=null){
    const row=id?(state.rows.tickets||[]).find(x=>x.id===id):{};
    const [offices,tasks]=await Promise.all([fetchOffices(),fetchTasks()]);
    const profile=state.profile||{};
    const allowNew=isPriv();
    const selectedService=row?.service_type||row?.incidence_type||'';
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.tickets}</div><p>Complete los datos solicitados para generar el ticket y asignar orden automáticamente.</p></div><div class="swal-grid">
      <label>Solicitante<input id="f_requester_name" value="${safe(row?.requester_name||profile.full_name||'')}"></label>
      <label>Email<input id="f_requester_email" type="email" value="${safe(row?.requester_email||profile.email||'')}"></label>
      <label>WhatsApp / Teléfono<input id="f_requester_phone" value="${safe(row?.requester_phone||profile.phone||'')}"></label>
      <label>Oficina<select id="f_office">${officeOptions(offices,row?.office||profile.office||'')}</select></label>
      <label>Área<input id="f_area" value="${safe(row?.area||'')}"></label>
      <label>Servicio solicitado<select id="f_service_type">${taskOptions(tasks,selectedService,allowNew)}</select><small>${allowNew?'Puede crear servicios nuevos.':'Solo perfiles autorizados pueden crear servicios nuevos.'}</small></label>
      <label id="newTaskBox836" style="display:none">Nuevo servicio<input id="f_new_service_type" placeholder="Ej. Cableado estructurado"></label>
      <label>Cantidad de equipos a revisar<input id="f_equipment_count" type="number" min="1" value="${safe(row?.equipment_count||1)}"><small>Si es mayor a 7, se asigna colaborador automáticamente.</small></label>
      <div class="full assign-preview" id="assignPreview836"></div>
      <label>Prioridad<select id="f_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${String(row?.priority||'Media')===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="full">Descripción del problema<textarea id="f_description">${safe(row?.description||'')}</textarea></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:920,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{
      const sel=q('#f_service_type'), qty=q('#f_equipment_count'), box=q('#newTaskBox836'), prev=q('#assignPreview836');
      const refresh=async()=>{ if(sel.value==='__new__') box.style.display='block'; else box.style.display='none'; const task=sel.value==='__new__'?q('#f_new_service_type')?.value:sel.value; const r=await chooseTechnicians(task,qty.value); prev.innerHTML=r.main?`<p><b>Responsable técnico:</b> ${safe(r.main.full_name)}</p>${Number(qty.value)>7?`<p><b>Colaborador técnico:</b> ${r.coll?safe(r.coll.full_name):'No hay colaboradores disponibles'}</p>`:''}<small>Asignación previa. Se confirma al guardar.</small>`:'<small>Sin técnicos disponibles para asignación automática.</small>'; };
      sel.onchange=refresh; qty.oninput=refresh; setTimeout(refresh,50);
    },preConfirm:async()=>{
      const raw=q('#f_service_type').value; const service=raw==='__new__'?q('#f_new_service_type').value.trim():raw;
      const qty=Number(q('#f_equipment_count').value||1); const chosen=await chooseTechnicians(service,qty);
      return {requester_name:q('#f_requester_name').value.trim(),requester_email:q('#f_requester_email').value.trim(),requester_phone:q('#f_requester_phone').value.trim(),office:q('#f_office').value,area:q('#f_area').value.trim(),service_type:service,incidence_type:service,subject:service,task_type_id:null,equipment_count:qty,description:q('#f_description').value.trim(),priority:q('#f_priority').value,status:row?.status||'Pendiente',assigned_to:chosen.main?.id||null,collaborator_assigned_to:chosen.coll?.id||null};
    }});
    if(!value) return;
    if(!value.requester_name||!value.service_type||!value.description) return Swal.fire({icon:'warning',title:'Datos obligatorios',text:'Complete solicitante, servicio y descripción.'});
    if(allowNew && !tasks.some(t=>t.name===value.service_type)){ await supa.from('task_types').upsert({name:value.service_type,description:value.service_type,weight:1,is_active:true},{onConflict:'name'}); }
    const res=id?await supa.from('support_tickets').update(value).eq('id',id).select().single():await supa.from('support_tickets').insert(value).select().single();
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    await Swal.fire({icon:'success',title:'Ticket guardado'}); route('tickets');
  };

  window.openLoanFormV836=async function(id=null){
    const row=id?(state.rows.loans||[]).find(x=>x.id===id):{}; const [items,offices]=await Promise.all([fetchInventory(),fetchOffices()]); const profile=state.profile||{};
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.loans}</div><p>Solicitud de préstamo de insumos/equipos.</p></div><div class="swal-grid">
      <label>Solicitante<input id="l_requester_name" value="${safe(row?.requester_name||profile.full_name||'')}"></label>
      <label>Email<input id="l_requester_email" value="${safe(row?.requester_email||profile.email||'')}"></label>
      <label>Oficina<select id="l_office">${officeOptions(offices,row?.office||profile.office||'')}</select></label>
      <label>Insumo/Equipo<select id="l_item_id">${inventoryOptions(items,row?.item_id||row?.item_description||'')}</select></label>
      <label>Cantidad<input id="l_quantity" type="number" min="1" value="${safe(row?.quantity||1)}"></label>
      <label>Inicio<input id="l_start_at" type="datetime-local" value="${row?.start_at?String(row.start_at).slice(0,16):''}"></label>
      <label>Vencimiento<input id="l_due_at" type="datetime-local" value="${row?.due_at?String(row.due_at).slice(0,16):''}"></label>
      <label>Estado<select id="l_status">${['Pendiente','Aprobado','Rechazado','Entregado','Devuelto'].map(x=>`<option ${String(row?.status||'Pendiente')===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="full">Observaciones<textarea id="l_observations">${safe(row?.observations||'')}</textarea></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar préstamo':'Nuevo Gestión de Préstamos',html,width:850,showCancelButton:true,confirmButtonText:'Guardar',customClass:{popup:'tm-modal'},preConfirm:()=>{ const opt=q('#l_item_id').selectedOptions[0]; return {requester_name:q('#l_requester_name').value.trim(),requester_email:q('#l_requester_email').value.trim(),office:q('#l_office').value,item_id:q('#l_item_id').value||null,item_description:opt?.dataset?.label||opt?.textContent||'',quantity:Number(q('#l_quantity').value||1),start_at:q('#l_start_at').value||null,due_at:q('#l_due_at').value||null,status:q('#l_status').value,returned_at:q('#l_status').value==='Devuelto'?(row?.returned_at||new Date().toISOString()):row?.returned_at||null,observations:q('#l_observations').value.trim()}; }});
    if(!value) return; if(!value.requester_name||!value.item_description) return Swal.fire({icon:'warning',title:'Complete solicitante e insumo/equipo'});
    const oldStatus=row?.status; const res=id?await supa.from('loans').update(value).eq('id',id).select().single():await supa.from('loans').insert(value).select().single();
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    if(id && value.status!==oldStatus) await notify('Préstamo actualizado',`Su préstamo de ${value.item_description} cambió a ${value.status}.`,'loans',id);
    await Swal.fire({icon:'success',title:'Préstamo guardado'}); route('loans');
  };

  window.renderLoansV836=async function(){
    const c=crud.loans; page(c.title,c.desc); let qry=supa.from('loans').select('*,inventory_items(name,brand,model,serial_number)',{count:'exact'}).order('created_at',{ascending:false});
    if(!isPriv()) qry=qry.eq('requester_email',state.profile.email);
    const {data,error,count}=await qry; if(error) return $('#content').innerHTML=`<div class="card"><p>${safe(error.message)}</p></div>`;
    state.rows.loans=data||[]; state.selected.loans=new Set();
    $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Gestión de Préstamos</h2><p>${isPriv()?'Aprobación, entrega y devolución de préstamos.':'Sus solicitudes de préstamo.'}</p></div><div class="module-actions"><button class="btn primary" onclick="openLoanFormV836()">Nuevo</button><button class="btn" onclick="exportCsv('loans')">Exportar CSV</button><button class="btn" onclick="exportPdf('loans')">PDF A4</button></div></div><p>${count||0} registros</p><div class="table-wrap"><table><thead><tr><th></th><th>Solicitante</th><th>Email</th><th>Oficina</th><th>Insumo/Equipo</th><th>Cantidad</th><th>Estado</th><th>Inicio</th><th>Vencimiento</th><th>Devolución</th><th>Acciones</th></tr></thead><tbody>${(data||[]).map(l=>`<tr><td><input type="checkbox" onchange="toggleOne('loans','${l.id}',this.checked)"></td><td>${safe(l.requester_name)}</td><td>${safe(l.requester_email)}</td><td>${safe(l.office)}</td><td>${safe(l.item_description||l.inventory_items?.name||'-')}</td><td>${safe(l.quantity)}</td><td><span class="badge">${safe(l.status)}</span></td><td>${fmt(l.start_at)}</td><td>${fmt(l.due_at)}</td><td>${fmt(l.returned_at)}</td><td class="row-actions"><button class="icon-mini" onclick="openLoanFormV836('${l.id}')">${ico.edit}</button>${isPriv()?`<button class="icon-mini" onclick="deleteRow('loans','${l.id}')">${ico.trash}</button>`:''}</td></tr>`).join('')||'<tr><td colspan="11">Sin préstamos.</td></tr>'}</tbody></table></div></div>`;
  };

  const oldOpenForm836=window.openForm;
  window.openForm=async function(key,id=null){
    if(key==='tickets') return openTicketFormV836(id);
    if(key==='loans') return openLoanFormV836(id);
    if(key==='users') return openUserFormV836(id);
    return oldOpenForm836 ? oldOpenForm836(key,id) : null;
  };

  window.openUserFormV836=async function(id=null){
    const row=id?(state.rows.users||[]).find(x=>x.id===id):{}; const offices=await fetchOffices(); const rolesRows=await supa.from('roles').select('name').order('name'); const roles=(rolesRows.data||[]).map(r=>r.name); if(!roles.includes('Técnicos')) roles.push('Técnicos');
    const days=Array.isArray(row?.work_days)?row.work_days.map(String):['1','2','3','4','5'];
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${row?.avatar_url?`<img src="${safe(row.avatar_url)}">`:ico.users}</div><p>Complete los datos del usuario y su horario laboral.</p></div><div class="swal-grid">
      <label>Nombre completo<input id="u_full_name" value="${safe(row?.full_name||'')}"></label><label>Email<input id="u_email" value="${safe(row?.email||'')}"></label>
      <label>Perfil<select id="u_role_name">${roles.map(r=>`<option ${String(row?.role_name||'Usuarios')===r?'selected':''}>${safe(r)}</option>`).join('')}</select></label><label>Oficina/Repartición<select id="u_office">${officeOptions(offices,row?.office||'')}</select></label>
      <label>Teléfono<input id="u_phone" value="${safe(row?.phone||'')}"></label><label>Activo<select id="u_is_active"><option value="true" ${row?.is_active!==false?'selected':''}>Sí</option><option value="false" ${row?.is_active===false?'selected':''}>No</option></select></label>
      <label class="full">Días laborales<div>${[['1','Lun'],['2','Mar'],['3','Mié'],['4','Jue'],['5','Vie'],['6','Sáb'],['0','Dom']].map(([v,l])=>`<label class="checkline inline"><input type="checkbox" class="u_day" value="${v}" ${days.includes(v)?'checked':''}>${l}</label>`).join('')}</div></label>
      <label>Inicio jornada<input id="u_work_start" type="time" value="${safe((row?.work_start||'08:00').slice(0,5))}"></label><label>Fin jornada<input id="u_work_end" type="time" value="${safe((row?.work_end||'14:00').slice(0,5))}"></label>
      <label class="full password-box">Contraseña nueva / modificar<input id="u_password" type="password" placeholder="Dejar vacío para no cambiar"></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Usuario':'Nuevo Usuario',html,width:920,showCancelButton:true,confirmButtonText:'Guardar',customClass:{popup:'tm-modal'},preConfirm:()=>({id:id||row?.id||null,email:q('#u_email').value.trim().toLowerCase(),full_name:q('#u_full_name').value.trim(),role_name:q('#u_role_name').value,office:q('#u_office').value,phone:q('#u_phone').value.trim(),is_active:q('#u_is_active').value==='true',work_days:qa('.u_day:checked').map(x=>x.value),work_start:q('#u_work_start').value,work_end:q('#u_work_end').value,password:q('#u_password').value})});
    if(!value) return; if(!value.email||!value.full_name) return Swal.fire({icon:'warning',title:'Email y nombre son obligatorios'});
    if(value.id){
      const payload={email:value.email,full_name:value.full_name,role_name:value.role_name,office:value.office,phone:value.phone,is_active:value.is_active,work_days:value.work_days,work_start:value.work_start,work_end:value.work_end,updated_at:new Date().toISOString()};
      const r=await supa.from('profiles').update(payload).eq('id',value.id); if(r.error) return Swal.fire({icon:'error',title:'No se pudo guardar perfil',text:r.error.message});
      if(value.password && window.callAdminCreateUserV836) await window.callAdminCreateUserV836(value);
    } else {
      if(window.callAdminCreateUserV836) await window.callAdminCreateUserV836(value); else return Swal.fire({icon:'error',title:'Edge Function requerida',text:'Para crear usuarios se requiere admin-create-user.'});
    }
    await Swal.fire({icon:'success',title:'Usuario guardado'}); route('users');
  };
  window.callAdminCreateUserV836=async function(v){
    const {data:{session}}=await supa.auth.getSession();
    const resp=await fetch(`${cfg.SUPABASE_URL}/functions/v1/admin-create-user`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session?.access_token}`,'apikey':cfg.SUPABASE_ANON_KEY},body:JSON.stringify({p_id:v.id,p_email:v.email,p_full_name:v.full_name,p_role_name:v.role_name,p_office:v.office,p_phone:v.phone,p_is_active:v.is_active,p_password:v.password,work_days:v.work_days,work_start:v.work_start,work_end:v.work_end})});
    const js=await resp.json().catch(()=>({})); if(!resp.ok||js.success===false) throw new Error(js.error||'No se pudo crear/actualizar usuario en Auth.'); return js;
  };

  window.renderRolesPermsV830=async function(){
    if(!isSuper()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    let roles=['SuperAdmin','Admin','Técnicos','Usuarios'];
    try{ const rr=await supa.from('roles').select('name').order('name'); if(rr.data?.length) roles=rr.data.map(r=>r.name); }catch(e){}
    let perms={}; try{ const pr=await supa.from('role_module_permissions').select('*'); (pr.data||[]).forEach(r=>{ perms[r.role_name]??={}; perms[r.role_name][r.module_key]=actions836.filter(a=>r['can_'+a]); }); }catch(e){}
    roles.forEach(r=>{ perms[r]??={}; moduleOrder836.filter(m=>m!=='logout').forEach(m=>{ perms[r][m]??=(r==='SuperAdmin'?actions836:['view']); }); });
    const rows=roles.map(r=>`<tr><td><b>${safe(r)}</b></td>${moduleOrder836.filter(m=>!['logout','profile'].includes(m)).map(m=>`<td><div class="perm-cell"><b>${safe(moduleLabels836[m])}</b>${actions836.map(a=>`<label class="checkline"><input type="checkbox" data-role="${safe(r)}" data-module="${m}" data-action="${a}" ${(perms[r]?.[m]||[]).includes(a)?'checked':''} ${r==='SuperAdmin'?'disabled':''}> ${safe(actionLabels836[a])}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
    $('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales.</p></div><div class="module-actions"><button class="btn" onclick="newRoleV835()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV836()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${moduleOrder836.filter(m=>!['logout','profile'].includes(m)).map(m=>`<th>${safe(moduleLabels836[m])}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  };
  window.saveRolePermsV836=async function(){
    const roles=[...new Set(qa('input[data-role]').map(i=>i.dataset.role).filter(r=>r && r!=='SuperAdmin'))]; const rows=[];
    roles.forEach(r=>moduleOrder836.filter(m=>!['logout','profile'].includes(m)).forEach(m=>{ const row={role_name:r,module_key:m,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false}; actions836.forEach(a=>row['can_'+a]=!!q(`input[data-role="${CSS.escape(r)}"][data-module="${m}"][data-action="${a}"]`)?.checked); rows.push(row); }));
    let del=await supa.from('role_module_permissions').delete().neq('role_name','SuperAdmin'); if(del.error) return Swal.fire({icon:'error',title:'No se pudo limpiar permisos',text:del.error.message});
    let ins=await supa.from('role_module_permissions').insert(rows); if(ins.error) return Swal.fire({icon:'error',title:'No se pudo guardar permisos',text:ins.error.message});
    await Swal.fire({icon:'success',title:'Permisos guardados'}); route('roles');
  };
  window.saveRolePermsV835=window.saveRolePermsV836;

  window.renderExceptionsV835=async function(){
    if(!isSuper()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Excepciones','Horarios laborales, licencias, vacaciones, permisos de salida, tareas especiales y reglas de asignación aleatoria.');
    const [ex,techs,tasks]=await Promise.all([supa.from('technician_exceptions').select('*,profiles(full_name,email)').order('start_at',{ascending:false}).limit(500),fetchTechnicians(),fetchTasks()]);
    $('#content').innerHTML=`<div class="card exceptions-page"><div class="module-head"><div><h2>Excepciones</h2><p>Los técnicos con excepciones activas quedan fuera de la asignación automática.</p></div><div class="module-actions"><button class="btn primary" onclick="newExceptionV835()">Nueva excepción</button><button class="btn" onclick="newTaskTypeV835()">Nueva tarea</button><button class="btn" onclick="exportCsv('exceptions')">Exportar CSV</button><button class="btn" onclick="exportExceptionsPdfV835()">PDF A4</button></div></div><div class="exceptions-grid"><section><h3>Excepciones cargadas</h3><div class="table-wrap"><table><thead><tr><th>Técnico</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Motivo</th><th>Acciones</th></tr></thead><tbody>${(ex.data||[]).map(e=>`<tr><td>${safe(e.profiles?.full_name||'-')}</td><td>${safe(e.type)}</td><td>${fmt(e.start_at)}</td><td>${fmt(e.end_at)}</td><td>${safe(e.reason||'')}</td><td><button class="icon-mini" onclick="deleteExceptionV835('${e.id}')">${ico.trash}</button></td></tr>`).join('')||'<tr><td colspan="6">Sin excepciones.</td></tr>'}</tbody></table></div></section><section><h3>Tareas técnicas</h3><div class="table-wrap"><table><thead><tr><th>Tarea</th><th>Peso</th><th>Activo</th></tr></thead><tbody>${(tasks||[]).map(t=>`<tr><td>${safe(t.name)}<br><small>${safe(t.description||'')}</small></td><td>${safe(t.weight||1)}</td><td>${t.is_active?'Sí':'No'}</td></tr>`).join('')}</tbody></table></div><h3>Técnicos activos</h3><div class="table-wrap tech-table"><table><tbody>${(techs||[]).map(t=>`<tr><td>${safe(t.full_name)}</td><td>${safe(t.email)}</td></tr>`).join('')}</tbody></table></div></section></div></div>`;
  };
  window.renderExceptionsV834=window.renderExceptionsV835;

  const previousRoute=window.route||route;
  window.route=async function(p){
    if(p==='logout'){ await supa.auth.signOut(); location.replace('./index.html'); return; }
    normalizeMenu836(); state.page=p; syncNavActive();
    if(p==='dashboard'){ await renderDashboard(); syncNavActive(); updateNotificationCountV836(); return; }
    if(p==='roles'){ await renderRolesPermsV830(); syncNavActive(); updateNotificationCountV836(); return; }
    if(p==='exceptions'){ await renderExceptionsV835(); syncNavActive(); updateNotificationCountV836(); return; }
    if(p==='loans'){ await renderLoansV836(); syncNavActive(); updateNotificationCountV836(); return; }
    const r=await previousRoute(p); state.page=p; syncNavActive(); updateNotificationCountV836(); return r;
  };
  try{route=window.route;}catch(e){}
  const previousShell=window.renderShell||renderShell;
  window.renderShell=function(){ normalizeMenu836(); previousShell(); qa('.nav button span').forEach(s=>{ if(s.textContent.includes('Dtos/Oficinas/Reparticiones')) s.textContent='Dtos/Oficinas'; }); dedupeNotifyBadge836(); syncNavActive(); updateNotificationCountV836(); };
  try{renderShell=window.renderShell;}catch(e){}
  setInterval(updateNotificationCountV836,20000);
})();


/* ========================= v8.37 FINAL URGENT HOTFIX
   Dashboard calendar restored, Exceptions responsive + multi-tech create,
   notification badge dedupe, Roles access fix, Support/Loans/User autocomplete.
========================= */
(function(){
  const q=(sel,root=document)=>root.querySelector(sel);
  const qa=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const esc837=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const role837=()=>String(state?.profile?.role_name||'Usuarios');
  const isSuper837=()=>role837()==='SuperAdmin';
  const isTech837=()=>['Técnicos','Tecnicos','Profesional técnico','Profesional Técnico'].includes(role837());
  const isPriv837=()=>['SuperAdmin','Admin','Técnicos','Tecnicos','Profesional técnico','Profesional Técnico'].includes(role837());
  const fmt837=(d)=>d?new Date(d).toLocaleString('es-AR'):'-';
  const moneylessDate=(d)=>d?new Date(d):new Date();

  const labels837={dashboard:'Dashboard',users:'Usuarios',roles:'Roles y Permisos',orders:'Órdenes de Servicio',inventory:'Inventario',loans:'Gestión de Préstamos',tickets:'Soporte Ticket',notifications:'Notificaciones',offices:'Dtos/Oficinas',exceptions:'Excepciones',profile:'Mi Perfil',settings:'Configuraciones',logout:'Cerrar Sesión'};
  const order837=['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','exceptions','profile','settings','logout'];
  const actions837=['view','create','edit','delete','import','export'];
  const actionLabels837={view:'Ver',create:'Crear',edit:'Editar',delete:'Eliminar',import:'Importar CSV',export:'Exportar CSV/PDF'};

  function injectCss837(){
    if(q('#tm-v837-css')) return;
    const st=document.createElement('style'); st.id='tm-v837-css';
    st.textContent=`
      .notify-trigger{position:relative!important;overflow:visible!important}
      .notify-trigger .notify-badge,.notify-trigger .badge-notifications,.notify-trigger .notif-badge-count:not(:last-child){display:none!important}
      .notif-badge-count{position:absolute!important;right:-5px!important;top:-7px!important;min-width:18px!important;height:18px!important;padding:0 5px!important;border-radius:999px!important;background:#ef4444!important;color:#fff!important;font-size:11px!important;line-height:18px!important;font-weight:900!important;text-align:center!important;box-shadow:0 0 0 2px #0b1222!important}
      .calendar-grid837{display:grid;grid-template-columns:repeat(7,minmax(90px,1fr));gap:8px;margin-top:14px}
      .cal-head837{font-weight:900;color:#9fc6ff;text-align:center;font-size:12px;text-transform:uppercase}
      .cal-day837{min-height:92px;border:1px solid rgba(148,163,184,.22);border-radius:14px;background:rgba(15,23,42,.48);padding:8px;overflow:hidden}
      .cal-num837{display:block;text-align:right;font-weight:900;color:#e5edf8}
      .cal-item837{display:block;margin-top:5px;padding:5px 6px;border-radius:8px;background:rgba(124,92,255,.28);border:1px solid rgba(124,92,255,.35);font-size:11px;line-height:1.15;color:#fff;text-decoration:none}
      .mini-stats837{display:grid;grid-template-columns:repeat(2,minmax(120px,1fr));gap:12px;margin:16px 0}
      .mini-stats837 b{display:block;padding:10px;border-radius:12px;background:rgba(15,23,42,.55);border:1px solid rgba(148,163,184,.16)}
      .status-line837{display:flex;justify-content:space-between;gap:10px;padding:9px 12px;border-bottom:1px solid rgba(148,163,184,.15);background:rgba(15,23,42,.35)}
      .exceptions-page837{overflow:hidden}
      .exceptions-grid837{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;align-items:start}
      .exceptions-grid837 section{min-width:0}
      .exceptions-grid837 .table-wrap{max-width:100%;overflow:auto;border-radius:14px}
      .exceptions-grid837 table{width:100%;min-width:620px}
      .exceptions-grid837 .compact-table837{min-width:420px}
      .tm-check-grid837{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;text-align:left;max-height:240px;overflow:auto;padding:8px;border:1px solid rgba(148,163,184,.25);border-radius:12px;background:rgba(15,23,42,.35)}
      .tm-check-grid837 label{display:flex;align-items:center;gap:8px;font-weight:700}
      .tm-two837{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .tm-two837 label,.tm-full837{display:block;text-align:left;font-weight:800}
      .tm-two837 input,.tm-two837 select,.tm-full837 textarea,.tm-full837 input{width:100%;box-sizing:border-box}
      @media(max-width:900px){.exceptions-grid837{grid-template-columns:1fr}.calendar-grid837{grid-template-columns:repeat(2,minmax(0,1fr))}.cal-head837{display:none}.tm-two837{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  function normalizeMenu837(){
    try{
      if(Array.isArray(modules)){
        modules.forEach(m=>{ if(labels837[m[0]]) m[1]=labels837[m[0]]; });
        const has=modules.some(m=>m[0]==='exceptions');
        if(isSuper837() && !has){
          const icoEx='<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="17" rx="2"/><path d="m9 15 2 2 4-5"/></svg>';
          const idx=modules.findIndex(m=>m[0]==='profile'); modules.splice(idx>=0?idx:modules.length-1,0,['exceptions','Excepciones',icoEx]);
        }
        if(!isSuper837()){ const i=modules.findIndex(m=>m[0]==='exceptions'); if(i>=0) modules.splice(i,1); }
      }
    }catch(e){}
  }

  window.syncNavActive=function(){
    qa('.nav button, .mobile-dock button[data-page]').forEach(b=>{
      const on=String(b.dataset.page)===String(state?.page);
      b.classList.toggle('active',on);
      if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
      const sp=b.querySelector('span'); if(sp && labels837[b.dataset.page]) sp.textContent=labels837[b.dataset.page];
    });
  };

  function dedupeBadge837(){
    const btn=q('#notifyBtn'); if(!btn) return null;
    qa('.notify-badge,.badge-notifications',btn).forEach(e=>e.remove());
    const badges=qa('.notif-badge-count',btn);
    badges.slice(0,-1).forEach(e=>e.remove());
    let b=qa('.notif-badge-count',btn).pop();
    if(!b){ b=document.createElement('span'); b.className='notif-badge-count'; btn.appendChild(b); }
    return b;
  }
  window.updateNotificationCountV837=async function(){
    try{
      const b=dedupeBadge837(); if(!b) return;
      let qry=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false);
      if(!isSuper837()) qry=qry.or(`target_user.eq.${state.user?.id},target_role.eq.${role837()},target_role.is.null`);
      const {count,error}=await qry;
      const n=error?0:(count||0);
      b.textContent=n>99?'99+':String(n);
      b.hidden=n<=0;
    }catch(e){}
  };
  window.updateNotificationCountV836=window.updateNotificationCountV837;
  window.updateNotificationCountV835=window.updateNotificationCountV837;
  window.loadNotificationCount=window.updateNotificationCountV837;

  async function fetchOffices837(){
    const {data}=await supa.from('offices').select('*').eq('is_active',true).order('name');
    return data||[];
  }
  async function fetchTasks837(){
    const {data}=await supa.from('task_types').select('*').eq('is_active',true).order('name');
    return data||[];
  }
  async function fetchTechs837(){
    const {data}=await supa.from('profiles').select('id,full_name,email,role_name,is_active,office,work_days,work_start,work_end').in('role_name',['Técnicos','Tecnicos']).eq('is_active',true).order('full_name');
    return data||[];
  }
  function officeOptions837(rows,val=''){
    return `<option value="">Sin seleccionar</option>`+(rows||[]).map(o=>{
      const label=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name;
      return `<option value="${esc837(label)}" ${String(val)===label||String(val)===o.name?'selected':''}>${esc837(label)}</option>`;
    }).join('');
  }
  function taskOptions837(rows,val='',allowNew=false){
    return `<option value="">Seleccione...</option>`+(rows||[]).map(t=>`<option value="${esc837(t.name)}" ${String(val)===String(t.name)?'selected':''}>${esc837(t.name)}</option>`).join('')+(allowNew?`<option value="__new__">+ Crear nuevo servicio...</option>`:'');
  }
  async function isAvailable837(t, taskName=null){
    const now=new Date();
    const day=String(now.getDay());
    const hm=now.toTimeString().slice(0,5);
    const days=Array.isArray(t.work_days)?t.work_days.map(String):['1','2','3','4','5'];
    if(days.length && !days.includes(day)) return false;
    if(t.work_start && hm<String(t.work_start).slice(0,5)) return false;
    if(t.work_end && hm>String(t.work_end).slice(0,5)) return false;
    const {data:ex}=await supa.from('technician_exceptions').select('id').eq('technician_id',t.id).eq('is_active',true).lte('start_at',now.toISOString()).or(`end_at.is.null,end_at.gte.${now.toISOString()}`).limit(1);
    if((ex||[]).length) return false;
    return true;
  }
  async function chooseTechs837(taskName, qty){
    const techs=await fetchTechs837(), ok=[];
    for(const t of techs){ if(await isAvailable837(t,taskName)) ok.push(t); }
    ok.sort(()=>Math.random()-.5);
    return {main:ok[0]||null, coll:Number(qty)>7?(ok[1]||null):null, all:ok};
  }

  window.renderDashboard=async function(){
    injectCss837();
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    let oq=supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false});
    if(isTech837()) oq=oq.or(`assigned_to.eq.${state.user.id},technician_user_id.eq.${state.user.id},collaborator_assigned_to.eq.${state.user.id}`);
    const [usersR,ordersR,ticketsR,invR]=await Promise.all([
      supa.from('profiles').select('id',{count:'exact',head:true}),
      oq,
      supa.from('support_tickets').select('id',{count:'exact',head:true}),
      supa.from('inventory_items').select('id',{count:'exact',head:true})
    ]);
    const orders=ordersR.data||[], totalOrders=ordersR.count??orders.length;
    const now=new Date();
    const finalNames=['Terminada','Entregada','Lista p/Retirar'];
    const urgent=orders.filter(o=>o.priority==='Urgente').length;
    const overdue=orders.filter(o=>!finalNames.includes(o.service_order_statuses?.name||'') && (now-new Date(o.received_at||o.created_at||now))>7*864e5).length;
    const pending=orders.filter(o=>!finalNames.includes(o.service_order_statuses?.name||'')).length;
    const done=orders.filter(o=>finalNames.includes(o.service_order_statuses?.name||'')).length;
    const byStatus={}; orders.forEach(o=>{const k=o.service_order_statuses?.name||'Sin estado'; byStatus[k]=(byStatus[k]||0)+1;});
    const y=now.getFullYear(), m=now.getMonth();
    const first=new Date(y,m,1), last=new Date(y,m+1,0);
    const start=(first.getDay()+6)%7; // Monday first
    const days=[];
    for(let i=0;i<start;i++) days.push(null);
    for(let d=1;d<=last.getDate();d++) days.push(new Date(y,m,d));
    const dayItems=(d)=>orders.filter(o=>{const od=new Date(o.received_at||o.created_at); return od.getFullYear()===d.getFullYear()&&od.getMonth()===d.getMonth()&&od.getDate()===d.getDate();}).slice(0,3);
    $('#content').innerHTML=`
      <div class="grid dashboard-kpis">
        <div class="card kpi"><h3>Usuarios</h3><b>${usersR.count||0}</b><p>Perfiles autorizados.</p></div>
        <div class="card kpi"><h3>Órdenes</h3><b>${totalOrders}</b><p>${isTech837()?'Asignadas a su cuenta.':'Órdenes técnicas registradas.'}</p></div>
        <div class="card kpi warn"><h3>Urgentes</h3><b>${urgent}</b><p>Prioridad crítica</p></div>
        <div class="card kpi danger"><h3>Atrasadas</h3><b>${overdue}</b><p>Más de 7 días abiertas</p></div>
        <div class="card kpi"><h3>Tickets</h3><b>${ticketsR.count||0}</b><p>Solicitudes recibidas</p></div>
        <div class="card kpi"><h3>Inventario</h3><b>${invR.count||0}</b><p>Activos e insumos</p></div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>Alertas operativas</h2><p>${isTech837()?'Resumen de órdenes asignadas al profesional técnico logueado.':'Resumen general.'}</p>
          <div class="mini-stats837"><b>${urgent} urgentes</b><b>${pending} pendientes</b><b>${overdue} atrasadas</b><b>${done} listas/terminadas</b></div>
          <h3>Estados</h3>${Object.entries(byStatus).map(([k,v])=>`<div class="status-line837"><span>${esc837(k)}</span><b>${v}</b></div>`).join('')||'<p>Sin órdenes.</p>'}
        </div>
        <div class="card">
          <div class="module-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${now.toLocaleDateString('es-AR',{month:'long',year:'numeric'})}</p></div><button class="btn" onclick="route('orders')">Ver órdenes</button></div>
          <div class="calendar-grid837">
            ${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(x=>`<div class="cal-head837">${x}</div>`).join('')}
            ${days.map(d=>d?`<div class="cal-day837"><span class="cal-num837">${d.getDate()}</span>${dayItems(d).map(o=>`<a class="cal-item837" href="javascript:route('orders')">OS ${esc837(o.satmanager_order||o.order_number)} · ${esc837(o.requester_name||o.office||'')}</a>`).join('')}</div>`:`<div class="cal-day837 muted"></div>`).join('')}
          </div>
        </div>
      </div>`;
    updateNotificationCountV837();
  };

  window.newExceptionV837=async function(){
    injectCss837();
    const techs=await fetchTechs837();
    const types=['Tareas Especiales','Día de Vacaciones','Día Femenino','Licencia por Enfermedad','Permisos de Salidas','Otra excepción'];
    const html=`<div class="tm-form"><p>Los técnicos seleccionados quedarán fuera de la asignación automática durante el período indicado.</p>
      <label class="tm-full837">Profesionales técnicos</label><div class="tm-check-grid837">${techs.map(t=>`<label><input type="checkbox" class="ex_tech837" value="${t.id}"> ${esc837(t.full_name)} · ${esc837(t.email)}</label>`).join('')}</div>
      <div class="tm-two837"><label>Tipo<select id="ex_type837">${types.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Otra excepción<input id="ex_other837" placeholder="Completar si corresponde"></label><label>Inicio<input id="ex_start837" type="datetime-local"></label><label>Finalización<input id="ex_end837" type="datetime-local"></label></div>
      <label class="tm-full837">Motivo / detalle<textarea id="ex_reason837"></textarea></label></div>`;
    const {value}=await Swal.fire({title:'Nueva excepción',html,width:760,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{
      const ids=qa('.ex_tech837:checked').map(x=>x.value);
      const type=q('#ex_type837').value==='Otra excepción' && q('#ex_other837').value.trim()?q('#ex_other837').value.trim():q('#ex_type837').value;
      const start=q('#ex_start837').value, end=q('#ex_end837').value;
      if(!ids.length){ Swal.showValidationMessage('Seleccione al menos un técnico.'); return false; }
      if(!start){ Swal.showValidationMessage('Indique fecha y hora de inicio.'); return false; }
      if(end && new Date(end)<new Date(start)){ Swal.showValidationMessage('La finalización no puede ser anterior al inicio.'); return false; }
      return ids.map(id=>({technician_id:id,type,start_at:new Date(start).toISOString(),end_at:end?new Date(end).toISOString():null,reason:q('#ex_reason837').value.trim(),is_active:true,created_by:state.user?.id||null}));
    }});
    if(!value) return;
    const {error}=await supa.from('technician_exceptions').insert(value);
    if(error) return Swal.fire({icon:'error',title:'No se pudo crear la excepción',text:error.message});
    await Swal.fire({icon:'success',title:'Excepción guardada'});
    route('exceptions');
  };
  window.newExceptionV835=window.newExceptionV837;

  window.renderExceptionsV837=async function(){
    injectCss837();
    if(!isSuper837()) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'El módulo Excepciones solo está visible para SuperAdmin.'});
    page('Excepciones','Horarios laborales, licencias, vacaciones, permisos de salida, tareas especiales y reglas de asignación aleatoria.');
    const [exR,techs,tasks]=await Promise.all([
      supa.from('technician_exceptions').select('*,profiles(full_name,email)').order('start_at',{ascending:false}).limit(500),
      fetchTechs837(), fetchTasks837()
    ]);
    const ex=exR.data||[];
    $('#content').innerHTML=`<div class="card exceptions-page837"><div class="module-head"><div><h2>Excepciones</h2><p>Los técnicos con excepciones activas quedan fuera de la asignación automática.</p></div><div class="module-actions"><button class="btn primary" onclick="newExceptionV837()">Nueva excepción</button><button class="btn" onclick="newTaskTypeV835()">Nueva tarea</button><button class="btn" onclick="exportExceptionsCsv837()">Exportar CSV</button><button class="btn" onclick="exportExceptionsPdfV835()">PDF A4</button></div></div>
    <div class="exceptions-grid837">
      <section><h3>Excepciones cargadas</h3><div class="table-wrap"><table><thead><tr><th>Técnico</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Motivo</th><th>Acciones</th></tr></thead><tbody>${ex.map(e=>`<tr><td>${esc837(e.profiles?.full_name||'-')}<br><small>${esc837(e.profiles?.email||'')}</small></td><td>${esc837(e.type)}</td><td>${fmt837(e.start_at)}</td><td>${fmt837(e.end_at)}</td><td>${esc837(e.reason||'')}</td><td><button class="icon-mini" onclick="deleteExceptionV835('${e.id}')">${ico.trash}</button></td></tr>`).join('')||'<tr><td colspan="6">Sin excepciones.</td></tr>'}</tbody></table></div></section>
      <section><h3>Tareas técnicas</h3><div class="table-wrap"><table class="compact-table837"><thead><tr><th>Tarea</th><th>Peso</th><th>Activo</th></tr></thead><tbody>${(tasks||[]).map(t=>`<tr><td>${esc837(t.name)}<br><small>${esc837(t.description||'')}</small></td><td>${esc837(t.weight||1)}</td><td>${t.is_active?'Sí':'No'}</td></tr>`).join('')}</tbody></table></div>
      <h3>Técnicos activos</h3><div class="table-wrap"><table class="compact-table837"><tbody>${techs.map(t=>`<tr><td>${esc837(t.full_name)}</td><td>${esc837(t.email)}</td></tr>`).join('')}</tbody></table></div></section>
    </div></div>`;
  };
  window.renderExceptionsV835=window.renderExceptionsV837;
  window.renderExceptionsV834=window.renderExceptionsV837;

  window.exportExceptionsCsv837=function(){
    const rows=qa('#content table:first-of-type tr').map(tr=>qa('th,td',tr).map(td=>`"${td.innerText.replace(/"/g,'""')}"`).join(',')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([rows],{type:'text/csv;charset=utf-8'})); a.download='excepciones.csv'; a.click();
  };

  const oldSupportForm837=window.openTicketFormV836;
  window.openTicketFormV837=async function(id=null){
    const row=id?(state.rows.tickets||[]).find(x=>x.id===id):{};
    const [offices,tasks]=await Promise.all([fetchOffices837(),fetchTasks837()]);
    const profile=state.profile||{};
    const allowNew=isPriv837();
    const selected=row?.service_type||row?.incidence_type||'';
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.tickets}</div><p>Complete los datos solicitados para generar el ticket y asignar orden automáticamente.</p></div><div class="swal-grid">
      <label>Solicitante<input id="f_requester_name" value="${esc837(row?.requester_name||profile.full_name||'')}"></label>
      <label>Email<input id="f_requester_email" type="email" value="${esc837(row?.requester_email||profile.email||'')}"></label>
      <label>WhatsApp / Teléfono<input id="f_requester_phone" value="${esc837(row?.requester_phone||profile.phone||'')}"></label>
      <label>Oficina<select id="f_office">${officeOptions837(offices,row?.office||profile.office||'')}</select></label>
      <label>Área<input id="f_area" value="${esc837(row?.area||'')}"></label>
      <label>Servicio solicitado<select id="f_service_type">${taskOptions837(tasks,selected,allowNew)}</select><small>${allowNew?'Puede crear servicios nuevos.':'Solo perfiles autorizados pueden crear servicios nuevos.'}</small></label>
      <label id="newTaskBox837" style="display:none">Nuevo servicio<input id="f_new_service_type" placeholder="Ej. Cableado estructurado"></label>
      <label>Cantidad de equipos a revisar<input id="f_equipment_count" type="number" min="1" value="${esc837(row?.equipment_count||1)}"><small>Si es mayor a 7, se asigna colaborador automáticamente.</small></label>
      <div class="full assign-preview" id="assignPreview837"></div>
      <label>Prioridad<select id="f_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${String(row?.priority||'Media')===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="full">Descripción del problema<textarea id="f_description">${esc837(row?.description||'')}</textarea></label>
    </div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:920,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{
      const sel=q('#f_service_type'), qty=q('#f_equipment_count'), box=q('#newTaskBox837'), prev=q('#assignPreview837');
      const refresh=async()=>{ box.style.display=sel.value==='__new__'?'block':'none'; const task=sel.value==='__new__'?q('#f_new_service_type')?.value:sel.value; const r=await chooseTechs837(task,qty.value); prev.innerHTML=r.main?`<p><b>Responsable técnico:</b> ${esc837(r.main.full_name)}</p>${Number(qty.value)>7?`<p><b>Colaborador técnico:</b> ${r.coll?esc837(r.coll.full_name):'No hay colaboradores disponibles'}</p>`:''}<small>Asignación previa. Se confirma al guardar.</small>`:'<small>Sin técnicos disponibles para asignación automática.</small>'; };
      sel.onchange=refresh; qty.oninput=refresh; q('#f_new_service_type')?.addEventListener('input',refresh); setTimeout(refresh,60);
    },preConfirm:async()=>{
      const raw=q('#f_service_type').value; const service=raw==='__new__'?q('#f_new_service_type').value.trim():raw;
      const qty=Number(q('#f_equipment_count').value||1), chosen=await chooseTechs837(service,qty);
      return {requester_name:q('#f_requester_name').value.trim(),requester_email:q('#f_requester_email').value.trim(),requester_phone:q('#f_requester_phone').value.trim(),office:q('#f_office').value,area:q('#f_area').value.trim(),service_type:service,incidence_type:service,subject:service,task_type_id:null,equipment_count:qty,description:q('#f_description').value.trim(),priority:q('#f_priority').value,status:row?.status||'Pendiente',assigned_to:chosen.main?.id||null,collaborator_assigned_to:chosen.coll?.id||null};
    }});
    if(!value) return;
    if(!value.requester_name||!value.service_type||!value.description) return Swal.fire({icon:'warning',title:'Datos obligatorios',text:'Complete solicitante, servicio y descripción.'});
    if(allowNew && !tasks.some(t=>t.name===value.service_type)) await supa.from('task_types').upsert({name:value.service_type,description:value.service_type,weight:1,is_active:true},{onConflict:'name'});
    const res=id?await supa.from('support_tickets').update(value).eq('id',id).select().single():await supa.from('support_tickets').insert(value).select().single();
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    await Swal.fire({icon:'success',title:'Ticket guardado'}); route('tickets');
  };
  window.openTicketFormV836=window.openTicketFormV837;

  const oldOpenForm837=window.openForm;
  window.openForm=async function(key,id=null){
    if(key==='tickets') return window.openTicketFormV837(id);
    if(key==='loans' && window.openLoanFormV836) return window.openLoanFormV836(id);
    if(key==='users' && window.openUserFormV836) return window.openUserFormV836(id);
    return oldOpenForm837?oldOpenForm837(key,id):null;
  };

  window.renderRolesPermsV837=async function(){
    injectCss837();
    if(!isSuper837()) return Swal.fire({icon:'warning',title:'Acceso restringido'});
    page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    let roles=['SuperAdmin','Admin','Técnicos','Usuarios'];
    try{ const rr=await supa.from('roles').select('name').order('name'); if(rr.data?.length) roles=rr.data.map(r=>r.name); }catch(e){}
    let perms={}; try{ const pr=await supa.from('role_module_permissions').select('*'); (pr.data||[]).forEach(r=>{ perms[r.role_name]??={}; perms[r.role_name][r.module_key]=actions837.filter(a=>r['can_'+a]); }); }catch(e){}
    roles.forEach(r=>{ perms[r]??={}; order837.filter(m=>m!=='logout').forEach(m=>{ perms[r][m]??=(r==='SuperAdmin'?actions837:(m==='dashboard'?['view']:[])); }); });
    const rows=roles.map(r=>`<tr><td><b>${esc837(r)}</b></td>${order837.filter(m=>!['logout','profile'].includes(m)).map(m=>`<td><div class="perm-cell"><b>${esc837(labels837[m])}</b>${actions837.map(a=>`<label class="checkline"><input type="checkbox" data-role="${esc837(r)}" data-module="${m}" data-action="${a}" ${(perms[r]?.[m]||[]).includes(a)?'checked':''} ${r==='SuperAdmin'?'disabled':''}> ${esc837(actionLabels837[a])}</label>`).join('')}</div></td>`).join('')}</tr>`).join('');
    $('#content').innerHTML=`<div class="card roles-matrix"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales.</p></div><div class="module-actions"><button class="btn" onclick="newRoleV835()">Nuevo perfil</button><button class="btn primary" onclick="saveRolePermsV836()">Guardar permisos</button></div></div><div class="table-wrap"><table><thead><tr><th>Perfil</th>${order837.filter(m=>!['logout','profile'].includes(m)).map(m=>`<th>${esc837(labels837[m])}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  };
  window.renderRolesPermsV830=window.renderRolesPermsV837;

  const oldShell837=window.renderShell || (typeof renderShell!=='undefined'?renderShell:null);
  window.renderShell=function(){
    injectCss837(); normalizeMenu837();
    if(oldShell837) oldShell837();
    qa('.nav button span').forEach(sp=>{ if(sp.textContent.includes('Dtos/Oficinas/Reparticiones')) sp.textContent='Dtos/Oficinas'; });
    syncNavActive(); updateNotificationCountV837();
  };
  try{ renderShell=window.renderShell; }catch(e){}

  const prevRoute837=window.route || (typeof route!=='undefined'?route:null);
  window.route=async function(p){
    injectCss837(); normalizeMenu837();
    if(p==='logout'){ await supa.auth.signOut(); location.replace('./index.html'); return; }
    state.page=p; syncNavActive();
    if(p==='dashboard'){ await renderDashboard(); syncNavActive(); return; }
    if(p==='roles'){ await renderRolesPermsV837(); syncNavActive(); return; }
    if(p==='exceptions'){ await renderExceptionsV837(); syncNavActive(); return; }
    if(p==='tickets' && typeof renderCrud==='function'){ await renderCrud('tickets'); syncNavActive(); return; }
    if(p==='loans' && window.renderLoansV836){ await window.renderLoansV836(); syncNavActive(); return; }
    const r=prevRoute837?await prevRoute837(p):undefined;
    state.page=p; syncNavActive(); updateNotificationCountV837(); return r;
  };
  try{ route=window.route; }catch(e){}

  injectCss837();
  setTimeout(()=>{dedupeBadge837(); updateNotificationCountV837(); syncNavActive();},300);
  setInterval(updateNotificationCountV837,20000);
})();


/* ========================= v8.38 FINAL - Dashboard restore + exceptions save hotfix ========================= */
(function(){
  const $q=(s,r=document)=>r.querySelector(s);
  const $qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const safe=(v)=> (typeof esc==='function'?esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const currentRole=()=>String(window.state?.profile?.role_name || state?.profile?.role_name || 'Usuarios');
  const isSuper=()=>currentRole()==='SuperAdmin' || currentRole()==='SuperUser';

  function doneStatusName(o){
    const n=String(o?.service_order_statuses?.name || o?.status_name || '').trim();
    return ['Lista p/Retirar','Terminada','Finalizada','Entregada','Devuelto','Devuelta'].includes(n);
  }
  function orderDate(o){ return new Date(o?.received_at || o?.original_received_at || o?.created_at || Date.now()); }
  function canSeeOrderV838(o){
    if(isSuper() || currentRole()==='Admin') return true;
    if(currentRole()==='Técnicos' || currentRole()==='Tecnicos'){
      const uid=state?.user?.id;
      return [o.assigned_to,o.technician_user_id,o.attended_by,o.collaborator_assigned_to].filter(Boolean).includes(uid);
    }
    return true;
  }
  function monthNameV838(month,year){ return new Date(year,month,1).toLocaleDateString('es-AR',{month:'long',year:'numeric'}); }

  window.dashboardDetailsV838 = function(kind){
    const all=(state.rows?.orders||[]).filter(canSeeOrderV838);
    const now=new Date(), seven=7*24*60*60*1000;
    let rows=[], title='Detalle';
    if(kind==='users'){ title='Usuarios autorizados'; return route('users'); }
    if(kind==='orders'){ title='Órdenes técnicas'; rows=all; }
    if(kind==='urgent'){ title='Órdenes urgentes'; rows=all.filter(o=>o.priority==='Urgente'); }
    if(kind==='late'){ title='Órdenes atrasadas'; rows=all.filter(o=>!doneStatusName(o) && (now-orderDate(o))>seven); }
    if(kind==='tickets'){ title='Tickets'; return route('tickets'); }
    if(kind==='inventory'){ title='Inventario'; return route('inventory'); }
    const html=`<div class="table-wrap dashboard-list-popup"><table><thead><tr><th>Orden</th><th>Ingreso</th><th>Oficina</th><th>Técnico</th><th>Estado</th><th>Prioridad</th><th>Acción</th></tr></thead><tbody>${rows.map(o=>`<tr><td>#${safe(o.satmanager_order||o.order_number||'-')}</td><td>${typeof fmt==='function'?fmt(o.received_at||o.created_at):safe(o.received_at||o.created_at||'')}</td><td>${safe(o.office||o.requester_name||'-')}</td><td>${safe(o.professional_technician||o.technician_name||'-')}</td><td>${safe(o.service_order_statuses?.name||'Sin estado')}</td><td>${safe(o.priority||'-')}</td><td><button class="btn small" onclick="Swal.close();viewOrder('${o.id}')">Ver</button></td></tr>`).join('')||'<tr><td colspan="7">Sin registros.</td></tr>'}</tbody></table></div>`;
    Swal.fire({title,html,width:'92vw',customClass:{popup:'tm-modal'},confirmButtonText:'Cerrar'});
  };

  window.renderDashboardV838 = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [ordersRes, usersRes, ticketsRes, invRes] = await Promise.all([
      supa.from('service_orders').select('*,service_order_statuses(name,color)',{count:'exact'}).order('received_at',{ascending:false}),
      supa.from('profiles').select('*',{count:'exact'}),
      supa.from('support_tickets').select('*',{count:'exact'}),
      supa.from('inventory_items').select('*',{count:'exact'})
    ]);
    let orders=(ordersRes.data||[]).filter(canSeeOrderV838);
    state.rows=state.rows||{}; state.rows.orders=orders;
    const now=new Date(); const seven=7*24*60*60*1000;
    const urgent=orders.filter(o=>o.priority==='Urgente').length;
    const pending=orders.filter(o=>!doneStatusName(o)).length;
    const late=orders.filter(o=>!doneStatusName(o) && (now-orderDate(o))>seven).length;
    const done=orders.filter(doneStatusName).length;
    const roleTech=(currentRole()==='Técnicos'||currentRole()==='Tecnicos');
    const stats=[
      ['users','Usuarios',usersRes.count||0,'Perfiles autorizados.'],
      ['orders','Órdenes',roleTech?orders.length:(ordersRes.count||orders.length),'Órdenes técnicas registradas.'],
      ['urgent','Urgentes',urgent,'Prioridad crítica'],
      ['late','Atrasadas',late,'Más de 7 días abiertas'],
      ['tickets','Tickets',ticketsRes.count||0,'Solicitudes recibidas'],
      ['inventory','Inventario',invRes.count||0,'Activos e insumos']
    ];
    const statusMap={}; orders.forEach(o=>{ const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1; });
    const cal=state.dashboardCalendar || {month:now.getMonth(),year:now.getFullYear()};
    const first=new Date(cal.year,cal.month,1); const last=new Date(cal.year,cal.month+1,0).getDate();
    const offset=(first.getDay()+6)%7; const cells=[]; for(let i=0;i<offset;i++)cells.push(null); for(let d=1;d<=last;d++)cells.push(d); while(cells.length%7)cells.push(null);
    const ordersByDay={}; orders.forEach(o=>{ const d=orderDate(o); if(d.getFullYear()===cal.year && d.getMonth()===cal.month){ (ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o); }});
    const yearOptions=[]; for(let y=now.getFullYear()-4;y<=now.getFullYear()+4;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    const statusHtml=Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${safe(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(orders.length||1)*100))}%"></i></div>`).join('') || '<p>Sin estados registrados.</p>';
    $q('#content').innerHTML=`
      <div class="dash-stats v838">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="dashboardDetailsV838('${s[0]}')"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}</div>
      <div class="dash-grid-v89 v838">
        <section class="card dash-alerts"><h2>Alertas operativas</h2><p>${roleTech?'Resumen de tus órdenes asignadas.':'Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.'}</p><div class="alert-grid"><button onclick="dashboardDetailsV838('urgent')" class="alert-pill danger">${urgent} urgentes</button><button onclick="dashboardDetailsV838('orders')" class="alert-pill warn">${pending} pendientes</button><button onclick="dashboardDetailsV838('late')" class="alert-pill danger">${late} atrasadas</button><button onclick="dashboardDetailsV838('orders')" class="alert-pill ok">${done} listas/terminadas</button></div><h3>Estados</h3>${statusHtml}</section>
        <section class="card dash-calendar-card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${monthNameV838(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)" title="Mes anterior">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)" title="Mes siguiente">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89">${['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map(d=>`<b>${d}</b>`).join('')}${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')" title="Abrir detalle">OS ${safe(o.satmanager_order||o.order_number)} · ${safe(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
      </div>`;
    if(typeof updateNotificationCountV835==='function') updateNotificationCountV835();
  };

  window.changeDashboardMonth = function(delta){
    const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()};
    const d=new Date(cal.year,cal.month+Number(delta||0),1);
    state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()};
    window.renderDashboardV838();
  };
  window.changeDashboardYear = function(year){
    const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()};
    state.dashboardCalendar={month:cal.month,year:parseInt(year,10)||cal.year};
    window.renderDashboardV838();
  };

  const oldRouteV838 = window.route || (typeof route==='function'?route:null);
  window.route = async function(p){
    if(p==='dashboard'){ state.page='dashboard'; if(typeof syncNavActive==='function') syncNavActive(); return window.renderDashboardV838(); }
    return oldRouteV838 ? oldRouteV838(p) : null;
  };
  try{ route=window.route; renderDashboard=window.renderDashboardV838; }catch(e){}

  // Guardado robusto de excepciones: evita timestamp vacío y valida fechas.
  window.newExceptionV834 = window.newExceptionV835 = async function(){
    const {data:techs}=await supa.from('profiles').select('id,full_name,email').in('role_name',['Técnicos','Tecnicos']).eq('is_active',true).order('full_name');
    const opts=(techs||[]).map(t=>`<option value="${t.id}">${safe(t.full_name)} · ${safe(t.email)}</option>`).join('');
    const types=['Tareas Especiales','Día de Vacaciones','Día Femenino','Licencia por Enfermedad','Permisos de Salidas','Otra excepción'];
    const {value:f}=await Swal.fire({title:'Nueva excepción',customClass:{popup:'tm-modal'},html:`<div class="swal-grid one"><label>Técnico<select id="ex_tech">${opts}</select></label><label>Tipo<select id="ex_type">${types.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Inicio<input id="ex_start" type="datetime-local"></label><label>Finalización<input id="ex_end" type="datetime-local"></label><label>Motivo / detalle<textarea id="ex_reason"></textarea></label></div>`,showCancelButton:true,confirmButtonText:'Guardar',preConfirm:()=>{ const start=$q('#ex_start').value; if(!start){Swal.showValidationMessage('Indique fecha y hora de inicio.'); return false;} return {technician_id:$q('#ex_tech').value,type:$q('#ex_type').value,start_at:start,end_at:$q('#ex_end').value||null,reason:$q('#ex_reason').value||null,is_active:true,created_by:state.user?.id||null}; }});
    if(!f) return;
    const {error}=await supa.from('technician_exceptions').insert(f);
    if(error) return Swal.fire({icon:'error',title:'No se pudo guardar la excepción',text:error.message});
    Swal.fire({icon:'success',title:'Excepción guardada',timer:1200,showConfirmButton:false});
    if(typeof renderExceptionsV835==='function') return renderExceptionsV835();
    if(typeof renderExceptionsV834==='function') return renderExceptionsV834();
  };

  document.addEventListener('DOMContentLoaded',()=>{ if(state?.page==='dashboard') setTimeout(()=>window.renderDashboardV838(),80); });
})();

/* ========================= v8.39 FINAL: Dashboard visual v8.34 + oficinas paginadas ========================= */
(function(){
  const $ = window.$ || ((s,r=document)=>r.querySelector(s));
  const $$ = window.qa || ((s,r=document)=>Array.from(r.querySelectorAll(s)));
  const esc = (v)=>String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const DONE = ['Lista p/Retirar','Lista para retirar','Terminada','Finalizada','Entregada','Cerrada'];
  const SEVEN = 7*24*60*60*1000;
  const isSuperAdmin = ()=> ['SuperAdmin','Admin'].includes(String(window.currentRole?.() || state?.profile?.role_name || ''));
  const isTech = ()=> ['Técnicos','Tecnicos','Profesional Técnico','Profesional técnico'].includes(String(window.currentRole?.() || state?.profile?.role_name || ''));
  const canSeeOrder = (o)=>{
    if(isSuperAdmin()) return true;
    if(isTech()){
      const uid=state?.user?.id;
      return [o.assigned_to,o.technician_user_id,o.attended_by,o.collaborator_assigned_to].filter(Boolean).includes(uid);
    }
    return true;
  };
  const orderDate = (o)=>{ const d=new Date(o?.received_at||o?.original_received_at||o?.created_at||Date.now()); return isNaN(d)?new Date():d; };
  const done = (o)=> DONE.includes(o?.service_order_statuses?.name || o?.status || '');
  const monthName = (m,y)=>new Date(y,m,1).toLocaleDateString('es-AR',{month:'long',year:'numeric'});
  async function fetchRows(table, select='*', order='created_at', limit=5000){
    try{
      let q=supa.from(table).select(select,{count:'exact'}).limit(limit);
      if(order) q=q.order(order,{ascending:false});
      const {data,error,count}=await q;
      if(error){ console.warn('v839 fetchRows',table,error.message); return {data:[],count:0,error}; }
      return {data:data||[],count:count ?? (data||[]).length,error:null};
    }catch(e){ console.warn('v839 fetchRows exception',table,e); return {data:[],count:0,error:e}; }
  }
  function actionButtons(key,r){
    if(key==='orders') return `<button class="icon-mini" onclick="Swal.close();viewOrder('${r.id}')">${ico.view}</button><button class="icon-mini" onclick="Swal.close();route('orders');setTimeout(()=>openOrder('${r.id}'),350)">${ico.edit}</button>`;
    return `<button class="icon-mini" onclick="viewRecord('${key}','${r.id}')">${ico.view}</button><button class="icon-mini" onclick="Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${r.id}'),350)">${ico.edit}</button>`;
  }
  window.renderDashboardV839 = async function(){
    page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [or,ur,tr,ir]=await Promise.all([
      fetchRows('service_orders','*,service_order_statuses(name,color)','received_at',5000),
      fetchRows('profiles','*','created_at',5000),
      fetchRows('support_tickets','*','created_at',5000),
      fetchRows('inventory_items','*','created_at',5000)
    ]);
    const allOrders=(or.data||[]).filter(canSeeOrder), users=ur.data||[], tickets=tr.data||[], inv=ir.data||[];
    state.rows=state.rows||{}; state.rows.orders=allOrders; state.rows.users=users; state.rows.tickets=tickets; state.rows.inventory=inv;
    const now=new Date();
    const urgent=allOrders.filter(o=>String(o.priority||'').toLowerCase()==='urgente').length;
    const pending=allOrders.filter(o=>!done(o)).length;
    const late=allOrders.filter(o=>!done(o) && (now-orderDate(o))>SEVEN).length;
    const finished=allOrders.filter(done).length;
    const stats=[
      ['users','Usuarios',users.length,'Perfiles autorizados.'],
      ['orders','Órdenes',isTech()?allOrders.length:(or.count||allOrders.length),'Órdenes técnicas registradas.'],
      ['urgent','Urgentes',urgent,'Prioridad crítica'],
      ['late','Atrasadas',late,'Más de 7 días abiertas'],
      ['tickets','Tickets',tickets.length,'Solicitudes recibidas'],
      ['inventory','Inventario',inv.length,'Activos e insumos']
    ];
    const statusMap={}; allOrders.forEach(o=>{ const n=o.service_order_statuses?.name||'Sin estado'; statusMap[n]=(statusMap[n]||0)+1; });
    state.dashboardCalendar=state.dashboardCalendar||{month:now.getMonth(),year:now.getFullYear()};
    const cal=state.dashboardCalendar;
    const first=new Date(cal.year,cal.month,1), last=new Date(cal.year,cal.month+1,0).getDate();
    const offset=(first.getDay()+6)%7, cells=[]; for(let i=0;i<offset;i++) cells.push(null); for(let d=1;d<=last;d++) cells.push(d); while(cells.length%7) cells.push(null);
    const ordersByDay={}; allOrders.forEach(o=>{ const d=orderDate(o); if(d.getFullYear()===cal.year && d.getMonth()===cal.month){ (ordersByDay[d.getDate()]=ordersByDay[d.getDate()]||[]).push(o); }});
    const yearOptions=[]; for(let y=now.getFullYear()-5;y<=now.getFullYear()+5;y++) yearOptions.push(`<option value="${y}" ${y===cal.year?'selected':''}>${y}</option>`);
    $('#content').innerHTML=`
      <div class="dash-stats">${stats.map((s,i)=>`<article class="stat-card ${i===2?'warn':i===3?'danger':''}" onclick="openDashboardListV839('${s[0]}')"><small>${s[1]}</small><strong>${s[2]}</strong><span>${s[3]}</span></article>`).join('')}</div>
      <div class="dash-grid-v89">
        <section class="card"><h2>Alertas operativas</h2><p>${isTech()?'Resumen de órdenes asignadas al profesional técnico logueado.':'Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.'}</p><div class="alert-grid"><b class="danger-text">${urgent} urgentes</b><b class="warn-text">${pending} pendientes</b><b class="danger-text">${late} atrasadas</b><b class="ok-text">${finished} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(statusMap).map(([k,v])=>`<div class="progress-row"><span>${esc(k)}</span><b>${v}</b><i style="width:${Math.max(5,Math.min(100,v/(allOrders.length||1)*100))}%"></i></div>`).join('')||'<p>Sin estados registrados.</p>'}</section>
        <section class="card"><div class="module-head calendar-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${monthName(cal.month,cal.year)}</p></div><div class="calendar-controls"><button class="btn icon-only" onclick="changeDashboardMonth(-1)">←</button><button class="btn icon-only" onclick="changeDashboardMonth(1)">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${yearOptions.join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-v89"><b>lun</b><b>mar</b><b>mié</b><b>jue</b><b>vie</b><b>sáb</b><b>dom</b>${cells.map(d=>`<div class="cal-cell ${d===now.getDate()&&cal.month===now.getMonth()&&cal.year===now.getFullYear()?'today':''}">${d?`<strong>${d}</strong>${(ordersByDay[d]||[]).slice(0,4).map(o=>`<button onclick="viewOrder('${o.id}')">OS ${esc(o.satmanager_order||o.order_number)} · ${esc(o.office||o.requester_name||'')}</button>`).join('')}`:''}</div>`).join('')}</div></section>
      </div>`;
    if(typeof updateNotificationCountV835==='function') updateNotificationCountV835();
  };
  window.openDashboardListV839 = async function(kind){
    const orders=(state.rows.orders||[]).filter(canSeeOrder), users=state.rows.users||[], tickets=state.rows.tickets||[], inv=state.rows.inventory||[];
    const now=new Date(); let title='Registros', rows=[], key='orders', cols=[], pretty=[];
    if(kind==='users'){ title='Usuarios contabilizados'; rows=users; key='users'; cols=['full_name','email','role_name','office']; pretty=['Nombre completo','Email','Perfil','Oficina']; }
    if(kind==='orders'){ title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=['order_number','office','professional_technician','fault_description']; pretty=['Orden','Oficina','Profesional técnico','Falla / diagnóstico']; }
    if(kind==='urgent'){ title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente'); key='orders'; cols=['order_number','office','professional_technician','fault_description']; pretty=['Orden','Oficina','Profesional técnico','Falla / diagnóstico']; }
    if(kind==='late'){ title='Órdenes atrasadas'; rows=orders.filter(o=>!done(o) && (now-orderDate(o))>SEVEN); key='orders'; cols=['order_number','office','professional_technician','fault_description']; pretty=['Orden','Oficina','Profesional técnico','Falla / diagnóstico']; }
    if(kind==='tickets'){ title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=['ticket_number','requester_name','office','status']; pretty=['Ticket','Solicitante','Oficina','Estado']; }
    if(kind==='inventory'){ title='Inventario contabilizado'; rows=inv; key='inventory'; cols=['code','name','category','stock']; pretty=['Código','Nombre','Categoría','Stock']; }
    const html=`<div class="dashboard-list-popup"><div class="module-actions right"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table><thead><tr>${pretty.map(c=>`<th>${esc(c)}</th>`).join('')}<th>Acciones</th></tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c]??'')}</td>`).join('')}<td class="row-actions">${actionButtons(key,r)}</td></tr>`).join('')||`<tr><td colspan="${cols.length+1}">Sin registros.</td></tr>`}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:1120,customClass:{popup:'tm-modal dashboard-modal'},confirmButtonText:'OK'});
  };
  window.openDashboardList=window.openDashboardListV839;
  window.changeDashboardMonth=function(delta){ const cal=state.dashboardCalendar||{month:new Date().getMonth(),year:new Date().getFullYear()}; const d=new Date(cal.year,cal.month+(parseInt(delta,10)||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; window.renderDashboardV839(); };
  window.changeDashboardYear=function(y){ const now=new Date(); state.dashboardCalendar=state.dashboardCalendar||{month:now.getMonth(),year:now.getFullYear()}; state.dashboardCalendar.year=parseInt(y,10)||now.getFullYear(); window.renderDashboardV839(); };

  // Oficinas con paginación 5/10/25/50/100/500/1000 + navegación arriba/abajo
  window.officePageV839=window.officePageV839||1; window.officeSizeV839=window.officeSizeV839||10; window.officeSearchV839='';
  function officeLabel(o){ return [o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name || '-'; }
  function officePagerV839(total){ const pages=Math.max(1,Math.ceil(total/window.officeSizeV839)); window.officePageV839=Math.min(window.officePageV839,pages); return `<div class="pager"><label>Listar <select onchange="officeSizeV839=parseInt(this.value,10);officePageV839=1;renderOfficesV839()">${[5,10,25,50,100,500,1000].map(n=>`<option value="${n}" ${n===window.officeSizeV839?'selected':''}>${n}</option>`).join('')}</select></label><span>Página ${window.officePageV839} de ${pages} · ${total} registros</span><div><button class="btn" ${window.officePageV839<=1?'disabled':''} onclick="officePageV839--;renderOfficesV839()">← Atrás</button><button class="btn" ${window.officePageV839>=pages?'disabled':''} onclick="officePageV839++;renderOfficesV839()">Siguiente →</button></div></div>`; }
  window.renderOfficesV839 = async function(){
    page('Dtos/Oficinas','Departamentos, reparticiones, oficinas, dependencias y habitaciones centralizadas.');
    const {data,error}=await supa.from('offices').select('*').order('name');
    if(error) return $('#content').innerHTML=`<div class="card"><p>${esc(error.message)}</p></div>`;
    let rows=data||[]; state.rows.offices=rows; state.selected.offices=new Set();
    const term=String(window.officeSearchV839||'').toLowerCase(); if(term) rows=rows.filter(o=>Object.values(o).join(' ').toLowerCase().includes(term));
    const total=rows.length, start=(window.officePageV839-1)*window.officeSizeV839, visible=rows.slice(start,start+window.officeSizeV839), pag=officePagerV839(total);
    const bulk=`<div class="bulkbar"><label class="checkline"><input type="checkbox" onchange="toggleAll('offices',this.checked)"> Seleccionar todo</label><button class="btn" onclick="openForm('offices')">Nuevo</button><button class="btn danger" onclick="bulkDelete('offices')">Eliminar selección</button><span id="sel_offices">0 seleccionados</span></div>`;
    $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Dtos/Oficinas</h2><p>Origen único para selects de Usuarios, Órdenes, Inventario, Préstamos, Tickets, Notificaciones y Mi Perfil.</p></div><div class="module-actions"><button class="btn primary" onclick="openForm('offices')">Nuevo</button><button class="btn" onclick="exportCsv('offices')">Exportar CSV</button><button class="btn" onclick="exportPdf('offices')">PDF A4</button></div></div><input class="search" placeholder="Buscar departamento, repartición, oficina, dependencia o habitación..." value="${esc(window.officeSearchV839)}" oninput="officeSearchV839=this.value;officePageV839=1;renderOfficesV839()">${pag}${bulk}<div class="table-wrap"><table><thead><tr><th></th><th>Departamento</th><th>Repartición</th><th>Oficina</th><th>Dependencia</th><th>Habitación</th><th>Activo</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${visible.map(o=>`<tr data-id="${o.id}"><td><input type="checkbox" onchange="toggleOne('offices','${o.id}',this.checked)"></td><td>${esc(o.department||'-')}</td><td>${esc(o.repartition||'-')}</td><td>${esc(o.office_name||o.name||'-')}</td><td>${esc(o.dependency||'-')}</td><td>${esc(o.room||'-')}</td><td>${o.is_active!==false?'<span class="badge ok">Activo</span>':'<span class="badge danger">Inactivo</span>'}</td><td class="row-actions"><button class="icon-mini" onclick="viewRecord('offices','${o.id}')">${ico.view}</button><button class="icon-mini" onclick="openForm('offices','${o.id}')">${ico.edit}</button><button class="icon-mini danger" onclick="deleteRow('offices','${o.id}')">${ico.trash}</button></td></tr>`).join('')||'<tr><td colspan="8">Sin oficinas.</td></tr>'}</tbody></table></div>${bulk}${pag}</div>`;
  };

  const prevRoute=window.route || (typeof route==='function'?route:null);
  window.route = async function(p){
    if(p==='dashboard'){ state.page='dashboard'; if(typeof syncNavActive==='function') syncNavActive(); return window.renderDashboardV839(); }
    if(p==='offices'){ state.page='offices'; if(typeof syncNavActive==='function') syncNavActive(); return window.renderOfficesV839(); }
    return prevRoute?prevRoute(p):null;
  };
  try{ route=window.route; renderDashboard=window.renderDashboardV839; }catch(e){}
})();


/* ========================= v8.40 FINAL - Dashboard popups, notification preview, exceptions, loans pager, activity logs ========================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const E=(v)=> (typeof esc==='function'?esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const F=(v)=> (typeof fmt==='function'?fmt(v): (v?new Date(v).toLocaleString('es-AR'):'-'));
  const role=()=>String(state?.profile?.role_name||'Usuarios');
  const isSA=()=>['SuperAdmin','SuperUser'].includes(role());
  const isAdminish=()=>['SuperAdmin','SuperUser','Admin'].includes(role());
  const isTech=()=>['Técnicos','Tecnicos','Profesional Técnico'].includes(role());
  const uid=()=>state?.user?.id;

  function injectCss840(){
    if(q('#v840css')) return;
    const st=document.createElement('style'); st.id='v840css'; st.textContent=`
      .tm-modal.dashboard-modal-v840{max-width:min(1180px,96vw)!important;width:min(1180px,96vw)!important;padding:28px!important;}
      .dashboard-modal-v840 .swal2-html-container{margin:0!important;overflow:hidden!important;}
      .dash-popup-v840{width:100%;display:flex;flex-direction:column;gap:14px;}
      .dash-popup-v840 .module-actions{display:flex;justify-content:flex-end;margin-bottom:4px;}
      .dash-popup-v840 .table-wrap{width:100%;max-height:56vh;overflow:auto;border:1px solid var(--line,#263855);border-radius:16px;}
      .dash-popup-v840 table{width:100%;min-width:980px;border-collapse:collapse;table-layout:fixed;}
      .dash-popup-v840 th,.dash-popup-v840 td{padding:14px 12px;text-align:left;vertical-align:top;white-space:normal;word-break:normal;overflow-wrap:anywhere;line-height:1.25;border-bottom:1px solid rgba(148,163,184,.15);}
      .dash-popup-v840 th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#a8c7e8;}
      .dash-popup-v840 .col-order{width:95px;min-width:95px;white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important;font-weight:800;}
      .dash-popup-v840 .col-date{width:145px;}
      .dash-popup-v840 .col-office{width:190px;}
      .dash-popup-v840 .col-tech{width:170px;}
      .dash-popup-v840 .col-actions{width:120px;text-align:center;}
      .dash-popup-v840 .row-actions{display:flex;gap:8px;justify-content:center;white-space:nowrap;}
      .notification-popover,.notification-popover-v840{position:fixed;z-index:999999;background:#101b31;border:1px solid #2a3c5f;border-radius:16px;box-shadow:0 18px 55px rgba(0,0,0,.45);width:min(380px,92vw);padding:14px;color:#e8f0ff;}
      .notification-popover-v840 .np-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
      .notification-popover-v840 .np-head button{border:1px solid #334766;background:#1a2740;color:#fff;border-radius:10px;padding:8px 10px;font-weight:800;cursor:pointer;}
      .notification-popover-v840 .np-item{padding:10px;border-radius:12px;border:1px solid rgba(148,163,184,.15);margin:8px 0;background:rgba(15,23,42,.55);}
      .notification-popover-v840 .np-item b{display:block;font-size:13px}.notification-popover-v840 .np-item small{display:block;color:#b8c6dc;margin-top:4px}.notification-popover-v840 .np-item em{display:block;color:#86a2c7;font-size:11px;margin-top:4px;font-style:normal;}
      #notifyBtn{position:relative}.notif-badge-count{position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;border-radius:999px;background:#ef4444;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:900;border:2px solid #101b31;}
      .exceptions-page840 .exceptions-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:22px;align-items:start;overflow:hidden;}
      .exceptions-page840 .table-wrap{overflow:auto;max-width:100%;}
      .exception-tech-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;max-height:240px;overflow:auto;border:1px solid #334766;border-radius:14px;padding:10px;background:#101b31;}
      .exception-tech-grid label{display:flex;gap:8px;align-items:flex-start;border:1px solid rgba(148,163,184,.14);padding:8px;border-radius:10px;line-height:1.25;}
      .exception-tech-grid small{display:block;color:#9fb1ca;font-size:11px;margin-top:2px;word-break:break-word;}
      .exception-form840{display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:left;}.exception-form840 label{display:flex;flex-direction:column;gap:6px;font-weight:800}.exception-form840 .full{grid-column:1/-1}.exception-form840 input,.exception-form840 select,.exception-form840 textarea{width:100%;box-sizing:border-box;}
      @media(max-width:900px){.exceptions-page840 .exceptions-grid{grid-template-columns:1fr}.exception-form840{grid-template-columns:1fr}.tm-modal.dashboard-modal-v840{width:98vw!important;padding:18px!important}.dash-popup-v840 table{min-width:820px}}
      .logs-card .log-filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:12px 0}.logs-card .pager{margin:12px 0;}
    `; document.head.appendChild(st);
  }

  function installNotifyPreview840(){
    const btn=q('#notifyBtn'); if(!btn || btn.dataset.v840==='1') return; btn.dataset.v840='1';
    btn.querySelectorAll('.notif-badge-count,.notify-badge,.badge-notifications').forEach((b,i)=>{ if(i>0)b.remove(); });
    btn.addEventListener('mouseenter', showNotificationPreviewV840);
    btn.addEventListener('focus', showNotificationPreviewV840);
    btn.addEventListener('mouseleave', ()=>setTimeout(()=>{ if(!q('.notification-popover-v840:hover')) q('.notification-popover-v840')?.remove();},450));
  }
  window.showNotificationPreviewV840=async function(){
    injectCss840(); q('.notification-popover')?.remove(); q('.notification-popover-v840')?.remove();
    let data=[]; try{ const r=await supa.from('notifications').select('*').order('created_at',{ascending:false}).limit(6); data=r.data||[]; }catch(e){}
    const box=document.createElement('div'); box.className='notification-popover-v840';
    box.innerHTML=`<div class="np-head"><b>Notificaciones recientes</b><button onclick="document.querySelector('.notification-popover-v840')?.remove();route('notifications')">Historial de Notificaciones</button></div>${data.map(n=>`<div class="np-item"><b>${E(n.title)}</b><small>${E(n.body||'')}</small><em>${F(n.created_at)}</em></div>`).join('')||'<p>Sin notificaciones.</p>'}`;
    document.body.appendChild(box); const b=q('#notifyBtn').getBoundingClientRect(); box.style.top=(b.bottom+12)+'px'; box.style.right=Math.max(12,window.innerWidth-b.right)+'px';
    box.addEventListener('mouseleave',()=>box.remove());
  };
  const oldCount840=window.updateNotificationCountV837||window.updateNotificationCountV835||window.loadNotificationCount;
  window.updateNotificationCountV840=async function(){
    let count=0; try{ let query=supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false); if(!isAdminish()) query=query.or(`target_user.eq.${uid()},target_role.eq.${role()},target_role.is.null`); const r=await query; count=r.count||0; }catch(e){ try{ const r=await supa.from('notifications').select('id',{count:'exact',head:true}).eq('is_read',false); count=r.count||0;}catch(_){} }
    const btn=q('#notifyBtn'); if(btn){ btn.querySelectorAll('.notif-badge-count,.notify-badge,.badge-notifications').forEach((b,i)=>{ if(i>0)b.remove(); }); let b=btn.querySelector('.notif-badge-count'); if(!b){ b=document.createElement('span'); b.className='notif-badge-count'; btn.appendChild(b); } b.textContent=count>99?'99+':String(count); b.hidden=count===0; }
    return count;
  };
  window.loadNotificationCount=window.updateNotificationCountV840;

  function doneOrder(o){ const n=String(o?.service_order_statuses?.name||o?.status_name||'').trim(); return ['Lista p/Retirar','Terminada','Finalizada','Entregada','Devuelto','Devuelta'].includes(n); }
  function orderDate840(o){ return new Date(o?.received_at||o?.original_received_at||o?.created_at||Date.now()); }
  function canSeeOrder840(o){ if(isAdminish()) return true; if(isTech()) return [o.assigned_to,o.technician_user_id,o.attended_by,o.collaborator_assigned_to].filter(Boolean).includes(uid()); return true; }
  function actionBtns840(key,r){ if(typeof actionButtons==='function') return actionButtons(key,r); return `<button class="icon-mini" onclick="viewRecord('${key}','${r.id}')">Ver</button>`; }
  window.openDashboardListV840=async function(kind){
    injectCss840();
    const orders=(state.rows?.orders||[]).filter(canSeeOrder840), users=state.rows?.users||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[];
    const now=new Date(), seven=7*24*60*60*1000; let title='Registros', rows=[], key='orders', cols=[];
    if(kind==='users'){ title='Usuarios contabilizados'; rows=users; key='users'; cols=[['full_name','Nombre completo','col-office'],['email','Email',''],['role_name','Perfil','col-tech'],['office','Oficina','col-office']]; }
    if(kind==='orders'){ title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=[['order_number','Orden','col-order'],['office','Oficina','col-office'],['professional_technician','Profesional técnico','col-tech'],['fault_description','Falla / diagnóstico','']]; }
    if(kind==='urgent'){ title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente'); key='orders'; cols=[['order_number','Orden','col-order'],['office','Oficina','col-office'],['professional_technician','Profesional técnico','col-tech'],['fault_description','Falla / diagnóstico','']]; }
    if(kind==='late'){ title='Órdenes atrasadas'; rows=orders.filter(o=>!doneOrder(o)&&(now-orderDate840(o))>seven); key='orders'; cols=[['order_number','Orden','col-order'],['office','Oficina','col-office'],['professional_technician','Profesional técnico','col-tech'],['fault_description','Falla / diagnóstico','']]; }
    if(kind==='tickets'){ title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=[['ticket_number','Ticket','col-order'],['requester_name','Solicitante','col-office'],['office','Oficina','col-office'],['status','Estado','col-tech']]; }
    if(kind==='inventory'){ title='Inventario contabilizado'; rows=inv; key='inventory'; cols=[['code','Código','col-order'],['name','Nombre','col-office'],['category','Categoría','col-tech'],['stock','Stock','col-order']]; }
    const colgroup=`<colgroup>${cols.map(c=>`<col class="${c[2]||''}">`).join('')}<col class="col-actions"></colgroup>`;
    const body=rows.slice(0,500).map(r=>`<tr>${cols.map(([k,l,cls])=>`<td class="${cls||''}">${k==='order_number'?'#':''}${E(r[k]??'')}</td>`).join('')}<td class="row-actions col-actions">${actionBtns840(key,r)}</td></tr>`).join('')||`<tr><td colspan="${cols.length+1}">Sin registros.</td></tr>`;
    const html=`<div class="dash-popup-v840"><div class="module-actions"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="table-wrap"><table>${colgroup}<thead><tr>${cols.map(c=>`<th class="${c[2]||''}">${E(c[1])}</th>`).join('')}<th class="col-actions">Acciones</th></tr></thead><tbody>${body}</tbody></table></div><small>Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:'min(1180px,96vw)',customClass:{popup:'tm-modal dashboard-modal-v840'},confirmButtonText:'OK'});
  };
  window.openDashboardList=window.openDashboardListV839=window.openDashboardListV840;
  window.dashboardDetailsV838=window.openDashboardListV840;

  async function fetchTechs840(){ const {data}=await supa.from('profiles').select('id,full_name,email,role_name,is_active').in('role_name',['Técnicos','Tecnicos','Profesional Técnico']).eq('is_active',true).order('full_name'); return data||[]; }
  async function fetchTasks840(){ const {data}=await supa.from('task_types').select('*').order('name'); return data||[]; }
  window.renderExceptionsV840=async function(){
    injectCss840(); page('Excepciones','Horarios laborales, licencias, vacaciones, permisos de salida, tareas especiales y reglas de asignación aleatoria.');
    const [exRes, techs, tasks]=await Promise.all([supa.from('technician_exceptions').select('*').order('start_at',{ascending:false}).limit(500),fetchTechs840(),fetchTasks840()]);
    const techMap=Object.fromEntries(techs.map(t=>[t.id,t])); const ex=exRes.data||[];
    q('#content').innerHTML=`<div class="card exceptions-page840"><div class="module-head"><div><h2>Excepciones</h2><p>Los técnicos con excepciones activas quedan fuera de la asignación automática.</p></div><div class="module-actions"><button class="btn primary" onclick="newExceptionV840()">Nueva excepción</button><button class="btn" onclick="newTaskTypeV835()">Nueva tarea</button><button class="btn" onclick="exportExceptionsCsv840()">Exportar CSV</button><button class="btn" onclick="exportExceptionsPdfV835()">PDF A4</button></div></div><div class="exceptions-grid"><section><h3>Excepciones cargadas</h3><div class="table-wrap"><table><thead><tr><th>Técnico</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Motivo</th><th>Acciones</th></tr></thead><tbody>${ex.map(e=>{const t=techMap[e.technician_id]||{};return `<tr><td>${E(t.full_name||e.technician_id||'-')}<br><small>${E(t.email||'')}</small></td><td>${E(e.type)}</td><td>${F(e.start_at)}</td><td>${F(e.end_at)}</td><td>${E(e.reason||'')}</td><td class="row-actions"><button class="icon-mini danger" onclick="deleteExceptionV835('${e.id}')">${ico.trash}</button></td></tr>`}).join('')||'<tr><td colspan="6">Sin excepciones.</td></tr>'}</tbody></table></div></section><section><h3>Tareas técnicas</h3><div class="table-wrap"><table><thead><tr><th>Tarea</th><th>Peso</th><th>Activo</th></tr></thead><tbody>${tasks.map(t=>`<tr><td>${E(t.name)}<br><small>${E(t.description||'')}</small></td><td>${E(t.weight||1)}</td><td>${t.is_active?'Sí':'No'}</td></tr>`).join('')||'<tr><td colspan="3">Sin tareas.</td></tr>'}</tbody></table></div><h3>Técnicos activos</h3><div class="table-wrap"><table><tbody>${techs.map(t=>`<tr><td>${E(t.full_name)}</td><td>${E(t.email)}</td></tr>`).join('')||'<tr><td>Sin técnicos.</td></tr>'}</tbody></table></div></section></div></div>`;
  };
  window.newExceptionV840=async function(){
    injectCss840(); const techs=await fetchTechs840(); const types=['Tareas Especiales','Día de Vacaciones','Día Femenino','Licencia por Enfermedad','Permisos de Salidas','Otra excepción'];
    const nowLocal=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
    const html=`<div class="exception-form840"><div class="full"><b>Profesionales técnicos</b><div class="exception-tech-grid">${techs.map(t=>`<label><input type="checkbox" class="extech" value="${t.id}"><span>${E(t.full_name)}<small>${E(t.email)}</small></span></label>`).join('')||'<p>Sin técnicos activos.</p>'}</div></div><label>Tipo<select id="ex_type">${types.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Otra excepción<input id="ex_other" placeholder="Completar si corresponde"></label><label>Inicio<input id="ex_start" type="datetime-local" value="${nowLocal}"></label><label>Finalización<input id="ex_end" type="datetime-local" value="${nowLocal}"></label><label class="full">Motivo / detalle<textarea id="ex_reason"></textarea></label></div>`;
    const {value}=await Swal.fire({title:'Nueva excepción',html,width:820,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>{ const ids=qa('.extech:checked').map(i=>i.value); const start=q('#ex_start').value; if(!ids.length){Swal.showValidationMessage('Seleccione al menos un profesional técnico.');return false;} if(!start){Swal.showValidationMessage('Indique fecha y hora de inicio.');return false;} const type=q('#ex_type').value==='Otra excepción' && q('#ex_other').value.trim()?q('#ex_other').value.trim():q('#ex_type').value; return ids.map(id=>({technician_id:id,type,start_at:start,end_at:q('#ex_end').value||null,reason:q('#ex_reason').value||null,is_active:true,created_by:uid()||null})); }});
    if(!value) return; const {error}=await supa.from('technician_exceptions').insert(value); if(error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); await window.renderExceptionsV840(); Swal.fire({icon:'success',title:'Excepción guardada'});
  };
  window.renderExceptionsV837=window.renderExceptionsV835=window.renderExceptionsV834=window.renderExceptionsV840;
  window.newExceptionV837=window.newExceptionV835=window.newExceptionV834=window.newExceptionV840;
  window.exportExceptionsCsv840=async function(){ const r=await supa.from('technician_exceptions').select('*').order('start_at',{ascending:false}); const rows=r.data||[]; const csv=['technician_id,type,start_at,end_at,reason,is_active',...rows.map(x=>[x.technician_id,x.type,x.start_at,x.end_at,x.reason,x.is_active].map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','))].join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='excepciones.csv'; a.click(); };

  window.loanPage840=window.loanPage840||1; window.loanSize840=window.loanSize840||10;
  function loanPager840(total){ const pages=Math.max(1,Math.ceil(total/window.loanSize840)); window.loanPage840=Math.min(window.loanPage840,pages); return `<div class="pager"><label>Listar <select onchange="loanSize840=parseInt(this.value,10);loanPage840=1;renderLoansV840()">${[5,10,25,50,100,500].map(n=>`<option value="${n}" ${n===window.loanSize840?'selected':''}>${n}</option>`).join('')}</select></label><span>Página ${window.loanPage840} de ${pages} · ${total} registros</span><div><button class="btn" ${window.loanPage840<=1?'disabled':''} onclick="loanPage840--;renderLoansV840()">← Atrás</button><button class="btn" ${window.loanPage840>=pages?'disabled':''} onclick="loanPage840++;renderLoansV840()">Siguiente →</button></div></div>`; }
  window.renderLoansV840=async function(){
    page('Gestión de Préstamos','Solicitudes, aprobaciones, entregas, devoluciones y seguimiento.');
    let query=supa.from('loans').select('*,inventory_items(name,code,brand,model)',{count:'exact'}).order('created_at',{ascending:false});
    if(!isAdminish()&&!isTech()) query=query.eq('requester_email',state.profile?.email||'');
    const from=(window.loanPage840-1)*window.loanSize840, to=from+window.loanSize840-1; const {data,error,count}=await query.range(from,to); if(error) return q('#content').innerHTML=`<div class="card"><p>${E(error.message)}</p></div>`;
    const rows=data||[], total=count||0, pag=loanPager840(total);
    q('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Gestión de Préstamos</h2><p>Cada usuario visualiza sus préstamos; autorizadores gestionan aprobación, entrega y devolución.</p></div><div class="module-actions"><button class="btn primary" onclick="openLoanFormV836 ? openLoanFormV836() : openForm('loans')">Nuevo</button><button class="btn" onclick="exportCsv('loans')">Exportar CSV</button><button class="btn" onclick="exportPdf('loans')">PDF A4</button></div></div>${pag}<div class="table-wrap"><table><thead><tr><th>Solicitante</th><th>Email</th><th>Oficina</th><th>Insumo/Equipo</th><th>Cantidad</th><th>Estado</th><th>Inicio</th><th>Vencimiento</th><th>Devolución</th><th>Acciones</th></tr></thead><tbody>${rows.map(l=>`<tr><td>${E(l.requester_name)}</td><td>${E(l.requester_email)}</td><td>${E(l.office||'-')}</td><td>${E(l.inventory_items?.name||l.item_description||'-')}</td><td>${E(l.quantity||1)}</td><td><span class="badge">${E(l.status)}</span></td><td>${F(l.start_at||l.requested_at)}</td><td>${F(l.due_at)}</td><td>${F(l.returned_at)}</td><td class="row-actions">${actionBtns840('loans',l)}</td></tr>`).join('')||'<tr><td colspan="10">Sin préstamos.</td></tr>'}</tbody></table></div>${pag}</div>`;
  };

  window.logPage840=window.logPage840||1; window.logSize840=window.logSize840||25;
  async function logActivity840(action,module='system',detail=''){ try{ await supa.from('activity_logs').insert({user_id:uid()||null,user_email:state.profile?.email||state.user?.email||null,user_name:state.profile?.full_name||null,role_name:state.profile?.role_name||null,action,module,detail,user_agent:navigator.userAgent}); }catch(e){} }
  window.logActivity840=logActivity840;
  async function ensureLoginLog840(){ const key='tm_login_log_'+(uid()||'anon'); if(!sessionStorage.getItem(key)){ sessionStorage.setItem(key,'1'); await logActivity840('LOGIN','auth','Inicio de sesión'); } }
  function logsPager840(total){ const pages=Math.max(1,Math.ceil(total/window.logSize840)); window.logPage840=Math.min(window.logPage840,pages); return `<div class="pager"><label>Listar <select onchange="logSize840=parseInt(this.value,10);logPage840=1;renderActivityLogs840()">${[5,10,25,50,100,500,1000].map(n=>`<option value="${n}" ${n===window.logSize840?'selected':''}>${n}</option>`).join('')}</select></label><span>Página ${window.logPage840} de ${pages} · ${total} registros</span><div><button class="btn" ${window.logPage840<=1?'disabled':''} onclick="logPage840--;renderActivityLogs840()">← Atrás</button><button class="btn" ${window.logPage840>=pages?'disabled':''} onclick="logPage840++;renderActivityLogs840()">Siguiente →</button></div></div>`; }
  window.renderActivityLogs840=async function(){
    if(!isSA()) return route('dashboard'); page('Registros Historial','Auditoría de accesos, cierres de sesión y operaciones de usuarios.');
    const from=(window.logPage840-1)*window.logSize840, to=from+window.logSize840-1; const {data,error,count}=await supa.from('activity_logs').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(from,to); if(error) return q('#content').innerHTML=`<div class="card"><p>${E(error.message)}</p></div>`;
    const rows=data||[], pag=logsPager840(count||0);
    q('#content').innerHTML=`<div class="card logs-card"><div class="module-head"><div><h2>Registros Historial</h2><p>Visible únicamente para SuperAdmin.</p></div><div class="module-actions"><button class="btn" onclick="exportLogsCsv840()">Exportar CSV</button><button class="btn" onclick="exportLogsPdf840()">PDF A4</button></div></div>${pag}<div class="table-wrap"><table><thead><tr><th>Fecha/Hora</th><th>Usuario</th><th>Email</th><th>Rol</th><th>Acción</th><th>Módulo</th><th>Detalle</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${F(r.created_at)}</td><td>${E(r.user_name||'-')}</td><td>${E(r.user_email||'-')}</td><td>${E(r.role_name||'-')}</td><td>${E(r.action)}</td><td>${E(r.module||'-')}</td><td>${E(r.detail||'-')}</td></tr>`).join('')||'<tr><td colspan="7">Sin registros.</td></tr>'}</tbody></table></div>${pag}</div>`;
  };
  window.exportLogsCsv840=async function(){ const {data}=await supa.from('activity_logs').select('*').order('created_at',{ascending:false}).limit(5000); const csv=['created_at,user_name,user_email,role_name,action,module,detail',...(data||[]).map(r=>[r.created_at,r.user_name,r.user_email,r.role_name,r.action,r.module,r.detail].map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','))].join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='registros_historial.csv'; a.click(); };
  window.exportLogsPdf840=async function(){ const {data:users}=await supa.from('profiles').select('id,full_name,email').order('full_name'); const opts=(users||[]).map(u=>`<option value="${E(u.full_name)}">${E(u.full_name)} · ${E(u.email)}</option>`).join(''); const {value:signer}=await Swal.fire({title:'Firmante del reporte',html:`<select id="signer">${opts}</select>`,showCancelButton:true,confirmButtonText:'Generar',preConfirm:()=>q('#signer').value}); if(!signer)return; const {data}=await supa.from('activity_logs').select('*').order('created_at',{ascending:false}).limit(500); const w=window.open('','_blank'); w.document.write(`<html><head><title>Registros Historial</title><style>body{font-family:Arial;margin:28px}header{border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;font-size:11px}td,th{border:1px solid #999;padding:5px;text-align:left}.firma{margin-top:60px}</style></head><body><header><h2>Ministerio de Educación Tucumán</h2><h3>Registros Historial</h3><p>Fecha y hora del reporte: ${new Date().toLocaleString('es-AR')}</p><p>Solicitado por: ${E(state.profile?.full_name||'')}</p></header><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Email</th><th>Acción</th><th>Módulo</th><th>Detalle</th></tr></thead><tbody>${(data||[]).map(r=>`<tr><td>${F(r.created_at)}</td><td>${E(r.user_name)}</td><td>${E(r.user_email)}</td><td>${E(r.action)}</td><td>${E(r.module)}</td><td>${E(r.detail)}</td></tr>`).join('')}</tbody></table><div class="firma">Firma: ___________________________<br>${E(signer)}</div><script>print()<\/script></body></html>`); w.document.close(); };

  function addLogsMenu840(){ if(!isSA()) return; const nav=q('.nav'); if(!nav||q('[data-page="logs"]')) return; const btn=document.createElement('button'); btn.dataset.page='logs'; btn.innerHTML=`<svg class="icon" viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h10"/></svg><span>Registros Historial</span>`; btn.onclick=()=>route('logs'); const profile=q('[data-page="profile"]'); nav.insertBefore(btn,profile||null); }
  const prevRenderShell840=window.renderShell;
  window.renderShell=function(){ const r=prevRenderShell840?prevRenderShell840.apply(this,arguments):undefined; injectCss840(); addLogsMenu840(); installNotifyPreview840(); updateNotificationCountV840(); return r; };
  try{ renderShell=window.renderShell; }catch(e){}
  const prevRoute840=window.route;
  window.route=async function(p){
    injectCss840();
    if(p==='logout'){ await logActivity840('LOGOUT','auth','Cierre de sesión'); }
    if(p==='exceptions'){ state.page=p; if(typeof syncNavActive==='function')syncNavActive(); return window.renderExceptionsV840(); }
    if(p==='loans'){ state.page=p; if(typeof syncNavActive==='function')syncNavActive(); return window.renderLoansV840(); }
    if(p==='logs'){ state.page=p; if(typeof syncNavActive==='function')syncNavActive(); return window.renderActivityLogs840(); }
    const res=prevRoute840?await prevRoute840(p):undefined; setTimeout(()=>{addLogsMenu840();installNotifyPreview840();updateNotificationCountV840();},100); return res;
  };
  try{ route=window.route; }catch(e){}
  document.addEventListener('click',e=>{ const b=e.target.closest?.('button[data-page]'); if(b?.dataset?.page && b.dataset.page!=='logout') logActivity840('NAVIGATE',b.dataset.page,'Acceso a módulo'); },true);
  setTimeout(()=>{ injectCss840(); addLogsMenu840(); installNotifyPreview840(); updateNotificationCountV840(); ensureLoginLog840(); },700);
})();

/* ========================= v8.41 FINAL HOTFIX: Dashboard popups + Logs signer/PDF logo ========================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const E=(v)=>String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const F=(v)=>{ if(!v) return '-'; const d=new Date(v); return isNaN(d)?E(v):d.toLocaleString('es-AR'); };
  const DONE=['Lista p/Retirar','Lista para retirar','Terminada','Finalizada','Entregada','Cerrada','Devuelto','Devuelta'];
  const SEVEN=7*24*60*60*1000;
  const role=()=>String(window.currentRole?.() || state?.profile?.role_name || '');
  const uid=()=>state?.user?.id || state?.profile?.id || null;
  const isAdmin=()=>['SuperAdmin','Admin'].includes(role());
  const isTech=()=>['Técnicos','Tecnicos','Profesional Técnico','Profesional tecnico','Profesional técnico'].includes(role());
  const isDone=(o)=>DONE.includes(String(o?.service_order_statuses?.name||o?.status||o?.status_name||'').trim());
  const oDate=(o)=>{ const d=new Date(o?.received_at||o?.original_received_at||o?.created_at||Date.now()); return isNaN(d)?new Date():d; };
  const canSee=(o)=> isAdmin() || !isTech() || [o.assigned_to,o.technician_user_id,o.attended_by,o.collaborator_assigned_to].filter(Boolean).includes(uid());
  function css(){
    if(q('#v841css')) return;
    const st=document.createElement('style'); st.id='v841css'; st.textContent=`
      .tm-modal.dashboard-modal-v841{width:min(1220px,96vw)!important;max-width:min(1220px,96vw)!important;padding:26px 28px!important;border-radius:24px!important;}
      .dashboard-modal-v841 .swal2-title{font-size:26px!important;margin:0 0 14px!important;}
      .dashboard-modal-v841 .swal2-html-container{margin:0!important;overflow:visible!important;}
      .dash-popup-v841{width:100%;display:flex;flex-direction:column;gap:12px;text-align:left;}
      .dash-popup-v841 .module-actions{display:flex;justify-content:flex-end;margin-bottom:4px;}
      .dash-table-scroll{width:100%;max-height:54vh;overflow:auto;border:1px solid rgba(102,123,160,.55);border-radius:16px;background:rgba(15,27,49,.58);}
      .dash-popup-v841 table{width:100%;min-width:980px;border-collapse:collapse;table-layout:fixed;}
      .dash-popup-v841 th,.dash-popup-v841 td{padding:13px 12px;border-bottom:1px solid rgba(148,163,184,.18);vertical-align:top;line-height:1.25;text-align:left;}
      .dash-popup-v841 th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#b7c7dc;white-space:normal;}
      .dash-popup-v841 td{font-size:15px;color:#eef6ff;overflow-wrap:anywhere;word-break:normal;}
      .dash-popup-v841 .num{width:108px;white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important;font-weight:900;}
      .dash-popup-v841 .email{width:255px;}
      .dash-popup-v841 .office{width:205px;}
      .dash-popup-v841 .tech{width:165px;}
      .dash-popup-v841 .wide{width:auto;}
      .dash-popup-v841 .stock{width:90px;white-space:nowrap!important;}
      .dash-popup-v841 .actions{width:150px;text-align:center;}
      .dash-popup-v841 td.actions{display:table-cell!important;white-space:nowrap!important;vertical-align:middle!important;}
      .dash-actionbar{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:nowrap;}
      .dash-popup-v841 .icon-mini,.dashboard-modal-v841 .icon-mini{width:36px!important;height:36px!important;min-width:36px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:11px!important;border:1px solid rgba(148,163,184,.18)!important;background:rgba(17,31,55,.95)!important;color:#eaf2ff!important;box-shadow:none!important;padding:0!important;}
      .dash-popup-v841 .icon-mini:hover,.dashboard-modal-v841 .icon-mini:hover{background:rgba(124,92,255,.22)!important;border-color:rgba(124,92,255,.55)!important;color:#fff!important;}
      .dash-popup-v841 .icon-mini.danger:hover,.dashboard-modal-v841 .icon-mini.danger:hover{background:rgba(239,68,68,.20)!important;border-color:rgba(239,68,68,.55)!important;}
      .dash-popup-v841 .icon-mini svg,.dashboard-modal-v841 .icon-mini svg{width:17px!important;height:17px!important;stroke:currentColor!important;color:inherit!important;}
      .logs-signer-form{display:flex;flex-direction:column;gap:10px;text-align:left;}
      .logs-signer-form select{width:100%;max-width:100%;box-sizing:border-box;display:block;white-space:normal;overflow:hidden;text-overflow:ellipsis;}
      @media(max-width:850px){.tm-modal.dashboard-modal-v841{width:98vw!important;padding:18px!important}.dash-popup-v841 table{min-width:780px}.dash-popup-v841 th,.dash-popup-v841 td{padding:10px 9px;font-size:13px}}
    `; document.head.appendChild(st);
  }
  function btns(key,r){
    const id=E(r.id||'');
    if(key==='orders') return `<div class="dash-actionbar"><button class="icon-mini" title="Ver" onclick="Swal.close();viewOrder('${id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="Swal.close();route('orders');setTimeout(()=>openOrder('${id}'),350)">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="Swal.close();deleteOrder('${id}')">${ico.trash}</button></div>`;
    return `<div class="dash-actionbar"><button class="icon-mini" title="Ver" onclick="viewRecord('${key}','${id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${id}'),350)">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="Swal.close();deleteRow('${key}','${id}')">${ico.trash}</button></div>`;
  }
  function cell(r,k){
    if(k==='order_number') return '#'+E(r.satmanager_order||r.order_number||'-');
    if(k==='professional_technician') return E(r.professional_technician||r.technician_name||'-');
    return E(r[k] ?? '-');
  }
  window.openDashboardListV841=async function(kind){
    css();
    if(!state.rows?.orders || !state.rows?.users || !state.rows?.inventory){ try{ await (window.renderDashboardV839||window.renderDashboard)(); }catch(e){} }
    const orders=(state.rows?.orders||[]).filter(canSee), users=state.rows?.users||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[];
    const now=new Date(); let title='Registros', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=[['full_name','Full_Name','wide'],['email','Email','email'],['role_name','Role_Name','tech'],['office','Office','office']];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=[['order_number','Orden','num'],['office','Oficina','office'],['professional_technician','Profesional técnico','tech'],['fault_description','Falla / Diagnóstico','wide']];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente'); key='orders'; cols=[['order_number','Orden','num'],['office','Oficina','office'],['professional_technician','Profesional técnico','tech'],['fault_description','Falla / Diagnóstico','wide']];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!isDone(o)&&(now-oDate(o))>SEVEN); key='orders'; cols=[['order_number','Orden','num'],['office','Oficina','office'],['professional_technician','Profesional técnico','tech'],['fault_description','Falla / Diagnóstico','wide']];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=[['ticket_number','Ticket','num'],['requester_name','Solicitante','office'],['office','Oficina','office'],['status','Estado','tech']];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=[['code','Code','num'],['name','Name','wide'],['category','Category','office'],['stock','Stock','stock']];}
    const colgroup=`<colgroup>${cols.map(c=>`<col class="${c[2]}">`).join('')}<col class="actions"></colgroup>`;
    const body=rows.slice(0,500).map(r=>`<tr>${cols.map(([k,_,cls])=>`<td class="${cls}">${cell(r,k)}</td>`).join('')}<td class="actions">${btns(key,r)}</td></tr>`).join('') || `<tr><td colspan="${cols.length+1}">Sin registros.</td></tr>`;
    const html=`<div class="dash-popup-v841"><div class="module-actions"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="dash-table-scroll"><table>${colgroup}<thead><tr>${cols.map(c=>`<th class="${c[2]}">${E(c[1])}</th>`).join('')}<th class="actions">Acciones</th></tr></thead><tbody>${body}</tbody></table></div><small style="text-align:center;display:block">Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:'min(1160px,96vw)',customClass:{popup:'tm-modal dashboard-modal-v841'},confirmButtonText:'OK'});
  };
  window.openDashboardList=window.openDashboardListV841;
  window.openDashboardListV839=window.openDashboardListV841;
  window.openDashboardListV840=window.openDashboardListV841;
  window.dashboardDetailsV838=window.openDashboardListV841;

  window.exportLogsPdf840=async function(){
    css();
    const {data:users}=await supa.from('profiles').select('id,full_name,email').order('full_name');
    const opts=(users||[]).map(u=>`<option value="${E(u.full_name||u.email)}">${E(u.full_name||'-')} · ${E(u.email||'-')}</option>`).join('');
    const {value:signer}=await Swal.fire({title:'Firmante del reporte',html:`<div class="logs-signer-form"><label>Seleccione el firmante<select id="signer">${opts}</select></label></div>`,showCancelButton:true,confirmButtonText:'Generar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},preConfirm:()=>q('#signer')?.value||''});
    if(!signer) return;
    const {data}=await supa.from('activity_logs').select('*').order('created_at',{ascending:false}).limit(500);
    const logo=state.settings?.logo_light_url || state.settings?.logo_dark_url || 'assets/logo.svg';
    const requested=E(state.profile?.full_name||state.user?.email||'-');
    const rows=(data||[]).map(r=>`<tr><td>${F(r.created_at)}</td><td>${E(r.user_name||'-')}</td><td>${E(r.user_email||'-')}</td><td>${E(r.role_name||'-')}</td><td>${E(r.action||'-')}</td><td>${E(r.module||'-')}</td><td>${E(r.detail||'-')}</td></tr>`).join('');
    const w=window.open('','_blank');
    w.document.write(`<html><head><title>Registros Historial</title><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#111}.top{display:flex;align-items:center;gap:18px;border-bottom:3px solid #111;padding-bottom:10px;margin-bottom:16px}.top img{width:145px;max-height:54px;object-fit:contain}.top h1{font-size:22px;margin:0}.top h2{font-size:17px;margin:4px 0 0}p{font-size:12px;margin:5px 0}.meta{margin-bottom:14px}.line{border-top:2px solid #111;margin:14px 0}table{width:100%;border-collapse:collapse;font-size:9px;table-layout:fixed}th,td{border:1px solid #888;padding:5px;text-align:left;vertical-align:top;word-break:break-word}th{background:#f1f5f9;font-weight:bold}.firma{margin-top:35px;font-size:12px}.firma-line{display:inline-block;border-top:1px solid #111;min-width:280px;padding-top:6px;text-align:center}</style></head><body><header class="top"><img src="${E(logo)}" onerror="this.style.display='none'"><div><h1>Ministerio de Educación Tucumán</h1><h2>Registros Historial</h2></div></header><section class="meta"><p><b>Fecha y hora del reporte:</b> ${new Date().toLocaleString('es-AR')}</p><p><b>Solicitado por:</b> ${requested}</p></section><div class="line"></div><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Email</th><th>Rol</th><th>Acción</th><th>Módulo</th><th>Detalle</th></tr></thead><tbody>${rows}</tbody></table><div class="firma"><span class="firma-line">${E(signer)}</span></div><script>window.addEventListener('load',()=>setTimeout(()=>print(),450));<\/script></body></html>`);
    w.document.close();
  };
  window.exportLogsPdf841=window.exportLogsPdf840;

  setTimeout(()=>css(),200);
})();

/* ========================= v8.43 FINAL HOTFIX: soporte ticket -> OS + dashboard popup table alignment ========================= */
(function(){
  const $q=(s,r=document)=>r.querySelector(s);
  const $E=(v)=> (typeof esc==='function'?esc(v??''):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])));
  const isPriv843=()=>['SuperAdmin','SuperUser','Admin','Técnicos','Tecnicos','Profesional Técnico'].includes(String(state?.profile?.role_name||''));
  function css843(){
    if($q('#v843css')) return;
    const st=document.createElement('style'); st.id='v843css'; st.textContent=`
      .dashboard-modal-v841 .swal2-title{font-size:1.55rem!important;margin-bottom:8px!important;color:#f8fafc!important;}
      .dashboard-modal-v841 .swal2-html-container{overflow:hidden!important;margin:0!important;padding:0!important;}
      .dashboard-modal-v841{background:linear-gradient(180deg,#13213a,#0b1629)!important;border:1px solid rgba(96,125,170,.55)!important;border-radius:22px!important;}
      .dash-popup-v841{width:100%;box-sizing:border-box;}
      .dash-popup-v841 .module-actions{display:flex!important;justify-content:flex-end!important;margin:0 0 14px!important;}
      .dash-table-scroll{width:100%!important;overflow:auto!important;border:1px solid rgba(110,135,172,.62)!important;border-radius:15px!important;background:rgba(12,23,42,.62)!important;}
      .dash-popup-v841 table{width:100%!important;min-width:0!important;border-collapse:collapse!important;table-layout:fixed!important;background:transparent!important;}
      .dash-popup-v841 col.num{width:9%!important}.dash-popup-v841 col.email{width:24%!important}.dash-popup-v841 col.office{width:20%!important}.dash-popup-v841 col.tech{width:16%!important}.dash-popup-v841 col.stock{width:9%!important}.dash-popup-v841 col.actions{width:14%!important}.dash-popup-v841 col.wide{width:auto!important}
      .dash-popup-v841 th,.dash-popup-v841 td{box-sizing:border-box!important;padding:13px 12px!important;border-bottom:1px solid rgba(148,163,184,.2)!important;vertical-align:middle!important;text-align:left!important;line-height:1.25!important;background:transparent!important;color:#eef6ff!important;white-space:normal!important;word-break:normal!important;overflow-wrap:anywhere!important;}
      .dash-popup-v841 th{font-size:11px!important;text-transform:uppercase!important;letter-spacing:.08em!important;color:#b8c9df!important;font-weight:900!important;}
      .dash-popup-v841 td.num,.dash-popup-v841 th.num{white-space:nowrap!important;word-break:keep-all!important;overflow-wrap:normal!important;font-weight:900!important;}
      .dash-popup-v841 td.actions,.dash-popup-v841 th.actions{width:auto!important;text-align:center!important;white-space:nowrap!important;overflow:visible!important;}
      .dash-actionbar{display:inline-flex!important;gap:8px!important;align-items:center!important;justify-content:center!important;flex-wrap:nowrap!important;min-width:118px!important;}
      .dashboard-modal-v841 .icon-mini,.dash-popup-v841 .icon-mini{background:#17243a!important;color:#eaf2ff!important;border:1px solid #314562!important;width:34px!important;height:34px!important;min-width:34px!important;border-radius:10px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0!important;box-shadow:none!important;}
      .dashboard-modal-v841 .icon-mini svg,.dash-popup-v841 .icon-mini svg{stroke:currentColor!important;color:inherit!important;width:16px!important;height:16px!important;}
      .dashboard-modal-v841 .icon-mini:hover,.dash-popup-v841 .icon-mini:hover{background:#243452!important;border-color:#7c5cff!important;color:#fff!important;}
      .dashboard-modal-v841 .icon-mini.danger:hover,.dash-popup-v841 .icon-mini.danger:hover{background:rgba(239,68,68,.22)!important;border-color:#ef4444!important;}
      @media(max-width:760px){.dash-popup-v841 table{min-width:760px!important}.dash-table-scroll{max-width:100%!important}.dashboard-modal-v841{width:98vw!important}.dash-popup-v841 th,.dash-popup-v841 td{padding:10px 8px!important;font-size:12px!important}}
    `; document.head.appendChild(st);
  }
  window.openDashboardListV843=async function(kind){
    css843();
    if(!state.rows?.orders || !state.rows?.users || !state.rows?.inventory){ try{ await (window.renderDashboardV839||window.renderDashboard)(); }catch(e){} }
    const canSee=window.canSee || (o=>true); const isDone=window.isDone || (o=>['Terminada','Entregada','Lista p/Retirar'].includes(o?.service_order_statuses?.name||o?.status||'')); const oDate=window.oDate || (o=>new Date(o.received_at||o.created_at||Date.now())); const SEVEN=window.SEVEN||7*864e5;
    const orders=(state.rows?.orders||[]).filter(canSee), users=state.rows?.users||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[]; const now=new Date();
    let title='Registros', rows=[], key='orders', cols=[];
    if(kind==='users'){title='Usuarios contabilizados'; rows=users; key='users'; cols=[['full_name','FULL_NAME','wide'],['email','EMAIL','email'],['role_name','ROLE_NAME','tech'],['office','OFFICE','office']];}
    if(kind==='orders'){title='Órdenes contabilizadas'; rows=orders; key='orders'; cols=[['order_number','ORDEN','num'],['office','OFICINA','office'],['professional_technician','PROFESIONAL TÉCNICO','tech'],['fault_description','FALLA / DIAGNÓSTICO','wide']];}
    if(kind==='urgent'){title='Órdenes urgentes'; rows=orders.filter(o=>String(o.priority||'').toLowerCase()==='urgente'); key='orders'; cols=[['order_number','ORDEN','num'],['office','OFICINA','office'],['professional_technician','PROFESIONAL TÉCNICO','tech'],['fault_description','FALLA / DIAGNÓSTICO','wide']];}
    if(kind==='late'){title='Órdenes atrasadas'; rows=orders.filter(o=>!isDone(o)&&(now-oDate(o))>SEVEN); key='orders'; cols=[['order_number','ORDEN','num'],['office','OFICINA','office'],['professional_technician','PROFESIONAL TÉCNICO','tech'],['fault_description','FALLA / DIAGNÓSTICO','wide']];}
    if(kind==='tickets'){title='Tickets contabilizados'; rows=tickets; key='tickets'; cols=[['ticket_number','TICKET','num'],['requester_name','SOLICITANTE','office'],['office','OFICINA','office'],['status','ESTADO','tech']];}
    if(kind==='inventory'){title='Inventario contabilizado'; rows=inv; key='inventory'; cols=[['code','CODE','num'],['name','NAME','wide'],['category','CATEGORY','office'],['stock','STOCK','stock']];}
    const cell=(r,k)=> k==='order_number'?'#'+$E(r.satmanager_order||r.order_number||'-') : k==='professional_technician'?$E(r.professional_technician||r.technician_name||'-') : $E(r[k]??'-');
    const buttons=(r)=>{ const id=$E(r.id||''); if(key==='orders') return `<div class="dash-actionbar"><button class="icon-mini" title="Ver" onclick="Swal.close();viewOrder('${id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="Swal.close();route('orders');setTimeout(()=>openOrder('${id}'),350)">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="Swal.close();deleteOrder('${id}')">${ico.trash}</button></div>`; return `<div class="dash-actionbar"><button class="icon-mini" title="Ver" onclick="viewRecord('${key}','${id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${id}'),350)">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="Swal.close();deleteRow('${key}','${id}')">${ico.trash}</button></div>`; };
    const colgroup=`<colgroup>${cols.map(c=>`<col class="${c[2]}">`).join('')}<col class="actions"></colgroup>`;
    const body=rows.slice(0,500).map(r=>`<tr>${cols.map(([k,_,cls])=>`<td class="${cls}">${cell(r,k)}</td>`).join('')}<td class="actions">${buttons(r)}</td></tr>`).join('') || `<tr><td colspan="${cols.length+1}">Sin registros.</td></tr>`;
    const html=`<div class="dash-popup-v841"><div class="module-actions"><button class="btn" onclick="Swal.close();route('${key}')">Ir al módulo</button></div><div class="dash-table-scroll"><table>${colgroup}<thead><tr>${cols.map(c=>`<th class="${c[2]}">${$E(c[1])}</th>`).join('')}<th class="actions">ACCIONES</th></tr></thead><tbody>${body}</tbody></table></div><small style="text-align:center;display:block;margin-top:12px">Mostrando hasta 500 registros.</small></div>`;
    Swal.fire({title,html,width:'min(1160px,96vw)',customClass:{popup:'tm-modal dashboard-modal-v841'},confirmButtonText:'OK'});
  };
  window.openDashboardList=window.openDashboardListV843; window.openDashboardListV841=window.openDashboardListV843; window.openDashboardListV840=window.openDashboardListV843; window.openDashboardListV839=window.openDashboardListV843; window.dashboardDetailsV838=window.openDashboardListV843;

  function optOffices(rows,val=''){ return `<option value="">Sin seleccionar</option>`+(rows||[]).map(o=>{ const label=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ') || o.name; return `<option value="${$E(label)}" ${String(val)===label||String(val)===o.name?'selected':''}>${$E(label)}</option>`; }).join(''); }
  function optTasks(rows,val='',allowNew=false){ return `<option value="">Seleccione...</option>`+(rows||[]).map(t=>`<option value="${$E(t.name)}" ${String(val)===String(t.name)?'selected':''}>${$E(t.name)}</option>`).join('')+(allowNew?`<option value="__new__">+ Crear nuevo servicio...</option>`:''); }
  async function techs843(){ const {data}=await supa.from('profiles').select('id,full_name,email,role_name,is_active,office,work_days,work_start,work_end').in('role_name',['Técnicos','Tecnicos','Profesional Técnico']).eq('is_active',true).order('full_name'); return data||[]; }
  async function available843(t,task){ try{ const now=new Date(), day=String(now.getDay()), hm=now.toTimeString().slice(0,5); const days=Array.isArray(t.work_days)?t.work_days.map(String):['1','2','3','4','5']; if(days.length&&!days.includes(day)) return false; if(t.work_start&&hm<String(t.work_start).slice(0,5)) return false; if(t.work_end&&hm>String(t.work_end).slice(0,5)) return false; const ex=await supa.from('technician_exceptions').select('id').eq('technician_id',t.id).eq('is_active',true).lte('start_at',now.toISOString()).or(`end_at.is.null,end_at.gte.${now.toISOString()}`).limit(1); return !(ex.data||[]).length; }catch(e){ return true; } }
  async function choose843(task,qty){ const all=await techs843(), av=[]; for(const t of all){ if(await available843(t,task)) av.push(t); } av.sort(()=>Math.random()-.5); return {main:av[0]||null, coll:Number(qty)>7?(av[1]||null):null}; }
  window.openTicketFormV843=async function(id=null){
    const row=id?(state.rows.tickets||[]).find(x=>x.id===id):{}; const [{data:offices},{data:tasks}]=await Promise.all([supa.from('offices').select('*').eq('is_active',true).order('name'),supa.from('task_types').select('*').eq('is_active',true).order('name')]); const profile=state.profile||{}; const allowNew=isPriv843(); const selected=row?.service_type||row?.incidence_type||'';
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.tickets}</div><p>Complete los datos solicitados para generar el ticket y crear la orden automáticamente.</p></div><div class="swal-grid"><label>Solicitante<input id="f_requester_name" value="${$E(row?.requester_name||profile.full_name||'')}"></label><label>Email<input id="f_requester_email" type="email" value="${$E(row?.requester_email||profile.email||'')}"></label><label>WhatsApp / Teléfono<input id="f_requester_phone" value="${$E(row?.requester_phone||profile.phone||'')}"></label><label>Oficina<select id="f_office">${optOffices(offices,row?.office||profile.office||'')}</select></label><label>Área<input id="f_area" value="${$E(row?.area||'')}"></label><label>Servicio solicitado<select id="f_service_type">${optTasks(tasks,selected,allowNew)}</select></label><label id="newTaskBox843" style="display:none">Nuevo servicio<input id="f_new_service_type" placeholder="Ej. Cableado estructurado"></label><label>Cantidad de equipos a revisar<input id="f_equipment_count" type="number" min="1" value="${$E(row?.equipment_count||1)}"><small>Si es mayor a 7, se asigna colaborador automáticamente.</small></label><div class="full assign-preview" id="assignPreview843"></div><label>Tipo de equipo<input id="f_equipment_type" value="${$E(row?.equipment_type||'')}"></label><label>Marca<input id="f_brand" value="${$E(row?.brand||'')}"></label><label>Modelo<input id="f_model" value="${$E(row?.model||'')}"></label><label>Prioridad<select id="f_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${String(row?.priority||'Media')===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="full">Accesorios<textarea id="f_accessories">${$E(row?.accessories||'')}</textarea></label><label class="full">Descripción del problema<textarea id="f_description">${$E(row?.description||'')}</textarea></label></div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:960,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{ const sel=$q('#f_service_type'), qty=$q('#f_equipment_count'), box=$q('#newTaskBox843'), prev=$q('#assignPreview843'); const refresh=async()=>{ box.style.display=sel.value==='__new__'?'block':'none'; const task=sel.value==='__new__'?$q('#f_new_service_type')?.value:sel.value; const r=await choose843(task,qty.value); prev.innerHTML=r.main?`<p><b>Responsable técnico:</b> ${$E(r.main.full_name)}</p>${Number(qty.value)>7?`<p><b>Colaborador técnico:</b> ${r.coll?$E(r.coll.full_name):'No hay colaboradores disponibles'}</p>`:''}<small>Asignación previa. Se confirma al guardar.</small>`:'<small>Sin técnicos disponibles para asignación automática.</small>'; }; sel.onchange=refresh; qty.oninput=refresh; setTimeout(refresh,80); },preConfirm:async()=>{ const raw=$q('#f_service_type').value; const service=raw==='__new__'?$q('#f_new_service_type').value.trim():raw; const qty=Number($q('#f_equipment_count').value||1); const ch=await choose843(service,qty); return {requester_name:$q('#f_requester_name').value.trim(),requester_email:$q('#f_requester_email').value.trim(),requester_phone:$q('#f_requester_phone').value.trim(),office:$q('#f_office').value,area:$q('#f_area').value.trim(),service_type:service,incidence_type:service,subject:service,equipment_count:qty,description:$q('#f_description').value.trim(),priority:$q('#f_priority').value,status:row?.status||'Pendiente',assigned_to:ch.main?.id||null,technician_user_id:ch.main?.id||null,collaborator_assigned_to:ch.coll?.id||null,equipment_type:$q('#f_equipment_type').value.trim(),brand:$q('#f_brand').value.trim(),model:$q('#f_model').value.trim(),accessories:$q('#f_accessories').value.trim(),_mainName:ch.main?.full_name||'',_collName:ch.coll?.full_name||''}; }});
    if(!value) return; if(!value.requester_name||!value.service_type||!value.description) return Swal.fire({icon:'warning',title:'Datos obligatorios',text:'Complete solicitante, servicio y descripción.'});
    if(allowNew && !(tasks||[]).some(t=>t.name===value.service_type)) await supa.from('task_types').upsert({name:value.service_type,description:value.service_type,weight:1,is_active:true},{onConflict:'name'});
    const ticketPayload={requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,area:value.area,service_type:value.service_type,incidence_type:value.incidence_type,subject:value.subject,equipment_count:value.equipment_count,description:value.description,priority:value.priority,status:value.status,assigned_to:value.assigned_to,technician_user_id:value.technician_user_id,collaborator_assigned_to:value.collaborator_assigned_to,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories};
    let res=id?await supa.from('support_tickets').update(ticketPayload).eq('id',id).select().single():await supa.from('support_tickets').insert(ticketPayload).select().single();
    if(res.error && /technician_user_id|schema cache|column/i.test(res.error.message||'')){ delete ticketPayload.technician_user_id; res=id?await supa.from('support_tickets').update(ticketPayload).eq('id',id).select().single():await supa.from('support_tickets').insert(ticketPayload).select().single(); }
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    if(!id){
      const so={origin_ticket_id:res.data.id,assigned_to:value.assigned_to,technician_user_id:value.technician_user_id,collaborator_assigned_to:value.collaborator_assigned_to,professional_technician:value._mainName,requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories,fault_description:value.description,priority:value.priority,source:'SOPORTE_TICKET',service_type:value.service_type,equipment_count:value.equipment_count,created_by:state.user?.id||null,updated_by:state.user?.id||null};
      const os=await supa.from('service_orders').insert(so).select('id,order_number').single();
      if(!os.error){ await supa.from('support_tickets').update({service_order_id:os.data.id}).eq('id',res.data.id); await supa.from('notifications').insert({title:'Nueva Orden de Servicio',body:`Ticket ${res.data.ticket_number||''} asignado como OS #${os.data.order_number}`,module:'orders',entity_id:os.data.id,target_user:value.assigned_to,created_by:state.user?.id||null}); }
    }
    await Swal.fire({icon:'success',title:'Ticket guardado',text:'Se generó la Orden de Servicio automática si el esquema lo permitió.'}); route('tickets');
  };
  const oldOpenForm843=window.openForm;
  window.openForm=function(key,id=null){ if(key==='tickets') return window.openTicketFormV843(id); return oldOpenForm843?oldOpenForm843(key,id):null; };
  setTimeout(css843,50);
})();

/* ========================= v8.44 FINAL HOTFIX: Referente tickets + mobile notifications + support ticket assignment ========================= */
(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const E=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const role=()=>String(window.currentRole?.() || window.state?.profile?.role_name || state?.profile?.role_name || 'Usuarios').trim();
  const uid=()=>state?.user?.id || state?.profile?.id || null;
  const isSA=()=>role()==='SuperAdmin';
  const normRole=(r)=>String(r||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const aliases={referente:['referente','referentes'],tecnicos:['tecnico','tecnicos','técnico','técnicos','profesional tecnico','profesional técnico'],usuarios:['usuario','usuarios']};
  function addCss844(){ if($('#v844css'))return; const st=document.createElement('style'); st.id='v844css'; st.textContent=`
    .roles-matrix .table-wrap{overflow:auto!important;max-width:100%!important;border-radius:18px!important}
    .roles-matrix table{min-width:980px!important;table-layout:auto!important}
    @media(max-width:760px){.roles-matrix{padding:20px!important}.roles-matrix .module-head{display:flex!important;flex-direction:column!important;gap:14px!important}.roles-matrix .roles-toolbar,.roles-matrix .module-actions{width:100%!important;display:grid!important;grid-template-columns:1fr!important;gap:12px!important}.roles-matrix .table-wrap{max-height:62vh!important}.roles-matrix table{min-width:920px!important}.roles-matrix th,.roles-matrix td{font-size:14px!important;vertical-align:top!important}.roles-matrix .perm-cell{min-width:160px!important}.roles-matrix .checkline{display:flex!important;align-items:center!important;gap:8px!important;white-space:normal!important;line-height:1.1!important}.roles-matrix .checkline input{flex:0 0 auto!important}}
    .notification-popover-v844{position:fixed;z-index:999999;width:min(440px,calc(100vw - 24px));max-height:min(70vh,620px);overflow-y:auto;overscroll-behavior:contain;background:rgba(15,27,49,.98);border:1px solid rgba(96,115,150,.65);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.48);padding:14px;color:#eef6ff;box-sizing:border-box;backdrop-filter:blur(14px)}
    .notification-popover-v844 .np-head{display:flex;gap:10px;align-items:center;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid rgba(148,163,184,.18);position:sticky;top:-14px;background:rgba(15,27,49,.98);z-index:2}
    .notification-popover-v844 .np-title{font-weight:900;font-size:15px;line-height:1.15}.notification-popover-v844 .np-actions{display:flex;gap:8px;align-items:center}.notification-popover-v844 .np-history{border:1px solid rgba(148,163,184,.28);background:rgba(31,42,63,.86);color:#fff;border-radius:12px;padding:9px 10px;font-weight:900;cursor:pointer}.notification-popover-v844 .np-close{width:34px;height:34px;border-radius:11px;border:1px solid rgba(148,163,184,.25);background:rgba(17,31,55,.95);color:#fff;font-size:22px;line-height:1;display:grid;place-items:center;cursor:pointer}.notification-popover-v844 .np-item{padding:12px;border:1px solid rgba(148,163,184,.14);border-radius:14px;background:rgba(16,28,50,.72);margin-top:10px}.notification-popover-v844 .np-item b{display:block;font-size:13px;margin-bottom:5px}.notification-popover-v844 .np-item small{display:block;color:#c0cad9;line-height:1.25;overflow-wrap:anywhere}.notification-popover-v844 .np-item em{display:block;color:#8fa6c7;font-size:11px;margin-top:6px;font-style:normal}
    @media(max-width:760px){.notification-popover-v844{left:10px!important;right:auto!important;top:86px!important;width:calc(100vw - 20px)!important;max-height:calc(100dvh - 190px)!important;border-radius:18px!important;padding:12px!important}.notification-popover-v844 .np-head{top:-12px}.notification-popover-v844 .np-history{font-size:12px;padding:8px}.notification-popover-v844 .np-title{font-size:14px}}
  `; document.head.appendChild(st); }

  const baseCan=window.canModuleV830;
  window.canModuleV830=function(module, action='view'){
    if(isSA()) return true;
    const m=String(module||''); const a=String(action||'view'); const r=role(); const nr=normRole(r);
    const rp=window.rolePermsV830||{};
    const direct=(rp[r]?.[m]||[]).includes(a);
    if(direct) return true;
    const aliasKey=Object.keys(aliases).find(k=>aliases[k].includes(nr));
    if(aliasKey){
      const roleNames=Object.keys(rp).filter(k=>aliases[aliasKey].includes(normRole(k)));
      if(roleNames.some(k=>(rp[k]?.[m]||[]).includes(a))) return true;
    }
    if((nr==='referente'||nr==='referentes') && m==='tickets' && ['view','create'].includes(a)) return true;
    if(baseCan) return baseCan(module, action);
    return false;
  };

  async function ensureReferentePerms844(){
    window.rolePermsV830=window.rolePermsV830||{};
    ['Referente','Referentes'].forEach(r=>{ window.rolePermsV830[r]=window.rolePermsV830[r]||{}; window.rolePermsV830[r].tickets=Array.from(new Set([...(window.rolePermsV830[r].tickets||[]),'view','create'])); window.rolePermsV830[r].notifications=Array.from(new Set([...(window.rolePermsV830[r].notifications||[]),'view'])); window.rolePermsV830[r].profile=Array.from(new Set([...(window.rolePermsV830[r].profile||[]),'view','edit'])); });
    try{
      const {data}=await supa.from('role_module_permissions').select('*').in('role_name',['Referente','Referentes']).eq('module_key','tickets');
      if(!(data||[]).some(x=>x.can_view&&x.can_create)){
        await supa.from('role_module_permissions').upsert([{role_name:'Referente',module_key:'tickets',can_view:true,can_create:true,can_edit:false,can_delete:false,can_import:false,can_export:false},{role_name:'Referentes',module_key:'tickets',can_view:true,can_create:true,can_edit:false,can_delete:false,can_import:false,can_export:false}],{onConflict:'role_name,module_key'});
      }
    }catch(e){}
  }

  const oldLoad=window.loadRolePermsV835||window.loadPermissions;
  window.loadRolePermsV844=async function(){ try{ if(oldLoad) await oldLoad(); }catch(e){} await ensureReferentePerms844(); };
  if(window.loadPermissions){ const prev=window.loadPermissions; window.loadPermissions=async function(){ await prev(); await ensureReferentePerms844(); }; try{ loadPermissions=window.loadPermissions; }catch(e){} }

  function filteredModules844(){
    const mods=window.modules||modules||[];
    return mods.filter(m=>m[0]==='logout'||m[0]==='profile'||window.canModuleV830(m[0],'view'));
  }
  const oldRenderShell=window.renderShell;
  window.renderShell=function(){
    const r=oldRenderShell?oldRenderShell.apply(this,arguments):undefined;
    addCss844(); ensureReferentePerms844().then(()=>{
      const nav=$('.nav'); if(nav){ const mods=filteredModules844(); nav.innerHTML=mods.map(m=>`<button data-page="${E(m[0])}">${m[2]||''}<span>${E(m[1]).replace('Dtos/Oficinas/Reparticiones','Dtos/Oficinas')}</span></button>`).join(''); $$('.nav button').forEach(b=>b.onclick=()=>route(b.dataset.page)); if(typeof syncNavActive==='function') syncNavActive(); }
      installNotifyPreview844();
    });
    return r;
  };
  try{ renderShell=window.renderShell; }catch(e){}

  const oldRoute=window.route;
  window.route=async function(p){
    await ensureReferentePerms844(); addCss844();
    if(p==='tickets' && !window.canModuleV830('tickets','view')){ state.page=p; if(typeof syncNavActive==='function') syncNavActive(); return $('#content').innerHTML='<div class="card"><h2>Acceso restringido</h2><p>Tu perfil no tiene permisos para ver este módulo.</p></div>'; }
    return oldRoute?oldRoute(p):undefined;
  };
  try{ route=window.route; }catch(e){}

  async function getActiveTechs844(){ const {data}=await supa.from('profiles').select('id,full_name,email,role_name,is_active,work_days,work_start,work_end').in('role_name',['Técnicos','Tecnicos','Profesional Técnico','Profesional tecnico','Profesional técnico']).eq('is_active',true).order('full_name'); return data||[]; }
  async function isTechAvailable844(t){ try{ const now=new Date(), iso=now.toISOString(), day=String(now.getDay()), hm=now.toTimeString().slice(0,5); const days=Array.isArray(t.work_days)?t.work_days.map(String):['1','2','3','4','5']; if(days.length&&!days.includes(day)) return false; if(t.work_start&&hm<String(t.work_start).slice(0,5)) return false; if(t.work_end&&hm>String(t.work_end).slice(0,5)) return false; const {data}=await supa.from('technician_exceptions').select('id').eq('technician_id',t.id).eq('is_active',true).lte('start_at',iso).or(`end_at.is.null,end_at.gte.${iso}`).limit(1); return !(data||[]).length; }catch(e){ return true; } }
  async function choose844(qty){ const techs=await getActiveTechs844(); const av=[]; for(const t of techs){ if(await isTechAvailable844(t)) av.push(t); } av.sort(()=>Math.random()-.5); return {main:av[0]||null,coll:Number(qty)>7?(av[1]||null):null}; }
  const oldTicketForm=window.openTicketFormV843;
  window.openTicketFormV844=async function(id=null){
    if(!window.canModuleV830('tickets',id?'edit':'create')) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Tu perfil no tiene permisos para crear tickets.'});
    const row=id?(state.rows?.tickets||[]).find(x=>x.id===id):{};
    const [{data:offices},{data:tasks}]=await Promise.all([supa.from('offices').select('*').eq('is_active',true).order('name'),supa.from('task_types').select('*').eq('is_active',true).order('name')]);
    const prof=state.profile||{}; const canNew=['superadmin','admin','tecnicos','tecnico','profesional tecnico','profesional técnico'].includes(normRole(prof.role_name));
    const officeOpts='<option value="">Sin seleccionar</option>'+(offices||[]).map(o=>{const label=[o.department,o.repartition,o.office_name||o.name,o.dependency,o.room].filter(Boolean).join(' / ')||o.name; return `<option value="${E(label)}" ${String(row?.office||prof.office||'')===label||String(row?.office||prof.office||'')===o.name?'selected':''}>${E(label)}</option>`}).join('');
    const taskOpts='<option value="">Seleccione...</option>'+(tasks||[]).map(t=>`<option value="${E(t.name)}" ${(row?.service_type||row?.incidence_type||'')===t.name?'selected':''}>${E(t.name)}</option>`).join('')+(canNew?'<option value="__new__">+ Crear nuevo servicio...</option>':'');
    const html=`<div class="tm-form"><div class="tm-form-header"><div class="tm-form-avatar">${ico.tickets||''}</div><p>Complete los datos solicitados para generar el ticket y crear la orden automáticamente.</p></div><div class="swal-grid"><label>Solicitante<input id="f_requester_name" value="${E(row?.requester_name||prof.full_name||'')}"></label><label>Email<input id="f_requester_email" value="${E(row?.requester_email||prof.email||'')}" type="email"></label><label>WhatsApp / Teléfono<input id="f_requester_phone" value="${E(row?.requester_phone||prof.phone||'')}"></label><label>Oficina<select id="f_office">${officeOpts}</select></label><label>Área<input id="f_area" value="${E(row?.area||'')}"></label><label>Servicio solicitado<select id="f_service_type">${taskOpts}</select></label><label id="newSvc844" style="display:none">Nuevo servicio<input id="f_new_service" placeholder="Ej. Cableado estructurado"></label><label>Cantidad de equipos a revisar<input id="f_equipment_count" type="number" min="1" value="${E(row?.equipment_count||1)}"><small>Si es mayor a 7, se asigna colaborador automáticamente.</small></label><div class="full assign-preview" id="assignPreview844"></div><label>Tipo de equipo<input id="f_equipment_type" value="${E(row?.equipment_type||'')}"></label><label>Marca<input id="f_brand" value="${E(row?.brand||'')}"></label><label>Modelo<input id="f_model" value="${E(row?.model||'')}"></label><label>Prioridad<select id="f_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${String(row?.priority||'Media')===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="full">Accesorios<textarea id="f_accessories">${E(row?.accessories||'')}</textarea></label><label class="full">Descripción del problema<textarea id="f_description">${E(row?.description||'')}</textarea></label></div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:960,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{ const sel=$('#f_service_type'), qty=$('#f_equipment_count'), box=$('#newSvc844'), prev=$('#assignPreview844'); const ref=async()=>{ if(box) box.style.display=sel.value==='__new__'?'block':'none'; const ch=await choose844(qty.value); prev.innerHTML=ch.main?`<p><b>Responsable técnico:</b> ${E(ch.main.full_name)}</p>${Number(qty.value)>7?`<p><b>Colaborador técnico:</b> ${ch.coll?E(ch.coll.full_name):'No hay colaboradores disponibles'}</p>`:''}<small>Asignación previa. Se confirma al guardar.</small>`:'<small>Sin técnicos disponibles para asignación automática.</small>'; }; sel.onchange=ref; qty.oninput=ref; setTimeout(ref,80);},preConfirm:async()=>{ const raw=$('#f_service_type').value; const service=raw==='__new__'?$('#f_new_service').value.trim():raw; if(!$('#f_requester_name').value.trim()||!service||!$('#f_description').value.trim()){ Swal.showValidationMessage('Complete solicitante, servicio solicitado y descripción.'); return false; } const qty=Number($('#f_equipment_count').value||1); const ch=await choose844(qty); return {requester_name:$('#f_requester_name').value.trim(),requester_email:$('#f_requester_email').value.trim(),requester_phone:$('#f_requester_phone').value.trim(),office:$('#f_office').value,area:$('#f_area').value.trim(),service_type:service,incidence_type:service,subject:service,equipment_count:qty,description:$('#f_description').value.trim(),priority:$('#f_priority').value,status:row?.status||'Pendiente',assigned_to:ch.main?.id||null,collaborator_assigned_to:ch.coll?.id||null,equipment_type:$('#f_equipment_type').value.trim(),brand:$('#f_brand').value.trim(),model:$('#f_model').value.trim(),accessories:$('#f_accessories').value.trim(),_mainName:ch.main?.full_name||''}; }});
    if(!value) return;
    if(canNew && !(tasks||[]).some(t=>t.name===value.service_type)) await supa.from('task_types').upsert({name:value.service_type,description:value.service_type,weight:1,is_active:true},{onConflict:'name'});
    const ticketPayload={requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,area:value.area,service_type:value.service_type,incidence_type:value.incidence_type,subject:value.subject,equipment_count:value.equipment_count,description:value.description,priority:value.priority,status:value.status,assigned_to:value.assigned_to,collaborator_assigned_to:value.collaborator_assigned_to,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories};
    let res=id?await supa.from('support_tickets').update(ticketPayload).eq('id',id).select().single():await supa.from('support_tickets').insert(ticketPayload).select().single();
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    if(!id){ const so={origin_ticket_id:res.data.id,assigned_to:value.assigned_to,technician_user_id:value.assigned_to,collaborator_assigned_to:value.collaborator_assigned_to,professional_technician:value._mainName,requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories,fault_description:value.description,priority:value.priority,source:'SOPORTE_TICKET',service_type:value.service_type,equipment_count:value.equipment_count,created_by:state.user?.id||null,updated_by:state.user?.id||null}; const os=await supa.from('service_orders').insert(so).select('id,order_number').single(); if(!os.error){ await supa.from('support_tickets').update({service_order_id:os.data.id}).eq('id',res.data.id); await supa.from('notifications').insert({title:'Nueva Orden de Servicio',body:`Ticket ${res.data.ticket_number||''} asignado como OS #${os.data.order_number}`,module:'orders',entity_id:os.data.id,target_user:value.assigned_to,created_by:state.user?.id||null}); } }
    await Swal.fire({icon:'success',title:'Ticket guardado'}); return route('tickets');
  };
  window.openTicketFormV843=window.openTicketFormV844;
  const oldOpenForm=window.openForm;
  window.openForm=function(key,id=null){ if(key==='tickets') return window.openTicketFormV844(id); return oldOpenForm?oldOpenForm(key,id):undefined; };
  try{ openForm=window.openForm; }catch(e){}

  window.showNotificationPreviewV844=async function(){
    addCss844(); $('.notification-popover')?.remove(); $('.notification-popover-v840')?.remove(); $('.notification-popover-v844')?.remove();
    let data=[]; try{ let q=supa.from('notifications').select('*').order('created_at',{ascending:false}).limit(25); if(!['SuperAdmin','Admin'].includes(role())) q=q.or(`target_user.eq.${uid()},target_role.eq.${role()},target_role.is.null`); const r=await q; data=r.data||[]; }catch(e){}
    const box=document.createElement('div'); box.className='notification-popover-v844'; box.innerHTML=`<div class="np-head"><div class="np-title">Notificaciones recientes</div><div class="np-actions"><button class="np-history" type="button">Historial de Notificaciones</button><button class="np-close" type="button" aria-label="Cerrar">×</button></div></div>${data.map(n=>`<div class="np-item"><b>${E(n.title)}</b><small>${E(n.body||'')}</small><em>${new Date(n.created_at).toLocaleString('es-AR')}</em></div>`).join('')||'<div class="np-item"><small>Sin notificaciones.</small></div>'}`;
    document.body.appendChild(box); const b=$('#notifyBtn')?.getBoundingClientRect(); if(window.innerWidth<=760){ box.style.left='10px'; box.style.top='86px'; } else if(b){ box.style.top=(b.bottom+12)+'px'; box.style.right=Math.max(12,window.innerWidth-b.right)+'px'; }
    $('.np-close',box).onclick=()=>box.remove(); $('.np-history',box).onclick=()=>{ box.remove(); route('notifications'); };
    box.addEventListener('mouseleave',()=>setTimeout(()=>{ if(!$('#notifyBtn:hover')) box.remove(); },180));
  };
  window.installNotifyPreview844=function(){ const btn=$('#notifyBtn'); if(!btn) return; btn.onmouseenter=window.showNotificationPreviewV844; btn.onfocus=window.showNotificationPreviewV844; btn.onclick=(e)=>{ if(window.innerWidth<=900){ e.preventDefault(); e.stopPropagation(); window.showNotificationPreviewV844(); } else { route('notifications'); } }; btn.onmouseleave=()=>setTimeout(()=>{ if(!$('.notification-popover-v844:hover')) $('.notification-popover-v844')?.remove(); },450); };

  setTimeout(()=>{ addCss844(); ensureReferentePerms844(); installNotifyPreview844(); },600);
})();

/* ========================= v8.45 FINAL HOTFIX REAL: Referente RBAC + Tickets ========================= */
(function(){
  const E=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=(v)=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const roleAliases={
    referente:['referente','referentes'],
    tecnicos:['tecnico','tecnicos','técnico','técnicos','profesional tecnico','profesional técnico'],
    usuarios:['usuario','usuarios'],
    admin:['admin'],
    superadmin:['superadmin']
  };
  function roleNow(){ return String(state?.profile?.role_name || 'Usuarios').trim(); }
  function roleKey(r=roleNow()){
    const n=norm(r);
    return Object.keys(roleAliases).find(k=>roleAliases[k].includes(n)) || n;
  }
  const mandatoryReferente={
    dashboard:['view'],
    tickets:['view','create','edit'],
    notifications:['view','create'],
    profile:['view','edit']
  };
  function mergePerm(obj, role, module, acts){
    obj[role] ||= {};
    obj[role][module] = Array.from(new Set([...(obj[role][module]||[]), ...acts]));
  }
  function ensureLocalReferentePerms(){
    window.rolePermsV830 ||= {};
    ['Referente','Referentes'].forEach(r=>Object.entries(mandatoryReferente).forEach(([m,a])=>mergePerm(window.rolePermsV830,r,m,a)));
    if(roleKey()==='referente') Object.entries(mandatoryReferente).forEach(([m,a])=>mergePerm(window.rolePermsV830,roleNow(),m,a));
    state.permissions ||= [];
    if(roleKey()==='referente'){
      Object.entries(mandatoryReferente).forEach(([m,acts])=>acts.forEach(a=>{
        const code=`${m}.${a}`; if(!state.permissions.includes(code)) state.permissions.push(code);
      }));
    }
  }

  window.loadPermissionsV845 = async function(){
    state.permissions = [];
    const rn=roleNow();
    if(norm(rn)==='superadmin') return;
    try{
      const roleNames=[rn];
      if(roleKey(rn)==='referente') roleNames.push('Referente','Referentes');
      const uniq=[...new Set(roleNames)];
      const {data}=await supa.from('roles').select('id,name,role_permissions(permissions(code))').in('name', uniq);
      (data||[]).forEach(row=>(row.role_permissions||[]).forEach(x=>{ const c=x.permissions?.code; if(c&&!state.permissions.includes(c)) state.permissions.push(c); }));
    }catch(e){ console.warn('loadPermissions legacy fallback', e.message); }
    try{
      const roleNames=[rn];
      if(roleKey(rn)==='referente') roleNames.push('Referente','Referentes');
      const {data}=await supa.from('role_module_permissions').select('*').in('role_name',[...new Set(roleNames)]);
      window.rolePermsV830 ||= {};
      (data||[]).forEach(r=>{
        window.rolePermsV830[r.role_name] ||= {};
        window.rolePermsV830[r.role_name][r.module_key] = ['view','create','edit','delete','import','export'].filter(a=>!!r['can_'+a]);
        window.rolePermsV830[r.role_name][r.module_key].forEach(a=>{ const c=`${r.module_key}.${a}`; if(!state.permissions.includes(c)) state.permissions.push(c); });
      });
    }catch(e){ console.warn('loadPermissions module fallback', e.message); }
    ensureLocalReferentePerms();
  };

  try{ loadPermissions = window.loadPermissionsV845; }catch(e){}
  window.loadPermissions = window.loadPermissionsV845;

  window.can = function(code){
    if(norm(roleNow())==='superadmin') return true;
    ensureLocalReferentePerms();
    return (state.permissions||[]).includes(code);
  };
  try{ can = window.can; }catch(e){}

  window.canModuleV845 = function(module, action='view'){
    if(norm(roleNow())==='superadmin') return true;
    ensureLocalReferentePerms();
    const m=String(module||''); const a=String(action||'view');
    if((state.permissions||[]).includes(`${m}.${a}`)) return true;
    const rp=window.rolePermsV830||{};
    const rn=roleNow();
    if((rp[rn]?.[m]||[]).includes(a)) return true;
    if(roleKey(rn)==='referente'){
      if((mandatoryReferente[m]||[]).includes(a)) return true;
      return ['Referente','Referentes'].some(r=>(rp[r]?.[m]||[]).includes(a));
    }
    return false;
  };
  window.canModuleV830 = window.canModuleV834 = window.canModuleV845;
  try{ canModuleV830 = window.canModuleV845; canModuleV834 = window.canModuleV845; }catch(e){}

  const oldRoute845 = window.route || route;
  window.route = async function(p){
    if(p==='logout') return oldRoute845(p);
    await window.loadPermissionsV845();
    if(p!=='profile' && p!=='dashboard' && !window.canModuleV845(p,'view')){
      state.page=p; if(typeof syncNavActive==='function') syncNavActive();
      const c=document.querySelector('#content');
      if(c) c.innerHTML='<div class="card"><h2>Acceso restringido</h2><p>Tu perfil no tiene permisos para ver este módulo.</p></div>';
      return;
    }
    return oldRoute845(p);
  };
  try{ route=window.route; }catch(e){}

  const oldRenderShell845 = window.renderShell || renderShell;
  window.renderShell = function(){
    ensureLocalReferentePerms();
    const r=oldRenderShell845.apply(this, arguments);
    setTimeout(()=>{
      try{
        const nav=document.querySelector('.nav');
        if(nav){
          const mods=(window.modules||modules).filter(m=>m[0]==='logout'||m[0]==='profile'||m[0]==='dashboard'||window.canModuleV845(m[0],'view'));
          nav.innerHTML=mods.map(m=>`<button data-page="${E(m[0])}">${m[2]||''}<span>${E(String(m[1]).replace('Dtos/Oficinas/Reparticiones','Dtos/Oficinas'))}</span></button>`).join('');
          nav.querySelectorAll('button').forEach(b=>b.onclick=()=>window.route(b.dataset.page));
          if(typeof syncNavActive==='function') syncNavActive();
        }
      }catch(e){console.warn('renderShell v845 nav',e.message)}
    },80);
    return r;
  };
  try{ renderShell=window.renderShell; }catch(e){}

  // Fix definitivo para crear tickets: no envía columnas inexistentes y crea OS vinculada.
  const previousOpenForm845 = window.openForm || openForm;
  window.openForm = async function(key,id=null){
    if(key!=='tickets') return previousOpenForm845 ? previousOpenForm845(key,id) : undefined;
    if(!window.canModuleV845('tickets', id?'edit':'create')) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Tu perfil no tiene permisos para crear o editar tickets.'});
    if(window.openTicketFormV844) return window.openTicketFormV844(id);
    return previousOpenForm845 ? previousOpenForm845(key,id) : undefined;
  };
  try{ openForm=window.openForm; }catch(e){}

  // Al iniciar, recalcula permisos luego de cargar perfil.
  setTimeout(()=>window.loadPermissionsV845().catch(()=>{}),500);
})();

/* ========================= v8.47 FINAL: Referente tickets + dashboard + roles pagination ========================= */
(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const E=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=(v)=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const role=()=>String(state?.profile?.role_name||'Usuarios').trim();
  const isSA=()=>norm(role())==='superadmin';
  const isAdmin=()=>['superadmin','admin'].includes(norm(role()));
  const isRef=()=>['referente','referentes'].includes(norm(role()));
  const isTechRole=(r)=>['tecnicos','tecnico','técnicos','técnico','profesional tecnico','profesional técnico'].includes(norm(r));
  const uid=()=>state?.user?.id||state?.profile?.id||null;
  const mail=()=>state?.profile?.email||state?.user?.email||'';
  const F=(v)=>{ if(!v) return '-'; const d=new Date(v); return isNaN(d)?E(v):d.toLocaleString('es-AR'); };
  const MODULES=['dashboard','users','roles','orders','inventory','loans','tickets','notifications','offices','exceptions','logs','profile','settings'];
  const ACTIONS=['view','create','edit','delete','import','export'];

  function forceReferentePerms(){
    state.permissions ||= [];
    window.rolePermsV830 ||= {};
    ['Referente','Referentes',role()].forEach(r=>{
      if(!['referente','referentes'].includes(norm(r))) return;
      window.rolePermsV830[r] ||= {};
      window.rolePermsV830[r].tickets = Array.from(new Set([...(window.rolePermsV830[r].tickets||[]),'view','create']));
      window.rolePermsV830[r].notifications = Array.from(new Set([...(window.rolePermsV830[r].notifications||[]),'view']));
      window.rolePermsV830[r].dashboard = Array.from(new Set([...(window.rolePermsV830[r].dashboard||[]),'view']));
      window.rolePermsV830[r].profile = Array.from(new Set([...(window.rolePermsV830[r].profile||[]),'view','edit']));
    });
    if(isRef()) ['tickets.view','tickets.create','notifications.view','dashboard.view','profile.view','profile.edit'].forEach(c=>{ if(!state.permissions.includes(c)) state.permissions.push(c); });
  }
  window.canModuleV847=function(module,action='view'){
    if(isSA()) return true;
    forceReferentePerms();
    if((state.permissions||[]).includes(`${module}.${action}`)) return true;
    const rp=window.rolePermsV830||{};
    if((rp[role()]?.[module]||[]).includes(action)) return true;
    if(isRef()) return ({dashboard:['view'],tickets:['view','create'],notifications:['view'],profile:['view','edit']}[module]||[]).includes(action);
    return false;
  };
  window.canModuleV830=window.canModuleV834=window.canModuleV845=window.canModuleV847;
  window.can=(code)=>{ if(isSA()) return true; forceReferentePerms(); return (state.permissions||[]).includes(code); };
  try{ canModuleV830=window.canModuleV847; can=window.can; }catch(e){}

  async function cleanInsert(table, payload){
    const p={...payload};
    let r=await supa.from(table).insert(p).select('*').single();
    if(r.error && /no field|column|schema cache|technician_user_id/i.test(r.error.message||'')){
      delete p.technician_user_id;
      r=await supa.from(table).insert(p).select('*').single();
    }
    return r;
  }
  async function chooseTech(qty=1){
    const now=new Date(); const day=String(now.getDay()); const hm=now.toTimeString().slice(0,8);
    const {data:techs=[]}=await supa.from('profiles').select('*').eq('is_active',true).order('full_name');
    let candidates=techs.filter(t=>isTechRole(t.role_name));
    candidates=candidates.filter(t=>{
      const days=(t.work_days||[]).map(String); if(days.length && !days.includes(day)) return false;
      if(t.work_start && t.work_end && !(String(t.work_start)<=hm && hm<=String(t.work_end))) return false;
      return true;
    });
    const ids=candidates.map(t=>t.id);
    if(ids.length){
      const {data:ex=[]}=await supa.from('technician_exceptions').select('technician_id,start_at,end_at,is_active').in('technician_id',ids).eq('is_active',true);
      const busy=new Set((ex||[]).filter(x=>new Date(x.start_at)<=now && (!x.end_at || now<=new Date(x.end_at))).map(x=>x.technician_id));
      candidates=candidates.filter(t=>!busy.has(t.id));
    }
    if(!candidates.length) return {main:null,coll:null};
    const main=candidates[Math.floor(Math.random()*candidates.length)];
    let coll=null;
    if(Number(qty)>7){ const rest=candidates.filter(t=>t.id!==main.id); coll=rest[Math.floor(Math.random()*rest.length)]||null; }
    return {main,coll};
  }

  window.openTicketFormV847=async function(id=null){
    if(!window.canModuleV847('tickets',id?'edit':'create')) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Tu perfil no tiene permisos para crear tickets.'});
    const row=id?(await supa.from('support_tickets').select('*').eq('id',id).single()).data:null;
    const {data:offices=[]}=await supa.from('offices').select('name,office_name').eq('is_active',true).order('name');
    const {data:tasks=[]}=await supa.from('task_types').select('name').eq('is_active',true).order('name');
    const prof=state.profile||{};
    const canNewService=isAdmin()||isTechRole(role());
    const officeOpts='<option value="">Sin seleccionar</option>'+offices.map(o=>`<option value="${E(o.name||o.office_name)}" ${(row?.office||prof.office)===(o.name||o.office_name)?'selected':''}>${E(o.name||o.office_name)}</option>`).join('');
    const taskOpts='<option value="">Seleccione...</option>'+tasks.map(t=>`<option ${row?.service_type===t.name?'selected':''}>${E(t.name)}</option>`).join('')+(canNewService?'<option value="__new__">+ Crear nuevo servicio</option>':'');
    const html=`<div class="form-card"><div class="form-grid"><label>Solicitante<input id="tk_name" value="${E(row?.requester_name||prof.full_name||'')}" ${isRef()?'readonly':''}></label><label>Email<input id="tk_email" value="${E(row?.requester_email||prof.email||'')}" ${isRef()?'readonly':''}></label><label>WhatsApp / Teléfono<input id="tk_phone" value="${E(row?.requester_phone||prof.phone||'')}"></label><label>Oficina<select id="tk_office">${officeOpts}</select></label><label>Área<input id="tk_area" value="${E(row?.area||'')}"></label><label>Servicio solicitado<select id="tk_service">${taskOpts}</select></label><label id="tk_new_box" style="display:none">Nuevo servicio<input id="tk_new_service" placeholder="Ej. Cableado estructurado"></label><label>Cantidad de equipos a revisar<input id="tk_qty" type="number" min="1" value="${E(row?.equipment_count||1)}"><small>Si es mayor a 7, se asigna colaborador automáticamente.</small></label><div class="full assign-preview" id="tk_preview"></div><label>Tipo de equipo<input id="tk_equipment" value="${E(row?.equipment_type||'')}"></label><label>Marca<input id="tk_brand" value="${E(row?.brand||'')}"></label><label>Modelo<input id="tk_model" value="${E(row?.model||'')}"></label><label>Prioridad<select id="tk_priority">${['Baja','Media','Alta','Urgente'].map(x=>`<option ${String(row?.priority||'Media')===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="full">Accesorios<textarea id="tk_accessories">${E(row?.accessories||'')}</textarea></label><label class="full">Descripción del problema<textarea id="tk_description">${E(row?.description||'')}</textarea></label></div></div>`;
    const {value}=await Swal.fire({title:id?'Editar Soporte Ticket':'Nuevo Soporte Ticket',html,width:960,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',customClass:{popup:'tm-modal'},didOpen:()=>{ const refresh=async()=>{ $('#tk_new_box').style.display=$('#tk_service').value==='__new__'?'block':'none'; const ch=await chooseTech($('#tk_qty').value); $('#tk_preview').innerHTML=ch.main?`<p><b>Responsable técnico:</b> ${E(ch.main.full_name)}</p>${Number($('#tk_qty').value)>7?`<p><b>Colaborador técnico:</b> ${ch.coll?E(ch.coll.full_name):'No hay colaboradores disponibles'}</p>`:''}<small>Asignación previa. Se confirma al guardar.</small>`:'<small>Sin técnicos disponibles para asignación automática.</small>'; }; $('#tk_service').onchange=refresh; $('#tk_qty').oninput=refresh; setTimeout(refresh,50);},preConfirm:async()=>{ const raw=$('#tk_service').value; const service=raw==='__new__'?$('#tk_new_service').value.trim():raw; if(!$('#tk_name').value.trim()||!service||!$('#tk_description').value.trim()){ Swal.showValidationMessage('Complete solicitante, servicio y descripción.'); return false;} const qty=Number($('#tk_qty').value||1); const ch=await chooseTech(qty); return {requester_name:$('#tk_name').value.trim(),requester_email:$('#tk_email').value.trim(),requester_phone:$('#tk_phone').value.trim(),office:$('#tk_office').value,area:$('#tk_area').value.trim(),service_type:service,incidence_type:service,subject:service,equipment_count:qty,description:$('#tk_description').value.trim(),priority:$('#tk_priority').value,status:row?.status||'Pendiente',assigned_to:ch.main?.id||null,collaborator_assigned_to:ch.coll?.id||null,equipment_type:$('#tk_equipment').value.trim(),brand:$('#tk_brand').value.trim(),model:$('#tk_model').value.trim(),accessories:$('#tk_accessories').value.trim(),_mainName:ch.main?.full_name||''}; }});
    if(!value) return;
    if(canNewService && !(tasks||[]).some(t=>t.name===value.service_type)) await supa.from('task_types').upsert({name:value.service_type,description:value.service_type,weight:1,is_active:true},{onConflict:'name'});
    const ticketPayload={requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,area:value.area,subject:value.subject,incidence_type:value.incidence_type,description:value.description,priority:value.priority,status:value.status,assigned_to:value.assigned_to,collaborator_assigned_to:value.collaborator_assigned_to,service_type:value.service_type,equipment_count:value.equipment_count,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories};
    let res=id?await supa.from('support_tickets').update(ticketPayload).eq('id',id).select('*').single():await cleanInsert('support_tickets',ticketPayload);
    if(res.error) return Swal.fire({icon:'error',title:'No se pudo guardar',text:res.error.message});
    if(!id){
      const osPayload={origin_ticket_id:res.data.id,assigned_to:value.assigned_to,technician_user_id:value.assigned_to,collaborator_assigned_to:value.collaborator_assigned_to,professional_technician:value._mainName,requester_name:value.requester_name,requester_email:value.requester_email,requester_phone:value.requester_phone,office:value.office,equipment_type:value.equipment_type,brand:value.brand,model:value.model,accessories:value.accessories,fault_description:value.description,priority:value.priority,source:'SOPORTE_TICKET',service_type:value.service_type,equipment_count:value.equipment_count,created_by:uid(),updated_by:uid()};
      let os=await supa.from('service_orders').insert(osPayload).select('id,order_number').single();
      if(os.error && /technician_user_id|schema cache|column/i.test(os.error.message||'')){ delete osPayload.technician_user_id; os=await supa.from('service_orders').insert(osPayload).select('id,order_number').single(); }
      if(!os.error){ await supa.from('support_tickets').update({service_order_id:os.data.id}).eq('id',res.data.id); await supa.from('notifications').insert({title:'Nueva Orden de Servicio',body:`Ticket ${res.data.ticket_number||''} asignado como OS #${os.data.order_number}`,module:'orders',entity_id:os.data.id,target_user:value.assigned_to,target_role:'Técnicos',created_by:uid()}); }
    }
    await Swal.fire({icon:'success',title:'Ticket guardado'}); return route('tickets');
  };
  window.openTicketFormV844=window.openTicketFormV843=window.openTicketFormV847;
  const oldOpenForm=window.openForm;
  window.openForm=function(key,id=null){ if(key==='tickets') return window.openTicketFormV847(id); return oldOpenForm?oldOpenForm(key,id):undefined; };
  try{ openForm=window.openForm; }catch(e){}

  function orderVisible(o){ if(isAdmin()) return true; if(isRef()) return String(o.requester_email||'').toLowerCase()===mail().toLowerCase() || String(o.created_by||'')===uid() || String(o.origin_ticket_id||'')!==''; if(isTechRole(role())) return [o.assigned_to,o.technician_user_id,o.collaborator_assigned_to,o.attended_by].filter(Boolean).includes(uid()); return true; }
  function ticketVisible(t){ if(isAdmin()) return true; if(isRef()) return String(t.requester_email||'').toLowerCase()===mail().toLowerCase() || String(t.created_by||'')===uid(); if(isTechRole(role())) return [t.assigned_to,t.collaborator_assigned_to,t.attended_by].filter(Boolean).includes(uid()); return true; }
  window.renderDashboardV847=async function(){
    if(typeof page==='function') page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [{data:orders0=[]},{data:tickets0=[]},{data:inv=[]}]=await Promise.all([supa.from('service_orders').select('*,service_order_statuses(name,color)').order('received_at',{ascending:false}).limit(5000),supa.from('support_tickets').select('*').order('created_at',{ascending:false}).limit(5000),supa.from('inventory_items').select('*').limit(5000)]);
    const orders=(orders0||[]).filter(orderVisible); const tickets=(tickets0||[]).filter(ticketVisible); const now=Date.now();
    const urgent=orders.filter(o=>String(o.priority).toLowerCase()==='urgente'); const delayed=orders.filter(o=>now-new Date(o.received_at||o.created_at).getTime()>7*86400000);
    const cards=isRef()?[
      ['tickets','Mis Tickets',tickets.length,'Solicitudes creadas por mi usuario.'],['orders','Mis Órdenes',orders.length,'Órdenes vinculadas a mis tickets.'],['pending','Pendientes',orders.filter(o=>!['Terminada','Entregada','Cerrada','Finalizada'].includes(o.service_order_statuses?.name||o.status)).length,'Seguimiento pendiente.'],['done','Finalizadas',orders.filter(o=>['Terminada','Entregada','Cerrada','Finalizada'].includes(o.service_order_statuses?.name||o.status)).length,'Cerradas o entregadas.']
    ]:[['users','Usuarios',(await supa.from('profiles').select('id',{count:'exact',head:true})).count||0,'Perfiles autorizados.'],['orders','Órdenes',orders.length,'Órdenes técnicas registradas.'],['urgent','Urgentes',urgent.length,'Prioridad crítica'],['delayed','Atrasadas',delayed.length,'Más de 7 días abiertas'],['tickets','Tickets',tickets.length,'Solicitudes recibidas'],['inventory','Inventario',inv.length,'Activos e insumos']];
    const d=new Date(); const month=d.getMonth(), year=d.getFullYear(); const first=new Date(year,month,1).getDay()||7; const days=new Date(year,month+1,0).getDate(); let cells=''; for(let i=1;i<first;i++)cells+='<div class="cal-cell muted"></div>'; for(let day=1;day<=days;day++){ const os=orders.filter(o=>new Date(o.received_at||o.created_at).getDate()===day && new Date(o.received_at||o.created_at).getMonth()===month); cells+=`<div class="cal-cell"><b>${day}</b>${os.slice(0,2).map(o=>`<span>OS ${E(o.order_number||'')} · ${E(o.office||'')}</span>`).join('')}</div>`; }
    $('#content').innerHTML=`<div class="dash-grid cards">${cards.map(c=>`<div class="stat-card" onclick="showDashCardV847('${c[0]}')"><small>${E(c[1])}</small><strong>${c[2]}</strong><span>${E(c[3])}</span></div>`).join('')}</div><div class="dashboard-main"><div class="card alert-card"><h2>Alertas operativas</h2><p>${isRef()?'Resumen de mis tickets y órdenes vinculadas.':'Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.'}</p><div class="alert-grid"><b>${urgent.length} urgentes</b><b>${orders.length} órdenes</b><b>${delayed.length} atrasadas</b><b>${tickets.length} tickets</b></div></div><div class="card calendar-card"><div class="module-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${d.toLocaleString('es-AR',{month:'long',year:'numeric'})}</p></div><button class="btn" onclick="route('orders')">Ver órdenes</button></div><div class="calendar-head"><span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span></div><div class="calendar-grid">${cells}</div></div></div>`;
    state.rows={...(state.rows||{}),orders,tickets,inventory:inv};
  };
  function rowActions(key,id){ return `<div class="dash-actions"><button class="icon-btn" onclick="viewRecord('${key}','${id}')">👁</button><button class="icon-btn" onclick="openForm('${key}','${id}')">✎</button></div>`; }
  window.showDashCardV847=function(kind){
    const orders=state.rows?.orders||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[]; let title='Detalle', heads=[], rows=[];
    if(kind==='users'){ title='Usuarios contabilizados'; heads=['Nombre','Email','Rol','Oficina','Acciones']; rows=(state.rows?.users||[]).map(u=>[u.full_name,u.email,u.role_name,u.office,rowActions('users',u.id)]); }
    else if(['orders','urgent','delayed','pending','done'].includes(kind)){ title=kind==='urgent'?'Órdenes urgentes':kind==='delayed'?'Órdenes atrasadas':kind==='pending'?'Órdenes pendientes':kind==='done'?'Órdenes finalizadas':'Órdenes contabilizadas'; let arr=orders; if(kind==='urgent')arr=orders.filter(o=>String(o.priority).toLowerCase()==='urgente'); if(kind==='delayed')arr=orders.filter(o=>Date.now()-new Date(o.received_at||o.created_at).getTime()>7*86400000); heads=['Orden','Oficina','Profesional Técnico','Falla / Diagnóstico','Acciones']; rows=arr.slice(0,500).map(o=>['#'+(o.order_number||''),o.office||'-',o.professional_technician||o.technician_name||'-',o.fault_description||'-',rowActions('orders',o.id)]); }
    else if(kind==='tickets'){ title='Tickets contabilizados'; heads=['Ticket','Solicitante','Oficina','Estado','Acciones']; rows=tickets.slice(0,500).map(t=>[t.ticket_number||'-',t.requester_name||'-',t.office||'-',t.status||'-',rowActions('tickets',t.id)]); }
    else { title='Inventario contabilizado'; heads=['Código','Nombre','Categoría','Stock','Acciones']; rows=inv.slice(0,500).map(i=>[i.code||i.barcode||'-',i.name||'-',i.category||i.item_type||'-',i.stock??'-',rowActions('inventory',i.id)]); }
    Swal.fire({title,html:`<div class="dash-popup-table"><table><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===r.length-1?'actions-cell':''}">${i===r.length-1?c:E(c)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${heads.length}">Sin registros.</td></tr>`}</tbody></table></div><small>Mostrando hasta 500 registros.</small>`,width:980,confirmButtonText:'OK',customClass:{popup:'tm-modal dash-popup'}});
  };
  window.showDashCard=window.showDashboardPopup=window.showDashCardV847;

  window.rolesPage847=window.rolesPage847||1; window.rolesSize847=window.rolesSize847||5;
  function rolesPager(total){ const pages=Math.max(1,Math.ceil(total/window.rolesSize847)); window.rolesPage847=Math.min(window.rolesPage847,pages); return `<div class="pager"><label>Mostrar <select onchange="rolesSize847=parseInt(this.value,10);rolesPage847=1;renderRolesPermsV847()">${[5,10,25,50,100,500,1000].map(n=>`<option value="${n}" ${n===window.rolesSize847?'selected':''}>${n}</option>`).join('')}</select></label><span>Página ${window.rolesPage847} de ${pages} · ${total} perfiles</span><div><button class="btn" ${window.rolesPage847<=1?'disabled':''} onclick="rolesPage847--;renderRolesPermsV847()">← Atrás</button><button class="btn" ${window.rolesPage847>=pages?'disabled':''} onclick="rolesPage847++;renderRolesPermsV847()">Siguiente →</button></div></div>`; }
  window.deleteSelectedRoles847=async function(){ const names=$$('.role-select847:checked').map(x=>x.value); if(!names.length)return; const ok=await Swal.fire({icon:'warning',title:'Eliminar roles seleccionados',text:names.join(', '),showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; await supa.from('role_module_permissions').delete().in('role_name',names); await supa.from('roles').delete().in('name',names.filter(n=>!['SuperAdmin','Admin','Técnicos','Tecnicos','Usuarios','Referente','Referentes'].includes(n))); renderRolesPermsV847(); };
  window.renderRolesPermsV847=async function(){
    if(!window.canModuleV847('roles','view')) return $('#content').innerHTML='<div class="card"><h2>Acceso restringido</h2><p>Tu perfil no tiene permisos para ver este módulo.</p></div>';
    if(typeof page==='function') page('Roles y Permisos','Configurar módulos visibles y acciones permitidas por perfil institucional.');
    const {data:roles=[]}=await supa.from('roles').select('*').order('name');
    const {data:perms=[]}=await supa.from('role_module_permissions').select('*'); const map={}; (perms||[]).forEach(p=>{ map[p.role_name]||={}; map[p.role_name][p.module_key]=p; });
    const start=(window.rolesPage847-1)*window.rolesSize847; const view=(roles||[]).slice(start,start+window.rolesSize847); const pag=rolesPager((roles||[]).length);
    const moduleNames={dashboard:'Dashboard',users:'Usuarios',roles:'Roles y Permisos',orders:'Órdenes de Servicio',inventory:'Inventario',loans:'Gestión de Préstamos',tickets:'Soporte Ticket',notifications:'Notificaciones',offices:'Dtos/Oficinas',exceptions:'Excepciones',logs:'Registros Historial'};
    $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Roles y Permisos</h2><p>Los permisos se aplican al menú, botones y operaciones principales.</p></div><div class="module-actions"><button class="btn" onclick="openRoleCreate847()">Nuevo perfil</button><button class="btn danger" onclick="deleteSelectedRoles847()">Eliminar selección</button><button class="btn primary" onclick="saveRolesPerms847()">Guardar permisos</button></div></div>${pag}<div class="bulkbar"><label><input type="checkbox" onchange="$$('.role-select847').forEach(c=>c.checked=this.checked)"> Seleccionar todo</label></div><div class="table-wrap roles-perms-wrap"><table class="roles-perms-table"><thead><tr><th>Sel.</th><th>Perfil</th>${MODULES.filter(m=>!['profile','settings'].includes(m)).map(m=>`<th>${moduleNames[m]||m}</th>`).join('')}</tr></thead><tbody>${view.map(r=>`<tr><td><input class="role-select847" type="checkbox" value="${E(r.name)}"></td><td><b>${E(r.name)}</b></td>${MODULES.filter(m=>!['profile','settings'].includes(m)).map(m=>`<td>${ACTIONS.map(a=>{ const checked=!!map[r.name]?.[m]?.['can_'+a]; return `<label class="perm-check"><input type="checkbox" data-role="${E(r.name)}" data-module="${m}" data-action="${a}" ${checked?'checked':''}> ${a==='view'?'Ver':a==='create'?'Crear':a==='edit'?'Editar':a==='delete'?'Eliminar':a==='import'?'Importar CSV':'Exportar CSV/PDF'}</label>`; }).join('')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${pag}</div>`;
  };
  window.openRoleCreate847=async function(){ const {value}=await Swal.fire({title:'Nuevo perfil',html:'<input id="new_role_name" class="swal2-input" placeholder="Nombre del perfil">',showCancelButton:true,preConfirm:()=>$('#new_role_name').value.trim()}); if(!value)return; await supa.from('roles').upsert({name:value,description:'Perfil institucional',is_system:false},{onConflict:'name'}); renderRolesPermsV847(); };
  window.saveRolesPerms847=async function(){ const rows=[]; const grouped={}; $$('.roles-perms-table input[data-role]').forEach(c=>{ const k=c.dataset.role+'|'+c.dataset.module; grouped[k]||={role_name:c.dataset.role,module_key:c.dataset.module,can_view:false,can_create:false,can_edit:false,can_delete:false,can_import:false,can_export:false}; grouped[k]['can_'+c.dataset.action]=c.checked; }); Object.values(grouped).forEach(v=>rows.push(v)); if(rows.length){ await supa.from('role_module_permissions').upsert(rows,{onConflict:'role_name,module_key'}); } await Swal.fire({icon:'success',title:'Permisos guardados'}); await window.loadPermissionsV845?.(); renderRolesPermsV847(); };
  window.renderRolesPermsV830=window.renderRolesPermsV834=window.renderRolesPermsV847;

  function css847(){ if($('#css847'))return; const st=document.createElement('style'); st.id='css847'; st.textContent=`
    .dash-popup-table{max-height:52vh;overflow:auto;border:1px solid rgba(148,163,184,.22);border-radius:16px}.dash-popup-table table{width:100%;table-layout:fixed;border-collapse:collapse}.dash-popup-table th,.dash-popup-table td{padding:12px 14px;border-bottom:1px solid rgba(148,163,184,.18);vertical-align:top;white-space:normal;overflow-wrap:anywhere}.dash-popup-table th:last-child,.dash-popup-table td.actions-cell{width:132px;text-align:center}.dash-actions{display:flex;gap:8px;justify-content:center;align-items:center}.dash-actions .icon-btn{background:#14243d!important;color:#e5e7eb!important;border:1px solid rgba(148,163,184,.25)!important;border-radius:10px!important;min-width:34px;height:34px}.roles-perms-wrap{overflow:auto;max-height:62vh}.roles-perms-table{min-width:1450px}.perm-check{display:block;margin:4px 0;white-space:normal}.bulkbar{padding:10px 0}.notification-popover-v844{max-width:min(92vw,420px);max-height:min(72vh,620px);overflow:auto;left:auto}.notification-popover-v844 .np-head{position:sticky;top:0;z-index:2}.notification-popover-v844 .np-close{font-size:24px;line-height:1;border:0;background:transparent;color:inherit}.cards .stat-card{cursor:pointer}@media(max-width:760px){.notification-popover-v844{left:10px!important;right:10px!important;top:86px!important;width:auto!important}.roles-perms-table{min-width:1200px}.dashboard-main{grid-template-columns:1fr!important}.dash-grid.cards{grid-template-columns:1fr 1fr!important}.dash-popup-table{max-height:50vh}.dash-popup-table th,.dash-popup-table td{font-size:12px;padding:8px}.dash-popup-table th:last-child,.dash-popup-table td.actions-cell{width:92px}.tm-modal{width:96vw!important}}
  `; document.head.appendChild(st); }
  const oldRoute=window.route;
  window.route=async function(p){ css847(); forceReferentePerms(); if(p==='dashboard'){ state.page='dashboard'; syncNavActive?.(); return renderDashboardV847(); } if(p==='roles'){ state.page='roles'; syncNavActive?.(); return renderRolesPermsV847(); } return oldRoute?oldRoute(p):undefined; };
  try{ route=window.route; renderDashboard=window.renderDashboardV847; }catch(e){}
  setTimeout(()=>{ css847(); forceReferentePerms(); if(state?.page==='dashboard') renderDashboardV847(); },600);
})();

/* ========================= v8.48 FINAL: Referente dashboard/menu/RBAC + ticket insert hotfix ========================= */
(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const E=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=(v)=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const role=()=>String(state?.profile?.role_name||'Usuarios').trim();
  const roleNorm=()=>norm(role());
  const isSA=()=>roleNorm()==='superadmin';
  const isAdmin=()=>['superadmin','admin'].includes(roleNorm());
  const isRef=()=>['referente','referentes'].includes(roleNorm());
  const isTech=()=>['tecnicos','tecnico','técnicos','técnico','profesional tecnico','profesional técnico'].includes(roleNorm());
  const uid=()=>state?.user?.id||state?.profile?.id||null;
  const email=()=>String(state?.profile?.email||state?.user?.email||'').toLowerCase();
  const moduleAlias=(m)=>({support_tickets:'tickets',soporte_ticket:'tickets',soporte:'tickets',service_orders:'orders',roles_permissions:'roles',role_module_permissions:'roles'}[String(m||'')]||String(m||''));
  const moduleSynonyms=(m)=>{m=moduleAlias(m); return m==='tickets'?['tickets','support_tickets','soporte_ticket']:m==='orders'?['orders','service_orders']:m==='roles'?['roles','roles_permissions','role_module_permissions']:[m];};
  const defaultModules=()=> (window.modules || (typeof modules!=='undefined'?modules: [
    ['dashboard','Dashboard',ico?.dashboard||''],['users','Usuarios',ico?.users||''],['roles','Roles y Permisos',ico?.roles||''],['orders','Órdenes de Servicio',ico?.orders||''],['inventory','Inventario',ico?.inventory||''],['loans','Gestión de Préstamos',ico?.loans||''],['tickets','Soporte Ticket',ico?.tickets||''],['notifications','Notificaciones',ico?.notifications||''],['offices','Dtos/Oficinas',ico?.offices||''],['exceptions','Excepciones',ico?.calendar||''],['logs','Registros Historial',ico?.list||''],['profile','Mi Perfil',ico?.users||''],['settings','Configuraciones',ico?.settings||''],['logout','Cerrar Sesión',ico?.logout||'']
  ]));

  function injectCss848(){ if($('#css848')) return; const st=document.createElement('style'); st.id='css848'; st.textContent=`
    .dash-grid.cards{display:grid!important;grid-template-columns:repeat(6,minmax(150px,1fr))!important;gap:16px!important;margin-bottom:16px!important}.stat-card{min-height:116px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;padding:18px!important;border-radius:18px!important}.stat-card small{color:#93c5fd!important;font-weight:800!important}.stat-card strong{font-size:34px!important;line-height:1.05!important}.stat-card span{color:#cbd5e1!important}.dashboard-main{display:grid!important;grid-template-columns:minmax(340px,.9fr) minmax(560px,1.7fr)!important;gap:16px!important;align-items:stretch!important}.calendar-card{min-height:520px!important}.calendar-head,.calendar-grid{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:8px!important}.calendar-head span{text-align:center!important;font-weight:800!important;color:#b6c7df!important}.cal-cell{min-height:86px!important;border:1px solid rgba(148,163,184,.22)!important;border-radius:14px!important;padding:8px!important;background:rgba(15,23,42,.38)!important;overflow:hidden!important}.cal-cell b{display:block;text-align:right!important}.cal-cell span{display:block;background:#5b46b2;color:white;border-radius:7px;padding:4px;margin-top:4px;font-size:11px;font-weight:800;line-height:1.05}.alert-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:24px!important;margin:28px 0}.nav button[hidden],.mobile-dock button[hidden]{display:none!important}
    .notification-popover-v844,.notification-popover{max-width:min(92vw,430px)!important;max-height:min(72vh,620px)!important;overflow:auto!important}.notification-popover-v844 .np-close,.notification-popover .np-close{display:inline-flex!important;align-items:center!important;justify-content:center!important;float:right!important;width:32px!important;height:32px!important;border-radius:10px!important;border:1px solid rgba(148,163,184,.25)!important;background:rgba(15,23,42,.8)!important;color:#e5e7eb!important}
    @media(max-width:1180px){.dash-grid.cards{grid-template-columns:repeat(3,minmax(0,1fr))!important}.dashboard-main{grid-template-columns:1fr!important}}@media(max-width:760px){.dash-grid.cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}.dashboard-main{grid-template-columns:1fr!important}.cal-cell{min-height:68px!important}.notification-popover-v844,.notification-popover{position:fixed!important;left:10px!important;right:10px!important;top:82px!important;width:auto!important}.sidebar .nav button:not(.active){display:flex}.mobile-dock{display:flex!important}.main{padding-bottom:120px!important}}
  `; document.head.appendChild(st); }

  function forceRefPerms(){
    state.permissions ||= [];
    window.rolePermsV830 ||= {};
    if(isRef()){
      ['dashboard.view','tickets.view','tickets.create','support_tickets.view','support_tickets.create','notifications.view','profile.view','profile.edit'].forEach(c=>{ if(!state.permissions.includes(c)) state.permissions.push(c); });
      ['Referente','Referentes',role()].forEach(r=>{ window.rolePermsV830[r] ||= {}; window.rolePermsV830[r].tickets=['view','create']; window.rolePermsV830[r].support_tickets=['view','create']; window.rolePermsV830[r].dashboard=['view']; window.rolePermsV830[r].notifications=['view']; window.rolePermsV830[r].profile=['view','edit']; });
    }
  }

  const prevLoad=window.loadPermissions;
  window.loadPermissions=async function(){
    if(prevLoad) await prevLoad();
    try{
      const names=[role()]; if(isRef()) names.push('Referente','Referentes');
      const {data=[]}=await supa.from('role_module_permissions').select('*').in('role_name',[...new Set(names)]);
      window.rolePermsV830 ||= {}; state.permissions ||= [];
      data.forEach(r=>{ const mod=moduleAlias(r.module_key); window.rolePermsV830[r.role_name] ||= {}; window.rolePermsV830[r.role_name][mod]=['view','create','edit','delete','import','export'].filter(a=>!!r['can_'+a]); moduleSynonyms(mod).forEach(mm=>window.rolePermsV830[r.role_name][mm]=window.rolePermsV830[r.role_name][mod]); window.rolePermsV830[r.role_name][mod].forEach(a=>moduleSynonyms(mod).forEach(mm=>{ const c=`${mm}.${a}`; if(!state.permissions.includes(c)) state.permissions.push(c); })); });
    }catch(e){ console.warn('v8.48 load perms', e.message); }
    forceRefPerms();
  };
  try{ loadPermissions=window.loadPermissions; }catch(e){}

  window.canModuleV848=function(module,action='view'){
    if(isSA()) return true;
    forceRefPerms();
    const mods=moduleSynonyms(module);
    if(mods.some(m=>(state.permissions||[]).includes(`${m}.${action}`))) return true;
    const rp=window.rolePermsV830||{};
    if(mods.some(m=>(rp[role()]?.[m]||[]).includes(action))) return true;
    if(isRef()) return (['dashboard','tickets','support_tickets','notifications','profile'].includes(moduleAlias(module)) && (moduleAlias(module)==='tickets'?['view','create']:moduleAlias(module)==='profile'?['view','edit']:['view']).includes(action));
    return false;
  };
  window.canModuleV830=window.canModuleV834=window.canModuleV845=window.canModuleV847=window.canModuleV848;
  window.can=(code)=>{ if(isSA()) return true; forceRefPerms(); const [m,a]=String(code).split('.'); return window.canModuleV848(m,a||'view'); };
  try{ canModuleV830=window.canModuleV848; can=window.can; }catch(e){}

  function allowedModules848(){
    const base=defaultModules();
    return base.filter(m=>{
      const key=m[0];
      if(key==='logout') return true;
      if(key==='profile') return true;
      return window.canModuleV848(key,'view');
    }).map(m=>[m[0],String(m[1]).replace('Dtos/Oficinas/Reparticiones','Dtos/Oficinas'),m[2]]);
  }
  window.allowedModules848=allowedModules848;

  window.renderShell=function(){
    injectCss848(); forceRefPerms();
    const logo = (localStorage.theme==='light'?state.settings?.logo_light_url:state.settings?.logo_dark_url) || 'assets/logo.svg';
    const avatar = state.profile?.avatar_url || 'assets/avatar-default.svg';
    const allowed=allowedModules848();
    const mobileMain=allowed.filter(m=>['dashboard','tickets','notifications','profile','orders','inventory','loans'].includes(m[0])).slice(0,4);
    $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand" id="brandToggle" title="Colapsar/expandir menú"><img src="${E(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${E(state.settings?.institution_name||'Dirección de Informática')}</strong><small>${E(state.settings?.institution_area||'Área Soporte Técnico')}</small></div></div><nav class="nav">${allowed.map(m=>`<button data-page="${E(m[0])}">${m[2]||''}<span>${E(m[1])}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET & OS MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank">Invítame un Cafecito</a></div></aside><main class="main"><section class="topbar"><div class="mobile-brand-top"><img src="${E(logo)}" onerror="this.src='assets/logo.svg'"></div><div class="topbar-title"><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn desktop-only theme-svg" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?(typeof themeMoonSvg==='function'?themeMoonSvg():'☾'):(typeof themeSunSvg==='function'?themeSunSvg():'☼')}</button><button class="icon-btn desktop-only" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn notify-trigger" id="notifyBtn" title="Notificaciones">${ico?.bell||'🔔'}</button><button class="avatar-action" id="avatarBtn" title="Mi perfil"><img src="${E(avatar)}" onerror="this.src='assets/avatar-default.svg'"><span class="desktop-only">${E(state.profile?.full_name||state.profile?.email||'')}</span></button><button class="icon-btn logout-action" id="logoutBtn" title="Cerrar sesión">${ico?.logout||'⇲'}</button></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main><nav class="mobile-dock" aria-label="Menú principal móvil">${mobileMain.map(m=>`<button data-page="${E(m[0])}" aria-label="${E(m[1])}">${m[2]||''}<span>${E(m[1])}</span></button>`).join('')}<button id="mobileMoreBtn" aria-label="Más módulos"><svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Más</span></button></nav></div>`;
    $$('.nav button, .mobile-dock button[data-page]').forEach(b=>b.onclick=()=>window.route(b.dataset.page));
    $('#themeBtn').onclick=()=>{ localStorage.theme=localStorage.theme==='light'?'dark':'light'; if(typeof applySettings==='function')applySettings(); window.renderShell(); window.route(state.page||'dashboard'); };
    $('#fullBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
    $('#avatarBtn').onclick=()=>window.route('profile');
    $('#logoutBtn').onclick=()=>window.route('logout');
    $('#brandToggle').onclick=()=>document.body.classList.toggle('sidebar-collapsed');
    $('#mobileMoreBtn').onclick=()=>{ const rest=allowed.filter(m=>!mobileMain.some(x=>x[0]===m[0])); Swal.fire({title:'Menú',html:`<div class="mobile-menu-sheet">${rest.map(m=>`<button class="mobile-menu-item" data-page="${E(m[0])}">${m[2]||''}<span>${E(m[1])}</span></button>`).join('')}</div>`,showConfirmButton:false,showCloseButton:true,customClass:{popup:'tm-modal mobile-menu-modal'}}); setTimeout(()=>$$('.mobile-menu-item').forEach(b=>b.onclick=()=>{Swal.close();window.route(b.dataset.page);}),50); };
    if(typeof installNotifyPreview840==='function') installNotifyPreview840();
    if(typeof updateNotificationCountV840==='function') updateNotificationCountV840(); else if(typeof updateNotificationCountV836==='function') updateNotificationCountV836();
    if(typeof syncNavActive==='function') syncNavActive(); else $$('.nav button,.mobile-dock button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===state.page));
  };
  try{ renderShell=window.renderShell; }catch(e){}

  async function fetchRows(table,select='*',order='created_at'){
    const r=await supa.from(table).select(select).order(order,{ascending:false}).limit(5000);
    return r.data||[];
  }
  function statusName(o){ return o.service_order_statuses?.name || o.status || 'Sin estado'; }
  function isFinal(o){ return ['terminada','entregada','cerrada','finalizada','lista p/retirar'].includes(norm(statusName(o))); }
  function isDelayed(o){ const t=new Date(o.received_at||o.created_at||Date.now()).getTime(); return Date.now()-t>7*86400000 && !isFinal(o); }
  function cardHtml(cards){ return `<div class="dash-grid cards">${cards.map(c=>`<div class="stat-card" onclick="showDashCardV848('${c[0]}')"><small>${E(c[1])}</small><strong>${E(c[2])}</strong><span>${E(c[3])}</span></div>`).join('')}</div>`; }
  function calendarHtml(orders){ const now=new Date(); const year=state.dashboardCalendar?.year||now.getFullYear(); const month=state.dashboardCalendar?.month??now.getMonth(); const d=new Date(year,month,1); const first=d.getDay()||7; const days=new Date(year,month+1,0).getDate(); let cells=''; for(let i=1;i<first;i++) cells+='<div class="cal-cell muted"></div>'; for(let day=1;day<=days;day++){ const os=orders.filter(o=>{const x=new Date(o.received_at||o.created_at);return x.getFullYear()===year&&x.getMonth()===month&&x.getDate()===day;}); cells+=`<div class="cal-cell"><b>${day}</b>${os.slice(0,3).map(o=>`<span>OS ${E(o.order_number||'')} · ${E(o.office||'')}</span>`).join('')}</div>`;} return `<div class="card calendar-card"><div class="module-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${d.toLocaleString('es-AR',{month:'long',year:'numeric'})}</p></div><div class="module-actions"><button class="btn" onclick="changeDashboardMonth(-1)">←</button><button class="btn" onclick="changeDashboardMonth(1)">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${[year-1,year,year+1].map(y=>`<option ${y===year?'selected':''}>${y}</option>`).join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-head"><span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span></div><div class="calendar-grid">${cells}</div></div>`; }
  window.changeDashboardMonth=function(delta){ const n=new Date(); const cal=state.dashboardCalendar||{month:n.getMonth(),year:n.getFullYear()}; const d=new Date(cal.year,cal.month+Number(delta||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; window.renderDashboardV848(); };
  window.changeDashboardYear=function(y){ const n=new Date(); state.dashboardCalendar=state.dashboardCalendar||{month:n.getMonth(),year:n.getFullYear()}; state.dashboardCalendar.year=Number(y)||n.getFullYear(); window.renderDashboardV848(); };

  window.renderDashboardV848=async function(){
    injectCss848(); if(typeof page==='function') page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const [orders0,tickets0,inv,users]=await Promise.all([fetchRows('service_orders','*,service_order_statuses(name,color)','received_at'),fetchRows('support_tickets','*','created_at'),fetchRows('inventory_items','*','created_at'),fetchRows('profiles','*','full_name')]);
    let tickets=tickets0, orders=orders0;
    if(isRef()){
      tickets=tickets0.filter(t=>String(t.requester_email||'').toLowerCase()===email() || String(t.created_by||'')===uid() || String(t.requester_name||'')===String(state.profile?.full_name||''));
      const ticketIds=new Set(tickets.map(t=>t.id));
      orders=orders0.filter(o=>ticketIds.has(o.origin_ticket_id) || String(o.requester_email||'').toLowerCase()===email() || String(o.created_by||'')===uid());
    } else if(isTech()){
      orders=orders0.filter(o=>[o.assigned_to,o.technician_user_id,o.collaborator_assigned_to,o.attended_by].filter(Boolean).includes(uid()));
      const orderIds=new Set(orders.map(o=>o.id));
      tickets=tickets0.filter(t=>[t.assigned_to,t.collaborator_assigned_to,t.attended_by].filter(Boolean).includes(uid()) || orderIds.has(t.service_order_id));
    }
    const urgent=orders.filter(o=>norm(o.priority)==='urgente'); const delayed=orders.filter(isDelayed); const pending=orders.filter(o=>!isFinal(o)); const done=orders.filter(isFinal);
    const cards=isRef()?[
      ['tickets','Mis Tickets',tickets.length,'Solicitudes creadas por mi usuario.'],['orders','Mis Órdenes',orders.length,'Órdenes vinculadas a mis tickets.'],['pending','Pendientes',pending.length,'Seguimiento pendiente.'],['done','Finalizadas',done.length,'Cerradas o entregadas.']
    ]:[['users','Usuarios',users.length,'Perfiles autorizados.'],['orders','Órdenes',orders.length,'Órdenes técnicas registradas.'],['urgent','Urgentes',urgent.length,'Prioridad crítica'],['delayed','Atrasadas',delayed.length,'Más de 7 días abiertas'],['tickets','Tickets',tickets.length,'Solicitudes recibidas'],['inventory','Inventario',inv.length,'Activos e insumos']];
    state.rows={...(state.rows||{}),orders,tickets,inventory:inv,users};
    $('#content').innerHTML=`${cardHtml(cards)}<div class="dashboard-main"><div class="card alert-card"><h2>Alertas operativas</h2><p>${isRef()?'Resumen de mis tickets y órdenes vinculadas.':'Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.'}</p><div class="alert-grid"><b>${urgent.length} urgentes</b><b>${pending.length} pendientes</b><b>${delayed.length} atrasadas</b><b>${done.length} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(orders.reduce((a,o)=>{const s=statusName(o);a[s]=(a[s]||0)+1;return a;},{})).map(([k,v])=>`<div class="state-line"><span>${E(k)}</span><b>${v}</b></div>`).join('')||'<p>Sin órdenes vinculadas.</p>'}</div>${calendarHtml(orders)}</div>`;
  };
  window.renderDashboard=window.renderDashboardV848;
  try{ renderDashboard=window.renderDashboardV848; }catch(e){}

  function actionBtns(key,id){ return `<div class="dash-actions"><button class="icon-btn" title="Ver" onclick="viewRecord('${key}','${id}')">${ico?.view||'👁'}</button>${window.canModuleV848(key,'edit')?`<button class="icon-btn" title="Editar" onclick="openForm('${key}','${id}')">${ico?.edit||'✎'}</button>`:''}</div>`; }
  window.showDashCardV848=function(kind){
    const orders=state.rows?.orders||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[], users=state.rows?.users||[]; let title='Detalle', heads=[], rows=[];
    if(kind==='users'){ title='Usuarios contabilizados'; heads=['Nombre','Email','Rol','Oficina','Acciones']; rows=users.map(u=>[u.full_name,u.email,u.role_name,u.office,actionBtns('users',u.id)]); }
    else if(['orders','urgent','delayed','pending','done'].includes(kind)){ title=kind==='urgent'?'Órdenes urgentes':kind==='delayed'?'Órdenes atrasadas':kind==='pending'?'Órdenes pendientes':kind==='done'?'Órdenes finalizadas':'Órdenes contabilizadas'; let arr=orders; if(kind==='urgent') arr=orders.filter(o=>norm(o.priority)==='urgente'); if(kind==='delayed') arr=orders.filter(isDelayed); if(kind==='pending') arr=orders.filter(o=>!isFinal(o)); if(kind==='done') arr=orders.filter(isFinal); heads=['Orden','Oficina','Profesional Técnico','Falla / Diagnóstico','Acciones']; rows=arr.slice(0,500).map(o=>['#'+(o.order_number||''),o.office||'-',o.professional_technician||o.technician_name||'-',o.fault_description||'-',actionBtns('orders',o.id)]); }
    else if(kind==='tickets'){ title=isRef()?'Mis tickets':'Tickets contabilizados'; heads=['Ticket','Solicitante','Oficina','Estado','Acciones']; rows=tickets.slice(0,500).map(t=>[t.ticket_number||'-',t.requester_name||'-',t.office||'-',t.status||'-',actionBtns('tickets',t.id)]); }
    else { title='Inventario contabilizado'; heads=['Código','Nombre','Categoría','Stock','Acciones']; rows=inv.slice(0,500).map(i=>[i.code||i.barcode||'-',i.name||'-',i.category||i.item_type||'-',i.stock??'-',actionBtns('inventory',i.id)]); }
    Swal.fire({title,html:`<div class="dash-popup-table"><table><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===r.length-1?'actions-cell':''}">${i===r.length-1?c:E(c)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${heads.length}">Sin registros.</td></tr>`}</tbody></table></div><small>Mostrando hasta 500 registros.</small>`,width:980,confirmButtonText:'OK',customClass:{popup:'tm-modal dash-popup'}});
  };
  window.showDashCard=window.showDashboardPopup=window.showDashCardV847=window.showDashCardV848;

  const previousTicketForm=window.openTicketFormV847 || window.openTicketFormV844;
  async function insertWithoutColumns(table,payload,columnsToDrop){ const clean={...payload}; columnsToDrop.forEach(c=>delete clean[c]); let r=await supa.from(table).insert(clean).select('*').single(); if(r.error && /schema cache|no field|column/i.test(r.error.message||'')){ const p={...clean}; ['technician_user_id','collaborator_assigned_to','task_type_id','equipment_count','service_type','equipment_type','brand','model','accessories'].forEach(c=>{ if(/technician_user_id/i.test(r.error.message)&&c==='technician_user_id') delete p[c]; }); r=await supa.from(table).insert(p).select('*').single(); } return r; }
  window.openTicketFormV848=async function(id=null){
    // Usa el formulario v8.47, pero garantiza que el permiso Referente cree y que no se intente insertar technician_user_id en support_tickets.
    forceRefPerms();
    if(!window.canModuleV848('tickets',id?'edit':'create')) return Swal.fire({icon:'warning',title:'Acceso restringido',text:'Tu perfil no tiene permisos para crear tickets.'});
    if(previousTicketForm) return previousTicketForm(id);
  };
  window.openTicketFormV847=window.openTicketFormV844=window.openTicketFormV843=window.openTicketFormV848;
  const prevOpenForm=window.openForm;
  window.openForm=function(key,id=null){ const k=moduleAlias(key); if(k==='tickets') return window.openTicketFormV848(id); return prevOpenForm?prevOpenForm(key,id):undefined; };
  try{ openForm=window.openForm; }catch(e){}

  const prevRoute=window.route;
  window.route=async function(p){
    injectCss848(); await window.loadPermissions?.(); const k=moduleAlias(p);
    if(p==='logout') return prevRoute?prevRoute(p):undefined;
    if(k==='dashboard'){ state.page='dashboard'; window.renderDashboardV848(); setTimeout(()=>$$('.nav button,.mobile-dock button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='dashboard')),20); return; }
    if(k==='roles' && typeof window.renderRolesPermsV847==='function'){ state.page='roles'; window.renderRolesPermsV847(); setTimeout(()=>$$('.nav button,.mobile-dock button[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='roles')),20); return; }
    if(p!=='profile' && !window.canModuleV848(k,'view')){ state.page=k; $('#content').innerHTML='<div class="card"><h2>Acceso restringido</h2><p>Tu perfil no tiene permisos para ver este módulo.</p></div>'; return; }
    return prevRoute?prevRoute(k):undefined;
  };
  try{ route=window.route; }catch(e){}

  document.addEventListener('DOMContentLoaded',()=>setTimeout(async()=>{ injectCss848(); await window.loadPermissions?.(); window.renderShell(); window.route(state.page||'dashboard'); },250));
  setTimeout(async()=>{ injectCss848(); forceRefPerms(); if(document.querySelector('#app .layout')){ window.renderShell(); window.route(state.page||'dashboard'); } },900);
})();

/* ========================= v8.49 HOTFIX: técnico scoping, dashboard popups, calendar click, notifications scroll, profile schedule lock ========================= */
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const E = (v)=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const uid=()=>state?.user?.id||'';
  const role=()=>String(state?.profile?.role_name||'');
  const norm=(s)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const isSuper=()=>['superadmin','super admin'].includes(norm(role()));
  const isAdmin=()=>isSuper()||['admin','administrador'].includes(norm(role()));
  const isTech=()=>['tecnicos','tecnico','tecnicos/as','profesional tecnico','profesional técnico'].includes(norm(role()));
  const fmt=(v)=>{try{return v?new Date(v).toLocaleString('es-AR'):'-'}catch(_){return v||'-'}};
  const statusName=(o)=>o?.service_order_statuses?.name||o?.status||'Sin estado';
  const isFinal=(o)=>['terminada','entregada','cerrada','finalizada','lista p/retirar'].includes(norm(statusName(o)));
  const isDelayed=(o)=>{ const t=new Date(o?.received_at||o?.created_at||Date.now()).getTime(); return Date.now()-t>7*86400000 && !isFinal(o); };
  const canEdit=(key)=> typeof window.canModuleV848==='function' ? window.canModuleV848(key,'edit') : (isAdmin()||key==='profile');

  function injectCss849(){
    if($('#v849-css')) return;
    const st=document.createElement('style'); st.id='v849-css'; st.textContent=`
      .dash-grid.cards{display:grid!important;grid-template-columns:repeat(6,minmax(150px,1fr))!important;gap:14px!important;margin-bottom:16px!important}.stat-card{cursor:pointer}.dashboard-main{display:grid!important;grid-template-columns:minmax(320px,.95fr) minmax(520px,1.75fr)!important;gap:16px!important;align-items:stretch!important}.alert-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:22px!important;margin:28px 0!important}.state-line{display:flex!important;justify-content:space-between!important;align-items:center!important;background:rgba(255,255,255,.045)!important;border-radius:12px!important;padding:10px 12px!important;margin:8px 0!important}.calendar-head{display:grid!important;grid-template-columns:repeat(7,1fr)!important;gap:6px!important;margin-top:14px!important}.calendar-head span{font-weight:800;color:#a9bbd8;text-align:center}.calendar-grid{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:6px!important}.cal-cell{min-height:94px!important;border:1px solid rgba(148,163,184,.22)!important;border-radius:12px!important;padding:8px!important;background:rgba(255,255,255,.025)!important;overflow:hidden!important}.cal-cell b{display:block;text-align:right}.cal-os{display:block!important;margin-top:5px!important;padding:5px 7px!important;border-radius:7px!important;background:#5b45b9!important;color:#fff!important;font-size:12px!important;font-weight:800!important;line-height:1.05!important;cursor:pointer!important}.dash-popup .swal2-html-container{overflow:visible!important}.dash-popup-table{width:100%!important;max-height:440px!important;overflow:auto!important;border:1px solid rgba(148,163,184,.25)!important;border-radius:14px!important}.dash-popup-table table{width:100%!important;border-collapse:collapse!important;table-layout:fixed!important}.dash-popup-table th,.dash-popup-table td{padding:12px 12px!important;border-bottom:1px solid rgba(148,163,184,.22)!important;text-align:left!important;vertical-align:top!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}.dash-popup-table th{font-size:11px!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#c9d6ea!important;background:rgba(255,255,255,.035)!important}.dash-popup-table .actions-cell{width:112px!important;text-align:center!important}.dash-actions{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;flex-wrap:nowrap!important}.dash-actions .icon-btn,.dash-actions .icon-mini{width:34px!important;height:34px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:10px!important;border:1px solid rgba(148,163,184,.25)!important;background:rgba(15,23,42,.85)!important;color:#dbeafe!important;box-shadow:none!important}.light .dash-actions .icon-btn,.light .dash-actions .icon-mini{background:#eef2f7!important;color:#172033!important;border-color:#cbd5e1!important}.order-detail .detail-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}.order-detail .detail-grid p{background:rgba(255,255,255,.045)!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:12px!important;padding:10px!important;margin:0!important}.order-detail .detail-grid p.full{grid-column:1/-1}.notification-popover{max-height:70vh!important;overflow-y:auto!important;overscroll-behavior:contain!important}.np-items{max-height:58vh!important;overflow-y:auto!important;padding-right:4px!important}.np-head{position:sticky!important;top:0!important;background:#111d33!important;z-index:2!important}.np-close{float:right;width:28px;height:28px;border-radius:8px;border:1px solid rgba(148,163,184,.25);background:rgba(255,255,255,.06);color:#fff;cursor:pointer}.profile-schedule-locked{opacity:.58;pointer-events:none}.profile-schedule-note{grid-column:1/-1;color:#fbbf24;font-weight:800;font-size:12px;margin-top:-8px}@media(max-width:1100px){.dash-grid.cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}.dashboard-main{grid-template-columns:1fr!important}.cal-cell{min-height:80px!important}}@media(max-width:720px){.dash-grid.cards{grid-template-columns:1fr!important}.calendar-grid,.calendar-head{min-width:720px}.calendar-card{overflow-x:auto}.notification-popover{left:10px!important;right:10px!important;top:74px!important;width:auto!important;max-width:none!important}.dash-popup-table{max-height:55vh!important}.dash-popup-table table{min-width:760px!important}}
    `; document.head.appendChild(st);
  }

  function techFilterOrders(rows){ if(!isTech()) return rows||[]; const me=uid(); return (rows||[]).filter(o=>[o.assigned_to,o.technician_user_id,o.collaborator_assigned_to,o.attended_by].filter(Boolean).map(String).includes(String(me))); }
  function techFilterTickets(rows){ if(!isTech()) return rows||[]; const me=uid(); const orderIds=new Set((state.rows?.orders||[]).map(o=>String(o.id))); return (rows||[]).filter(t=>[t.assigned_to,t.technician_user_id,t.collaborator_assigned_to,t.attended_by].filter(Boolean).map(String).includes(String(me)) || orderIds.has(String(t.service_order_id||''))); }

  async function fetchDashboardRows(){
    const [or,tr,ir,ur]=await Promise.all([
      supa.from('service_orders').select('*,service_order_statuses(name,color)').order('received_at',{ascending:false}).limit(5000),
      supa.from('support_tickets').select('*').order('created_at',{ascending:false}).limit(5000),
      supa.from('inventory_items').select('*').order('created_at',{ascending:false}).limit(5000),
      supa.from('profiles').select('*').order('full_name').limit(5000)
    ]);
    let orders=or.data||[], tickets=tr.data||[];
    if(isTech()){ orders=techFilterOrders(orders); const ids=new Set(orders.map(o=>String(o.id))); tickets=(tickets||[]).filter(t=>[t.assigned_to,t.technician_user_id,t.collaborator_assigned_to,t.attended_by].filter(Boolean).map(String).includes(String(uid())) || ids.has(String(t.service_order_id||''))); }
    else if(typeof window.canModuleV848==='function' && !isAdmin() && norm(role()).includes('referente')){
      const mail=String(state.profile?.email||state.user?.email||'').toLowerCase();
      tickets=tickets.filter(t=>String(t.requester_email||'').toLowerCase()===mail || String(t.created_by||'')===String(uid()) || String(t.requester_name||'')===String(state.profile?.full_name||''));
      const tids=new Set(tickets.map(t=>String(t.id)));
      orders=orders.filter(o=>tids.has(String(o.origin_ticket_id||'')) || String(o.requester_email||'').toLowerCase()===mail || String(o.created_by||'')===String(uid()));
    }
    state.rows={...(state.rows||{}),orders,tickets,inventory:ir.data||[],users:ur.data||[]};
    return state.rows;
  }

  function dashboardCards(rows){
    const orders=rows.orders||[], tickets=rows.tickets||[], inv=rows.inventory||[], users=rows.users||[];
    const urgent=orders.filter(o=>norm(o.priority)==='urgente'), delayed=orders.filter(isDelayed), pending=orders.filter(o=>!isFinal(o)), done=orders.filter(isFinal);
    return [['users','Usuarios',users.length,'Perfiles autorizados.'],['orders','Órdenes',orders.length,isTech()?'Asignadas a mi usuario.':'Órdenes técnicas registradas.'],['urgent','Urgentes',urgent.length,'Prioridad crítica'],['delayed','Atrasadas',delayed.length,'Más de 7 días abiertas'],['tickets','Tickets',tickets.length,isTech()?'Asignados a mi usuario.':'Solicitudes recibidas'],['inventory','Inventario',inv.length,'Activos e insumos']];
  }
  function cardHtml(cards){ return `<div class="dash-grid cards">${cards.map(c=>`<div class="stat-card" onclick="showDashCardV849('${c[0]}')"><small>${E(c[1])}</small><strong>${E(c[2])}</strong><span>${E(c[3])}</span></div>`).join('')}</div>`; }
  function calendarHtml(orders){
    const now=new Date(); const year=state.dashboardCalendar?.year||now.getFullYear(); const month=state.dashboardCalendar?.month??now.getMonth(); const d=new Date(year,month,1); const first=d.getDay()||7; const days=new Date(year,month+1,0).getDate(); let cells='';
    for(let i=1;i<first;i++) cells+='<div class="cal-cell muted"></div>';
    for(let day=1;day<=days;day++){ const os=(orders||[]).filter(o=>{const x=new Date(o.received_at||o.created_at);return x.getFullYear()===year&&x.getMonth()===month&&x.getDate()===day;}); cells+=`<div class="cal-cell"><b>${day}</b>${os.slice(0,3).map(o=>`<span class="cal-os" onclick="event.stopPropagation();viewOrderV849('${E(o.id)}')">OS ${E(o.order_number||o.satmanager_order||'')} · ${E(o.office||'-')}</span>`).join('')}</div>`; }
    return `<div class="card calendar-card"><div class="module-head"><div><h2>Calendario de Órdenes de Servicio</h2><p>${d.toLocaleString('es-AR',{month:'long',year:'numeric'})}</p></div><div class="module-actions"><button class="btn" onclick="changeDashboardMonth(-1)">←</button><button class="btn" onclick="changeDashboardMonth(1)">→</button><label>Año <select onchange="changeDashboardYear(this.value)">${[year-1,year,year+1].map(y=>`<option ${y===year?'selected':''}>${y}</option>`).join('')}</select></label><button class="btn" onclick="route('orders')">Ver órdenes</button></div></div><div class="calendar-head"><span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span></div><div class="calendar-grid">${cells}</div></div>`;
  }

  window.renderDashboardV849=async function(){
    injectCss849(); if(typeof page==='function') page('Dashboard','Vista ejecutiva del sistema institucional con indicadores, alertas y calendario de órdenes.');
    const rows=await fetchDashboardRows(); const orders=rows.orders||[]; const urgent=orders.filter(o=>norm(o.priority)==='urgente'), delayed=orders.filter(isDelayed), pending=orders.filter(o=>!isFinal(o)), done=orders.filter(isFinal);
    const status=orders.reduce((a,o)=>{const s=statusName(o); a[s]=(a[s]||0)+1; return a;},{});
    $('#content').innerHTML=`${cardHtml(dashboardCards(rows))}<div class="dashboard-main"><div class="card alert-card"><h2>Alertas operativas</h2><p>${isTech()?'Resumen de mis órdenes y tickets asignados.':'Resumen de órdenes urgentes, pendientes, atrasadas y listas para retirar.'}</p><div class="alert-grid"><b>${urgent.length} urgentes</b><b>${pending.length} pendientes</b><b>${delayed.length} atrasadas</b><b>${done.length} listas/terminadas</b></div><h3>Estados</h3>${Object.entries(status).map(([k,v])=>`<div class="state-line"><span>${E(k)}</span><b>${v}</b></div>`).join('')||'<p>Sin órdenes asignadas.</p>'}</div>${calendarHtml(orders)}</div>`;
  };
  window.renderDashboard=window.renderDashboardV849; try{renderDashboard=window.renderDashboardV849}catch(_){ }
  window.changeDashboardMonth=function(delta){ const n=new Date(); const c=state.dashboardCalendar||{month:n.getMonth(),year:n.getFullYear()}; const d=new Date(c.year,c.month+Number(delta||0),1); state.dashboardCalendar={month:d.getMonth(),year:d.getFullYear()}; window.renderDashboardV849(); };
  window.changeDashboardYear=function(y){ const n=new Date(); state.dashboardCalendar=state.dashboardCalendar||{month:n.getMonth(),year:n.getFullYear()}; state.dashboardCalendar.year=Number(y)||n.getFullYear(); window.renderDashboardV849(); };

  function actions(key,id){ return `<div class="dash-actions"><button class="icon-btn" title="Ver" onclick="${key==='orders'?`viewOrderV849('${id}')`:`viewRecordV849('${key}','${id}')`}">${(window.ico&&ico.view)||'👁'}</button>${canEdit(key)?`<button class="icon-btn" title="Editar" onclick="Swal.close();route('${key}');setTimeout(()=>openForm('${key}','${id}'),350)">${(window.ico&&ico.edit)||'✎'}</button>`:''}</div>`; }
  window.showDashCardV849=function(kind){
    injectCss849(); const orders=state.rows?.orders||[], tickets=state.rows?.tickets||[], inv=state.rows?.inventory||[], users=state.rows?.users||[]; let title='Detalle', heads=[], rows=[];
    if(kind==='users'){ title='Usuarios contabilizados'; heads=['Nombre','Email','Rol','Oficina','Acciones']; rows=users.map(u=>[u.full_name,u.email,u.role_name,u.office,actions('users',u.id)]); }
    else if(['orders','urgent','delayed','pending','done'].includes(kind)){ title=kind==='urgent'?'Órdenes urgentes':kind==='delayed'?'Órdenes atrasadas':kind==='pending'?'Órdenes pendientes':kind==='done'?'Órdenes finalizadas':'Órdenes contabilizadas'; let arr=orders; if(kind==='urgent')arr=orders.filter(o=>norm(o.priority)==='urgente'); if(kind==='delayed')arr=orders.filter(isDelayed); if(kind==='pending')arr=orders.filter(o=>!isFinal(o)); if(kind==='done')arr=orders.filter(isFinal); heads=['Orden','Oficina','Profesional Técnico','Falla / Diagnóstico','Acciones']; rows=arr.slice(0,500).map(o=>['#'+(o.order_number||o.satmanager_order||''),o.office||'-',o.professional_technician||o.technician_name||'-',o.fault_description||'-',actions('orders',o.id)]); }
    else if(kind==='tickets'){ title='Tickets contabilizados'; heads=['Ticket','Solicitante','Oficina','Estado','Acciones']; rows=tickets.slice(0,500).map(t=>[t.ticket_number||'-',t.requester_name||'-',t.office||'-',t.status||'-',actions('tickets',t.id)]); }
    else { title='Inventario contabilizado'; heads=['Código','Nombre','Categoría','Stock','Acciones']; rows=inv.slice(0,500).map(i=>[i.code||i.barcode||'-',i.name||'-',i.category||i.item_type||'-',i.stock??'-',actions('inventory',i.id)]); }
    Swal.fire({title,html:`<div class="dash-popup-table"><table><thead><tr>${heads.map(h=>`<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===r.length-1?'actions-cell':''}">${i===r.length-1?c:E(c)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${heads.length}">Sin registros.</td></tr>`}</tbody></table></div><small>Mostrando hasta 500 registros.</small>`,width:1050,confirmButtonText:'OK',customClass:{popup:'tm-modal dash-popup'}});
  };
  window.showDashCard=window.showDashboardPopup=window.showDashCardV848=window.showDashCardV849;

  window.viewOrderV849=async function(id){
    const o=(state.rows?.orders||[]).find(x=>String(x.id)===String(id)) || (await supa.from('service_orders').select('*,service_order_statuses(name,color)').eq('id',id).maybeSingle()).data; if(!o)return;
    const {data:hist=[]}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false}).limit(20);
    Swal.fire({title:'Detalle de Orden de Servicio',html:`<div class="detail-card order-detail"><div class="order-num">Orden #${E(o.satmanager_order||o.order_number||'-')}</div><div class="detail-grid"><p><b>Ingreso</b><span>${E(fmt(o.received_at))}</span></p><p><b>Estado</b><span>${E(statusName(o))}</span></p><p><b>Profesional técnico</b><span>${E(o.professional_technician||o.technician_name||'-')}</span></p><p><b>Oficina/Repartición</b><span>${E(o.office||'-')}</span></p><p><b>Solicitante / Referente</b><span>${E(o.requester_name||'-')}</span></p><p><b>Dirección</b><span>${E(o.address||'-')}</span></p><p><b>Equipo</b><span>${E([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · ')||'-')}</span></p><p><b>N° serie</b><span>${E(o.serial_number||'-')}</span></p><p class="full"><b>Accesorios / insumos</b><span>${E(o.accessories||'-')}</span></p><p class="full"><b>Falla / diagnóstico</b><span>${E(o.fault_description||'-')}</span></p><p class="full"><b>Informe técnico</b><span>${E(o.technical_report||'-')}</span></p><p class="full"><b>Solución / observaciones</b><span>${E(o.solution||o.observations||'-')}</span></p></div><h4>Historial</h4><div class="history-list">${(hist||[]).map(h=>`<div><b>${E(fmt(h.created_at))}</b> · ${E(h.action||'')} ${E(h.previous_value||'')} ${h.new_value?'→ '+E(h.new_value):''}</div>`).join('')||'<small>Sin movimientos registrados.</small>'}</div></div>`,width:980,customClass:{popup:'tm-modal'}});
  };
  const oldView=window.viewRecord;
  window.viewRecordV849=window.viewRecord=async function(key,id){ if(key==='orders') return window.viewOrderV849(id); return oldView?oldView(key,id):undefined; };

  const oldShowPreview=window.showNotificationPreview;
  window.showNotificationPreview=async function(){
    injectCss849(); document.querySelector('.notification-popover')?.remove();
    let q=supa.from('notifications').select('*').order('created_at',{ascending:false}).limit(25);
    if(!isSuper()) q=q.or(`target_user.eq.${uid()},target_role.eq.${role()},target_role.is.null`);
    const {data=[]}=await q; const btn=$('#notifyBtn'); const r=btn?.getBoundingClientRect?.()||{right:window.innerWidth-20,bottom:70};
    const box=document.createElement('div'); box.className='notification-popover'; box.style.right=Math.max(10,window.innerWidth-r.right)+'px'; box.style.top=(r.bottom+8)+'px';
    box.innerHTML=`<div class="np-head"><b>Notificaciones recientes</b><button onclick="route('notifications');document.querySelector('.notification-popover')?.remove()">Historial de Notificaciones</button><button class="np-close" onclick="document.querySelector('.notification-popover')?.remove()">×</button></div><div class="np-items">${(data||[]).map(n=>`<div class="np-item"><b>${E(n.title)}</b><small>${E(n.body||'')}</small><em>${E(fmt(n.created_at))}</em></div>`).join('')||'<p>Sin notificaciones.</p>'}</div>`;
    box.addEventListener('mouseleave',()=>setTimeout(()=>box.remove(),250)); document.body.appendChild(box);
  };

  async function renderOrdersScoped(){
    injectCss849(); if(typeof page==='function') page('Órdenes de Servicio','Trazabilidad técnica institucional, sin importes ni conceptos comerciales.');
    const {data=[]}=await supa.from('service_orders').select('*,service_order_statuses(name,color)').order('received_at',{ascending:false}).limit(5000);
    const rows=techFilterOrders(data||[]); state.rows={...(state.rows||{}),orders:rows}; state.selected=state.selected||{}; state.selected.orders=new Set();
    const buttons=isAdmin()?`<button class="btn primary" onclick="openForm('orders')">Nueva orden</button><button class="btn" onclick="exportCsv('orders')">Exportar CSV</button><button class="btn" onclick="exportPdf('orders')">PDF A4</button>`:`<button class="btn" onclick="exportPdf('orders')">PDF A4</button>`;
    $('#content').innerHTML=`<div class="card"><div class="module-head"><div><h2>Órdenes técnicas</h2><p>${isTech()?'Solo órdenes asignadas a mi usuario técnico.':'Registro de ingreso, profesional técnico, oficina, estados, informe técnico, insumos utilizados, notas y entrega.'}</p></div><div class="module-actions">${buttons}</div></div><input class="search" placeholder="Buscar en mis órdenes..." oninput="filterRows(this.value)"><div class="table-wrap"><table><thead><tr><th>Orden</th><th>Ingreso</th><th>Oficina/Repartición</th><th>Profesional técnico</th><th>Equipo</th><th>Falla / Diagnóstico</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(o=>`<tr data-search="${E(Object.values(o).join(' ').toLowerCase())}"><td><b>#${E(o.order_number||o.satmanager_order||'-')}</b></td><td>${E(fmt(o.received_at))}</td><td>${E(o.office||'-')}</td><td>${E(o.professional_technician||o.technician_name||'-')}</td><td>${E([o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' · ')||'-')}</td><td>${E(o.fault_description||'-')}</td><td><span class="badge">${E(statusName(o))}</span></td><td class="row-actions">${actions('orders',o.id)}</td></tr>`).join('')||'<tr><td colspan="8">Sin órdenes asignadas.</td></tr>'}</tbody></table></div></div>`;
  }

  const prevRoute=window.route;
  window.route=async function(p){
    injectCss849(); const k=String(p||'dashboard');
    if(k==='dashboard'){ state.page='dashboard'; await window.renderDashboardV849(); return; }
    if(k==='orders' && isTech()){ state.page='orders'; await renderOrdersScoped(); return; }
    return prevRoute?prevRoute(p):undefined;
  }; try{route=window.route}catch(_){ }

  // Bloquea campos de horario laboral en Mi Perfil para no SuperAdmin.
  document.addEventListener('click',()=>setTimeout(()=>{
    if(!isSuper() && /Editar Usuario/i.test($('.swal2-title')?.textContent||'')){
      $$('.u_day,#u_work_start,#u_work_end').forEach(el=>{ el.disabled=true; el.closest('label')?.classList.add('profile-schedule-locked'); });
      const grid=$('.swal-grid'); if(grid && !$('.profile-schedule-note',grid)){ const note=document.createElement('div'); note.className='profile-schedule-note'; note.textContent='El horario laboral solo puede ser modificado por SuperAdmin.'; grid.appendChild(note); }
    }
  },120),true);

  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ injectCss849(); if(state?.page==='dashboard') window.renderDashboardV849(); },500));
  setTimeout(()=>{ injectCss849(); if(document.querySelector('#content') && state?.page==='dashboard') window.renderDashboardV849(); },1200);
})();

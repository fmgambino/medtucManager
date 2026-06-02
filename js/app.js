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

const state = { user:null, profile:null, settings:{}, page:'dashboard', rows:{}, statuses:[], permissions:[] };
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
  $('#app').innerHTML = `<div class="layout"><aside class="sidebar"><div class="brand"><img src="${esc(logo)}" onerror="this.src='assets/logo.svg'"><div><strong>${esc(state.settings.institution_name || 'Dirección de Informática')}</strong><small>${esc(state.settings.institution_area || 'Área Soporte Técnico')}</small></div></div><nav class="nav">${modules.map(m=>`<button data-page="${m[0]}">${m[2]}<span>${m[1]}</span></button>`).join('')}</nav><div class="sidebar-foot"><div>TICKET MANAGER © 2026</div><a class="cafecito" href="https://cafecito.app/fmgambino" rel="noopener" target="_blank"><img src="https://cdn.cafecito.app/imgs/buttons/button_3.png" alt="Invitame un Cafecito"></a></div></aside><main class="main"><section class="topbar"><div><h1 id="pageTitle"></h1><p id="pageDesc"></p></div><div class="actions"><button class="icon-btn" id="themeBtn" title="Cambiar tema">${localStorage.theme==='light'?'🌙':'☀️'}</button><button class="icon-btn" id="fullBtn" title="Pantalla completa">⛶</button><button class="icon-btn" id="notifyBtn" title="Notificaciones">${ico.bell}</button><button class="icon-btn" id="avatarBtn" title="Mi perfil">${ico.profile}</button><span class="user-chip">${esc(state.profile.full_name || state.profile.email)}</span></div></section><section id="content"></section><footer class="footer">TICKET MANAGER © 2026 Tucumán - Argentina<br>by <a href="https://github.com/fmgambino" target="_blank" rel="noopener">Ing. Fernando Gambino</a> · Todos los Derechos Registrados</footer></main></div>`;
  $$('.nav button').forEach(b => b.addEventListener('click', () => route(b.dataset.page)));
  $('#themeBtn').onclick = () => { localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light'; applySettings(); renderShell(); route(state.page); };
  $('#fullBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  $('#notifyBtn').onclick = () => route('notifications');
  $('#avatarBtn').onclick = () => route('profile');
}
async function route(p){
  if (p === 'logout') { await supa.auth.signOut(); window.location.replace('./index.html'); return; }
  state.page = p;
  $$('.nav button').forEach(b => b.classList.toggle('active', b.dataset.page === p));
  if (p === 'dashboard') return renderDashboard();
  if (p === 'orders') return renderOrders();
  if (p === 'settings') return renderSettings();
  if (p === 'profile') return renderProfile();
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
  const rows = data || []; state.rows[key] = rows;
  const columns = c.fields.slice(0, 6);
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>${c.title}</h2><p>Acciones disponibles: ver, editar, eliminar, importar CSV, exportar CSV y PDF A4.</p></div><div class="module-actions"><button class="btn primary" onclick="openForm('${key}')">Nuevo</button><button class="btn" onclick="importCsv('${key}')">Importar CSV</button><button class="btn" onclick="exportCsv('${key}')">Exportar CSV</button><button class="btn" onclick="exportPdf('${key}')">PDF A4</button></div></div><input class="search" placeholder="Buscar en ${c.title}..." oninput="filterRows(this.value)"><div class="table-wrap"><table><thead><tr>${columns.map((f,i)=>`<th>${esc(c.labels[i])}</th>`).join('')}<th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(r=>rowHtml(key,r,columns)).join('')}</tbody></table></div></div>`;
}
function rowHtml(key, r, columns){ return `<tr data-search="${esc(Object.values(r).join(' ').toLowerCase())}">${columns.map(f=>`<td>${fmt(r[f])}</td>`).join('')}<td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewRow('${key}','${r.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openForm('${key}','${r.id}')">${ico.edit}</button><button class="icon-mini danger" title="Eliminar" onclick="deleteRow('${key}','${r.id}')">${ico.trash}</button></td></tr>`; }
window.filterRows = (q) => { q = String(q||'').toLowerCase(); $$('#rowsBody tr').forEach(tr => tr.style.display = tr.dataset.search.includes(q) ? '' : 'none'); };
function inputHtml(id,label,value,type='text'){
  if (typeof value === 'boolean') return `<label>${esc(label)}<select id="f_${id}"><option value="true" ${value?'selected':''}>Sí</option><option value="false" ${!value?'selected':''}>No</option></select></label>`;
  return `<label>${esc(label)}<input id="f_${id}" type="${type}" value="${esc(value ?? '')}"></label>`;
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
  const html = `<div class="swal-grid">${c.fields.map((f,i)=>inputHtml(f,c.labels[i],row?.[f])).join('')}</div>`;
  const { value } = await Swal.fire({ title: id ? `Editar ${c.title}` : `Nuevo ${c.title}`, html, width: 850, showCancelButton:true, confirmButtonText:'Guardar', cancelButtonText:'Cancelar', preConfirm:()=>collect(c.fields) });
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
window.viewRow = (key,id) => { const row=(state.rows[key]||[]).find(x=>x.id===id); Swal.fire({title:'Detalle',html:`<pre class="detail-pre">${esc(JSON.stringify(row,null,2))}</pre>`,width:900}); };
window.deleteRow = async (key,id) => { const c=crud[key]; const ok=await Swal.fire({icon:'warning',title:'¿Eliminar registro?',text:'Esta acción no se puede deshacer.',showCancelButton:true,confirmButtonText:'Eliminar',cancelButtonText:'Cancelar'}); if(!ok.isConfirmed)return; const {error}=await supa.from(c.table).delete().eq('id',id); if(error)return Swal.fire({icon:'error',title:'No se pudo eliminar',text:error.message}); await notify(`Eliminación en ${c.title}`, `${state.profile.full_name} eliminó un registro.`, key, id); route(key); };
async function loadStatuses(){ const {data,error}=await supa.from('service_order_statuses').select('*').order('sort_order'); if(error) console.warn(error.message); state.statuses=data||[]; }
async function renderOrders(){
  page('Órdenes de Servicio','Trazabilidad técnica institucional inspirada en SATMANAGER, sin importes ni conceptos comerciales.');
  await loadStatuses();
  const { data, error } = await supa.from('service_orders').select('*, service_order_statuses(name,color)').order('created_at',{ascending:false});
  if (error) return showPanelError(error);
  const rows = data || []; state.rows.orders = rows;
  $('#content').innerHTML = `<div class="card"><div class="module-head"><div><h2>Órdenes técnicas</h2><p>Registro de ingreso, atención, estados, informe técnico, insumos utilizados, notas y entrega.</p></div><div class="module-actions"><button class="btn primary" onclick="openOrder()">Nueva orden</button><button class="btn" onclick="openStatusManager()">Estados</button><button class="btn" onclick="importCsv('orders')">Importar SATMANAGER CSV</button><button class="btn" onclick="exportCsv('orders')">Exportar CSV</button><button class="btn" onclick="exportPdf('orders')">PDF A4</button></div></div><input class="search" placeholder="Buscar por orden, cliente, oficina, equipo, marca, modelo, serie o falla..." oninput="filterRows(this.value)"><div class="table-wrap"><table><thead><tr><th>Orden</th><th>Ingreso</th><th>Solicitante/Oficina</th><th>Equipo</th><th>Falla</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="rowsBody">${rows.map(orderRow).join('')}</tbody></table></div></div>`;
}
function orderRow(o){ const st=o.service_order_statuses||{}; return `<tr data-search="${esc(Object.values(o).join(' ').toLowerCase())}"><td><b>#${esc(o.satmanager_order || o.order_number)}</b></td><td>${fmt(o.received_at)}</td><td>${esc(o.requester_name||'-')}<br><small>${esc(o.office||'')}</small></td><td>${esc([o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' · '))}</td><td>${esc(o.fault_description||'-')}</td><td><span class="badge" style="color:${esc(st.color||'#94a3b8')}">${esc(st.name||'Sin estado')}</span></td><td class="row-actions"><button class="icon-mini" title="Ver" onclick="viewOrder('${o.id}')">${ico.view}</button><button class="icon-mini" title="Editar" onclick="openOrder('${o.id}')">${ico.edit}</button><button class="icon-mini" title="Ingreso" onclick="printOrder('${o.id}','ingreso')">${ico.print}</button><button class="icon-mini" title="Entrega" onclick="printOrder('${o.id}','entrega')">${ico.print}</button><button class="icon-mini" title="Nota" onclick="makeNote('${o.id}')">✍</button><button class="icon-mini danger" title="Eliminar" onclick="deleteOrder('${o.id}')">${ico.trash}</button></td></tr>`; }
window.openOrder = async (id=null) => {
  await loadStatuses(); const o = id ? (state.rows.orders||[]).find(x=>x.id===id) : {};
  const statusSelect = `<label>Estado<select id="f_status_id">${state.statuses.map(s=>`<option value="${s.id}" ${o?.status_id===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>`;
  const html = `<div class="swal-grid">${statusSelect}${inputHtml('requester_name','Solicitante',o?.requester_name)}${inputHtml('requester_email','Email',o?.requester_email)}${inputHtml('requester_phone','Teléfono',o?.requester_phone)}${inputHtml('office','Oficina/Repartición',o?.office)}${inputHtml('address','Dirección',o?.address)}${inputHtml('equipment_type','Tipo de equipo',o?.equipment_type)}${inputHtml('brand','Marca',o?.brand)}${inputHtml('model','Modelo',o?.model)}${inputHtml('serial_number','N° de serie',o?.serial_number)}<label class="full">Accesorios<textarea id="f_accessories">${esc(o?.accessories||'')}</textarea></label><label class="full">Falla declarada<textarea id="f_fault_description">${esc(o?.fault_description||'')}</textarea></label><label class="full">Informe técnico<textarea id="f_technical_report">${esc(o?.technical_report||'')}</textarea></label><label class="full">Solución / Observaciones<textarea id="f_solution">${esc(o?.solution||'')}</textarea></label></div>`;
  const fields=['status_id','requester_name','requester_email','requester_phone','office','address','equipment_type','brand','model','serial_number','accessories','fault_description','technical_report','solution'];
  const {value}=await Swal.fire({title:id?'Editar orden de servicio':'Nueva orden de servicio',html,width:980,showCancelButton:true,confirmButtonText:'Guardar',cancelButtonText:'Cancelar',preConfirm:()=>collect(fields)});
  if(!value)return;
  try{ value.updated_by=state.user.id; if(!id)value.created_by=state.user.id; if(!value.fault_description)value.fault_description='Sin descripción'; const res=id?await supa.from('service_orders').update(value).eq('id',id):await supa.from('service_orders').insert(value); if(res.error)throw res.error; await notify(id?'Orden actualizada':'Nueva orden de servicio', `${state.profile.full_name} ${id?'actualizó':'registró'} una orden técnica.`, 'orders', id); await Swal.fire({icon:'success',title:'Orden guardada'}); renderOrders(); }catch(e){Swal.fire({icon:'error',title:'No se pudo guardar',text:e.message});}
};
window.openStatusManager = async () => {
  await loadStatuses();
  const list = state.statuses.map(s=>`<div class="status-line"><span class="badge" style="color:${s.color}">${esc(s.name)}</span><button onclick="editStatus('${s.id}')">Editar</button></div>`).join('');
  Swal.fire({title:'Estados de órdenes',html:`<div>${list}</div><hr><button class="btn primary" onclick="editStatus()">Agregar estado</button>`,showConfirmButton:false,showCloseButton:true});
};
window.editStatus = async (id=null) => { const s=id?state.statuses.find(x=>x.id===id):{}; const html=`${inputHtml('name','Nombre',s?.name)}<label>Color<input id="f_color" type="color" value="${s?.color||'#7c5cff'}"></label>${inputHtml('sort_order','Orden',s?.sort_order||0)}${inputHtml('is_final','Estado final',!!s?.is_final)}`; const {value}=await Swal.fire({title:id?'Editar estado':'Nuevo estado',html,showCancelButton:true,preConfirm:()=>collect(['name','color','sort_order','is_final'])}); if(!value)return; value.sort_order=Number(value.sort_order||0); const res=id?await supa.from('service_order_statuses').update(value).eq('id',id):await supa.from('service_order_statuses').insert(value); if(res.error)return Swal.fire({icon:'error',title:'Error',text:res.error.message}); await Swal.fire({icon:'success',title:'Estado guardado'}); renderOrders(); };
window.viewOrder = async (id) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const {data:hist}=await supa.from('service_order_history').select('*').eq('service_order_id',id).order('created_at',{ascending:false}); Swal.fire({title:`Orden #${esc(o.satmanager_order||o.order_number)}`,html:`<pre class="detail-pre">${esc(JSON.stringify(o,null,2))}</pre><h3>Historial</h3><pre class="detail-pre">${esc(JSON.stringify(hist||[],null,2))}</pre>`,width:980}); };
window.deleteOrder = async (id) => { const ok=await Swal.fire({icon:'warning',title:'¿Eliminar orden?',showCancelButton:true,confirmButtonText:'Eliminar'}); if(!ok.isConfirmed)return; const {error}=await supa.from('service_orders').delete().eq('id',id); if(error)return Swal.fire({icon:'error',title:'Error',text:error.message}); renderOrders(); };
window.printOrder = (id,type) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const title=type==='entrega'?'Constancia de entrega de equipo':'Constancia de ingreso de equipo'; const html=`<html><head><title>${title}</title><style>body{font-family:Arial;margin:32px}.rotulo{text-align:center;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:22px}.box{border:1px solid #222;padding:12px;margin:12px 0}h1{font-size:22px}small{color:#444}</style></head><body><div class="rotulo"><h1>Dirección de Informática - Área Soporte Técnico</h1><b>${title}</b><br><small>Fecha y hora: ${new Date().toLocaleString('es-AR')}</small></div><div class="box"><b>Orden:</b> ${esc(o.satmanager_order||o.order_number)} &nbsp; <b>Estado:</b> ${esc(o.service_order_statuses?.name||'')}<br><b>Solicitante:</b> ${esc(o.requester_name||'')}<br><b>Oficina:</b> ${esc(o.office||'')}<br><b>Teléfono:</b> ${esc(o.requester_phone||'')}</div><div class="box"><b>Equipo:</b> ${esc([o.equipment_type,o.brand,o.model].filter(Boolean).join(' · '))}<br><b>N° serie:</b> ${esc(o.serial_number||'')}<br><b>Accesorios:</b> ${esc(o.accessories||'')}</div><div class="box"><b>Falla / Informe:</b><br>${esc(type==='entrega'?(o.technical_report||o.solution||o.fault_description):o.fault_description)}</div><br><br><p>Firma solicitante: ____________________________ &nbsp;&nbsp; Firma técnico: ____________________________</p></body></html>`; const w=window.open('','_blank'); w.document.write(html); w.document.close(); w.print(); };
window.makeNote = async (id) => { const o=(state.rows.orders||[]).find(x=>x.id===id); const draft=`A quien corresponda:\n\nPor medio de la presente se solicita la provisión de insumos necesarios para la Orden de Servicio N° ${o.satmanager_order||o.order_number}, correspondiente al equipo ${[o.equipment_type,o.brand,o.model,o.serial_number].filter(Boolean).join(' / ')} de ${o.office||o.requester_name||'la repartición solicitante'}.\n\nMotivo técnico: ${o.fault_description||'Sin descripción'}.\n\nLa solicitud se realiza a efectos de garantizar la continuidad operativa del soporte técnico institucional.\n\nAtentamente.`; const {value}=await Swal.fire({title:'Nota institucional',html:`<textarea id="noteBody" class="swal2-textarea" style="height:260px">${esc(draft)}</textarea>`,width:900,showCancelButton:true,confirmButtonText:'Guardar nota',preConfirm:()=>$('#noteBody').value}); if(!value)return; const {error}=await supa.from('service_order_notes').insert({service_order_id:id,note_type:'compra',title:'Solicitud de insumos',body:value,created_by:state.user.id}); if(error)return Swal.fire({icon:'error',title:'No se pudo guardar',text:error.message}); Swal.fire({icon:'success',title:'Nota guardada'}); };
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
function mapImport(key,x){ if(key!=='orders')return x; return {satmanager_order:x.Orden||x.order||x.satmanager_order||null, requester_name:x.Cliente||x.requester_name||null, office:x.Oficina||x.office||x.Cliente||null, address:x.Direccion||x.address||null, requester_phone:x.Telefono||x.requester_phone||null, equipment_type:x['Tipo de Equipo']||x.Tipo||x.equipment_type||null, brand:x.Marca||x.brand||null, model:x.Modelo||x.model||null, serial_number:x['Numero de Serie']||x.Serie||x.serial_number||null, accessories:x.Accesorios||null, fault_description:x.Falla||x.fault_description||'Importado desde SATMANAGER', technical_report:x.Informe||x.technical_report||null, source:'SATMANAGER', created_by:state.user.id}; }
window.exportPdf = (key) => { const rows = state.rows[key] || []; const { jsPDF } = window.jspdf || {}; if(!jsPDF)return Swal.fire({icon:'error',title:'jsPDF no cargado'}); const doc = new jsPDF('l','mm','a4'); doc.setFontSize(15); doc.text('TICKET MANAGER - Ministerio de Educación Tucumán',14,14); doc.setFontSize(9); doc.text(`Reporte: ${key} · Fecha y hora: ${new Date().toLocaleString('es-AR')} · Usuario: ${state.profile.full_name}`,14,22); const cols=Object.keys(rows[0]||{}).filter(k=>!String(rows[0]?.[k]).startsWith('[object')).slice(0,8); if(doc.autoTable) doc.autoTable({head:[cols],body:rows.map(r=>cols.map(c=>String(r[c]??''))),startY:30,styles:{fontSize:7}}); else doc.text(JSON.stringify(rows,null,2).slice(0,3000),14,32); doc.save(`reporte_${key}.pdf`); };
function download(name, data, type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href); }
function subscribeRealtime(){ ['profiles','roles','inventory_items','loans','support_tickets','service_orders','notifications','app_settings'].forEach(t=>{ supa.channel('rt_'+t).on('postgres_changes',{event:'*',schema:'public',table:t},payload=>{ if(t==='notifications') toast(payload.new?.title||'Notificación',payload.new?.body||''); }).subscribe(); }); }
function toast(t,b){ const div=document.createElement('div'); div.className='toast-note'; div.innerHTML=`<b>${esc(t)}</b><br><small>${esc(b)}</small>`; document.body.appendChild(div); setTimeout(()=>div.remove(),4500); }
window.route = route;
init().catch(e => { console.error(e); Swal.fire({ icon:'error', title:'Error de inicio', text:e.message || String(e) }).then(()=>{ if(/perfil|session|auth/i.test(e.message||'')) window.location.replace('./index.html'); }); });

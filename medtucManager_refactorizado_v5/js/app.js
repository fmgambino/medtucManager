const icons = {
  dashboard: `<svg viewBox="0 0 24 24" class="icon"><path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-10h8V3h-8v8Z"></path></svg>`,
  users: `<svg viewBox="0 0 24 24" class="icon"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4ZM8 14c-.29 0-.62.02-.97.05C5.7 14.16 2 14.82 2 17v2h4v-1c0-1.46.8-2.68 2.29-3.64A9.79 9.79 0 0 0 8 14Z"></path></svg>`,
  roles: `<svg viewBox="0 0 24 24" class="icon"><path d="m12 1 9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4Zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6c-1.83 0-3.8.93-4 2v1h8v-1c-.2-1.07-2.17-2-4-2Z"></path></svg>`,
  team: `<svg viewBox="0 0 24 24" class="icon"><path d="M16 11c1.66 0 2.99-1.79 2.99-4S17.66 3 16 3s-3 1.79-3 4 1.34 4 3 4Zm-8 0c1.66 0 2.99-1.79 2.99-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.95 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z"></path></svg>`,
  inventory: `<svg viewBox="0 0 24 24" class="icon"><path d="M21 16V8l-9-5-9 5v8l9 5 9-5Zm-9 2.7-6-3.33V9.3l6 3.33 6-3.33v6.07l-6 3.33Zm0-8.37L6.04 7 12 3.7 17.96 7 12 10.33Z"></path></svg>`,
  courses: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-7 9.18V17l7 4 7-4v-4.82l-7 3.82-7-3.82Z"></path></svg>`,
  library: `<svg viewBox="0 0 24 24" class="icon"><path d="M18 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10v-2H8V4h10V2Zm-3 4h5a1 1 0 0 1 1 1v15l-3-2-3 2V7a1 1 0 0 1 1-1Z"></path></svg>`,
  notifications: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2Z"></path></svg>`,
  profile: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4Z"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" class="icon"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.16 7.16 0 0 0-1.63-.94l-.36-2.54a.49.49 0 0 0-.49-.42h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.53-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.51.41 1.05.72 1.63.94l.36 2.54c.05.24.25.42.49.42h3.84c.24 0 .44-.18.49-.42l.36-2.54c.58-.22 1.12-.53 1.63-.94l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"></path></svg>`,
  logout: `<svg viewBox="0 0 24 24" class="icon"><path d="M10 17v-3H3v-4h7V7l5 5-5 5Zm4-14h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5v-2h5V5h-5V3Z"></path></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" class="icon"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 5c5.05 0 9.27 3.11 11 7-1.73 3.89-5.95 7-11 7S2.73 15.89 1 12c1.73-3.89 5.95-7 11-7Zm0 2C8.36 7 5.17 9.06 3.33 12 5.17 14.94 8.36 17 12 17s6.83-2.06 8.67-5C18.83 9.06 15.64 7 12 7Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"></path></svg>`,
  edit: `<svg viewBox="0 0 24 24" class="icon"><path d="m3 17.25 9.81-9.81 3.75 3.75L6.75 21H3v-3.75ZM14.87 5.38l1.77-1.77a1.5 1.5 0 0 1 2.12 0l1.63 1.63a1.5 1.5 0 0 1 0 2.12l-1.77 1.77-3.75-3.75Z"></path></svg>`,
  trash: `<svg viewBox="0 0 24 24" class="icon"><path d="M6 7h12l-1 14H7L6 7Zm3-4h6l1 2h4v2H4V5h4l1-2Z"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" class="icon"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"></path></svg>`,
  import: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h1ZM5 19h14v2H5v-2Z"></path></svg>`,
  export: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 21V10.83l-3.59 3.58L7 13l5-5 5 5-1.41 1.41L13 10.83V21h-1ZM5 3h14v2H5V3Z"></path></svg>`,
  barcode: `<svg viewBox="0 0 24 24" class="icon"><path d="M4 5h1v14H4V5Zm3 0h2v14H7V5Zm4 0h1v14h-1V5Zm3 0h3v14h-3V5Zm5 0h1v14h-1V5Z"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24" class="icon"><path d="M4 19h16v2H4zM7 10h2v7H7zm4-4h2v11h-2zm4 6h2v5h-2z"></path></svg>`,
  filter: `<svg viewBox="0 0 24 24" class="icon"><path d="M3 5h18v2l-7 7v5l-4 2v-7L3 7V5Z"></path></svg>`,
  access: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 2a7 7 0 0 0-7 7v3H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V9a7 7 0 0 0-7-7Zm5 10H7V9a5 5 0 0 1 10 0v3Zm-5 2a2 2 0 0 1 1 3.73V19h-2v-1.27A2 2 0 0 1 12 14Z"></path></svg>`,
  approve: `<svg viewBox="0 0 24 24" class="icon"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path></svg>`,
  reject: `<svg viewBox="0 0 24 24" class="icon"><path d="m18.3 5.71-1.41-1.41L12 9.17 7.11 4.3 5.7 5.71 10.59 10.6 5.7 15.49l1.41 1.41L12 12.01l4.89 4.89 1.41-1.41-4.89-4.89z"></path></svg>`,
  returnIcon: `<svg viewBox="0 0 24 24" class="icon"><path d="M19 7v4h-4l1.4-1.4-2.9-2.9a3 3 0 0 0-4.2 0L4 12l1.4 1.4 5.3-5.3a1 1 0 0 1 1.4 0l2.9 2.9L13 13h6V7zM5 17v-4h4l-1.4 1.4 2.9 2.9a3 3 0 0 0 4.2 0L20 12l-1.4-1.4-5.3 5.3a1 1 0 0 1-1.4 0l-2.9-2.9L11 11H5v6z"></path></svg>`
};

const demoUser = JSON.parse(localStorage.getItem('ism_demo_user') || 'null') || {
  name: 'Administrador General', role: 'administrator', email: 'admin@ism.edu.ar', avatar_url: './assets/avatar-default.svg'
};

const DEFAULT_PERMISSIONS = [
  'dashboard.read', 'users.read', 'users.manage', 'roles.read', 'roles.manage', 'teams.read', 'teams.manage',
  'inventory.read', 'inventory.manage', 'inventory.loan', 'inventory.approve', 'inventory.create', 'inventory.update', 'inventory.delete',
  'loan.read', 'loan.create', 'loans.manage', 'loan.manage', 'loan.approve', 'loan.return', 'notifications.read', 'notifications.send',
  'courses.read', 'courses.manage', 'modules.read', 'modules.manage', 'lessons.read', 'lessons.manage',
  'library.read', 'library.manage', 'access.read', 'access.manage', 'settings.read', 'settings.manage'
];

const state = {
  user: demoUser,
  currentView: 'dashboard',
  charts: [],
  inventoryPage: 1,
  inventoryPageSize: 10,
  selectedInventoryIds: new Set(),
  inventoryConditions: [
    { name: 'Nuevo', color: '#3b82f6' },
    { name: 'Usado', color: '#6366f1' },
    { name: 'Reparado', color: '#22c55e' },
    { name: 'Falta piezas', color: '#f59e0b' },
    { name: 'Defectuoso', color: '#ef4444' },
    { name: 'Usado, completo', color: '#8b5cf6' },
    { name: 'Usado, completo, faltantes', color: '#f97316' }
  ],
  filters: { period: 'month', inventoryState: 'all', inventoryType: 'all', inventorySearch: '', userSearch: '', userRole: 'all' },
  notificationsOpen: false,
  notificationsPage: 1,
  notificationsPageSize: 10,
  users: [
    { id: 1, name: 'Fernando Gambino', role: 'Administrador', email: 'fgambino@ism.edu.ar', whatsapp: '+54 9 11 5555 1111', dni: '30111222', status: 'Activo' },
    { id: 2, name: 'María López', role: 'Docente', email: 'mlopez@ism.edu.ar', whatsapp: '+54 9 11 4444 2222', dni: '28999888', status: 'Activo' },
    { id: 3, name: 'Lucas Méndez', role: 'Docente', email: 'lmendez@ism.edu.ar', whatsapp: '+54 9 11 4000 1000', dni: '29666777', status: 'Activo' },
    { id: 4, name: 'Thiago Benjamín Luna', role: 'Alumno', email: 'thiago.luna@ism.edu.ar', whatsapp: '+54 9 11 3333 1111', dni: '49442589', status: 'Pendiente' },
    { id: 5, name: 'Tomás Cáceres', role: 'Alumno', email: 'tcaceres@ism.edu.ar', whatsapp: '+54 9 11 2222 7777', dni: '48205464', status: 'Activo' }
  ],
  rolesData: [
    { id: 'administrator', code: 'administrator', name: 'Administrador', description: 'Control total del sistema', permissions: ['users.read','users.manage','roles.manage','inventory.read','inventory.manage','inventory.loan','inventory.approve'] },
    { id: 'teacher', code: 'teacher', name: 'Docente', description: 'Gestiona módulos, equipos e inventario asignado', permissions: ['users.read','inventory.read','inventory.loan','inventory.approve'] },
    { id: 'student', code: 'student', name: 'Alumno', description: 'Consulta contenido, préstamos y notificaciones', permissions: ['inventory.read','inventory.loan'] }
  ],
  teams: [
    { id: 1, name: 'Equipo Rover A', teachers: ['María López', 'Lucas Méndez'], students: 8, courses: ['6° C', '6° B'], divisions: ['C', 'B'], project: 'Rover autónomo' },
    { id: 2, name: 'Equipo AeroLab', teachers: ['María López'], students: 6, courses: ['5° A'], divisions: ['A'], project: 'Drones educativos' },
    { id: 3, name: 'Equipo Maker Mix', teachers: ['Lucas Méndez', 'María López'], students: 10, courses: ['4° A', '5° B', '6° C'], divisions: ['A', 'B', 'C'], project: 'IoT y automatización' }
  ],
  inventory: [
    { id: 1, code: 'AR000322', item: 'Kit Prog. de las Cosas', type: 'Equipo', serial: 'KIT-ISM-322', barcode: 'ISM-AR000322', status: 'Disponible', condition: 'Usado, completo', assignedTo: 'Depósito', requestedAt: '-', returnedAt: '-', teacher: '-', location: 'Armario A1' },
    { id: 2, code: 'AR000311', item: 'Kit Prog. de las Cosas', type: 'Equipo', serial: 'KIT-ISM-311', barcode: 'ISM-AR000311', status: 'Prestado', condition: 'Usado, dañado, falta piezas', assignedTo: 'Equipo Rover A', requestedAt: '2026-04-14 10:00', returnedAt: '-', teacher: 'María López', location: 'Taller revisión' },
    { id: 3, code: 'AR000362', item: 'Kit Prog. de las Cosas', type: 'Equipo', serial: '', barcode: 'ISM-BAR-000362', status: 'Disponible', condition: 'Nuevo', assignedTo: 'Depósito', requestedAt: '-', returnedAt: '-', teacher: '-', location: 'Depósito' },
    { id: 4, code: 'SEN-0021', item: 'Sensor ultrasónico', type: 'Insumo', serial: '', barcode: 'ISM-BAR-0021', status: 'Disponible', condition: 'Nuevo', assignedTo: 'Depósito', requestedAt: '-', returnedAt: '-', teacher: '-', location: 'Gaveta S2' },
    { id: 5, code: 'ROB-0098', item: 'Placa Arduino UNO', type: 'Equipo', serial: 'ARD-U-0098', barcode: 'ISM-ROB-0098', status: 'En mantenimiento', condition: 'Revisión', assignedTo: 'Laboratorio', requestedAt: '2026-04-10 09:30', returnedAt: '2026-04-12 13:20', teacher: 'Lucas Méndez', location: 'Mesa técnica' }
  ],
  modules: [
    { id: 1, title: 'Electrónica aplicada', teacher: 'María López', status: 'Publicado', lessons: 8, tasks: 4, evaluations: 2, visibility: 'Solo equipos asignados', code: 'ELEC-ISM-26', accessKey: 'robotica26', enrolled: ['Thiago Benjamín Luna'], team: 'Equipo Rover A' },
    { id: 2, title: 'Programación de robots', teacher: 'Lucas Méndez', status: 'Borrador', lessons: 5, tasks: 3, evaluations: 1, visibility: 'Visible para todos', code: 'PROG-ROB-26', accessKey: 'motores', enrolled: ['Tomás Cáceres'], team: 'Equipo Maker Mix' },
    { id: 3, title: 'Diseño e impresión 3D', teacher: 'María López', status: 'Publicado', lessons: 6, tasks: 2, evaluations: 1, visibility: 'Visible para todos', code: 'IMP3D-26', accessKey: 'makerlab', enrolled: [], team: 'Abierto' }
  ],
  studentCourses: [
    { id: 1, title: 'Electrónica aplicada', teacher: 'María López', team: 'Equipo Rover A', progress: 68, lessons: 8, tasks: 4, evaluations: 2, access: 'Incripto', visibility: 'Equipo asignado' },
    { id: 2, title: 'Diseño e impresión 3D', teacher: 'María López', team: 'Abierto', progress: 0, lessons: 6, tasks: 2, evaluations: 1, access: 'Disponible con código', visibility: 'Visible para todos' }
  ],
  library: [
    { id: 1, title: 'Manual Arduino ISM', type: 'PDF', area: 'Electrónica' },
    { id: 2, title: 'Guía Diseño 3D', type: 'PDF', area: 'Fabricación digital' },
    { id: 3, title: 'Seguridad del laboratorio', type: 'Video', area: 'Normas' }
  ],
  notifications: [
    { id: 1, title: 'Préstamo vencido', message: 'El kit AR000311 debía devolverse hoy a las 16:00.', unread: true, section: 'inventory' },
    { id: 2, title: 'Ingreso de inventario', message: 'Se registraron 6 sensores ultrasónicos nuevos.', unread: true, section: 'inventory' },
    { id: 3, title: 'Evaluativo publicado', message: 'Electrónica aplicada tiene un nuevo evaluativo.', unread: false, section: 'courses' },
    { id: 4, title: 'Equipo mixto actualizado', message: 'Equipo Maker Mix ahora tiene dos docentes asignados.', unread: true, section: 'team' }
  ],
  audit: [
    { date: 'Abr 10', loans: 2, returns: 1, issues: 0 },
    { date: 'Abr 11', loans: 4, returns: 2, issues: 1 },
    { date: 'Abr 12', loans: 3, returns: 3, issues: 0 },
    { date: 'Abr 13', loans: 5, returns: 2, issues: 2 },
    { date: 'Abr 14', loans: 6, returns: 3, issues: 1 },
    { date: 'Abr 15', loans: 4, returns: 5, issues: 0 }
  ],
  loans: [
    { id: 1, requester: 'María López', team: 'Equipo Rover A / 6°C', date: '2026-04-16', from: '08:00', to: '11:20', items: ['AR000322','SEN-0021'], notes: 'Práctica de sensores', status: 'Pendiente' },
    { id: 2, requester: 'Lucas Méndez', team: 'Maker Mix / 5°B', date: '2026-04-15', from: '13:00', to: '16:00', items: ['ROB-0098'], notes: 'Clase de programación', status: 'Aprobado' },
    { id: 3, requester: 'María López', team: 'AeroLab / 5°A', date: '2026-04-14', from: '09:00', to: '10:30', items: ['AR000311'], notes: 'Devuelto con revisión', status: 'Devuelto' }
  ],
  accessLogs: [
    { id: 1, user: 'Thiago Benjamín Luna', role: 'Alumno', card: 'RFID-1001', category: 'Alumno', room: 'Lab. Robótica', entry: '2026-04-15 07:58', exit: '2026-04-15 10:02', inside: false },
    { id: 2, user: 'Tomás Cáceres', role: 'Alumno', card: 'RFID-1002', category: 'Alumno', room: 'Lab. Robótica', entry: '2026-04-15 08:02', exit: '-', inside: true },
    { id: 3, user: 'María López', role: 'Docente', card: 'RFID-2001', category: 'Docente', room: 'Sala Informática', entry: '2026-04-15 07:40', exit: '-', inside: true }
  ],
  currentCourseScreen: 'list',
  selectedStudentCourse: null,
  courseContentTab: 'lesson'
};

const roleViews = {
  administrator: ['dashboard', 'users', 'roles', 'team', 'inventory', 'loanManagement', 'accessControl', 'courses', 'library', 'notifications', 'profile', 'settings'],
  teacher: ['dashboard', 'team', 'inventory', 'loanManagement', 'courses', 'library', 'notifications', 'profile'],
  student: ['dashboard', 'loanManagement', 'courses', 'library', 'notifications', 'profile']
};

const baseLabels = {
  administrator: {
    dashboard: ['Dashboard', 'Vista general con métricas, filtros y gráficos del laboratorio'],
    users: ['Usuarios', 'ABM con roles, permisos y perfil extendido'],
    roles: ['Roles y permisos', 'Perfiles, permisos por módulo y alcance'],
    team: ['Equipos', 'Equipos mixtos con múltiples docentes y cursos/divisiones'],
    inventory: ['Inventario', 'Trazabilidad por serie o código de barras, préstamos y devoluciones'],
    loanManagement: ['Gestión de préstamos', 'Solicitudes, aprobaciones, devoluciones y seguimiento horario'],
    accessControl: ['Control de acceso', 'Historial RFID, permanencia, personas dentro y acciones de gestión'],
    courses: ['Campus docente', 'Módulos, lecciones, tareas y evaluativos'],
    library: ['Biblioteca digital', 'Recursos del laboratorio disponibles para consulta'],
    notifications: ['Notificaciones', 'Avisos masivos, individuales y por equipo'],
    profile: ['Mi perfil', 'Ver y editar datos personales y foto'],
    settings: ['Configuraciones', 'Parámetros globales del sistema y branding institucional']
  },
  teacher: {
    dashboard: ['Dashboard docente', 'Resumen de equipos, clases, inventario solicitado y actividad reciente'],
    team: ['Equipos asignados', 'Equipos mixtos, cursos y divisiones a cargo'],
    inventory: ['Inventario', 'Solicitud de préstamo, estado de insumos y seguimiento de devoluciones'],
    loanManagement: ['Gestión de préstamos', 'Tus solicitudes, estados y devoluciones'],
    courses: ['Campus docente', 'Tus cursos, módulos, lecciones, tareas y evaluativos'],
    library: ['Biblioteca digital', 'Recursos para tus clases y laboratorios'],
    notifications: ['Notificaciones', 'Avisos recibidos y envío a equipos asignados'],
    profile: ['Mi perfil', 'Datos del docente y foto de perfil']
  },
  student: {
    dashboard: ['Dashboard alumno', 'Cursos inscriptos, tareas pendientes y actividad reciente'],
    loanManagement: ['Gestión de préstamos', 'Tus solicitudes, estados y devoluciones'],
    courses: ['Campus alumno', 'Cursos inscriptos y cursos disponibles con código de acceso'],
    library: ['Biblioteca digital', 'Material de consulta disponible'],
    notifications: ['Notificaciones', 'Avisos académicos y del laboratorio'],
    profile: ['Mi perfil', 'Datos personales y seguimiento académico']
  }
};

const nav = [
  { key: 'dashboard', icon: 'dashboard', label: { administrator: 'Dashboard', teacher: 'Dashboard', student: 'Dashboard' } },
  { key: 'users', icon: 'users', label: { administrator: 'Usuarios' } },
  { key: 'roles', icon: 'roles', label: { administrator: 'Roles y permisos' } },
  { key: 'team', icon: 'team', label: { administrator: 'Equipos', teacher: 'Equipos' } },
  { key: 'inventory', icon: 'inventory', label: { administrator: 'Inventario', teacher: 'Inventario' } },
  { key: 'loanManagement', icon: 'loan', label: { administrator: 'Gestión de préstamos', teacher: 'Gestión de préstamos', student: 'Gestión de préstamos' } },
  { key: 'accessControl', icon: 'access', label: { administrator: 'Control de acceso' } },
  { key: 'courses', icon: 'courses', label: { administrator: 'Campus docente', teacher: 'Campus docente', student: 'Campus alumno' } },
  { key: 'library', icon: 'library', label: { administrator: 'Biblioteca digital', teacher: 'Biblioteca digital', student: 'Biblioteca digital' } },
  { key: 'notifications', icon: 'notifications', label: { administrator: 'Notificaciones', teacher: 'Notificaciones', student: 'Notificaciones' } },
  { key: 'profile', icon: 'profile', label: { administrator: 'Mi perfil', teacher: 'Mi perfil', student: 'Mi perfil' } },
  { key: 'settings', icon: 'settings', label: { administrator: 'Configuraciones' } }
];

const appContent = document.getElementById('appContent');
const navMenu = document.getElementById('navMenu');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const appShell = document.getElementById('appShell');
const notificationsPreview = document.getElementById('notificationsPreview');
const notificationsBtn = document.getElementById('notificationsBtn');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function escapeAttr(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }

function normalizeBarcodeValue(value) {
  const raw = String(value || '').trim();
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 6 ? digits : (raw || '000001');
}
function ean13CheckDigit(first12) {
  const d = String(first12).replace(/\D/g, '').padStart(12, '0').slice(0, 12).split('').map(Number);
  const sum = d.reduce((a, n, i) => a + n * (i % 2 ? 3 : 1), 0);
  return String((10 - (sum % 10)) % 10);
}
function toScannerBarcode(value) {
  let v = normalizeBarcodeValue(value);
  if (/^\d+$/.test(v)) {
    if (v.length < 12) v = v.padStart(12, '0');
    if (v.length === 12) v += ean13CheckDigit(v);
    if (v.length > 13) v = v.slice(-13);
  }
  return v;
}
function code128Modules(value) {
  const patterns = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
  const text = toScannerBarcode(value);
  const useC = /^\d+$/.test(text) && text.length % 2 === 0;
  const values = useC ? [105] : [104];
  if (useC) {
    for (let i=0;i<text.length;i+=2) values.push(Number(text.slice(i,i+2)));
  } else {
    for (const ch of text) values.push(Math.max(0, Math.min(95, ch.charCodeAt(0) - 32)));
  }
  let checksum = values[0];
  for (let i=1;i<values.length;i++) checksum += values[i] * i;
  values.push(checksum % 103, 106);
  return { text, patterns: values.map(v => patterns[v]) };
}
function barcodePatternSvg(value, opts = {}) {
  const { text, patterns } = code128Modules(value);
  const moduleW = Number(opts.moduleW || 2);
  const height = Number(opts.height || 72);
  const quiet = Number(opts.quiet || 18);
  let x = quiet;
  const bars = [];
  for (const pat of patterns) {
    for (let i = 0; i < pat.length; i++) {
      const w = Number(pat[i]) * moduleW;
      if (i % 2 === 0) bars.push(`<rect x="${x}" y="8" width="${w}" height="${height-20}" fill="#000" shape-rendering="crispEdges"/>`);
      x += w;
    }
  }
  const vb = x + quiet;
  return `<svg class="barcode-svg code128-svg" viewBox="0 0 ${vb} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Code 128 ${escapeAttr(text)}" xmlns="http://www.w3.org/2000/svg"><rect class="barcode-bg" width="100%" height="100%" fill="#fff"/>${bars.join('')}</svg>`;
}
function barcodePreviewMarkup(value, small = false) {
  const code = toScannerBarcode(value || '000001');
  return `<div class="barcode-visual ${small ? 'barcode-visual-sm' : ''}">${barcodePatternSvg(code, {height: small ? 56 : 72})}<strong>${escapeHtml(code)}</strong></div>`;
}

function conditionList(value) { return String(value || 'Sin condición').split(/[;,|]/).map(x => x.trim()).filter(Boolean); }
function conditionPill(value) { return conditionList(value).map(name => { const found = (state.inventoryConditions || []).find(c => c.name.toLowerCase() === name.toLowerCase()); const color = found?.color || '#64748b'; return `<span class="condition-pill" style="--cond:${escapeAttr(color)}"><i></i>${escapeHtml(name)}</span>`; }).join(' '); }
function notificationSender(n) { return n.sender_name || n.sender || n.created_by_name || n.from || 'Sistema'; }
function notificationMessage(n) { return `De: ${escapeHtml(notificationSender(n))} — ${escapeHtml(n.message || '')}`; }
function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}
function notificationMeta(n) {
  const parts = [`Recibida: ${formatDateTime(n.created_at)}`];
  if (!n.unread && n.read_at) parts.push(`Leída: ${formatDateTime(n.read_at)}`);
  if (isCurrentAdmin() && (n.recipient_name || n.recipient_role)) parts.push(`Destinatario: ${escapeHtml(n.recipient_name || '-')} ${n.recipient_role ? '(' + escapeHtml(n.recipient_role) + ')' : ''}`);
  return parts.join(' · ');
}
function upsertLocalCondition(name, color) {
  const n = String(name || '').trim().replace(/\s+/g, ' ');
  if (!n) return null;
  const cleanColor = /^#[0-9a-f]{6}$/i.test(String(color || '').trim()) ? String(color).trim() : '#64748b';
  const found = (state.inventoryConditions || []).find(c => String(c.name || '').toLowerCase() === n.toLowerCase());
  if (found) { found.name = n; found.color = cleanColor; return found; }
  const row = { id: n, name: n, color: cleanColor };
  state.inventoryConditions.push(row);
  state.inventoryConditions.sort((a,b) => String(a.name).localeCompare(String(b.name), 'es'));
  return row;
}
function addLocalCondition(name, color) { return upsertLocalCondition(name, color); }

function debounce(fn, wait = 280) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
function safeText(value, fallback='-') { const v = String(value ?? '').trim(); return v || fallback; }

function getRoleLabels() {
  return baseLabels[state.user.role] || baseLabels.administrator;
}

function getVisibleViews() {
  return roleViews[state.user.role] || roleViews.administrator;
}

function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  localStorage.setItem('ism_theme', theme);
}

function applySavedTheme() {
  setTheme(localStorage.getItem('ism_theme') || 'dark');
}

function unreadCount() {
  return state.notifications.filter(n => n.unread).length;
}

function updateHeader() {
  const labels = getRoleLabels();
  const [title, subtitle] = labels[state.currentView] || labels.dashboard;
  pageTitle.textContent = title;
  pageSubtitle.textContent = subtitle;
  document.getElementById('headerUserName').textContent = state.user.name;
  document.getElementById('headerAvatar').src = state.user.avatar_url || './assets/avatar-default.svg';
  notificationsBtn.innerHTML = `${icons.notifications}<span class="badge-dot">${unreadCount()}</span>`;
  document.getElementById('fullscreenBtn').innerHTML = icons.fullscreen;
  document.getElementById('headerLogoutBtn').innerHTML = icons.logout;
}

function renderNav() {
  const allowed = getVisibleViews();
  navMenu.innerHTML = nav
    .filter(item => allowed.includes(item.key))
    .map(item => `
      <button class="nav-item ${state.currentView === item.key ? 'active' : ''}" data-view="${item.key}">
        ${icons[item.icon]}<span>${item.label[state.user.role] || item.label.administrator || item.key}</span>
      </button>
    `).join('') + `
      <button class="nav-item" id="sidebarLogoutBtn">${icons.logout}<span>Cerrar sesión</span></button>
    `;
}

function showToast(title, text = '', icon = 'success') {
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
  Swal.fire({
    toast: true,
    position: isMobile ? 'bottom' : 'top-end',
    timer: 2600,
    timerProgressBar: true,
    showConfirmButton: false,
    icon,
    title,
    text,
    background: getComputedStyle(document.documentElement).getPropertyValue('--panel'),
    color: getComputedStyle(document.documentElement).getPropertyValue('--text'),
    customClass: { popup: 'app-toast-popup' },
    didOpen: (toast) => {
      toast.style.zIndex = '2147483647';
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}


function statusPill(status) {
  const map = {
    'Activo': 'status-approved', 'Pendiente': 'status-pending', 'Disponible': 'status-approved',
    'Prestado': 'status-pending', 'En mantenimiento': 'status-rejected', 'Publicado': 'status-approved',
    'Borrador': 'status-pending', 'Inscripto': 'status-approved', 'Disponible con código': 'status-pending',
    'Aprobado': 'status-approved', 'Rechazado': 'status-rejected', 'Devuelto': 'status-info',
    'Dentro': 'status-approved', 'Fuera': 'status-rejected'
  };
  return `<span class="status-pill ${map[status] || 'status-pending'}">${status}</span>`;
}

function isDemoMode() {
  return !window.sb?.enabled;
}

function actionButtons(type = "", id = "") {
  const demo = isDemoMode();
  const inventoryRestricted = type === "inventory" && state.user.role !== "administrator";
    const locked = (demo || inventoryRestricted) ? "disabled aria-disabled=\"true\" data-demo-disabled=\"1\"" : "";
  const editTitle = demo ? "Acción deshabilitada en demo" : (inventoryRestricted ? "Solo administrador puede editar insumos" : "Editar");
  const deleteTitle = demo ? "Acción deshabilitada en demo" : (inventoryRestricted ? "Solo administrador puede eliminar insumos" : "Eliminar");
  return `<div class="actions">
    <button class="action-btn" data-action="view" data-type="${type}" data-id="${id}" title="Ver">${icons.eye}</button>
    ${type === 'inventory' ? `<button class="action-btn" data-action="duplicate" data-type="${type}" data-id="${id}" ${locked} title="Duplicar insumo/equipo">${icons.copy}</button>` : ''}
    <button class="action-btn" data-action="edit" data-type="${type}" data-id="${id}" ${locked} title="${editTitle}">${icons.edit}</button>
    <button class="action-btn" data-action="delete" data-type="${type}" data-id="${id}" ${locked} title="${deleteTitle}">${icons.trash}</button>
  </div>`;
}
function currentTeacherModules() {
  return state.modules.filter(mod => state.user.role !== 'teacher' || mod.teacher === state.user.name);
}

function renderDashboard() {
  if (state.user.role === 'teacher') {
    const myModules = currentTeacherModules();
    const myLoans = state.inventory.filter(i => i.teacher === state.user.name).length;
    return `
      <section class="grid-cards grid-cards-4">
        <article class="card glass"><p>Equipos</p><div class="kpi">${state.teams.filter(t => t.teachers.includes(state.user.name)).length}</div><small>Equipos a cargo y mixtos.</small></article>
        <article class="card glass"><p>Cursos</p><div class="kpi">${myModules.length}</div><small>Módulos y cursos gestionados.</small></article>
        <article class="card glass"><p>Préstamos</p><div class="kpi">${myLoans}</div><small>Insumos solicitados o asignados.</small></article>
        <article class="card glass"><p>Notificaciones</p><div class="kpi">${unreadCount()}</div><small>Avisos pendientes de lectura.</small></article>
      </section>
      <section class="layout-two">
        <article class="card glass">
          <div class="section-header"><h3>Resumen docente</h3><button class="btn btn-primary btn-sm" data-view-btn="courses">Abrir campus</button></div>
          <div class="list-simple">
            ${myModules.map(mod => `<div class="list-item"><strong>${mod.title}</strong><span>${mod.lessons} lecciones · ${mod.tasks} tareas · ${mod.evaluations} evaluativos</span></div>`).join('')}
          </div>
        </article>
        <article class="card glass">
          <div class="section-header"><h3>Alertas</h3><button class="btn btn-secondary btn-sm" data-view-btn="notifications">Ver todas</button></div>
          <div class="list-simple">
            ${state.notifications.slice(0,3).map(n => `<button class="notification-row list-item notification-select" data-id="${n.id}"><div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span></div>${n.unread ? '<span class="status-pill status-pending">Sin leer</span>' : '<span class="status-pill status-approved">Leída</span>'}</button>`).join('')}
          </div>
        </article>
      </section>`;
  }

  if (state.user.role === 'student') {
    return `
      <section class="grid-cards grid-cards-4">
        <article class="card glass"><p>Cursos inscriptos</p><div class="kpi">${state.studentCourses.filter(c => c.access === 'Incripto').length}</div><small>Accesos activos en tu campus.</small></article>
        <article class="card glass"><p>Tareas</p><div class="kpi">6</div><small>Actividades pendientes esta semana.</small></article>
        <article class="card glass"><p>Evaluativos</p><div class="kpi">2</div><small>Instancias próximas de evaluación.</small></article>
        <article class="card glass"><p>Notificaciones</p><div class="kpi">${unreadCount()}</div><small>Avisos del laboratorio y docentes.</small></article>
        <article class="card glass"><p>Equipo de robótica</p><div class="kpi">1</div><small>Equipo Rover A · docente María López.</small></article>
      </section>
      <section class="layout-two">
        <article class="card glass">
          <div class="section-header"><h3>Mis cursos</h3><button class="btn btn-primary btn-sm" data-view-btn="courses">Abrir campus alumno</button></div>
          <div class="list-simple">
            ${state.studentCourses.map(course => `<div class="list-item"><strong>${course.title}</strong><span>${course.teacher} · Progreso ${course.progress}%</span></div>`).join('')}
          </div>
        </article>
        <article class="card glass"><div class="section-header"><h3>Biblioteca y avisos</h3></div><div class="list-simple"><div class="list-item"><strong>Material recomendado</strong><span>Manual Arduino ISM y guía de seguridad.</span></div><div class="list-item"><strong>Acceso a cursos abiertos</strong><span>Podés sumarte con código de curso y clave.</span></div></div></article>
      </section>`;
  }

  const totalUsers = state.users.length;
  const totalTeams = state.teams.length;
  const totalInventory = state.inventory.length;
  const openLoans = state.inventory.filter(i => i.status === 'Prestado').length;

  return `
    <section class="grid-cards grid-cards-4">
      <article class="card glass"><p>Usuarios</p><div class="kpi">${totalUsers}</div><small>Administradores, docentes y alumnos.</small></article>
      <article class="card glass"><p>Equipos</p><div class="kpi">${totalTeams}</div><small>Equipos mixtos con múltiples docentes.</small></article>
      <article class="card glass"><p>Inventario</p><div class="kpi">${totalInventory}</div><small>Activos serializados e insumos.</small></article>
      <article class="card glass"><p>Préstamos abiertos</p><div class="kpi">${openLoans}</div><small>Con seguimiento y devolución pendiente.</small></article>
    </section>

    <section class="card glass dashboard-panel">
      <div class="section-header">
        <div>
          <h3>Dashboard principal del administrador</h3>
          <p class="muted">Filtros globales y gráficos estadísticos con Chart.js.</p>
        </div>
        <div class="toolbar">
          <select id="periodFilter">
            <option value="week" ${state.filters.period === 'week' ? 'selected' : ''}>Última semana</option>
            <option value="month" ${state.filters.period === 'month' ? 'selected' : ''}>Último mes</option>
            <option value="quarter" ${state.filters.period === 'quarter' ? 'selected' : ''}>Último trimestre</option>
          </select>
          <button class="btn btn-secondary btn-sm" data-export="dashboard">${icons.export} Exportar resumen</button>
        </div>
      </div>
      <div class="charts-grid">
        <article class="chart-card glass-soft"><div class="chart-head"><strong>Movimientos del inventario</strong><span>Línea</span></div><canvas id="loansLineChart"></canvas></article>
        <article class="chart-card glass-soft"><div class="chart-head"><strong>Usuarios por rol</strong><span>Torta</span></div><canvas id="rolesPieChart"></canvas></article>
        <article class="chart-card glass-soft"><div class="chart-head"><strong>Estado del inventario</strong><span>Barras</span></div><canvas id="inventoryBarChart"></canvas></article>
      </div>
    </section>

    <section class="layout-two">
      <article class="card glass">
        <div class="section-header"><h3>Resumen operativo</h3><span class="tag">Módulos</span></div>
        <div class="list-simple">
          <div class="list-item"><strong>ABM de usuarios</strong><span>Alta, baja y modificación con roles, permisos y perfiles.</span></div>
          <div class="list-item"><strong>Campus E-learning</strong><span>Docentes crean cursos y alumnos acceden con inscripción o código de acceso.</span></div>
          <div class="list-item"><strong>Inventario inteligente</strong><span>Trazabilidad por serie o código de barras, préstamos y devoluciones.</span></div>
        </div>
      </article>
      <article class="card glass">
        <div class="section-header"><h3>Alertas del día</h3><button class="btn btn-secondary btn-sm" data-view-btn="notifications">Ver todas</button></div>
        <div class="list-simple">
          ${state.notifications.slice(0,3).map(n => `<button class="notification-row list-item notification-select" data-id="${n.id}"><div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span></div>${n.unread ? '<span class="status-pill status-pending">Sin leer</span>' : '<span class="status-pill status-approved">Leída</span>'}</button>`).join('')}
        </div>
      </article>
    </section>

    <section class="card glass">
      <div class="section-header"><div><h3>Inventario destacado</h3><p class="muted">Basado en la planilla de control adjunta.</p></div><button class="btn btn-primary btn-sm" data-view-btn="inventory">Abrir módulo</button></div>
      <div class="inventory-highlight">
        ${state.inventory.slice(0,3).map(item => `<article class="mini-card glass-soft"><strong>${item.code}</strong><h4>${item.item}</h4><p>${item.type} · ${item.location}</p><div class="metric-inline"><span>${item.serial || item.barcode}</span>${statusPill(item.status)}</div></article>`).join('')}
      </div>
    </section>`;
}

function getFilteredUsers() {
  return state.users.filter(user => {
    const matchesSearch = `${user.name} ${user.email} ${user.dni}`.toLowerCase().includes(state.filters.userSearch.toLowerCase());
    const matchesRole = state.filters.userRole === 'all' || user.role === state.filters.userRole;
    return matchesSearch && matchesRole;
  });
}

function renderUsers() {
  const filtered = getFilteredUsers();
  return `
    <section class="card glass">
      <div class="section-header">
        <div><h3>Usuarios registrados</h3><p class="muted">Campos sugeridos: WhatsApp, fecha de nacimiento, curso/división o materia/título.</p></div>
        <div class="toolbar">
          <button class="btn btn-secondary btn-sm" data-import="users">${icons.import} Importar CSV</button>
          <button class="btn btn-secondary btn-sm" data-export="users">${icons.export} Exportar CSV</button>
          <button class="btn btn-primary btn-sm" data-create="user">Nuevo usuario</button>
        </div>
      </div>
      <div class="toolbar filters-row">
        <input type="search" id="userSearch" placeholder="Buscar por nombre, email o DNI" value="${escapeHtml(state.filters.userSearch)}" />
        <select id="userRoleFilter"><option value="all" ${state.filters.userRole === 'all' ? 'selected' : ''}>Todos los roles</option><option ${state.filters.userRole === 'Administrador' ? 'selected' : ''}>Administrador</option><option ${state.filters.userRole === 'Docente' ? 'selected' : ''}>Docente</option><option ${state.filters.userRole === 'Alumno' ? 'selected' : ''}>Alumno</option></select>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Nombre</th><th>Rol</th><th>Email</th><th>WhatsApp</th><th>DNI</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            ${filtered.map(user => `<tr><td><strong>${user.name}</strong></td><td>${user.role}</td><td>${user.email}</td><td>${user.whatsapp}</td><td>${user.dni}</td><td>${statusPill(user.status)}</td><td>${actionButtons('user', user.id)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderRoles() {
  const roles = state.rolesData || [];
  return `<section class="card glass"><div class="section-header"><div><h3>Perfiles y permisos</h3><p class="muted">ABM conectado a Supabase para roles y permisos por módulo.</p></div><div class="toolbar"><button class="btn btn-primary btn-sm" id="newRoleBtn">Nuevo rol</button><button class="btn btn-secondary btn-sm" data-export="roles">${icons.export} Exportar CSV</button></div></div><div class="grid-cards">${roles.map(role => `<article class="card glass-soft"><div class="role-card-head"><div><h3>${escapeHtml(role.name)}</h3><p>${escapeHtml(role.description || '')}</p><small class="muted">Código: ${escapeHtml(role.code)}</small></div><div class="table-actions"><button class="action-btn" data-role-action="view" data-id="${role.id}" title="Ver">${icons.eye}</button><button class="action-btn" data-role-action="edit" data-id="${role.id}" title="Editar">${icons.edit}</button><button class="action-btn" data-role-action="delete" data-id="${role.id}" title="Eliminar">${icons.trash}</button></div></div><div class="permissions-list">${(role.permissions || []).map(p => `<span class="tag">${escapeHtml(p)}</span>`).join('') || '<span class="muted">Sin permisos</span>'}</div></article>`).join('')}</div></section>`;
}

function renderTeams() {
  const rows = state.user.role === 'teacher' ? state.teams.filter(team => (team.teachers || []).includes(state.user.name)) : state.teams;
  return `
    <section class="card glass">
      <div class="section-header">
        <div><h3>${state.user.role === 'teacher' ? 'Equipos asignados' : 'Equipos mixtos'}</h3><p class="muted">Cada equipo debe tener un mentor docente, un mentor suplente opcional y hasta 5 alumnos.</p></div>
        <div class="toolbar"><button class="btn btn-secondary btn-sm" data-import="teams">${icons.import} Importar CSV</button><button class="btn btn-secondary btn-sm" data-export="teams">${icons.export} Exportar CSV</button><button class="btn btn-primary btn-sm" data-create="team">Nuevo equipo</button></div>
      </div>
      <div class="grid-cards">
        ${rows.map(team => `<article class="card glass-soft team-card">${team.logo_url ? `<img class="team-logo" src="${escapeAttr(team.logo_url)}" alt="Logo equipo">` : ''}<div class="section-header"><h3>${escapeHtml(team.name)}</h3><span class="tag">${team.students || (team.student_ids || []).length || 0} alumnos</span></div><p><strong>Mentores:</strong> ${escapeHtml((team.teachers || []).join(', ') || '-')}</p><p><strong>Integrantes:</strong> ${escapeHtml((team.student_names || (team.members || []).map(m => m.name || m.full_name).filter(Boolean)).join(', ') || '-')}</p><p><strong>Cursos:</strong> ${escapeHtml((team.courses || []).join(', ') || '-')}</p><p><strong>Divisiones:</strong> ${escapeHtml((team.divisions || []).join(', ') || '-')}</p><p><strong>Proyecto:</strong> ${escapeHtml(team.project || '-')}</p><div class="card-actions"><button class="btn btn-secondary btn-sm" data-action="view" data-type="team" data-id="${team.id}">${icons.eye}</button><button class="btn btn-secondary btn-sm" data-action="edit" data-type="team" data-id="${team.id}">${icons.edit}</button><button class="btn btn-secondary btn-sm" data-action="delete" data-type="team" data-id="${team.id}">${icons.trash}</button></div></article>`).join('')}
      </div>
    </section>`;
}

function getFilteredInventory() {
  return state.inventory.filter(item => {
    const byStatus = state.filters.inventoryState === 'all' || item.status === state.filters.inventoryState;
    const byType = state.filters.inventoryType === 'all' || item.type === state.filters.inventoryType;
    const bySearch = !state.filters.inventorySearch || `${item.code} ${item.item} ${item.serial} ${item.barcode} ${item.location} ${item.brand || ''} ${item.supplier || ''} ${item.location_detail || ''} ${item.zone || ''} ${item.category || ''}`.toLowerCase().includes(state.filters.inventorySearch.toLowerCase());
    return byStatus && byType && bySearch;
  });
}

function renderInventory() {
  const allRows = getFilteredInventory();
  const totalPages = Math.max(1, Math.ceil(allRows.length / state.inventoryPageSize));
  if (state.inventoryPage > totalPages) state.inventoryPage = totalPages;
  const start = (state.inventoryPage - 1) * state.inventoryPageSize;
  const rows = allRows.slice(start, start + state.inventoryPageSize);
  const pager = `<div class="pager inventory-pager"><div class="pager-size"><span class="muted small">Listar</span><select class="inventory-page-size"><option ${state.inventoryPageSize===5?'selected':''}>5</option><option ${state.inventoryPageSize===10?'selected':''}>10</option><option ${state.inventoryPageSize===25?'selected':''}>25</option><option ${state.inventoryPageSize===50?'selected':''}>50</option><option ${state.inventoryPageSize===100?'selected':''}>100</option></select><span class="muted small">${allRows.length} registros</span></div><div class="pager-buttons"><button class="btn btn-secondary btn-sm inventory-prev-page" ${state.inventoryPage<=1?'disabled':''}>← Anterior</button><span class="pager-current">${state.inventoryPage} / ${totalPages}</span><button class="btn btn-secondary btn-sm inventory-next-page" ${state.inventoryPage>=totalPages?'disabled':''}>Siguiente →</button></div></div>`;
  const teacherActions = state.user.role === 'teacher' ? `<button class="btn btn-primary btn-sm" id="loanRequestBtn">Solicitud de préstamo</button>` : `<button class="btn btn-primary btn-sm" id="newInventoryItemBtn">Nuevo insumo</button>`;
  return `
    <section class="inventory-layout inventory-full-width">
      <div class="card glass">
        <div class="section-header">
          <div><h3>Control y trazabilidad</h3><p class="muted">Cada insumo permite saber quién lo tiene, marca, empresa/proveedor, locación, zona, estado y código de barras.</p></div>
          <div class="toolbar">
            <button class="btn btn-secondary btn-sm" data-import="inventory">${icons.import} Importar CSV</button>
            <button class="btn btn-secondary btn-sm" data-export="inventory">${icons.export} Exportar CSV</button>
            <button class="btn btn-secondary btn-sm" id="printBarcodesBtn">${icons.barcode} Imprimir barcodes</button>
            <button class="btn btn-secondary btn-sm" id="inventoryChartsBtn">${icons.chart} Ver gráficos</button>
            ${teacherActions}
          </div>
        </div>
        <div class="toolbar filters-row">
          <input type="search" id="inventorySearch" placeholder="Buscar por código, item, marca, empresa, serie, barcode, locación o zona" value="${escapeAttr(state.filters.inventorySearch)}" autocomplete="off" />
          <select id="inventoryStateFilter"><option value="all" ${state.filters.inventoryState === 'all' ? 'selected' : ''}>Todos los estados</option><option ${state.filters.inventoryState === 'Disponible' ? 'selected' : ''}>Disponible</option><option ${state.filters.inventoryState === 'Prestado' ? 'selected' : ''}>Prestado</option><option ${state.filters.inventoryState === 'En mantenimiento' ? 'selected' : ''}>En mantenimiento</option></select>
          <select id="inventoryTypeFilter"><option value="all" ${state.filters.inventoryType === 'all' ? 'selected' : ''}>Todos los tipos</option><option ${state.filters.inventoryType === 'Equipo' ? 'selected' : ''}>Equipo</option><option ${state.filters.inventoryType === 'Insumo' ? 'selected' : ''}>Insumo</option></select>
        </div>
        <div class="toolbar filters-row">
          <button class="btn btn-secondary btn-sm" id="generateBarcodeBtn">${icons.barcode} Generar código</button>
          ${state.user.role === 'administrator' ? '<button class="btn btn-secondary btn-sm" id="bulkInventoryEditBtn">Editar selección</button><button class="btn btn-secondary btn-sm" id="bulkInventoryDeleteBtn">Eliminar selección</button>' : ''}
          <span class="muted small">El buscador usa espera corta para permitir escribir de corrido.</span>
        </div>
        ${pager}
        <div class="table-wrap">
          <table class="table inventory-table">
            <thead><tr><th><input type="checkbox" id="inventorySelectAll"></th><th>Código</th><th>Tipo</th><th>Marca</th><th>Empresa</th><th>N° serie</th><th>Barcode</th><th>Estado</th><th>Condición</th><th>Locación</th><th>Zona</th><th>Ubicación</th><th>Acciones</th></tr></thead>
            <tbody>
              ${rows.map(item => `<tr><td><input type="checkbox" class="inventory-row-check" data-id="${escapeAttr(item.id)}" ${state.selectedInventoryIds?.has(String(item.id)) ? 'checked' : ''}></td><td><div class="inventory-item-cell">${item.image_url ? `<button type="button" class="inventory-thumb-btn" data-image-src="${escapeAttr(item.image_url)}" data-image-title="${escapeAttr(item.code + ' - ' + item.item)}"><img class="inventory-thumb" src="${escapeAttr(item.image_url)}" onerror="this.style.display='none'" alt="Foto"></button>` : ''}<div><strong>${escapeHtml(item.code)}</strong><br><span class="muted small">${escapeHtml(item.item)}</span></div></div></td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.brand || '-')}</td><td>${escapeHtml(item.supplier || '-')}</td><td>${escapeHtml(item.serial || 'Sin serie')}</td><td><button class="barcode-cell barcode-print-btn" data-print-barcode="${escapeAttr(item.id)}" title="Imprimir barcode">${barcodePreviewMarkup(item.barcode || item.code, true)}</button></td><td>${statusPill(item.status)}</td><td>${conditionPill(item.condition)}</td><td>${escapeHtml(item.location_detail || '-')}</td><td>${escapeHtml(item.zone || '-')}</td><td>${escapeHtml(item.location)}</td><td>${actionButtons('inventory', item.id)}</td></tr>`).join('') || `<tr><td colspan="13" class="muted">Sin resultados.</td></tr>`}
            </tbody>
          </table>
        </div>
        ${pager}
      </div>
    </section>`;
}

function getStudentCourseItems(course) {
  return [
    { key: 'lesson', group: 'MASTER CLASS EN VIVO', title: 'Clase 01 – Bienvenida & Mentalidad del laboratorio', meta: '76 minutos', icon: '📘' },
    { key: 'task', group: 'CLASES GRABADAS', title: 'Tarea 01 – Calendario Económico', meta: '7 días', icon: '📝' },
    { key: 'quiz', group: 'CLASES GRABADAS', title: 'Evaluativo 01 – Herramientas del laboratorio', meta: '10 preguntas · 20 minutos', icon: '✅' }
  ];
}

function renderStudentCourseContent(course, tab = 'lesson') {
  if (tab === 'task') return `
    <div class="course-content-rich">
      <div class="course-meta-strip">Hora de finalización estimada: 21 de abril de 2026 · 18:13</div>
      <h2>Tarea 01 – Calendario Económico</h2>
      <div class="course-summary-list"><span><strong>Duración:</strong> 7 días</span><span><strong>Total grade:</strong> 10 puntos</span><span><strong>Calificación aprobatoria:</strong> 7 puntos</span><span><strong>Reintentos:</strong> 3</span></div>
      <div class="lp-block">
        <h3>📋 Instrucciones</h3>
        <ol>
          <li>Ingresá a una plataforma con calendario económico y detectá noticias de alto impacto.</li>
          <li>Elegí un activo fuerte y uno débil, explicando su tendencia.</li>
          <li>Redactá una breve conclusión con tu decisión como estudiante.</li>
        </ol>
      </div>
      <div class="lp-block">
        <h3>🧾 Se requiere entrega</h3>
        <ul>
          <li>Capturas del calendario económico.</li>
          <li>Mapa de calor o análisis del mercado.</li>
          <li>Documento o texto explicativo.</li>
        </ul>
      </div>
      <div class="lp-answer-box">
        <label><span>Escriba su respuesta</span><textarea rows="7" placeholder="Desarrollá tu análisis aquí..."></textarea></label>
        <div class="toolbar"><button class="btn btn-primary btn-sm">Guardar respuesta</button><button class="btn btn-secondary btn-sm">Adjuntar archivo</button></div>
      </div>
    </div>`;
  if (tab === 'quiz') return `
    <div class="course-content-rich">
      <div class="course-meta-strip">Pregunta 1 de 10 · Tiempo estimado 20 minutos</div>
      <h2>Evaluativo 01 – Herramientas del laboratorio</h2>
      <div class="quiz-panel">
        <p class="quiz-question">¿Cuál es el objetivo principal del calendario económico?</p>
        <button class="quiz-option" data-quiz-option="a"><span class="quiz-radio"></span><span>a) Analizar gráficos técnicos</span></button>
        <button class="quiz-option selected correct" data-quiz-option="b"><span class="quiz-radio"></span><span>b) Identificar eventos que impactan el mercado</span></button>
        <button class="quiz-option" data-quiz-option="c"><span class="quiz-radio"></span><span>c) Ejecutar operaciones automáticamente</span></button>
        <button class="quiz-option" data-quiz-option="d"><span class="quiz-radio"></span><span>d) Crear estrategias de trading</span></button>
        <div class="quiz-feedback success">✔ Correcto. El calendario económico muestra eventos clave que pueden generar movimientos en el mercado.</div>
        <div class="toolbar"><button class="btn btn-secondary btn-sm">Pregunta anterior</button><button class="btn btn-primary btn-sm">Siguiente</button></div>
      </div>
    </div>`;
  return `
    <div class="course-content-rich">
      <div class="course-meta-strip">MASTER CLASS – ${course.title} · 2 de 37 elementos</div>
      <h2>Clase 01 – Bienvenida & Mentalidad del laboratorio</h2>
      <p>En esta primera clase damos inicio al curso <strong>${course.title}</strong>. Vas a encontrar objetivos, video, archivos adjuntos y navegación secuencial, siguiendo un formato similar al aula virtual que compartiste.</p>
      <div class="lesson-video-card">
        <div class="lesson-video-thumb">
          <div class="video-overlay-title">Clase 01: Bienvenida y Mentalidad</div>
          <div class="play-button">▶</div>
        </div>
        <div class="lesson-video-actions"><button class="btn btn-secondary btn-sm">Descargar PDF</button><button class="btn btn-primary btn-sm">Completar</button></div>
      </div>
      <table class="table lesson-files-table"><thead><tr><th>Nombre</th><th>Tipo</th><th>Tamaño</th><th>Descarga</th></tr></thead><tbody><tr><td>Clase 01 - Bienvenida y Mentalidad del laboratorio</td><td>pdf</td><td>265 KB</td><td>${icons.export}</td></tr></tbody></table>
      <div class="lesson-nav"><button class="btn btn-secondary btn-sm">◀ Anterior</button><button class="btn btn-secondary btn-sm">Siguiente ▶</button></div>
    </div>`;
}

function renderTeacherCampus() {
  const rows = currentTeacherModules();
  return `<section class="card glass"><div class="section-header"><div><h3>Gestión de cursos</h3><p class="muted">Creación de cursos, visibilidad, códigos de acceso y contenido tipo e-learning.</p></div><div class="toolbar"><button class="btn btn-secondary btn-sm" data-import="courses">${icons.import} Importar CSV</button><button class="btn btn-secondary btn-sm" data-export="courses">${icons.export} Exportar CSV</button><button class="btn btn-secondary btn-sm" id="addModuleBtn">${icons.courses} Agregar módulo</button><button class="btn btn-primary btn-sm" id="newCourseBtn">Nuevo curso</button></div></div><div class="toolbar filters-row"><input type="search" placeholder="Buscar por nombre, código o detalle"><select><option>Todos los estados</option></select><select><option>Todos los tipos</option></select><button class="btn btn-secondary btn-sm" id="courseChartsBtn">${icons.chart} Ver gráficos</button></div><div class="grid-cards">${rows.map(mod => `<article class="card glass-soft"><div class="metric-inline"><h3>${mod.title}</h3>${statusPill(mod.status)}</div><p><strong>Docente:</strong> ${mod.teacher}</p><p><strong>Visibilidad:</strong> ${mod.visibility}</p><p><strong>Código:</strong> ${mod.code}</p><p><strong>Clave:</strong> ${mod.accessKey}</p><p><strong>Equipo/alcance:</strong> ${mod.team}</p><div class="course-metrics"><span>${mod.lessons} lecciones</span><span>${mod.tasks} tareas</span><span>${mod.evaluations} evaluativos</span></div><div class="toolbar"><button class="btn btn-secondary btn-sm" data-preview-form="course">${icons.eye} Ver formulario</button><button class="btn btn-secondary btn-sm" data-preview-form="lesson">Agregar lección</button><button class="btn btn-secondary btn-sm" data-preview-form="task">Agregar tarea</button><button class="btn btn-secondary btn-sm" data-preview-form="quiz">Agregar evaluativo</button></div></article>`).join('')}</div><div class="layout-two" style="margin-top:18px"><article class="card glass-soft"><h3>Cómo carga contenido el docente</h3><div class="flow-steps"><div class="flow-step"><strong>1. Crear curso</strong><span>Nombre, descripción, código automático, clave, visibilidad y equipos.</span></div><div class="flow-step"><strong>2. Agregar módulos</strong><span>Organizá el contenido por unidades temáticas.</span></div><div class="flow-step"><strong>3. Cargar lecciones</strong><span>Texto, video, archivos y enlaces.</span></div><div class="flow-step"><strong>4. Tareas y evaluativos</strong><span>Consignas, puntaje, intentos y feedback.</span></div></div></article><article class="card glass-soft"><h3>Vistas previas disponibles</h3><div class="list-simple"><button class="btn btn-secondary btn-sm full-width" data-preview-form="course">Ver formulario de curso</button><button class="btn btn-secondary btn-sm full-width" data-preview-form="module">Ver formulario de módulo</button><button class="btn btn-secondary btn-sm full-width" data-preview-form="lesson">Ver formulario de lección</button><button class="btn btn-secondary btn-sm full-width" data-preview-form="task">Ver formulario de tarea</button><button class="btn btn-secondary btn-sm full-width" data-preview-form="quiz">Ver formulario de evaluativo</button></div></article></div></section>`;
}

function renderStudentCampus() {
  const enrolled = state.studentCourses.filter(c => c.access === 'Incripto');
  const openCourses = state.studentCourses.filter(c => c.access !== 'Incripto');
  if (state.currentCourseScreen === 'detail' && state.selectedStudentCourse) {
    const course = state.selectedStudentCourse;
    const items = getStudentCourseItems(course);
    const groups = [...new Set(items.map(i => i.group))];
    return `
      <section class="learnpress-shell">
        <aside class="learnpress-sidebar card glass">
          <div class="learnpress-search"><input type="search" placeholder="Buscar contenido de cursos"></div>
          ${groups.map(group => `
            <div class="lp-group">
              <div class="lp-group-head"><strong>${group}</strong><span>${items.filter(i => i.group === group).length}</span></div>
              <div class="lp-items">
                ${items.filter(i => i.group === group).map(item => `
                  <button class="lp-item ${state.courseContentTab === item.key ? 'active' : ''}" data-course-tab="${item.key}">
                    <div class="lp-item-main"><strong>${item.icon} ${item.title}</strong><span>${item.meta}</span></div>
                    <span class="lp-item-check">✓</span>
                  </button>`).join('')}
              </div>
            </div>`).join('')}
        </aside>
        <article class="learnpress-content card glass">
          <div class="learnpress-topbar"><span>MASTER CLASS – ${course.title}</span><span>2 de 37 elementos</span></div>
          ${renderStudentCourseContent(course, state.courseContentTab)}
          <div class="toolbar" style="justify-content:flex-end"><button class="btn btn-secondary btn-sm" id="backCampusBtn">Volver al campus</button></div>
        </article>
      </section>`;
  }
  return `
    <section class="card glass">
      <div class="section-header"><div><h3>Mis cursos</h3><p class="muted">Tus cursos activos con vista previa tipo aula virtual.</p></div><button class="btn btn-primary btn-sm" id="joinCourseBtn">Sumarme a un curso</button></div>
      <div class="student-course-grid">
        ${enrolled.map(course => `
          <article class="student-course-card glass-soft">
            <div class="student-course-cover"><div class="student-course-cover-overlay"><span class="cover-badge">${course.team}</span><h3>${course.title}</h3><small>${course.teacher}</small></div></div>
            <div class="student-course-body">
              <div class="course-metrics"><span>${course.lessons} módulos/lecciones</span><span>${course.tasks} tareas</span><span>${course.evaluations} evaluativos</span></div>
              <div class="student-progress"><div class="student-progress-bar"><span style="width:${course.progress}%"></span></div><strong>Progreso ${course.progress}%</strong></div>
              <div class="toolbar" style="justify-content:flex-end"><button class="btn btn-secondary btn-sm" data-open-student-course="${course.title}">${icons.eye} Ver curso</button></div>
            </div>
          </article>`).join('')}
      </div>
    </section>
    <section class="layout-two">
      <article class="card glass">
        <h3>Cursos abiertos</h3>
        <div class="grid-cards">${openCourses.map(course => `<article class="card glass-soft"><div class="metric-inline"><h3>${course.title}</h3>${statusPill('Disponible con código')}</div><p><strong>Docente:</strong> ${course.teacher}</p><p><strong>Visibilidad:</strong> ${course.visibility}</p><div class="course-metrics"><span>${course.lessons} lecciones</span><span>${course.tasks} tareas</span><span>${course.evaluations} evaluativos</span></div></article>`).join('')}</div>
      </article>
      <aside class="card glass">
        <h3>Cómo acceder</h3>
        <div class="flow-steps"><div class="flow-step"><strong>Código del curso</strong><span>Se genera automáticamente cuando el docente crea el curso.</span></div><div class="flow-step"><strong>Clave de acceso</strong><span>La define el docente para cursos restringidos.</span></div><div class="flow-step"><strong>Visibilidad</strong><span>Puede ser abierta o limitada a equipos.</span></div></div>
      </aside>
    </section>`;
}

function renderCourses() {
  if (state.user.role === 'student') return renderStudentCampus();
  return renderTeacherCampus();
}

function renderLibrary() {
  return `<section class="card glass"><div class="section-header"><div><h3>Biblioteca digital</h3><p class="muted">Repositorio de documentos, videos, PDFs, TXT, ZIP y links externos como GitHub o Drive.</p></div><div class="toolbar"><button class="btn btn-primary btn-sm" id="newResourceBtn">Nuevo recurso</button><button class="btn btn-secondary btn-sm" data-import="library">${icons.import} Importar CSV</button><button class="btn btn-secondary btn-sm" data-export="library">${icons.export} Exportar CSV</button><button class="btn btn-secondary btn-sm" id="libraryChartsBtn">${icons.chart} Ver gráficos</button></div></div><div class="toolbar filters-row"><input type="search" placeholder="Buscar por nombre, código o detalle"><select><option>Todos los tipos</option><option>PDF</option><option>Video</option><option>Documento</option><option>TXT</option><option>ZIP</option><option>GitHub</option></select><button class="btn btn-secondary btn-sm" id="resourceCategoryBtn">${icons.filter} Categorías</button></div><div class="file-grid">${state.library.map(file => `<article class="file-item glass-soft"><strong>${file.title}</strong><p>${file.area}</p><span class="tag">${file.type}</span><div class="toolbar" style="margin-top:8px"><button class="btn btn-secondary btn-sm" data-view-resource="${file.id}">${icons.eye} Ver</button></div></article>`).join('')}</div><article class="card glass-soft" style="margin-top:16px"><h3>Cómo agregar recursos</h3><div class="flow-steps"><div class="flow-step"><strong>1. Nuevo recurso</strong><span>Elegí tipo: PDF, Video, Documento, TXT, ZIP, Link o Repositorio GitHub.</span></div><div class="flow-step"><strong>2. Datos</strong><span>Completá título, categoría, descripción y archivo/URL.</span></div><div class="flow-step"><strong>3. Publicación</strong><span>Guardá y el recurso queda visible en la grilla.</span></div></div></article></section>`;
}

function notificationPager(rows, position='top') {
  const sizes = [5,10,25,50,100,500];
  const totalPages = Math.max(1, Math.ceil(rows.length / state.notificationsPageSize));
  if (state.notificationsPage > totalPages) state.notificationsPage = totalPages;
  return `<div class="notifications-pager ${position}"><label><span>Listar</span><select class="notifications-page-size">${sizes.map(s=>`<option value="${s}" ${state.notificationsPageSize===s?'selected':''}>${s}</option>`).join('')}</select></label><div class="pager-controls"><button class="btn btn-secondary btn-sm notifications-prev-page" ${state.notificationsPage<=1?'disabled':''}>Anterior</button><span class="muted">Página ${state.notificationsPage} de ${totalPages} · ${rows.length} registros</span><button class="btn btn-secondary btn-sm notifications-next-page" ${state.notificationsPage>=totalPages?'disabled':''}>Siguiente</button></div></div>`;
}

function renderNotifications() {
  const helper = isCurrentAdmin() ? 'Las notificaciones se pueden enviar de forma masiva, individual, por equipos o selección múltiple.' : 'Leé tus avisos y seguí novedades de cursos, equipos e inventario.';
  const button = '<button class="btn btn-primary btn-sm" id="massNotifyBtn">Enviar notificación</button>';
  const rows = state.notifications || [];
  const totalPages = Math.max(1, Math.ceil(rows.length / state.notificationsPageSize));
  if (state.notificationsPage > totalPages) state.notificationsPage = totalPages;
  const pageRows = rows.slice((state.notificationsPage - 1) * state.notificationsPageSize, state.notificationsPage * state.notificationsPageSize);
  return `<section class="card glass notifications-panel">
    <div class="section-header"><div><h3>Centro de notificaciones</h3><p class="muted">${helper}</p></div><div class="toolbar">${button}</div></div>
    <div class="notifications-toolbar">
      <label class="inline-check select-all"><input type="checkbox" id="notificationsSelectAll"> <span>Seleccionar página</span></label>
      <div class="toolbar"><button class="btn btn-secondary btn-sm" id="markSelectedReadBtn">Marcar leídas</button><button class="btn btn-secondary btn-sm" id="markSelectedUnreadBtn">Marcar sin leer</button><button class="btn btn-secondary btn-sm" id="clearUnreadBtn">Limpiar contador</button></div>
    </div>
    ${notificationPager(rows,'top')}
    <div class="notifications-list">${pageRows.map(n => `<article class="notification-card ${n.unread ? 'is-unread' : 'is-read'}"${notificationAccentStyle(n)}>
      <input type="checkbox" class="notification-row-check" data-id="${escapeAttr(n.id)}" aria-label="Seleccionar notificación">
      <button type="button" class="notification-select notification-card-body" data-id="${escapeAttr(n.id)}">
        <div class="notification-titleline"><strong>${escapeHtml(n.title)}</strong><span class="status-pill ${n.unread ? 'status-pending' : 'status-approved'}">${n.unread ? 'Sin leer' : 'Leída'}</span></div>
        <p>${notificationMessage(n)}</p>
        <small class="notification-meta">${notificationMeta(n)}</small>
      </button>
    </article>`).join('') || '<p class="muted empty-state">No hay notificaciones.</p>'}</div>
    ${notificationPager(rows,'bottom')}
  </section>`;
}

function renderLoanManagement() {
  const rows = state.user.role === 'administrator' ? state.loans : state.loans.filter(l => l.requester === state.user.name || String(l.requester_id || '') === String(state.user.id || ''));
  const rightButton = state.user.role === 'administrator'
    ? '<button class="btn btn-secondary btn-sm" id="loanChartsBtn">'+icons.chart+' Ver gráficos</button>'
    : '<button class="btn btn-primary btn-sm" id="loanRequestBtn2">Nueva solicitud</button>';
  return `<section class="card glass"><div class="section-header"><div><h3>Centro de préstamos</h3><p class="muted">Solicitudes, franjas horarias, estados y devoluciones.</p></div><div class="toolbar"><button class="btn btn-secondary btn-sm" data-export="loanManagement">${icons.export} Exportar CSV</button>${rightButton}</div></div><div class="toolbar filters-row"><input type="search" placeholder="Buscar por solicitante, equipo o insumo"><select><option>Todos los estados</option><option>Pendiente</option><option>Aprobado</option><option>Rechazado</option><option>Devuelto</option></select><button class="btn btn-secondary btn-sm" id="loanFilterBtn">${icons.filter} Filtros</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Solicitante</th><th>Curso / equipo</th><th>Fecha</th><th>Horario</th><th>Insumos</th><th>Observaciones</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows.map(l=>`<tr><td>${escapeHtml(l.requester)}</td><td>${escapeHtml(l.team)}</td><td>${escapeHtml(l.date)}</td><td>${escapeHtml(l.from)} a ${escapeHtml(l.to)}</td><td>${(l.items||[]).map(escapeHtml).join(', ')}</td><td>${escapeHtml(l.notes)}</td><td>${statusPill(l.status)}</td><td><div class="actions">${state.user.role==='administrator'?`<button class="action-btn" data-approve-loan="${l.id}" title="Aprobar">${icons.approve}</button><button class="action-btn" data-reject-loan="${l.id}" title="Rechazar">${icons.reject}</button><button class="action-btn" data-return-loan="${l.id}" title="Marcar devolución">${icons.returnIcon}</button>`:`<button class="action-btn" data-action="view" data-type="loanManagement" data-id="${l.id}" title="Ver">${icons.eye}</button>`}</div></td></tr>`).join('') || '<tr><td colspan="8" class="muted">No hay solicitudes registradas.</td></tr>'}</tbody></table></div></section>`;
}

function renderAccessControl() {
  const inside = state.accessLogs.filter(i=>i.inside).length;
  return `<section class="layout-two"><article class="card glass"><div class="section-header"><div><h3>Control de acceso RFID</h3><p class="muted">Historial de ingresos al laboratorio y permanencia estimada.</p></div><div class="toolbar"><button class="btn btn-secondary btn-sm" data-export="accessControl">${icons.export} Exportar CSV</button><button class="btn btn-primary btn-sm" data-preview-form="access">Nuevo registro</button><button class="btn btn-secondary btn-sm" id="accessChartsBtn">${icons.chart} Ver gráficos</button></div></div><div class="toolbar filters-row"><input type="search" placeholder="Buscar por usuario, tarjeta o sala"><select><option>Todas las categorías</option><option>Alumno</option><option>Docente</option><option>Administrador</option></select><button class="btn btn-secondary btn-sm" id="manageCategoriesBtn">${icons.filter} Categorías</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Usuario</th><th>Rol</th><th>Tarjeta RFID</th><th>Sala</th><th>Ingreso</th><th>Salida</th><th>Permanencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${state.accessLogs.map(r=>`<tr><td>${r.user}</td><td>${r.role}</td><td>${r.card}</td><td>${r.room}</td><td>${r.entry}</td><td>${r.exit}</td><td>${r.exit==='-'?'En curso':'2h 04m'}</td><td>${statusPill(r.inside?'Dentro':'Fuera')}</td><td>${actionButtons()}</td></tr>`).join('')}</tbody></table></div></article><aside class="card glass"><h3>Resumen de sala</h3><div class="list-simple"><div class="list-item"><strong>Personas dentro</strong><span>${inside}</span></div><div class="list-item"><strong>Lab. Robótica</strong><span>${state.accessLogs.filter(i=>i.inside && i.room.includes('Robótica')).length} personas</span></div><div class="list-item"><strong>Sala Informática</strong><span>${state.accessLogs.filter(i=>i.inside && i.room.includes('Informática')).length} personas</span></div><div class="list-item"><strong>Integración ESP32</strong><span>Lista para insertar registros RFID en la base.</span></div></div></aside></section>`;
}

function renderProfile() {
  const role = roleLabelFromAny(state.user?.role);
  const teacherData = role === 'Docente' ? `<p><strong>Materia:</strong> ${escapeHtml(state.user.subject || state.user.teacher_subject_name || '-')}</p><p><strong>Título:</strong> ${escapeHtml(state.user.title || '-')}</p>` : '';
  const studentData = role === 'Alumno' ? `<p><strong>Curso:</strong> ${escapeHtml(state.user.student_course_name || state.user.course || '-')}</p><p><strong>División:</strong> ${escapeHtml(state.user.student_division_name || state.user.division || '-')}</p>` : '';
  const quick = role === 'Alumno' ? '' : `<aside class="card glass"><h3>Accesos rápidos</h3><div class="list-simple"><button class="btn btn-secondary btn-sm" data-view-btn="notifications">Notificaciones</button><button class="btn btn-secondary btn-sm" data-view-btn="inventory">Inventario</button><button class="btn btn-secondary btn-sm" data-view-btn="courses">Campus</button></div></aside>`;
  return `<section class="profile-layout ${role === 'Alumno' ? 'profile-single' : ''}"><article class="card glass"><div class="section-header"><div><h3>Mi perfil</h3><p class="muted">Datos actualizados en tiempo real desde tu perfil.</p></div><button class="btn btn-primary btn-sm" id="editProfileBtn">Editar datos</button></div><div class="profile-box"><img src="${escapeAttr(state.user.avatar_url || './assets/avatar-default.svg')}" alt="Avatar" class="profile-large" /><div><h3>${escapeHtml(state.user.name || state.user.full_name || '-')}</h3><p><strong>Rol:</strong> ${escapeHtml(role)}</p><p><strong>Email:</strong> ${escapeHtml(state.user.email || '-')}</p><p><strong>WhatsApp:</strong> ${escapeHtml(state.user.whatsapp || '-')}</p><p><strong>DNI:</strong> ${escapeHtml(state.user.dni || '-')}</p><p><strong>Fecha nacimiento:</strong> ${escapeHtml(state.user.birth_date || '-')}</p>${teacherData}${studentData}</div></div></article>${quick}</section>`;
}

function renderSettings() {
  const gs = state.generalSettings || JSON.parse(localStorage.getItem('ism_general_settings') || '{}');
  const logoPreview = gs.logoDataUrl ? `<div class="settings-logo-preview"><img src="${escapeAttr(gs.logoDataUrl)}" alt="Logo institucional"></div>` : '';
  return `<section class="settings-layout"><article class="card glass"><div class="section-header"><div><h3>Configuraciones generales</h3><p class="muted">Carga del logo institucional, apariencia y parámetros del sistema.</p></div><button class="btn btn-primary btn-sm" id="saveSettingsBtn" type="button">Guardar</button></div><form class="form-grid" onsubmit="return false"><label><span>Nombre de la institución</span><input id="institutionNameInput" value="${escapeAttr(gs.institutionName || 'Ministerio de Educación Tucumán')}" /></label><label><span>Email institucional</span><input id="institutionEmailInput" value="${escapeAttr(gs.institutionEmail || 'robotica@ism.edu.ar')}" /></label><label class="full-span"><span>Logo de la institución</span><input id="institutionLogoInput" type="file" accept="image/*" /></label>${logoPreview}</form></article><aside class="card glass"><h3>Apariencia</h3><div class="list-simple"><div class="list-item"><strong>Tema actual</strong><span>${document.body.classList.contains('light') ? 'Claro' : 'Oscuro'}</span></div><div class="list-item"><strong>Alertas</strong><span>SweetAlert2 habilitado</span></div><div class="list-item"><strong>Exportación</strong><span>CSV disponible en todos los módulos</span></div></div></aside></section>`;
}

function renderView() {
  updateHeader();
  renderNav();
  const views = { dashboard: renderDashboard, users: renderUsers, roles: renderRoles, team: renderTeams, inventory: renderInventory, loanManagement: renderLoanManagement, accessControl: renderAccessControl, courses: renderCourses, library: renderLibrary, notifications: renderNotifications, profile: renderProfile, settings: renderSettings };
  appContent.innerHTML = (views[state.currentView] || renderDashboard)();
  attachViewEvents();
  renderNotificationDropdown();
  renderCharts();
}

function destroyCharts() {
  state.charts.forEach(chart => chart.destroy());
  state.charts = [];
}

function chartTextColor() {
  return getComputedStyle(document.body).getPropertyValue('--text').trim() || '#e8eefc';
}

function chartGridColor() {
  return getComputedStyle(document.body).getPropertyValue('--border').trim() || 'rgba(148,163,184,0.18)';
}

function renderCharts() {
  destroyCharts();
  if (state.currentView !== 'dashboard' || state.user.role !== 'administrator') return;
  const line = document.getElementById('loansLineChart');
  const pie = document.getElementById('rolesPieChart');
  const bar = document.getElementById('inventoryBarChart');
  if (!line || !pie || !bar) return;

  const commonScales = { x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } }, y: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } } };

  state.charts.push(new Chart(line, { type: 'line', data: { labels: state.audit.map(i => i.date), datasets: [{ label: 'Préstamos', data: state.audit.map(i => i.loans), tension: .35 }, { label: 'Devoluciones', data: state.audit.map(i => i.returns), tension: .35 }] }, options: { responsive: true, maintainAspectRatio: false, scales: commonScales, plugins: { legend: { labels: { color: chartTextColor() } } } } }));
  const roleCounts = ['Administrador', 'Docente', 'Alumno'].map(role => state.users.filter(u => u.role === role).length);
  state.charts.push(new Chart(pie, { type: 'pie', data: { labels: ['Administradores', 'Docentes', 'Alumnos'], datasets: [{ data: roleCounts }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor() } } } } }));
  const statusNames = ['Disponible', 'Prestado', 'En mantenimiento'];
  state.charts.push(new Chart(bar, { type: 'bar', data: { labels: statusNames, datasets: [{ label: 'Activos', data: statusNames.map(s => state.inventory.filter(i => i.status === s).length) }] }, options: { responsive: true, maintainAspectRatio: false, scales: commonScales, plugins: { legend: { labels: { color: chartTextColor() } } } } }));
}

function openView(view) {
  state.currentView = view;
  renderView();
}

function notificationAccentStyle(n) {
  const msg = `${n.title || ''} ${n.message || ''}`;
  const incident = (state.ticketIncidents || []).find(i => msg.toLowerCase().includes(String(i.name || '').toLowerCase()));
  const color = incident?.color || (/ticket|soporte/i.test(msg) ? '#8b5cf6' : '');
  return color ? ` style="background:linear-gradient(90deg, ${escapeAttr(color)}22, rgba(15,23,42,.92)); border-left:4px solid ${escapeAttr(color)}"` : '';
}
function renderNotificationDropdown() {
  const unreadRows = (state.notifications || []).filter(n => n.unread);
  notificationsPreview.innerHTML = unreadRows.length ? unreadRows.slice(0, 20).map(n => `
    <button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}>
      <div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span></div>
      <small>Sin leer</small>
    </button>
  `).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ir al área de notificaciones</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
  notificationsPreview.classList.toggle('open', state.notificationsOpen);
}


async function bulkMarkNotifications(read=true, allUnread=false) {
  const ids = allUnread ? (state.notifications || []).filter(n => n.unread).map(n => n.id) : Array.from(appContent.querySelectorAll('.notification-row-check:checked')).map(cb => cb.dataset.id);
  if (!ids.length) return Swal.fire({ icon:'info', title:'Sin selección', text:'Seleccioná una o más notificaciones.' });
  try {
    const idSet = new Set(ids.map(String));
    state.notifications.forEach(n => { if (idSet.has(String(n.id))) n.unread = !read; });
    updateHeader();
    if (window.sb?.enabled) await window.sb.markNotifications(ids, read);
    renderView();
    updateHeader();
    showToast('Notificaciones actualizadas');
  } catch (error) { Swal.fire({ icon:'error', title:'No se pudieron actualizar', text:error.message || String(error) }); }
}

async function selectNotification(id) {
  const target = state.notifications.find(n => String(n.id) === String(id));
  if (!target) return;
  target.unread = false;
  state.notificationsOpen = false;
  try { await window.sb?.markNotificationRead?.(id); } catch (_) {}
  const destination = target.section || target.module || target.target_view || 'notifications';
  openView(destination === 'loans' || destination === 'prestamos' ? 'loanManagement' : destination);
  setTimeout(() => {
    const el = appContent.querySelector(`.notification-select[data-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 80);
}

function csvFromRows(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  rows.forEach(row => lines.push(headers.map(h => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(',')));
  return lines.join('\n');
}

function triggerDownload(name, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function dataByModule(module) {
  return {
    users: state.users,
    teams: state.teams.map(t => ({ ...t, teachers: t.teachers.join(' | '), courses: t.courses.join(' | '), divisions: t.divisions.join(' | ') })),
    inventory: state.inventory,
    loanManagement: state.loans.map(l => ({ ...l, items: l.items.join(' | ') })),
    accessControl: state.accessLogs,
    courses: state.user.role === 'student' ? state.studentCourses : state.modules,
    library: state.library,
    roles: [{ role: 'Administrador', alcance: 'Total' }, { role: 'Docente', alcance: 'Equipos y campus' }, { role: 'Alumno', alcance: 'Consulta y seguimiento' }],
    dashboard: [{ metrica: 'Usuarios', valor: state.users.length }, { metrica: 'Equipos', valor: state.teams.length }, { metrica: 'Inventario', valor: state.inventory.length }]
  }[module] || [];
}

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"') {
      if (inQuotes && n === '"') { cell += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) { row.push(cell); cell = ''; }
    else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && n === '\n') i++;
      row.push(cell); if (row.some(v => String(v).trim() !== '')) rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  row.push(cell); if (row.some(v => String(v).trim() !== '')) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map(h => String(h || '').trim());
  return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}
function csvField(row, names) {
  const entries = Object.entries(row);
  const clean = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const name of names) {
    const wanted = clean(name);
    const found = entries.find(([k]) => clean(k).includes(wanted) || wanted.includes(clean(k)));
    if (found) return String(found[1] ?? '').trim();
  }
  return '';
}
async function importInventoryCsv(file, text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error('El CSV no contiene filas válidas.');
  const clean = v => String(v || '').trim();
  const seen = new Set();
  const mapped = rows.map((row, idx) => {
    const explicitCode = clean(csvField(row, ['asset_code', 'codigo interno', 'código interno']));
    const explicitBarcode = clean(csvField(row, ['barcode', 'codigo de barras', 'código de barras']));
    const item = clean(csvField(row, ['descripcion', 'descripción', 'nombre', 'item', 'producto'])) || 'Item importado ' + (idx + 1);
    const condition = clean(csvField(row, ['condiciones', 'estado', 'condicion', 'condición', 'observacion'])) || 'Nuevo';
    const brand = clean(csvField(row, ['marca'])); const category = clean(csvField(row, ['categoria', 'categoría'])) || 'General';
    const supplier = clean(csvField(row, ['proveedor', 'empresa'])); const location = clean(csvField(row, ['ubicacion', 'ubicación', 'domicilio', 'locacion'])) || 'Soporte Técnico';
    const zone = clean(csvField(row, ['zona'])); const serial = clean(csvField(row, ['serie', 'serial', 'n serie']));
    const qty = Math.max(1, Number(csvField(row, ['stock actual', 'cantidad'])) || 1);
    const code = explicitCode && !/^AR\d+/i.test(explicitCode) ? explicitCode : null;
    const barcode = /^\d{6,}$/.test(explicitBarcode) ? explicitBarcode : null;
    const key = ((code || '') + '|' + (barcode || '') + '|' + item + '|' + serial).toLowerCase(); if (seen.has(key)) return null; seen.add(key);
    return { code, barcode, item, type: 'Equipo', serial, category, brand, supplier, location_detail: location, zone, location_code: 'LAB-ROB', condition, quantity: qty };
  }).filter(Boolean);
  if (!mapped.length) throw new Error('No pude mapear productos desde el CSV.');
  if (window.sb?.enabled) { const result = await window.sb.importInventoryAssets(mapped); await refreshSupabaseData(); return result; }
  state.inventory.unshift(...mapped.map((x, i) => ({ ...x, id: Date.now() + i, code: x.code || 'ACT-DEMO-'+(i+1), barcode: x.barcode || 'DEMO-'+Date.now()+'-'+i, status: 'Disponible', assignedTo: '-', requestedAt: '-', returnedAt: '-', teacher: '-', location: x.location_detail || 'Lab. Robótica' })));
  renderView(); return { inserted: mapped.length, skipped: 0, errors: [] };
}
function openImport(module) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,text/csv';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (module === 'inventory') {
          Swal.fire({ title: 'Importando inventario...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          const res = await importInventoryCsv(file, String(reader.result || ''));
          if (window.sb?.enabled) {
            await new Promise(r => setTimeout(r, 450));
            state.inventory = dedupeInventoryRows(await window.sb.listInventory());
          }
          state.inventoryPage = 1; state.filters.inventorySearch = ''; state.filters.inventoryState = ''; state.filters.inventoryType = ''; renderView(); updateHeader();
          const count = typeof res === 'number' ? res : (res.inserted || 0);
          const skipped = typeof res === 'object' ? (res.skipped || 0) : 0;
          Swal.fire({ icon: 'success', title: 'CSV importado', text: `${count} productos importados correctamente.${skipped ? ' Saltados por duplicados: ' + skipped : ''}` });
        } else {
          Swal.fire({ icon: 'success', title: 'CSV importado', text: `${file.name} cargado para el módulo ${module}.` });
        }
      } catch (error) { Swal.fire({ icon:'error', title:'No se pudo importar CSV', text: error.message }); }
    };
    reader.readAsText(file, 'utf-8');
  };
  input.click();
}

function generateBarcode() {
  const code = `ISM-BAR-${String(state.inventory.length + 1).padStart(6, '0')}`;
  const target = document.getElementById('barcodePreviewBox');
  if (target) target.innerHTML = barcodePreviewMarkup(code);
  Swal.fire({ icon: 'success', title: 'Código generado', text: `Se generó el código ${code} para un insumo sin número de serie.` });
}

function printInventoryBarcodes(items = getFilteredInventory()) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return Swal.fire({ icon:'info', title:'Sin etiquetas', text:'No hay productos para imprimir con el filtro actual.' });
  const labels = list.map(i => `<div class="label-card"><div class="meta top">${escapeHtml(i.code)} · ${escapeHtml(i.item)}</div>${barcodePatternSvg(i.barcode || i.code)}<strong>${escapeHtml(i.barcode || i.code)}</strong><div class="meta">${escapeHtml(i.location_detail || i.location || '')} ${escapeHtml(i.zone || '')}</div><div class="brand">by Ing. Gambino</div></div>`).join('');
  const html = `<!doctype html><html><head><title>Barcodes ISM</title><style>
    *{box-sizing:border-box} body{font-family:Arial,sans-serif;margin:16px;color:#111;background:#fff}.print-btn{margin:0 0 14px;padding:6px 12px}.sheet{display:grid;grid-template-columns:repeat(3,64mm);gap:7mm;align-items:start}.label-card{width:64mm;min-height:32mm;border:1px solid #111;border-radius:4mm;padding:3mm;text-align:center;break-inside:avoid;background:#fff;color:#111;overflow:hidden}.barcode-svg{display:block;width:52mm;height:14mm;margin:1mm auto;background:#fff}.label-card strong{display:block;font-size:10pt;margin-top:1mm;color:#111}.meta{font-size:7pt;color:#222;line-height:1.15;white-space:normal}.meta.top{min-height:8mm}@media print{.print-btn{display:none}@page{margin:10mm}.sheet{grid-template-columns:repeat(3,64mm);gap:6mm}.label-card{page-break-inside:avoid}}
  </style></head><body><button class="print-btn" onclick="window.print()">Imprimir</button><h2>Etiquetas de inventario ISM</h2><div class="sheet">${labels}</div><script>window.onload=()=>setTimeout(()=>window.print(),450)</script></body></html>`;
  const w = window.open('', '_blank');
  if (!w) return Swal.fire({ icon:'warning', title:'Popup bloqueado', text:'Permití ventanas emergentes para imprimir etiquetas.' });
  w.document.open(); w.document.write(html); w.document.close();
}

function notificationRecipientOptions(target) {
  const users = (state.users || []).filter(u => String(u.status || 'Activo').toLowerCase() !== 'inactivo');
  const teams = state.user.role === 'teacher'
    ? (state.teams || []).filter(t => (t.teachers || []).some(name => String(name).toLowerCase() === String(state.user.name || '').toLowerCase()))
    : (state.teams || []);
  if (target === 'team') {
    return teams.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)} · ${(t.courses || []).join(', ')}</option>`).join('') || '<option value="">No hay equipos cargados</option>';
  }
  if (target === 'individual' || target === 'multi') {
    return users.map(u => `<option value="${escapeHtml(u.id)}">${escapeHtml(u.name)} · ${escapeHtml(u.role)} · ${escapeHtml(u.email || '')}</option>`).join('') || '<option value="">No hay usuarios cargados</option>';
  }
  return '<option value="all">Se enviará al grupo seleccionado</option>';
}

function notificationTargetLabel(target) {
  const labels = { all: 'Todos los usuarios', teachers: 'Todos los docentes', students: 'Todos los alumnos', team: 'Equipo específico', multi: 'Selección múltiple', individual: 'Usuario individual' };
  return labels[target] || target;
}

async function openNotificationComposer() {
  const recipientOptions = state.user.role === 'administrator'
    ? `<option value="all">Todos los usuarios</option><option value="teachers">Todos los docentes</option><option value="students">Todos los alumnos</option><option value="team">Equipo específico</option><option value="multi">Selección múltiple</option><option value="individual">Usuario individual</option>`
    : `<option value="team">Mis equipos</option><option value="multi">Selección múltiple</option><option value="individual">Usuario individual</option>`;
  const defaultTarget = state.user.role === 'administrator' ? 'all' : 'team';
  const result = await Swal.fire({
    title: 'Nueva notificación',
    width: 760,
    confirmButtonText: 'Enviar',
    focusConfirm: false,
    html: `
      <div class="swal-form-grid">
        <label><span>Título</span><input id="notifyTitle" class="swal2-input" placeholder="Ej. Cambio de horario"></label>
        <label><span>Destino</span><select id="notifyTarget" class="swal2-select">${recipientOptions}</select></label>
        <label class="full-span"><span>Destinatarios / equipo</span><select id="notifyRecipients" class="swal2-select" multiple size="7">${notificationRecipientOptions(defaultTarget)}</select><small class="muted">Para selección múltiple mantené Ctrl presionado. En destinos grupales no hace falta seleccionar.</small></label>
        <label class="full-span"><span>Mensaje</span><textarea id="notifyMessage" class="swal2-textarea" placeholder="Escribí el contenido de la notificación"></textarea></label>
      </div>`,
    didOpen: () => {
      const targetEl = document.getElementById('notifyTarget');
      const recipientsEl = document.getElementById('notifyRecipients');
      targetEl.value = defaultTarget;
      const refreshRecipients = () => {
        const target = targetEl.value;
        recipientsEl.innerHTML = notificationRecipientOptions(target);
        recipientsEl.disabled = ['all','teachers','students'].includes(target);
        recipientsEl.multiple = target !== 'individual';
        recipientsEl.size = target === 'individual' ? 5 : 7;
      };
      targetEl.addEventListener('change', refreshRecipients);
      refreshRecipients();
    },
    preConfirm: () => {
      const title = document.getElementById('notifyTitle').value.trim();
      const target = document.getElementById('notifyTarget').value;
      const recipientsEl = document.getElementById('notifyRecipients');
      const recipientIds = ['all','teachers','students'].includes(target) ? [] : [...recipientsEl.selectedOptions].map(o => o.value).filter(Boolean);
      const message = document.getElementById('notifyMessage').value.trim();
      if (!title || !message) {
        Swal.showValidationMessage('Completá título y mensaje.');
        return false;
      }
      if (['team','multi','individual'].includes(target) && !recipientIds.length) {
        Swal.showValidationMessage('Seleccioná al menos un destinatario o equipo.');
        return false;
      }
      return { title, target, recipientIds, message };
    }
  });
  if (!result.isConfirmed) return;
  const payload = result.value;
  try {
    if (window.sb?.enabled && window.sb.sendNotification) {
      await window.sb.sendNotification(payload);
      const notifications = await window.sb.listNotifications?.().catch(() => null);
      if (Array.isArray(notifications)) state.notifications = notifications;
    } else {
      state.notifications.unshift({ id: Date.now(), title: payload.title, message: `${payload.message} (${notificationTargetLabel(payload.target)})`, unread: true, section: 'notifications' });
    }
    renderView();
    Swal.fire({ icon: 'success', title: 'Notificación enviada', text: `Destino: ${notificationTargetLabel(payload.target)}` });
  } catch (error) {
    console.error(error);
    Swal.fire({ icon: 'error', title: 'No se pudo enviar', text: error.message || 'Verificá permisos y conexión con Supabase.' });
  }
}

async function openLoanRequest() {
  const items = state.inventory.filter(i => i.status === 'Disponible').map(i => `<option value="${i.code}">${i.code} · ${i.item}</option>`).join('');
  const result = await Swal.fire({
    title: 'Solicitud de préstamo', width: 860, confirmButtonText: 'Solicitar',
    html: `<div class="swal-form-grid"><label><span>Curso / equipo</span><input id="loanCourse" class="swal2-input" placeholder="Ej. Equipo Rover A / 6°C"></label><label><span>Fecha de uso</span><input id="loanDate" type="date" class="swal2-input"></label><label><span>Hora desde</span><input id="loanFrom" type="time" class="swal2-input"></label><label><span>Hora hasta</span><input id="loanTo" type="time" class="swal2-input"></label><label class="full-span"><span>Insumos (1 o más)</span><select id="loanItems" class="swal2-select" multiple size="6">${items}</select></label><label class="full-span"><span>Observaciones</span><textarea id="loanObs" class="swal2-textarea" placeholder="Detalle del pedido y condición esperada"></textarea></label></div>`,
    preConfirm: () => {
      const course = document.getElementById('loanCourse').value.trim();
      const date = document.getElementById('loanDate').value;
      const from = document.getElementById('loanFrom').value;
      const to = document.getElementById('loanTo').value;
      const selected = [...document.getElementById('loanItems').selectedOptions].map(o => o.value);
      const notes = document.getElementById('loanObs').value.trim();
      if (!course || !date || !from || !to || !selected.length) { Swal.showValidationMessage('Completá curso/equipo, fecha, franja horaria y al menos un insumo.'); return false; }
      return { course, date, from, to, selected, notes };
    }
  });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) {
      await window.sb.createLoanRequest(result.value);
      await refreshSupabaseData();
    } else {
      state.loans.unshift({ id: Date.now(), requester: state.user.name, requester_id: state.user.id, team: result.value.course, date: result.value.date, from: result.value.from, to: result.value.to, items: result.value.selected, notes: result.value.notes || '-', status: 'Pendiente' });
      state.notifications.unshift({ id: Date.now()+1, title: 'Nueva solicitud de préstamo', message: state.user.name + ' solicitó ' + result.value.selected.join(', ') + ' para ' + result.value.course + '.', unread: true, section: 'loanManagement' });
    }
    renderView();
    Swal.fire({ icon: 'success', title: 'Solicitud registrada', text: result.value.selected.length + ' insumo(s) solicitados para ' + result.value.course + '.' });
  } catch (error) { Swal.fire({ icon:'error', title:'No se pudo registrar la solicitud', text:error.message || String(error) }); }
}

async function openJoinCourse() {
  const result = await Swal.fire({
    title: 'Suscribirme a un curso',
    width: 640,
    confirmButtonText: 'Ingresar',
    html: `
      <div class="swal-form-grid">
        <label><span>Código del curso</span><input id="joinCode" class="swal2-input" placeholder="Ej. IMP3D-26"></label>
        <label><span>Clave de acceso</span><input id="joinKey" class="swal2-input" placeholder="Ej. makerlab"></label>
      </div>`,
    preConfirm: () => {
      const code = document.getElementById('joinCode').value.trim().toUpperCase();
      const key = document.getElementById('joinKey').value.trim();
      const found = state.modules.find(m => m.code === code && m.accessKey === key);
      if (!found) {
        Swal.showValidationMessage('Código o clave incorrectos.');
        return false;
      }
      return found;
    }
  });
  if (!result.isConfirmed) return;
  const existing = state.studentCourses.find(c => c.title === result.value.title);
  if (!existing) {
    state.studentCourses.unshift({ id: result.value.id, title: result.value.title, teacher: result.value.teacher, team: result.value.team, progress: 0, lessons: result.value.lessons, tasks: result.value.tasks, evaluations: result.value.evaluations, access: 'Incripto', visibility: result.value.visibility });
  }
  openView('courses');
  Swal.fire({ icon: 'success', title: 'Curso agregado', text: `Ahora tenés acceso a ${result.value.title}.` });
}


function buildInventoryChartData(chartType, filters = {}) {
  const items = (state.inventory || []).filter(item => {
    if (filters.status && filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.condition && filters.condition !== 'all' && item.condition !== filters.condition) return false;
    if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false;
    const rawDate = item.created_at || item.createdAt || item.requestedAt || '';
    const d = rawDate && rawDate !== '-' ? new Date(rawDate) : null;
    if (filters.from && d && d < new Date(filters.from)) return false;
    if (filters.to && d && d > new Date(filters.to + 'T23:59:59')) return false;
    return true;
  });
  let labels = [], values = [], label = 'Inventario';
  if (chartType === 'line') {
    const byMonth = {};
    items.forEach(item => {
      const raw = item.created_at || item.createdAt || new Date().toISOString();
      const d = new Date(raw);
      const key = isNaN(d) ? 'Sin fecha' : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    labels = Object.keys(byMonth).sort(); values = labels.map(k => byMonth[k]); label = 'Altas por mes';
  } else {
    const field = filters.groupBy || (chartType === 'pie' ? 'condition' : 'status');
    const counts = {};
    items.forEach(item => { const key = item[field] || 'Sin dato'; counts[key] = (counts[key] || 0) + 1; });
    labels = Object.keys(counts); values = labels.map(k => counts[k]); label = field === 'condition' ? 'Condición' : field === 'type' ? 'Tipo' : 'Estado';
  }
  if (!labels.length) { labels = ['Sin datos']; values = [0]; }
  return { labels, datasets: [{ label, data: values }] };
}

async function openInventoryCharts() {
  let chart;
  const statuses = [...new Set((state.inventory || []).map(i => i.status).filter(Boolean))];
  const conditions = [...new Set((state.inventory || []).map(i => i.condition).filter(Boolean))];
  await Swal.fire({
    title: 'Gráficos de inventario',
    width: 980,
    showConfirmButton: false,
    showCloseButton: true,
    html: `<div class="swal-form-grid chart-filter-grid">
      <label><span>Tipo de gráfico</span><select id="invChartType" class="swal2-select"><option value="bar">Barras</option><option value="pie">Torta</option><option value="line">Línea</option></select></label>
      <label><span>Agrupar por</span><select id="invGroupBy" class="swal2-select"><option value="status">Estado</option><option value="condition">Condición</option><option value="type">Tipo</option></select></label>
      <label><span>Desde</span><input id="invDateFrom" type="date" class="swal2-input"></label>
      <label><span>Hasta</span><input id="invDateTo" type="date" class="swal2-input"></label>
      <label><span>Estado</span><select id="invStatusFilter" class="swal2-select"><option value="all">Todos</option>${statuses.map(x=>`<option value="${escapeAttr(x)}">${escapeHtml(x)}</option>`).join('')}</select></label>
      <label><span>Condición</span><select id="invConditionFilter" class="swal2-select"><option value="all">Todas</option>${conditions.map(x=>`<option value="${escapeAttr(x)}">${escapeHtml(x)}</option>`).join('')}</select></label>
      <label><span>Tipo</span><select id="invTypeFilterModal" class="swal2-select"><option value="all">Todos</option><option>Equipo</option><option>Insumo</option></select></label>
      <div class="full-span" style="height:380px;padding-top:8px"><canvas id="inventoryModalChart"></canvas></div>
    </div>`,
    didOpen: () => {
      const ctx = document.getElementById('inventoryModalChart');
      const collect = () => ({
        groupBy: document.getElementById('invGroupBy').value,
        status: document.getElementById('invStatusFilter').value,
        condition: document.getElementById('invConditionFilter').value,
        type: document.getElementById('invTypeFilterModal').value,
        from: document.getElementById('invDateFrom').value,
        to: document.getElementById('invDateTo').value
      });
      const redraw = () => {
        const type = document.getElementById('invChartType').value;
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
          type,
          data: buildInventoryChartData(type, collect()),
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor() } } }, scales: type === 'pie' ? {} : { x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } }, y: { beginAtZero: true, ticks: { color: chartTextColor(), precision: 0 }, grid: { color: chartGridColor() } } } }
        });
      };
      ['invChartType','invGroupBy','invStatusFilter','invConditionFilter','invTypeFilterModal','invDateFrom','invDateTo'].forEach(id => document.getElementById(id)?.addEventListener('change', redraw));
      redraw();
    },
    willClose: () => { if (chart) chart.destroy(); }
  });
}

function openChartPreview(module='dashboard') {
  Swal.fire({ title: 'Ver gráficos', width: 860, showConfirmButton: false, html: `<div class="swal-form-grid"><label><span>Tipo</span><select id="chartTypeSelect" class="swal2-select"><option value="bar">Barras</option><option value="line">Línea</option><option value="pie">Torta</option></select></label><label><span>Módulo</span><input class="swal2-input" value="${module}" disabled></label><div class="full-span" style="height:340px;padding-top:8px"><canvas id="modalChartCanvas"></canvas></div></div>`, didOpen: () => { new Chart(document.getElementById('modalChartCanvas'), { type: 'bar', data: { labels: ['A','B','C'], datasets: [{ label: module, data: [5,3,4] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor() } } }, scales: { x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } }, y: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } } } } }); } });
}

function openFormPreview(kind='resource') {
  const forms = {
    resource: ['Nuevo recurso', `<div class="swal-form-grid"><label><span>Título</span><input class="swal2-input" placeholder="Ej. Manual Arduino ISM"></label><label><span>Tipo</span><select class="swal2-select"><option>PDF</option><option>Video</option><option>Documento</option><option>TXT</option><option>ZIP</option><option>GitHub</option></select></label><label><span>Categoría</span><input class="swal2-input" placeholder="Electrónica"></label><label><span>Archivo / URL</span><input class="swal2-input" placeholder="https://... o nombre de archivo"></label><label class="full-span"><span>Descripción</span><textarea class="swal2-textarea" placeholder="Detalle del recurso"></textarea></label></div>`],
    course: ['Nuevo curso', `<div class="swal-form-grid"><label><span>Nombre del curso</span><input class="swal2-input"></label><label><span>Visibilidad</span><select class="swal2-select"><option>Público</option><option>Solo equipos asignados</option></select></label><label><span>Equipo / cursos permitidos</span><input class="swal2-input"></label><label><span>Clave de acceso</span><input class="swal2-input"></label><label class="full-span"><span>Descripción</span><textarea class="swal2-textarea"></textarea></label></div>`],
    module: ['Nuevo módulo', `<div class="swal-form-grid"><label><span>Nombre del módulo</span><input class="swal2-input"></label><label><span>Categoría</span><input class="swal2-input"></label><label class="full-span"><span>Descripción</span><textarea class="swal2-textarea"></textarea></label></div>`],
    lesson: ['Nueva lección', `<div class="swal-form-grid"><label><span>Título</span><input class="swal2-input"></label><label><span>Duración</span><input class="swal2-input" placeholder="45 min"></label><label><span>Video</span><input class="swal2-input" placeholder="URL YouTube"></label><label><span>Archivo adjunto</span><input class="swal2-input" placeholder="PDF / ZIP / Link"></label><label class="full-span"><span>Contenido</span><textarea class="swal2-textarea"></textarea></label></div>`],
    task: ['Nueva tarea', `<div class="swal-form-grid"><label><span>Título</span><input class="swal2-input"></label><label><span>Puntaje</span><input class="swal2-input"></label><label><span>Reintentos</span><input class="swal2-input"></label><label><span>Fecha límite</span><input type="date" class="swal2-input"></label><label class="full-span"><span>Consigna</span><textarea class="swal2-textarea"></textarea></label></div>`],
    quiz: ['Nuevo evaluativo', `<div class="swal-form-grid"><label><span>Título</span><input class="swal2-input"></label><label><span>Intentos</span><input class="swal2-input"></label><label><span>Pregunta</span><input class="swal2-input"></label><label><span>Respuesta correcta</span><input class="swal2-input"></label><label class="full-span"><span>Opciones</span><textarea class="swal2-textarea" placeholder="Una por línea"></textarea></label></div>`],
    access: ['Nuevo registro RFID', `<div class="swal-form-grid"><label><span>Usuario</span><input class="swal2-input"></label><label><span>Tarjeta RFID</span><input class="swal2-input"></label><label><span>Categoría</span><input class="swal2-input"></label><label><span>Sala</span><input class="swal2-input"></label><label><span>Ingreso</span><input type="datetime-local" class="swal2-input"></label><label><span>Salida</span><input type="datetime-local" class="swal2-input"></label></div>`]
  };
  const [title, html] = forms[kind] || forms.resource;
  Swal.fire({ title, width: 860, html, confirmButtonText: 'Guardar demo' });
}

async function updateLoanStatus(id, status) {
  const loan = state.loans.find(l => String(l.id) === String(id));
  if (!loan) return;
  try {
    if (window.sb?.enabled) await window.sb.updateLoanStatus(id, status);
    loan.status = status;
    await refreshSupabaseData();
    renderView();
    showToast('Préstamo actualizado', status);
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: error.message || String(error) });
  }
}


function getRecordByType(type, id) {
  const nId = Number(id);
  if (type === 'user') return state.users.find(x => String(x.id) === String(id) || x.id === nId);
  if (type === 'inventory') return state.inventory.find(x => String(x.id) === String(id) || x.id === nId);
  if (type === 'team') return state.teams.find(x => String(x.id) === String(id) || x.id === nId);
  return null;
}

async function handleTableAction(type, action, id) {
  const row = getRecordByType(type, id);
  if (!row) return Swal.fire({ icon: 'warning', title: 'Registro no encontrado' });
  if (action === 'view') return viewRecord(type, row);
  if (action === 'edit') return editRecord(type, row);
  if (action === 'duplicate' && type === 'inventory') return duplicateInventoryAsset(row);
  if (action === 'delete') return deleteRecord(type, row);
}

function profileChip(person, fallbackRole='Integrante') {
  const p = typeof person === 'string' ? { name: person } : (person || {});
  return `<div class="org-person"><img src="${escapeAttr(p.avatar_url || './assets/avatar-default.svg')}" onerror="this.src='./assets/avatar-default.svg'" alt="${escapeAttr(p.name || fallbackRole)}"><strong>${escapeHtml(p.name || '-')}</strong><small>${escapeHtml(fallbackRole)}</small></div>`;
}

function viewRecord(type, row) {
  const title = type === 'user' ? 'Detalle de usuario' : type === 'inventory' ? 'Detalle de inventario' : 'Detalle de equipo';
  if (type === 'team') {
    const mentors = (row.teacher_people && row.teacher_people.length) ? row.teacher_people : (row.teachers || []).map(name => ({ name, avatar_url:'./assets/avatar-default.svg' }));
    const students = (row.student_people && row.student_people.length) ? row.student_people : (row.student_names || []).map(name => ({ name, avatar_url:'./assets/avatar-default.svg' }));
    const html = `<div class="team-detail-rich">
      ${row.logo_url ? `<img class="team-detail-logo" src="${escapeAttr(row.logo_url)}" onerror="this.style.display='none'" alt="Logo del equipo">` : ''}
      <div class="detail-grid pretty">
        <div><strong>ID</strong><span>${escapeHtml(row.id || '-')}</span></div>
        <div><strong>Nombre</strong><span>${escapeHtml(row.name || '-')}</span></div>
        <div><strong>Proyecto</strong><span>${escapeHtml(row.project || '-')}</span></div>
        <div><strong>Descripción</strong><span>${escapeHtml(row.description || '-')}</span></div>
        <div><strong>Cursos</strong><span>${escapeHtml((row.courses || []).join(', ') || '-')}</span></div>
        <div><strong>Divisiones</strong><span>${escapeHtml((row.divisions || []).join(', ') || '-')}</span></div>
        <div><strong>Mentores</strong><span>${escapeHtml(mentors.map(m => m.name).join(', ') || '-')}</span></div>
        <div><strong>Alumnos</strong><span>${escapeHtml(students.map(m => m.name).join(', ') || '-')}</span></div>
      </div>
      <h3>Integrantes del equipo</h3>
      <div class="org-chart"><h4>Mentores</h4><div class="org-row">${mentors.map(m => profileChip(m, 'Mentor')).join('') || '<span class="muted">Sin mentores</span>'}</div><h4>Alumnos</h4><div class="org-row">${students.map(m => profileChip(m, 'Alumno')).join('') || '<span class="muted">Sin alumnos</span>'}</div></div>
    </div>`;
    return Swal.fire({ title, html, width: 920, confirmButtonText: 'Cerrar' });
  }
  const labels = { name:'Nombre completo', email:'Email', role:'Rol', role_code:'Código de rol', whatsapp:'WhatsApp', dni:'DNI', status:'Estado', birth_date:'Fecha de nacimiento', title:'Título / Certificados', student_course_name:'Curso', student_division_name:'División', course:'Curso', division:'División', code:'Código', item:'Insumo', type:'Tipo', brand:'Marca', supplier:'Empresa / proveedor', serial:'N° serie', barcode:'Código de barras', condition:'Condición', location_detail:'Localización física', zone:'Zona', location:'Ubicación', image_url:'Imagen' };
  const preferred = type === 'user' ? ['name','email','role','role_code','whatsapp','dni','status','birth_date','student_course_name','student_division_name','course','division','title'] : Object.keys(row);
  const avatarSrc = row.avatar_url || './assets/avatar-default.svg';
  const certText = row.role_code === 'student' || row.role === 'Alumno' ? 'Los certificados del alumno se generan desde cursos finalizados del Campus Virtual.' : (row.title || '-');
  const invImage = type === 'inventory' && row.image_url ? `<div class="inventory-detail-image full-span"><img src="${escapeAttr(row.image_url)}" onerror="this.style.display='none'" alt="Imagen de inventario"></div>` : '';
  const html = `<div class="user-detail-card">${type === 'user' ? `<div class="user-detail-header"><img src="${escapeAttr(avatarSrc)}" onerror="this.src='./assets/avatar-default.svg'"/><div><h3>${escapeHtml(row.name || '-')}</h3><p>${escapeHtml(row.email || '-')}</p><span class="status ${row.status === 'Activo' ? 'ok' : 'warn'}">${escapeHtml(row.status || '-')}</span></div></div>` : ''}${invImage}<div class="detail-grid pretty">${preferred.filter(k => k in row).map(k => `<div class="${k === 'title' || k === 'image_url' ? 'full-span' : ''}"><strong>${escapeHtml(labels[k] || k)}</strong><span>${k === 'image_url' && row[k] ? `<a href="${escapeAttr(row[k])}" target="_blank">Ver imagen</a>` : escapeHtml(k === 'title' ? certText : (Array.isArray(row[k]) ? row[k].map(x => typeof x === 'object' ? (x.name || x.full_name || '') : x).filter(Boolean).join(', ') : row[k] || '-'))}</span></div>`).join('')}</div></div>`;
  return Swal.fire({ title, html, width: 820, confirmButtonText: 'Cerrar' });
}

async function duplicateInventoryAsset(row) {
  if (state.user.role !== 'administrator') return Swal.fire({ icon:'warning', title:'Acción no permitida', text:'Solo el administrador puede duplicar insumos.' });
  const copy = { ...row, __duplicate: true, id: null, code: '', barcode: '', serial: row.serial || '', item: `${row.item || 'Insumo'} (copia)` };
  return openInventoryAssetForm(copy);
}

async function editRecord(type, row) {
  if (type === 'user') return editUserRecord(row);
  if (type === 'inventory') return editInventoryRecord(row);
  if (type === 'team') return editTeamRecord(row);
}

async function editTeamRecord(row) {
  return openTeamForm(row);
}

async function editUserRecord(row) {
  const editingSelf = String(row?.id || '') === String(state.user?.id || '');
  const lockedStudent = editingSelf && isCurrentStudent();
  const currentRole = lockedStudent ? 'Alumno' : roleLabelFromAny(row.role);
  const currentCourse = row.student_course_name || row.course || row.course_name || '';
  const currentDivision = row.student_division_name || row.division || row.division_name || '';
  const roleControl = lockedStudent
    ? `<input class="swal2-input" value="Alumno" disabled><input id="editRole" type="hidden" value="Alumno">`
    : `<select id="editRole" class="swal2-select"><option ${currentRole==='Administrador'?'selected':''}>Administrador</option><option ${currentRole==='Docente'?'selected':''}>Docente</option><option ${currentRole==='Alumno'?'selected':''}>Alumno</option></select>`;
  const result = await Swal.fire({
    title: 'Editar usuario', width: 900,
    html: `<div class="swal-form-grid">
      <label><span>Nombre completo</span><input id="editName" class="swal2-input" value="${escapeHtml(row.name)}"></label>
      <label><span>Email</span><input id="editEmail" class="swal2-input" value="${escapeHtml(row.email)}" disabled></label>
      <label><span>Rol</span>${roleControl}<small class="form-help">${lockedStudent ? 'Tu rol de alumno no puede modificarse desde Mi perfil.' : 'Solo el administrador puede cambiar roles.'}</small></label>
      <label><span>Estado</span><select id="editStatus" class="swal2-select" ${lockedStudent ? 'disabled' : ''}><option ${row.status==='Activo'?'selected':''}>Activo</option><option ${row.status==='Inactivo'?'selected':''}>Inactivo</option><option ${row.status==='Pendiente'?'selected':''}>Pendiente</option></select></label>
      <label><span>DNI</span><input id="editDni" class="swal2-input" value="${escapeHtml(row.dni || '')}"></label>
      <label><span>WhatsApp</span><input id="editWhatsapp" class="swal2-input" value="${escapeHtml(row.whatsapp || '')}"></label>
      <label><span>Fecha de nacimiento</span><input id="editBirthDate" type="date" class="swal2-input" value="${escapeHtml(row.birth_date || '')}"></label>
      <label id="editTitleWrap"><span>Título / Especialidad</span><input id="editTitle" class="swal2-input" value="${escapeHtml(row.title || '')}" placeholder="Título, materia o especialidad"></label>
      <label id="editCourseWrap"><span>Curso</span><select id="editCourse" class="swal2-select">${courseOptions(currentCourse)}</select></label>
      <label id="editDivisionWrap"><span>División</span><select id="editDivision" class="swal2-select">${divisionOptions(currentDivision)}</select><small class="form-help">Divisiones base A, B y C. Si el perfil ya tiene otra división, se conserva y se muestra.</small></label>
      <label class="full-span"><span>Foto de perfil</span><div class="avatar-edit-box"><img id="editAvatarPreview" src="${escapeAttr(row.avatar_url || './assets/avatar-default.svg')}" onerror="this.src='./assets/avatar-default.svg'" alt="Foto actual"><input id="editAvatarFile" type="file" accept="image/*"></div><input id="editAvatar" class="swal2-input" value="${escapeHtml(row.avatar_url || '')}" placeholder="URL opcional o base64 existente"></label>
    </div>`,
    showCancelButton: true, confirmButtonText: 'Guardar', cancelButtonText: 'Cancelar',
    didOpen: () => {
      const roleEl = document.getElementById('editRole');
      const sync = () => {
        const isStudent = roleEl.value === 'Alumno';
        document.getElementById('editCourseWrap').style.display = isStudent ? '' : 'none';
        document.getElementById('editDivisionWrap').style.display = isStudent ? '' : 'none';
        document.getElementById('editTitleWrap').style.display = isStudent ? 'none' : '';
      };
      if (!lockedStudent) roleEl.addEventListener('change', sync); sync();
      const avatarFile = document.getElementById('editAvatarFile');
      const avatarInput = document.getElementById('editAvatar');
      const avatarPreview = document.getElementById('editAvatarPreview');
      avatarFile?.addEventListener('change', async () => { const dataUrl = await readFileAsDataUrl(avatarFile.files?.[0]); if (dataUrl) { avatarInput.value = dataUrl; avatarPreview.src = dataUrl; } });
    },
    preConfirm: async () => {
      const role = lockedStudent ? 'Alumno' : document.getElementById('editRole').value;
      if (role === 'Alumno' && (!document.getElementById('editCourse').value || !document.getElementById('editDivision').value)) return Swal.showValidationMessage('Para alumnos, Curso y División son obligatorios');
      const fileData = await readFileAsDataUrl(document.getElementById('editAvatarFile').files?.[0]);
      const avatarValue = fileData || document.getElementById('editAvatar').value.trim() || row.avatar_url || './assets/avatar-default.svg';
      return { name: document.getElementById('editName').value.trim(), role, status: lockedStudent ? (row.status || 'Activo') : document.getElementById('editStatus').value, dni: document.getElementById('editDni').value.trim(), whatsapp: document.getElementById('editWhatsapp').value.trim(), birth_date: document.getElementById('editBirthDate').value || null, title: role === 'Alumno' ? null : document.getElementById('editTitle').value.trim(), student_course_name: role === 'Alumno' ? document.getElementById('editCourse').value : null, student_division_name: role === 'Alumno' ? document.getElementById('editDivision').value : null, avatar_url: avatarValue };
    }
  });
  if (!result.isConfirmed) return;
  try { if (window.sb?.enabled) await window.sb.updateProfileFull(row.id, result.value); Object.assign(row, result.value); if (String(row.id) === String(state.user?.id)) Object.assign(state.user, result.value, { course: result.value.student_course_name || state.user.course, division: result.value.student_division_name || state.user.division }); await refreshSupabaseData(); if (String(row.id) === String(state.user?.id)) { const fresh = state.users.find(u => String(u.id) === String(row.id)); if (fresh) state.user = { ...state.user, ...fresh, role: state.user.role }; } renderView(); showToast('Usuario actualizado'); }
  catch (error) { Swal.fire({ icon:'error', title:'No se pudo actualizar', text:error.message }); }
}

async function editInventoryRecord(row) {
  if (state.user.role !== 'administrator') return Swal.fire({ icon:'warning', title:'Acción no permitida', text:'Solo el administrador puede editar insumos.' });
  return openInventoryAssetForm(row);
}

async function deleteRecord(type, row) {
  if (type === 'inventory' && state.user.role !== 'administrator') return Swal.fire({ icon:'warning', title:'Acción no permitida', text:'Solo el administrador puede eliminar insumos.' });
  const result = await Swal.fire({ icon: 'warning', title: 'Eliminar registro', text: type === 'user' ? 'Se eliminará el usuario del ABM y de Auth/Profiles. Esta acción no se puede deshacer.' : 'Se eliminará el registro seleccionado.', showCancelButton: true, confirmButtonText: 'Eliminar definitivamente', cancelButtonText: 'Cancelar' });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) {
      if (type === 'user') await window.sb.deleteProfile(row.id);
      if (type === 'inventory') await window.sb.softDeleteInventoryAsset(row.id);
      if (type === 'team') await window.sb.deleteTeam(row.id);
    }
    if (type === 'user') state.users = state.users.filter(x => String(x.id) !== String(row.id));
    if (type === 'inventory') state.inventory = state.inventory.filter(x => String(x.id) !== String(row.id));
    if (type === 'team') state.teams = state.teams.filter(x => String(x.id) !== String(row.id));
    await refreshSupabaseData(); renderView(); showToast('Registro eliminado');
  } catch (error) { Swal.fire({ icon:'error', title:'No se pudo eliminar', text:error.message }); }
}

function openResourceViewer(id) {
  Swal.fire({ title: 'Recurso', text: `Recurso seleccionado: ${id}`, confirmButtonText: 'Cerrar' });
}

function attachViewEvents() {
  appContent.querySelectorAll('[data-view-btn]').forEach(btn => btn.addEventListener('click', () => openView(btn.dataset.viewBtn)));
  appContent.querySelectorAll('.notification-select').forEach(btn => btn.addEventListener('click', () => selectNotification(btn.dataset.id)));
  appContent.querySelectorAll('[data-import]').forEach(btn => btn.addEventListener('click', () => openImport(btn.dataset.import)));
  appContent.querySelectorAll('[data-export]').forEach(btn => btn.addEventListener('click', () => triggerDownload(`${btn.dataset.export}.csv`, csvFromRows(dataByModule(btn.dataset.export)))));
  appContent.querySelectorAll('[data-action][data-type][data-id]').forEach(btn => btn.addEventListener('click', () => handleTableAction(btn.dataset.type, btn.dataset.action, btn.dataset.id)));
  document.getElementById('newRoleBtn')?.addEventListener('click', () => openRoleForm());
  appContent.querySelectorAll('[data-role-action][data-id]').forEach(btn => btn.addEventListener('click', () => handleRoleAction(btn.dataset.roleAction, btn.dataset.id)));
  appContent.querySelectorAll('[data-create]').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.create === 'user') return openUserProfileForm();
    if (btn.dataset.create === 'inventory') return openInventoryAssetForm();
    if (btn.dataset.create === 'team') return openTeamForm();
    return openFormPreview(btn.dataset.create === 'module' ? 'course' : btn.dataset.create);
  }));
  appContent.querySelectorAll('[data-preview-form]').forEach(btn => btn.addEventListener('click', () => openFormPreview(btn.dataset.previewForm)));
  appContent.querySelectorAll('[data-view-resource]').forEach(btn => btn.addEventListener('click', () => openResourceViewer(btn.dataset.viewResource)));
  appContent.querySelectorAll('[data-open-student-course]').forEach(btn => btn.addEventListener('click', () => { state.selectedStudentCourse = state.studentCourses.find(c => c.title === btn.dataset.openStudentCourse); state.currentCourseScreen = 'detail'; state.courseContentTab = 'lesson'; renderView(); }));
  appContent.querySelectorAll('.course-select-tab').forEach(btn => btn.addEventListener('click', () => { state.courseContentTab = btn.dataset.courseTab; renderView(); }));
  document.getElementById('backCampusBtn')?.addEventListener('click', () => { state.currentCourseScreen = 'list'; state.selectedStudentCourse = null; state.courseContentTab = 'lesson'; renderView(); });
  document.getElementById('newCourseBtn')?.addEventListener('click', () => openFormPreview('course'));
  document.getElementById('addModuleBtn')?.addEventListener('click', () => openFormPreview('module'));
  document.getElementById('newResourceBtn')?.addEventListener('click', () => openFormPreview('resource'));
  document.getElementById('courseChartsBtn')?.addEventListener('click', () => openChartPreview('courses'));
  document.getElementById('libraryChartsBtn')?.addEventListener('click', () => openChartPreview('library'));
  document.getElementById('loanChartsBtn')?.addEventListener('click', () => openChartPreview('loanManagement'));
  document.getElementById('accessChartsBtn')?.addEventListener('click', () => openChartPreview('accessControl'));
  document.getElementById('resourceCategoryBtn')?.addEventListener('click', () => Swal.fire({ title: 'Categorías', text: 'Podrás agregar categorías faltantes en la integración real.' }));
  document.getElementById('manageCategoriesBtn')?.addEventListener('click', () => Swal.fire({ title: 'Categorías de acceso', text: 'Podrás agregar categorías personalizadas para RFID.' }));
  appContent.querySelectorAll('[data-approve-loan]').forEach(btn => btn.addEventListener('click', () => updateLoanStatus(btn.dataset.approveLoan, 'Aprobado')));
  appContent.querySelectorAll('[data-reject-loan]').forEach(btn => btn.addEventListener('click', () => updateLoanStatus(btn.dataset.rejectLoan, 'Rechazado')));
  appContent.querySelectorAll('[data-return-loan]').forEach(btn => btn.addEventListener('click', () => updateLoanStatus(btn.dataset.returnLoan, 'Devuelto')));
  document.getElementById('periodFilter')?.addEventListener('change', e => { state.filters.period = e.target.value; renderCharts(); showToast('Filtro aplicado', 'Se actualizaron los gráficos'); });
  document.getElementById('userSearch')?.addEventListener('input', e => { state.filters.userSearch = e.target.value; renderView(); });
  document.getElementById('userRoleFilter')?.addEventListener('change', e => { state.filters.userRole = e.target.value; renderView(); });
  document.getElementById('inventorySearch')?.addEventListener('input', debounce(e => { state.filters.inventorySearch = e.target.value; renderView(); setTimeout(() => { const el = document.getElementById('inventorySearch'); if (el) { el.focus(); const len = el.value.length; el.setSelectionRange(len, len); } }, 0); }, 300));
  document.getElementById('inventoryStateFilter')?.addEventListener('change', e => { state.filters.inventoryState = e.target.value; state.inventoryPage = 1; renderView(); });
  document.getElementById('inventoryTypeFilter')?.addEventListener('change', e => { state.filters.inventoryType = e.target.value; state.inventoryPage = 1; renderView(); });
  document.getElementById('generateBarcodeBtn')?.addEventListener('click', generateBarcode);
  document.getElementById('printBarcodesBtn')?.addEventListener('click', () => printInventoryBarcodes(getFilteredInventory()));
  document.querySelectorAll('.inventory-page-size').forEach(el => el.addEventListener('change', e => { state.inventoryPageSize = Number(e.target.value) || 10; state.inventoryPage = 1; renderView(); }));
  document.querySelectorAll('.inventory-prev-page').forEach(el => el.addEventListener('click', () => { state.inventoryPage = Math.max(1, state.inventoryPage - 1); renderView(); }));
  document.querySelectorAll('.inventory-next-page').forEach(el => el.addEventListener('click', () => { const totalPages = Math.max(1, Math.ceil(getFilteredInventory().length / state.inventoryPageSize)); state.inventoryPage = Math.min(totalPages, state.inventoryPage + 1); renderView(); }));
  document.querySelectorAll('.notifications-page-size').forEach(el => el.addEventListener('change', e => { state.notificationsPageSize = Number(e.target.value) || 10; state.notificationsPage = 1; renderView(); }));
  document.querySelectorAll('.notifications-prev-page').forEach(el => el.addEventListener('click', () => { state.notificationsPage = Math.max(1, state.notificationsPage - 1); renderView(); }));
  document.querySelectorAll('.notifications-next-page').forEach(el => el.addEventListener('click', () => { const totalPages = Math.max(1, Math.ceil((state.notifications || []).length / state.notificationsPageSize)); state.notificationsPage = Math.min(totalPages, state.notificationsPage + 1); renderView(); }));
  document.getElementById('inventoryChartsBtn')?.addEventListener('click', () => openInventoryCharts());
  document.getElementById('inventorySelectAll')?.addEventListener('change', e => {
    appContent.querySelectorAll('.inventory-row-check').forEach(cb => { cb.checked = e.target.checked; if (cb.checked) state.selectedInventoryIds.add(String(cb.dataset.id)); else state.selectedInventoryIds.delete(String(cb.dataset.id)); });
  });
  appContent.querySelectorAll('.inventory-row-check').forEach(cb => cb.addEventListener('change', () => { if (cb.checked) state.selectedInventoryIds.add(String(cb.dataset.id)); else state.selectedInventoryIds.delete(String(cb.dataset.id)); }));
  document.getElementById('bulkInventoryEditBtn')?.addEventListener('click', openBulkInventoryEdit);
  document.getElementById('bulkInventoryDeleteBtn')?.addEventListener('click', bulkDeleteInventory);
  appContent.querySelectorAll('[data-print-barcode]').forEach(btn => btn.addEventListener('click', () => { const item = state.inventory.find(x => String(x.id) === String(btn.dataset.printBarcode)); if (item) printInventoryBarcodes([item]); }));
  appContent.querySelectorAll('[data-image-src]').forEach(btn => btn.addEventListener('click', () => Swal.fire({ title: btn.dataset.imageTitle || 'Imagen', imageUrl: btn.dataset.imageSrc, imageAlt: btn.dataset.imageTitle || 'Imagen', width: 900, confirmButtonText: 'Cerrar' })));
  document.getElementById('newInventoryItemBtn')?.addEventListener('click', openInventoryAssetForm);
  document.getElementById('loanRequestBtn')?.addEventListener('click', openLoanRequest);
  document.getElementById('loanRequestBtn2')?.addEventListener('click', openLoanRequest);
  document.getElementById('massNotifyBtn')?.addEventListener('click', openNotificationComposer);
  document.getElementById('notificationsSelectAll')?.addEventListener('change', e => appContent.querySelectorAll('.notification-row-check').forEach(cb => cb.checked = e.target.checked));
  document.getElementById('markSelectedReadBtn')?.addEventListener('click', () => bulkMarkNotifications(true));
  document.getElementById('markSelectedUnreadBtn')?.addEventListener('click', () => bulkMarkNotifications(false));
  document.getElementById('clearUnreadBtn')?.addEventListener('click', () => bulkMarkNotifications(true, true));
  document.getElementById('joinCourseBtn')?.addEventListener('click', openJoinCourse);
  document.getElementById('editProfileBtn')?.addEventListener('click', () => editUserRecord(state.user));
  document.getElementById('saveSettingsBtn')?.addEventListener('click', saveGeneralSettings);
}

async function fileToDataUrl(file) {
  if (!file) return null;
  return await new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
}

async function saveGeneralSettings() {
  try {
    const current = state.generalSettings || JSON.parse(localStorage.getItem('ism_general_settings') || '{}');
    const logoFile = document.getElementById('institutionLogoInput')?.files?.[0] || null;
    const logoDataUrl = logoFile ? await fileToDataUrl(logoFile) : current.logoDataUrl;
    const payload = {
      institutionName: document.getElementById('institutionNameInput')?.value?.trim() || 'Ministerio de Educación Tucumán',
      institutionEmail: document.getElementById('institutionEmailInput')?.value?.trim() || 'robotica@ism.edu.ar',
      logoDataUrl: logoDataUrl || ''
    };
    state.generalSettings = payload;
    localStorage.setItem('ism_general_settings', JSON.stringify(payload));
    if (window.sb?.enabled && window.sb.saveAppSetting) await window.sb.saveAppSetting('general_config', payload);
    await Swal.fire({ icon:'success', title:'Configuración guardada', text:'Las configuraciones generales fueron actualizadas.' });
    renderView();
  } catch (error) { Swal.fire({ icon:'error', title:'No se pudo guardar', text:error.message || String(error) }); }
}

function bindEvents() {
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(document.body.classList.contains('light') ? 'dark' : 'light');
    renderCharts();
  });
  document.getElementById('sidebarToggle').addEventListener('click', () => appShell.classList.toggle('collapsed'));
  document.getElementById('profileNameBtn').addEventListener('click', () => openView('profile'));
  document.getElementById('avatarUploadBtn').addEventListener('click', () => document.getElementById('avatarInput').click());
  document.getElementById('avatarInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        state.user.avatar_url = reader.result;
        localStorage.setItem('ism_demo_user', JSON.stringify(state.user));
        if (window.sb?.enabled) await window.sb.updateMyAvatar(reader.result);
        updateHeader();
        if (state.currentView === 'profile') renderView();
        showToast('Foto actualizada', 'La imagen quedó guardada en Supabase');
      } catch (error) {
        Swal.fire({ icon:'error', title:'No se pudo guardar la foto', text:error.message });
      }
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('fullscreenBtn').addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  });
  const doLogout = async () => {
    const result = await Swal.fire({ icon: 'question', title: 'Cerrar sesión', text: '¿Deseás salir del sistema?', showCancelButton: true, confirmButtonText: 'Salir', cancelButtonText: 'Cancelar' });
    if (!result.isConfirmed) return;
    localStorage.removeItem('ism_demo_user');
    await window.sb.signOut();
    window.location.href = './index.html';
  };
  document.getElementById('headerLogoutBtn').addEventListener('click', doLogout);
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.nav-item[data-view]');
    if (navBtn) openView(navBtn.dataset.view);
    if (e.target.closest('#sidebarLogoutBtn')) doLogout();
    if (e.target.closest('#notificationsBtn')) {
      state.notificationsOpen = !state.notificationsOpen;
      renderNotificationDropdown();
      return;
    }
    if (!e.target.closest('#notificationsWrapper')) {
      state.notificationsOpen = false;
      renderNotificationDropdown();
    }
    const previewAction = e.target.closest('#notificationsPreview [data-view-btn]');
    if (previewAction) openView(previewAction.dataset.viewBtn);
    const previewSelect = e.target.closest('#notificationsPreview .notification-select');
    if (previewSelect) selectNotification(previewSelect.dataset.id);
  });
}


async function refreshSupabaseData() {
  if (!window.sb?.enabled) return;
  try {
    const [profile, users, inventory, teams, loans, roles, notifications, conditions, permissions, supportTickets, ticketStatuses, ticketIncidents, generalSettings] = await Promise.all([
      window.sb.fetchProfile().catch(() => null),
      window.sb.listProfiles().catch(() => null),
      window.sb.listInventory().catch(() => null),
      window.sb.listTeams?.().catch(() => null),
      window.sb.listLoans?.().catch(() => null),
      window.sb.listRoles?.().catch(() => null),
      window.sb.listNotifications?.().catch(() => null),
      window.sb.listInventoryConditions?.().catch(() => null),
      window.sb.listPermissions?.().catch(() => null),
      window.sb.listSupportTickets?.().catch(() => null),
      window.sb.listTicketStatuses?.().catch(() => null),
      window.sb.listTicketIncidents?.().catch(() => null),
      window.sb.getAppSetting?.('general_config').catch(() => null)
    ]);
    if (profile) {
      state.user = profile;
      localStorage.setItem('ism_demo_user', JSON.stringify(profile));
      updateHeader();
    }
    if (Array.isArray(users) && users.length) state.users = users;
    if (Array.isArray(inventory)) state.inventory = dedupeInventoryRows(inventory);
    setupInventoryRealtime();
    if (Array.isArray(teams) && teams.length) state.teams = teams;
    if (Array.isArray(loans) && loans.length) state.loans = loans;
    if (Array.isArray(roles) && roles.length) state.rolesData = roles;
    if (Array.isArray(notifications)) state.notifications = notifications;
    if (Array.isArray(conditions)) state.inventoryConditions = conditions;
    if (Array.isArray(permissions)) state.permissionsData = permissions;
    if (Array.isArray(supportTickets)) state.supportTickets = supportTickets;
    if (Array.isArray(ticketStatuses) && ticketStatuses.length) state.ticketStatuses = ticketStatuses;
    if (Array.isArray(ticketIncidents) && ticketIncidents.length) state.ticketIncidents = ticketIncidents;
    if (generalSettings) { state.generalSettings = generalSettings; localStorage.setItem('ism_general_settings', JSON.stringify(generalSettings)); }
  } catch (error) {
    console.error(error);
    showToast('Supabase', error.message || 'No se pudieron cargar los datos conectados');
  }
}

function setupInventoryRealtime() {
  if (!window.sb?.enabled || state._realtimeReady) return;
  state._realtimeReady = true;
  try {
    const client = window.sb.client;
    if (!client?.channel) return;
    const refresh = async () => { try { await refreshSupabaseData(); renderView(); updateHeader(); } catch(e) { console.warn(e); } };
    client.channel('ism-realtime-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_assets' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, refresh)
      .subscribe();
  } catch (e) { console.warn('Realtime no disponible', e); }
}

function usersByRole(roleLabel) {
  return (state.users || []).filter(u => u.role === roleLabel && u.status !== 'Inactivo');
}

async function openTeamForm(team = null) {
  const teachers = usersByRole('Docente');
  const students = usersByRole('Alumno');
  const mentorOptions = teachers.map(u => `<option value="${u.id}" ${String(team?.mentor_id||'')===String(u.id)?'selected':''}>${escapeHtml(u.name)} · ${escapeHtml(u.email || '')}</option>`).join('');
  const backupOptions = `<option value="">Sin suplente</option>` + teachers.map(u => `<option value="${u.id}" ${String(team?.mentor_backup_id||'')===String(u.id)?'selected':''}>${escapeHtml(u.name)} · ${escapeHtml(u.email || '')}</option>`).join('');
  const selectedStudents = new Set((team?.student_ids || []).map(String));
  const studentOptions = students.map(u => `<option value="${u.id}" ${selectedStudents.has(String(u.id))?'selected':''}>${escapeHtml(u.name)} · ${escapeHtml(u.email || '')}</option>`).join('');
  const result = await Swal.fire({
    title: team ? 'Editar equipo' : 'Nuevo equipo', width: 900,
    html: `<div class="swal-form-grid"><label><span>Nombre del equipo</span><input id="teamName" class="swal2-input" value="${escapeHtml(team?.name || '')}" placeholder="Ej. Equipo Maker"></label><label><span>Proyecto</span><input id="teamProject" class="swal2-input" value="${escapeHtml(team?.project || '')}" placeholder="Ej. Robot sumo"></label><label><span>Mentor docente</span><select id="teamMentor" class="swal2-select"><option value="">Seleccionar docente</option>${mentorOptions}</select></label><label><span>Mentor suplente</span><select id="teamBackup" class="swal2-select">${backupOptions}</select></label><label class="full-span"><span>Alumnos del equipo (máximo 5)</span><select id="teamStudents" class="swal2-select" multiple size="8">${studentOptions}</select><small class="form-help">Usá Ctrl/Cmd para seleccionar varios alumnos.</small></label><label class="full-span"><span>Logo del equipo / URL</span><input id="teamLogo" class="swal2-input" value="${escapeHtml(team?.logo_url || '')}" placeholder="Pegá una URL o data:image"></label><label class="full-span"><span>Descripción / observaciones</span><textarea id="teamDescription" class="swal2-textarea" placeholder="Detalle del equipo, curso o división">${escapeHtml(team?.description || '')}</textarea></label></div>`,
    showCancelButton: true, confirmButtonText: 'Guardar equipo', cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const name = document.getElementById('teamName').value.trim();
      const mentor_id = document.getElementById('teamMentor').value;
      const mentor_backup_id = document.getElementById('teamBackup').value || null;
      const student_ids = Array.from(document.getElementById('teamStudents').selectedOptions).map(o => o.value);
      if (!name) return Swal.showValidationMessage('Ingresá el nombre del equipo');
      if (!mentor_id) return Swal.showValidationMessage('Seleccioná el mentor docente');
      if (mentor_backup_id && mentor_backup_id === mentor_id) return Swal.showValidationMessage('El mentor suplente debe ser otro docente');
      if (student_ids.length > 5) return Swal.showValidationMessage('Cada equipo admite hasta 5 alumnos');
      return { id: team?.id || null, name, project: document.getElementById('teamProject').value.trim(), description: document.getElementById('teamDescription').value.trim(), logo_url: document.getElementById('teamLogo')?.value.trim() || null, mentor_id, mentor_backup_id, student_ids };
    }
  });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) await window.sb.saveTeam(result.value);
    else state.teams.unshift({ ...result.value, id: result.value.id || Date.now(), teachers: teachers.filter(t => [result.value.mentor_id, result.value.mentor_backup_id].includes(String(t.id))).map(t => t.name), students: result.value.student_ids.length, courses: [], divisions: [] });
    await refreshSupabaseData(); renderView(); showToast('Equipo guardado');
  } catch (error) { Swal.fire({ icon:'error', title:'No se pudo guardar el equipo', text:error.message }); }
}


async function openBulkInventoryEdit() {
  const ids = Array.from(state.selectedInventoryIds || []);
  if (!ids.length) return Swal.fire({ icon:'warning', title:'Seleccioná insumos', text:'Marcá uno o más registros con checkbox.' });
  const result = await Swal.fire({
    title: `Editar ${ids.length} registro(s)`, width: 640, confirmButtonText:'Aplicar cambios', showCancelButton:true,
    html: `<div class="swal-form-grid"><label><span>Estado</span><select id="bulkStatus" class="swal2-select"><option value="">No cambiar</option><option>Disponible</option><option>Prestado</option><option>En mantenimiento</option></select></label><label><span>Condición</span><select id="bulkCondition" class="swal2-select"><option value="">No cambiar</option>${state.inventoryConditions.map(c => `<option value="${escapeAttr(c.name)}">${escapeHtml(c.name)}</option>`).join('')}</select></label><label><span>Marca</span><input id="bulkBrand" class="swal2-input" placeholder="No cambiar"></label><label><span>Tipo</span><select id="bulkType" class="swal2-select"><option value="">No cambiar</option><option>Equipo</option><option>Insumo</option><option>Lote</option></select></label><label><span>Empresa / proveedor</span><input id="bulkSupplier" class="swal2-input" placeholder="No cambiar"></label><label><span>Nº serie</span><input id="bulkSerial" class="swal2-input" placeholder="No cambiar"></label><label><span>Ubicación general</span><select id="bulkLocationCode" class="swal2-select"><option value="">No cambiar</option><option value="LAB-ROB">Soporte Técnico</option><option value="DEP-01">Depósito</option><option value="TALLER">Taller revisión</option></select></label><label><span>Localización física</span><input id="bulkLocationDetail" class="swal2-input" placeholder="No cambiar"></label><label><span>Zona</span><input id="bulkZone" class="swal2-input" placeholder="No cambiar"></label><label><span>Cantidad</span><input id="bulkQuantity" type="number" min="0" class="swal2-input" placeholder="No cambiar"></label><label class="full-span"><span>Imagen para seleccionados</span><input id="bulkImageFile" type="file" accept="image/*"><input id="bulkImageUrl" class="swal2-input" placeholder="URL o imagen base64 - No cambiar"><small class="form-help">Adjuntá una imagen o pegá una URL para aplicar a todos los insumos seleccionados.</small></label></div>`,
    preConfirm: async () => { const imgData = await readFileAsDataUrl(document.getElementById('bulkImageFile')?.files?.[0]); return ({ status: document.getElementById('bulkStatus').value || null, condition: document.getElementById('bulkCondition').value || null, brand: document.getElementById('bulkBrand').value.trim() || null, type: document.getElementById('bulkType').value || null, supplier: document.getElementById('bulkSupplier').value.trim() || null, serial: document.getElementById('bulkSerial').value.trim() || null, location_code: document.getElementById('bulkLocationCode').value || null, location_detail: document.getElementById('bulkLocationDetail').value.trim() || null, zone: document.getElementById('bulkZone').value.trim() || null, quantity: document.getElementById('bulkQuantity').value === '' ? null : Math.max(0, Number(document.getElementById('bulkQuantity').value)), image_url: imgData || document.getElementById('bulkImageUrl').value.trim() || null }); }
  });
  if (!result.isConfirmed) return;
  if (!Object.values(result.value).some(v => v !== null && v !== '')) return Swal.fire({ icon:'info', title:'Sin cambios', text:'Elegí al menos un campo para modificar.' });
  try {
    if (window.sb?.enabled) await window.sb.bulkUpdateInventoryAssets(ids, result.value);
    state.inventory.forEach(i => { if (ids.includes(String(i.id))) { Object.assign(i, Object.fromEntries(Object.entries(result.value).filter(([,v]) => v !== null && v !== ''))); } });
    state.selectedInventoryIds.clear(); await refreshSupabaseData(); renderView(); showToast('Inventario actualizado');
  } catch(error) { Swal.fire({ icon:'error', title:'No se pudo editar en masa', text:error.message || String(error) }); }
}

async function bulkDeleteInventory() {
  const ids = Array.from(state.selectedInventoryIds || []);
  if (!ids.length) return Swal.fire({ icon:'warning', title:'Seleccioná insumos', text:'Marcá uno o más registros con checkbox.' });
  const ok = await Swal.fire({ icon:'warning', title:`Eliminar ${ids.length} registro(s)`, text:'Se darán de baja del inventario.', showCancelButton:true, confirmButtonText:'Eliminar', cancelButtonText:'Cancelar' });
  if (!ok.isConfirmed) return;
  try {
    if (window.sb?.enabled) await window.sb.bulkDeleteInventoryAssets(ids);
    state.inventory = state.inventory.filter(i => !ids.includes(String(i.id)));
    state.selectedInventoryIds.clear(); await refreshSupabaseData(); renderView(); showToast('Inventario eliminado');
  } catch(error) { Swal.fire({ icon:'error', title:'No se pudo eliminar en masa', text:error.message || String(error) }); }
}

async function openInventoryAssetForm(row = null) {
  const isEdit = !!(row && row.id && !row.__duplicate);
  const result = await Swal.fire({
    title: isEdit ? 'Editar insumo / equipo' : 'Nuevo insumo / equipo',
    width: 960,
    html: `<div class="swal-form-grid">
      <label><span>Nombre / descripción</span><input id="assetItem" class="swal2-input" value="${escapeAttr(row?.item || '')}" placeholder="Ej. Arduino UNO"></label>
      <label><span>Categoría</span><input id="assetCategory" class="swal2-input" value="${escapeAttr(row?.category || '')}" placeholder="Robótica / Sensores"></label>
      <label><span>Marca</span><input id="assetBrand" class="swal2-input" value="${escapeAttr(row?.brand || '')}" placeholder="Ej. Arduino, SetVeintiUno"></label>
      <label><span>Empresa / proveedor</span><input id="assetSupplier" class="swal2-input" value="${escapeAttr(row?.supplier || '')}" placeholder="Ej. BQ Educación"></label>
      <label><span>Tipo</span><select id="assetType" class="swal2-select"><option ${row?.type === 'Equipo' ? 'selected' : ''}>Equipo</option><option ${row?.type === 'Insumo' ? 'selected' : ''}>Insumo</option></select></label>
      <label><span>Código interno</span><input id="assetCode" class="swal2-input" value="${escapeAttr(row?.code || '')}" placeholder="Opcional"></label>
      <label><span>Cantidad</span><input id="assetQuantity" type="number" min="0" class="swal2-input" value="${escapeAttr(row?.quantity ?? 1)}"></label>
      <label><span>N° serie</span><input id="assetSerial" class="swal2-input" value="${escapeAttr(row?.serial || '')}" placeholder="Opcional"></label>
      <label><span>Barcode</span><input id="assetBarcode" class="swal2-input" value="${escapeAttr(row?.barcode || '')}" placeholder="Opcional, se genera solo"></label>
      <label><span>Ubicación general</span><select id="assetLocationCode" class="swal2-select"><option value="LAB-ROB">Soporte Técnico</option><option value="DEP-01">Depósito</option><option value="TALLER">Taller revisión</option></select></label>
      <label><span>Locación física</span><input id="assetLocationDetail" class="swal2-input" value="${escapeAttr(row?.location_detail || '')}" placeholder="Gabinete, Maletín, Cajón"></label>
      <label><span>Zona</span><input id="assetZone" class="swal2-input" value="${escapeAttr(row?.zone || '')}" placeholder="Ej. A1, A2, B3"></label>
      <label><span>Estado</span><select id="assetStatus" class="swal2-select"><option ${row?.status === 'Disponible' ? 'selected' : ''}>Disponible</option><option ${row?.status === 'Prestado' ? 'selected' : ''}>Prestado</option><option ${row?.status === 'En mantenimiento' ? 'selected' : ''}>En mantenimiento</option></select></label>
      <label class="full-span"><span>Condiciones <button type="button" id="addConditionBtn" class="mini-plus" title="Agregar condición">+</button> <button type="button" id="editConditionColorBtn" class="mini-plus" title="Editar color">🎨</button></span><select id="assetCondition" class="swal2-select" multiple size="6">${state.inventoryConditions.map(c => `<option value="${escapeAttr(c.name)}" ${conditionList(row?.condition).some(x=>x.toLowerCase()===c.name.toLowerCase())?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}</select><small class="form-help">Podés seleccionar varias condiciones con Ctrl/Cmd. Usá + para crear una condición.</small></label>
      <label class="full-span"><span>Imagen del insumo/equipo</span><div class="asset-image-edit-box"><img id="assetImagePreview" src="${escapeAttr(row?.image_url || './assets/logo.svg')}" onerror="this.src='./assets/logo.svg'" alt="Imagen actual"><input id="assetImageFile" type="file" accept="image/*"></div><input id="assetImageUrl" class="swal2-input" value="${escapeAttr(row?.image_url || '')}" placeholder="URL o imagen base64 opcional"><small class="form-help">Podés cargar una imagen desde tu equipo o pegar una URL.</small></label>
    </div>`,
    showCancelButton: true,
    didOpen: () => {
      const imageFile = document.getElementById('assetImageFile');
      const imageInput = document.getElementById('assetImageUrl');
      const imagePreview = document.getElementById('assetImagePreview');
      imageFile?.addEventListener('change', async () => {
        const dataUrl = await readFileAsDataUrl(imageFile.files?.[0]);
        if (dataUrl) { imageInput.value = dataUrl; imagePreview.src = dataUrl; }
      });
      imageInput?.addEventListener('input', () => { if (imageInput.value.trim()) imagePreview.src = imageInput.value.trim(); });
      const btn = document.getElementById('addConditionBtn');
      if (btn) btn.addEventListener('click', async () => {
        const r = await Swal.fire({ title:'Nueva condición', html:'<input id="newCondName" class="swal2-input" placeholder="Ej. Reparado"><input id="newCondColor" type="color" class="swal2-input" value="#3b82f6">', showCancelButton:true, confirmButtonText:'Agregar', preConfirm:()=>({name:document.getElementById('newCondName').value.trim(), color:document.getElementById('newCondColor').value}) });
        if (r.isConfirmed && r.value.name) {
          const cleanName = r.value.name.trim().replace(/\s+/g, ' ');
          const cleanColor = r.value.color || '#64748b';
          const existing = (state.inventoryConditions || []).find(c => String(c.name || '').trim().toLowerCase() === cleanName.toLowerCase());
          if (existing) return Swal.fire({ icon:'warning', title:'Condición duplicada', text:'Ya existe una condición con ese nombre. Usá el botón 🎨 para cambiar su color.' });
          if (window.sb?.enabled) {
            try {
              await window.sb.saveInventoryCondition(cleanName, cleanColor, { failOnDuplicate: true });
              state.inventoryConditions = await window.sb.listInventoryConditions();
            }
            catch (err) { return Swal.fire({ icon:'error', title:'No se pudo guardar la condición', text: err.message || String(err) }); }
          } else addLocalCondition(cleanName, cleanColor);
          upsertLocalCondition(cleanName, cleanColor);
          const sel=document.getElementById('assetCondition');
          if(sel){
            const exists = Array.from(sel.options).some(o => o.value.toLowerCase() === cleanName.toLowerCase());
            if (!exists) sel.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(cleanName)}">${escapeHtml(cleanName)}</option>`);
            sel.value=cleanName;
          }
          renderView(); await Swal.fire({ icon:'success', title:'Condición guardada', text:'La condición fue agregada en Supabase con su color.' });
        }
      });
      const editBtn = document.getElementById('editConditionColorBtn');
      if (editBtn) editBtn.addEventListener('click', async () => {
        const sel = document.getElementById('assetCondition');
        const name = String(sel?.value || '').trim();
        if (!name) return Swal.fire({ icon:'info', title:'Seleccioná una condición' });
        const current = (state.inventoryConditions || []).find(c => c.name.toLowerCase() === name.toLowerCase());
        const r = await Swal.fire({ title:'Editar color de condición', html:`<p class="muted">${escapeHtml(name)}</p><input id="editCondColor" type="color" class="swal2-input" value="${escapeAttr(current?.color || '#64748b')}">`, showCancelButton:true, confirmButtonText:'Guardar color', preConfirm:()=>({ color:document.getElementById('editCondColor').value }) });
        if (r.isConfirmed) {
          const cleanColor = r.value.color || '#64748b';
          if (window.sb?.enabled) {
            try {
              await window.sb.saveInventoryCondition(name, cleanColor);
              state.inventoryConditions = await window.sb.listInventoryConditions();
            }
            catch (err) { return Swal.fire({ icon:'error', title:'No se pudo actualizar el color', text: err.message || String(err) }); }
          }
          upsertLocalCondition(name, cleanColor);
          renderView(); await Swal.fire({ icon:'success', title:'Color actualizado', text:'El color de la condición fue guardado en Supabase.' });
        }
      });
    },
    confirmButtonText: isEdit ? 'Guardar cambios' : 'Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const item = document.getElementById('assetItem').value.trim();
      if (!item) return Swal.showValidationMessage('Ingresá el nombre o descripción del insumo/equipo');
      return {
        item,
        category: document.getElementById('assetCategory').value.trim() || 'General',
        brand: document.getElementById('assetBrand').value.trim(),
        supplier: document.getElementById('assetSupplier').value.trim(),
        type: document.getElementById('assetType').value,
        quantity: Math.max(0, Number(document.getElementById('assetQuantity')?.value || 1)),
        code: document.getElementById('assetCode').value.trim(),
        serial: document.getElementById('assetSerial').value.trim(),
        barcode: document.getElementById('assetBarcode').value.trim(),
        location_code: document.getElementById('assetLocationCode').value,
        location_detail: document.getElementById('assetLocationDetail').value.trim(),
        zone: document.getElementById('assetZone').value.trim(),
        status: document.getElementById('assetStatus').value,
        condition: Array.from(document.getElementById('assetCondition').selectedOptions || []).map(o=>o.value.trim()).filter(Boolean).join(', ') || document.getElementById('assetCondition').value.trim(),
        image_url: document.getElementById('assetImageUrl')?.value.trim() || ''
      };
    }
  });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) {
      if (result.value.condition) {
        const cond = (state.inventoryConditions || []).find(c => String(c.name).toLowerCase() === String(result.value.condition).toLowerCase());
        if (!cond) await window.sb.saveInventoryCondition(result.value.condition, '#64748b');
      }
      if (isEdit) await window.sb.updateInventoryAsset(row.id, result.value);
      else await window.sb.createInventoryAsset(result.value);
      await refreshSupabaseData();
    } else {
      if (isEdit) Object.assign(row, result.value, { location: result.value.location_detail || row.location || 'Lab. Robótica' });
      else state.inventory.unshift({ id: Date.now(), ...result.value, code: result.value.code || `TMP-${Date.now()}`, barcode: result.value.barcode || `ISMROB-${Date.now()}`, status: result.value.status || 'Disponible', assignedTo: '-', requestedAt: '-', returnedAt: '-', teacher: '-', location: result.value.location_detail || 'Lab. Robótica' });
    }
    renderView();
    showToast('Inventario', isEdit ? 'Actualizado correctamente' : 'El insumo fue guardado correctamente');
  } catch (error) { Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: error.message }); }
}


function getRoleById(id) { return (state.rolesData || []).find(r => String(r.id) === String(id)); }

async function handleRoleAction(action, id) {
  const role = getRoleById(id);
  if (!role) return Swal.fire({ icon:'warning', title:'Rol no encontrado' });
  if (action === 'view') return Swal.fire({ title:'Detalle de rol', width:760, html:`<div class="detail-grid pretty"><div><strong>Nombre</strong><span>${escapeHtml(role.name)}</span></div><div><strong>Código</strong><span>${escapeHtml(role.code)}</span></div><div class="full-span"><strong>Descripción</strong><span>${escapeHtml(role.description || '-')}</span></div><div class="full-span"><strong>Permisos</strong><span>${escapeHtml((role.permissions || []).join(', ') || '-')}</span></div></div>`, confirmButtonText:'Cerrar' });
  if (action === 'edit') return openRoleForm(role);
  if (action === 'delete') {
    const ok = await Swal.fire({ icon:'warning', title:'Eliminar rol', text:`¿Eliminar ${role.name}? Los roles del sistema no se eliminan.`, showCancelButton:true, confirmButtonText:'Eliminar', cancelButtonText:'Cancelar' });
    if (!ok.isConfirmed) return;
    try { if (window.sb?.enabled) await window.sb.deleteRole(role.id); state.rolesData = state.rolesData.filter(r => String(r.id) !== String(role.id)); renderView(); showToast('Rol eliminado'); }
    catch(error) { Swal.fire({ icon:'error', title:'No se pudo eliminar', text:error.message }); }
  }
}

async function openRoleForm(role=null) {
  const permissionOptions = Array.from(new Set([
    ...DEFAULT_PERMISSIONS,
    ...(state.permissionsData || []).map(p => p.code).filter(Boolean),
    ...(state.rolesData || []).flatMap(r => r.permissions || [])
  ])).filter(Boolean).sort((a,b) => a.localeCompare(b, 'es'));
  const selected = new Set(role?.permissions || []);
  const result = await Swal.fire({
    title: role ? 'Editar rol' : 'Nuevo rol', width: 820,
    html: `<div class="swal-form-grid"><label><span>Nombre</span><input id="roleName" class="swal2-input" value="${escapeHtml(role?.name || '')}"></label><label><span>Código</span><input id="roleCode" class="swal2-input" value="${escapeHtml(role?.code || '')}" ${role?.code ? 'disabled' : ''} placeholder="ej: preceptor"></label><label class="full-span"><span>Descripción</span><textarea id="roleDescription" class="swal2-textarea">${escapeHtml(role?.description || '')}</textarea></label><div class="full-span permissions-checks permissions-checks-scroll">${permissionOptions.map(p => `<label><input type="checkbox" value="${p}" ${selected.has(p) ? 'checked' : ''}> ${p}</label>`).join('')}</div></div>`,
    showCancelButton:true, confirmButtonText:'Guardar', cancelButtonText:'Cancelar',
    preConfirm: () => {
      const name = document.getElementById('roleName').value.trim();
      const code = document.getElementById('roleCode').value.trim().toLowerCase().replace(/\s+/g,'_');
      if (!name || !code) return Swal.showValidationMessage('Nombre y código son obligatorios');
      return { id: role?.id, name, code, description: document.getElementById('roleDescription').value.trim(), permissions: Array.from(document.querySelectorAll('.permissions-checks input:checked')).map(x => x.value) };
    }
  });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) await window.sb.saveRole(result.value);
    const idx = state.rolesData.findIndex(r => String(r.id) === String(role?.id));
    if (idx >= 0) state.rolesData[idx] = { ...state.rolesData[idx], ...result.value };
    else state.rolesData.unshift({ ...result.value, id: result.value.id || result.value.code });
    await refreshSupabaseData(); renderView(); showToast('Rol guardado');
  } catch(error) { Swal.fire({ icon:'error', title:'No se pudo guardar el rol', text:error.message }); }
}


async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


function roleLabelFromAny(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'administrator' || r === 'administrador') return 'Administrador';
  if (r === 'teacher' || r === 'docente') return 'Docente';
  if (r === 'student' || r === 'alumno') return 'Alumno';
  return role || 'Alumno';
}
function isCurrentStudent() { return roleLabelFromAny(state.user?.role) === 'Alumno'; }
function isCurrentAdmin() { return roleLabelFromAny(state.user?.role) === 'Administrador'; }
function courseOptions(selected='') {
  const opts = ['1º','2º','3º','4º','5º','6º','7º'];
  return '<option value="">Elegir de 1 a 7º</option>' + opts.map(x => `<option value="${x}" ${String(selected)===x?'selected':''}>${x}</option>`).join('');
}
function divisionOptions(selected='') {
  const base = ['A','B','C'];
  const extra = String(selected || '').trim();
  const opts = extra && !base.includes(extra) ? [...base, extra] : base;
  return '<option value="">Elegir de A al C</option>' + opts.map(x => `<option value="${x}" ${String(selected)===x?'selected':''}>${x}</option>`).join('');
}
function dedupeInventoryRows(rows) {
  const seen = new Set();
  return (rows || []).filter(x => {
    const key = String(x.id || x.code || x.barcode || '').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function openUserProfileForm() {
  const result = await Swal.fire({
    title: 'Nuevo usuario', width: 900,
    html: `<div class="swal-form-grid">
      <label><span>Nombre completo</span><input id="userFullName" class="swal2-input"></label>
      <label><span>Email</span><input id="userEmail" type="email" class="swal2-input"></label>
      <label><span>Contraseña inicial</span><input id="userPassword" type="text" class="swal2-input" placeholder="Opcional para ABM"></label>
      <label><span>Rol</span><select id="userRole" class="swal2-select"><option>Administrador</option><option>Docente</option><option selected>Alumno</option></select></label>
      <label><span>DNI</span><input id="userDni" class="swal2-input"></label>
      <label><span>WhatsApp</span><input id="userWhatsapp" class="swal2-input"></label>
      <label><span>Fecha de nacimiento</span><input id="userBirthDate" type="date" class="swal2-input"></label>
      <label id="userTitleWrap"><span>Título / Especialidad</span><input id="userTitle" class="swal2-input" placeholder="Título, materia o especialidad"></label>
      <label id="userCourseWrap"><span>Curso</span><select id="userCourse" class="swal2-select">${courseOptions()}</select></label>
      <label id="userDivisionWrap"><span>División</span><select id="userDivision" class="swal2-select">${divisionOptions()}</select></label>
      <label class="full-span"><span>Foto de perfil</span><input id="userAvatarFile" type="file" accept="image/*"><small class="form-help">Si el rol es Alumno, Curso y División son obligatorios del perfil académico.</small></label>
    </div>`,
    showCancelButton: true, confirmButtonText: 'Crear', cancelButtonText: 'Cancelar',
    didOpen: () => {
      const roleEl = document.getElementById('userRole');
      const sync = () => {
        const isStudent = roleEl.value === 'Alumno';
        document.getElementById('userCourseWrap').style.display = isStudent ? '' : 'none';
        document.getElementById('userDivisionWrap').style.display = isStudent ? '' : 'none';
        document.getElementById('userTitleWrap').style.display = isStudent ? 'none' : '';
      };
      roleEl.addEventListener('change', sync); sync();
    },
    preConfirm: async () => {
      const name = document.getElementById('userFullName').value.trim();
      const email = document.getElementById('userEmail').value.trim().toLowerCase();
      const role = document.getElementById('userRole').value;
      if (!name || !email) return Swal.showValidationMessage('Nombre y email son obligatorios');
      if (role === 'Alumno' && (!document.getElementById('userCourse').value || !document.getElementById('userDivision').value)) return Swal.showValidationMessage('Para alumnos, Curso y División son obligatorios');
      const avatar_url = await readFileAsDataUrl(document.getElementById('userAvatarFile').files?.[0]);
      return { name, full_name: name, email, password: document.getElementById('userPassword').value.trim(), role, dni: document.getElementById('userDni').value.trim(), whatsapp: document.getElementById('userWhatsapp').value.trim(), birth_date: document.getElementById('userBirthDate').value || null, title: role === 'Alumno' ? null : document.getElementById('userTitle').value.trim(), student_course_name: role === 'Alumno' ? document.getElementById('userCourse').value : null, student_division_name: role === 'Alumno' ? document.getElementById('userDivision').value : null, avatar_url };
    }
  });
  if (!result.isConfirmed) return;
  try {
    if (window.sb?.enabled) { await window.sb.inviteUserByAdmin(result.value); await refreshSupabaseData(); renderView(); Swal.fire({ icon: 'success', title: 'Usuario cargado', text: 'El usuario quedó creado con el rol seleccionado.' }); }
    else { state.users.unshift({ id: Date.now(), name: result.value.name, role: result.value.role, email: result.value.email, whatsapp: result.value.whatsapp || '-', dni: result.value.dni || '-', birth_date: result.value.birth_date || '', title: result.value.title || '', avatar_url: result.value.avatar_url || './assets/avatar-default.svg', status: 'Activo' }); renderView(); showToast('Usuarios', 'Usuario agregado en modo demo'); }
  } catch (error) { Swal.fire({ icon: 'error', title: 'No se pudo crear', text: error.message }); }
}

async function bootApp() {
  applySavedTheme();
  bindEvents();
  if (window.sb?.enabled) {
    const { data } = await window.sb.getSession();
    if (!data.session && !localStorage.getItem('ism_demo_user')) {
      window.location.href = './index.html';
      return;
    }
    await refreshSupabaseData();
  }
  renderView();
}

/* === Soporte Ticket / v30 patch === */
icons.ticket = `<svg viewBox="0 0 24 24" class="icon"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 1 1 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 1 1 0-4Zm-7 8h-4v-2h4v2Zm0-5h-4v-2h4v2Zm0-5h-4V6h4v2Z"></path></svg>`;
if (!state.supportTickets) state.supportTickets = [];
if (!state.ticketPage) state.ticketPage = 1;
if (!state.ticketPageSize) state.ticketPageSize = 10;
if (!state.selectedTicketIds) state.selectedTicketIds = new Set();
if (!state.ticketStatuses) state.ticketStatuses = [
  { code:'pendiente', name:'Pendiente', color:'#f59e0b' },
  { code:'aprobado', name:'Aprobado', color:'#22c55e' },
  { code:'rechazado', name:'Rechazado', color:'#ef4444' },
  { code:'en_proceso', name:'En proceso', color:'#3b82f6' },
  { code:'resolviendo', name:'Resolviendo', color:'#8b5cf6' },
  { code:'resuelto', name:'Resuelto', color:'#14b8a6' }
];
if (!state.ticketIncidents) state.ticketIncidents = [
  { name:'Falla técnica', color:'#ef4444' }, { name:'Falta de insumo', color:'#f59e0b' }, { name:'Mantenimiento preventivo', color:'#3b82f6' }, { name:'Software / configuración', color:'#8b5cf6' }
];
if (!state.filters.ticketSearch) state.filters.ticketSearch = '';
if (!state.filters.ticketStatus) state.filters.ticketStatus = 'all';
if (!state.telegramConfig) state.telegramConfig = JSON.parse(localStorage.getItem('ism_telegram_config') || '{"enabled":false,"botToken":"","chatId":""}');
['support.read','support.create','support.manage','support.status.manage','support.delete'].forEach(p => { if (!DEFAULT_PERMISSIONS.includes(p)) DEFAULT_PERMISSIONS.push(p); });
state.rolesData = (state.rolesData || []).map(r => {
  const perms = new Set(r.permissions || []);
  if (r.code === 'administrator') ['support.read','support.create','support.manage','support.status.manage','support.delete'].forEach(p => perms.add(p));
  if (r.code === 'teacher') ['support.read','support.create'].forEach(p => perms.add(p));
  if (r.code === 'student') ['support.read','support.create'].forEach(p => perms.add(p));
  return { ...r, permissions:Array.from(perms) };
});
if (!roleViews.administrator.includes('supportTickets')) roleViews.administrator.splice(roleViews.administrator.indexOf('accessControl'), 0, 'supportTickets');
if (!roleViews.teacher.includes('supportTickets')) roleViews.teacher.splice(roleViews.teacher.indexOf('courses'), 0, 'supportTickets');
if (roleViews.student && !roleViews.student.includes('supportTickets')) roleViews.student.splice(Math.max(1, roleViews.student.indexOf('profile')), 0, 'supportTickets');
baseLabels.administrator.supportTickets = ['Soporte Ticket', 'Incidencias técnicas de inventario, laboratorio y salas de informática'];
baseLabels.teacher.supportTickets = ['Soporte Ticket', 'Alta y seguimiento de incidencias técnicas'];
if (baseLabels.student) baseLabels.student.supportTickets = ['Soporte Ticket', 'Alta y seguimiento de incidencias técnicas propias'];
if (!nav.some(n => n.key === 'supportTickets')) nav.splice(nav.findIndex(n => n.key === 'accessControl'), 0, { key:'supportTickets', icon:'ticket', label:{ administrator:'Soporte Ticket', teacher:'Soporte Ticket', student:'Soporte Ticket' } });

function ticketStatusMeta(status) { return (state.ticketStatuses || []).find(s => s.code === status || s.name === status) || { name: status || 'Pendiente', color:'#64748b' }; }
function ticketPill(status) { const s = ticketStatusMeta(status); return `<span class="status-pill" style="background:${escapeAttr(s.color)}22;color:${escapeAttr(s.color)};border-color:${escapeAttr(s.color)}55">${escapeHtml(s.name)}</span>`; }
function canManageTickets() { return state.user.role === 'administrator'; }
function currentUserId() { return String(state.user?.id || ''); }
function isOwnTicket(t) { const uid = currentUserId(); return !!uid && (String(t?.requester_id || '') === uid || String(t?.created_by || '') === uid); }
function canViewTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canEditTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canDeleteTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canChangeTicketStatus() { return canManageTickets(); }
function ticketNumber() { return `TK-${new Date().getFullYear()}-${String((state.supportTickets?.length || 0) + 1).padStart(5,'0')}`; }
function roomOptions(selected='') { return ['Soporte Técnico','Sala N°1 - Planta Baja (PB)','Sala N°2 - Primer Piso'].map(x => `<option ${selected===x?'selected':''}>${x}</option>`).join(''); }
function filteredTickets() {
  return (state.supportTickets || []).filter(t => {
    if (!canViewTicket(t)) return false;
    const q = String(state.filters.ticketSearch || '').toLowerCase();
    const matchesQ = `${t.ticket_number} ${t.title} ${t.description} ${t.asset_label} ${t.room} ${t.incident_type}`.toLowerCase().includes(q);
    const matchesStatus = state.filters.ticketStatus === 'all' || t.status === state.filters.ticketStatus;
    return matchesQ && matchesStatus;
  });
}
function ticketPager(rows, position='top') {
  const sizes = [5,10,25,50,100,500];
  const totalPages = Math.max(1, Math.ceil(rows.length / state.ticketPageSize));
  return `<div class="support-ticket-pager ${position}"><label><span>Listar</span><select data-ticket-page-size>${sizes.map(s=>`<option value="${s}" ${state.ticketPageSize===s?'selected':''}>${s}</option>`).join('')}</select></label><div class="pager-controls"><button class="btn btn-secondary btn-sm" data-ticket-page="prev" ${state.ticketPage<=1?'disabled':''}>Anterior</button><span class="muted">Página ${state.ticketPage} de ${totalPages} · ${rows.length} registros</span><button class="btn btn-secondary btn-sm" data-ticket-page="next" ${state.ticketPage>=totalPages?'disabled':''}>Siguiente</button></div></div>`;
}
function renderSupportTickets() {
  const rows = filteredTickets();
  const totalPages = Math.max(1, Math.ceil(rows.length / state.ticketPageSize));
  state.ticketPage = Math.min(Math.max(1, state.ticketPage), totalPages);
  const pageRows = rows.slice((state.ticketPage-1)*state.ticketPageSize, state.ticketPage*state.ticketPageSize);
  const statusOptions = ['<option value="all">Todos los estados</option>'].concat((state.ticketStatuses||[]).map(s=>`<option value="${escapeAttr(s.code)}" ${state.filters.ticketStatus===s.code?'selected':''}>${escapeHtml(s.name)}</option>`)).join('');
  return `<section class="card glass support-ticket-card"><div class="section-header"><div><h3>Soporte Ticket</h3><p class="muted">Registro trazable de incidencias técnicas en insumos, equipos, Soporte Técnico y Salas de Informática.</p></div><div class="support-ticket-actions"><button class="btn btn-secondary btn-sm" data-export="supportTickets">${icons.export} Exportar CSV</button>${canManageTickets()?`<button class="btn btn-secondary btn-sm" id="manageTicketIncidentsBtn">${icons.filter} Incidencias</button>`:''}<button class="btn btn-primary btn-sm" id="newTicketBtn">Nuevo ticket</button></div></div><div class="support-ticket-filters"><input type="search" id="ticketSearch" placeholder="Buscar por número, equipo, insumo o descripción" value="${escapeHtml(state.filters.ticketSearch)}"><select id="ticketStatusFilter">${statusOptions}</select></div><div class="support-ticket-bulk"><button class="btn btn-secondary btn-sm" id="bulkTicketEditBtn" ${state.selectedTicketIds.size && canChangeTicketStatus()?'':'disabled'}>${icons.edit} Edición masiva</button><button class="btn btn-secondary btn-sm" id="bulkTicketDeleteBtn" ${state.selectedTicketIds.size && Array.from(state.selectedTicketIds).every(id => canDeleteTicket((state.supportTickets||[]).find(t=>String(t.id)===String(id))))?'':'disabled'}>${icons.trash} Eliminación masiva</button></div>${ticketPager(rows,'top')}<div class="table-wrap support-ticket-table"><table class="table"><thead><tr><th><input type="checkbox" id="selectAllTickets" ${pageRows.length && pageRows.every(t=>state.selectedTicketIds.has(String(t.id)))?'checked':''}></th><th>N° Ticket</th><th>Fecha</th><th>Incidencia</th><th>Equipo/Insumo</th><th>Sala</th><th>Solicitante</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${pageRows.map(t=>`<tr><td><input type="checkbox" class="ticket-check" data-id="${escapeAttr(t.id)}" ${state.selectedTicketIds.has(String(t.id))?'checked':''}></td><td><strong>${escapeHtml(t.ticket_number)}</strong></td><td>${escapeHtml((t.created_at||'').slice(0,10) || '-')}</td><td>${escapeHtml(t.incident_type || '-')}</td><td>${escapeHtml(t.asset_label || '-')}</td><td>${escapeHtml(t.room || '-')}</td><td>${escapeHtml(t.requester_name || '-')}</td><td>${ticketPill(t.status)}</td><td>${actionButtons('supportTicket', t.id)}</td></tr>`).join('') || '<tr><td colspan="9" class="muted">Sin tickets registrados.</td></tr>'}</tbody></table></div>${ticketPager(rows,'bottom')}</section>`;
}
async function openTicketForm(ticket=null) {
  if (ticket && !canEditTicket(ticket)) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo podés editar tickets propios.'});
  const invOptions = ['<option value="">Sin vincular</option>'].concat((state.inventory||[]).map(i=>`<option value="${escapeAttr(i.id)}" ${String(ticket?.asset_id||'')===String(i.id)?'selected':''}>${escapeHtml(i.code || '')} · ${escapeHtml(i.item || '')}</option>`)).join('');
  const incidentOptions = (state.ticketIncidents||[]).map(i=>`<option ${ticket?.incident_type===i.name?'selected':''}>${escapeHtml(i.name)}</option>`).join('');
  const statusOptions = (state.ticketStatuses||[]).map(s=>`<option value="${escapeAttr(s.code)}" ${ticket?.status===s.code?'selected':''}>${escapeHtml(s.name)}</option>`).join('');
  const res = await Swal.fire({ title: ticket?'Editar ticket':'Nuevo ticket', width:900, html:`<div class="swal-form-grid"><label><span>N° ticket</span><input id="ticketNumber" class="swal2-input" value="${escapeHtml(ticket?.ticket_number || ticketNumber())}" readonly></label><label><span>Sala / ubicación</span><select id="ticketRoom" class="swal2-select">${roomOptions(ticket?.room||'')}</select></label><label><span>Equipo o insumo del inventario</span><select id="ticketAsset" class="swal2-select">${invOptions}</select></label><label><span>Tipo de incidencia</span><select id="ticketIncident" class="swal2-select">${incidentOptions}</select></label><label><span>Estado</span><select id="ticketStatus" class="swal2-select" ${canChangeTicketStatus()?'':'disabled'}>${statusOptions}</select></label><label><span>Prioridad</span><select id="ticketPriority" class="swal2-select"><option ${ticket?.priority==='Normal'?'selected':''}>Normal</option><option ${ticket?.priority==='Alta'?'selected':''}>Alta</option><option ${ticket?.priority==='Urgente'?'selected':''}>Urgente</option><option ${ticket?.priority==='Baja'?'selected':''}>Baja</option></select></label><label class="full-span"><span>Título</span><input id="ticketTitle" class="swal2-input" value="${escapeHtml(ticket?.title || '')}"></label><label class="full-span"><span>Descripción</span><textarea id="ticketDescription" class="swal2-textarea">${escapeHtml(ticket?.description || '')}</textarea></label><label class="full-span"><span>Historial / resolución</span><textarea id="ticketHistory" class="swal2-textarea">${escapeHtml(ticket?.history || '')}</textarea></label></div>`, showCancelButton:true, confirmButtonText:'Guardar', cancelButtonText:'Cancelar', preConfirm:()=>{ const title=document.getElementById('ticketTitle').value.trim(); if(!title) return Swal.showValidationMessage('Ingresá un título'); const assetId=document.getElementById('ticketAsset').value; const asset=(state.inventory||[]).find(i=>String(i.id)===String(assetId)); return { id: ticket?.id || null, ticket_number: ticket?.ticket_number || '', title, description:document.getElementById('ticketDescription').value.trim(), room:document.getElementById('ticketRoom').value, asset_id:assetId||null, asset_label:asset?`${asset.code} · ${asset.item}`:'', incident_type:document.getElementById('ticketIncident').value, status:canChangeTicketStatus()?document.getElementById('ticketStatus').value:(ticket?.status||'pendiente'), priority:document.getElementById('ticketPriority').value, history:document.getElementById('ticketHistory').value.trim(), requester_id:state.user.id||null, requester_name:state.user.name||state.user.full_name||'Usuario', created_by:ticket?.created_by||state.user.id||null, created_at:ticket?.created_at||new Date().toISOString(), updated_at:new Date().toISOString() }; }});
  if (!res.isConfirmed) return;
  try {
    let saved = res.value;
    if (window.sb?.enabled && window.sb.saveSupportTicket) saved = await window.sb.saveSupportTicket(res.value);
    const idx=(state.supportTickets||[]).findIndex(t=>String(t.id)===String(saved.id));
    if(idx>=0) state.supportTickets[idx]=saved; else state.supportTickets.unshift(saved);
    const statusName = ticketStatusMeta(saved.status).name;
    const msg = `Nuevo ticket ${saved.ticket_number} · ${saved.title} · Incidencia: ${saved.incident_type || '-'} · Urgencia: ${saved.priority || 'Normal'} · Cargó: ${saved.requester_name || state.user.name || '-'} · Fecha: ${new Date(saved.created_at || Date.now()).toLocaleString('es-AR')} · Estado: ${statusName}`;
    if (window.sb?.enabled && window.sb.createSupportTicketNotification) await window.sb.createSupportTicketNotification(saved).catch(()=>{});
    await notifyTelegram(msg);
    await refreshSupabaseData(); renderView();
    await Swal.fire({icon:'success', title:'Ticket guardado', timer:1400, showConfirmButton:false});
  } catch(e) { Swal.fire({icon:'error', title:'No se pudo guardar', text:e.message}); }
}
async function manageTicketIncidents() {
  const html = `<div class="swal-form-grid"><label><span>Nueva incidencia</span><input id="newIncidentName" class="swal2-input"></label><label><span>Color</span><input id="newIncidentColor" type="color" class="swal2-input" value="#64748b"></label><div class="full-span permissions-list">${(state.ticketIncidents||[]).map(i=>`<span class="tag" style="border-color:${escapeAttr(i.color)};color:${escapeAttr(i.color)}">${escapeHtml(i.name)}</span>`).join('')}</div></div>`;
  const res = await Swal.fire({title:'Incidencias de soporte', width:700, html, showCancelButton:true, confirmButtonText:'Agregar', cancelButtonText:'Cerrar', preConfirm:()=>({name:document.getElementById('newIncidentName').value.trim(), color:document.getElementById('newIncidentColor').value})});
  if (res.isConfirmed && res.value.name) {
    try {
      let saved = res.value;
      if (window.sb?.enabled && window.sb.saveTicketIncident) saved = await window.sb.saveTicketIncident(res.value);
      if (!(state.ticketIncidents || []).some(i => String(i.name).toLowerCase() === String(saved.name).toLowerCase())) state.ticketIncidents.push(saved);
      renderView();
      await Swal.fire({icon:'success', title:'Incidencia agregada', timer:1400, showConfirmButton:false});
    } catch(e) { Swal.fire({icon:'error', title:'No se pudo agregar', text:e.message || String(e)}); }
  }
}
async function notifyTelegram(message) {
  const cfg = state.telegramConfig || JSON.parse(localStorage.getItem('ism_telegram_config') || '{}');
  if (!cfg.enabled || !cfg.botToken || !cfg.chatId) return;
  const url = `https://api.telegram.org/bot${cfg.botToken}/sendMessage`;
  const body = new URLSearchParams({ chat_id: cfg.chatId, text: message, disable_web_page_preview: 'true' });
  try {
    await fetch(url, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}, body });
  } catch(e) { console.warn('Telegram no disponible', e); }
}

async function bulkTickets(action) {
  const ids = Array.from(state.selectedTicketIds);
  if (!ids.length) return;
  if (action === 'edit' && !canChangeTicketStatus()) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo administradores pueden hacer edición masiva de estado.'});
  if (!ids.every(id => canEditTicket((state.supportTickets||[]).find(t=>String(t.id)===String(id))))) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo podés modificar tickets propios.'});
  if (action === 'delete') { if (!ids.every(id => canDeleteTicket((state.supportTickets||[]).find(t=>String(t.id)===String(id))))) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo podés eliminar tickets propios.'}); const ok = await Swal.fire({icon:'warning', title:'Eliminar tickets', text:`Se eliminarán ${ids.length} tickets.`, showCancelButton:true, confirmButtonText:'Eliminar'}); if(!ok.isConfirmed) return; if(window.sb?.enabled && window.sb.deleteSupportTickets) await window.sb.deleteSupportTickets(ids); state.supportTickets = state.supportTickets.filter(t=>!ids.includes(String(t.id))); state.selectedTicketIds.clear(); renderView(); await Swal.fire({icon:'success', title:'Tickets eliminados', timer:1400, showConfirmButton:false}); return; }
  const statusOptions = (state.ticketStatuses||[]).map(s=>`<option value="${escapeAttr(s.code)}">${escapeHtml(s.name)}</option>`).join('');
  const res = await Swal.fire({title:'Edición masiva', html:`<select id="bulkTicketStatus" class="swal2-select">${statusOptions}</select>`, showCancelButton:true, confirmButtonText:'Actualizar estado'});
  if(res.isConfirmed){ const status=document.getElementById('bulkTicketStatus').value; if(window.sb?.enabled && window.sb.bulkUpdateSupportTickets) await window.sb.bulkUpdateSupportTickets(ids,{status}); state.supportTickets.forEach(t=>{if(ids.includes(String(t.id))) t.status=status;}); state.selectedTicketIds.clear(); renderView(); await Swal.fire({icon:'success', title:'Tickets actualizados', timer:1400, showConfirmButton:false}); }
}

const _oldDataByModule = dataByModule;
dataByModule = function(module) { if (module === 'supportTickets') return state.supportTickets || []; return _oldDataByModule(module); };
const _oldGetRecordByType = getRecordByType;
getRecordByType = function(type,id) { if(type==='supportTicket') return (state.supportTickets||[]).find(t=>String(t.id)===String(id)); return _oldGetRecordByType(type,id); };
const _oldViewRecord = viewRecord;
viewRecord = function(type,row) { if(type==='supportTicket') { if(!canViewTicket(row)) return Swal.fire({icon:'warning', title:'Acción no permitida'}); return Swal.fire({title:`Ticket ${escapeHtml(row.ticket_number)}`, width:760, html:`<div class="detail-grid pretty"><div><strong>Título</strong><span>${escapeHtml(row.title)}</span></div><div><strong>Estado</strong><span>${ticketPill(row.status)}</span></div><div><strong>Incidencia</strong><span>${escapeHtml(row.incident_type||'-')}</span></div><div><strong>Ubicación</strong><span>${escapeHtml(row.room||'-')}</span></div><div class="full-span"><strong>Equipo/Insumo</strong><span>${escapeHtml(row.asset_label||'-')}</span></div><div class="full-span"><strong>Descripción</strong><span>${escapeHtml(row.description||'-')}</span></div><div class="full-span"><strong>Historial</strong><span>${escapeHtml(row.history||'-')}</span></div></div>`, confirmButtonText:'Cerrar'}); } return _oldViewRecord(type,row); };
const _oldEditRecord = editRecord;
editRecord = function(type,row) { if(type==='supportTicket') { if(!canEditTicket(row)) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo podés editar tickets propios.'}); return openTicketForm(row); } return _oldEditRecord(type,row); };
const _oldDeleteRecord = deleteRecord;
deleteRecord = async function(type,row) { if(type==='supportTicket') { if(!canDeleteTicket(row)) return Swal.fire({icon:'warning', title:'Acción no permitida', text:'Solo podés eliminar tickets propios.'}); const ok=await Swal.fire({icon:'warning', title:'Eliminar ticket', text:'Esta acción no se puede deshacer.', showCancelButton:true, confirmButtonText:'Eliminar'}); if(!ok.isConfirmed) return; if(window.sb?.enabled && window.sb.deleteSupportTickets) await window.sb.deleteSupportTickets([row.id]); state.supportTickets=state.supportTickets.filter(t=>String(t.id)!==String(row.id)); renderView(); await Swal.fire({icon:'success', title:'Ticket eliminado', timer:1400, showConfirmButton:false}); return; } return _oldDeleteRecord(type,row); };

const _oldAttachViewEvents = attachViewEvents;
attachViewEvents = function() {
  _oldAttachViewEvents();
  document.getElementById('newTicketBtn')?.addEventListener('click', () => openTicketForm());
  document.getElementById('manageTicketIncidentsBtn')?.addEventListener('click', manageTicketIncidents);
  document.getElementById('ticketSearch')?.addEventListener('input', e => { state.filters.ticketSearch = e.target.value; state.ticketPage=1; renderView(); });
  document.getElementById('ticketStatusFilter')?.addEventListener('change', e => { state.filters.ticketStatus = e.target.value; state.ticketPage=1; renderView(); });
  appContent.querySelectorAll('[data-ticket-page-size]').forEach(s=>s.addEventListener('change', e=>{state.ticketPageSize=Number(e.target.value)||10; state.ticketPage=1; renderView();}));
  appContent.querySelectorAll('[data-ticket-page]').forEach(b=>b.addEventListener('click', ()=>{state.ticketPage += b.dataset.ticketPage==='next'?1:-1; renderView();}));
  appContent.querySelectorAll('.ticket-check').forEach(c=>c.addEventListener('change',()=>{ c.checked?state.selectedTicketIds.add(String(c.dataset.id)):state.selectedTicketIds.delete(String(c.dataset.id)); renderView(); }));
  document.getElementById('selectAllTickets')?.addEventListener('change', e=>{ filteredTickets().slice((state.ticketPage-1)*state.ticketPageSize, state.ticketPage*state.ticketPageSize).forEach(t=> e.target.checked?state.selectedTicketIds.add(String(t.id)):state.selectedTicketIds.delete(String(t.id))); renderView(); });
  document.getElementById('bulkTicketEditBtn')?.addEventListener('click',()=>bulkTickets('edit'));
  document.getElementById('bulkTicketDeleteBtn')?.addEventListener('click',()=>bulkTickets('delete'));
  document.getElementById('saveTelegramConfigBtn')?.addEventListener('click',()=>{ state.telegramConfig={ enabled:document.getElementById('telegramEnabled').checked, botToken:document.getElementById('telegramBotToken').value.trim(), chatId:document.getElementById('telegramChatId').value.trim() }; localStorage.setItem('ism_telegram_config', JSON.stringify(state.telegramConfig)); showToast('Telegram','Configuración guardada'); });
};
const _oldRenderSettings = renderSettings;
renderSettings = function() { const cfg=state.telegramConfig||{}; return _oldRenderSettings().replace('</section>', `<article class="card glass"><div class="section-header"><div><h3>Canal de Telegram</h3><p class="muted">Envío de copia de notificaciones y tickets al canal configurado.</p></div><button class="btn btn-primary btn-sm" id="saveTelegramConfigBtn">Guardar Telegram</button></div><form class="form-grid"><label><span>Enviar copias a Telegram</span><input id="telegramEnabled" type="checkbox" ${cfg.enabled?'checked':''}></label><label><span>Bot Token</span><input id="telegramBotToken" value="${escapeAttr(cfg.botToken||'')}" placeholder="123456:ABC..."></label><label><span>Chat ID / Canal</span><input id="telegramChatId" value="${escapeAttr(cfg.chatId||'')}" placeholder="@canal o -100..."></label></form></article></section>`); };
renderView = function() { updateHeader(); renderNav(); const views = { dashboard: renderDashboard, users: renderUsers, roles: renderRoles, team: renderTeams, inventory: renderInventory, loanManagement: renderLoanManagement, supportTickets: renderSupportTickets, accessControl: renderAccessControl, courses: renderCourses, library: renderLibrary, notifications: renderNotifications, profile: renderProfile, settings: renderSettings }; appContent.innerHTML = (views[state.currentView] || renderDashboard)(); attachViewEvents(); renderNotificationDropdown(); renderCharts(); };

bootApp();



/* === V37: branding ajax, notifications hover, Argentina TZ, polling, mobile and private tickets === */
const ARG_TZ = 'America/Argentina/Buenos_Aires';
function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('es-AR', { timeZone: ARG_TZ, dateStyle: 'short', timeStyle: 'short' });
}
function formatDateOnlyAR(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0,10) || '-';
  return d.toLocaleDateString('es-AR', { timeZone: ARG_TZ });
}
function normalizeRoleCode(role) {
  const r = String(role || '').toLowerCase();
  if (['administrator','administrador','admin'].includes(r)) return 'administrator';
  if (['teacher','docente'].includes(r)) return 'teacher';
  if (['student','alumno'].includes(r)) return 'student';
  return r;
}
function canManageTickets() { return normalizeRoleCode(state.user?.role) === 'administrator'; }
function currentUserId() { return String(state.user?.id || ''); }
function isOwnTicket(t) {
  const uid = currentUserId();
  return !!uid && (String(t?.requester_id || '') === uid || String(t?.created_by || '') === uid);
}
function canViewTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canEditTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canDeleteTicket(t) { return canManageTickets() || isOwnTicket(t); }
function canChangeTicketStatus() { return canManageTickets(); }
function notificationMessage(n) { return `De: ${escapeHtml(notificationSender(n))} — ${escapeHtml(n.message || '')}`; }
function notificationMeta(n) {
  const parts = [`Recibida: ${formatDateTime(n.created_at)}`];
  if (!n.unread && n.read_at) parts.push(`Leída: ${formatDateTime(n.read_at)}`);
  if (isCurrentAdmin() && (n.recipient_name || n.recipient_role)) parts.push(`Destinatario: ${escapeHtml(n.recipient_name || '-')} ${n.recipient_role ? '(' + escapeHtml(n.recipient_role) + ')' : ''}`);
  return parts.join(' · ');
}
function defaultBrandSettings(){ return { institutionName:'Ministerio de Educación Tucumán', institutionSubtitle:'Soporte Técnico', institutionEmail:'robotica@ism.edu.ar', logoDataUrl:'', pollingSeconds:25 }; }
function getBrandSettings(){ return { ...defaultBrandSettings(), ...(state.generalSettings || JSON.parse(localStorage.getItem('ism_general_settings') || '{}')) }; }
function applyBranding(){
  const gs = getBrandSettings();
  document.querySelectorAll('.brand-logo, .centered-logo, #headerBrandLogo').forEach(img => { if (gs.logoDataUrl) img.src = gs.logoDataUrl; });
  document.querySelectorAll('.brand-copy strong').forEach(el => el.textContent = gs.institutionName || 'Ministerio de Educación Tucumán');
  document.querySelectorAll('.brand-copy span').forEach(el => el.textContent = gs.institutionSubtitle || 'Soporte Técnico');
}
const _v37UpdateHeader = updateHeader;
updateHeader = function(){ _v37UpdateHeader(); applyBranding(); };
const _v37RenderNav = renderNav;
renderNav = function(){ _v37RenderNav(); applyBranding(); };

function renderSettings() {
  const gs = getBrandSettings();
  const logoPreview = `<div class="settings-logo-preview"><img id="settingsLogoPreviewImg" src="${escapeAttr(gs.logoDataUrl || './assets/img/logo-Coordinacion-Robotica.png')}" alt="Logo institucional"></div>`;
  const cfg = state.telegramConfig || {};
  return `<section class="settings-layout settings-v37">
    <article class="card glass"><div class="section-header"><div><h3>Configuraciones generales</h3><p class="muted">Los cambios se aplican en tiempo real por AJAX.</p></div><button class="btn btn-primary btn-sm" id="saveSettingsBtn" type="button">Guardar ahora</button></div>
      <form class="form-grid" onsubmit="return false">
        <label><span>Nombre de la institución</span><input id="institutionNameInput" value="${escapeAttr(gs.institutionName)}" /></label>
        <label><span>Subtítulo de la institución</span><input id="institutionSubtitleInput" value="${escapeAttr(gs.institutionSubtitle)}" /></label>
        <label><span>Email institucional</span><input id="institutionEmailInput" value="${escapeAttr(gs.institutionEmail)}" /></label>
        <label><span>Polling al servidor (segundos)</span><input id="pollingSecondsInput" type="number" min="10" max="300" step="5" value="${Number(gs.pollingSeconds || 25)}" /></label>
        <label class="full-span"><span>Logo de la institución</span><input id="institutionLogoInput" type="file" accept="image/*" /></label>${logoPreview}
      </form>
    </article>
    <article class="card glass"><div class="section-header"><div><h3>Canal de Telegram</h3><p class="muted">Copia de notificaciones y tickets al canal configurado.</p></div><button class="btn btn-primary btn-sm" id="saveTelegramConfigBtn">Guardar Telegram</button></div>
      <form class="form-grid"><label><span>Enviar copias a Telegram</span><input id="telegramEnabled" type="checkbox" ${cfg.enabled?'checked':''}></label><label><span>Bot Token</span><input id="telegramBotToken" value="${escapeAttr(cfg.botToken||'')}"></label><label><span>Chat ID / Canal</span><input id="telegramChatId" value="${escapeAttr(cfg.chatId||'')}"></label></form>
    </article>
    <aside class="card glass"><h3>Optimización</h3><div class="list-simple"><div class="list-item"><strong>Zona horaria</strong><span>Argentina (${ARG_TZ})</span></div><div class="list-item"><strong>Actualización</strong><span>AJAX + polling configurable</span></div><div class="list-item"><strong>Mobile First</strong><span>Header compacto y navegación inferior</span></div></div></aside>
  </section>`;
}
async function saveGeneralSettings(silent=false) {
  try {
    const current = getBrandSettings();
    const logoFile = document.getElementById('institutionLogoInput')?.files?.[0] || null;
    const logoDataUrl = logoFile ? await fileToDataUrl(logoFile) : current.logoDataUrl;
    const payload = {
      institutionName: document.getElementById('institutionNameInput')?.value?.trim() || 'Ministerio de Educación Tucumán',
      institutionSubtitle: document.getElementById('institutionSubtitleInput')?.value?.trim() || 'Soporte Técnico',
      institutionEmail: document.getElementById('institutionEmailInput')?.value?.trim() || 'robotica@ism.edu.ar',
      logoDataUrl: logoDataUrl || '',
      pollingSeconds: Math.max(10, Math.min(300, Number(document.getElementById('pollingSecondsInput')?.value || 25)))
    };
    state.generalSettings = payload;
    localStorage.setItem('ism_general_settings', JSON.stringify(payload));
    applyBranding(); restartPolling();
    if (window.sb?.enabled && window.sb.saveAppSetting) await window.sb.saveAppSetting('general_config', payload);
    if (!silent) showToast('Configuración guardada', 'Cambios aplicados en tiempo real');
    return payload;
  } catch(error) { if (!silent) Swal.fire({icon:'error', title:'No se pudo guardar', text:error.message || String(error)}); }
}
const saveSettingsDebouncedV37 = debounce(() => saveGeneralSettings(true), 650);
const _v37AttachViewEvents = attachViewEvents;
attachViewEvents = function(){
  _v37AttachViewEvents();
  ['institutionNameInput','institutionSubtitleInput','institutionEmailInput','pollingSecondsInput'].forEach(id => document.getElementById(id)?.addEventListener('input', () => { saveSettingsDebouncedV37(); applyBranding(); }));
  document.getElementById('institutionLogoInput')?.addEventListener('change', async e => { const data = await fileToDataUrl(e.target.files?.[0]); if (data) { const img = document.getElementById('settingsLogoPreviewImg'); if (img) img.src=data; await saveGeneralSettings(true); } });
  document.getElementById('saveSettingsBtn')?.addEventListener('click', () => saveGeneralSettings(false));
};

function unreadCount() { return (state.notifications || []).filter(n => n.unread && !n.read_at).length; }
function renderNotificationDropdown() {
  const unreadRows = (state.notifications || []).filter(n => n.unread && !n.read_at);
  notificationsPreview.innerHTML = unreadRows.length ? unreadRows.slice(0, 30).map(n => `
    <button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}>
      <div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div>
      <span class="status-pill status-pending">Sin leer</span>
    </button>`).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ir al área de notificaciones</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
  notificationsPreview.classList.toggle('open', state.notificationsOpen);
}
function filteredTickets() {
  return (state.supportTickets || []).filter(t => {
    if (!canViewTicket(t)) return false;
    const q = String(state.filters.ticketSearch||'').toLowerCase();
    const okQ = !q || [t.ticket_number,t.title,t.description,t.asset_label,t.incident_type,t.requester_name,t.room].some(v=>String(v||'').toLowerCase().includes(q));
    const okS = !state.filters.ticketStatus || state.filters.ticketStatus === 'all' || t.status === state.filters.ticketStatus;
    return okQ && okS;
  });
}
function renderSupportTickets() {
  const rows = filteredTickets();
  const totalPages = Math.max(1, Math.ceil(rows.length / state.ticketPageSize));
  state.ticketPage = Math.min(Math.max(1, state.ticketPage), totalPages);
  const pageRows = rows.slice((state.ticketPage-1)*state.ticketPageSize, state.ticketPage*state.ticketPageSize);
  const statusOptions = ['<option value="all">Todos los estados</option>'].concat((state.ticketStatuses||[]).map(s=>`<option value="${escapeAttr(s.code)}" ${state.filters.ticketStatus===s.code?'selected':''}>${escapeHtml(s.name)}</option>`)).join('');
  return `<section class="card glass support-ticket-card"><div class="section-header"><div><h3>Soporte Ticket</h3><p class="muted">Admins ven todos los tickets; docentes y alumnos solo visualizan sus propios tickets.</p></div><div class="support-ticket-actions"><button class="btn btn-secondary btn-sm" data-export="supportTickets">${icons.export} Exportar CSV</button>${canManageTickets()?`<button class="btn btn-secondary btn-sm" id="manageTicketIncidentsBtn">${icons.filter} Incidencias</button>`:''}<button class="btn btn-primary btn-sm" id="newTicketBtn">Nuevo ticket</button></div></div><div class="support-ticket-filters"><input type="search" id="ticketSearch" placeholder="Buscar por número, equipo, insumo o descripción" value="${escapeHtml(state.filters.ticketSearch)}"><select id="ticketStatusFilter">${statusOptions}</select></div><div class="support-ticket-bulk"><button class="btn btn-secondary btn-sm" id="bulkTicketEditBtn" ${state.selectedTicketIds.size && canChangeTicketStatus()?'':'disabled'}>${icons.edit} Edición masiva</button><button class="btn btn-secondary btn-sm" id="bulkTicketDeleteBtn" ${state.selectedTicketIds.size && Array.from(state.selectedTicketIds).every(id => canDeleteTicket((state.supportTickets||[]).find(t=>String(t.id)===String(id))))?'':'disabled'}>${icons.trash} Eliminación masiva</button></div>${ticketPager(rows,'top')}<div class="table-wrap support-ticket-table"><table class="table"><thead><tr><th><input type="checkbox" id="selectAllTickets" ${pageRows.length && pageRows.every(t=>state.selectedTicketIds.has(String(t.id)))?'checked':''}></th><th>N° Ticket</th><th>Fecha</th><th>Incidencia</th><th>Equipo/Insumo</th><th>Sala</th><th>Solicitante</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${pageRows.map(t=>`<tr><td><input type="checkbox" class="ticket-check" data-id="${escapeAttr(t.id)}" ${state.selectedTicketIds.has(String(t.id))?'checked':''}></td><td><strong>${escapeHtml(t.ticket_number)}</strong></td><td>${escapeHtml(formatDateOnlyAR(t.created_at))}</td><td>${escapeHtml(t.incident_type || '-')}</td><td>${escapeHtml(t.asset_label || '-')}</td><td>${escapeHtml(t.room || '-')}</td><td>${escapeHtml(t.requester_name || '-')}</td><td>${ticketPill(t.status)}</td><td>${actionButtons('supportTicket', t.id)}</td></tr>`).join('') || '<tr><td colspan="9" class="muted">Sin tickets registrados.</td></tr>'}</tbody></table></div>${ticketPager(rows,'bottom')}</section>`;
}

let pollingTimerV37 = null;
function restartPolling(){
  clearInterval(pollingTimerV37);
  const seconds = Math.max(10, Math.min(300, Number(getBrandSettings().pollingSeconds || 25)));
  pollingTimerV37 = setInterval(async () => {
    if (!window.sb?.enabled) return;
    try {
      const [notifications, tickets] = await Promise.all([window.sb.listNotifications?.().catch(()=>null), window.sb.listSupportTickets?.().catch(()=>null)]);
      if (Array.isArray(notifications)) state.notifications = notifications;
      if (Array.isArray(tickets)) state.supportTickets = tickets;
      updateHeader(); renderNotificationDropdown();
      if (['notifications','supportTickets'].includes(state.currentView)) renderView();
    } catch(e) { console.warn('polling v37', e); }
  }, seconds * 1000);
}
async function notifyAdminsLogoutDuration(){
  try { if (window.sb?.enabled && window.sb.logUserLogout) await window.sb.logUserLogout(); } catch(e) { console.warn(e); }
}
const _v37BindEvents = bindEvents;
bindEvents = function(){
  _v37BindEvents();
  const wrap = document.getElementById('notificationsWrapper');
  wrap?.addEventListener('mouseenter', () => { state.notificationsOpen = true; renderNotificationDropdown(); });
  wrap?.addEventListener('mouseleave', () => { state.notificationsOpen = false; renderNotificationDropdown(); });
  window.addEventListener('beforeunload', () => { try { navigator.sendBeacon?.('#'); } catch(_){} });
};
const _v37BootApp = bootApp;
bootApp = async function(){
  await _v37BootApp();
  applyBranding(); restartPolling();
  try { if (window.sb?.enabled && window.sb.logUserLogin) await window.sb.logUserLogin(); } catch(e) { console.warn('login notification', e); }
};

// Activación tardía V37 porque las versiones previas llaman bootApp antes de este bloque.
setTimeout(() => {
  try {
    applyBranding(); restartPolling(); updateHeader(); renderNotificationDropdown();
    const wrap = document.getElementById('notificationsWrapper');
    wrap?.addEventListener('mouseenter', () => { state.notificationsOpen = true; renderNotificationDropdown(); });
    wrap?.addEventListener('mouseleave', () => { state.notificationsOpen = false; renderNotificationDropdown(); });
    document.getElementById('headerLogoutBtn')?.addEventListener('click', () => { try { window.sb?.logUserLogout?.(); } catch(_){} }, true);
    document.getElementById('sidebarLogoutBtn')?.addEventListener('click', () => { try { window.sb?.logUserLogout?.(); } catch(_){} }, true);
    if (window.sb?.enabled && window.sb.logUserLogin) window.sb.logUserLogin().catch(()=>{});
  } catch(e) { console.warn('V37 init', e); }
}, 600);

/* === V38 Mobile First / dedupe notifications / role menu permissions === */
(function(){
  const VIEW_PERMISSION = {
    dashboard:'dashboard.read', users:'users.read', roles:'roles.read', team:'teams.read', inventory:'inventory.read', loanManagement:'loan.read', supportTickets:'support.read', accessControl:'access.read', courses:'courses.read', library:'library.read', notifications:'notifications.read', profile:null, settings:'settings.read'
  };
  window.__ismNotificationKeys = new Set();
  const oldUnreadCount = unreadCount;
  unreadCount = function(){ return (state.notifications || []).filter(n => n.unread && !n.read_at).length; };
  const oldGetVisibleViews = getVisibleViews;
  getVisibleViews = function(){
    const base = oldGetVisibleViews();
    const role = (state.rolesData || []).find(r => String(r.code).toLowerCase() === String(state.user.role).toLowerCase() || String(r.name).toLowerCase() === String(state.user.role).toLowerCase());
    const perms = new Set(role?.permissions || []);
    if (!perms.size) return base.filter(v => v !== 'courses' || state.user.role === 'administrator');
    return base.filter(v => !VIEW_PERMISSION[v] || perms.has(VIEW_PERMISSION[v]) || (v === 'supportTickets' && (perms.has('support.create') || perms.has('support.manage'))));
  };
  const oldRenderNav38 = renderNav;
  renderNav = function(){ oldRenderNav38(); document.body.classList.toggle('mobile-shell-ready', true); };
  const oldRenderNotificationDropdown38 = renderNotificationDropdown;
  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const seen = new Set();
    const unreadRows = (state.notifications || []).filter(n => n.unread && !n.read_at).filter(n => {
      const k = `${n.title}|${n.message}|${n.created_by||''}|${n.created_at||''}`;
      if (seen.has(k)) return false; seen.add(k); return true;
    });
    notificationsPreview.innerHTML = unreadRows.length ? unreadRows.slice(0, 30).map(n => `
      <button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}>
        <div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div>
        <span class="status-pill status-pending">Sin leer</span>
      </button>
    `).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver todas</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
    notificationsPreview.classList.toggle('open', state.notificationsOpen);
  };
  function dedupeNotifications(){
    const seen = new Set();
    state.notifications = (state.notifications || []).filter(n => {
      const k = `${n.title}|${n.message}|${n.recipient_profile_id||n.recipient_name||''}`;
      if (seen.has(k)) return false; seen.add(k); return true;
    });
  }
  const oldRenderNotifications38 = renderNotifications;
  renderNotifications = function(){ dedupeNotifications(); return oldRenderNotifications38(); };
  const oldRefresh38 = refreshSupabaseData;
  refreshSupabaseData = async function(){ await oldRefresh38(); dedupeNotifications(); updateHeader(); };
  const oldOpenTicketForm38 = openTicketForm;
  openTicketForm = async function(ticket=null){
    const before = (state.supportTickets || []).length;
    await oldOpenTicketForm38(ticket);
    dedupeNotifications();
    updateHeader();
  };
  const oldNotificationMeta38 = notificationMeta;
  notificationMeta = function(n){
    const parts = [`Recibida: ${formatDateTime(n.created_at)}`];
    if (!n.unread && n.read_at) parts.push(`Leída: ${formatDateTime(n.read_at)}`);
    return parts.join(' · ');
  };
})();


/* === V40 hotfix: notification helpers, safe telegram, mobile shell === */
function notificationStableKeyV40(n){ return [n.recipient_profile_id||'', n.title||'', n.message||'', n.section||'', String(n.created_at||'').slice(0,16)].join('|'); }
function dedupeNotificationsV40(){
  const seen = new Set();
  state.notifications = (state.notifications || []).filter(n => { const k = notificationStableKeyV40(n); if (seen.has(k)) return false; seen.add(k); return true; });
  return state.notifications;
}
async function markNotificationsReadState(read=true, allUnread=false){
  const ids = allUnread ? (state.notifications || []).filter(n => n.unread || !n.read_at).map(n => n.id) : Array.from(document.querySelectorAll('.notification-row-check:checked')).map(cb => cb.dataset.id);
  const list = ids.map(String).filter(Boolean);
  if (!list.length) { if (window.Swal) Swal.fire({icon:'info', title:'Sin selección', text:'Seleccioná al menos una notificación.'}); return; }
  try { await window.sb?.markNotifications?.(list, read); } catch(e) { console.warn('mark notifications fallback', e); }
  const idSet = new Set(list);
  state.notifications.forEach(n => { if (idSet.has(String(n.id))) { n.unread = !read; n.read_at = read ? new Date().toISOString() : null; } });
  dedupeNotificationsV40(); updateHeader(); renderView();
  if (window.Swal) Swal.fire({ toast:true, position:'top-end', timer:1700, showConfirmButton:false, icon:'success', title: read ? 'Marcadas como leídas' : 'Marcadas sin leer' });
}
window.markNotificationsReadState = markNotificationsReadState;

/* === V39: settings cleanup, notification truth, team dedupe, mobile fixes === */
(function(){
  function uniqueBy(arr, keyFn){ const seen=new Set(); return (arr||[]).filter(x=>{ const k=keyFn(x); if(seen.has(k)) return false; seen.add(k); return true; }); }
  window.__ismNotificationSessionLogged = window.__ismNotificationSessionLogged || false;

  // Configuración: una sola card Telegram y sin card Optimización.
  renderSettings = function() {
    const gs = getBrandSettings ? getBrandSettings() : {institutionName:'Ministerio de Educación Tucumán', institutionSubtitle:'Soporte Técnico', institutionEmail:'', logoDataUrl:'', pollingSeconds:25};
    const cfg = state.telegramConfig || {};
    const logoPreview = `<div class="settings-logo-preview"><img id="settingsLogoPreviewImg" src="${escapeAttr(gs.logoDataUrl || './assets/img/logo-Coordinacion-Robotica.png')}" alt="Logo institucional"></div>`;
    return `<section class="settings-layout settings-v39">
      <article class="card glass"><div class="section-header"><div><h3>Configuraciones generales</h3><p class="muted">Los cambios se aplican en tiempo real por AJAX.</p></div><button class="btn btn-primary btn-sm" id="saveSettingsBtn" type="button">Guardar ahora</button></div>
        <form class="form-grid" onsubmit="return false">
          <label><span>Nombre de la institución</span><input id="institutionNameInput" value="${escapeAttr(gs.institutionName)}" /></label>
          <label><span>Subtítulo de la institución</span><input id="institutionSubtitleInput" value="${escapeAttr(gs.institutionSubtitle)}" /></label>
          <label><span>Email institucional</span><input id="institutionEmailInput" value="${escapeAttr(gs.institutionEmail)}" /></label>
          <label><span>Polling al servidor (segundos)</span><input id="pollingSecondsInput" type="number" min="10" max="300" step="5" value="${Number(gs.pollingSeconds || 25)}" /></label>
          <label class="full-span"><span>Logo de la institución</span><input id="institutionLogoInput" type="file" accept="image/*" /></label>
          <label class="full-span"><span>Icono de app / Favicon</span><input id="institutionFaviconInput" type="file" accept="image/*,.svg" /></label>${logoPreview}
        </form>
      </article>
      <article class="card glass"><div class="section-header"><div><h3>Canal de Telegram</h3><p class="muted">Copia de notificaciones y tickets al canal configurado.</p></div><button class="btn btn-primary btn-sm" id="saveTelegramConfigBtn" type="button">Guardar Telegram</button></div>
        <form class="form-grid" onsubmit="return false"><label><span>Enviar copias a Telegram</span><input id="telegramEnabled" type="checkbox" ${cfg.enabled?'checked':''}></label><label><span>Bot Token</span><input id="telegramBotToken" value="${escapeAttr(cfg.botToken||'')}"></label><label><span>Chat ID / Canal</span><input id="telegramChatId" value="${escapeAttr(cfg.chatId||'')}"></label></form>
      </article>
    </section>`;
  };

  function notificationDedupeKey(n){
    const minute = n.created_at ? String(n.created_at).slice(0,16) : '';
    return [n.recipient_profile_id||'', n.title||'', n.message||'', n.section||'', minute].join('|');
  }
  function dedupeNotificationsV39(){
    state.notifications = uniqueBy(state.notifications || [], notificationDedupeKey);
    return state.notifications;
  }
  unreadCount = function(){ dedupeNotificationsV39(); return (state.notifications || []).filter(n => n.unread && !n.read_at).length; };
  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const unreadRows = dedupeNotificationsV39().filter(n => n.unread && !n.read_at).slice(0, 30);
    notificationsPreview.innerHTML = unreadRows.length ? unreadRows.map(n => `
      <button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}>
        <div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div>
        <span class="status-pill status-pending">Sin leer</span>
      </button>`).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver todas</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
    notificationsPreview.classList.toggle('open', state.notificationsOpen);
  };
  const oldRenderNotificationsV39 = renderNotifications;
  renderNotifications = function(){ dedupeNotificationsV39(); return oldRenderNotificationsV39(); };

  const oldMarkNotificationsReadState = window.markNotificationsReadState || markNotificationsReadState;
  markNotificationsReadState = async function(read=true, allUnread=false){
    const ids = allUnread ? (state.notifications || []).filter(n => n.unread || !n.read_at).map(n => n.id) : Array.from(appContent.querySelectorAll('.notification-row-check:checked')).map(cb => cb.dataset.id);
    const list = ids.map(String).filter(Boolean);
    if (!list.length) { showToast('Notificaciones', 'Seleccioná al menos una notificación.'); return; }
    try { await window.sb?.markNotifications?.(list, read); } catch(e) { console.warn(e); }
    const idSet = new Set(list);
    state.notifications.forEach(n => { if (idSet.has(String(n.id))) { n.unread = !read; n.read_at = read ? new Date().toISOString() : null; } });
    dedupeNotificationsV39(); updateHeader(); renderView();
  };

  const oldSelectNotificationV39 = selectNotification;
  selectNotification = async function(id){
    const target = state.notifications.find(n => String(n.id) === String(id));
    if (target) { target.unread = false; target.read_at = new Date().toISOString(); try { await window.sb?.markNotificationRead?.(id); } catch(e) { console.warn(e); } }
    return oldSelectNotificationV39(id);
  };

  // Deduplicar personas en la vista de equipos aunque el backend devuelva duplicados.
  const oldOpenTeamDetailV39 = (typeof window.openTeamDetail === 'function') ? window.openTeamDetail : function(team){
    return Swal.fire({title:'Detalle de equipo', html:`<div class="detail-grid"><div><b>Nombre</b><br>${escapeHtml(team?.name||'-')}</div><div><b>Proyecto</b><br>${escapeHtml(team?.project||'-')}</div><div><b>Mentores</b><br>${escapeHtml((team?.teachers||team?.teacher_people||[]).map(x=>x.name||x).join(', ')||'-')}</div></div>`, width:720});
  };
  window.openTeamDetail = function(team){
    if (team) {
      team.teacher_people = uniqueBy(team.teacher_people || [], p => String(p.id || p.name || '').toLowerCase());
      team.student_people = uniqueBy(team.student_people || [], p => String(p.id || p.name || '').toLowerCase());
      team.members = uniqueBy(team.members || [], p => String(p.id || p.name || '').toLowerCase() + '|' + String(p.role_in_team||''));
      team.teachers = uniqueBy(team.teachers || [], x => String(x).toLowerCase());
      team.student_names = uniqueBy(team.student_names || [], x => String(x).toLowerCase());
    }
    return oldOpenTeamDetailV39(team);
  };

  // Login notification: una vez por sesión, y nunca si el backend ya lo bloquea/deduplica.
  setTimeout(() => {
    try {
      if (!sessionStorage.getItem('ism_login_notified_v39') && window.sb?.logUserLogin) {
        sessionStorage.setItem('ism_login_notified_v39','1');
        window.sb.logUserLogin().catch(()=>{});
      }
    } catch(_) {}
    updateHeader(); renderNotificationDropdown(); if (state.currentView === 'settings') renderView();
  }, 900);
})();


/* === V40 final: Mobile First emergency layout + dropdown + SweetAlert guard === */
(function(){
  if (window.__v40FinalApplied) return; window.__v40FinalApplied = true;
  const oldUnread = typeof unreadCount === 'function' ? unreadCount : null;
  unreadCount = function(){ dedupeNotificationsV40(); return (state.notifications||[]).filter(n=>n.unread && !n.read_at).length; };
  const oldRefresh = refreshSupabaseData;
  refreshSupabaseData = async function(){ await oldRefresh(); dedupeNotificationsV40(); updateHeader(); };
  const oldRenderDropdown = renderNotificationDropdown;
  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const rows = dedupeNotificationsV40().filter(n => n.unread && !n.read_at).slice(0,25);
    notificationsPreview.innerHTML = rows.length ? rows.map(n => `<button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}><div><strong>${escapeHtml(n.title)}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div><span class="status-pill status-pending">Sin leer</span></button>`).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver todas</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
    notificationsPreview.classList.toggle('open', !!state.notificationsOpen);
  };
  document.addEventListener('mouseover', e => { if (e.target.closest('.notifications-wrapper')) { state.notificationsOpen = true; renderNotificationDropdown(); } });
  document.addEventListener('click', e => { if (e.target.closest('[data-view-btn="notifications"]')) { state.currentView='notifications'; state.notificationsOpen=false; renderView(); updateHeader(); } });
  window.addEventListener('resize', () => document.body.classList.toggle('is-mobile-v40', innerWidth <= 820));
  document.body.classList.toggle('is-mobile-v40', innerWidth <= 820);
})();


/* === V41: Mobile shell real, team guard, safe Telegram, notification UX === */
(function(){
  if (window.__v41Applied) return; window.__v41Applied = true;

  function ensureHeaderLogo(){
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('mobileHeaderLogo')) return;
    const img = document.createElement('img');
    img.id = 'mobileHeaderLogo';
    img.className = 'mobile-header-logo';
    img.alt = 'Logo institucional';
    img.src = (document.querySelector('.brand-logo')?.src) || './assets/logo.svg';
    topbar.insertBefore(img, topbar.firstChild);
  }

  function buildBottomNav(){
    let bar = document.getElementById('mobileBottomNav');
    if (!bar) {
      bar = document.createElement('nav');
      bar.id = 'mobileBottomNav';
      bar.className = 'mobile-bottom-nav';
      document.body.appendChild(bar);
    }
    const allowed = (typeof getVisibleViews === 'function') ? getVisibleViews() : ['dashboard','loanManagement','supportTickets','inventory'];
    const main = ['dashboard','loanManagement','supportTickets','inventory'].filter(k => allowed.includes(k));
    const more = (window.nav || nav || []).filter(item => allowed.includes(item.key) && !main.includes(item.key));
    const items = (window.nav || nav || []).filter(item => main.includes(item.key));
    const itemHtml = items.map(item => `<button type="button" class="${state.currentView===item.key?'active':''}" data-mobile-view="${escapeAttr(item.key)}" title="${escapeAttr(item.label?.[state.user.role] || item.label?.administrator || item.key)}">${icons[item.icon] || ''}</button>`).join('');
    bar.innerHTML = `${itemHtml}<button type="button" data-mobile-more="1" title="Más">${icons.menu || '<svg viewBox="0 0 24 24" class="icon"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>'}</button>`;
    bar.querySelectorAll('[data-mobile-view]').forEach(btn => btn.onclick = () => { state.currentView = btn.dataset.mobileView; renderView(); updateHeader(); });
    const moreBtn = bar.querySelector('[data-mobile-more]');
    if (moreBtn) moreBtn.onclick = async () => {
      const html = `<div class="mobile-more-list">${more.map(item => `<button class="btn btn-secondary full-width" data-more-view="${escapeAttr(item.key)}">${icons[item.icon]||''}<span>${escapeHtml(item.label?.[state.user.role] || item.label?.administrator || item.key)}</span></button>`).join('')}<button class="btn btn-secondary full-width" data-more-logout="1">${icons.logout||''}<span>Cerrar sesión</span></button></div>`;
      await Swal.fire({title:'Menú', html, showConfirmButton:false, width:360, didOpen: popup => {
        popup.querySelectorAll('[data-more-view]').forEach(b => b.onclick = () => { Swal.close(); state.currentView=b.dataset.moreView; renderView(); updateHeader(); });
        const lo = popup.querySelector('[data-more-logout]'); if (lo) lo.onclick = () => { Swal.close(); document.getElementById('headerLogoutBtn')?.click(); };
      }});
    };
  }

  const _updateHeaderV41 = updateHeader;
  updateHeader = function(){
    _updateHeaderV41();
    ensureHeaderLogo();
    buildBottomNav();
    const logo = document.getElementById('mobileHeaderLogo');
    const brand = document.querySelector('.brand-logo');
    if (logo && brand) logo.src = brand.src;
  };

  const _renderNavV41 = renderNav;
  renderNav = function(){ _renderNavV41(); buildBottomNav(); };

  // Si alguna versión anterior no declaró el detalle de equipo, se provee uno seguro.
  if (typeof window.openTeamDetail !== 'function' && typeof openTeamDetail !== 'function') {
    window.openTeamDetail = async function(team){
      return Swal.fire({title:'Detalle de equipo', width:720, html:`<div class="detail-grid"><div><b>Nombre</b><br>${escapeHtml(team?.name||'-')}</div><div><b>Proyecto</b><br>${escapeHtml(team?.project||'-')}</div><div><b>Mentores</b><br>${escapeHtml((team?.teachers||[]).join(', ')||'-')}</div></div>`});
    };
  }

  // Telegram: evita errores 404/CORS por token inválido. Para enviar, el token debe tener formato 123456:ABC...
  const _notifyTelegramV41 = (typeof notifyTelegram === 'function') ? notifyTelegram : async function(){};
  notifyTelegram = async function(message){
    const cfg = state.telegramConfig || JSON.parse(localStorage.getItem('ism_telegram_config') || '{}');
    if (!cfg?.enabled) return;
    const token = String(cfg.botToken || '').trim();
    const chatId = String(cfg.chatId || '-1002784996065').trim();
    if (!/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
      console.warn('Telegram no enviado: token inválido o incompleto. Debe tener formato 123456:ABC...');
      return;
    }
    try {
      await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
        method:'POST', mode:'no-cors', keepalive:true,
        headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
        body:new URLSearchParams({chat_id:chatId,text:String(message||''),disable_web_page_preview:'true'})
      });
    } catch(e) { console.warn('Telegram no disponible', e); }
  };

  // SweetAlert fallback para avisos después de cambios.
  window.appOk = (title, text='') => window.Swal ? Swal.fire({icon:'success', title, text, timer:1500, showConfirmButton:false}) : alert(title);
  window.appError = (title, err) => window.Swal ? Swal.fire({icon:'error', title, text: err?.message || String(err||'')}) : alert(title + ': ' + (err?.message||err));

  buildBottomNav(); ensureHeaderLogo();
})();


/* === V42: mobile header/icon refresh, favicon config and safer menu/telegram === */
(function(){
  if (window.__v42Applied) return; window.__v42Applied = true;

  const i = (name, path, extra='') => `<svg viewBox="0 0 24 24" class="icon icon-${name}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${path}</svg>`;
  Object.assign(icons, {
    dashboard: i('dashboard','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    users: i('users','<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    roles: i('roles','<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'),
    team: i('team','<circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>'),
    inventory: i('inventory','<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>'),
    loan: i('loan','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M15 17l2-2 2 2"/>'),
    ticket: i('ticket','<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7Z"/><path d="M9 9h6M9 15h6"/>'),
    support: i('support','<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M12 7v5M12 16h.01"/>'),
    access: i('access','<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    courses: i('courses','<path d="m22 10-10-5-10 5 10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
    library: i('library','<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>'),
    notifications: i('notifications','<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    profile: i('profile','<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>'),
    settings: i('settings','<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.18.33.39.65.6 1H20a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-.51 1Z"/>'),
    menu: i('menu','<path d="M4 6h16M4 12h16M4 18h16"/>'),
    close: i('close','<path d="M18 6 6 18M6 6l12 12"/>'),
    logout: i('logout','<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>')
  });

  const oldDefaultBrand = typeof defaultBrandSettings === 'function' ? defaultBrandSettings : null;
  window.__getBrandSettingsV42 = () => (typeof getBrandSettings === 'function' ? getBrandSettings() : JSON.parse(localStorage.getItem('ism_general_settings') || '{}'));

  function applyFaviconAndManifest(){
    const gs = window.__getBrandSettingsV42();
    const icon = gs.faviconDataUrl || gs.logoDataUrl || './assets/logo.svg';
    let link = document.querySelector('link[rel="icon"]') || document.createElement('link');
    link.rel = 'icon'; link.href = icon; document.head.appendChild(link);
    let apple = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
    apple.rel = 'apple-touch-icon'; apple.href = icon; document.head.appendChild(apple);
    try {
      const manifest = {name: gs.institutionName || 'ISM Robosoft', short_name: 'ISM Robo', start_url:'./app.html', display:'standalone', background_color:'#07111f', theme_color:'#081225', icons:[{src:icon,sizes:'192x192',type: icon.startsWith('data:image/svg')?'image/svg+xml':'image/png',purpose:'any maskable'}]};
      const blob = new Blob([JSON.stringify(manifest)], {type:'application/manifest+json'});
      const url = URL.createObjectURL(blob);
      const m = document.querySelector('link[rel="manifest"]'); if (m) m.href = url;
    } catch(_) {}
  }

  const prevApplyBranding = typeof applyBranding === 'function' ? applyBranding : function(){};
  applyBranding = function(){ prevApplyBranding(); applyFaviconAndManifest(); const logo=document.getElementById('mobileHeaderLogo'); const gs=window.__getBrandSettingsV42(); if(logo && (gs.logoDataUrl||gs.faviconDataUrl)) logo.src=gs.logoDataUrl||gs.faviconDataUrl; };

  const prevRenderSettings = renderSettings;
  renderSettings = function(){
    const html = prevRenderSettings();
    return html.replace('<label class="full-span"><span>Logo de la institución</span><input id="institutionLogoInput" type="file" accept="image/*" /></label>', '<label class="full-span"><span>Logo de la institución</span><input id="institutionLogoInput" type="file" accept="image/*" /></label><label class="full-span"><span>Icono de app / Favicon</span><input id="institutionFaviconInput" type="file" accept="image/*,.svg" /></label>');
  };

  const prevSaveGeneralSettings = saveGeneralSettings;
  saveGeneralSettings = async function(silent=false){
    const current = window.__getBrandSettingsV42();
    const favFile = document.getElementById('institutionFaviconInput')?.files?.[0] || null;
    const favDataUrl = favFile ? await fileToDataUrl(favFile) : current.faviconDataUrl;
    const payload = await prevSaveGeneralSettings(true) || current;
    payload.faviconDataUrl = favDataUrl || payload.faviconDataUrl || '';
    state.generalSettings = {...(state.generalSettings||{}), ...payload};
    localStorage.setItem('ism_general_settings', JSON.stringify(state.generalSettings));
    if (window.sb?.enabled && window.sb.saveAppSetting) await window.sb.saveAppSetting('general_config', state.generalSettings).catch(()=>{});
    applyBranding();
    if (!silent) (window.Swal ? Swal.fire({icon:'success',title:'Configuración guardada',timer:1400,showConfirmButton:false}) : alert('Configuración guardada'));
    return state.generalSettings;
  };

  const prevAttach = attachViewEvents;
  attachViewEvents = function(){
    prevAttach();
    document.getElementById('institutionFaviconInput')?.addEventListener('change', async () => saveGeneralSettings(true));
  };

  function ensureHeaderLogoV42(){
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;
    let img = document.getElementById('mobileHeaderLogo');
    if (!img) { img = document.createElement('img'); img.id='mobileHeaderLogo'; img.className='mobile-header-logo'; img.alt='Logo institucional'; topbar.insertBefore(img, topbar.firstChild); }
    const gs = window.__getBrandSettingsV42();
    img.src = gs.logoDataUrl || gs.faviconDataUrl || document.querySelector('.brand-logo')?.src || './assets/logo.svg';
  }

  function closeMobileMenu(){ if (window.Swal && Swal.isVisible() && document.querySelector('.mobile-more-list')) Swal.close(); }
  const prevBuildBottom = typeof buildBottomNav === 'function' ? buildBottomNav : null;
  function buildBottomNavV42(){
    let bar = document.getElementById('mobileBottomNav');
    if (!bar) { bar=document.createElement('nav'); bar.id='mobileBottomNav'; bar.className='mobile-bottom-nav'; document.body.appendChild(bar); }
    const allowed = (typeof getVisibleViews === 'function') ? getVisibleViews() : ['dashboard','loanManagement','supportTickets','inventory'];
    const main = ['dashboard','loanManagement','supportTickets','inventory'].filter(k => allowed.includes(k));
    const allNav = (window.nav || nav || []);
    const more = allNav.filter(item => allowed.includes(item.key) && !main.includes(item.key));
    const items = allNav.filter(item => main.includes(item.key));
    bar.innerHTML = `${items.map(item => `<button type="button" class="${state.currentView===item.key?'active':''}" data-mobile-view="${escapeAttr(item.key)}" title="${escapeAttr(item.label?.[state.user.role] || item.label?.administrator || item.key)}">${icons[item.icon] || ''}</button>`).join('')}<button type="button" class="mobile-more-btn" data-mobile-more="1" title="Menú">${icons.menu}</button>`;
    bar.querySelectorAll('[data-mobile-view]').forEach(btn => btn.onclick=()=>{ closeMobileMenu(); state.currentView=btn.dataset.mobileView; renderView(); updateHeader(); });
    bar.querySelector('[data-mobile-more]')?.addEventListener('click', async () => {
      if (window.Swal && Swal.isVisible() && document.querySelector('.mobile-more-list')) { Swal.close(); return; }
      const html = `<button type="button" class="mobile-more-close" aria-label="Cerrar">${icons.close}</button><div class="mobile-more-list">${more.map(item => `<button class="btn btn-secondary full-width" data-more-view="${escapeAttr(item.key)}">${icons[item.icon]||''}<span>${escapeHtml(item.label?.[state.user.role] || item.label?.administrator || item.key)}</span></button>`).join('')}<button class="btn btn-secondary full-width" data-more-logout="1">${icons.logout||''}<span>Cerrar sesión</span></button></div>`;
      await Swal.fire({title:'Menú', html, showConfirmButton:false, showCloseButton:false, width:360, customClass:{popup:'mobile-menu-popup'}, didOpen: popup => {
        popup.querySelector('.mobile-more-close')?.addEventListener('click', () => Swal.close());
        popup.querySelectorAll('[data-more-view]').forEach(b => b.onclick=()=>{ Swal.close(); state.currentView=b.dataset.moreView; renderView(); updateHeader(); });
        popup.querySelector('[data-more-logout]')?.addEventListener('click',()=>{ Swal.close(); document.getElementById('headerLogoutBtn')?.click(); });
      }});
    });
  }

  const prevUpdate = updateHeader;
  updateHeader = function(){ prevUpdate(); ensureHeaderLogoV42(); buildBottomNavV42(); };
  const prevRenderNav = renderNav;
  renderNav = function(){ prevRenderNav(); buildBottomNavV42(); };

  // Telegram: solo intenta enviar con token válido. Un 404 significa token inválido en Telegram.
  notifyTelegram = async function(message){
    const cfg = state.telegramConfig || JSON.parse(localStorage.getItem('ism_telegram_config') || '{}');
    if (!cfg?.enabled) return;
    const token = String(cfg.botToken || '').trim();
    const chatId = String(cfg.chatId || '-1002784996065').trim();
    if (!/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(token)) { console.warn('Telegram no enviado: Bot Token inválido. Debe incluir el prefijo numérico, ejemplo 123456789:AA...'); return; }
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:chatId, text:String(message||''), disable_web_page_preview:true})});
      if (!res.ok) console.warn('Telegram rechazó el envío:', res.status, await res.text().catch(() => ''));
    } catch(e) { console.warn('Telegram no disponible', e); }
  };

  window.addEventListener('keydown', e => { if(e.key==='Escape') closeMobileMenu(); });
  applyBranding(); buildBottomNavV42(); ensureHeaderLogoV42();
})();

/* === V44: notification routing + feather-style icons + header polish === */
(function(){
  const svg = (body) => `<svg viewBox="0 0 24 24" class="icon" aria-hidden="true">${body}</svg>`;
  Object.assign(icons, {
    dashboard: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>'),
    users: svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    roles: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'),
    team: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    inventory: svg('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>'),
    loan: svg('<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>'),
    support: svg('<path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M9 9h6"/><path d="M9 13h4"/>'),
    access: svg('<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    courses: svg('<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
    library: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>'),
    notifications: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    profile: svg('<path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/>'),
    settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82V22a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8.6 20a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.6 4a1.65 1.65 0 0 0 1-.6A1.65 1.65 0 0 0 9.91 2H10a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.14.33.34.63.6.88.26.26.55.46.88.6H22a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 20 15c-.17.35-.37.65-.6 1Z"/>'),
    logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'),
    fullscreen: svg('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>')
  });

  function notificationDestinationV44(n){
    const hay = `${n.section||''} ${n.module||''} ${n.target_view||''} ${n.title||''} ${n.message||''}`.toLowerCase();
    if (/soporte|ticket/.test(hay)) return 'supportTicket';
    if (/prestamo|préstamo|loan|solicitud/.test(hay)) return 'loanManagement';
    if (/inventario|stock|insumo|asset|barcode/.test(hay)) return 'inventory';
    if (/equipo|team|mentor/.test(hay)) return 'teams';
    if (/usuario|sesión|sesion|login|logout|perfil/.test(hay)) return 'users';
    if (/curso|campus|clase|biblioteca/.test(hay)) return 'courses';
    return 'notifications';
  }
  window.notificationDestinationV44 = notificationDestinationV44;

  const previousSelect = typeof selectNotification === 'function' ? selectNotification : null;
  selectNotification = async function(id){
    const target = (state.notifications||[]).find(n => String(n.id) === String(id));
    if (!target) return previousSelect ? previousSelect(id) : null;
    target.unread = false; target.read_at = target.read_at || new Date().toISOString(); state.notificationsOpen = false;
    try { await window.sb?.markNotificationRead?.(id); } catch(e) { console.warn('markNotificationRead', e); }
    if (typeof updateHeader === 'function') updateHeader();
    if (typeof renderNotificationDropdown === 'function') renderNotificationDropdown();
    const destination = notificationDestinationV44(target);
    if (typeof openView === 'function') openView(destination);
    setTimeout(() => {
      const row = document.querySelector(`[data-id="${CSS.escape(String(id))}"]`);
      if (row) row.scrollIntoView({behavior:'smooth', block:'center'});
    }, 120);
  };
  window.selectNotification = selectNotification;

  const oldRenderDropdown = renderNotificationDropdown;
  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const rows = (state.notifications||[]).filter(n => n.unread && !n.read_at).slice(0,30);
    notificationsPreview.innerHTML = rows.length ? rows.map(n => `<button class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}"${notificationAccentStyle(n)}><div><strong>${escapeHtml(n.title||'Notificación')}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div><span class="status-pill status-pending">Sin leer</span></button>`).join('') + `<button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>` : `<p class="muted">No hay notificaciones sin leer.</p><button class="btn btn-secondary btn-sm full-width" data-view-btn="notifications">Ver historial</button>`;
    notificationsPreview.classList.toggle('open', !!state.notificationsOpen);
  };
  window.renderNotificationDropdown = renderNotificationDropdown;

  const oldShowToast = showToast;
  showToast = function(title, text='', icon='success'){
    return Swal.fire({toast:true, position:'top-end', timer:2600, timerProgressBar:true, showConfirmButton:false, icon, title, text, customClass:{popup:'app-toast-popup'}, didOpen:(toast)=>{toast.style.zIndex='2147483647';}});
  };
  window.showToast = showToast;

  const oldUpdateHeader = updateHeader;
  updateHeader = function(){
    oldUpdateHeader();
    const logo = getBrandSettings?.().logoDataUrl || localStorage.getItem('ism_brand_logo') || './assets/logo.svg';
    let img = document.querySelector('.mobile-header-logo');
    if (!img) {
      img = document.createElement('img'); img.className='mobile-header-logo'; img.alt='Logo';
      const bar = document.querySelector('.topbar,.page-header'); if (bar) bar.insertBefore(img, bar.firstChild);
    }
    img.src = logo;
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.classList.add('theme-toggle');
  };
  window.updateHeader = updateHeader;

  try { renderNav?.(); updateHeader?.(); renderView?.(); } catch(e) { console.warn('v44 refresh', e); }
})();


/* === V45: robust notification routing + mobile header avatar/toggle fix === */
(function(){
  function normalizeNotificationDestinationV45(n){
    const hay = `${n?.section||''} ${n?.module||''} ${n?.target_view||''} ${n?.title||''} ${n?.message||''}`.toLowerCase();
    if (/soporte|ticket|support/.test(hay)) return 'supportTicket';
    if (/prestamo|préstamo|loan|solicitud/.test(hay)) return 'loanManagement';
    if (/inventario|stock|insumo|asset|barcode/.test(hay)) return 'inventory';
    if (/equipo|team|mentor/.test(hay)) return 'team';
    if (/usuario|sesión|sesion|login|logout|perfil/.test(hay)) return 'users';
    if (/rol|permiso/.test(hay)) return 'roles';
    if (/curso|campus|clase/.test(hay)) return 'courses';
    if (/biblioteca|archivo|documento/.test(hay)) return 'library';
    return 'notifications';
  }
  window.notificationDestinationV45 = normalizeNotificationDestinationV45;

  const priorSelectV45 = typeof selectNotification === 'function' ? selectNotification : null;
  selectNotification = async function(id){
    const target = (state.notifications||[]).find(n => String(n.id) === String(id));
    if (!target) return priorSelectV45 ? priorSelectV45(id) : null;
    target.unread = false;
    target.read_at = target.read_at || new Date().toISOString();
    state.notificationsOpen = false;
    try { await window.sb?.markNotificationRead?.(id); } catch(e) { console.warn('markNotificationRead', e); }
    const destination = normalizeNotificationDestinationV45(target);
    if (typeof updateHeader === 'function') updateHeader();
    if (typeof renderNotificationDropdown === 'function') renderNotificationDropdown();
    if (typeof openView === 'function') openView(destination);
    setTimeout(() => {
      const row = document.querySelector(`[data-id="${(window.CSS&&CSS.escape)?CSS.escape(String(id)):String(id).replace(/"/g,'\\"')}"]`);
      if (row) row.scrollIntoView({behavior:'smooth', block:'center'});
    }, 160);
  };
  window.selectNotification = selectNotification;

  document.addEventListener('click', function(e){
    const item = e.target.closest('#notificationsPreview .notification-select, #notificationsPreview .notification-row[data-id]');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    selectNotification(item.dataset.id);
  }, true);

  const priorUpdateV45 = typeof updateHeader === 'function' ? updateHeader : null;
  updateHeader = function(){
    if (priorUpdateV45) priorUpdateV45();
    const avatar = document.getElementById('headerAvatar');
    if (avatar) avatar.src = state.user?.avatar_url || state.user?.avatar || './assets/avatar-default.svg';
    const avatarBtn = document.querySelector('.avatar-button');
    if (avatarBtn) avatarBtn.style.display = '';
    const fs = document.getElementById('fullscreenBtn');
    if (fs) fs.classList.add('fullscreen-btn');
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.classList.add('theme-toggle');
      themeBtn.style.minWidth = window.innerWidth <= 820 ? '74px' : '104px';
      themeBtn.style.width = window.innerWidth <= 820 ? '74px' : '104px';
    }
  };
  window.updateHeader = updateHeader;

  try { updateHeader(); if (typeof renderNotificationDropdown === 'function') renderNotificationDropdown(); } catch(e){ console.warn('v45 refresh', e); }
})();

/* === V51: definitive desktop notification routing + mobile notification button fit === */
(function(){
  if (window.__v51NotificationRoutingApplied) return;
  window.__v51NotificationRoutingApplied = true;

  const VIEW_ALIASES_V51 = {
    supportticket: 'supportTickets',
    supporttickets: 'supportTickets',
    soporte: 'supportTickets',
    soporteticket: 'supportTickets',
    tickets: 'supportTickets',
    ticket: 'supportTickets',
    loan: 'loanManagement',
    loans: 'loanManagement',
    prestamos: 'loanManagement',
    prestamo: 'loanManagement',
    loanmanagement: 'loanManagement',
    inventario: 'inventory',
    inventory: 'inventory',
    usuarios: 'users',
    usuario: 'users',
    users: 'users',
    login: 'users',
    sesion: 'users',
    sesión: 'users',
    notificaciones: 'notifications',
    notifications: 'notifications',
    historial: 'notifications',
    equipos: 'team',
    equipo: 'team',
    team: 'team',
    roles: 'roles',
    permisos: 'roles',
    cursos: 'courses',
    campus: 'courses',
    biblioteca: 'library',
    library: 'library'
  };

  function normalizeTextV51(value){
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function resolveViewV51(raw){
    const key = normalizeTextV51(raw).replace(/\s+/g, '');
    return VIEW_ALIASES_V51[key] || null;
  }

  function destinationForNotificationV51(n){
    const direct = resolveViewV51(n?.target_view || n?.targetView || n?.view || n?.module || n?.section);
    if (direct && direct !== 'notifications') return direct;
    const hay = normalizeTextV51(`${n?.section||''} ${n?.module||''} ${n?.target_view||''} ${n?.title||''} ${n?.message||''}`);
    if (/\b(soporte|support|ticket|incidencia|falla tecnica|no enciende)\b/.test(hay)) return 'supportTickets';
    if (/\b(prestamo|prestamos|loan|devolucion|solicitud|retirado|vencido)\b/.test(hay)) return 'loanManagement';
    if (/\b(inventario|inventory|stock|insumo|asset|barcode|codigo|condicion|ingreso)\b/.test(hay)) return 'inventory';
    if (/\b(usuario|usuarios|sesion|login|logout|perfil|administrador|docente|alumno)\b/.test(hay)) return 'users';
    if (/\b(equipo|equipos|team|mentor)\b/.test(hay)) return 'team';
    if (/\b(rol|roles|permiso|permisos)\b/.test(hay)) return 'roles';
    if (/\b(curso|cursos|campus|clase)\b/.test(hay)) return 'courses';
    if (/\b(biblioteca|library|archivo|documento)\b/.test(hay)) return 'library';
    return direct || 'notifications';
  }

  function goToViewV51(view){
    const normalized = resolveViewV51(view) || view || 'notifications';
    state.currentView = normalized;
    state.notificationsOpen = false;
    if (typeof renderView === 'function') renderView();
    if (typeof updateHeader === 'function') updateHeader();
    if (typeof renderNotificationDropdown === 'function') renderNotificationDropdown();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(_) { window.scrollTo(0, 0); }
  }

  const previousOpenViewV51 = typeof openView === 'function' ? openView : null;
  openView = function(view){
    const normalized = resolveViewV51(view) || view || 'dashboard';
    if (normalized === 'supportTicket') return goToViewV51('supportTickets');
    return previousOpenViewV51 ? previousOpenViewV51(normalized) : goToViewV51(normalized);
  };
  window.openView = openView;

  async function selectNotificationV51(id){
    const target = (state.notifications || []).find(n => String(n.id) === String(id));
    if (!target) return goToViewV51('notifications');
    target.unread = false;
    target.read_at = target.read_at || new Date().toISOString();
    try { await window.sb?.markNotificationRead?.(id); } catch(e) { console.warn('markNotificationRead', e); }
    goToViewV51(destinationForNotificationV51(target));
  }
  selectNotification = selectNotificationV51;
  window.selectNotification = selectNotificationV51;
  window.notificationDestinationV51 = destinationForNotificationV51;

  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const rows = (state.notifications || []).filter(n => n.unread && !n.read_at).slice(0, 30);
    const historyBtn = `<button type="button" class="btn btn-secondary btn-sm full-width notifications-history-btn" data-view-btn="notifications" data-target-view="notifications">Ver historial</button>`;
    notificationsPreview.innerHTML = rows.length
      ? rows.map(n => {
          const view = destinationForNotificationV51(n);
          return `<button type="button" class="notification-row notification-select unread" data-id="${escapeAttr(n.id)}" data-target-view="${escapeAttr(view)}"${notificationAccentStyle(n)}><div><strong>${escapeHtml(n.title || 'Notificación')}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div><span class="status-pill status-pending">Sin leer</span></button>`;
        }).join('') + historyBtn
      : `<p class="muted">No hay notificaciones sin leer.</p>${historyBtn}`;
    notificationsPreview.classList.toggle('open', !!state.notificationsOpen);
  };
  window.renderNotificationDropdown = renderNotificationDropdown;

  function notificationCaptureHandlerV51(e){
    const preview = e.target.closest && e.target.closest('#notificationsPreview');
    if (!preview) return;
    const row = e.target.closest('.notification-select[data-id], .notification-row[data-id]');
    const history = e.target.closest('[data-view-btn="notifications"], .notifications-history-btn');
    if (!row && !history) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    if (row) selectNotificationV51(row.dataset.id);
    else goToViewV51('notifications');
  }
  document.addEventListener('click', notificationCaptureHandlerV51, { capture: true, passive: false });

  try { renderNotificationDropdown(); updateHeader?.(); } catch(e) { console.warn('v51 refresh', e); }
})();

/* === V52: hard notification routing on pointerdown/mousedown + history button full width === */
(function(){
  if (window.__v52NotificationHardRoutingApplied) return;
  window.__v52NotificationHardRoutingApplied = true;

  const ALIASES = {
    supportticket:'supportTickets', supporttickets:'supportTickets', soporte:'supportTickets', soporteticket:'supportTickets', ticket:'supportTickets', tickets:'supportTickets', support:'supportTickets',
    prestamo:'loanManagement', prestamos:'loanManagement', préstamo:'loanManagement', préstamos:'loanManagement', loan:'loanManagement', loans:'loanManagement', loanmanagement:'loanManagement',
    inventario:'inventory', inventory:'inventory', stock:'inventory', insumo:'inventory', asset:'inventory', barcode:'inventory',
    notificaciones:'notifications', notifications:'notifications', historial:'notifications',
    usuario:'users', usuarios:'users', user:'users', users:'users', login:'users', sesion:'users', sesión:'users', acceso:'users',
    equipo:'team', equipos:'team', team:'team', teams:'team',
    rol:'roles', roles:'roles', permiso:'roles', permisos:'roles',
    curso:'courses', cursos:'courses', campus:'courses', clase:'courses',
    biblioteca:'library', library:'library', archivo:'library', documentos:'library'
  };

  function txt(v){
    return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  }
  function compact(v){ return txt(v).replace(/[^a-z0-9]+/g,''); }
  function alias(v){ return ALIASES[compact(v)] || null; }

  function notificationTarget(n){
    const direct = alias(n?.target_view || n?.targetView || n?.view || n?.module || n?.section);
    if (direct && direct !== 'notifications') return direct;
    const hay = txt(`${n?.section||''} ${n?.module||''} ${n?.target_view||''} ${n?.title||''} ${n?.message||''}`);
    if (/(soporte|support|ticket|incidencia|falla tecnica|falla técnica|no enciende)/.test(hay)) return 'supportTickets';
    if (/(prestamo|pr[eé]stamo|loan|devolucion|devolución|solicitud|retirado|vencido)/.test(hay)) return 'loanManagement';
    if (/(inventario|inventory|stock|insumo|asset|barcode|codigo|código|condicion|condición|ingreso de inventario|estado en inventario)/.test(hay)) return 'inventory';
    if (/(usuario|usuarios|sesion|sesión|login|inicio de sesion|inicio de sesión|administrador|docente|alumno)/.test(hay)) return 'users';
    if (/(equipo|equipos|team|mentor)/.test(hay)) return 'team';
    if (/(rol|roles|permiso|permisos)/.test(hay)) return 'roles';
    if (/(curso|cursos|campus|clase)/.test(hay)) return 'courses';
    if (/(biblioteca|library|archivo|documento)/.test(hay)) return 'library';
    return direct || 'notifications';
  }

  function forceView(view){
    const target = alias(view) || view || 'notifications';
    state.currentView = target;
    state.notificationsOpen = false;
    try { if (typeof renderView === 'function') renderView(); } catch(e){ console.warn('renderView v52', e); }
    try { if (typeof updateHeader === 'function') updateHeader(); } catch(e){ console.warn('updateHeader v52', e); }
    try { if (typeof renderNotificationDropdown === 'function') renderNotificationDropdown(); } catch(e){}
    try { window.scrollTo({top:0, behavior:'smooth'}); } catch(_) { window.scrollTo(0,0); }
  }

  const oldOpenView = typeof openView === 'function' ? openView : null;
  openView = function(view){
    const target = alias(view) || view || 'dashboard';
    if (target === 'supportTicket') return forceView('supportTickets');
    if (oldOpenView) {
      try { return oldOpenView(target); } catch(e) { console.warn('openView fallback v52', e); }
    }
    return forceView(target);
  };
  window.openView = openView;

  function routeNotificationId(id){
    const n = (state.notifications || []).find(x => String(x.id) === String(id));
    if (!n) return forceView('notifications');
    n.unread = false;
    n.read_at = n.read_at || new Date().toISOString();
    const view = notificationTarget(n);
    forceView(view);
    try { window.sb?.markNotificationRead?.(id)?.catch?.(()=>{}); } catch(_) {}
  }

  window.__routeNotificationV52 = function(id, ev){
    if (ev) { try { ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation?.(); } catch(_){} }
    routeNotificationId(id);
    return false;
  };
  window.__routeNotificationHistoryV52 = function(ev){
    if (ev) { try { ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation?.(); } catch(_){} }
    forceView('notifications');
    return false;
  };
  window.selectNotification = function(id){ routeNotificationId(id); };
  selectNotification = window.selectNotification;
  window.notificationDestinationV52 = notificationTarget;

  renderNotificationDropdown = function(){
    if (!notificationsPreview) return;
    const rows = (state.notifications || []).filter(n => n.unread && !n.read_at).slice(0, 30);
    const historyBtn = `<button type="button" class="btn btn-secondary btn-sm full-width notifications-history-btn" data-notification-history="1" data-view-btn="notifications" onpointerdown="return window.__routeNotificationHistoryV52(event)" onmousedown="return window.__routeNotificationHistoryV52(event)" onclick="return window.__routeNotificationHistoryV52(event)">Ver historial</button>`;
    notificationsPreview.innerHTML = rows.length
      ? rows.map(n => {
          const id = escapeAttr(n.id);
          const view = escapeAttr(notificationTarget(n));
          return `<button type="button" class="notification-row notification-select unread" data-id="${id}" data-target-view="${view}" onpointerdown="return window.__routeNotificationV52('${id}', event)" onmousedown="return window.__routeNotificationV52('${id}', event)" onclick="return window.__routeNotificationV52('${id}', event)"${notificationAccentStyle(n)}><div><strong>${escapeHtml(n.title || 'Notificación')}</strong><span>${notificationMessage(n)}</span><small>${notificationMeta(n)}</small></div><span class="status-pill status-pending">Sin leer</span></button>`;
        }).join('') + historyBtn
      : `<p class="muted">No hay notificaciones sin leer.</p>${historyBtn}`;
    notificationsPreview.classList.toggle('open', !!state.notificationsOpen);
  };
  window.renderNotificationDropdown = renderNotificationDropdown;

  function hardCapture(ev){
    const t = ev.target;
    if (!t || !t.closest) return;
    const box = t.closest('#notificationsPreview');
    if (!box) return;
    const hist = t.closest('[data-notification-history="1"], .notifications-history-btn, #notificationsPreview [data-view-btn="notifications"]');
    const row = t.closest('#notificationsPreview .notification-row[data-id], #notificationsPreview .notification-select[data-id]');
    if (!hist && !row) return;
    try { ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation?.(); } catch(_) {}
    if (row) routeNotificationId(row.dataset.id); else forceView('notifications');
  }
  ['pointerdown','mousedown','click'].forEach(type => document.addEventListener(type, hardCapture, {capture:true, passive:false}));

  try { renderNotificationDropdown(); updateHeader?.(); } catch(e) { console.warn('v52 refresh', e); }
})();


/* === V53: Mobile fixed header helper + SweetAlert2 PWA install prompt === */
(function(){
  if (window.__v53HeaderPwaApplied) return;
  window.__v53HeaderPwaApplied = true;

  function setMobileHeaderHeight(){
    try {
      const header = document.querySelector('.topbar, .page-header');
      if (!header) return;
      const isMobile = window.matchMedia('(max-width: 820px)').matches;
      if (!isMobile) {
        document.documentElement.style.removeProperty('--mobile-header-h');
        return;
      }
      const h = Math.max(70, Math.ceil(header.getBoundingClientRect().height || 76));
      document.documentElement.style.setProperty('--mobile-header-h', h + 'px');
    } catch(_) {}
  }
  window.addEventListener('resize', setMobileHeaderHeight, { passive:true });
  window.addEventListener('orientationchange', () => setTimeout(setMobileHeaderHeight, 250), { passive:true });
  document.addEventListener('visibilitychange', setMobileHeaderHeight, { passive:true });
  setTimeout(setMobileHeaderHeight, 80);
  setTimeout(setMobileHeaderHeight, 600);

  const previousUpdateHeaderV53 = typeof updateHeader === 'function' ? updateHeader : null;
  if (previousUpdateHeaderV53) {
    updateHeader = function(){
      const r = previousUpdateHeaderV53.apply(this, arguments);
      setTimeout(setMobileHeaderHeight, 0);
      return r;
    };
    window.updateHeader = updateHeader;
  }

  // PWA: registrar Service Worker y mostrar oferta de instalación con SweetAlert2.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => console.warn('No se pudo registrar el Service Worker', err));
    }, { once:true });
  }

  let deferredInstallPrompt = null;
  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function recentlyDismissed(){
    const last = Number(localStorage.getItem('ism_pwa_install_prompt_dismissed_at') || 0);
    return last && (Date.now() - last) < 12 * 60 * 60 * 1000;
  }
  async function showInstallPrompt(){
    if (isStandalone() || !window.Swal || !deferredInstallPrompt || recentlyDismissed()) return;
    const result = await Swal.fire({
      icon: 'info',
      title: 'Instalar ISM Robosoft',
      html: 'Podés instalar la app en este dispositivo para abrirla más rápido y usarla como PWA.',
      showCancelButton: true,
      confirmButtonText: 'Instalar',
      cancelButtonText: 'Ahora no',
      reverseButtons: true,
      customClass: { popup: 'pwa-install-popup' }
    });
    if (result.isConfirmed && deferredInstallPrompt) {
      const promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = null;
      try { promptEvent.prompt(); await promptEvent.userChoice; } catch(e) { console.warn('PWA install prompt', e); }
    } else {
      localStorage.setItem('ism_pwa_install_prompt_dismissed_at', String(Date.now()));
    }
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setTimeout(showInstallPrompt, 1200);
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    localStorage.setItem('ism_pwa_installed_at', String(Date.now()));
    if (window.Swal) Swal.fire({ icon:'success', title:'App instalada', text:'ISM Robosoft quedó instalada en este dispositivo.', timer:1800, showConfirmButton:false });
  });
})();

/* === V54: SweetAlert2 toast visibility + PWA install offer always available === */
(function(){
  if (window.__v54AlertsPwaApplied) return;
  window.__v54AlertsPwaApplied = true;

  function cssVar(name, fallback){
    try { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback; } catch(_) { return fallback; }
  }

  function forceSwalToastLayer(){
    document.querySelectorAll('.swal2-container').forEach(c => {
      c.style.zIndex = '2147483647';
      c.style.pointerEvents = 'none';
      c.style.position = 'fixed';
    });
    document.querySelectorAll('.swal2-popup.app-toast-popup, .swal2-toast.app-toast-popup').forEach(p => {
      p.style.pointerEvents = 'auto';
      p.style.zIndex = '2147483647';
      p.style.visibility = 'visible';
      p.style.opacity = '1';
      p.style.display = 'flex';
    });
  }

  window.showToast = function(title, text = '', icon = 'success'){
    if (!window.Swal) { try { alert([title, text].filter(Boolean).join('\n')); } catch(_){} return; }
    return Swal.fire({
      toast: true,
      target: document.body,
      position: 'top-end',
      timer: 3200,
      timerProgressBar: true,
      showConfirmButton: false,
      icon,
      title: String(title || ''),
      text: String(text || ''),
      background: cssVar('--panel', '#0f1930'),
      color: cssVar('--text', '#edf2ff'),
      customClass: { container: 'app-toast-container-v54', popup: 'app-toast-popup app-toast-popup-v54' },
      didOpen: (toast) => {
        forceSwalToastLayer();
        try { toast.addEventListener('mouseenter', Swal.stopTimer); toast.addEventListener('mouseleave', Swal.resumeTimer); } catch(_){}
      },
      willOpen: forceSwalToastLayer
    });
  };
  try { showToast = window.showToast; } catch(_) {}

  const observer = new MutationObserver(forceSwalToastLayer);
  try { observer.observe(document.documentElement, { childList:true, subtree:true }); } catch(_) {}

  let deferredInstallPromptV54 = null;
  let pwaOfferShown = false;
  const DISMISS_KEY = 'ism_pwa_install_prompt_dismissed_at_v54';

  function isStandaloneV54(){
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function isRecentlyDismissedV54(){
    const last = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return !!last && (Date.now() - last) < 6 * 60 * 60 * 1000;
  }
  function isIOSV54(){ return /iphone|ipad|ipod/i.test(navigator.userAgent || ''); }
  function isAndroidV54(){ return /android/i.test(navigator.userAgent || ''); }

  async function showPwaOfferV54(force = false){
    if (pwaOfferShown || isStandaloneV54() || !window.Swal) return;
    if (!force && isRecentlyDismissedV54()) return;
    pwaOfferShown = true;

    const canNativeInstall = !!deferredInstallPromptV54;
    let html = 'Instalá ISM Robosoft para acceder más rápido desde el escritorio o la pantalla de inicio.';
    let confirmButtonText = canNativeInstall ? 'Instalar ahora' : 'Entendido';
    let showCancelButton = true;
    let cancelButtonText = 'Ahora no';

    if (!canNativeInstall) {
      if (isIOSV54()) html = 'Para instalar ISM Robosoft en iPhone/iPad: tocá Compartir y elegí “Agregar a pantalla de inicio”.';
      else if (isAndroidV54()) html = 'Para instalar ISM Robosoft: abrí el menú del navegador y elegí “Instalar app” o “Agregar a pantalla principal”.';
      else html = 'Para instalar ISM Robosoft: usá el botón de instalación del navegador cuando esté disponible, o el menú del navegador → Instalar app.';
      confirmButtonText = 'OK';
      showCancelButton = false;
    }

    const result = await Swal.fire({
      icon: 'info',
      title: 'Instalar aplicación',
      html,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      allowOutsideClick: true,
      customClass: { popup: 'pwa-install-popup pwa-install-popup-v54' }
    });

    if (canNativeInstall && result.isConfirmed && deferredInstallPromptV54) {
      const ev = deferredInstallPromptV54;
      deferredInstallPromptV54 = null;
      try { ev.prompt(); await ev.userChoice; } catch(e) { console.warn('PWA install prompt V54', e); }
    } else if (!result.isConfirmed) {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    try { event.preventDefault(); } catch(_) {}
    deferredInstallPromptV54 = event;
    setTimeout(() => showPwaOfferV54(true), 900);
  });

  window.appShowInstallPrompt = () => showPwaOfferV54(true);
  window.addEventListener('appinstalled', () => {
    deferredInstallPromptV54 = null;
    localStorage.setItem('ism_pwa_installed_at', String(Date.now()));
    if (window.Swal) Swal.fire({ icon:'success', title:'App instalada', text:'ISM Robosoft quedó instalada en este dispositivo.', timer:1800, showConfirmButton:false });
  });

  window.addEventListener('load', () => {
    setTimeout(() => showPwaOfferV54(false), 1600);
  }, { once:true });
})();


/* === Ticket Manager v4: integración de tickets públicos /soporteticket y branding final === */
(function(){
  function mergePublicTickets(){
    try{
      const local = JSON.parse(localStorage.getItem('public_support_tickets') || '[]');
      if (!Array.isArray(local) || !local.length || !state) return;
      const seen = new Set((state.supportTickets || []).map(t => String(t.ticket_number || t.id)));
      local.forEach(t => { const k=String(t.ticket_number || t.id); if(!seen.has(k)){ state.supportTickets = state.supportTickets || []; state.supportTickets.unshift(t); seen.add(k); } });
    }catch(e){ console.warn('tickets públicos locales', e); }
  }
  const oldRenderViewTM = renderView;
  renderView = function(){ mergePublicTickets(); oldRenderViewTM(); };
  const oldRefreshTM = refreshSupabaseData;
  refreshSupabaseData = async function(){ await oldRefreshTM(); mergePublicTickets(); };
  window.addEventListener('load',()=>{ try{ mergePublicTickets(); if(state?.currentView==='supportTickets') renderView(); }catch(_){} });
})();

/* ==========================================================
   Ticket Manager v5 - Perfiles finales + Órdenes de Servicio
   ========================================================== */
(function(){
  const ROLE_ALIASES = {
    administrator:'SuperAdmin', admin:'Administrador', superadmin:'SuperAdmin', teacher:'Tecnico', tecnico:'Tecnico', technician:'Tecnico', student:'Usuario', user:'Usuario', alumno:'Usuario', docente:'Tecnico'
  };
  window.tmRole = function(role){ return ROLE_ALIASES[String(role||'').toLowerCase()] || role || 'Usuario'; };
  const originalUser = state.user || {};
  if (originalUser.email === 'fernando.m.gambino@gmail.com') { originalUser.role = 'SuperAdmin'; originalUser.role_code = 'superadmin'; originalUser.name = originalUser.name || 'Ing. Fernando Gambino'; }
  else originalUser.role = window.tmRole(originalUser.role);
  state.user = originalUser;

  Object.assign(icons, {
    serviceOrders:`<svg viewBox="0 0 24 24" class="icon"><path d="M7 2h10a2 2 0 0 1 2 2v17l-3-2-3 2-3-2-3 2-3-2V4a2 2 0 0 1 2-2Zm2 5h6v2H9V7Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2Z"/></svg>`,
    print:`<svg viewBox="0 0 24 24" class="icon"><path d="M6 9V3h12v6h1a3 3 0 0 1 3 3v6h-4v3H6v-3H2v-6a3 3 0 0 1 3-3h1Zm2-4v4h8V5H8Zm0 12v2h8v-2H8Zm11-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>`,
    history:`<svg viewBox="0 0 24 24" class="icon"><path d="M13 3a9 9 0 1 1-8.96 10H2l3-4 3 4H6.06A7 7 0 1 0 13 5v5l4 2-1 1.73-5-2.88V3h2Z"/></svg>`,
    finish:`<svg viewBox="0 0 24 24" class="icon"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`
  });

  // Menú solicitado. Se eliminan módulos ajenos al alcance pedido y se suma Ordenes de Servicio.
  nav.splice(0, nav.length,
    { key:'dashboard', icon:'dashboard', label:{ SuperAdmin:'Dashboard', Administrador:'Dashboard', Tecnico:'Dashboard', Usuario:'Dashboard', administrator:'Dashboard' } },
    { key:'users', icon:'users', label:{ SuperAdmin:'Usuarios', Administrador:'Usuarios' } },
    { key:'roles', icon:'roles', label:{ SuperAdmin:'Roles y Permisos', Administrador:'Roles y Permisos' } },
    { key:'serviceOrders', icon:'serviceOrders', label:{ SuperAdmin:'Órdenes de Servicio', Administrador:'Órdenes de Servicio', Tecnico:'Órdenes de Servicio' } },
    { key:'inventory', icon:'inventory', label:{ SuperAdmin:'Inventario', Administrador:'Inventario', Tecnico:'Inventario' } },
    { key:'loanManagement', icon:'loan', label:{ SuperAdmin:'Gestión de Préstamos', Administrador:'Gestión de Préstamos', Tecnico:'Gestión de Préstamos', Usuario:'Mis Préstamos' } },
    { key:'supportTickets', icon:'notifications', label:{ SuperAdmin:'Soporte Ticket', Administrador:'Soporte Ticket', Tecnico:'Soporte Ticket', Usuario:'Mis Tickets' } },
    { key:'notifications', icon:'notifications', label:{ SuperAdmin:'Notificaciones', Administrador:'Notificaciones', Tecnico:'Notificaciones', Usuario:'Notificaciones' } },
    { key:'profile', icon:'profile', label:{ SuperAdmin:'Mi Perfil', Administrador:'Mi Perfil', Tecnico:'Mi Perfil', Usuario:'Mi Perfil' } },
    { key:'settings', icon:'settings', label:{ SuperAdmin:'Configuraciones', Administrador:'Configuraciones' } }
  );
  roleViews.SuperAdmin = ['dashboard','users','roles','serviceOrders','inventory','loanManagement','supportTickets','notifications','profile','settings'];
  roleViews.Administrador = ['dashboard','users','roles','serviceOrders','inventory','loanManagement','supportTickets','notifications','profile','settings'];
  roleViews.Tecnico = ['dashboard','serviceOrders','inventory','loanManagement','supportTickets','notifications','profile'];
  roleViews.Usuario = ['dashboard','loanManagement','supportTickets','notifications','profile'];
  roleViews.administrator = roleViews.SuperAdmin;
  roleViews.teacher = roleViews.Tecnico;
  roleViews.student = roleViews.Usuario;
  baseLabels.SuperAdmin = baseLabels.Administrador = {
    dashboard:['Panel Ejecutivo','Indicadores operativos, trazabilidad técnica y control de gestión institucional'],
    users:['Usuarios','Administración de perfiles autorizados, estados y datos de contacto'],
    roles:['Roles y Permisos','Matriz de acceso por perfil: SuperAdmin, Administrador, Técnicos y Usuarios'],
    serviceOrders:['Órdenes de Servicio','Gestión técnica inspirada en SATMANAGER: taller, terminadas, entregadas, historia e impresión A4'],
    inventory:['Inventario','Trazabilidad por código, serie, ubicación, estado, préstamo y devolución'],
    loanManagement:['Gestión de Préstamos','Solicitudes, aprobaciones, rechazos, devoluciones y seguimiento horario'],
    supportTickets:['Soporte Ticket','Incidencias recibidas desde el formulario público y desde usuarios internos'],
    notifications:['Notificaciones','Centro de avisos, alertas operativas y comunicaciones internas'],
    profile:['Mi Perfil','Datos personales, credenciales operativas y foto de perfil'],
    settings:['Configuraciones','Branding institucional, parámetros globales y canales de notificación']
  };
  baseLabels.Tecnico = {...baseLabels.SuperAdmin}; baseLabels.Tecnico.users=['Usuarios','Consulta de usuarios habilitados']; baseLabels.Tecnico.settings=['Configuraciones','Parámetros disponibles para técnicos'];
  baseLabels.Usuario = {...baseLabels.SuperAdmin}; baseLabels.Usuario.dashboard=['Portal de Usuario','Seguimiento de tickets, préstamos y notificaciones'];

  state.serviceOrders = JSON.parse(localStorage.getItem('tm_service_orders') || 'null') || [
    {id:22, order:22, date:'2025-10-02', client:'Presupuesto', address:'Av. Sarmiento 850', phone:'', technician:'Mateo Fornaciari', serial:'88', type:'PC', brand:'MAGNUM', model:'MAGNUM', accessories:'', failure:'Unidad estado sólido con falla crítica; se solicitará reemplazo', report:'', labor:0, parts:0, advance:0, balance:0, status:'En taller', source_ticket:'TK-2026-00001'},
    {id:31, order:31, date:'2025-10-27', client:'Novedades Salariales', address:'', phone:'', technician:'', serial:'', type:'Notebook', brand:'Clon', model:'S/M', accessories:'Cargador', failure:'No funciona. Revisar Pregase', report:'', labor:0, parts:0, advance:0, balance:0, status:'En taller', source_ticket:''},
    {id:90, order:90, date:'2026-03-05', client:'Infraestructura Escolar', address:'', phone:'', technician:'', serial:'', type:'PC', brand:'Magnum Tech', model:'MTK835', accessories:'', failure:'Inicio de Windows dañado.', report:'', labor:0, parts:0, advance:0, balance:0, status:'Terminada', source_ticket:''}
  ];
  state.serviceOrderFilter = state.serviceOrderFilter || 'En taller';
  state.serviceOrderSearch = state.serviceOrderSearch || '';
  state.selectedServiceOrderId = state.selectedServiceOrderId || null;

  function roleKey(){ return window.tmRole(state.user?.role); }
  window.canManageTM = function(){ return ['SuperAdmin','Administrador'].includes(roleKey()); };
  const oldCanManageTickets = window.canManageTickets || canManageTickets;
  window.canManageTickets = function(){ return ['SuperAdmin','Administrador','Tecnico'].includes(roleKey()); };
  try { canManageTickets = window.canManageTickets; } catch(_) {}
  const oldGetVisibleViews = getVisibleViews;
  getVisibleViews = function(){ return roleViews[roleKey()] || roleViews.Usuario; };
  const oldGetRoleLabels = getRoleLabels;
  getRoleLabels = function(){ return baseLabels[roleKey()] || baseLabels.Usuario; };
  const oldRoleLabel = roleLabelFromAny;
  roleLabelFromAny = function(role){ return window.tmRole(role); };

  function persistOrders(){ localStorage.setItem('tm_service_orders', JSON.stringify(state.serviceOrders)); }
  function filteredOrders(){ const q=String(state.serviceOrderSearch||'').toLowerCase(); return state.serviceOrders.filter(o=>(state.serviceOrderFilter==='Todas'||o.status===state.serviceOrderFilter) && [o.order,o.date,o.client,o.brand,o.model,o.failure,o.technician,o.serial,o.source_ticket].some(v=>String(v||'').toLowerCase().includes(q))); }
  function orderStatusPill(s){ const map={'En taller':'#22d3ee','Terminada':'#f59e0b','Entregada':'#22c55e'}; const c=map[s]||'#94a3b8'; return `<span class="status-pill" style="background:${c}22;color:${c};border-color:${c}55">${escapeHtml(s)}</span>`; }
  window.renderServiceOrders = function(){
    const rows=filteredOrders();
    return `<section class="sat-panel"><article class="card glass"><div class="section-header"><div><h3>Listado de reparaciones y órdenes técnicas</h3><p class="muted">Flujo operativo tipo SATMANAGER: agregar, modificar, eliminar, terminar, entregar, imprimir e historia técnica.</p></div><div class="toolbar"><button class="btn btn-primary btn-sm" id="newServiceOrderBtn">${icons.serviceOrders} Nueva orden</button><button class="btn btn-secondary btn-sm" data-export="serviceOrders">${icons.export} Exportar CSV</button><button class="btn btn-secondary btn-sm" id="importServiceOrdersBtn">${icons.import} Importar CSV</button></div></div><div class="sat-toolbar"><input id="serviceOrderSearch" type="search" placeholder="Buscar por orden, cliente, técnico, serie, marca, modelo o falla" value="${escapeAttr(state.serviceOrderSearch)}"><div class="sat-status">${['En taller','Terminada','Entregada','Todas'].map(s=>`<label class="sat-radio"><input type="radio" name="soStatus" value="${s}" ${state.serviceOrderFilter===s?'checked':''}> ${s}</label>`).join('')}</div></div><div class="table-wrap"><table class="table"><thead><tr><th>Orden</th><th>Fecha</th><th>Cliente/Repartición</th><th>Técnico</th><th>Marca</th><th>Modelo</th><th>Falla</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows.map(o=>`<tr class="${state.selectedServiceOrderId===o.id?'sat-order-selected':''}"><td><strong>${escapeHtml(o.order)}</strong></td><td>${escapeHtml(formatDateOnlyAR(o.date))}</td><td>${escapeHtml(o.client)}</td><td>${escapeHtml(o.technician||'-')}</td><td>${escapeHtml(o.brand||'-')}</td><td>${escapeHtml(o.model||'-')}</td><td>${escapeHtml(o.failure||'-')}</td><td>${orderStatusPill(o.status)}</td><td><div class="action-group"><button class="action-btn" title="Ver" data-so-view="${o.id}">${icons.eye}<span>Ver</span></button><button class="action-btn" title="Modificar" data-so-edit="${o.id}">${icons.edit}<span>Editar</span></button><button class="action-btn" title="Terminar" data-so-finish="${o.id}">${icons.finish}<span>Terminar</span></button><button class="action-btn" title="Imprimir" data-so-print="${o.id}">${icons.print}<span>Imprimir</span></button><button class="action-btn" title="Historia" data-so-history="${o.id}">${icons.history}<span>Historia</span></button><button class="action-btn danger" title="Eliminar" data-so-delete="${o.id}">${icons.trash}<span>Eliminar</span></button></div></td></tr>`).join('')||'<tr><td colspan="9" class="muted">Sin órdenes registradas.</td></tr>'}</tbody></table></div></article><aside class="card glass"><h3>Resumen técnico</h3><div class="list-simple"><div class="list-item"><strong>En taller</strong><span>${state.serviceOrders.filter(o=>o.status==='En taller').length}</span></div><div class="list-item"><strong>Terminadas</strong><span>${state.serviceOrders.filter(o=>o.status==='Terminada').length}</span></div><div class="list-item"><strong>Entregadas</strong><span>${state.serviceOrders.filter(o=>o.status==='Entregada').length}</span></div><div class="list-item"><strong>Origen</strong><span>Tickets públicos e internos</span></div></div><button class="btn btn-secondary full-width" id="generateOrderFromTicketBtn">Crear orden desde ticket pendiente</button></aside></section>`;
  };
  async function openServiceOrderForm(order=null){
    const next=Math.max(0,...state.serviceOrders.map(o=>Number(o.order)||0))+1;
    const html=`<div class="swal-form-grid"><label><span>Orden</span><input id="so_order" class="swal2-input" value="${escapeAttr(order?.order||next)}"></label><label><span>Fecha</span><input id="so_date" type="date" class="swal2-input" value="${escapeAttr((order?.date||new Date().toISOString()).slice(0,10))}"></label><label><span>Técnico</span><input id="so_technician" class="swal2-input" value="${escapeAttr(order?.technician||'')}"></label><label><span>Cliente / repartición</span><input id="so_client" class="swal2-input" value="${escapeAttr(order?.client||'')}"></label><label><span>Dirección</span><input id="so_address" class="swal2-input" value="${escapeAttr(order?.address||'')}"></label><label><span>Teléfono</span><input id="so_phone" class="swal2-input" value="${escapeAttr(order?.phone||'')}"></label><label><span>Número de serie</span><input id="so_serial" class="swal2-input" value="${escapeAttr(order?.serial||'')}"></label><label><span>Tipo de equipo</span><input id="so_type" class="swal2-input" value="${escapeAttr(order?.type||'PC')}"></label><label><span>Marca</span><input id="so_brand" class="swal2-input" value="${escapeAttr(order?.brand||'')}"></label><label><span>Modelo</span><input id="so_model" class="swal2-input" value="${escapeAttr(order?.model||'')}"></label><label class="full-span"><span>Accesorios</span><textarea id="so_accessories" class="swal2-textarea">${escapeHtml(order?.accessories||'')}</textarea></label><label class="full-span"><span>Falla declarada</span><textarea id="so_failure" class="swal2-textarea">${escapeHtml(order?.failure||'')}</textarea></label><label class="full-span"><span>Informe técnico</span><textarea id="so_report" class="swal2-textarea">${escapeHtml(order?.report||'')}</textarea></label><label><span>Mano de obra</span><input id="so_labor" type="number" class="swal2-input" value="${escapeAttr(order?.labor||0)}"></label><label><span>Repuestos</span><input id="so_parts" type="number" class="swal2-input" value="${escapeAttr(order?.parts||0)}"></label><label><span>Entrega</span><input id="so_advance" type="number" class="swal2-input" value="${escapeAttr(order?.advance||0)}"></label><label><span>Estado</span><select id="so_status" class="swal2-select"><option ${order?.status==='En taller'?'selected':''}>En taller</option><option ${order?.status==='Terminada'?'selected':''}>Terminada</option><option ${order?.status==='Entregada'?'selected':''}>Entregada</option></select></label></div>`;
    const res=await Swal.fire({title:order?'Modificar orden técnica':'Nueva orden técnica',width:920,html,showCancelButton:true,confirmButtonText:'Aceptar',cancelButtonText:'Cancelar',preConfirm:()=>({id:order?.id||Date.now(),order:document.getElementById('so_order').value,date:document.getElementById('so_date').value,technician:document.getElementById('so_technician').value,client:document.getElementById('so_client').value,address:document.getElementById('so_address').value,phone:document.getElementById('so_phone').value,serial:document.getElementById('so_serial').value,type:document.getElementById('so_type').value,brand:document.getElementById('so_brand').value,model:document.getElementById('so_model').value,accessories:document.getElementById('so_accessories').value,failure:document.getElementById('so_failure').value,report:document.getElementById('so_report').value,labor:Number(document.getElementById('so_labor').value||0),parts:Number(document.getElementById('so_parts').value||0),advance:Number(document.getElementById('so_advance').value||0),balance:Number(document.getElementById('so_labor').value||0)+Number(document.getElementById('so_parts').value||0)-Number(document.getElementById('so_advance').value||0),status:document.getElementById('so_status').value,source_ticket:order?.source_ticket||''})});
    if(!res.isConfirmed)return; if(order){Object.assign(order,res.value)}else state.serviceOrders.unshift(res.value); persistOrders(); addNotification?.('Orden de Servicio','Se actualizó la orden técnica N° '+res.value.order); renderView(); showToast('Orden guardada','La trazabilidad técnica fue actualizada.');
  }
  function printOrder(o){ const copy=(n)=>`<h2>Área Técnica - Dirección de Informática</h2><p style="text-align:center"><strong>Tel: 4303298</strong></p><fieldset><legend>Orden</legend><strong>Orden:</strong> ${escapeHtml(o.order)} &nbsp;&nbsp; <strong>Fecha:</strong> ${escapeHtml(formatDateOnlyAR(o.date))}</fieldset><fieldset><legend>Cliente</legend><strong>Nombre:</strong> ${escapeHtml(o.client)}<br><strong>Dirección:</strong> ${escapeHtml(o.address||'-')}<br><strong>Teléfono:</strong> ${escapeHtml(o.phone||'-')}</fieldset><fieldset><legend>Equipo</legend><strong>Nro. de serie:</strong> ${escapeHtml(o.serial||'-')}<br><strong>Tipo de Equipo:</strong> ${escapeHtml(o.type||'-')}<br><strong>Marca:</strong> ${escapeHtml(o.brand||'-')}<br><strong>Modelo:</strong> ${escapeHtml(o.model||'-')}<br><strong>Falla:</strong> ${escapeHtml(o.failure||'-')}<br><br><strong>Accesorios:</strong> ${escapeHtml(o.accessories||'-')}<br><br><strong>Entrega:</strong> ${escapeHtml(o.advance||0)}</fieldset>`; const w=window.open('','_blank'); w.document.write(`<html><head><title>Orden ${escapeHtml(o.order)}</title><style>body{font-family:Arial,sans-serif;margin:20px}.order-print{max-width:780px;margin:auto}.two-copy{border-top:2px solid #111;margin-top:24px;padding-top:24px}fieldset{border:1px solid #111;margin:12px 0;padding:12px}legend{font-weight:bold}h2{text-align:center}</style></head><body><div class="order-print">${copy(1)}<div class="two-copy">${copy(2)}</div></div><script>print()<\/script></body></html>`); w.document.close(); }
  async function createOrderFromTicket(){ const pending=(state.supportTickets||[]).find(t=>!['Resuelto','Cerrado','Entregado'].includes(t.status)); if(!pending) return Swal.fire({icon:'info',title:'Sin tickets pendientes',text:'No hay tickets disponibles para generar una orden técnica.'}); await openServiceOrderForm({id:Date.now(),order:Math.max(0,...state.serviceOrders.map(o=>Number(o.order)||0))+1,date:new Date().toISOString().slice(0,10),client:pending.room||pending.requester_name,address:'',phone:pending.requester_phone||'',technician:'',serial:'',type:pending.asset_label||'',brand:'',model:'',accessories:'',failure:pending.description||pending.incident_type||'',report:'',labor:0,parts:0,advance:0,balance:0,status:'En taller',source_ticket:pending.ticket_number}); }

  const oldRenderView = renderView;
  renderView = function(){
    updateHeader(); renderNav();
    const views = { dashboard: renderDashboard, users: renderUsers, roles: renderRoles, serviceOrders: renderServiceOrders, inventory: renderInventory, loanManagement: renderLoanManagement, supportTickets: renderSupportTickets, notifications: renderNotifications, profile: renderProfile, settings: renderSettings };
    appContent.innerHTML = (views[state.currentView] || renderDashboard)();
    attachViewEvents(); renderNotificationDropdown(); renderCharts();
  };
  const oldAttach = attachViewEvents;
  attachViewEvents = function(){
    oldAttach();
    document.getElementById('serviceOrderSearch')?.addEventListener('input',e=>{state.serviceOrderSearch=e.target.value;renderView();});
    document.querySelectorAll('input[name="soStatus"]').forEach(r=>r.addEventListener('change',e=>{state.serviceOrderFilter=e.target.value;renderView();}));
    document.getElementById('newServiceOrderBtn')?.addEventListener('click',()=>openServiceOrderForm());
    document.getElementById('generateOrderFromTicketBtn')?.addEventListener('click',createOrderFromTicket);
    document.querySelectorAll('[data-so-view]').forEach(b=>b.addEventListener('click',()=>{const o=state.serviceOrders.find(x=>String(x.id)===String(b.dataset.soView)); if(o) Swal.fire({title:'Detalle de Orden N° '+o.order,width:760,html:`<div class="order-print">${escapeHtml(o.client)}<br><strong>Equipo:</strong> ${escapeHtml(o.type)} ${escapeHtml(o.brand)} ${escapeHtml(o.model)}<br><strong>Falla:</strong> ${escapeHtml(o.failure)}<br><strong>Informe:</strong> ${escapeHtml(o.report||'-')}</div>`});}));
    document.querySelectorAll('[data-so-edit]').forEach(b=>b.addEventListener('click',()=>{const o=state.serviceOrders.find(x=>String(x.id)===String(b.dataset.soEdit)); if(o) openServiceOrderForm(o);}));
    document.querySelectorAll('[data-so-finish]').forEach(b=>b.addEventListener('click',()=>{const o=state.serviceOrders.find(x=>String(x.id)===String(b.dataset.soFinish)); if(o){o.status=o.status==='Entregada'?'Entregada':'Terminada'; persistOrders(); renderView(); showToast('Orden terminada','Lista para entrega o impresión.');}}));
    document.querySelectorAll('[data-so-print]').forEach(b=>b.addEventListener('click',()=>{const o=state.serviceOrders.find(x=>String(x.id)===String(b.dataset.soPrint)); if(o) printOrder(o);}));
    document.querySelectorAll('[data-so-history]').forEach(b=>b.addEventListener('click',()=>{const o=state.serviceOrders.find(x=>String(x.id)===String(b.dataset.soHistory)); if(o) Swal.fire({title:'Historia del equipo',html:`<div class="table-wrap"><table class="table"><tr><th>Fecha</th><th>Falla</th><th>Estado</th></tr><tr><td>${escapeHtml(formatDateOnlyAR(o.date))}</td><td>${escapeHtml(o.failure)}</td><td>${escapeHtml(o.status)}</td></tr></table></div>`,width:720});}));
    document.querySelectorAll('[data-so-delete]').forEach(b=>b.addEventListener('click',async()=>{const id=b.dataset.soDelete; const r=await Swal.fire({icon:'warning',title:'¿Eliminar orden?',text:'Esta acción eliminará la orden técnica seleccionada.',showCancelButton:true,confirmButtonText:'Eliminar'}); if(r.isConfirmed){state.serviceOrders=state.serviceOrders.filter(o=>String(o.id)!==String(id)); persistOrders(); renderView();}}));
  };

  const oldUpdateHeader = updateHeader;
  updateHeader = function(){ oldUpdateHeader(); const logo=document.querySelector('.brand-logo'); if(logo){ logo.src=document.body.classList.contains('light')?'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4m5sI9rXqK72J4Ix5rqSA4U4AH3eDjmuJWQ&s':'https://www.educaciontuc.gov.ar/wp-content/uploads/2024/10/MINISTERIO-DE-EDUCACION-blanco.png'; } };
  const oldSetTheme = setTheme;
  setTheme = function(theme){ oldSetTheme(theme); setTimeout(()=>updateHeader(),0); };

  // Refuerzo anti-superposición: en app solo dashboard, en index solo login.
  document.body.classList.remove('auth-page');
  setTimeout(()=>{ if(!getVisibleViews().includes(state.currentView)) state.currentView='dashboard'; renderView(); },80);
})();

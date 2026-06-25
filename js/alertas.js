/* ================================================
   alertas.js — Alertas y Novedades de Transporte
   ================================================ */

// Muestra la hora actual en el banner de estado
document.getElementById('bannerTime').textContent =
  new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' HS';

// ── Datos mock de alertas ─────────────────────────
const ALERTAS = [
  {
    id: 1, tipo: 'corte', sev: 'urgente',
    titulo: 'Corte Total de Calzada – Manifestación',
    ubicacion: 'Av. 9 de Julio y Corrientes',
    barrio: 'San Nicolás (Centro)',
    hora: '14:12 HS',
    cuerpo: 'Manifestación en zona céntrica provoca cierre total de carriles centrales sobre Av. 9 de Julio. Se prevén demoras significativas para todas las líneas del corredor.',
    lineas: [{ num:'7',color:'blue' },{ num:'24',color:'gray' },{ num:'59',color:'gray' },{ num:'105',color:'gray' }],
    finEst: '17:30 HS',
    extra: '🔀 Desvío sugerido: Línea 7 por Av. Callao · Línea 59 por Viamonte · Línea 24 por Av. Córdoba. Se recomienda usar el Metrobús del Bajo como alternativa.',
    historica: false,
  },
  {
    id: 2, tipo: 'demora', sev: 'moderado',
    titulo: 'Demoras por Obra de Bacheo',
    ubicacion: 'Av. Santa Fe y Pueyrredón',
    barrio: 'Palermo',
    hora: '13:45 HS',
    cuerpo: 'Trabajos de bacheo de emergencia en el cruce de Av. Santa Fe y Pueyrredón. Reducción de carril derecho con demoras de 10 a 15 min.',
    lineas: [{ num:'12',color:'gray' },{ num:'39',color:'red' },{ num:'68',color:'gray' }],
    finEst: '20:00 HS',
    extra: '🛣️ Alternativas: Av. Córdoba (Líneas 12 y 68) · Av. Las Heras (Línea 39). Demoras estimadas: 10-15 min adicionales.',
    historica: false,
  },
  {
    id: 3, tipo: 'planificado', sev: 'planificado',
    titulo: 'Mantenimiento Programado – Subte Línea D',
    ubicacion: 'Est. Facultad de Medicina',
    barrio: 'Recoleta',
    hora: 'Ayer 18:00 HS',
    cuerpo: 'Modernización del sistema de señales entre Pueyrredón y Callao. Est. Facultad de Medicina cerrada temporalmente. Colectivos de reemplazo habilitados.',
    lineas: [],
    desde: '12/06', hasta: '25/06',
    extra: '🚌 Colectivo de reemplazo D: servicio especial cada 6 min sobre Av. M. T. de Alvear entre Callao y Pueyrredón. Acceso por est. Callao (L.D) o Pueyrredón (L.D).',
    historica: false,
  },
  {
    id: 4, tipo: 'demora', sev: 'leve',
    titulo: 'Demoras Leves – Nodo Obelisco (hora pico)',
    ubicacion: 'Av. Corrientes y 9 de Julio',
    barrio: 'San Nicolás (Centro)',
    hora: '09:20 HS',
    cuerpo: 'Congestión vehicular habitual en hora pico matutina. Demoras de 5 a 8 minutos para colectivos del corredor central. Situación en normalización progresiva.',
    lineas: [{ num:'7',color:'blue' },{ num:'24',color:'gray' },{ num:'59',color:'gray' },{ num:'100',color:'gray' }],
    finEst: '11:00 HS',
    extra: 'ℹ️ No se requieren desvíos. Se espera normalización espontánea al finalizar el horario pico. Frecuencia de colectivos levemente reducida.',
    historica: false,
  },
  // Alertas históricas (se cargan con "Cargar más")
  {
    id: 5, tipo: 'desvio', sev: 'moderado',
    titulo: 'Desvío por Acto Oficial – Plaza de Mayo',
    ubicacion: 'Av. de Mayo entre Bernardo de Irigoyen y Perú',
    barrio: 'San Nicolás (Centro)',
    hora: 'Ayer 08:00 HS',
    cuerpo: 'Acto oficial en Plaza de Mayo. Corte de Av. de Mayo activo desde las 08:00 hasta las 14:00 hs. Servicio retomó normalidad a las 14:20 hs.',
    lineas: [{ num:'29',color:'gray' },{ num:'24',color:'gray' },{ num:'64',color:'gray' }],
    finEst: 'RESUELTO ✓',
    extra: '✅ Situación normalizada. Todas las líneas retomaron su recorrido habitual a las 14:20 hs.',
    historica: true,
  },
  {
    id: 6, tipo: 'corte', sev: 'urgente',
    titulo: 'Corte de Emergencia – Rotura de Cañería AYSA',
    ubicacion: 'Av. Belgrano y Lima',
    barrio: 'San Nicolás (Centro)',
    hora: 'Ayer 10:15 HS',
    cuerpo: 'Rotura de cañería de agua en calzada. AYSA realizó trabajos de emergencia con corte total de la arteria durante 4 horas. Servicio normalizado.',
    lineas: [{ num:'56',color:'gray' },{ num:'28',color:'gray' },{ num:'45',color:'gray' }],
    finEst: 'RESUELTO ✓',
    extra: '✅ Reparación completada a las 14:30 hs. Circulación restablecida en todos los carriles.',
    historica: true,
  },
  {
    id: 7, tipo: 'planificado', sev: 'planificado',
    titulo: 'Mantenimiento Preventivo – Subte Línea B (fines de semana)',
    ubicacion: 'Sector Ángel Gallardo – Medrano',
    barrio: 'Caballito',
    hora: '2 días atrás',
    cuerpo: 'Trabajos de mantenimiento en vías. Servicio reducido los fines de semana con frecuencia cada 10-12 min en el sector entre Ángel Gallardo y Medrano.',
    lineas: [],
    desde: '01/06', hasta: '30/06',
    extra: '📋 Frecuencia reducida solo fines de semana: cada 10-12 min en el sector afectado. Días hábiles: servicio normal.',
    historica: true,
  },
  {
    id: 8, tipo: 'demora', sev: 'moderado',
    titulo: 'Demoras por Lluvia – Corredor Av. Rivadavia',
    ubicacion: 'Av. Rivadavia entre Av. La Plata y Acoyte',
    barrio: 'Caballito',
    hora: '2 días atrás',
    cuerpo: 'Acumulación de agua en calzada por lluvias intensas. Demoras de hasta 20 minutos para líneas del corredor oeste. Situación resuelta al cesar la lluvia.',
    lineas: [{ num:'55',color:'gray' },{ num:'26',color:'gray' },{ num:'84',color:'gray' }],
    finEst: 'RESUELTO ✓',
    extra: '✅ Normalizado. Subte Línea A operó sin problemas como alternativa durante el episodio.',
    historica: true,
  },
];

// ── Estado de los filtros ─────────────────────────
let mostrarHistoricas = false;
let filtroTipo    = 'todos';
let filtroBarrios = new Set();
let textoBusqueda = '';
let ordenarDesc   = true; // true = más urgente primero

// Prioridad numérica para el orden
const PRIO = { urgente: 4, moderado: 3, planificado: 2, leve: 1 };

// Íconos SVG y estilos por severidad
const ICO = {
  urgente:     `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
  moderado:    `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  planificado: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
  leve:        `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
};
const ICO_CLS = { urgente: 'danger', moderado: 'warning', planificado: 'info', leve: 'info' };
const SEV_LBL = { urgente: 'URGENTE', moderado: 'MODERADO', planificado: 'PLANIFICADO', leve: 'LEVE' };

// ── Genera el HTML de una tarjeta de alerta ────────
function renderAlerta(a) {
  // Líneas afectadas (píldoras de color)
  const lineasHTML = a.lineas.length
    ? `<div class="affected-lines"><span>Líneas afectadas:</span>
        ${a.lineas.map(l => `<span class="line-pill ln-${l.color}">${l.num}</span>`).join('')}
       </div>`
    : '';

  // Fechas (solo en alertas planificadas)
  const fechasHTML = a.desde
    ? `<div class="alert-dates">
        <span><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Desde: ${a.desde}</span>
        <span><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Hasta: ${a.hasta}</span>
       </div>`
    : '';

  return `
    <article class="alert-card${a.historica ? ' historica' : ''}" role="listitem"
             data-tipo="${a.tipo}" data-sev="${a.sev}" data-barrio="${a.barrio}" data-id="${a.id}">
      <div class="alert-card-top">
        <div class="alert-ico ${ICO_CLS[a.sev]}" aria-hidden="true">${ICO[a.sev]}</div>
        <div class="alert-card-meta">
          <h3>${a.titulo}</h3>
          <div class="alert-tags">
            <span class="sev sev-${a.sev}">${SEV_LBL[a.sev]}</span>
            <span class="alert-location">📍 ${a.ubicacion}</span>
          </div>
        </div>
        <span class="alert-time">${a.hora}</span>
      </div>
      <div class="alert-body">${a.cuerpo}</div>
      ${lineasHTML}
      ${fechasHTML}
      <div class="alert-desvio" id="desvio-${a.id}">
        <div class="alert-desvio-inner">${a.extra}</div>
      </div>
      <div class="alert-footer">
        <span class="alert-est">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${a.finEst ? 'Fin estimado: ' + a.finEst : 'En seguimiento'}
        </span>
        <button class="link-arrow" onclick="toggleDesvio(${a.id}, this)" aria-expanded="false">
          Ver detalle
          <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </article>`;
}

// Muestra u oculta el panel de desvíos de una alerta
function toggleDesvio(id, btn) {
  const panel = document.getElementById('desvio-' + id);
  const open  = panel.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  btn.innerHTML = open
    ? `Cerrar <svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>`
    : `Ver detalle <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
}

// ── Filtra la lista y la vuelve a renderizar ───────
function aplicarFiltros() {
  let lista = ALERTAS.filter(a => {
    if (!mostrarHistoricas && a.historica)               return false;
    if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
    if (filtroBarrios.size > 0 && !filtroBarrios.has(a.barrio)) return false;
    if (textoBusqueda) {
      const q = textoBusqueda.toLowerCase();
      return a.titulo.toLowerCase().includes(q)
          || a.ubicacion.toLowerCase().includes(q)
          || a.barrio.toLowerCase().includes(q)
          || a.lineas.some(l => l.num.includes(q));
    }
    return true;
  });

  if (ordenarDesc) lista.sort((a, b) => (PRIO[b.sev] || 0) - (PRIO[a.sev] || 0));

  document.getElementById('alertsList').innerHTML = lista.map(renderAlerta).join('');
  document.getElementById('alerts-heading').textContent =
    `Alertas Activas (${lista.filter(a => !a.historica).length})`;
  document.getElementById('alertsEmpty').classList.toggle('show', lista.length === 0);
}

// ── Eventos de filtros ─────────────────────────────

// Chips de tipo de incidente
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const tipos = { 'Todos': 'todos', 'Demoras': 'demora', 'Cortes': 'corte', 'Desvíos': 'desvio' };
    filtroTipo = tipos[chip.textContent.trim()] || 'todos';
    aplicarFiltros();
  });
});

// Búsqueda por texto
document.getElementById('filterSearch').addEventListener('input', function() {
  textoBusqueda = this.value.trim();
  aplicarFiltros();
});

// Checkboxes de barrios
document.querySelectorAll('.filter-checks input').forEach(cb => {
  cb.addEventListener('change', () => {
    const barrio = cb.closest('label').textContent.trim();
    cb.checked ? filtroBarrios.add(barrio) : filtroBarrios.delete(barrio);
    aplicarFiltros();
  });
});

// Botón limpiar filtros
document.querySelector('.btn-clear-filters').addEventListener('click', () => {
  filtroTipo = 'todos';
  filtroBarrios.clear();
  textoBusqueda = '';
  document.getElementById('filterSearch').value = '';
  document.querySelectorAll('.filter-checks input').forEach(cb => cb.checked = false);
  document.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('active', i === 0));
  aplicarFiltros();
});

// Botón ordenar (alterna entre urgente primero / más antiguo primero)
document.querySelector('.sort-btn').addEventListener('click', function() {
  ordenarDesc = !ordenarDesc;
  this.querySelector('svg').style.transform = ordenarDesc ? '' : 'scaleY(-1)';
  aplicarFiltros();
});

// Cargar alertas históricas
document.getElementById('btnLoadMore').addEventListener('click', function() {
  mostrarHistoricas = true;
  this.style.display = 'none';
  aplicarFiltros();
});

// ── Modal "Ver Reporte Diario" ─────────────────────
const modal = document.getElementById('modalReporte');
document.getElementById('btnReporte').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('modalClose').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });

// ── Panel de filtros en móvil ──────────────────────
document.getElementById('btnMobileFilter').addEventListener('click', () => {
  document.querySelector('.filter-panel').classList.add('mobile-open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('btnCloseMobileFilter').addEventListener('click', () => {
  document.querySelector('.filter-panel').classList.remove('mobile-open');
  document.body.style.overflow = '';
});

// Render inicial al cargar la página
aplicarFiltros();

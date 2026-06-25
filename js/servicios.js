/* ================================================
   servicios.js — Terminal de Servicios
   ================================================ */

// ── Scroll suave al clickear una tab de sección ───
function irASeccion(btn, id) {
  const seccion = document.getElementById(id);
  if (!seccion) return;

  // Calcular offset para que no quede tapado por navbar + barra de tabs
  const navbar  = document.querySelector('.navbar');
  const tabsBar = document.querySelector('.servicios-tabs-bar');
  const offset  = (navbar?.offsetHeight || 0) + (tabsBar?.offsetHeight || 0) + 8;

  window.scrollTo({ top: seccion.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });

  // Marcar tab activa
  document.querySelectorAll('.stab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
}

// ── Tooltip del mapa SVG ──────────────────────────
const tooltip = document.getElementById('mapTooltip');
const ttTitle  = document.getElementById('ttTitle');
const ttLoc    = document.getElementById('ttLoc');

document.querySelectorAll('.mapa-zone').forEach(zone => {
  // Mostrar tooltip al pasar el mouse
  zone.addEventListener('mouseenter', () => {
    ttTitle.textContent = zone.dataset.name;
    ttLoc.textContent   = zone.dataset.loc;
    tooltip.style.display = 'block';
  });

  // Mover tooltip con el cursor
  zone.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top  = (e.clientY - 40) + 'px';
  });

  // Ocultar al salir
  zone.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  // Hacer scroll a la sección al clickear una zona del mapa
  zone.addEventListener('click', () => {
    const name = zone.dataset.name;
    // Mapeo nombre de zona → id de sección
    const mapa = {
      'Plataforma':    'banos',
      'Espera':        'espera',
      'Gastron':       'gastronomia',
      'Información':   'informacion',
      'Baños':         'banos',
      'Estacion':      'estacionamiento',
    };
    const cat = Object.keys(mapa).find(k => name.includes(k));
    if (cat) document.getElementById(mapa[cat])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Accesibilidad: activar por teclado
  zone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zone.click(); }
  });
});

// Leyenda del mapa: clickear un ítem hace scroll igual que la zona
document.querySelectorAll('.legend-item').forEach(item => {
  item.addEventListener('click', () => {
    const zone = document.querySelector(`.mapa-zone[data-name="${item.dataset.zone}"]`);
    if (zone) zone.dispatchEvent(new MouseEvent('click'));
  });
});

// ── Chatbot de asistencia ─────────────────────────

// Respuestas predefinidas por tema
const FAQs = {
  horarios:        '🕐 La terminal opera de 05:00 a 00:30 hs. Los servicios nocturnos tienen horario reducido. Algunos kioscos permanecen abiertos las 24hs.',
  baños:           '🚻 Hay baños en Planta Baja Sector Norte y Sur, y en la Zona de Plataformas (1er piso). El baño familiar está en Sector Central. Todos cuentan con acceso para discapacitados.',
  estacionamiento: '🅿️ La playa de autos está en el Nivel 1, acceso por Av. Ramos Mejía. Capacidad: 327 vehículos. Tarifas 2025: $1.200 (15 min) · $4.500 (1 hora) · $28.000 (24 hs). Abierto las 24 hs.',
  sube:            '💳 El módulo SUBE está en Acceso Norte, Planta Baja. Horario: L a V de 07:00 a 20:00 hs. También hay terminales de autoservicio disponibles las 24hs.',
  wifi:            '📶 WiFi gratuito en toda la Sala de Espera Principal (1er Piso) y en el Punto Digital. Conectate a "CentroBA_WiFi" sin contraseña.',
  comida:          '🍕 Zona gastronómica: Café Central (05:30–23:00), El Rápido (07:00–22:00), Kiosco 24hs, Heladería Patagonia y Bar El Mirador en la terraza.',
  accesibilidad:   '♿ Rampas en todos los accesos, sala de accesibilidad en Planta Baja Norte, intérprete LSA en horario comercial, y señalética en braille.',
  taxi:            '🚕 Parada de taxis en Nivel 1, acceso por Av. Ramos Mejía. Solo taxis habilitados por el GCBA. Remises con precio pactado en Nivel 2 (sector plataformas).',
  objetos:         '🔍 Objetos perdidos: Oficina de Informes en Nivel 2, local 129-130. L a V de 08:00 a 20:00 hs. Tel: (011) 4310-0700.',
  lineas:          '🚌 Desde esta terminal operan más de 134 líneas. Consultá "Nuestras Líneas" en el inicio para ver recorridos y horarios.',
};

// Detecta el tema de la pregunta según palabras clave
function detectarTema(msg) {
  const m = msg.toLowerCase();
  if (m.includes('hora')  || m.includes('cuando'))                return 'horarios';
  if (m.includes('baño')  || m.includes('sanitario'))             return 'baños';
  if (m.includes('estacion') || m.includes('auto') || m.includes('parking')) return 'estacionamiento';
  if (m.includes('sube')  || m.includes('tarjeta'))               return 'sube';
  if (m.includes('wifi')  || m.includes('internet'))              return 'wifi';
  if (m.includes('comida') || m.includes('comer') || m.includes('café')) return 'comida';
  if (m.includes('access') || m.includes('silla') || m.includes('rampa')) return 'accesibilidad';
  if (m.includes('taxi')  || m.includes('remis'))                 return 'taxi';
  if (m.includes('perd')  || m.includes('olvid'))                 return 'objetos';
  if (m.includes('línea') || m.includes('colect') || m.includes('bus')) return 'lineas';
  return null;
}

// Agrega un mensaje al chat (tipo 'bot' o 'user')
function addMsg(text, tipo = 'bot') {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = `msg ${tipo}`;
  div.innerHTML = tipo === 'bot'
    ? `<div class="msg-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
       <div class="msg-bubble">${text}</div>`
    : `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Envía un mensaje del usuario y genera respuesta del bot
function enviarMensaje(text) {
  if (!text.trim()) return;
  addMsg(text, 'user');
  document.getElementById('chatInput').value = '';

  // Simula tiempo de respuesta del bot
  setTimeout(() => {
    const tema = detectarTema(text);
    const resp = tema
      ? FAQs[tema]
      : '¡Gracias por tu consulta! Por el momento no tengo información sobre eso. Te recomiendo llamar al 147 o visitar el Centro de Atención al Pasajero en el Hall Principal.';
    addMsg(resp, 'bot');
  }, 600);
}

// Abrir/cerrar panel del chatbot
const fab   = document.getElementById('chatFab');
const panel = document.getElementById('chatPanel');
fab.addEventListener('click', () => {
  const open = panel.classList.toggle('open');
  fab.setAttribute('aria-expanded', open);
  fab.querySelector('.badge-notif').style.display = 'none';
  if (open) document.getElementById('chatInput').focus();
});
document.getElementById('chatClose').addEventListener('click', () => {
  panel.classList.remove('open');
  fab.setAttribute('aria-expanded', 'false');
});

// Enviar al clickear el botón o presionar Enter
document.getElementById('chatSend').addEventListener('click', () =>
  enviarMensaje(document.getElementById('chatInput').value));
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarMensaje(e.target.value);
});

// Respuestas rápidas predefinidas
document.querySelectorAll('.qreply').forEach(btn =>
  btn.addEventListener('click', () => enviarMensaje(btn.dataset.q)));

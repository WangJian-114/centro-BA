/* ================================================
   contacto.js — Formulario de Contacto + Mapa
   ================================================ */

// ── Validación del formulario ─────────────────────

// Reglas de validación por campo
const RULES = {
  nombre:  { minLen: 3, pattern: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/, msg: 'Solo letras, mínimo 3 caracteres.' },
  email:   { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,             msg: 'Ingresá un correo válido.' },
  mensaje: { minLen: 10,                                             msg: 'El mensaje debe tener al menos 10 caracteres.' },
};

// Muestra el error de un campo
function showError(field, msg) {
  field.classList.add('input-error');
  field.classList.remove('input-ok');
  let err = field.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    err.setAttribute('aria-live', 'polite');
    field.parentElement.appendChild(err);
  }
  err.textContent = msg;
}

// Limpia el error de un campo (estado OK)
function clearError(field) {
  field.classList.remove('input-error');
  field.classList.add('input-ok');
  const err = field.parentElement.querySelector('.field-error');
  if (err) err.textContent = '';
}

// Valida un campo según sus reglas y devuelve true si es válido
function validateField(field) {
  const rule = RULES[field.name];
  if (!rule) return true;
  const val = field.value.trim();

  if (!val)                                         { showError(field, 'Este campo es obligatorio.'); return false; }
  if (rule.minLen   && val.length < rule.minLen)    { showError(field, rule.msg); return false; }
  if (rule.pattern  && !rule.pattern.test(val))     { showError(field, rule.msg); return false; }

  clearError(field);
  return true;
}

// Validación al salir del campo (blur) y mientras se escribe si hay error
['nombre', 'email', 'mensaje'].forEach(name => {
  const el = document.getElementById(name);
  el.addEventListener('blur',  () => validateField(el));
  el.addEventListener('input', () => { if (el.classList.contains('input-error')) validateField(el); });
});

// Envío del formulario
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const campos    = ['nombre', 'email', 'mensaje'].map(n => document.getElementById(n));
  const todoValido = campos.map(validateField).every(Boolean);

  if (!todoValido) {
    // Enfocar el primer campo con error
    campos.find(f => f.classList.contains('input-error'))?.focus();
    return;
  }

  // Formulario válido → mostrar mensaje de éxito
  this.style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
});

// ── Mapa Leaflet (requiere que Leaflet esté cargado antes) ──
const LAT = -34.6196;
const LNG = -58.3731;

// Inicializar mapa centrado en la sede
const map = L.map('leafletMap', { zoomControl: true, scrollWheelZoom: false }).setView([LAT, LNG], 16);

// Capa de tiles de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

// Marcador personalizado con estilo de pin
const icon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px; height:36px; background:#1a2e5a;
    border-radius:50% 50% 50% 0; transform:rotate(-45deg);
    border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,.35);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

// Agregar marcador con popup
L.marker([LAT, LNG], { icon })
  .addTo(map)
  .bindPopup('<strong>CentroBA – Sede Central</strong><br>Av. Martín García 346, CABA')
  .openPopup();

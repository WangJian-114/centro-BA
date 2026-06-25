/* ================================================
   index.js — Filtro de búsqueda en Nuestras Líneas
   ================================================ */

// Muestra solo las tarjetas que coincidan con el texto ingresado
document.getElementById('lineSearch').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#linesGrid .line-card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

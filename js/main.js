/* ================================================
   main.js — Lógica compartida en todas las páginas
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Menú hamburguesa (navegación móvil) ──────────
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    // Abrir/cerrar al clickear el ícono
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Cerrar al tocar cualquier link del menú
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  // ── Acordeón de preguntas frecuentes (asistencia.html) ──
  // Usamos scrollHeight en lugar de max-height para que la animación sea exacta
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const estaAbierto = item.classList.contains('open');

      // Cerrar todos los ítems abiertos
      document.querySelectorAll('.faq-item.open').forEach(otro => {
        otro.classList.remove('open');
        otro.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
        const resp = otro.querySelector('.faq-answer');
        if (resp) { resp.style.height = '0'; resp.setAttribute('aria-hidden', 'true'); }
      });

      // Si estaba cerrado, abrir el clickeado
      if (!estaAbierto) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.height = answer.scrollHeight + 'px';
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // ── Animación fade-in al hacer scroll ────────────
  const tarjetas = document.querySelectorAll(
    '.stat-card, .line-card, .info-card, .infra-card, .digital-card, ' +
    '.action-card, .astat-card, .alert-card, .contact-type-card'
  );

  if ('IntersectionObserver' in window && tarjetas.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity   = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target); // dejar de observar una vez animado
        }
      });
    }, { threshold: 0.08 });

    tarjetas.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(14px)';
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      obs.observe(el);
    });
  }

});

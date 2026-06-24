document.addEventListener('DOMContentLoaded', () => {

  /* ── Menú hamburguesa ── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  /* ── FAQ Acordeón ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn    = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar todos
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
        const ans = other.querySelector('.faq-answer');
        if (ans) ans.setAttribute('aria-hidden', 'true');
      });

      // Abrir el clickeado si estaba cerrado
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ── Chips de filtro (alertas) ── */
  document.querySelectorAll('.filter-chips').forEach(group => {
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  /* ── Limpiar filtros ── */
  document.querySelector('.btn-clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-chips .chip').forEach((c, i) =>
      c.classList.toggle('active', i === 0)
    );
    document.querySelectorAll('.filter-checks input').forEach(cb => cb.checked = false);
    const s = document.querySelector('.filter-search input');
    if (s) s.value = '';
  });

  /* ── Animación fade-in al hacer scroll ── */
  const fadeTargets = document.querySelectorAll(
    '.stat-card, .line-card, .info-card, .infra-card, .digital-card, ' +
    '.action-card, .astat-card, .alert-card, .contact-type-card'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity    = '1';
          e.target.style.transform  = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    fadeTargets.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(14px)';
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      io.observe(el);
    });
  }

  /* ── Teclado: action-cards ── */
  document.querySelectorAll('.action-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

});

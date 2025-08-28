// Smooth scrolling para navegação com OFFSET automático (altura do header)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      const header = document.querySelector('header');
      const headerOffset = header ? header.offsetHeight : 0;

      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  });
});

// Sticky Header
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('backdrop-blur-md', 'bg-slate-950/60', 'border-b', 'border-white/10');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.remove('backdrop-blur-md', 'bg-slate-950/60', 'border-white/10');
      header.classList.add('bg-transparent', 'border-transparent');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Sombra do header ao rolar
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('shadow-xl');
  } else {
    header.classList.remove('shadow-xl');
  }
});

// EmailJS
(function initEmailJS() {
  if (window.emailjs && typeof emailjs.init === 'function') {
    emailjs.init('ev12yg_q3vlp5WYd6'); 
  }
})();

// Formulário de contato
(function handleContatoForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.textContent = 'Enviando...';
    button.disabled = true;

    const restoreButton = () => setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.classList.remove('bg-green-600');
      button.classList.add('bg-liberpay-green', 'hover:bg-liberpay-dark-green');
    }, 3000);

    const successUI = () => {
      button.textContent = 'Mensagem Enviada!';
      button.classList.remove('bg-liberpay-green', 'hover:bg-liberpay-dark-green');
      button.classList.add('bg-green-600');
      form.reset();
      restoreButton();
    };

    if (window.emailjs && typeof emailjs.sendForm === 'function') {
      emailjs.sendForm('service_2y9uacn', 'template_hxror5r', form)
        .then(() => { alert('Mensagem enviada com sucesso!'); successUI(); },
              (error) => { alert('Erro: ' + JSON.stringify(error)); button.textContent = originalText; button.disabled = false; });
    } else {
      setTimeout(successUI, 1500);
    }
  });
})();

/* === Bolhas === */
function createProdutosBubbles() {
  const container = document.getElementById('prod-bubbles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const bubble = document.createElement('div');
    const size = Math.random() * 20 + 15;
    const delay = Math.random() * 30;
    const duration = Math.random() * 10 + 15;
    bubble.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 blur-[1px]';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animationDelay = delay + 's';
    bubble.style.animation = `floatRandom ${duration}s infinite linear`;
    bubble.style.boxShadow = `0 0 ${size * 2}px rgba(99, 255, 185, 0.4), 0 0 ${size}px rgba(6, 182, 212, 0.3)`;
    container.appendChild(bubble);
  }
}
function createHeaderBubbles() {
  const container = document.getElementById('header-bubbles');
  if (!container) return;
  for (let i = 0; i < 10; i++) {
    const bubble = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const delay = Math.random() * 20;
    bubble.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 blur-sm';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animationDelay = delay + 's';
    bubble.style.animation = 'floatRandom 15s infinite linear';
    container.appendChild(bubble);
  }
}

/* === Tilt Cards === */
function initTiltEffect() {
  const cards = document.querySelectorAll('.js-tilt');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transition = 'transform 0.3s ease-out');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

/* === CountUp === */
function initCountUp() {
  const els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const animate = el => {
    const end = parseFloat(el.dataset.countTo || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = parseInt(el.dataset.duration || '1400', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();
    const render = now => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(t);
      const val = end * eased;
      const formatted = Number(val).toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (t < 1) requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* === Keyframes === */
const style = document.createElement('style');
style.textContent = `
  @keyframes floatRandom {
    0% { transform: translate(0,0) rotate(0deg) }
    25% { transform: translate(18px,-15px) rotate(90deg) }
    50% { transform: translate(-12px,10px) rotate(180deg) }
    75% { transform: translate(15px,18px) rotate(270deg) }
    100% { transform: translate(0,0) rotate(360deg) }
  }
  .js-tilt { transform-style: preserve-3d; will-change: transform; }
`;
document.head.appendChild(style);

/* === Inicialização Final === */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  createHeaderBubbles();
  createProdutosBubbles();
  initTiltEffect();
  initCountUp();
});

// Smooth scrolling para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

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
document.addEventListener('DOMContentLoaded', initStickyHeader);

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
    emailjs.init('ev12yg_q3vlp5WYd6'); // chave pública (igual ao original)
  }
})();

// Envio do formulário de contato via EmailJS (unificado)
(function handleContatoForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    // feedback de envio
    button.textContent = 'Enviando...';
    button.disabled = true;

    const restoreButton = () => {
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('bg-green-600');
        button.classList.add('bg-liberpay-green', 'hover:bg-liberpay-dark-green');
      }, 3000);
    };

    const successUI = () => {
      button.textContent = 'Mensagem Enviada!';
      button.classList.remove('bg-liberpay-green', 'hover:bg-liberpay-dark-green');
      button.classList.add('bg-green-600');
      form.reset();
      restoreButton();
    };

    if (window.emailjs && typeof emailjs.sendForm === 'function') {
      emailjs
        .sendForm('service_2y9uacn', 'template_hxror5r', form)
        .then(() => {
          alert('Mensagem enviada com sucesso!');
          successUI();
        }, (error) => {
          alert('Erro ao enviar mensagem: ' + JSON.stringify(error));
          button.textContent = originalText;
          button.disabled = false;
        });
    } else {
      // Fallback (se o SDK não carregar por algum motivo)
      setTimeout(successUI, 1500);
    }
  });
})();

// Cloudflare (trecho movido do inline para o arquivo JS)
(function(){
  function c(){
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement('script');
      d.innerHTML = "window.__CF$cv$params={r:'966e84c590a3e0ff',t:'MTc1MzgxMjA1Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName('head')[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement('iframe');
    a.height = 1;
    a.width = 1;
    a.style.position = 'absolute';
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = 'none';
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    if ('loading' !== document.readyState) c();
    else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
    else {
      var e = document.onreadystatechange || function(){};
      document.onreadystatechange = function(b){
        e(b);
        'loading' !== document.readyState && (document.onreadystatechange = e, c());
      };
    }
  }
})();

/* === LibberPay | Bandeiras: Reveal + Micro-Parallax === */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  // Animação de entrada (reveal) com stagger por grid
  function initBandeirasReveal() {
    const section = document.querySelector('#bandeiras');
    if (!section) return;

    const items = Array.from(section.querySelectorAll('.grid .group'));
    if (!items.length) return;

    // estado inicial
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 700ms ease-out, transform 700ms ease-out';
      el.style.willChange = 'opacity, transform';
    });

    const getCols = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) return 6; // lg
      if (window.matchMedia('(min-width: 768px)').matches) return 3;  // md
      return 2;                                                       // sm
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          const cols = getCols();
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const index = items.indexOf(el);
            const col = index % cols;
            const row = Math.floor(index / cols);
            const delay = col * 70 + row * 90; // ms (stagger por coluna/linha)
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0px)';
            }, delay);
            observer.unobserve(el);
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
      : null;

    if (observer) items.forEach((el) => observer.observe(el));
    else {
      // fallback sem IntersectionObserver
      items.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0px)';
        }, i * 80);
      });
    }
  }

  // Micro-parallax nos glows (auroras), respeitando prefers-reduced-motion
  function initBandeirasParallax() {
    const section = document.querySelector('#bandeiras');
    if (!section) return;

    // Seleciona as auroras (radiais). Mantemos o anel e satélites como estão (já têm animação própria)
    const auroras = Array.from(section.querySelectorAll('[class*="bg-[radial-gradient"]'));
    if (!auroras.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) return;

    let targetX = 0.5, targetY = 0.5;
    let curX = targetX, curY = targetY;
    let rafId;

    function apply() {
      // suavização (lerp)
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;

      const dx = (curX - 0.5) * 2; // -1..1
      const dy = (curY - 0.5) * 2;

      auroras.forEach((el, idx) => {
        const depth = idx === 0 ? 22 : 16; // intensidade por camada (px)
        const tx = dx * depth;
        const ty = dy * depth;
        // Sem sobrescrever transforms de elementos com animações de scale/rotate
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        el.style.filter = `saturate(1.06) hue-rotate(${(dx + dy) * 10}deg)`;
      });

      rafId = requestAnimationFrame(apply);
    }

    function onPointerMove(e) {
      const rect = section.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    }

    function onLeave() {
      targetX = 0.5; targetY = 0.5;
    }

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onLeave);

    apply();

    // limpeza (bfcache / navegação away)
    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onLeave);
      auroras.forEach((el) => { el.style.transform = ''; el.style.filter = ''; });
    }, { once: true });
  }

  onReady(() => {
    initBandeirasReveal();
    initBandeirasParallax();
  });
})();

/* === LibberPay | Neon Sections: Reveal + Micro-Parallax (sobre + bandeiras) === */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  // Reveal genérico com stagger por coluna/linha
  function initReveal(section, itemsSelector, gridCols) {
    const items = Array.from(section.querySelectorAll(itemsSelector || '.grid .group'));
    if (!items.length) return;

    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 700ms ease-out, transform 700ms ease-out';
      el.style.willChange = 'opacity, transform';
    });

    const colsCfg = gridCols || { lg: 6, md: 3, sm: 2 };
    const getCols = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) return colsCfg.lg;
      if (window.matchMedia('(min-width: 768px)').matches) return colsCfg.md;
      return colsCfg.sm;
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          const cols = getCols();
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const index = items.indexOf(el);
            const col = index % cols;
            const row = Math.floor(index / cols);
            const delay = col * 70 + row * 90; // ms
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0px)';
            }, delay);
            observer.unobserve(el);
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
      : null;

    if (observer) items.forEach((el) => observer.observe(el));
    else {
      items.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0px)';
        }, i * 80);
      });
    }
  }

  // Micro-parallax nos glows (radiais), respeita prefers-reduced-motion
  function initParallax(section) {
    const auroras = Array.from(section.querySelectorAll('[class*="bg-[radial-gradient"]'));
    if (!auroras.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) return;

    let targetX = 0.5, targetY = 0.5;
    let curX = targetX, curY = targetY;
    let rafId;

    function apply() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;

      const dx = (curX - 0.5) * 2;
      const dy = (curY - 0.5) * 2;

      auroras.forEach((el, idx) => {
        const depth = idx === 0 ? 22 : 16;
        const tx = dx * depth;
        const ty = dy * depth;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        el.style.filter = `saturate(1.06) hue-rotate(${(dx + dy) * 10}deg)`;
      });

      rafId = requestAnimationFrame(apply);
    }

    function onPointerMove(e) {
      const rect = section.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    }
    function onLeave() { targetX = 0.5; targetY = 0.5; }

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onLeave);

    apply();

    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onLeave);
      auroras.forEach((el) => { el.style.transform = ''; el.style.filter = ''; });
    }, { once: true });
  }

  function setupNeon(sectionId, opts) {
    const section = document.querySelector(sectionId);
    if (!section) return;
    initReveal(section, (opts && opts.itemsSelector) || '.grid .group', opts && opts.gridCols);
    initParallax(section);
  }

  onReady(() => {
    // bandeiras: 6 cols (lg), 3 (md), 2 (sm)
    setupNeon('#bandeiras', { gridCols: { lg: 6, md: 3, sm: 2 } });
    // sobre: 3 cols (lg/md), 1 (sm)
    setupNeon('#sobre', { gridCols: { lg: 3, md: 3, sm: 1 } });
  });
})();

// Contador animado (inicia ao entrar no viewport)
function initCountUp() {
  const els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const end = parseFloat(el.dataset.countTo || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = parseInt(el.dataset.duration || '1400', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();

    const render = (now) => {
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

    if (prefersReduced) {
      const formatted = end.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      el.textContent = `${prefix}${formatted}${suffix}`;
      return;
    }

    requestAnimationFrame(render);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach((el) => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initCountUp === 'function') initCountUp();
});

// Underline das seções (animação suave)
(function initSmartUnderline() {
  const underline = document.getElementById('nav-underline');
  const list = document.getElementById('nav');
  if (!underline || !list) return;

  const navWrap = underline.closest('nav') || list;
  const links = Array.from(list.querySelectorAll('.nav-link'));
  const sections = links
    .map(a => ({ link: a, el: document.querySelector(a.getAttribute('href')) }))
    .filter(x => x.el);

  let activeLink = null;

  function setActiveLink(link) {
    if (!link) return;
    links.forEach(a => {
      a.classList.remove('text-green-400');
      a.classList.add('text-slate-200');
    });
    link.classList.remove('text-slate-200');
    link.classList.add('text-green-400');
    activeLink = link;
  }

  function moveUnderlineTo(link, immediate = false) {
    if (!link) {
      underline.style.opacity = '0';
      return;
    }
    const navRect = navWrap.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const left = rect.left - navRect.left;

    underline.style.opacity = '1';
    underline.style.width = rect.width + 'px';
    underline.style.transform = `translateX(${left}px)`;
    underline.style.transitionDuration = immediate ? '0ms' : '300ms';
  }

  // Hover comportamento
  links.forEach(a => {
    a.addEventListener('mouseenter', () => {
      a.classList.remove('text-slate-200');
      a.classList.add('text-green-400');
      moveUnderlineTo(a);
    });
    a.addEventListener('mouseleave', () => {
      if (a !== activeLink) {
        a.classList.remove('text-green-400');
        a.classList.add('text-slate-200');
      }
      moveUnderlineTo(activeLink);
    });
    a.addEventListener('click', () => {
      setActiveLink(a);
      setTimeout(() => moveUnderlineTo(activeLink), 50);
    });
  });

  // ScrollSpy usando scrollY
  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.3; // ponto de referência ~30% da tela
    let current = null;
    for (const s of sections) {
      const top = s.el.offsetTop;
      const bottom = top + s.el.offsetHeight;
      if (y >= top && y < bottom) {
        current = s.link;
        break;
      }
    }
    if (current && current !== activeLink) {
      setActiveLink(current);
      moveUnderlineTo(current);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => moveUnderlineTo(activeLink, true));
  window.addEventListener('hashchange', () => {
    const byHash = links.find(a => a.getAttribute('href') === location.hash);
    if (byHash) { setActiveLink(byHash); moveUnderlineTo(activeLink); }
  });

  // Inicial: deixa tudo branco e underline invisível
  underline.style.opacity = '0';
  onScroll(); // já tenta detectar a primeira seção visível
})();

// Função para criar bolhas na seção produtos
function createProdutosBubbles() {
    const container = document.getElementById('prod-bubbles');
    if (!container) return;
    
    // Criar 18-24 bolhas para a seção produtos (mais que no header)
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 12 + 6; // 6-18px (um pouco maiores que no header)
        const delay = Math.random() * 25;
        const duration = Math.random() * 8 + 12; // 12-20s (variação na velocidade)
        
        bubble.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/25 to-emerald-400/25 blur-[0.5px]';
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.top = Math.random() * 100 + '%';
        bubble.style.animationDelay = delay + 's';
        bubble.style.animation = `floatRandom ${duration}s infinite linear`;
        
        // Adiciona um pouco mais de brilho nas bolhas dos produtos
        bubble.style.boxShadow = `0 0 ${size * 1.5}px rgba(99, 255, 185, 0.3)`;
        
        container.appendChild(bubble);
    }
}


// Função para criar bolhas maiores na seção produtos
function createProdutosBubbles() {
    const container = document.getElementById('prod-bubbles');
    if (!container) return;
    
    // Criar 15-18 bolhas maiores para a seção produtos
    for (let i = 0; i < 30; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 20 + 15; // 15-35px (bem maiores)
        const delay = Math.random() * 30;
        const duration = Math.random() * 10 + 15; // 15-25s (mais lentas)
        
        bubble.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 blur-[1px]';
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.top = Math.random() * 100 + '%';
        bubble.style.animationDelay = delay + 's';
        bubble.style.animation = `floatRandom ${duration}s infinite linear`;
        
        // Brilho mais intenso para bolhas maiores
        bubble.style.boxShadow = `0 0 ${size * 2}px rgba(99, 255, 185, 0.4), 0 0 ${size}px rgba(6, 182, 212, 0.3)`;
        
        container.appendChild(bubble);
    }
}

// Função para criar bolhas no header (mantém o tamanho original)
function createHeaderBubbles() {
    const container = document.getElementById('header-bubbles');
    if (!container) return;
    
    for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 8 + 4; // 4-12px
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

// Efeito Tilt nos cartões dos produtos
function initTiltEffect() {
    const cards = document.querySelectorAll('.js-tilt');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease-out';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -8; // máximo 8 graus
            const rotateY = (x - centerX) / centerX * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Adiciona as animações nos cartões dos produtos
const style = document.createElement('style');
style.textContent = `
    @keyframes floatRandom {
        0%   { transform: translate(0, 0) rotate(0deg) }
        25%  { transform: translate(18px, -15px) rotate(90deg) }
        50%  { transform: translate(-12px, 10px) rotate(180deg) }
        75%  { transform: translate(15px, 18px) rotate(270deg) }
        100% { transform: translate(0, 0) rotate(360deg) }
    }
    
    /* Melhora o efeito tilt */
    .js-tilt {
        transform-style: preserve-3d;
        will-change: transform;
    }
`;
document.head.appendChild(style);

// Inicializar tudo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    createHeaderBubbles();
    createProdutosBubbles();
    initTiltEffect(); // Adiciona o efeito tilt nos cartões
});

// =================================================================
// ARQUIVO JS COMPLETO 
// =================================================================

// --- INICIALIZAÇÃO PRINCIPAL ---
// Roda todas as funções depois que a página carregou completamente.
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initMobileMenu();
    initStickyHeader();
    initEmailJS();
    initContactForm();
    initSiteHeaderBubbles();
    createProdutosBubbles();
    initSwedaBubbles();
    initTiltEffect();
    initCountUp();
    initNavUnderline();
    initScrollReveal();
    initCarrosselSweda();
    initAnimateSpecs();
    initLogoReload();
});

// --- INJEÇÃO DE KEYFRAMES (Feito uma única vez) ---
// Adiciona as animações CSS (keyframes) diretamente na página para as bolhas e o efeito tilt.
(function injectKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatRandom {
        0%   { transform: translate(0, 0) rotate(0deg) }
        25%  { transform: translate(22px, -18px) rotate(90deg) }
        50%  { transform: translate(-16px, 14px) rotate(180deg) }
        75%  { transform: translate(18px, 22px) rotate(270deg) }
        100% { transform: translate(0, 0) rotate(360deg) }
      }
      .js-tilt { transform-style: preserve-3d; will-change: transform; }
    `;
    document.head.appendChild(style);
})();


// --- DEFINIÇÃO DE TODAS AS FUNÇÕES ---

// Faz a rolagem da página ser suave ao clicar em links internos (ex: #contato).
function initSmoothScroll() {
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
}

// Controla a abertura e fechamento do menu de navegação em dispositivos móveis.
function initMobileMenu() {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
        menu.classList.toggle("flex");
    });
    menu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.add("hidden");
            menu.classList.remove("flex");
        });
    });
}

// Adiciona uma sombra ao header quando o usuário rola a página para baixo.
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    const onScroll = () => {
        header.classList.toggle('shadow-xl', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// (Função redundante, a lógica já está em initStickyHeader).
function initHeaderShadow() {
    // Esta função já está integrada na initStickyHeader, pode ser removida se quiser.
    // Mantendo por consistência com seu código original.
}

// Inicializa o serviço EmailJS com a sua chave de API pública.
function initEmailJS() {
    if (window.emailjs && typeof emailjs.init === 'function') {
        emailjs.init('ev12yg_q3vlp5WYd6');
    }
}

// Gerencia o envio do formulário de contato e exibe a mensagem de sucesso.
function initContactForm() {
    const form = document.getElementById('contatoForm');
    if (!form) return;

    const successBox = document.getElementById('form-success');
    let successTimeout;

    function showSuccess() {
        if (!successBox) return;
        successBox.classList.remove('hidden');
        successBox.animate(
            [{ transform: 'translateY(-6px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
            { duration: 320, easing: 'cubic-bezier(.22,.9,.22,1)' }
        );
        clearTimeout(successTimeout);
        successTimeout = setTimeout(hideSuccess, 6000);
    }

    function hideSuccess() {
        if (!successBox || successBox.classList.contains('hidden')) return;
        const anim = successBox.animate(
            [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-6px)', opacity: 0 }],
            { duration: 220, easing: 'cubic-bezier(.22,.9,.22,1)' }
        );
        anim.onfinish = () => successBox.classList.add('hidden');
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'dismiss-success' || e.target.closest('#dismiss-success')) {
            hideSuccess();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Enviando...';
        button.disabled = true;

        emailjs.sendForm('service_2y9uacn', 'template_hxror5r', this)
            .then(() => {
                button.textContent = 'Mensagem Enviada!';
                button.classList.add('bg-green-600');
                form.reset();
                showSuccess();
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.classList.remove('bg-green-600');
                }, 3000);
            }, (error) => {
                alert('Erro ao enviar a mensagem: ' + JSON.stringify(error));
                button.textContent = originalText;
                button.disabled = false;
            });
    });
}

// Cria as pequenas bolhas flutuantes no header principal do site.
function initSiteHeaderBubbles() {
    const container = document.getElementById('site-header-bubbles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        const size = 4 + Math.random() * 8;
        el.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20';
        el.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
            filter: blur(0.8px);
            animation: floatRandom ${12 + Math.random() * 10}s linear ${Math.random() * 20}s infinite;
            will-change: transform;
        `;
        container.appendChild(el);
    }
}

// Cria as bolhas flutuantes para a seção "Produtos".
function createProdutosBubbles() {
    const container = document.getElementById('prod-bubbles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 42; i++) {
        const el = document.createElement('div');
        const size = 10 + Math.random() * 18;
        el.className = 'absolute rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30';
        el.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
            filter: blur(${0.5 + Math.random() * 1.5}px);
            animation: floatRandom ${14 + Math.random() * 14}s linear ${Math.random() * 30}s infinite;
            will-change: transform;
            box-shadow: 0 0 ${size * 2}px rgba(16, 185, 129, .35), 0 0 ${size * 1.1}px rgba(6, 182, 212, .25);
        `;
        container.appendChild(el);
    }
}

// Cria as bolhas maiores e com brilho para a seção de produtos Sweda.
function initSwedaBubbles() {
    const root = document.getElementById('sweda-bubbles');
    if (!root) {
        console.warn("AVISO: O elemento #sweda-bubbles não foi encontrado.");
        return;
    }
    root.innerHTML = '';
    const bubbleCount = 20;
    for (let i = 0; i < bubbleCount; i++) {
        const b = document.createElement('span');
        const size = 40 + Math.random() * 100;
        b.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            border-radius: 9999px;
            background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.35), rgba(6, 182, 212, 0.25) 60%, transparent 80%);
            filter: blur(22px);
        `;
        const dx = (Math.random() * 50 - 25);
        const dy = (Math.random() * 50 - 25);
        const dur = 10 + Math.random() * 10;
        b.animate(
            [{ transform: `translate(0px, 0px) scale(1)`, opacity: 0.7 }, { transform: `translate(${dx}px, ${dy}px) scale(1.1)`, opacity: 0.9 }, { transform: `translate(0px, 0px) scale(1)`, opacity: 0.7 }],
            { duration: dur * 1000, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', delay: Math.random() * -dur * 1000 }
        );
        root.appendChild(b);
    }
}

// Aplica um efeito de inclinação 3D nos elementos quando o mouse passa por cima.
function initTiltEffect() {
    document.querySelectorAll('.js-tilt').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y - height / 2) / (height / 2) * -8;
            const rotateY = (x - width / 2) / (width / 2) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        });
    });
}

// Anima números para contarem de zero até o valor final quando aparecem na tela.
function initCountUp() {
    const els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const animate = el => {
        const end = parseFloat(el.dataset.countTo || '0');
        const duration = parseInt(el.dataset.duration || '1400', 10);
        const startTime = performance.now();
        const render = now => {
            const t = Math.min((now - startTime) / duration, 1);
            el.textContent = `${el.dataset.prefix || ''}${Number(end * easeOutCubic(t)).toLocaleString('pt-BR', { minimumFractionDigits: parseInt(el.dataset.decimals || '0', 10), maximumFractionDigits: parseInt(el.dataset.decimals || '0', 10) })}${el.dataset.suffix || ''}`;
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

// Controla a linha sublinhada da navegação, fazendo-a seguir o link ativo.
function initNavUnderline() {
    const navLinks = document.querySelectorAll('#nav .nav-link');
    const navUnderline = document.getElementById('nav-underline');
    if (!navLinks.length || !navUnderline) return;
    const setActiveLink = link => {
        if (!link) return;
        navUnderline.style.left = `${link.offsetLeft}px`;
        navUnderline.style.width = `${link.offsetWidth}px`;
    };
    navLinks.forEach(link => link.addEventListener('click', () => setActiveLink(link)));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(document.querySelector(`#nav .nav-link[href="#${entry.target.id}"]`));
            }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll("section[id]").forEach(sec => observer.observe(sec));
}

// Faz os elementos aparecerem com uma animação suave quando o usuário rola até eles.
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up-delay');
    if (!revealElements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.opacity = '0';
        if (el.classList.contains('reveal-left')) el.style.transform = 'translateX(-20px)';
        if (el.classList.contains('reveal-right')) el.style.transform = 'translateX(20px)';
        if (el.classList.contains('reveal-up-delay')) el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
    const style = document.createElement('style');
    style.textContent = `
        .is-visible {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Gerencia toda a lógica do carrossel de produtos Sweda (avançar, voltar, etc.).
function initCarrosselSweda() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('article'));
    if (slides.length === 0) return;

    const controls = {
        prev: [document.getElementById('carouselPrev'), document.getElementById('floatPrev')],
        next: [document.getElementById('carouselNext'), document.getElementById('floatNext')]
    };

    let currentIndex = 0;

    const updateButtons = () => {
        const atStart = currentIndex <= 0;
        const atEnd = currentIndex >= slides.length - 1;
        controls.prev.forEach(b => b && b.classList.toggle('opacity-30', atStart));
        controls.next.forEach(b => b && b.classList.toggle('opacity-30', atEnd));
    };

    const scrollToIndex = (index) => {
        const newIndex = Math.max(0, Math.min(index, slides.length - 1));
        const targetSlide = slides[newIndex];
        
        if (targetSlide) {
            const scrollPosition = targetSlide.offsetLeft - (track.offsetWidth - targetSlide.offsetWidth) / 2;
            track.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            currentIndex = newIndex;
            updateButtons();
        }
    };

    controls.prev.forEach(b => b && b.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
    }));

    controls.next.forEach(b => b && b.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
    }));

    let scrollEndTimer;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            let closestIndex = 0;
            let minDistance = Infinity;
            const trackCenter = track.scrollLeft + track.offsetWidth / 2;

            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const distance = Math.abs(trackCenter - slideCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateButtons();
            }
        }, 150);
    }, { passive: true });

    updateButtons();
    
    window.addEventListener('resize', () => {
        const targetSlide = slides[currentIndex];
        if (targetSlide) {
            const scrollPosition = targetSlide.offsetLeft - (track.offsetWidth - targetSlide.offsetWidth) / 2;
            track.scrollTo({ left: scrollPosition, behavior: 'auto' });
        }
    });
}

// Anima a lista de especificações de um produto para aparecer item por item.
function initAnimateSpecs() {
    const cards = document.querySelectorAll('article.snap-start');
    if (!cards.length) return;
    const animateSpecs = listEl => {
        if (!listEl || listEl.dataset.animated) return;
        listEl.dataset.animated = '1';
        listEl.classList.remove('opacity-0', 'translate-y-2');
        Array.from(listEl.querySelectorAll('li')).forEach((li, idx) => {
            li.style.transition = `opacity 280ms ease ${80 + idx * 90}ms, transform 280ms ease ${80 + idx * 90}ms`;
            li.classList.add('is-visible');
        });
    };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSpecs(entry.target.querySelector('[data-animate-specs]'));
            }
        });
    }, { threshold: 0.5 });
    cards.forEach(c => observer.observe(c));
}

// Faz com que um clique no logo role a página para o topo e a recarregue.
function initLogoReload() {
    const siteLogo = document.getElementById('site-logo');
    if (siteLogo) {
        siteLogo.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => location.reload(), 500);
        });
    }
}

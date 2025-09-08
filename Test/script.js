// --- Animación de aparición al hacer scroll ---
function revealOnScroll() {
    const elements = document.querySelectorAll('.animar');
    const trigger = window.innerHeight * 0.92;
    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) el.classList.add('visible');
        else el.classList.remove('visible');
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// --- Menú móvil animado ---
const menuToggle = document.getElementById('menuToggle');
const navUl = document.querySelector('nav ul');
if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
    // Cierra menú al hacer click fuera
    document.addEventListener('click', e => {
        if (!navUl.contains(e.target) && !menuToggle.contains(e.target)) {
            navUl.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });
}

// --- Botón volver arriba inteligente ---
const btnUp = document.querySelector('.btn-up');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btnUp.style.display = 'flex';
    else btnUp.style.display = 'none';
});
btnUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Carrusel general touch y automático (servicios, etc) ---
document.querySelectorAll('.carrusel').forEach(carrusel => {
    // No aplicar a proyectos (tendrá lógica especial abajo)
    if (carrusel.closest('#proyectos')) return;
    const images = carrusel.querySelector('.carrusel-imagenes');
    const slides = images ? images.children : [];
    let index = 0;
    const prev = carrusel.querySelector('.prev');
    const next = carrusel.querySelector('.next');
    function showSlide(i) {
        if (!slides.length) return;
        index = (i + slides.length) % slides.length;
        Array.from(slides).forEach((slide, idx) => {
            slide.style.display = idx === index ? 'flex' : 'none';
        });
    }
    if (prev && next) {
        prev.addEventListener('click', () => showSlide(index - 1));
        next.addEventListener('click', () => showSlide(index + 1));
        showSlide(0);
    }
    // Swipe touch
    let startX = 0;
    images && images.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    images && images.addEventListener('touchend', e => {
        let dx = e.changedTouches[0].clientX - startX;
        if (dx > 50) showSlide(index - 1);
        if (dx < -50) showSlide(index + 1);
    });
    // Auto-slide solo para servicios
    if (carrusel.classList.contains('servicios-carrusel')) {
        setInterval(() => showSlide(index + 1), 7000);
    }
});

// --- Carrusel de proyectos con animaciones y swipe touch ---
(function() {
    const proyectosCarrusel = document.querySelector('#proyectos .carrusel-imagenes');
    if (!proyectosCarrusel) return;
    const slides = Array.from(proyectosCarrusel.children);
    let current = 0;
    let animating = false;

    function updateSlides(direction = 0) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next', 'bounce-left', 'bounce-right');
            if (i === current) {
                slide.classList.add('active');
                if (direction === 1) slide.classList.add('bounce-left');
                if (direction === -1) slide.classList.add('bounce-right');
            }
            else if (i === (current - 1 + slides.length) % slides.length) slide.classList.add('prev');
            else if (i === (current + 1) % slides.length) slide.classList.add('next');
        });
        animating = true;
        setTimeout(() => animating = false, 350);
    }

    updateSlides();

// Botones
const prevBtn = proyectosCarrusel.parentElement.querySelector('button.prev');
const nextBtn = proyectosCarrusel.parentElement.querySelector('button.next');
// ...existing code...
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (animating) return;
            current = (current - 1 + slides.length) % slides.length;
            updateSlides(-1);
        });
        nextBtn.addEventListener('click', () => {
            if (animating) return;
            current = (current + 1) % slides.length;
            updateSlides(1);
        });
    }

    // Clic en tarjetas laterales
    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            if (animating) return;
            if (slide.classList.contains('prev')) {
                current = (current - 1 + slides.length) % slides.length;
                updateSlides(-1);
            }
            if (slide.classList.contains('next')) {
                current = (current + 1) % slides.length;
                updateSlides(1);
            }
        });
    });

    // Swipe touch
    let startX = 0;
    proyectosCarrusel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    proyectosCarrusel.addEventListener('touchend', e => {
        let dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) {
            if (!animating) {
                current = (current - 1 + slides.length) % slides.length;
                updateSlides(-1);
            }
        }
        if (dx < -40) {
            if (!animating) {
                current = (current + 1) % slides.length;
                updateSlides(1);
            }
        }
    });

    // Auto-slide más rápido
    setInterval(() => {
        if (!animating) {
            current = (current + 1) % slides.length;
            updateSlides(1);
        }
    }, 3500);
})();

// --- Parallax Hero ---
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    if (!hero) return;
    let offset = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center ${offset}px`;
});

// --- Efecto partículas en el hero ---
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 2;
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = hero.offsetWidth;
        h = hero.offsetHeight;
        canvas.width = w;
        canvas.height = h;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 32; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2.5 + 1,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(26,35,126,${p.alpha})`;
            ctx.shadowColor = "#ffd600";
            ctx.shadowBlur = 8;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > w) p.dx *= -1;
            if (p.y < 0 || p.y > h) p.dy *= -1;
        });
        requestAnimationFrame(draw);
    }
    draw();
}
if (hero) createParticles();

// --- FAQ Acordeón ---
document.querySelectorAll('.faq-pregunta').forEach((pregunta) => {
    pregunta.addEventListener('click', () => {
        const item = pregunta.parentElement;

        // Si quieres que solo una se abra a la vez
        document.querySelectorAll('.faq-item').forEach(faq => {
            if (faq !== item) faq.classList.remove('active');
        });

        // Alterna el actual
        item.classList.toggle('active');
    });
});

// --- Formulario con EmailJS ---
const form = document.getElementById("form-contacto");
const msgStatus = document.getElementById("msg-status");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 📩 Template 1 → correo interno para la empresa (papá)
        const envioEmpresa = emailjs.sendForm(
            "service_ry3q6c7",   // tu Service ID
            "template_f5wvyhs", // ID del template para la empresa
            this
        );

        // 📩 Template 2 → correo de confirmación para el cliente
        const envioCliente = emailjs.sendForm(
            "service_ry3q6c7",   // mismo service
            "template_0bujggr", // ID del template para el cliente
            this
        );

        Promise.all([envioEmpresa, envioCliente])
            .then(() => {
                msgStatus.textContent = "✅ Mensaje enviado correctamente. Te hemos enviado un correo de confirmación.";
                msgStatus.style.color = "green";
                form.reset();
            })
            .catch((error) => {
                console.error("Error:", error);
                msgStatus.textContent = "❌ Error al enviar el mensaje. Intenta nuevamente.";
                msgStatus.style.color = "red";
            });
    });
}

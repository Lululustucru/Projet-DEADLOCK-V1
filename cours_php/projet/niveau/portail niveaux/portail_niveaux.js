const canvas = document.getElementById("portail_canvas");
const portalElement = document.querySelector(".portal-link");
const main = document.getElementById("main");
const flash = document.getElementById("flash-portail");

console.log("SCRIPT CHARGÉ");
console.log("canvas =", canvas);
console.log("portalElement =", portalElement);

if (!canvas || !portalElement || !main || !flash) {
  console.warn("Canvas, portail ou flash introuvable.");
} else {
  const ctx = canvas.getContext("2d");

  // --- PARTICULES --- //
  let particles = [];
  let lastTime = 0;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function getPortalCenter() {
    const portalRect = portalElement.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    return {
      x: portalRect.left - canvasRect.left + portalRect.width / 2,
      y: portalRect.top - canvasRect.top + portalRect.height * 0.55,
    };
  }

  function createParticle(intense = false) {
    const center = getPortalCenter();

    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = intense ? 200 : 120; // plus violent pour être BIEN visible
    const speed = baseSpeed + Math.random() * (intense ? 120 : 60);

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const life = intense
      ? 0.5 + Math.random() * 0.3
      : 0.9 + Math.random() * 0.4;

    particles.push({
      x: center.x,
      y: center.y,
      vx,
      vy,
      life,
      age: 0,
      size: intense ? 6 + Math.random() * 6 : 3 + Math.random() * 4,
      alphaStart: intense ? 1.2 : 0.9,
    });
  }

  function update(delta) {
    const dt = delta / 1000;

    // flux continu assez dense pour bien voir
    if (Math.random() < 0.35) {
      createParticle(false);
    }

    particles = particles.filter((p) => {
      p.age += dt;
      if (p.age > p.life) return false;

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      p.vx *= 0.985;
      p.vy *= 0.985;

      return true;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const t = p.age / p.life;
      const alpha = p.alphaStart * (1 - t);

      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size * 3
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      gradient.addColorStop(0.3, `rgba(170, 240, 255, ${alpha})`);
      gradient.addColorStop(1, "rgba(0, 200, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    update(delta);
    draw();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // --- ANIMATION CAMÉRA --- //
function animationcamera(duration = 500) {
  return new Promise((resolve) => {
    const start = performance.now();
    main.style.transformOrigin = "50% 50%";

    function etape(now) {
      const t = Math.min(1, (now - start) / duration);
      const ease = t * t;
      const rotate = ease * 6;
      const scale = 1 + ease * 1.8;

      // on laisse le zoom appliqué
      main.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

      if (t < 1) {
        requestAnimationFrame(etape);
      } else {
        // IMPORTANT : on NE touche PAS au transform ici
        resolve();
      }
    }

    requestAnimationFrame(etape);
  });
}


  // --- FLASH --- //
  function flash_portail() {
    flash.style.opacity = "1";
    setTimeout(() => {
      flash.style.opacity = "0";
    }, 400);
  }

  // --- INTERACTIONS --- //

  // survol : burst
  portalElement.addEventListener("mouseenter", () => {
    for (let i = 0; i < 40; i++) {
      createParticle(true);
    }
  });

  // clic : on bloque la nav, on joue l’anim, puis on redirige
portalElement.addEventListener("click", async (event) => {
  event.preventDefault();

  // gros burst de particules
  for (let i = 0; i < 120; i++) {
    createParticle(true);
  }

  // zoom + vortex
  await animationcamera(550);

  // flash pendant que l'écran est encore zoomé
  flash_portail();

  // quand le flash est presque fini, on reset + on change de page
  setTimeout(() => {
    main.style.transform = ""; // si tu restes sur la page
    window.location.href = portalElement.getAttribute("href");
    }, 220);
  });
}
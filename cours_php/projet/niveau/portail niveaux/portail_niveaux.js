const canvas = document.getElementById("portail_canvas");
const portalElement = document.querySelector(".portal-link");

console.log("SCRIPT CHARGÉ");
console.log("canvas =", canvas);
console.log("portalElement =", portalElement);

if (!canvas || !portalElement) {
console.warn("Canvas ou portail introuvable.");
}

if (!canvas || !portalElement) {
} else {
const ctx = canvas.getContext("2d");

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
    const baseSpeed = intense ? 120 : 70;
    const speed = baseSpeed + Math.random() * (intense ? 80 : 40);

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const life = intense
      ? 0.6 + Math.random() * 0.4
      : 1.0 + Math.random() * 0.5;

    particles.push({
    x: center.x,
    y: center.y,
    vx,
    vy,
    life,
    age: 0,
      size: intense ? 4 + Math.random() * 4 : 2 + Math.random() * 3,
    alphaStart: intense ? 1.0 : 0.75,
    });
}

function update(delta) {
    const dt = delta / 1000;

    if (Math.random() < 0.18) {
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
        p.size * 2.5
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    gradient.addColorStop(0.25, `rgba(180, 245, 255, ${alpha})`);
    gradient.addColorStop(1, "rgba(0, 200, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
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

portalElement.addEventListener("mouseenter", () => {
    for (let i = 0; i < 40; i++) {
    createParticle(true);
    }
});

portalElement.addEventListener("click", () => {
    for (let i = 0; i < 90; i++) {
    createParticle(true);
    }
});
}

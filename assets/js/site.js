// All outbound links live here. An empty value renders the control as "coming soon".
const LINKS = {
  game: "https://hopesurvival.com/",
  presskit: "https://hopesurvival.com/presskit/",
  steam: "",
  discord: "https://discord.gg/fuRWEf5U7d",
  trailer: "https://www.youtube.com/watch?v=NnqW2iyr3cw",
  youtube: "https://www.youtube.com/channel/UCL0GrbSQ1-tZCWuA8oVqLtw",
  email: "",
};

// Russian pages point at the Russian versions of the game site.
const RU = document.documentElement.lang === "ru";
const localized = (key, url) => {
  if (!RU || (key !== "game" && key !== "presskit")) return url;
  const u = new URL(url);
  u.pathname = `/ru${u.pathname}`;
  return u.href;
};

// Buttons and links marked data-link="<key>" take their href from LINKS.
document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.dataset.link;
  const url = LINKS[key];
  if (url) {
    el.href = key === "email" ? `mailto:${url}` : localized(key, url);
    if (key === "email") el.textContent = url;
    return;
  }
  el.removeAttribute("href");
  el.classList.add("is-pending");
  el.setAttribute("aria-disabled", "true");
  if (el.dataset.pending) el.textContent = el.dataset.pending;
});

// Header gets a background once the hero scrolls away.
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
if (header && hero) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-stuck", !entry.isIntersecting);
  }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
}

// Motion stays off with reduced motion; videos also stay on their posters on data-saver or slow links.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const connection = navigator.connection || {};
const lightMode = connection.saveData === true || /(^|-)2g$|^3g$/.test(connection.effectiveType || "");

// Hero water: rings on a dark surface, drawn as ellipses (circles seen at an angle).
// A drop falls under the logo every few seconds, light rain lands elsewhere, the pointer leaves
// small ripples and a click drops a big one. With reduced motion it is one still set of rings.
const water = document.querySelector("[data-water]");
if (hero && water && water.getContext) {
  const ctx = water.getContext("2d");
  const mark = document.querySelector(".hero-mark");
  const FLAT = 0.3;
  const rings = [];
  let w = 0;
  let h = 0;
  let source = { x: 0, y: 0 };
  let running = false;
  let last = 0;
  let nextDrop = 0;
  let nextRain = 0;

  // Ring colours come from the palette (--ring-1..3 in style.css).
  const css = getComputedStyle(document.documentElement);
  const TINTS = [1, 2, 3].map((i) => css.getPropertyValue(`--ring-${i}`).trim());
  const tint = () => TINTS[Math.floor(Math.random() * TINTS.length)];
  const add = (x, y, strength, reach, speed, color = tint()) => rings.push({ x, y, r: 0, strength, reach, speed, color });

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (const ring of rings) {
      if (ring.r <= 0) continue;
      const life = 1 - ring.r / ring.reach;
      const alpha = ring.strength * life * Math.min(1, ring.r / 16);
      ctx.strokeStyle = `rgba(${ring.color}, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, ring.r, ring.r * FLAT, 0, 0, Math.PI * 2);
      ctx.stroke();
      // A fainter ring just behind gives the wave some body.
      if (ring.r > 24) {
        ctx.strokeStyle = `rgba(${ring.color}, ${alpha * 0.35})`;
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, ring.r * 0.86, ring.r * 0.86 * FLAT, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const still = () => {
    rings.length = 0;
    const reach = Math.min(w * 0.5, 620);
    [0.12, 0.3, 0.5, 0.72, 0.94].forEach((k, i) => rings.push({ x: source.x, y: source.y, r: reach * k, strength: 0.9 - i * 0.12, reach: reach * 1.05, color: TINTS[i % TINTS.length] }));
    draw();
  };

  const layout = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = water.getBoundingClientRect();
    w = box.width;
    h = box.height;
    water.width = Math.round(w * dpr);
    water.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const m = mark && mark.getBoundingClientRect();
    source = m && m.width
      ? { x: m.left + m.width / 2 - box.left, y: m.bottom - box.top + Math.min(120, h * 0.13) }
      // No logo on narrow screens: the drop lands in the free space above the headline.
      : { x: w * 0.62, y: h * 0.15 };
    if (reducedMotion) still();
    else draw();
  };

  const tick = (now) => {
    if (!running) return;
    // rAF timestamps can trail performance.now() on the first frame; a negative step would shrink
    // a ring below zero, and ellipse() throws on a negative radius.
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (now > nextDrop) {
      add(source.x, source.y, 0.9, Math.min(w * 0.5, 620), 72);
      nextDrop = now + 2600 + Math.random() * 1000;
    }
    if (now > nextRain) {
      add(w * (0.06 + Math.random() * 0.88), h * (0.3 + Math.random() * 0.65), 0.3, 110 + Math.random() * 150, 46);
      nextRain = now + 700 + Math.random() * 1500;
    }
    for (let i = rings.length - 1; i >= 0; i -= 1) {
      const ring = rings[i];
      ring.r += ring.speed * dt * (1 - 0.55 * (ring.r / ring.reach));
      if (ring.r >= ring.reach * 0.98) rings.splice(i, 1);
    }
    draw();
    requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reducedMotion) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start();
    else running = false;
  }).observe(hero);

  if (!reducedMotion) {
    // The first drop lands right away, with a couple of rings already spreading.
    layout();
    add(source.x, source.y, 0.9, Math.min(w * 0.5, 620), 72);
    rings[rings.length - 1].r = Math.min(w * 0.5, 620) * 0.45;
    add(source.x, source.y, 0.9, Math.min(w * 0.5, 620), 72);
    rings[rings.length - 1].r = Math.min(w * 0.5, 620) * 0.15;
    nextDrop = performance.now() + 1800;

    let lastMove = { x: -999, y: -999, t: 0 };
    const local = (e) => {
      const box = water.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };
    hero.addEventListener("pointermove", (e) => {
      const p = local(e);
      const now = performance.now();
      if (Math.hypot(p.x - lastMove.x, p.y - lastMove.y) > 46 && now - lastMove.t > 70) {
        add(p.x, p.y, 0.32, 120, 60);
        lastMove = { ...p, t: now };
      }
    });
    hero.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a, button")) return;
      const p = local(e);
      add(p.x, p.y, 0.95, 420, 90);
    });
  }

  let pending = false;
  window.addEventListener("resize", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; layout(); });
  });
  if (mark && !mark.complete) mark.addEventListener("load", layout, { once: true });
  window.addEventListener("load", layout, { once: true });
  layout();
}

// Game card: the thumbnails switch the big view between the trailer loop and screenshots.
document.querySelectorAll("[data-gallery]").forEach((card) => {
  const video = card.querySelector("[data-gallery-video]");
  const still = card.querySelector("[data-gallery-still]");
  const thumbs = [...card.querySelectorAll("[data-shot]")];
  thumbs.forEach((thumb) => thumb.addEventListener("click", () => {
    thumbs.forEach((t) => t.setAttribute("aria-pressed", String(t === thumb)));
    const src = thumb.dataset.shot;
    if (!src) {
      still.hidden = true;
      video.hidden = false;
      if (!reducedMotion && !lightMode) video.play().catch(() => {});
      return;
    }
    still.src = src;
    still.alt = thumb.querySelector("img").alt;
    still.hidden = false;
    video.pause();
    video.hidden = true;
  }));
});

// Videos marked data-autoplay play only while on screen.
const videos = [...document.querySelectorAll("video[data-autoplay]")];
if (videos.length && !reducedMotion && !lightMode) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.15 });
  videos.forEach((v) => observer.observe(v));
}

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

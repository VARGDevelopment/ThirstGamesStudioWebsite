// All outbound links live here. An empty value renders the control as "coming soon".
const LINKS = {
  game: "https://vargdevelopment.github.io/HOPESurvivalWebsite/",
  presskit: "https://vargdevelopment.github.io/HOPESurvivalWebsite/presskit/",
  steam: "",
  discord: "https://discord.gg/fuRWEf5U7d",
  trailer: "https://www.youtube.com/watch?v=NnqW2iyr3cw",
  email: "",
};

// Russian pages point at the Russian versions of the game site.
const RU = document.documentElement.lang === "ru";
const localized = (key, url) => (RU && (key === "game" || key === "presskit") ? url.replace(/HOPESurvivalWebsite\//, "HOPESurvivalWebsite/ru/") : url);

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

document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

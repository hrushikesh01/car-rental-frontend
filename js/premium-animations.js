// ============================
// PREMIUM SCROLL ANIMATIONS (RUN ONCE)
// ============================

const animatedElements = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {

        // stagger effect
        entry.target.style.transitionDelay = `${index * 0.08}s`;
        entry.target.classList.add("show");

        // run only once
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  }
);

animatedElements.forEach(el => observer.observe(el));

// ============================
// PREMIUM CARD INTERACTION (SAFE)
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".premium-card");

  if (!cards.length) return;

  // Disable on touch devices
  if ("ontouchstart" in window) return;

  cards.forEach(card => {

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--x", `${x}%`);
      card.style.setProperty("--y", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--x", "50%");
      card.style.setProperty("--y", "50%");
    });

  });
});

// ============================
// NAVBAR SCROLL POLISH
// ============================

const navbar = document.querySelector(".premium-navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add("nav-scrolled");
    } else {
      navbar.classList.remove("nav-scrolled");
    }
  });
}
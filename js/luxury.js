document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // 1. AUTO IMAGE SWAP ON HOVER (IMPROVED)
  // =====================================
  const cardImages = document.querySelectorAll(".luxury-card img");

  cardImages.forEach(img => {
    const imagesAttr = img.getAttribute("data-images");
    if (!imagesAttr) return;

    const images = imagesAttr.split(",").map(src => src.trim());
    let index = 0;
    let interval = null;

    // smooth transition
    const offset = Math.min(scrollY * speed, 20); // ⬅ max 20px movement
    img.style.transform = `translateY(${offset}px) scale(1.04)`;

    img.addEventListener("mouseenter", () => {
      if (interval) return;

      interval = setInterval(() => {
        index = (index + 1) % images.length;
        img.style.opacity = "0";

        setTimeout(() => {
          img.src = images[index];
          img.style.opacity = "1";
        }, 300);
      }, 1600);
    });

    img.addEventListener("mouseleave", () => {
      clearInterval(interval);
      interval = null;
      index = 0;
      img.style.opacity = "0";

      setTimeout(() => {
        img.src = images[0];
        img.style.opacity = "1";
      }, 300);
    });
  });

  // =====================================
  // 2. SCROLL REVEAL (LUXURY FEEL)
  // =====================================
  const revealItems = document.querySelectorAll(
    ".luxury-welcome, .luxury-featured, .luxury-card, .luxury-about"
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal", "active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealItems.forEach(item => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });

  // =====================================
  // 3. STAGGERED CARD ENTRY (PREMIUM)
  // =====================================
  const luxuryCards = document.querySelectorAll(".luxury-card");

  luxuryCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.12}s`;
  });

  // =====================================
  // 4. SUBTLE PARALLAX ON SCROLL (IMAGES)
  // =====================================
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    luxuryCards.forEach(card => {
      const img = card.querySelector("img");
      if (!img) return;

      const speed = card.classList.contains("luxury-main") ? 0.04 : 0.02;
      img.style.transform = `translateY(${scrollY * speed}px) scale(1.04)`;
    });
  });

});
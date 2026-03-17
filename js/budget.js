// ============================
// BUDGET PAGE – AVAILABILITY + ANIMATIONS
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // 1. AVAILABILITY CHECK
  // ============================

  const buttons = document.querySelectorAll(".book-btn");

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  buttons.forEach(button => {
    const carKey = button.dataset.car;
    const carType = button.dataset.type;

    const available = isCarAvailable(
      carKey,
      carType,
      formatDate(today),
      formatDate(tomorrow)
    );

    if (!available) {
      button.textContent = "Not Available";
      button.style.pointerEvents = "none";
      button.style.opacity = "0.5";
      button.style.background = "#999";
    }
  });

  // ============================
  // 2. CARD SCROLL ANIMATION
  // ============================

  const cards = document.querySelectorAll(".budget-card");

  const cardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";
          entry.target.style.transitionDelay = `${index * 0.08}s`;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    cardObserver.observe(card);
  });

  // ============================
  // 3. CARD HOVER LIFT
  // ============================

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 30px 80px rgba(0,0,0,0.15)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.08)";
    });
  });

  // ============================
  // 4. BUTTON PRESS FEEL
  // ============================

  buttons.forEach(btn => {
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.96)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });

  // ============================
  // 5. VIEW ALL CARS GLOW
  // ============================

  const viewAllBtn = document.querySelector(".view-all-btn");

  if (viewAllBtn) {
    viewAllBtn.addEventListener("mouseenter", () => {
      viewAllBtn.style.boxShadow =
        "0 0 0 6px rgba(31,111,235,0.15)";
    });

    viewAllBtn.addEventListener("mouseleave", () => {
      viewAllBtn.style.boxShadow = "none";
    });
  }

});
document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     GET CAR KEY FROM URL
  =============================== */
  const params = new URLSearchParams(window.location.search);
  let carKey = params.get("car");

  const keyAliases = {
    evoque: "rangeroverevoque",
    benzgla: "mercedesgla",
    benzglb: "mercedesglb"
  };
  if (keyAliases[carKey]) carKey = keyAliases[carKey];

  /* ===============================
     CAR DATA
  =============================== */
  const cars = {
    porsche911: { name: "Porsche 911", images: 3 },
    rollsroyce: { name: "Rolls-Royce Ghost", images: 3 },
    droptail: {
    name: "Rolls-Royce La Rose Noire Droptail",
    images: 3
  },
    audiq3: { name: "Audi Q3", images: 3 },
    volvoxc40: { name: "Volvo XC40", images: 3 },
    lexusnx: { name: "Lexus NX", images: 3 },
    minicountryman: { name: "Mini Countryman", images: 3 },
    mercedesgla: { name: "Mercedes-Benz GLA", images: 3 },
    mercedesglb: { name: "Mercedes-Benz GLB", images: 3 },
    genesisgv70: { name: "Genesis GV70", images: 3 },
    rangeroverevoque: { name: "Range Rover Evoque", images: 3 },
    acurardx: { name: "Acura RDX", images: 3 }
  };

  if (!carKey || !cars[carKey]) {
    window.location.href = "luxury.html";
    return;
  }

  /* ===============================
     ELEMENTS
  =============================== */
  const heroImage   = document.getElementById("heroImage");
  const galleryImage = document.getElementById("galleryImage");
  const carName     = document.getElementById("carName");
  const carTagline  = document.getElementById("carTagline");
  const carSpecs    = document.getElementById("carSpecs");
  const bookBtn     = document.getElementById("bookBtn");

  /* ===============================
     IMAGES
  =============================== */
  const base = `media/cars/luxury/${carKey}-`;
  const images = [];

  for (let i = 1; i <= cars[carKey].images; i++) {
    images.push(`${base}${i}.jpg`);
  }

  /* ===============================
     PRELOAD IMAGES (NO FLASH)
  =============================== */
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  /* ===============================
     INITIAL CONTENT
  =============================== */
  heroImage.style.opacity = 0;
  galleryImage.style.opacity = 0;

  heroImage.src = images[0];
  galleryImage.src = images[0];

  carName.textContent = cars[carKey].name;
  carTagline.textContent = "Luxury redefined for modern journeys.";

  /* ===============================
     HERO FADE-IN
  =============================== */
  setTimeout(() => {
    heroImage.style.transition = "opacity 1.2s ease";
    heroImage.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    galleryImage.style.transition = "opacity 1.2s ease";
    galleryImage.style.opacity = 1;
  }, 300);

  /* ===============================
     SPECS (STAGGER ANIMATION)
  =============================== */
  const specs = ["Automatic", "Luxury Interior", "Premium Segment"];
  carSpecs.innerHTML = "";

  specs.forEach((text, index) => {
    const li = document.createElement("li");
    li.textContent = text;
    li.style.opacity = 0;
    li.style.transform = "translateY(10px)";
    carSpecs.appendChild(li);

    setTimeout(() => {
      li.style.transition = "all 0.6s ease";
      li.style.opacity = 1;
      li.style.transform = "translateY(0)";
    }, 400 + index * 200);
  });

  /* ===============================
     GALLERY AUTO SLIDER
  =============================== */
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;

    galleryImage.style.opacity = 0;

    setTimeout(() => {
      galleryImage.src = images[currentIndex];
      galleryImage.style.opacity = 1;
    }, 400);

  }, 4000);

  /* ===============================
     BOOK BUTTON INTERACTION
  =============================== */
  bookBtn.addEventListener("mouseenter", () => {
    bookBtn.style.transform = "scale(1.05)";
  });

  bookBtn.addEventListener("mouseleave", () => {
    bookBtn.style.transform = "scale(1)";
  });

  bookBtn.addEventListener("click", () => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";

  // click animation
  bookBtn.style.transform = "scale(0.95)";
  setTimeout(() => bookBtn.style.transform = "scale(1)", 150);

  if (!loggedIn) {
    // save where user came from
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "login.html";
    return;
  }

  // ✅ already logged in → go to booking page
  window.location.href = `booking-luxury.html?car=${carKey}`;
});

});
// ============================
// READ URL PARAMETER (SAFE)
// ============================
const params = new URLSearchParams(window.location.search);
let carKey = params.get("car");

if (!carKey) {
  alert("No car selected");
  window.location.href = "premium.html";
}

carKey = carKey ? carKey.toLowerCase() : "";

// ============================
// PREMIUM CAR DATA (MASTER LIST)
// ============================
const cars = {
  fortuner: {
    name: "Toyota Fortuner",
    price: 6999,
    image: "media/cars/premium/fortuner-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  bmw3: {
    name: "BMW 3 Series",
    price: 7999,
    image: "media/cars/premium/bmw3-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  bmw5: {
    name: "BMW 5 Series",
    price: 9999,
    image: "media/cars/premium/bmw5-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  benzc: {
    name: "Mercedes C-Class",
    price: 8499,
    image: "media/cars/premium/benzC-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  benze: {
    name: "Mercedes E-Class",
    price: 10999,
    image: "media/cars/premium/benzE-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  audia4: {
    name: "Audi A4",
    price: 8999,
    image: "media/cars/premium/audiA4-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  audia6: {
    name: "Audi A6",
    price: 11499,
    image: "media/cars/premium/audiA6-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  rangerovervelar: {
    name: "Range Rover Velar",
    price: 14999,
    image: "media/cars/premium/rangeRoverVelar-side.jpg",
    specs: ["Diesel", "Automatic", "5 Seater"]
  },
  defender: {
    name: "Land Rover Defender",
    price: 15999,
    image: "media/cars/premium/defender-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  landcruiser: {
    name: "Toyota Land Cruiser",
    price: 16999,
    image: "media/cars/premium/landCruiser-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  kiacarnival: {
    name: "Kia Carnival",
    price: 6499,
    image: "media/cars/premium/kiaCarnival-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  jeeprubicon: {
    name: "Jeep Wrangler Rubicon",
    price: 12999,
    image: "media/cars/premium/jeepRubicon-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  volvoxc60: {
    name: "Volvo XC60",
    price: 9499,
    image: "media/cars/premium/volvoXC60-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  lexuses: {
    name: "Lexus ES",
    price: 10499,
    image: "media/cars/premium/lexusES-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  },
  jaguarxf: {
    name: "Jaguar XF",
    price: 9999,
    image: "media/cars/premium/jaguarXF-side.jpg",
    specs: ["Petrol", "Automatic", "5 Seater"]
  }
};

// ============================
// VALIDATION
// ============================
if (!cars[carKey]) {
  alert("Car not found");
  window.location.href = "premium.html";
}

// ============================
// POPULATE PAGE
// ============================
const car = cars[carKey];

const carImage = document.getElementById("carImage");
const carName = document.getElementById("carName");
const carPrice = document.getElementById("carPrice");
const specsList = document.getElementById("carSpecs");
const bookBtn = document.getElementById("bookBtn");

carImage.src = car.image;
carName.textContent = car.name;
carPrice.textContent = `₹${car.price} / day`;

specsList.innerHTML = "";
car.specs.forEach((spec, index) => {
  const li = document.createElement("li");
  li.textContent = spec;
  li.classList.add("animate");
  li.style.transitionDelay = `${index * 0.1}s`;
  specsList.appendChild(li);
});

// ============================
// PAGE LOAD ANIMATIONS
// ============================
window.addEventListener("load", () => {
  document.querySelector(".premium-image")?.classList.add("animate", "show");
  document.querySelector(".premium-info")?.classList.add("animate", "show");

  document.querySelectorAll(".specs li").forEach(li => {
    requestAnimationFrame(() => li.classList.add("show"));
  });
});

// ============================
// BOOK BUTTON LOGIC
// ============================
bookBtn.addEventListener("click", e => {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    e.preventDefault();
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "login.html";
    return;
  }

  window.location.href = `booking-premium.html?car=${carKey}`;
});

// ============================
// BACK BUTTON SMART NAVIGATION
// ============================

const backBtn = document.querySelector(".back-btn");

if (backBtn) {
  backBtn.addEventListener("click", e => {
    e.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "premium.html";
    }
  });
}
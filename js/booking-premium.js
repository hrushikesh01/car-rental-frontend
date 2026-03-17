// ===============================
// PROTECT PAGE (LOGIN CHECK)
// ===============================
const isLoggedIn = localStorage.getItem("isLoggedIn");
if (!isLoggedIn || !localStorage.getItem("authToken")) {
  const currentURL = window.location.href;
  localStorage.setItem("redirectAfterLogin", currentURL);
  window.location.href = "login.html";
}

// ============================
// READ URL PARAMS
// Supports:
// - booking-premium.html?carId=<uuid>
// - booking-premium.html?car=<key>
// ============================
const params = new URLSearchParams(window.location.search);
let carId = params.get("carId");
const carKeyRaw = params.get("car");
const carKey = carKeyRaw ? carKeyRaw.toLowerCase() : "";

const carNameEl = document.getElementById("carName");
const carPriceEl = document.getElementById("carPrice");
let car = null;

async function loadCar() {
  const cars = await apiGetCars("premium");

  const keyToName = {
    fortuner: "Toyota Fortuner",
    bmw3: "BMW 3 Series",
    bmw5: "BMW 5 Series",
    benzc: "Mercedes C-Class",
    benze: "Mercedes E-Class",
    audia4: "Audi A4",
    audia6: "Audi A6",
    rangerovervelar: "Range Rover Velar",
    defender: "Land Rover Defender",
    landcruiser: "Toyota Land Cruiser",
    kiacarnival: "Kia Carnival",
    jeeprubicon: "Jeep Wrangler Rubicon",
    volvoxc60: "Volvo XC60",
    lexuses: "Lexus ES",
    jaguarxf: "Jaguar XF",
  };

  if (!carId && carKey) {
    const expectedName = keyToName[carKey];
    car = expectedName ? cars.find(c => c.name === expectedName) : null;
    if (car) carId = car.id;
  } else if (carId) {
    car = cars.find(c => c.id === carId);
  }

  if (!car) {
    window.showToast?.("Unable to load car details.", "error");
    window.location.href = "premium.html";
    return;
  }

  carNameEl.textContent = car.name;
  carPriceEl.textContent = `₹${car.price_per_day} / day`;
}

loadCar().catch(err => {
  console.error(err);
  window.showToast?.("Unable to load car details.", "error");
  window.location.href = "premium.html";
});

// ============================
// ELEMENTS
// ============================
const pickup = document.getElementById("pickupDate");
const drop = document.getElementById("dropDate");
const daysEl = document.getElementById("days");
const totalEl = document.getElementById("total");
const confirmBtn = document.getElementById("confirmBtn");

const deliveryRadios = document.querySelectorAll("input[name='delivery']");
const addressBox = document.getElementById("addressBox");

// ============================
// PAGE LOAD ANIMATION
// ============================
window.addEventListener("load", () => {
  document.querySelectorAll(
    ".booking-card, .booking-form, .delivery-box, .price-box, .confirm-btn"
  ).forEach((el, index) => {
    el.classList.add("animate");
    el.style.transitionDelay = `${index * 0.1}s`;
    requestAnimationFrame(() => el.classList.add("show"));
  });
});

// ============================
// DELIVERY TOGGLE (SMOOTH)
// ============================
deliveryRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "home" && radio.checked) {
      addressBox.style.display = "block";
      addressBox.classList.add("animate");
      requestAnimationFrame(() => addressBox.classList.add("show"));
    } else {
      addressBox.classList.remove("show");
      setTimeout(() => {
        addressBox.style.display = "none";
      }, 300);
    }
    calculateTotal();
  });
});

// ============================
// DATE CHANGE
// ============================
pickup.addEventListener("change", calculateTotal);
drop.addEventListener("change", calculateTotal);

// ============================
// PRICE CALCULATION (SMOOTH UPDATE)
// ============================
function calculateTotal() {
  if (!pickup.value || !drop.value) return;

  const start = new Date(pickup.value);
  const end = new Date(drop.value);
  const diff = (end - start) / (1000 * 60 * 60 * 24);

  if (diff <= 0) return;

  if (!car) return;

  const basePrice = diff * car.price_per_day;
  const deliveryCharge =
    document.querySelector("input[name='delivery']:checked").value === "home"
      ? 1000
      : 0;

  daysEl.textContent = diff;

  // smooth total update
  totalEl.classList.remove("show");
  setTimeout(() => {
    totalEl.textContent = `₹${basePrice + deliveryCharge}`;
    totalEl.classList.add("show");
  }, 120);
}

// ============================
// CONFIRM BOOKING
// ============================
confirmBtn.addEventListener("click", async () => {
  if (!pickup.value || !drop.value) {
    window.showToast?.("Please select pickup and drop dates.", "info");
    return;
  }

  if (!car || !carId) {
    window.showToast?.("Car details not loaded yet.", "info");
    return;
  }

  if (new Date(drop.value) <= new Date(pickup.value)) {
    window.showToast?.("Drop date must be after pickup date.", "info");
    return;
  }

  const deliveryType =
    document.querySelector("input[name='delivery']:checked").value;

  if (deliveryType === "home") {
    const address = document.getElementById("address").value.trim();
    if (!address) {
      window.showToast?.("Please enter delivery address.", "info");
      return;
    }
  }

  // subtle feedback
  confirmBtn.textContent = "Processing...";
  confirmBtn.disabled = true;

  try {
    await apiCreateBooking({
      carId,
      pickupDate: pickup.value,
      dropDate: drop.value,
      deliveryOption: deliveryType === "home" ? "home" : "showroom",
      address: deliveryType === "home" ? document.getElementById("address").value.trim() : null,
    });

    localStorage.setItem("successCar", car.name);
    localStorage.setItem("successPickup", pickup.value);
    localStorage.setItem("successDrop", drop.value);
    localStorage.setItem(
      "successLocation",
      deliveryType === "home" ? "Home Delivery" : "Pickup at Showroom"
    );

    window.location.href = "booking-success-premium.html";
  } catch (err) {
    confirmBtn.textContent = "Confirm Booking";
    confirmBtn.disabled = false;
    const msg = err.message || "Booking failed";
    if (/not available/i.test(msg)) {
      window.showToast?.("This car is already booked for the selected dates. Try different dates.", "error", "Not available");
    } else {
      window.showToast?.(msg, "error");
    }
  }
});
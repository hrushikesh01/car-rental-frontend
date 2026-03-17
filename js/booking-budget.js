// ===============================
// PROTECT PAGE (LOGIN CHECK)
// ===============================

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (!isLoggedIn || !localStorage.getItem("authToken")) {
  const currentURL = window.location.href;
  localStorage.setItem("redirectAfterLogin", currentURL);
  window.location.href = "login.html";
}

// ===============================
// LOAD SELECTED CAR (FROM API)
// ===============================

const params = new URLSearchParams(window.location.search);
let carId = params.get("carId");
const carKey = params.get("car");

let car = null;

async function loadCar() {
  try {
    const cars = await apiGetCars("budget");
    const keyToName = {
      swift: "Swift",
      nexon: "Nexon",
      punch: "Punch",
      xuv700: "XUV700",
      xuv300: "XUV300",
      mghector: "MG Hector Plus",
      innova: "Innova Crysta",
      thar: "Thar",
      hilux: "Hilux",
      creta: "Creta",
    };

    if (!carId && carKey) {
      const expectedName = keyToName[carKey.toLowerCase()];
      car = expectedName ? cars.find(c => c.name === expectedName) : null;
      if (car) carId = car.id;
    } else {
      car = cars.find(c => c.id === carId);
    }

    if (!car) {
      window.location.href = "budget-all-cars.html";
      return;
    }

    document.getElementById("bookingCarImage").src = car.image_url || "";
    document.getElementById("bookingCarName").textContent = car.name;
    document.getElementById("bookingCarPrice").textContent = `₹${car.price_per_day} / day`;

    const specsList = document.getElementById("bookingCarSpecs");
    specsList.innerHTML = "";
    (car.specs || []).forEach(spec => {
      const li = document.createElement("li");
      li.textContent = spec;
      specsList.appendChild(li);
    });
  } catch (err) {
    window.showToast?.("Unable to load car details.", "error");
    console.error(err);
    window.location.href = "budget-all-cars.html";
  }
}

loadCar();

// ===============================
// DATE + DELIVERY CALCULATION
// ===============================

const pickupInput = document.getElementById("pickupDate");
const dropInput = document.getElementById("dropDate");
const totalDaysEl = document.getElementById("totalDays");
const totalPriceEl = document.getElementById("totalPrice");
const deliveryOptions = document.querySelectorAll("input[name='delivery']");

function calculateTotal() {
  const pickup = new Date(pickupInput.value);
  const drop = new Date(dropInput.value);

  if (!pickupInput.value || !dropInput.value || drop <= pickup) {
    totalDaysEl.textContent = 0;
    totalPriceEl.textContent = 0;
    return;
  }

  const diffTime = drop - pickup;
  const days = diffTime / (1000 * 60 * 60 * 24);

  let deliveryCharge = 0;
  deliveryOptions.forEach(option => {
    if (option.checked) {
      deliveryCharge = parseInt(option.value);
    }
  });

  if (!car) return;

  const pricePerDay = car.price_per_day || car.pricePerDay;
  const total = (days * pricePerDay) + deliveryCharge;

  totalDaysEl.textContent = days;
  totalPriceEl.textContent = total;
}

pickupInput.addEventListener("change", calculateTotal);
dropInput.addEventListener("change", calculateTotal);
deliveryOptions.forEach(option => {
  option.addEventListener("change", calculateTotal);
});

// ===============================
// CONFIRM BOOKING (CALL BACKEND)
// ===============================

document.getElementById("bookingForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!pickupInput.value || !dropInput.value) {
    window.showToast?.("Please select pickup and drop date.", "info");
    return;
  }

  if (!car) {
    window.showToast?.("Car details not loaded yet.", "info");
    return;
  }

  let deliveryOption = "showroom";
  let deliveryText = "Pickup at Showroom";
  deliveryOptions.forEach(option => {
    if (option.checked && option.value !== "0") {
      deliveryOption = "home";
      deliveryText = "Home Delivery";
    }
  });

  try {
    await apiCreateBooking({
      carId,
      pickupDate: pickupInput.value,
      dropDate: dropInput.value,
      deliveryOption,
      address: deliveryOption === "home"
        ? (localStorage.getItem("userAddress") || "Home Delivery Address")
        : null
    });

    // Save booking details locally for success page display
    localStorage.setItem("successCar", car.name);
    localStorage.setItem("successPickup", pickupInput.value);
    localStorage.setItem("successDrop", dropInput.value);
    localStorage.setItem("successLocation", deliveryText);

    window.location.href = "booking-success-budget.html";
  } catch (err) {
    const msg = err.message || "Booking failed";
    if (/not available/i.test(msg)) {
      window.showToast?.("This car is already booked for the selected dates. Try different dates.", "error", "Not available");
    } else {
      window.showToast?.(msg, "error");
    }
  }
});
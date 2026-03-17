document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // PROTECT PAGE (LOGIN CHECK)
  // ===============================
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn || !localStorage.getItem("authToken")) {
    const currentURL = window.location.href;
    localStorage.setItem("redirectAfterLogin", currentURL);
    window.location.href = "login.html";
    return;
  }

  /* ===============================
     GET CAR FROM URL
  =============================== */
  const params = new URLSearchParams(window.location.search);
  let carId = params.get("carId");
  const carKey = params.get("car");

  const cars = {
    porsche911: { name: "Porsche 911", price: 25000 },
    rollsroyce: { name: "Rolls-Royce Ghost", price: 30000 },
    droptail: {
  name: "Rolls-Royce La Rose Noire Droptail",
  price: 50000
},
    audiq3: { name: "Audi Q3", price: 12000 },
    volvoxc40: { name: "Volvo XC40", price: 11000 },
    lexusnx: { name: "Lexus NX", price: 13000 },
    minicountryman: { name: "Mini Countryman", price: 10000 },
    mercedesgla: { name: "Mercedes-Benz GLA", price: 12000 },
    mercedesglb: { name: "Mercedes-Benz GLB", price: 14000 },
    genesisgv70: { name: "Genesis GV70", price: 15000 },
    rangeroverevoque: { name: "Range Rover Evoque", price: 16000 },
    acurardx: { name: "Acura RDX", price: 14000 }
  };

  let car = null;

  async function loadCar() {
    const list = await apiGetCars("luxury");
    if (carId) {
      car = list.find(c => c.id === carId);
    } else if (carKey && cars[carKey]) {
      const expectedName = cars[carKey].name;
      car = list.find(c => c.name === expectedName);
      if (car) carId = car.id;
    }

    if (!car) {
      window.location.href = "luxury.html";
      return;
    }

    /* ===============================
       SET CAR INFO
    =============================== */
    carNameEl.textContent = car.name;
    carImageEl.src = car.image_url || `media/cars/luxury/${carKey}-1.jpg`;
  }

  /* ===============================
     ELEMENTS
  =============================== */
  const carNameEl   = document.getElementById("carName");
  const carImageEl  = document.getElementById("carImage");
  const pickupDate  = document.getElementById("pickupDate");
  const dropDate    = document.getElementById("dropDate");
  const totalDaysEl = document.getElementById("totalDays");
  const totalPriceEl = document.getElementById("totalPrice");
  const addressBox  = document.getElementById("addressBox");
  const confirmBtn  = document.getElementById("confirmBooking");

  const deliveryRadios = document.querySelectorAll(
    'input[name="delivery"]'
  );

  loadCar().catch(err => {
    console.error(err);
    window.location.href = "luxury.html";
  });

  /* ===============================
     DELIVERY TOGGLE
  =============================== */
  function updateDelivery() {
    const selected = document.querySelector(
      'input[name="delivery"]:checked'
    ).value;

    addressBox.style.display =
      selected === "home" ? "block" : "none";

    calculatePrice();
  }

  deliveryRadios.forEach(radio => {
    radio.addEventListener("change", updateDelivery);
  });

  /* ===============================
     DATE & PRICE CALCULATION
  =============================== */
  function calculatePrice() {
    const start = new Date(pickupDate.value);
    const end   = new Date(dropDate.value);

    if (!pickupDate.value || !dropDate.value || end <= start) {
      totalDaysEl.textContent = "0";
      totalPriceEl.textContent = "₹0";
      return;
    }

    const diffTime = end - start;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!car) return;
    let price = days * car.price_per_day;

    const deliveryType = document.querySelector(
      'input[name="delivery"]:checked'
    ).value;

    if (deliveryType === "home") {
      price += 2000;
    }

    totalDaysEl.textContent = days;
    totalPriceEl.textContent = `₹${price.toLocaleString("en-IN")}`;
  }

  pickupDate.addEventListener("change", calculatePrice);
  dropDate.addEventListener("change", calculatePrice);

  /* ===============================
     CONFIRM BOOKING
  =============================== */
  confirmBtn.addEventListener("click", () => {

  if (!pickupDate.value || !dropDate.value) {
    window.showToast?.("Please select pickup and drop dates.", "info");
    return;
  }

  if (new Date(dropDate.value) <= new Date(pickupDate.value)) {
    window.showToast?.("Drop date must be after pickup date.", "info");
    return;
  }

  const deliveryType = document.querySelector(
    'input[name="delivery"]:checked'
  ).value;

  if (deliveryType === "home") {
    const address = addressBox.querySelector("textarea").value.trim();
    if (!address) {
      window.showToast?.("Please enter delivery address.", "info");
      return;
    }
  }

  if (!car || !carId) {
    window.showToast?.("Car details not loaded yet.", "info");
    return;
  }

  (async () => {
    try {
      await apiCreateBooking({
        carId,
        pickupDate: pickupDate.value,
        dropDate: dropDate.value,
        deliveryOption: deliveryType === "home" ? "home" : "showroom",
        address: deliveryType === "home" ? addressBox.querySelector("textarea").value.trim() : null,
      });

      localStorage.setItem("successCar", car.name);
      localStorage.setItem("successPickup", pickupDate.value);
      localStorage.setItem("successDrop", dropDate.value);
      localStorage.setItem(
        "successLocation",
        deliveryType === "home" ? "Home Delivery" : "Pickup at Showroom"
      );

      window.location.href = "booking-success-luxury.html";
    } catch (err) {
      const msg = err.message || "Booking failed";
      if (/not available/i.test(msg)) {
        window.showToast?.("This car is already booked for the selected dates. Try different dates.", "error", "Not available");
      } else {
        window.showToast?.(msg, "error");
      }
    }
  })();
});

});
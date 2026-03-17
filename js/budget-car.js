// ===============================
// BUDGET CAR DETAILS PAGE
// ===============================

// 1. Read URL parameter
const params = new URLSearchParams(window.location.search);
const carKey = params.get("car");

// 2. Budget car data (mini database)
const cars = {
  swift: {
    name: "Swift",
    price: "₹2,199 / day",
    image: "media/cars/budget/swift-side.jpg",
    specs: ["Petrol", "Manual", "5 Seater"]
  },
  nexon: {
    name: "Nexon",
    price: "₹3,499 / day",
    image: "media/cars/budget/nexon-side.jpg",
    specs: ["Diesel", "Manual", "5 Seater"]
  },
  punch: {
    name: "Punch",
    price: "₹2,999 / day",
    image: "media/cars/budget/punch-side.jpg",
    specs: ["Petrol", "Manual", "5 Seater"]
  },
  xuv700: {
    name: "XUV700",
    price: "₹4,999 / day",
    image: "media/cars/budget/xuv700-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  xuv300: {
    name: "XUV300",
    price: "₹6,999 / day",
    image: "media/cars/budget/xuv300-side.jpg",
    specs: ["Diesel", "Automatic", "7 Seater"]
  },
  mghector: {
    name: "MG Hector Plus",
    price: "₹5,999 / day",
    image: "media/cars/budget/mghector-side.jpg",
    specs: ["Petrol", "Automatic", "6 Seater"]
  },
  innova: {
    name: "Innova Crysta",
    price: "₹6,499 / day",
    image: "media/cars/budget/innova-side.jpg",
    specs: ["Diesel", "Manual", "7 Seater"]
  },
  thar: {
    name: "Thar",
    price: "₹5,499 / day",
    image: "media/cars/budget/thar-side.jpg",
    specs: ["Diesel", "Manual", "4 Seater"]
  },
  hilux: {
    name: "Hilux",
    price: "₹6,999 / day",
    image: "media/cars/budget/hilux-side.jpg",
    specs: ["Diesel", "Manual", "5 Seater"]
  },
  creta: {
    name: "Creta",
    price: "₹7,499 / day",
    image: "media/cars/budget/creta-side.jpg",
    specs: ["Diesel", "Automatic", "5 Seater"]
  }
};

// 3. Invalid car → redirect
if (!cars[carKey]) {
  window.location.href = "budget-all-cars.html";
}

// 4. Populate car details
document.getElementById("carImage").src = cars[carKey].image;
document.getElementById("carName").textContent = cars[carKey].name;
document.getElementById("carPrice").textContent = cars[carKey].price;

const specsList = document.getElementById("carSpecs");
specsList.innerHTML = "";

cars[carKey].specs.forEach(spec => {
  const li = document.createElement("li");
  li.textContent = spec;
  specsList.appendChild(li);
});

// ===============================
// BOOK BUTTON LOGIN CHECK + FIXED REDIRECT
// ===============================

const bookBtn = document.getElementById("bookBtn");

bookBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const bookingURL = `booking-budget.html?car=${carKey}`;

  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", bookingURL);
    window.location.href = "login.html";
    return;
  }

  window.location.href = bookingURL;
});
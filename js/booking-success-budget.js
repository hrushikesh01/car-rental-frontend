// ===============================
// LOAD BOOKING SUCCESS DATA
// ===============================

const car = localStorage.getItem("successCar");
const pickup = localStorage.getItem("successPickup");
const drop = localStorage.getItem("successDrop");
const delivery = localStorage.getItem("successLocation");

// 🚨 If no booking data → redirect
if (!car || !pickup || !drop) {
  window.location.href = "budget-all-cars.html";
}

// ===============================
// FORMAT DATE FUNCTION
// ===============================

function formatDate(dateString) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

// ===============================
// INJECT DATA INTO PAGE
// ===============================

document.getElementById("successCar").textContent = car;
document.getElementById("successPickup").textContent = formatDate(pickup);
document.getElementById("successDrop").textContent = formatDate(drop);
document.getElementById("successLocation").textContent =
  delivery || "Pickup at Showroom";

// ===============================
// OPTIONAL: CLEAR AFTER 5 SEC
// ===============================

setTimeout(() => {
  localStorage.removeItem("successCar");
  localStorage.removeItem("successPickup");
  localStorage.removeItem("successDrop");
  localStorage.removeItem("successLocation");
}, 5000);
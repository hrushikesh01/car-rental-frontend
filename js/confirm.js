// ============================
// LOAD BOOKING DATA
// ============================
const data = JSON.parse(localStorage.getItem("bookingData"));

if (!data) {
  alert("No booking data found");
  window.location.href = "budget.html";
}

// ============================
// POPULATE PAGE
// ============================
document.getElementById("carName").textContent = data.carName;
document.getElementById("carType").textContent = data.carType.toUpperCase();

document.getElementById("pickup").textContent = data.pickup;
document.getElementById("drop").textContent = data.drop;
document.getElementById("days").textContent = data.days;

document.getElementById("pricePerDay").textContent = data.pricePerDay;
document.getElementById("delivery").textContent = data.delivery;
document.getElementById("total").textContent = data.total;

// ============================
// SAVE BOOKING ON CONFIRM
// ============================
document.getElementById("confirmBtn").addEventListener("click", () => {

  const existingBookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  existingBookings.push({
    carKey: data.carKey,
    carType: data.carType,
    pickup: data.pickup,
    drop: data.drop
  });

  localStorage.setItem("bookings", JSON.stringify(existingBookings));
});

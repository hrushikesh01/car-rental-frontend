// READ URL PARAMS
const params = new URLSearchParams(window.location.search);
const car = params.get("car");
const type = params.get("type");

// PRICE MAP (premium example)
const prices = {
  fortuner: 6999,
  bmw3: 7999,
  benzC: 8499,
  rangeRoverVelar: 14999
};

// SET CAR INFO
document.getElementById("carName").textContent = car.toUpperCase();
document.getElementById("carPrice").textContent =
  `₹${prices[car]} / day`;

const pickup = document.getElementById("pickupDate");
const drop = document.getElementById("dropDate");

pickup.addEventListener("change", calculate);
drop.addEventListener("change", calculate);

function calculate() {
  if (!pickup.value || !drop.value) return;

  const start = new Date(pickup.value);
  const end = new Date(drop.value);
  const days = (end - start) / (1000 * 60 * 60 * 24);

  if (days <= 0) return;

  document.getElementById("days").textContent = days;
  document.getElementById("total").textContent =
    `₹${days * prices[car]}`;
}

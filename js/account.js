// Protect page
if (!localStorage.getItem("isLoggedIn") || !localStorage.getItem("authToken")) {
  window.location.href = "login.html";
}

// Load profile
document.getElementById("profileName").textContent =
  localStorage.getItem("profileName") || "Drive User";

document.getElementById("userEmail").textContent =
  localStorage.getItem("userEmail") || "user@example.com";

document.getElementById("userAddress").textContent =
  localStorage.getItem("userAddress") || "No address saved.";

// Edit profile
document.getElementById("editProfileBtn").addEventListener("click", () => {
  const name = prompt("Enter your name:");
  if (name) {
    localStorage.setItem("profileName", name);
    document.getElementById("profileName").textContent = name;
  }
});

// Edit address
document.getElementById("editAddressBtn").addEventListener("click", () => {
  const address = prompt("Enter your address:");
  if (address) {
    localStorage.setItem("userAddress", address);
    document.getElementById("userAddress").textContent = address;
  }
});

// Load bookings from backend
const bookingList = document.getElementById("bookingList");
const loyalty = document.getElementById("loyaltyDiscount");

async function loadBookings() {
  try {
    const bookings = await apiGetMyBookings();

    if (!bookings || bookings.length === 0) {
      bookingList.innerHTML = "<p>No bookings yet.</p>";
    } else {
      bookingList.innerHTML = "";
      bookings.slice(0, 3).forEach(b => {
        const div = document.createElement("div");
        div.classList.add("booking-item");
        const pickup = new Date(b.pickup_date).toLocaleDateString("en-IN");
        const drop = new Date(b.drop_date).toLocaleDateString("en-IN");
        div.innerHTML = `
          <strong>${b.car_name}</strong> (${b.category})<br>
          ${pickup} → ${drop}<br>
          Delivery: ${b.delivery_option === "home" ? "Home Delivery" : "Pickup at Showroom"}<br>
          Status: ${b.status}
        `;
        bookingList.appendChild(div);
      });

      // Loyalty based on total bookings
      if (bookings.length >= 5) {
        loyalty.textContent = "💎 Platinum Member – 15% Discount Unlocked";
      } else if (bookings.length >= 3) {
        loyalty.textContent = "🥇 Gold Member – 10% Discount Unlocked";
      } else {
        loyalty.textContent = "Book 3 rides to unlock Gold membership rewards!";
      }
    }
  } catch (err) {
    bookingList.innerHTML = "<p>Unable to load bookings.</p>";
    loyalty.textContent = "Loyalty status unavailable.";
    console.error(err);
  }
}

loadBookings();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  window.location.href = "index.html";
});
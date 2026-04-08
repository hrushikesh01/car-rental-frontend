// Protect page
if (!localStorage.getItem("isLoggedIn") || !localStorage.getItem("authToken")) {
  window.location.href = "login.html";
}

const profileNameEl = document.getElementById("profileName");
const userEmailEl = document.getElementById("userEmail");
const userAddressEl = document.getElementById("userAddress");
const profileAvatarEl = document.getElementById("profileAvatar");
const avatarFallbackEl = document.getElementById("avatarFallback");
const avatarFileInputEl = document.getElementById("avatarFileInput");

function setAvatar(avatarUrl) {
  const url = (avatarUrl || "").trim();
  if (url) {
    profileAvatarEl.src = url;
    profileAvatarEl.style.display = "block";
    avatarFallbackEl.style.display = "none";
    localStorage.setItem("profileAvatar", url);
  } else {
    profileAvatarEl.removeAttribute("src");
    profileAvatarEl.style.display = "none";
    avatarFallbackEl.style.display = "grid";
    localStorage.removeItem("profileAvatar");
  }
}

function applyUserToUi(user) {
  if (!user) return;
  const name = user.name || localStorage.getItem("profileName") || "Drive User";
  const email = user.email || localStorage.getItem("userEmail") || "user@example.com";
  const avatar = user.avatar_url || user.avatar || localStorage.getItem("profileAvatar") || "";

  profileNameEl.textContent = name;
  userEmailEl.textContent = email;
  avatarFallbackEl.textContent = (name || "D").trim().charAt(0).toUpperCase();
  setAvatar(avatar);

  localStorage.setItem("profileName", name);
  localStorage.setItem("userEmail", email);
}

// Load profile (local first, backend sync after)
applyUserToUi({
  name: localStorage.getItem("profileName") || "Drive User",
  email: localStorage.getItem("userEmail") || "user@example.com",
  avatar_url: localStorage.getItem("profileAvatar") || "",
});
userAddressEl.textContent = localStorage.getItem("userAddress") || "No address saved.";

// Edit profile
document.getElementById("editProfileBtn").addEventListener("click", () => {
  const name = prompt("Enter your name:");
  if (name) {
    apiUpdateProfile({ name: name.trim() })
      .then(({ user }) => applyUserToUi(user))
      .catch(() => {
        localStorage.setItem("profileName", name);
        profileNameEl.textContent = name;
        avatarFallbackEl.textContent = name.trim().charAt(0).toUpperCase();
      });
  }
});

// Edit address
document.getElementById("editAddressBtn").addEventListener("click", () => {
  const address = prompt("Enter your address:");
  if (address) {
    localStorage.setItem("userAddress", address);
    userAddressEl.textContent = address;
  }
});

document.getElementById("uploadAvatarBtn").addEventListener("click", () => {
  avatarFileInputEl.click();
});

avatarFileInputEl.addEventListener("change", async () => {
  const file = avatarFileInputEl.files && avatarFileInputEl.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }
  if (file.size > 1024 * 1024) {
    alert("Image too large. Please use an image under 1MB.");
    return;
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

  try {
    const { user } = await apiUpdateProfile({ avatarUrl: dataUrl });
    applyUserToUi(user);
  } catch (err) {
    alert(err.message || "Unable to upload photo");
  } finally {
    avatarFileInputEl.value = "";
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
        const canCancel = b.status !== "cancelled";
        div.innerHTML = `
          <strong>${b.car_name}</strong> (${b.category})<br>
          ${pickup} → ${drop}<br>
          Delivery: ${b.delivery_option === "home" ? "Home Delivery" : "Pickup at Showroom"}<br>
          Status: ${b.status}
          ${
            canCancel
              ? `<br><button class="cancel-booking-btn" data-booking-id="${b.id}" style="margin-top:8px;">Cancel Booking</button>`
              : ""
          }
        `;
        bookingList.appendChild(div);
      });

      bookingList.querySelectorAll(".cancel-booking-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const bookingId = btn.dataset.bookingId;
          if (!bookingId) return;
          const confirmed = window.confirm("Cancel this booking?");
          if (!confirmed) return;
          btn.disabled = true;
          try {
            await apiCancelBooking(bookingId);
            await loadBookings();
          } catch (err) {
            btn.disabled = false;
            alert(err.message || "Unable to cancel booking");
          }
        });
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

apiGetMe()
  .then(({ user }) => applyUserToUi(user))
  .catch(() => {});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("profileAvatar");
  window.location.href = "index.html";
});
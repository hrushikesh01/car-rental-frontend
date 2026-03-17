// ============================
// GET ALL BOOKINGS
// ============================
function getBookings() {
  return JSON.parse(localStorage.getItem("bookings")) || [];
}

// ============================
// CHECK DATE OVERLAP
// ============================
function isOverlap(start1, end1, start2, end2) {
  return !(end1 <= start2 || start1 >= end2);
}

// ============================
// CHECK IF CAR IS AVAILABLE
// ============================
function isCarAvailable(carKey, carType, pickup, drop) {
  const bookings = getBookings();

  const newStart = new Date(pickup);
  const newEnd = new Date(drop);

  return !bookings.some(b => {
    if (b.carKey !== carKey || b.carType !== carType) return false;

    const existingStart = new Date(b.pickup);
    const existingEnd = new Date(b.drop);

    return isOverlap(newStart, newEnd, existingStart, existingEnd);
  });
}

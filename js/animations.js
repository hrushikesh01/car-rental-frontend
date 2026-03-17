const reveals = document.querySelectorAll(".reveal");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      el.classList.add("active");
    }
  });
  if (window.scrollY > 80) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

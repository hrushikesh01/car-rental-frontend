/*
  ENTRY PAGE LOGIC
  - Only ENTER buttons are clickable
  - Smooth fade-out before navigation
*/

const buttons = document.querySelectorAll(".enter-btn");

buttons.forEach(button => {
  button.addEventListener("click", () => {

    // Get target page from data attribute
    const targetPage = button.getAttribute("data-link");

    // Fade out effect
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = "0";

    // Navigate after animation
    setTimeout(() => {
      window.location.href = targetPage;
    }, 600);
  });
});

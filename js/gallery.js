const main = document.getElementById("mainImage");
document.querySelectorAll(".thumbnails img").forEach(img => {
  img.onclick = () => main.src = img.src;
});

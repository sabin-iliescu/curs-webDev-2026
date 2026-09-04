// Acesta este un fișier JavaScript extern.

const butonExtern = document.getElementById("buton-extern");
const cutieExterna = document.getElementById("cutie-externa");
const numarClickuri = document.getElementById("numar-clickuri");

let clickuri = 0;

butonExtern.addEventListener("click", function () {
  clickuri = clickuri + 1;

  cutieExterna.classList.toggle("cutie-schimbata");
  cutieExterna.textContent = "Fișierul script.js a funcționat!";
  numarClickuri.textContent = "Număr de clickuri: " + clickuri;
});

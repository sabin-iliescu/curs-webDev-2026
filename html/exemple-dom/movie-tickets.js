// Pasul 4: găsim elementele și citim prețul inițial.
const container = document.getElementById("seats");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const price = document.getElementById("price");
const resetButton = document.getElementById("reset");
let ticketPrice = Number(movieSelect.value);

// Pasul 5: aceeași funcție actualizează toate valorile afișate.
function updateSelectedCount() {
  const selectedSeats = container.querySelectorAll(".seat.selected");
  const selectedSeatsCount = selectedSeats.length;
  count.textContent = selectedSeatsCount;
  price.textContent = ticketPrice;
  total.textContent = selectedSeatsCount * ticketPrice;
}

// Pasul 6: un singur listener pentru toate locurile.
container.addEventListener("click", function (event) {
  const seat = event.target.closest(".seat");
  if (seat === null || seat.classList.contains("occupied") || seat.disabled) {
    return;
  }
  const isSelected = seat.classList.toggle("selected");
  seat.setAttribute("aria-pressed", String(isSelected));
  updateSelectedCount();
});

// Pasul 7: schimbarea filmului actualizează prețul și totalul.
movieSelect.addEventListener("change", function () {
  ticketPrice = Number(movieSelect.value);
  updateSelectedCount();
});

// Pasul 8: golim selecția, păstrând filmul ales.
resetButton.addEventListener("click", function () {
  const selectedSeats = container.querySelectorAll(".seat.selected");
  for (const seat of selectedSeats) {
    seat.classList.remove("selected");
    seat.setAttribute("aria-pressed", "false");
  }
  updateSelectedCount();
});

// Pasul 9: sincronizăm afișajul și la pornire.
updateSelectedCount();

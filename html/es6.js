// Același exemplu de clasă ca în lecție.
class Bilet {
  constructor(film, pret) {
    this.film = film;
    this.pret = pret;
  }

  calculeazaTotal(cantitate = 1) {
    return this.pret * cantitate;
  }
}

const biletDemo = new Bilet("Drum spre Marte", 20);
const formular = document.getElementById("formular-bilete");
const cantitateInput = document.getElementById("cantitate");
const totalRezultat = document.getElementById("total-bilete");

formular.addEventListener("submit", (event) => {
  event.preventDefault();
  const cantitate = Number(cantitateInput.value);
  const valid = cantitateInput.value !== "" && Number.isInteger(cantitate) && cantitate >= 1 && cantitate <= 10;
  cantitateInput.setAttribute("aria-invalid", String(!valid));

  if (!valid) {
    totalRezultat.textContent = "Introdu un număr întreg de bilete între 1 și 10.";
    return;
  }

  totalRezultat.textContent = `${biletDemo.film}: ${cantitate} × ${biletDemo.pret} lei = ${biletDemo.calculeazaTotal(cantitate)} lei`;
});

// Simulăm o operație asincronă local, fără cereri către un server.
function verificaLocuri(disponibil) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (disponibil) {
        resolve("Sunt locuri disponibile.");
      } else {
        reject(new Error("Nu mai sunt locuri la acest film."));
      }
    }, 1000);
  });
}

const butonVerifica = document.getElementById("verifica-locuri");
const scenariu = document.getElementById("scenariu");
const stare = document.getElementById("stare-promisiune");

butonVerifica.addEventListener("click", async () => {
  const disponibil = scenariu.value === "disponibil";
  butonVerifica.disabled = true;
  scenariu.disabled = true;
  stare.textContent = "pending: verificăm locurile…";

  try {
    const mesaj = await verificaLocuri(disponibil);
    stare.textContent = `fulfilled: ${mesaj}`;
  } catch (eroare) {
    stare.textContent = `rejected: ${eroare.message}`;
  } finally {
    butonVerifica.disabled = false;
    scenariu.disabled = false;
  }
});

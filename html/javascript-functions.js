// Două demonstrații; rezolvările se deschid nativ prin <details>.
function calculeazaTotal(pret, cantitate) {
  const total = pret * cantitate;
  return total;
}

const pretInput = document.getElementById("functie-pret");
const cantitateInput = document.getElementById("functie-cantitate");
const bonRezultat = document.getElementById("functie-bon-rezultat");

document.getElementById("functie-bon").addEventListener("submit", function (event) {
  event.preventDefault();
  const pret = Number(pretInput.value);
  const cantitate = Number(cantitateInput.value);
  const pretValid = pretInput.value !== "" && Number.isInteger(pret) && pret >= 0 && pret <= 1000;
  const cantitateValida = cantitateInput.value !== "" && Number.isInteger(cantitate) && cantitate >= 1 && cantitate <= 20;
  pretInput.setAttribute("aria-invalid", String(!pretValid));
  cantitateInput.setAttribute("aria-invalid", String(!cantitateValida));

  if (!pretValid || !cantitateValida) {
    bonRezultat.textContent = "Introdu un preț întreg de la 0 la 1000 lei și o cantitate întreagă de la 1 la 20.";
    return;
  }

  const total = calculeazaTotal(pret, cantitate);
  bonRezultat.textContent = `calculeazaTotal(${pret}, ${cantitate}) → ${total} lei`;
});

function aduna(a, b) {
  return a + b;
}

function inmulteste(a, b) {
  return a * b;
}

function aplicaOperatia(a, b, operatie) {
  return operatie(a, b);
}

const operatieSelect = document.getElementById("callback-operatie");
const callbackRezultat = document.getElementById("callback-rezultat");

operatieSelect.addEventListener("change", function () {
  let operatie = aduna;
  if (operatieSelect.value === "inmulteste") {
    operatie = inmulteste;
  }
  const rezultat = aplicaOperatia(2, 3, operatie);
  callbackRezultat.textContent = `aplicaOperatia(2, 3, ${operatieSelect.value}) → ${rezultat}`;
});

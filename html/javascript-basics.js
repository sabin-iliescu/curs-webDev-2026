// Lecția 10: exemple independente, fără biblioteci externe.
const salutButon = document.getElementById("salut-buton");
const salutRezultat = document.getElementById("salut-rezultat");

function deschideCafeneaua() {
  salutRezultat.textContent = "Bine ai venit! Ce cafea îți pregătim?";
}

salutButon.addEventListener("click", deschideCafeneaua);

let cafeleVandute = 0;
const cafeaRezultat = document.getElementById("cafea-rezultat");

document.getElementById("cafea-adauga").addEventListener("click", function () {
  cafeleVandute = cafeleVandute + 1;
  cafeaRezultat.textContent = `Cafele vândute: ${cafeleVandute}`;
});

document.getElementById("cafea-reset").addEventListener("click", function () {
  cafeleVandute = 0;
  cafeaRezultat.textContent = `Cafele vândute: ${cafeleVandute}`;
});

const tipValoare = document.getElementById("tip-valoare");
const tipRezultat = document.getElementById("tip-rezultat");
const exempleTipuri = {
  numar: 12,
  text: "12",
  boolean: true,
  nedefinit: undefined,
  nul: null,
  mare: 123n,
  simbol: Symbol("id")
};

tipValoare.addEventListener("change", function () {
  const exemplu = exempleTipuri[tipValoare.value];
  const eticheta = tipValoare.options[tipValoare.selectedIndex].text;
  tipRezultat.textContent = `typeof ${eticheta} → "${typeof exemplu}"`;
  if (exemplu === null) {
    tipRezultat.textContent += " — particularitate istorică: null rămâne primitiv.";
  }
});

const bonCantitate = document.getElementById("bon-cantitate");
const bonRezultat = document.getElementById("bon-rezultat");

document.getElementById("bon-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Păstrăm pagina deschisă când trimitem formularul.
  const cantitate = Number(bonCantitate.value);

  if (bonCantitate.value === "" || !Number.isInteger(cantitate) || cantitate < 1 || cantitate > 10) {
    bonCantitate.setAttribute("aria-invalid", "true");
    bonRezultat.textContent = "Introdu un număr întreg de cafele, de la 1 la 10.";
    return;
  }

  bonCantitate.removeAttribute("aria-invalid");
  const pret = 12;
  const total = pret * cantitate;
  bonRezultat.textContent = `${pret} × ${cantitate} = ${total} lei`;
});

const meniu = ["Espresso", "Latte", "Ceai"];
const meniuIndex = document.getElementById("meniu-index");
const meniuRezultat = document.getElementById("meniu-rezultat");

meniuIndex.addEventListener("change", function () {
  const index = Number(meniuIndex.value);
  if (meniu[index] === undefined) {
    meniuRezultat.textContent = `meniu[${index}] → undefined: lista are indicii 0, 1 și 2.`;
  } else {
    meniuRezultat.textContent = `meniu[${index}] → "${meniu[index]}"`;
  }
});

const livrareTotal = document.getElementById("livrare-total");
const livrareRezultat = document.getElementById("livrare-rezultat");

document.getElementById("livrare-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const total = Number(livrareTotal.value);

  if (livrareTotal.value === "" || !Number.isSafeInteger(total) || total < 0) {
    livrareTotal.setAttribute("aria-invalid", "true");
    livrareRezultat.textContent = "Introdu un total valid în lei întregi, mai mare sau egal cu 0.";
    return;
  }

  livrareTotal.removeAttribute("aria-invalid");
  if (total >= 50) {
    livrareRezultat.textContent = "Livrare gratuită!";
  } else {
    livrareRezultat.textContent = `Mai adaugă produse de ${50 - total} lei pentru livrare gratuită.`;
  }
});

document.getElementById("bucla-ruleaza").addEventListener("click", function () {
  const cantitate = Number(document.getElementById("bucla-numar").value);
  const rezultat = document.getElementById("bucla-rezultat");
  rezultat.replaceChildren();
  const lista = document.createElement("ul");

  for (let i = 1; i <= cantitate; i++) {
    const rand = document.createElement("li");
    rand.textContent = `i = ${i} → Pregătesc cafeaua ${i}`;
    lista.appendChild(rand);
  }

  const final = document.createElement("p");
  final.textContent = `La i = ${cantitate + 1}, condiția i <= ${cantitate} este falsă. Bucla se oprește.`;
  rezultat.append(lista, final);
});

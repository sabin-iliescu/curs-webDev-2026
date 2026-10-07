// Demo: selectori
const selector = document.getElementById("selector-demo");
const filme = document.querySelectorAll("#filme-demo .film");
const selectorRezultat = document.getElementById("selector-rezultat");

function evidentiazaFilmele() {
  for (const film of filme) {
    film.classList.remove("reperat");
  }
  const gasite = document.querySelectorAll(selector.value);
  for (const film of gasite) {
    film.classList.add("reperat");
  }
  selectorRezultat.textContent = `${selector.value} → ${gasite.length} elemente`;
}
selector.addEventListener("change", evidentiazaFilmele);
evidentiazaFilmele();

// Demo: mesaj
const numeInput = document.getElementById("nume-demo");
const salut = document.getElementById("salut-demo");

function actualizeazaSalutul() {
  const nume = numeInput.value.trim();
  if (nume === "") {
    salut.textContent = "Salut, cinefilule! Ce film alegem?";
  } else {
    salut.textContent = `Salut, ${nume}! Ce film alegem?`;
  }
}
numeInput.addEventListener("input", actualizeazaSalutul);
actualizeazaSalutul();

// Demo: atribute
const acord = document.getElementById("acord-demo");
const continua = document.getElementById("continua-demo");
const acordMesaj = document.getElementById("acord-mesaj");

acord.addEventListener("change", function () {
  continua.disabled = !acord.checked;
  acordMesaj.textContent = acord.checked
    ? "Butonul este activ. Poți continua."
    : "Bifează că ai verificat ora filmului.";
});
continua.addEventListener("click", function () {
  acordMesaj.textContent = "Gata, ne vedem la film!";
});

// Demo: stiluri
const scena = document.getElementById("scena-demo");
const lumina = document.getElementById("lumina-demo");

lumina.addEventListener("click", function () {
  const esteSeara = scena.classList.toggle("mod-seara");
  lumina.setAttribute("aria-pressed", String(esteSeara));
  lumina.textContent = esteSeara ? "Aprinde luminile" : "Activează modul seară";
});

// Demo: lista
const formular = document.getElementById("lista-form");
const titluInput = document.getElementById("titlu-film");
const lista = document.getElementById("lista-filme");
const listaMesaj = document.getElementById("lista-mesaj");

formular.addEventListener("submit", function (event) {
  event.preventDefault();
  const titlu = titluInput.value.trim();
  if (titlu === "") {
    listaMesaj.textContent = "Scrie mai întâi titlul unui film.";
    titluInput.setAttribute("aria-invalid", "true");
    titluInput.focus();
    return;
  }
  titluInput.removeAttribute("aria-invalid");
  const rand = document.createElement("li");
  const text = document.createElement("span");
  text.textContent = titlu;
  const sterge = document.createElement("button");
  sterge.type = "button";
  sterge.textContent = "Șterge";
  sterge.setAttribute("aria-label", `Șterge filmul ${titlu}`);
  sterge.addEventListener("click", function () {
    rand.remove();
    listaMesaj.textContent = `Filme în listă: ${lista.children.length}`;
    titluInput.focus();
  });
  rand.appendChild(text);
  rand.appendChild(sterge);
  lista.appendChild(rand);
  listaMesaj.textContent = `Filme în listă: ${lista.children.length}`;
  titluInput.value = "";
  titluInput.focus();
});

// Demo: ascultare
const aplauze = document.getElementById("aplauze-demo");
const pauza = document.getElementById("pauza-demo");
const reia = document.getElementById("reia-demo");
const aplauzeMesaj = document.getElementById("aplauze-mesaj");
let numarAplauze = 0;

function numaraAplauze() {
  numarAplauze++;
  aplauzeMesaj.textContent = `Aplauze: ${numarAplauze}`;
}
aplauze.addEventListener("click", numaraAplauze);

pauza.addEventListener("click", function () {
  aplauze.removeEventListener("click", numaraAplauze);
  aplauzeMesaj.textContent = `Pauză la ${numarAplauze}. Clickurile nu mai sunt numărate.`;
  pauza.disabled = true;
  reia.disabled = false;
});
reia.addEventListener("click", function () {
  aplauze.addEventListener("click", numaraAplauze);
  aplauzeMesaj.textContent = `Ascultăm din nou. Aplauze: ${numarAplauze}`;
  pauza.disabled = false;
  reia.disabled = true;
});

// Demo: delegare
const zona = document.getElementById("zona-click");
const urma = document.getElementById("urma-click");

zona.addEventListener("click", function (event) {
  const buton = event.target.closest(".gustare");
  if (buton === null) {
    urma.textContent = "Ai apăsat spațiul dintre butoane. Nu alegem nimic.";
    return;
  }
  urma.textContent = `target: ${event.target.tagName}; currentTarget: ${event.currentTarget.tagName}; alegere: ${buton.dataset.produs}`;
});

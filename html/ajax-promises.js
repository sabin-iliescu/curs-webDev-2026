// 1. Event loop: măsurăm ordinea reală, fără să ordonăm manual rezultatele.
const ruleazaOrdinea = document.getElementById("ruleaza-ordinea");
const jurnalOrdine = document.getElementById("jurnal-ordine");
const stareOrdine = document.getElementById("stare-ordine");

function noteaza(mesaj) {
  const rand = document.createElement("li");
  rand.textContent = mesaj;
  jurnalOrdine.append(rand);
}

ruleazaOrdinea.addEventListener("click", () => {
  ruleazaOrdinea.disabled = true;
  jurnalOrdine.replaceChildren();
  noteaza("A. Pornim codul sincron.");
  setTimeout(() => {
    noteaza("B. Rulează callbackul timerului.");
    stareOrdine.textContent = "Ordinea reală: A → D → C → B.";
    ruleazaOrdinea.disabled = false;
  }, 0);
  Promise.resolve().then(() => noteaza("C. Rulează callbackul promisiunii."));
  noteaza("D. Terminăm codul sincron.");
});

// 2. Promise local: timerul simulează pregătirea unei comenzi.
function preparaPopcorn(disponibil) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (disponibil) {
        resolve("Popcornul este gata!");
      } else {
        reject(new Error("Nu mai avem porumb. Alege altă gustare."));
      }
    }, 1800);
  });
}

const comandaPopcorn = document.getElementById("comanda-popcorn");
const scenariuPopcorn = document.getElementById("scenariu-popcorn");
const automatPopcorn = document.getElementById("automat-popcorn");
const starePopcorn = document.getElementById("stare-popcorn");

comandaPopcorn.addEventListener("click", () => {
  comandaPopcorn.disabled = true;
  scenariuPopcorn.disabled = true;
  automatPopcorn.dataset.stare = "pending";
  starePopcorn.textContent = "pending: pregătim comanda…";

  preparaPopcorn(scenariuPopcorn.value === "succes")
    .then((mesaj) => {
      automatPopcorn.dataset.stare = "fulfilled";
      starePopcorn.textContent = `fulfilled: ${mesaj}`;
    })
    .catch((eroare) => {
      automatPopcorn.dataset.stare = "rejected";
      starePopcorn.textContent = `rejected: ${eroare.message}`;
    })
    .finally(() => {
      comandaPopcorn.disabled = false;
      scenariuPopcorn.disabled = false;
    });
});

let clickuri = 0;
const butonContor = document.getElementById("contor-async");
butonContor.addEventListener("click", () => {
  clickuri += 1;
  butonContor.textContent = `Pagina răspunde: ${clickuri} clickuri`;
});

// 3. AJAX: catalog și program încărcate prin cereri HTTP reale.
const incarcaCatalogButon = document.getElementById("incarca-catalog");
const testeaza404 = document.getElementById("testeaza-404");
const genSelect = document.getElementById("gen-film");
const listaCatalog = document.getElementById("catalog-filme");
const stareCatalog = document.getElementById("stare-catalog");
const programPanou = document.getElementById("program-film");
const programTitlu = document.getElementById("program-titlu");
const programStare = document.getElementById("program-stare");
const oreLista = document.getElementById("ore-film");
const numeGenuri = { aventura: "Aventură", comedie: "Comedie", animatie: "Animație" };
let catalog = [];

function seteazaIncarcare(ocupat) {
  incarcaCatalogButon.disabled = ocupat;
  testeaza404.disabled = ocupat;
  genSelect.disabled = ocupat || catalog.length === 0;
  for (const buton of listaCatalog.querySelectorAll("button")) {
    buton.disabled = ocupat;
  }
}

function afiseazaCatalog() {
  listaCatalog.replaceChildren();
  programPanou.hidden = true;
  const filme = catalog.filter((film) => genSelect.value === "toate" || film.gen === genSelect.value);

  for (const film of filme) {
    const card = document.createElement("li");
    card.className = "card-film";
    card.dataset.gen = film.gen;
    const afis = document.createElement("div");
    afis.className = "afis-film";
    afis.setAttribute("aria-hidden", "true");
    afis.textContent = film.simbol;
    const info = document.createElement("div");
    info.className = "film-info";
    const titlu = document.createElement("h4");
    titlu.textContent = film.titlu;
    const meta = document.createElement("p");
    meta.className = "meta-film";
    meta.textContent = `${numeGenuri[film.gen]} · ${film.durata} min`;
    const descriere = document.createElement("p");
    descriere.textContent = film.descriere;
    const buton = document.createElement("button");
    buton.type = "button";
    buton.textContent = "Vezi orele";
    buton.setAttribute("aria-label", `Vezi orele pentru ${film.titlu}`);
    buton.addEventListener("click", () => incarcaProgram(film));
    info.append(titlu, meta, descriere, buton);
    card.append(afis, info);
    listaCatalog.append(card);
  }

  stareCatalog.textContent = filme.length === 0
    ? "Niciun film pentru acest gen. Încearcă alt filtru."
    : `Filme afișate: ${filme.length}. Alege un film pentru a încărca orele.`;
}

function incarcaCatalog(url) {
  catalog = [];
  listaCatalog.replaceChildren();
  programPanou.hidden = true;

  if (window.location.protocol === "file:") {
    stareCatalog.textContent = "Pentru catalog, deschide lecția prin serverul local. Vezi pașii din secțiunea «Pregătire».";
    return;
  }

  seteazaIncarcare(true);
  stareCatalog.textContent = "Se încarcă lista de filme…";

  return citesteJSON(url)
    .then((filme) => {
      if (!Array.isArray(filme)) {
        throw new Error("Catalogul trebuie să fie o listă de filme.");
      }
      catalog = filme;
      afiseazaCatalog();
    })
    .catch((eroare) => {
      stareCatalog.textContent = `Nu am putut încărca filmele. ${eroare.message} Reîncearcă prin «Încarcă filmele».`;
    })
    .finally(() => seteazaIncarcare(false));
}

function incarcaProgram(film) {
  seteazaIncarcare(true);
  programPanou.hidden = false;
  programTitlu.textContent = film.titlu;
  programStare.textContent = "Se încarcă programul…";
  oreLista.replaceChildren();

  return citesteJSON(`exemple-ajax/program-${film.id}.json`)
    .then((program) => {
      if (!Array.isArray(program.ore)) {
        throw new Error("Programul trebuie să conțină o listă de ore.");
      }
      for (const ora of program.ore) {
        const element = document.createElement("li");
        element.textContent = ora;
        oreLista.append(element);
      }
      programStare.textContent = program.ore.length === 0
        ? "Nu sunt proiecții programate pentru acest film."
        : `${program.sala}: ${program.ore.length} proiecții. Program demonstrativ.`;
    })
    .catch((eroare) => {
      programStare.textContent = `Nu am putut încărca orele. ${eroare.message} Apasă din nou «Vezi orele» pentru a reîncerca.`;
    })
    .finally(() => seteazaIncarcare(false));
}

incarcaCatalogButon.addEventListener("click", () => incarcaCatalog("exemple-ajax/filme.json"));
testeaza404.addEventListener("click", () => incarcaCatalog("exemple-ajax/nu-exista.json"));
genSelect.addEventListener("change", afiseazaCatalog);

"use strict";

// Datele și regulile sălii. Clasa nu modifică HTML-ul.
class SalaCinema {
  #capacitate;
  #ocupate = 0;

  constructor(nume, capacitate) {
    if (!Number.isInteger(capacitate) || capacitate <= 0) {
      throw new Error("Capacitatea trebuie să fie un număr întreg pozitiv.");
    }
    this.nume = nume;
    this.#capacitate = capacitate;
  }

  get capacitate() {
    return this.#capacitate;
  }

  get ocupate() {
    return this.#ocupate;
  }

  get libere() {
    return this.#capacitate - this.#ocupate;
  }

  rezerva() {
    if (this.libere === 0) return false;
    this.#ocupate++;
    return true;
  }

  elibereaza() {
    if (this.#ocupate === 0) return false;
    this.#ocupate--;
    return true;
  }
}

// O comandă poate conține mai multe feluri de bilete.
class Bilet {
  static moneda = "lei";

  constructor(film, pret) {
    this.film = film;
    this.pret = pret;
  }

  calculeazaPret() {
    return this.pret;
  }

  static dinDate(date) {
    return new Bilet(date.film, date.pret);
  }
}

class BiletStudent extends Bilet {
  calculeazaPret() {
    return super.calculeazaPret() / 2;
  }
}

class Comanda {
  constructor() {
    this.bilete = [];
  }

  adauga(bilet) {
    this.bilete.push(bilet);
  }

  stergeUltimul() {
    this.bilete.pop();
  }

  goleste() {
    this.bilete = [];
  }

  calculeazaTotal() {
    let total = 0;
    for (const bilet of this.bilete) {
      total += bilet.calculeazaPret();
    }
    return total;
  }
}

// Interfața citește obiectele și afișează rezultatul după fiecare click.
const sali = [new SalaCinema("Orion", 4), new SalaCinema("Luna", 6)];
const stareSali = document.querySelector("#stare-sali");

sali.forEach((sala, index) => {
  const card = document.querySelector(`#sala-${index}`);
  const locuri = card.querySelector(".locuri");
  const numere = card.querySelector(".numere-sala");
  const rezerva = card.querySelector(".rezerva");
  const elibereaza = card.querySelector(".elibereaza");

  function afiseazaSala() {
    numere.textContent = `Ocupate: ${sala.ocupate} · Libere: ${sala.libere} din ${sala.capacitate}`;
    locuri.replaceChildren();
    for (let i = 0; i < sala.capacitate; i++) {
      const loc = document.createElement("span");
      loc.className = i < sala.ocupate ? "loc ocupat" : "loc";
      loc.textContent = i + 1;
      locuri.append(loc);
    }
    rezerva.disabled = sala.libere === 0;
    elibereaza.disabled = sala.ocupate === 0;
  }

  rezerva.addEventListener("click", () => {
    sala.rezerva();
    afiseazaSala();
    stareSali.textContent = `${sala.nume} · Ocupate: ${sala.ocupate} · Libere: ${sala.libere}.`;
  });
  elibereaza.addEventListener("click", () => {
    sala.elibereaza();
    afiseazaSala();
    stareSali.textContent = `${sala.nume} · Ocupate: ${sala.ocupate} · Libere: ${sala.libere}.`;
  });
  afiseazaSala();
});

const comanda = new Comanda();
const listaBilete = document.querySelector("#lista-bilete");
const totalComanda = document.querySelector("#total-comanda");
const sterge = document.querySelector("#sterge-bilet");
const goleste = document.querySelector("#goleste-comanda");

function afiseazaComanda() {
  listaBilete.replaceChildren();
  for (const bilet of comanda.bilete) {
    const rand = document.createElement("li");
    rand.textContent = `${bilet.film} — ${bilet.calculeazaPret()} ${Bilet.moneda}`;
    listaBilete.append(rand);
  }
  totalComanda.textContent = `Bilete: ${comanda.bilete.length} · Total: ${comanda.calculeazaTotal()} ${Bilet.moneda}`;
  sterge.disabled = comanda.bilete.length === 0;
  goleste.disabled = comanda.bilete.length === 0;
}

document.querySelector("#adauga-standard").addEventListener("click", () => {
  comanda.adauga(new Bilet("Aventura pe Lună · standard", 20));
  afiseazaComanda();
});
document.querySelector("#adauga-student").addEventListener("click", () => {
  comanda.adauga(new BiletStudent("Aventura pe Lună · student", 20));
  afiseazaComanda();
});
sterge.addEventListener("click", () => {
  comanda.stergeUltimul();
  afiseazaComanda();
});
goleste.addEventListener("click", () => {
  comanda.goleste();
  afiseazaComanda();
});
afiseazaComanda();

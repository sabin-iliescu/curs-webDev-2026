// Simulator didactic: afișează mesaje prestabilite, fără cereri HTTP.
const scenariiHttp = {
  citire: {
    cerere: 'GET /api/filme/1 HTTP/1.1\nHost: cinema.example\nAccept: application/json',
    raspuns: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":1,"titlu":"Drum spre Marte","pret":20}',
    explicatie: "200 OK: filmul a fost găsit. Corpul răspunsului conține date JSON."
  },
  creare: {
    cerere: 'POST /api/rezervari HTTP/1.1\nHost: cinema.example\nContent-Type: application/json\n\n{"filmId":1,"loc":"A2"}',
    raspuns: 'HTTP/1.1 201 Created\nLocation: /api/rezervari/42\nContent-Type: application/json\n\n{"id":42,"filmId":1,"loc":"A2"}',
    explicatie: "201 Created: în acest scenariu, serverul a creat rezervarea. Location indică adresa ei."
  },
  stergere: {
    cerere: 'DELETE /api/rezervari/42 HTTP/1.1\nHost: cinema.example',
    raspuns: 'HTTP/1.1 204 No Content',
    explicatie: "204 No Content: ștergerea a reușit. Răspunsul nu are corp de citit."
  },
  invalid: {
    cerere: 'POST /api/rezervari HTTP/1.1\nHost: cinema.example\nContent-Type: application/json\n\n{"filmId":1}',
    raspuns: 'HTTP/1.1 400 Bad Request\nContent-Type: application/json\n\n{"mesaj":"Câmpul loc este obligatoriu."}',
    explicatie: "400 Bad Request: în acest API, rezervarea cere și un loc. Corectăm datele înainte să retrimitem."
  },
  absent: {
    cerere: 'GET /api/filme/999 HTTP/1.1\nHost: cinema.example\nAccept: application/json',
    raspuns: 'HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{"mesaj":"Filmul nu există."}',
    explicatie: "404 Not Found: serverul a răspuns, dar resursa cerută nu a fost găsită."
  },
  eroare: {
    cerere: 'GET /api/filme HTTP/1.1\nHost: cinema.example\nAccept: application/json',
    raspuns: 'HTTP/1.1 500 Internal Server Error\nContent-Type: application/json\n\n{"mesaj":"A apărut o problemă pe server."}',
    explicatie: "500 Internal Server Error: problema este pe server. Interfața poate explica situația și permite reîncercarea."
  }
};

const scenariuHttp = document.getElementById("scenariu-http");
const cerereHttp = document.getElementById("cerere-http");
const raspunsHttp = document.getElementById("raspuns-http");
const explicatieHttp = document.getElementById("explicatie-http");

function afiseazaSchimbulHttp() {
  const scenariu = scenariiHttp[scenariuHttp.value];
  cerereHttp.textContent = scenariu.cerere;
  raspunsHttp.textContent = scenariu.raspuns;
  explicatieHttp.textContent = scenariu.explicatie;
}

scenariuHttp.addEventListener("change", afiseazaSchimbulHttp);
afiseazaSchimbulHttp();

// Demonstrație reală: cerere GET către serverul de pe care deschizi lecția.
const butonIncarca = document.getElementById("incarca-filme");
const sursaFilme = document.getElementById("sursa-filme");
const stareFilme = document.getElementById("stare-filme");
const listaFilme = document.getElementById("lista-filme");

async function incarcaFilme() {
  listaFilme.replaceChildren();

  if (window.location.protocol === "file:") {
    stareFilme.textContent = "Deschide lecția printr-un server local (http://localhost…), apoi încearcă din nou. Vezi pașii de mai sus.";
    return;
  }

  butonIncarca.disabled = true;
  sursaFilme.disabled = true;
  stareFilme.textContent = "Se încarcă filmele…";

  try {
    const raspuns = await fetch(sursaFilme.value);
    if (!raspuns.ok) {
      throw new Error(`HTTP ${raspuns.status}: lista nu a putut fi încărcată.`);
    }

    const filme = await raspuns.json();
    for (const film of filme) {
      const element = document.createElement("li");
      element.textContent = `${film.titlu}: ${film.pret} lei`;
      listaFilme.append(element);
    }
    stareFilme.textContent = `HTTP ${raspuns.status}: ${filme.length} filme încărcate.`;
  } catch (eroare) {
    stareFilme.textContent = `Nu am putut afișa filmele. ${eroare.message}`;
  } finally {
    butonIncarca.disabled = false;
    sursaFilme.disabled = false;
  }
}

butonIncarca.addEventListener("click", incarcaFilme);

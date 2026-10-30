// 1. Găsim elementele interfeței.
const formular = document.getElementById("formular-meteo");
const orasInput = document.getElementById("oras");
const cheieInput = document.getElementById("cheie-api");
const butonCauta = document.getElementById("cauta-vremea");
const stare = document.getElementById("stare-meteo");
const rezultate = document.getElementById("rezultate-meteo");
const zileContainer = document.getElementById("zile-prognoza");
const API_BASE = "https://api.openweathermap.org/data/2.5/";
const ICON_BASE = "https://openweathermap.org/img/wn/";

// 2. Construim adresele. URLSearchParams se ocupă de spații și diacritice.
function construiesteURL(endpoint, oras, cheie) {
  const parametri = new URLSearchParams({
    q: oras,
    appid: cheie,
    units: "metric",
    lang: "ro"
  });
  return `${API_BASE}${endpoint}?${parametri}`;
}

// 3. Citim JSON-ul și transformăm erorile HTTP în mesaje utile.
async function citesteMeteo(url) {
  const raspuns = await fetch(url);
  if (!raspuns.ok) {
    if (raspuns.status === 401) {
      throw new Error("Cheia API nu este validă sau nu este încă activă.");
    }
    if (raspuns.status === 404) {
      throw new Error("Orașul nu a fost găsit. Încearcă și codul țării, de exemplu Brașov,RO.");
    }
    if (raspuns.status === 429) {
      throw new Error("Prea multe cereri. Așteaptă puțin și încearcă din nou.");
    }
    throw new Error(`Serviciul meteo a răspuns cu eroarea ${raspuns.status}.`);
  }
  return raspuns.json();
}

// 4. Mici funcții pentru numere, imagini și ora locală a orașului.
function cuUnitate(valoare, unitate) {
  if (!Number.isFinite(valoare)) return "—";
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} ${unitate}`;
}

function adresaImagine(cod) {
  // Acceptăm numai coduri de iconițe OpenWeather.
  if (!/^\d{2}[dn]$/.test(cod)) return "";
  return `${ICON_BASE}${cod}@2x.png`;
}

function dataLocala(timestamp, decalaj) {
  return new Date((timestamp + decalaj) * 1000);
}

function cheiaZilei(timestamp, decalaj) {
  return dataLocala(timestamp, decalaj).toISOString().slice(0, 10);
}

function oraLocala(timestamp, decalaj) {
  return dataLocala(timestamp, decalaj).toLocaleTimeString("ro-RO", {
    timeZone: "UTC", hour: "2-digit", minute: "2-digit"
  });
}

function numeleZilei(timestamp, decalaj) {
  return dataLocala(timestamp, decalaj).toLocaleDateString("ro-RO", {
    timeZone: "UTC", weekday: "long", day: "numeric", month: "long"
  });
}

function seteazaImagine(imagine, vreme) {
  const sursa = adresaImagine(vreme.icon);
  imagine.alt = vreme.description || "Vreme";
  imagine.hidden = !sursa;
  imagine.onerror = () => { imagine.hidden = true; };
  if (sursa) imagine.src = sursa;
  else imagine.removeAttribute("src");
}

// 5. Completăm panoul cu vremea de acum.
function afiseazaAcum(acum, prognoza) {
  const decalaj = prognoza.city.timezone;
  const azi = cheiaZilei(acum.dt, decalaj);
  const temperaturiAzi = prognoza.list
    .filter((interval) => cheiaZilei(interval.dt, decalaj) === azi)
    .map((interval) => interval.main.temp)
    .filter(Number.isFinite);

  document.getElementById("titlu-acum").textContent = `Vremea acum în ${acum.name}, ${acum.sys.country}`;
  document.getElementById("actualizare").textContent = `Actualizare: ${numeleZilei(acum.dt, decalaj)}, ${oraLocala(acum.dt, decalaj)}`;
  document.getElementById("temperatura-acum").textContent = cuUnitate(acum.main.temp, "°C");
  document.getElementById("descriere-acum").textContent = acum.weather[0].description;
  document.getElementById("umiditate").textContent = cuUnitate(acum.main.humidity, "%");
  document.getElementById("presiune").textContent = cuUnitate(acum.main.pressure, "hPa");
  document.getElementById("minima").textContent = cuUnitate(Math.min(...temperaturiAzi), "°C");
  document.getElementById("maxima").textContent = cuUnitate(Math.max(...temperaturiAzi), "°C");
  seteazaImagine(document.getElementById("imagine-acum"), acum.weather[0]);

  const coordonate = `${acum.coord.lat},${acum.coord.lon}`;
  document.getElementById("harta-oras").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordonate)}`;
}

// 6. Grupăm intervalele după dată și construim cardurile în ordine.
function afiseazaPrognoza(prognoza) {
  zileContainer.replaceChildren();
  const decalaj = prognoza.city.timezone;
  const zile = {};

  for (const interval of prognoza.list) {
    const zi = cheiaZilei(interval.dt, decalaj);
    if (!zile[zi]) zile[zi] = [];
    zile[zi].push(interval);
  }

  for (const intervale of Object.values(zile)) {
    const sectiune = document.createElement("section");
    sectiune.className = "zi";
    const titlu = document.createElement("h3");
    titlu.textContent = numeleZilei(intervale[0].dt, decalaj);
    const lista = document.createElement("ul");
    lista.className = "intervale";

    for (const interval of intervale) {
      const card = document.createElement("li");
      card.className = "interval";
      const ora = document.createElement("time");
      ora.dateTime = new Date(interval.dt * 1000).toISOString();
      ora.textContent = oraLocala(interval.dt, decalaj);
      const imagine = document.createElement("img");
      imagine.width = 64;
      imagine.height = 64;
      imagine.loading = "lazy";
      seteazaImagine(imagine, interval.weather[0]);
      const temperatura = document.createElement("strong");
      temperatura.textContent = cuUnitate(interval.main.temp, "°C");
      const descriere = document.createElement("p");
      descriere.textContent = interval.weather[0].description;
      card.append(ora, imagine, temperatura, descriere);
      lista.append(card);
    }

    sectiune.append(titlu, lista);
    zileContainer.append(sectiune);
  }

  document.getElementById("rezumat-prognoza").textContent = prognoza.list.length
    ? `${prognoza.list.length} intervale, din trei în trei ore. Orele sunt afișate pentru orașul ales.`
    : "Nu sunt disponibile intervale de prognoză pentru acest oraș.";
}

// 7. Validăm formularul, pornim ambele cereri și afișăm rezultatele.
formular.addEventListener("submit", async (event) => {
  event.preventDefault();
  rezultate.hidden = true;
  zileContainer.replaceChildren();
  const oras = orasInput.value.trim();
  const cheie = cheieInput.value.trim();
  orasInput.setAttribute("aria-invalid", String(!oras));
  cheieInput.setAttribute("aria-invalid", String(!cheie));
  stare.dataset.tip = "eroare";

  if (!oras || !cheie) {
    stare.textContent = "Completează orașul și cheia API.";
    if (!oras) orasInput.focus();
    else cheieInput.focus();
    return;
  }

  butonCauta.disabled = true;
  orasInput.disabled = true;
  cheieInput.disabled = true;
  stare.dataset.tip = "incarcare";
  stare.textContent = `Căutăm vremea pentru ${oras}…`;

  try {
    const [acum, prognoza] = await Promise.all([
      citesteMeteo(construiesteURL("weather", oras, cheie)),
      citesteMeteo(construiesteURL("forecast", oras, cheie))
    ]);

    if (!acum.main || !Array.isArray(acum.weather) || !acum.weather.length || !Array.isArray(prognoza.list) || !prognoza.city) {
      throw new Error("Datele primite nu au formatul așteptat.");
    }
    afiseazaAcum(acum, prognoza);
    afiseazaPrognoza(prognoza);
    rezultate.hidden = false;
    stare.dataset.tip = "succes";
    stare.textContent = `Vremea pentru ${acum.name} a fost încărcată.`;
  } catch (eroare) {
    stare.dataset.tip = "eroare";
    stare.textContent = eroare instanceof TypeError
      ? "Nu am putut încărca vremea. Verifică conexiunea și încearcă din nou."
      : eroare.message;
  } finally {
    butonCauta.disabled = false;
    orasInput.disabled = false;
    cheieInput.disabled = false;
  }
});

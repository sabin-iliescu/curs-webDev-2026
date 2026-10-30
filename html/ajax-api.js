// Funcția returnează promisiunea: codul care o apelează poate folosi .then().
function citesteJSON(url) {
  return fetch(url).then((raspuns) => {
    if (!raspuns.ok) {
      throw new Error(`HTTP ${raspuns.status}: resursa nu a putut fi citită.`);
    }
    return raspuns.json();
  });
}

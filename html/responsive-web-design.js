// Fiecare exemplu are propria fereastră, ca să putem testa lățimi diferite.
document.querySelectorAll(".demonstratie").forEach(function (demo) {
  const fereastra = demo.querySelector(".fereastra-demo");
  const iframe = demo.querySelector("iframe");
  const stare = demo.querySelector(".stare-demo");
  const butoane = demo.querySelectorAll("button");
  let latime = 375;

  function actualizeaza() {
    const inaltime = latime === 375 ? 540 : latime === 800 ? 380 : 300;
    const scara = Math.min(1, fereastra.clientWidth / latime);
    iframe.style.width = latime + "px";
    iframe.style.height = inaltime + "px";
    iframe.style.transform = "scale(" + scara + ")";
    iframe.style.marginLeft = (fereastra.clientWidth - latime * scara) / 2 + "px";
    fereastra.style.height = inaltime * scara + 4 + "px";
  }

  butoane.forEach(function (buton) {
    buton.addEventListener("click", function () {
      latime = Number(buton.dataset.width);
      butoane.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === buton));
      });
      stare.textContent = "Lățimea exemplului: " + latime + "px.";
      actualizeaza();
    });
  });

  new ResizeObserver(actualizeaza).observe(fereastra);
  actualizeaza();
});

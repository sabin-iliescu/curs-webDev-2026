// console.log("hello");
// console.log("world");

let numar = 12;
let numarSir = "12";

// definim functia tranformInput
function transformInput(param1, param2) {
  console.log("param1 contine: ", param1);
  console.log("param2 contine: ", param2);

  let sum = param1 + param2;

  if (typeof param1 === "number") {
    return console.log("suma lui param1 si param2 este: ", sum);
  } else {
    return console.log("param1 nu este un numar");
  }

  console.log("ajunge aici!!!!!!!");
}

//  = este pentru atribuire param1 = 12
// == verifica da doua entitati sunt egale 1 == "1"
// === verifica daca doua entitati sunt egale si in
// forma si in valoare 1 === "1"

console.log(1 == "1");
console.log(1 === "1");

// invocam functia definita la linia 8
transformInput("ana are mere", numar);
// console.log("-------");
// transformInput(23, numar);
// console.log("-------");
// transformInput(23, numarSir);

// console.log(typeof numar);
// console.log(typeof numarSir);

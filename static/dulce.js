const dulceForm = document.querySelector("#dulceForm");

const dulceEditar = JSON.parse(sessionStorage.getItem("dulce"))
const coloresEditar = JSON.parse(sessionStorage.getItem("colores"))
const saboresEditar = JSON.parse(sessionStorage.getItem("sabores"));

sessionStorage.clear();

console.log(dulceEditar);
console.log(coloresEditar);
console.log(saboresEditar);


let dulces = []; //array to store user data
let editing = false; //variable para saber si estamos editando o no
let dulceId = null;

let TipoDulces = []; 
let Formas = [];
let Tamanos = [];
let Colores = [];
let Sabores = [];


function ObtenerCheckboxes(nombrecheck) {
  let array = [];
  var checkboxes = document.querySelectorAll("input[name="+nombrecheck+"]:checked");
  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value);
  }
  console.log(array);
  return array;
}

 window.addEventListener("DOMContentLoaded", async () => {
   //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading

   //Catalogo de dulces
   const responseTipos = await fetch("/api/CatalogoDulce", {
     method: "GET",
   });
   const dataTipos = await responseTipos.json();
   TipoDulces = dataTipos;
   console.log(dataTipos);

   TipoDulces.forEach((tipo) => {
     //llenamos el select de tipo de dulce
     const select = document.querySelector("#tipo");
     //opciones para el formulario tipo
     select.options.add(new Option(tipo.cd_tipo, tipo.cd_clave));
   });

   //Catalogo de formas
   const responseFormas = await fetch("/api/Formas", {
     method: "GET",
   });
   const dataFormas = await responseFormas.json();
   Formas = dataFormas;
   console.log(dataFormas);

   Formas.forEach((forma) => {
     //llenamos el select de forma
     //llenamos el select de tipo de dulce
     const select = document.querySelector("#forma");
     //opciones para el formulario tipo
     select.options.add(new Option(forma.fo_descripcion, forma.fo_clave));
   });

   //Catalogo de tamanos
   const responseTamanos = await fetch("/api/Tamanos", {
     method: "GET",
   });
   const dataTamanos = await responseTamanos.json();
   Tamanos = dataTamanos;
   console.log(dataTamanos);

   Tamanos.forEach((tamano) => {
     //llenamos el select de tamaño
     //llenamos el select de tipo de dulce
     const select = document.querySelector("#tamano");
     //opciones para el formulario tipo
     select.options.add(new Option(tamano.ta_tamano, tamano.ta_clave));
   });

   //Catalogo de colores
   const responseColores = await fetch("/api/Colores", {
     method: "GET",
   });
   const dataColores = await responseColores.json();
   Colores = dataColores;
   console.log(dataColores);

   Colores.forEach((color) => {
     //chebox dinamico para los colores
     // create the necessary elements
     var label = document.createElement("label");
     var description = document.createTextNode(color.co_nombre);
     var checkbox = document.createElement("input");

     checkbox.type = "checkbox"; // make the element a checkbox
     checkbox.name = "checkcolor"; // give it a name we can check on the server side
     checkbox.value = color.co_clave; // make its value "pair"
     checkbox.id = "checkcolor" + color.co_clave; // make its id "pair"

     label.appendChild(checkbox); // add the box to the element
     label.appendChild(description); // add the description to the element

     // add the label element to your div
     document.getElementById("colordiv").appendChild(label);
   });

   //Catalogo de sabores
   const responseSabores = await fetch("/api/Sabores", {
     method: "GET",
   });
   const dataSabores = await responseSabores.json();
   Sabores = dataSabores;
   console.log(dataSabores);

   Sabores.forEach((sabor) => {
     //checkbox dinamico para los sabores
     // create the necessary elements
     var label = document.createElement("label");
     var description = document.createTextNode(sabor.sa_descripcion);
     var checkbox = document.createElement("input");

     checkbox.type = "checkbox"; // make the element a checkbox
     checkbox.name = "checksabor"; // give it a name we can check on the server side
     checkbox.value = sabor.sa_clave; // make its value "pair"
     checkbox.id = "checksabor" + sabor.sa_clave; // make its id "pair"

     label.appendChild(checkbox); // add the box to the element
     label.appendChild(description); // add the description to the element

     // add the label element to your div
     document.getElementById("sabordiv").appendChild(label);
   });

        if (dulceEditar != null) {
          //solo si estamos editando

          const titulo = document.querySelector("#titulo");
          titulo.innerHTML = "Editar Dulce";
          
          //combobox
          const inputTipo = document.querySelector("#tipo");
          inputTipo.value = dulceEditar.cd_clave;
          const inputForma = document.querySelector("#forma");
          inputForma.value = dulceEditar.fo_clave;
          const inputTamano = document.querySelector("#tamano");
          inputTamano.value = dulceEditar.ta_clave;

          coloresEditar.forEach((color) => {
            //checkeamos los colores
            const check = document.querySelector(
              "#checkcolor" + color.co_clave
            );
            check.click();
          });

          saboresEditar.forEach((sabor) => {
            //checkeamos los sabores
            const check = document.querySelector(
              "#checksabor" + sabor.sa_clave
            );
            check.click();
          });
        } else {
          const titulo = document.querySelector("#titulo");
          titulo.innerHTML = "Crear un nuevo Dulce";}
 }); 

 if (dulceEditar != null) { //si estamos editando, cargamos los datos del dulce en el formulario
      //form
      const inputNombre = document.querySelector('[name="nombre"]');
      inputNombre.value = dulceEditar.d_nombre;
      const inputPrecio = document.querySelector('[name="precio"]');
      inputPrecio.value = dulceEditar.d_precio;
      const inputDescripcion = document.querySelector('[name="descripcion"]');
      inputDescripcion.value = dulceEditar.d_descripcion;
      const inputPeso = document.querySelector('[name="peso"]');
      inputPeso.value = dulceEditar.d_peso;

}



dulceForm.addEventListener("submit", async (e) => { //cuando tocamos el boton submit
  //debemos indicar que es codigo asincrono
  e.preventDefault(); //cancela el comportamiento por defecto del formulario

  const nombre = dulceForm["nombre"].value; //obtiene el valor del campo username
  const precio = dulceForm["precio"].value;
  const descripcion = dulceForm["descripcion"].value;
  const peso = dulceForm["peso"].value;
  const imagen = dulceForm["imagen"].value;
  const TaClave = document.getElementById("tamano").value;
  const FoClave = document.getElementById("forma").value;
  const CDClave = document.getElementById("tipo").value;

  var ColoresSeleccionados = []; //obtenemos los colores seleccionados
  ColoresSeleccionados = ObtenerCheckboxes("checkcolor")

  var SaboresSeleccionados = []; //obtenemos los sabores seleccionados
  SaboresSeleccionados = ObtenerCheckboxes("checksabor");

  if (dulceEditar == null) { //si estamos editando, actualizamos el dulce
    //si no estamos editando
    const response = await fetch("/api/Dulce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //asi indicamos que el contenido es json
      },
      body: JSON.stringify({
        //debemos enviarlo como json
        nombre,
        precio,
        descripcion,
        peso,
        imagen,
        TaClave,
        FoClave,
        CDClave,
        ColoresSeleccionados,
        SaboresSeleccionados
      }), //enviamos la informacion al servidor
    });

    const data = await response.json(); //obtenemos la respuesta del servidor
    dulces.unshift(data); //agregamos el usuario al array
    console.log(data);
    
  } else {

    //si estamos editando
    const response = await fetch(`/api/Dulce/${dulceEditar.d_clave}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //asi indicamos que el contenido es json
      },
      body: JSON.stringify({
        //debemos enviarlo como json
        nombre,
        precio,
        descripcion,
        peso,
        imagen,
        TaClave,
        FoClave,
        CDClave,
        ColoresSeleccionados,
        SaboresSeleccionados,
      }), //enviamos la informacion al servidor
    });

    editing = false;
    dulceId = null;
  }

  dulceForm.reset(); //limpia el formulario
  location.href = "/static/admin.html"
});


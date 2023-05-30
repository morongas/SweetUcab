let dulces = []; //array to store dulces
let colores = [];
let sabores = [];

window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
  const responseDulces = await fetch("/api/Dulce", {
    //fetch is a built-in JavaScript function that performs an HTTP request
    method: "GET",
  });
  const dataDulces = await responseDulces.json(); //debemos pasar la respuesta a json para que sea usable
  dulces = dataDulces;

  renderUser(dulces);
});

async function renderUser(dulces) {
  //funcion para renderizar los dulces
  const dulceList = document.querySelector("#dulceList");
  dulceList.innerHTML = "";

  for (const dulce of dulces) {
    const responseTamanos = await fetch(`/api/Tamanos/${dulce.ta_clave}`, {
      method: "GET",
    });
    const dataTamanos = await responseTamanos.json();
    tamanos = dataTamanos;
    console.log(tamanos);

    const responseFormas = await fetch(`/api/Formas/${dulce.fo_clave}`, {
      method: "GET",
    });
    const dataFormas = await responseFormas.json();
    formas = dataFormas;
    console.log(formas);

    const responseTipos = await fetch(`/api/CatalogoDulce/${dulce.cd_clave}`, {
      method: "GET",
    });
    const dataTipos = await responseTipos.json();
    tipos = dataTipos;
    console.log(tipos);

    const responseSabores = await fetch(`/api/Dulce/${dulce.d_clave}/Sabor`, {
      method: "GET",
    });
    const dataSabores = await responseSabores.json(); //debemos pasar la respuesta a json para que sea usable
    sabores = dataSabores;

    console.log(sabores);

    let textoSabores = "";
    for (const sabor of sabores) {
      textoSabores = textoSabores.concat(" - ", sabor.sa_descripcion);
    }

    const responseColores = await fetch(`/api/Dulce/${dulce.d_clave}/Color`, {
      method: "GET",
    });
    const dataColores = await responseColores.json(); //debemos pasar la respuesta a json para que sea usable
    colores = dataColores;

    let textoColores = "";
    for (const color of colores) {
      textoColores = textoColores.concat(" - ", color.co_nombre);
    }

    console.log(colores);

    const dulceItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    dulceItem.classList = "list-group-item "; //le agrega una clase
    dulceItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>${dulce.d_nombre} </h3>
              <p> COD:
                <input  style="text-align:center;" type="text" id="d_clave" name="country" value=${dulce.d_clave} maxlength="1" size="1" readonly>
              </p>
            </fieldset>
            <div>
                <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                <button class="btn-edit btn btn-secondary btn-sm">Editar</button>
            </div>
        </header>
        <h1><img src="/static/imagenes/sweetucab.png"></h1>
        <p>${dulce.d_descripcion}</p>
        <p>Peso = ${dulce.d_peso}   |   Tipo = ${tipos[0].cd_tipo}</p>        
        <p>Forma = ${formas[0].fo_descripcion}  |   Tamano = ${tamanos[0].ta_tamano}</p>
        <p>Colores:</p>
        <p>${textoColores}</p>
        <p>Sabores:</p>
        <p>${textoSabores}</p>
        <center>
        <h3>Precio = ${dulce.d_precio} Bs</h3>
        <p></p>
        </div>
        </center>
        `;

    //boton para eliminar dulce
    const btnDelete = dulceItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual
    btnDelete.addEventListener("click", async () => {
      //agregamos un evento click al boton
      const response = await fetch(`/api/Dulce/${dulce.d_clave}`, {
        //agregamos una peticion fetch al boton para eliminar el usuario
        method: "DELETE",
      });
      const data = await response.json(); //obtenemos la respuesta del servidor

      dulces = dulces.filter((dulce) => dulce.d_clave !== data.d_clave); //eliminamos el usuario del array
      //el array dulces se actualzia con el metodo filter, donde comparamos los ids de los usuarios
      //si el id del usuario no es igual al id del usuario que se elimina, se agrega al array

      renderUser(dulces); //actualizamos la lista de usuarios
    });

    //boton para editar un dulce
    const btnEdit = dulceItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual
    btnEdit.addEventListener("click", async () => {

        //regresamos a la ventana de dulce
        sessionStorage.setItem("dulce", JSON.stringify(dulce));
        sessionStorage.setItem("colores", JSON.stringify(colores));
        sessionStorage.setItem("sabores", JSON.stringify(sabores));
        location.href = "/static/dulce.html";

        /*const response = await fetch(`/api/Dulce/${userId}`, {
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
            SaboresSeleccionados
          }), //enviamos la informacion al servidor
        }); */
      
    });

    dulceList.append(dulceItem); //se agregam los elementos recien creados a dulceList
  }
}


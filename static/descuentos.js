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
       // console.log(tamanos);

        const responseFormas = await fetch(`/api/Formas/${dulce.fo_clave}`, {
            method: "GET",
        });
        const dataFormas = await responseFormas.json();
        formas = dataFormas;
       // console.log(formas);

        const responseTipos = await fetch(`/api/CatalogoDulce/${dulce.cd_clave}`, {
            method: "GET",
        });
        const dataTipos = await responseTipos.json();
        tipos = dataTipos;
        //console.log(tipos);

        const responseSabores = await fetch(`/api/Dulce/${dulce.d_clave}/Sabor`, {
            method: "GET",
        });
        const dataSabores = await responseSabores.json(); //debemos pasar la respuesta a json para que sea usable
        sabores = dataSabores;

       // console.log(sabores);

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

        //console.log(colores);

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
        <label for="customRange" class="form-label">Descuento a asignar</label>
        <div class="slidecontainer">
        <input type="range" min="0" max="99" value="0" class="slider" id="rango">
        <p>Value: <span id="demo"></span></p>
        </div>
        </center>
        `;

        const slider = dulceItem.querySelector(".slider");
        const output = dulceItem.querySelector("#demo");
        output.innerHTML = slider.value; // Display the default slider value

        slider.oninput = function () {
            output.innerHTML = this.value;
        };



        dulceList.append(dulceItem); //se agregam los elementos recien creados a dulceList
    }
}

//boton para comprar
const btnComprar = document.querySelector(".big-button"); //obtenemos el boton comprar
btnComprar.addEventListener("click", async () => {
    console.log(dulces);

    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    ul = document.getElementById("dulceList");
    li = ul.getElementsByTagName("li");

    var cod = [];
    var cant = [];
    let po_monto = 0;

    // Pasamos por todos los items de la lista para ir sumando las cantidades
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("input")[0];
        cod.push(a.value); //metemos los codigos en un array

        b = li[i].getElementsByTagName("span")[0];
        cant.push(b.textContent); //metemos las cantidades en un array
    }

    console.log(cod);
    console.log(cant);

    let d_clave
    const  date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth();
    const yyyy = date.getFullYear();
    const de_fechainicio = new Date(yyyy, mm, dd);
    console.log(de_fechainicio);
    const aux = new Date (yyyy, mm, dd);
    const de_fechafin = new Date(aux.setDate(de_fechainicio.getDate() + 20));
    console.log(de_fechafin);
    
    for(i=0;i<cant.length;i++){
            if(cant[i]>0){
                d_clave = cod[i];
                de_porcentaje = cant[i];
                const response = await fetch('/api/descuento', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        d_clave: d_clave,
                        de_porcentaje: de_porcentaje,
                        de_fechainicio: de_fechainicio,
                        de_fechafin: de_fechafin
                    }),
                })

                const data = await response.json()
                console.log(data)

            }
    }
    
});


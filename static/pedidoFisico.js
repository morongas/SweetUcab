let dulces = []; //array to store dulces
let colores = [];
let sabores = [];
let detalles = []; 

const clienteNatural = sessionStorage.getItem("tipo");
const t_clave = sessionStorage.getItem("t_clave");
const u_nombre = sessionStorage.getItem("u_nombre");
const em_clave = sessionStorage.getItem("em_clave");
const claveCliente = sessionStorage.getItem("data");
sessionStorage.setItem("data2", claveCliente);


console.log(claveCliente);
console.log(clienteNatural);
console.log(t_clave);


window.addEventListener("DOMContentLoaded", async () => {
  const responseDulces = await fetch("/api/Dulce", {
    method: "GET",
  });
  const dataDulces = await responseDulces.json(); //debemos pasar la respuesta a json para que sea usable
  dulces = dataDulces;

  const responseAlmacen = await fetch(`/api/almacen/${t_clave}`, {
    method: "GET",
  });
  const dataAlmacen = await responseAlmacen.json(); //debemos pasar la respuesta a json para que sea usable
  alm_codigo = dataAlmacen[0].alm_codigo;


  renderUser(dulces, alm_codigo);
});

async function renderUser(dulces, alm_codigo) {

  let max = 0;

  //funcion para renderizar los dulces
  const dulceList = document.querySelector("#dulceList");
  dulceList.innerHTML = "";

  for (const dulce of dulces) {

    const responseInventario = await fetch(`/api/inventario/${alm_codigo}/${dulce.d_clave}`, { 
      method: "GET",
    });
    const dataInventario = await responseInventario.json();
    inventario = dataInventario;
    max = inventario[0].in_cantidad; //obtenemos la cantidad maxima de un dulce en el almacen
    console.log("maximo de dulce   " + max);

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
        <label for="customRange" class="form-label">Cantidad a Comprar</label>
        <div class="slidecontainer">
        <input type="range" min="0" max=${max} value="0" class="slider" id="rango">
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
    let pf_monto = 0;

    // Pasamos por todos los items de la lista para ir sumando las cantidades
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("input")[0];
      cod.push(a.value); //metemos los codigos en un array

      b = li[i].getElementsByTagName("span")[0];
      cant.push(b.textContent); //metemos las cantidades en un array
    }

    console.log(cod);
    console.log(cant);

    const descuentos = await fetch(`/api/descuento`, {
      method: "GET",
    });
    const dataDescuentos = await descuentos.json();
    console.log(dataDescuentos);

    for (i = 0; i < dulces.length; i++) {
        console.log("Productos a Comprar:");
        console.log(
          dulces[i].d_nombre +
            " - Precio Total:" +
            dulces[i].d_precio * cant[i] +
            " Bs Cantidad: " +
            cant[i]
        );

        if (dataDescuentos[0] != null) {
          console.log(dulces[i].d_clave);
          const desc = await fetch(`/api/descuento/${dulces[i].d_clave}`, {
            method: "GET",
          });
          const descuentos = await desc.json();
          console.log(descuentos);
          if (descuentos[0] != null) {
            aux =
              (dulces[i].d_precio -
                (dulces[i].d_precio * descuentos[0].de_porcentaje) / 100) *
              cant[i];
            pf_monto = pf_monto + aux;
          } else {
            pf_monto += dulces[i].d_precio * cant[i];
          }
        } else {
          pf_monto += dulces[i].d_precio * cant[i];
        }
        console.log("monto sumando: " + pf_monto);
    }

    let cn_clave;
    let cj_clave;
    if (clienteNatural == "true") {
      cn_clave = claveCliente;
      cj_clave = null;
      sessionStorage.setItem("cliente", cn_clave);
    } else {
      cj_clave = claveCliente;
      cn_clave = null;
      sessionStorage.setItem("cliente", cj_clave);
    }
    console.log(cn_clave);
    console.log(cj_clave);
    //creamos el pedido Fisico antes de crear el detalle
    const responsePedidoFisico = await fetch("/api/Pedido_Fisico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //asi indicamos que el contenido es json
      },
      body: JSON.stringify({
        //debemos enviarlo como json
        pf_monto,
        cn_clave,
        cj_clave,
        t_clave
      }), //enviamos la informacion al servidor
    });
    const dataPedidoFisico = await responsePedidoFisico.json(); //obtenemos la respuesta del servidor
    console.log(dataPedidoFisico);

    //creamos el detalle del pedido
    for (i = 0; i < dulces.length; i++) {
      //tantos detalles como productos seleccionados
      if (cant[i] != 0) {
        const d_clave = dulces[i].d_clave;
        const pf_clave = dataPedidoFisico.pf_clave;
        const po_clave = null;
        const rs_clave = null;
       
        const dp_preciounitario = dulces[i].d_precio;
        const dp_cantidad = cant[i];

        const response = await fetch("/api/Detalle_Pedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", //asi indicamos que el contenido es json
          },
          body: JSON.stringify({
            //debemos enviarlo como json
            d_clave,
            pf_clave,
            po_clave,
            rs_clave,
            t_clave,
            dp_preciounitario,
            dp_cantidad,
          }), //enviamos la informacion al servidor
        });
        const data = await response.json(); //obtenemos la respuesta del servidor
        console.log(data);
        detalles.push(data);

      }

    }

    sessionStorage.setItem("detalles", JSON.stringify(detalles));

    //Ahora generamos el estatus del pedido
    const ep_clave = 1; //siempre empieza con estado en 1
    const pf_clave = dataPedidoFisico.pf_clave;

    const responseEPF = await fetch("/api/Estatus_Pedido_Fisico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ep_clave,
        pf_clave,
      }),
    });

    const dataEPF = await responseEPF.json(); //obtenemos la respuesta del servidor
    console.log(dataEPF);

    console.log(clienteNatural);
    console.log(dataPedidoFisico.pf_clave);
    console.log(cn_clave);
    console.log(cj_clave);
    sessionStorage.setItem("tipoC", clienteNatural);
    sessionStorage.setItem("ped", JSON.stringify(dataPedidoFisico));
    location.href = "/static/preguntaPago.html";
  });

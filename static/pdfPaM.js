
const claveped = sessionStorage.getItem("claveP");
const cantidades = JSON.parse(sessionStorage.getItem("cantidades"))


window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
  const responsePedido = await fetch(`/api/Pedido_Fisico/${claveped}`, {
    //fetch is a built-in JavaScript function that performs an HTTP request
    method: "GET",
  });
  const dataPedido = await responsePedido.json(); //debemos pasar la respuesta a json para que sea usable
  pedido = dataPedido;
  console.log(pedido);
  renderUser(pedido);
});

async function renderUser(pedido) {
  //funcion para renderizar los pedidos
  //buscamos la lista de estatus del pedido actual
  const responseEstatus = await fetch(
    `/api/Estatus_Pedido_Fisico/PF_Clave/${claveped}`,
    {
      method: "GET",
    }
  );
  const dataEstatus = await responseEstatus.json();
  console.log(dataEstatus);

  //buscamos el estado actual del pedido (el mas reciente)
  const responseEstado = await fetch(
    `/api/Estado_del_Pedido/${dataEstatus[0].ep_clave}`,
    {
      method: "GET",
    }
  );
  const dataEstado = await responseEstado.json();
  console.log(dataEstado);

  let cliente = "";
  let cliente2 = "";
  let cliente3 = "";
  //tambien debo buscar de que cliente es el pedido
  if (pedido[0].cn_clave != null) {
    //el pedido lo hizo un cliente natural
    const responseCN = await fetch(
      `/api/Cliente_Natural/${pedido[0].cn_clave}`,
      {
        method: "GET",
      }
    );
    const dataCN = await responseCN.json();
    cliente = "Cedula: " + dataCN.cn_ci;
    cliente2 = "Nombre: " + dataCN.cn_pnombre + " " + dataCN.cn_papellido;
    cliente3 = "Rif: " + dataCN.cn_rif;
  } else {
    //el pedido lo hizo un cliente juridico
    const responseClienteJ = await fetch(
      `/api/Cliente_Juridico/${pedido[0].cj_clave}`,
      {
        method: "GET",
      }
    );
    const dataCJ = await responseClienteJ.json();
    cliente = "rif: " + dataCJ.cj_rif;
    cliente2 = "Den. Social: " + dataCJ.cj_denominacionsocial;
    cliente3 = "Razon Social: " + dataCJ.cj_razonsocial;
  }

  //hay que agregarle la fecha pero primero hay que actualizar la base de datos
  //<h2>Fecha = ${pedido.po_fecha}</h2>;

  const pedidoItem = document.querySelector("#insertar"); //crea un elemento li (de lista)
  //en este caso creamos un elemento li con el contenido del usuario
  //en este elemento tambien se agregan elementos de html como los botones
  pedidoItem.classList = "list-group-item "; //le agrega una clase
  pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>Pedido de : ${cliente} </h3>
              <h3>${cliente2} </h3>
               <h3>${cliente3} </h3>
            </fieldset>
        </header>
        <center>
        <p></p>
        <h3>Monto = ${pedido[0].pf_monto} Bs</h3>
        <h3>Fecha = ${pedido[0].pf_fecha}</h3>
        <p></p>
        <p>Estatus = Pagado</p>
        <p></p>
        </div>
        <h2>Detalles del Pedido</h2>
            <div>
                <form action=""></form>
                <ul id="dulceList" class="list-group"></ul> 
            </div>
        </center>
        `;

  //ya tengo pedido ahora me voy a mi detalle de ese pedido
  let detalles = [];
  const responseDetalles = await fetch(
    `/api/Detalle_Pedido_Fisico/${pedido[0].pf_clave}`,
    {
      method: "GET",
    }
  );
  const dataDetalles = await responseDetalles.json();
  detalles = dataDetalles;
  console.log(detalles);

  const detalleList = pedidoItem.querySelector("#dulceList");
  detalleList.innerHTML = "";

  for (const detalle of detalles) {
    //cuando tenemos cada detalle, capturamos el id del dulce
    const responseDulce = await fetch(`/api/Dulce/${detalle.d_clave}`, {
      method: "GET",
    });
    const dataDulce = await responseDulce.json();
    dulce = dataDulce;
    console.log(dulce);

    const dulceItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    dulceItem.classList = "list-group-item "; //le agrega una clase
    dulceItem.innerHTML = `
                        <header class="d-flex justify-content-between align-items-center">
                            <fieldset>
                            <h3>${dulce.d_nombre} </h3>
                            </fieldset>
                        </header>
                        <p>${dulce.d_descripcion}</p>
                        <p>Precio por Gramo: ${Math.round((parseInt(dulce.d_precio) / parseInt(dulce.d_peso)) * 100) /100} Bs</p>        
                        <p>Cantidad: ${cantidades[dulce.d_clave]} (Grs) </p>

                        `;

    detalleList.append(dulceItem); //se agregam los elementos recien creados a pedidoList
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector("#generar");
  boton.addEventListener("click", () => {
    const elementoParaConvertir = document.body;
    html2pdf()
       .set({
                margin: 1,
                filename: 'Factura PAM.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: window.devicePixelRatio, windowWidth: elementoParaConvertir.clientWidth, windowHeight: elementoParaConvertir.clientHeight, scrollX: Window.innerWidth, scrollY: Window.innerHeight },
                jsPDF: { unit: 'mm', format: 'tabloid', orientation: 'landscape' , compress: false, precision:2 },
                optimize_layout: true,
                page_size: 'Tabloid',
                zoom_level: 0,

            })
      .from(elementoParaConvertir)
      .save()
      .catch((err) => console.error(err))
      .then(() => {
        alert("Se ha generado la factura");
        location.href = "/static/usuario.html";
      });
  });
});

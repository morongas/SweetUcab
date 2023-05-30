const claveped = sessionStorage.getItem("claveP");

const detalles = JSON.parse(sessionStorage.getItem("detalles"))
const pedido = JSON.parse(sessionStorage.getItem("pedido"));

window.addEventListener("DOMContentLoaded", async () => {

  const response = await fetch(`/api/tienda/n/${pedido.t_clave}`, {
    method: "GET",
  });
  const tienda = await response.json();
  renderUser(pedido, tienda);
});

async function renderUser(pedido, tienda) {

  //hay que agregarle la fecha pero primero hay que actualizar la base de datos
  //<h2>Fecha = ${pedido.po_fecha}</h2>;

  const pedidoItem = document.querySelector("#insertar"); //crea un elemento li (de lista)
  //en este caso creamos un elemento li con el contenido del usuario
  //en este elemento tambien se agregan elementos de html como los botones
  pedidoItem.classList = "list-group-item "; //le agrega una clase
  pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>Pedido de Tienda: ${tienda.t_nombre} </h3>
            </fieldset>
        </header>
        <center>
        <p></p>
        <h3>Fecha = ${pedido.rs_fecha}</h3>
        <p></p>
        <p>Estatus = Completado</p>
        <b>Almacen: ${pedido.t_clave}</b></p>
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
                        <p>Cantidad : ${detalle.dp_cantidad} </p>
                        <p><b>Zona : ${dulce.d_clave} </b></p>

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
                filename: 'ReStock.pdf',
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

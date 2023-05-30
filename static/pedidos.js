let pedidos = []; //array to store pedidos
let pedidosr = []; //array to store restocks 

window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
  const responsePedidos = await fetch("/api/Pedido_Online", {
    //fetch is a built-in JavaScript function that performs an HTTP request
    method: "GET",
  });
  const dataPedidos = await responsePedidos.json(); //debemos pasar la respuesta a json para que sea usable
  pedidos = dataPedidos;
  console.log(pedidos);
  renderUser(pedidos);

   const responsePedidosr = await fetch("/api/Pedido_ReStock", {
     method: "GET",
   });
   const dataPedidosr = await responsePedidosr.json(); //debemos pasar la respuesta a json para que sea usable
   pedidosr = dataPedidosr;
   console.log(pedidosr);
   renderRs(pedidosr);
});

async function renderUser(pedidos) {
  //funcion para renderizar los pedidos
  const pedidoList = document.querySelector("#pedidoList");
  pedidoList.innerHTML = "";

  for (const pedido of pedidos) {

    console.log("hola "+pedido.po_clave);
    //buscamos la lista de estatus del pedido actual
    const responseEstatus = await fetch(
      `/api/Estatus_Pedido_Online/PO_Clave/${pedido.po_clave}`,
      {
        method: "GET",
      }
    );
    const dataEstatus = await responseEstatus.json();
    console.log(dataEstatus);

    console.log(dataEstatus[0].ep_clave);
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
    //tambien debo buscar de que cliente es el pedido
    if (pedido.cn_clave != null) {
      //el pedido lo hizo un cliente natural
      const responseCN = await fetch(
        `/api/Cliente_Natural/${pedido.cn_clave}`,
        {
          method: "GET",
        }
      );
      const dataCN = await responseCN.json();
      console.log(dataCN);
      cliente = dataCN.cn_ci;
    } else {
      //el pedido lo hizo un cliente juridico
      const responseClienteJ = await fetch(
        `/api/Cliente_Juridico/${pedido.cj_clave}`,
        {
          method: "GET",
        }
      );
      const dataCJ = await responseCJ.json();
      cliente = dataCJ[0].cj_rif;
      console.log(cliente);
    }

    //hay que agregarle la fecha pero primero hay que actualizar la base de datos
    //<h2>Fecha = ${pedido.po_fecha}</h2>;

    const pedidoItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    pedidoItem.classList = "list-group-item "; //le agrega una clase
    pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>Pedido de Cliente: ${cliente} </h3>
            </fieldset>
            <div>
                <button class="btn-edit btn btn-secondary btn-sm">Cambiar Estatus</button>
                <button class="btn-primary btn btn-danger btn-sm id="abrir">Ver Detalles</button>
            </div>
        </header>
        <center>
        <p></p>
        <h3>Monto = ${pedido.po_monto} Bs</h3>
        <h3>Fecha = ${pedido.po_fecha}</h3>
        <p></p>
        <p>Estatus = ${dataEstado[0].ep_tipo}</p>
        <p></p>
        </div>
        <dialog id="modal" class="col-md-4 offset-md-4 center">
        <h2>Detalles del Pedido</h2>
            <div>
                <form action=""></form>
                <ul id="dulceList" class="list-group"></ul> 
            </div>
        <button id="cerrar">Cerrar</button>
        </dialog>
        </center>
        `;

    //ya tengo pedido ahora me voy a mi detalle de ese pedido
    let detalles = [];
    const responseDetalles = await fetch(
      `/api/Detalle_Pedido_Online/${pedido.po_clave}`,
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
                        <h1><img src="/static/imagenes/sweetucab.png"></h1>
                        <p>${dulce.d_descripcion}</p>
                        <p>Precio : ${dulce.d_precio} </p>        
                        <p>Cantidad : ${detalle.dp_cantidad} </p>

                        `;

      detalleList.append(dulceItem); //se agregam los elementos recien creados a pedidoList

      const btnAbrirModal = pedidoItem.querySelector(".btn-primary"); //obtenemos el boton edit del item actual
      const btnCerrarModal = pedidoItem.querySelector("#cerrar"); //obtenemos el boton edit del item actual
      const modal = pedidoItem.querySelector("#modal");

      btnAbrirModal.addEventListener("click", async () => {
        modal.showModal();
      });
      btnCerrarModal.addEventListener("click", async () => {
        modal.close();
      });
    }
    pedidoList.append(pedidoItem); //se agregam los elementos recien creados a pedidoList

    let po_clave = pedido.po_clave;
    //boton para cambiar el estatus del pedido
    const btnEdit = pedidoItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual
    btnEdit.addEventListener("click", async () => {
      console.log(po_clave);
      const response = await fetch(`/api/Estatus_Pedido_Online`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          po_clave,
        }), //enviamos la informacion al servidor
      });

      const data = await response.json(); //obtenemos la respuesta del servidor
      console.log(data);

      location.reload();

    });
  }
}

async function renderRs(pedidos) {
  //funcion para renderizar los pedidos
  const pedidoList = document.querySelector("#pedidoList");
  pedidoList.innerHTML = "";

  for (const pedido of pedidos) {
    console.log("hola " + pedido.rs_clave);

    const responseEstatus = await fetch(
      `/api/Estatus_Pedido_ReStock/RS_Clave/${pedido.rs_clave}`,
      {
        method: "GET",
      }
    );
    const dataEstatus = await responseEstatus.json();
    console.log(dataEstatus);

    console.log(dataEstatus[0].ep_clave);
    //buscamos el estado actual del pedido (el mas reciente)
    const responseEstado = await fetch(
      `/api/Estado_del_Pedido/${dataEstatus[0].ep_clave}`,
      {
        method: "GET",
      }
    );
    const dataEstado = await responseEstado.json();
    console.log(dataEstado);

    let tienda = "";

    const pedidoItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    pedidoItem.classList = "list-group-item "; //le agrega una clase
    pedidoItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>Pedido de Tienda: ${pedido.t_clave} </h3>
            </fieldset>
            <div>
                <button class="btn-edit btn btn-secondary btn-sm">Cambiar Estatus</button>
                <button class="btn-primary btn btn-danger btn-sm id="abrir">Ver Detalles</button>
            </div>
        </header>
        <center>
        <p></p>
        <h3>Fecha = ${pedido.rs_fecha}</h3>
        <p></p>
        <p>Estatus = ${dataEstado[0].ep_tipo}</p>
        <p></p>
        </div>
        <dialog id="modal" class="col-md-4 offset-md-4 center">
        <h2>Detalles del Pedido</h2>
            <div>
                <form action=""></form>
                <ul id="dulceList" class="list-group"></ul> 
            </div>
        <button id="cerrar">Cerrar</button>
        </dialog>
        </center>
        `;

    //ya tengo pedido ahora me voy a mi detalle de ese pedido
    let detalles = [];
    const responseDetalles = await fetch(
      `/api/Detalle_Pedido_ReStock/${pedido.rs_clave}`,
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
                        <h1><img src="/static/imagenes/sweetucab.png"></h1>
                        <p>${dulce.d_descripcion}</p>
                        <p>Cantidad : ${detalle.dp_cantidad} </p>

                        `;

      detalleList.append(dulceItem); //se agregam los elementos recien creados a pedidoList

      const btnAbrirModal = pedidoItem.querySelector(".btn-primary"); //obtenemos el boton edit del item actual
      const btnCerrarModal = pedidoItem.querySelector("#cerrar"); //obtenemos el boton edit del item actual
      const modal = pedidoItem.querySelector("#modal");

      btnAbrirModal.addEventListener("click", async () => {
        modal.showModal();
      });
      btnCerrarModal.addEventListener("click", async () => {
        modal.close();
      });
    }

    if (dataEstatus[0].ep_clave <= 5){
    pedidoList.append(pedidoItem); //se agregam los elementos recien creados a pedidoList
    }
    
    let rs_clave = pedido.rs_clave;
    //boton para cambiar el estatus del pedido
    const btnEdit = pedidoItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual
    btnEdit.addEventListener("click", async () => {
      console.log(rs_clave);
      const response = await fetch(`/api/Estatus_Pedido_ReStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //asi indicamos que el contenido es json
        },
        body: JSON.stringify({
          //debemos enviarlo como json
          rs_clave,
        }), //enviamos la informacion al servidor
      });

      const data = await response.json(); //obtenemos la respuesta del servidor
      console.log(data);

      location.reload();
    });
  }
}


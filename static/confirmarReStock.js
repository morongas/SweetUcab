////////////
//ESTO SOLO LO VE EL JEFE DE PASILLO
///////

let pedidosr = []; //array to store restocks
let t_clave = sessionStorage.getItem("t_clave");


window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
  
  const responsePedidosr = await fetch(
    `/api/Pedido_ReStock/t_clave/${t_clave}`,
    {
      method: "GET",
    }
  );
  const dataPedidosr = await responsePedidosr.json(); //debemos pasar la respuesta a json para que sea usable
  pedidosr = dataPedidosr;
  console.log(pedidosr);
  renderRs(pedidosr);
});

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

    //buscamos el estado actual del pedido (el mas reciente)
    const responseEstado = await fetch(
      `/api/Estado_del_Pedido/${dataEstatus[0].ep_clave}`,
      {
        method: "GET",
      }
    );
    const dataEstado = await responseEstado.json();
    console.log(dataEstado);

    if (dataEstatus[0].ep_clave >= 5){ //el rs ya esta entregado 

        let boton = `<button class="btn-edit btn btn-secondary btn-sm">Confirmar ReStock</button>`;

            if (dataEstatus[0].ep_clave == 6){ //el rs ya esta entregado
                boton = ``;
            }

                const pedidoItem = document.createElement("li"); //crea un elemento li (de lista)
                //en este caso creamos un elemento li con el contenido del usuario
                //en este elemento tambien se agregan elementos de html como los botones
                pedidoItem.classList = "list-group-item "; //le agrega una clase
                pedidoItem.innerHTML = `
                    <header class="d-flex justify-content-between align-items-center">
                        <fieldset>
                        <h3>Pedido de Tienda: ${t_clave} </h3>
                        </fieldset>
                        <div>
                            ${boton}
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
                pedidoList.append(pedidoItem); //se agregam los elementos recien creados a pedidoList

                let rs_clave = pedido.rs_clave;

                 if (dataEstatus[0].ep_clave == 5) {
                        //boton para confirmar el restock
                        const btnEdit = pedidoItem.querySelector(".btn-edit"); 
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

                        ////
                        //ahora sumamos los caramelos que se pidieron
                        ////
                        //usamos detalles

                        for (const detalle of detalles) {

                                const responsesuma = await fetch(`/api/suma_zona_almacen/${detalle.d_clave}/${t_clave}/${10000}`, {
                                    method: "PUT",
                                });
                                const dataSuma = await responsesuma.json();
                                console.log(dataSuma);

                                //Ahora debo revisar los pasillos y sumarle 100 al pasillo si faltan caramelos (menos de 20)
                                //(saco los caramelos del almacen)
                                const responsesumaPasillo = await fetch(`/api/suma_zona_pasillo/${detalle.d_clave}/${t_clave}`, {
                                    method: "PUT",
                                });
                                //const dataSuma = await responsesuma.json();

                        }
                        //por ultimo actualizamos el inventario
                        const response2 = await fetch(`/api/actualizar_inventario/${t_clave}`,
                        {
                            method: "PUT",
                        }
                        );

                        alert("Se ha confirmado el ReStock");


                        sessionStorage.setItem("detalles", JSON.stringify(detalles));
                        sessionStorage.setItem("pedido", JSON.stringify(pedido));
                        location.href = "/static/pdfrestock.html";
                        });
                }
            }
    }
}

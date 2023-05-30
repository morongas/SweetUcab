////////////
//ESTO SOLO LO VE EL JEFE DE PASILLO
///////

let pedidosr = []; //array to store restocks
let t_clave = sessionStorage.getItem("t_clave");
//t_clave = 1;

window.addEventListener("DOMContentLoaded", async () => {

  const responsePedidosr = await fetch(
    `/api/pedidosPasillo/${t_clave}`,
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
    
    if (pedidos.length == 0){
        const pedidoItem = document.createElement("li");
        pedidoItem.classList = "list-group-item ";
        pedidoItem.innerHTML = `<center><h5 class="list-group-item-heading">Todo en Orden jeje</h5></center>`;
        pedidoList.append(pedidoItem);
        return;
    }

  for (const pedido of pedidos) {

     const rdulce = await fetch(`/api/Dulce/${pedido.d_clave}`, {
       method: "GET",
     });
     const dulce = await rdulce.json(); //debemos pasar la respuesta a json para que sea usable
     console.log(dulce);

      const pedidoItem = document.createElement("li"); //crea un elemento li (de lista)
      //en este caso creamos un elemento li con el contenido del usuario
      //en este elemento tambien se agregan elementos de html como los botones
      pedidoItem.classList = "list-group-item "; //le agrega una clase
      pedidoItem.innerHTML = `
                    <header class="d-flex justify-content-between align-items-center">
                        <fieldset>
                        <h3>Alerta de Tienda: ${t_clave} </h3>
                        </fieldset>
                        <div>
                            <button class="btn-primary btn btn-danger btn-sm id="abrir">Aceptar</button>
                        </div>
                    </header>
                    <center>
                    <p></p>
                    <h3>Fecha = ${pedido.pp_fecha}</h3>
                    <p></p>
                    <p>Se pasaron ${pedido.pp_cantidad} Ud. del Almacen al <br>
                    <b>Pasillo: ${pedido.t_clave} | Zona: ${dulce.d_clave}</b></p>
                    <p>Dulce = ${dulce.d_nombre}</p>
                    <p>Cantidad = ${pedido.pp_cantidad}</p>
                    <p></p>
                    </div>
                    </center>
                    `;

        //boton para confirmar el restock
        const btnEdit = pedidoItem.querySelector(".btn-primary");
        btnEdit.addEventListener("click", async () => {

          const response = await fetch(
            `/api/pedidosPasillo/${pedido.pp_clave}`,
            {
              method: "DELETE",
            }
          );
          const data = await response.json(); //obtenemos la respuesta del servidor
          console.log(data);

          location.reload();
        });
      
    pedidoList.append(pedidoItem);
  }
}

const cliente = sessionStorage.getItem("cliente")
const pedido1 = sessionStorage.getItem("ped")
const tipo = sessionStorage.getItem("tipoC")

const total = document.querySelector("#total")

console.log(cliente)
console.log(pedido1)
console.log(tipo)


var pedido = JSON.parse(pedido1).po_monto
console.log(pedido)
var tipoC = tipo
let formasPago = [];

let cn_clave
let cj_clave
window.addEventListener("DOMContentLoaded", async () => {

    if(tipo === "true"){
        cn_clave = cliente
        cj_clave = null;
        const responseFP = await fetch(`/api/forma_de_pago/${cn_clave}/1`, {
            method: "GET",
        });
        const pagos = await responseFP.json(); //debemos pasar la respuesta a json para que sea usable
        formasPago = pagos
    }else{
        cj_clave = cliente
        cn_clave = null;
        const responseFP = await fetch(`/api/forma_de_pago/${cj_clave}/2`, {
            method: "GET",
        });
        const pagos = await responseFP.json(); //debemos pasar la respuesta a json para que sea usable
        formasPago = pagos
    }

    total.value = pedido
    console.log(formasPago);
    renderUser(formasPago);
});



async function renderUser(pagos) {
    //funcion para renderizar los usuarios
    const pagoList = document.querySelector("#rolesList");
    pagoList.innerHTML = "";

    for (const pago of pagos) {

        if (pago.tipo_fp === "Efectivo") {
        } else {

        const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
        //en este caso creamos un elemento li con el contenido del usuario
        //en este elemento tambien se agregan elementos de html como los botones
        usuarioItem.classList = "list-group-item "; //le agrega una clase
        usuarioItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3> Tipo: ${pago.tipo_fp} </h3>
              <p> Titular:
                ${pago.fp_titular}
              </p>
              <p id = "cpuntos"></p>
            </fieldset>
            <div>
                <button class="btn-edit btn btn-danger btn-sm">Agregar</button>
                <input type="integer"
                    id="cant"
                    placeholder="Monto"	
                    class="form-control mb-2"
                />
            </div>
        </header>
        <p></p>
        
        </div>
        </center>
        `;

         let cpuntos = null;
         if (pago.tipo_fp === "Punto") {
          cpuntos = `Cantidad Disponible: ${pago.fp_cantidad}<p>1 Punto = 5 Bs</p><small><i>(Ingresar monto expresado en puntos)</i></small>`;
           usuarioItem.querySelector("#cpuntos").innerHTML = cpuntos;
         }
     
        //boton para eliminar usuario
        const btnEdit = usuarioItem.querySelector(".btn-edit"); //obtenemos el boton delete del item actual
        btnEdit.addEventListener("click", async () => {
          let actualizar = usuarioItem.querySelector("#cant").value;
          const po_clave = JSON.parse(pedido1).po_clave;
          const fp_id = pago.fp_id;
          const ppo_monto = parseInt(actualizar);
          const response = await fetch("/api/forma_pago_compra", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              po_clave,
              fp_id,
              ppo_monto,
            }),
          });

          const data = await response.json();

          //verificamos que el monto no sea mayor al total

          ///////////////////////////////////////////////////////////////////////////////////////////////
          //debemos validar el uso de los puntos como metodo de pago, tanto no usar mas de los puntos disponibles
          //como que en este caso el monto si pueda ser mayor al total
          ///////////////////////////////////////////////////////////////////////////////////////////////

          if (pago.tipo_fp === "Punto") {
            if (ppo_monto > pago.fp_cantidad) {
              alert("No puede usar mas puntos que la cantidad disponible");
              usuarioItem.querySelector("#cant").value = null;
              return;
            } else {
            }
          }

            if ((parseInt(actualizar) > parseInt(total.value)) && (pago.tipo_fp != "Punto")) {
            alert("El monto no puede ser mayor al total");
          } else {

              if (pago.tipo_fp === "Punto") {
                //pagamos con puntos
                actualizar = actualizar * 5;
                //restamos los puntos
                if (cj_clave != null) {
                  //cliente juridido
                  const response1 = await fetch(
                    `/api/restarPuntoJ/${cj_clave}/${ppo_monto}`,
                    {
                      method: "PUT",
                    }
                  );
                  const dataj1 = await response1.json();
                  console.log(dataj1);
                } else {
                  //cliente natural
                  const response1 = await fetch(
                    `/api/restarPuntoN/${cn_clave}/${ppo_monto}`,
                    {
                      method: "PUT",
                    }
                  );
                  const datan1 = await response1.json();
                  console.log(datan1);
                }
              }

            total.value = parseInt(total.value) - parseInt(actualizar);
            if (total.value < 0) { total.value = 0; }

            if (total.value == 0) {
              alert("SE COMPLETO LA COMPRA!");
              sessionStorage.setItem("claveP", po_clave);
              location.href = "/static/pdf.html";
            } else {
              formasPago = formasPago.filter(
                (pago1) => pago1.tipo_fp !== pago.tipo_fp
              );
              renderUser(formasPago);
            }
          }
        });
        rolesList.append(usuarioItem);
    }
    }

}



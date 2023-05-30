const cliente = sessionStorage.getItem("cliente");
const pedido1 = sessionStorage.getItem("ped");
const tipo = sessionStorage.getItem("tipoC");
const t_clave = sessionStorage.getItem("t_clave");
let necesitoRestock = false
let tengoRestock = false
let rs_clave = null;
let pam = sessionStorage.getItem("pam");

sessionStorage.setItem("claveP", JSON.parse(pedido1).pf_clave);

const total = document.querySelector("#total");

const detalles = JSON.parse(sessionStorage.getItem("detalles"));
console.log(detalles);

console.log(cliente);
console.log(pedido1);
console.log(tipo);

var pedido = JSON.parse(pedido1).pf_monto;
console.log(pedido);
var tipoC = tipo;
let formasPago = [];

let cn_clave;
let cj_clave;

window.addEventListener("DOMContentLoaded", async () => {
  if (tipo === "true") {
    cn_clave = cliente;
    cj_clave = null;
    const responseFP = await fetch(`/api/forma_de_pago/${cn_clave}/1`, {
      method: "GET",
    });
    const pagos = await responseFP.json(); //debemos pasar la respuesta a json para que sea usable
    formasPago = pagos;
  } else {
    cj_clave = cliente;
    cn_clave = null;
    const responseFP = await fetch(`/api/forma_de_pago/${cj_clave}/2`, {
      method: "GET",
    });
    const pagos = await responseFP.json(); //debemos pasar la respuesta a json para que sea usable
    formasPago = pagos;
  }

  total.value = pedido;

  console.log(formasPago);
  renderUser(formasPago);
});

async function renderUser(pagos) {
  //funcion para renderizar los usuarios
  const pagoList = document.querySelector("#rolesList");
  pagoList.innerHTML = "";

  for (const pago of pagos) {

    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML =
      `
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
          usuarioItem.querySelector("#cpuntos").innerHTML = cpuntos ;
        }

    //boton para eliminar usuario
    const btnEdit = usuarioItem.querySelector(".btn-edit"); //obtenemos el boton delete del item actual
    btnEdit.addEventListener("click", async () => {
      let rs = null;

      let actualizar = usuarioItem.querySelector("#cant").value;
      console.log(actualizar);

      pf_clave = JSON.parse(pedido1).pf_clave;
      const fp_id = pago.fp_id;
      const ppf_monto = parseInt(actualizar);
      const response = await fetch("/api/forma_pago_compra_Fisico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pf_clave,
          fp_id,
          ppf_monto,
        }),
      });

      const data = await response.json();
      //verificamos que el monto no sea mayor al total

      ///////////////////////////////////////////////////////////////////////////////////////////////
      //debemos validar el uso de los puntos como metodo de pago, tanto no usar mas de los puntos disponibles
      //como que en este caso el monto si pueda ser mayor al total
      ///////////////////////////////////////////////////////////////////////////////////////////////


      if (pago.tipo_fp === "Punto"){
        if (ppf_monto > pago.fp_cantidad) {
          alert("No puede usar mas puntos que la cantidad disponible");
          usuarioItem.querySelector("#cant").value = null;
          return;
        } else {
        }
      }

            if ((parseInt(actualizar) > parseInt(total.value)) && (pago.tipo_fp != "Punto")) {
              alert("El monto no puede ser mayor al total");
            } else {

              if (pago.tipo_fp === "Punto") { //pagamos con puntos
                actualizar = actualizar * 5;
                //restamos los puntos
                if (cj_clave != null){ //cliente juridido

                  const response1 = await fetch(
                    `/api/restarPuntoJ/${cj_clave}/${ppf_monto}`,
                    {
                      method: "PUT",
                    }
                  );
                  const dataj1 = await response1.json();
                  console.log(dataj1);
                } else { //cliente natural
                    const response1 = await fetch(
                      `/api/restarPuntoN/${cn_clave}/${ppf_monto}`,
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
                //agregamos puntos al cliente, si es la primera vez que compra fisico
                //creamos el metodo de pago, si no, sumamos 1 punto
                if (cj_clave != null) {
                  //cliente juridico
                  const response1 = await fetch(
                    `/api/agregarPuntoJ/${cj_clave}`,
                    {
                      method: "PUT",
                    }
                  );
                  const dataj = await response1.json();
                  console.log(dataj);

                  if (dataj.message === "no existen puntos") {
                    //creamos el metodo de pago puntos

                    const responseCJ = await fetch(
                      `/api/Cliente_Juridico/${cj_clave}`,
                      {
                        method: "GET",
                      }
                    );
                    const dataCJ = await responseCJ.json();

                    const FP_Titular = dataCJ.cj_denominacionsocial;
                    const FP_NumTarjetaCred = null;
                    const FP_TipoDeTarjeta = null;
                    const FP_CodigoSeg = null;
                    const Tipo_FP = "Punto";
                    const FP_NumTarjetaDeb = null;
                    const FP_ClaveTarjeta = null;
                    const FP_Email = null;
                    const FP_Telefono = null;
                    const FP_Email_PayPal = null;
                    const FP_Cantidad = 1;
                    const CN_Clave = null;
                    const CJ_Clave = cj_clave;

                    const response = await fetch("/api/forma_de_pago", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        Tipo_FP,
                        FP_Titular,
                        FP_NumTarjetaCred,
                        FP_TipoDeTarjeta,
                        FP_CodigoSeg,
                        FP_NumTarjetaDeb,
                        FP_ClaveTarjeta,
                        FP_Email,
                        FP_Telefono,
                        FP_Email_PayPal,
                        FP_Cantidad,
                        CN_Clave,
                        CJ_Clave,
                      }),
                    });

                    alert("BIENVENIDO, YA PUEDE USAR SUS PUNTOS");
                  }
                } else {
                  //cliente natural
                  const response2 = await fetch(
                    `/api/agregarPuntoN/${cn_clave}`,
                    {
                      method: "PUT",
                    }
                  );
                  const datan = await response2.json();
                  console.log(datan);

                  if (datan.message === "no existen puntos") {
                    //creamos el metodo de pago puntos

                    const responseCN = await fetch(
                      `/api/Cliente_Natural/${cn_clave}`,
                      {
                        method: "GET",
                      }
                    );
                    const dataCN = await responseCN.json();

                    const FP_Titular = dataCN.cn_pnombre;
                    const FP_NumTarjetaCred = null;
                    const FP_TipoDeTarjeta = null;
                    const FP_CodigoSeg = null;
                    const Tipo_FP = "Punto";
                    const FP_NumTarjetaDeb = null;
                    const FP_ClaveTarjeta = null;
                    const FP_Email = null;
                    const FP_Telefono = null;
                    const FP_Email_PayPal = null;
                    const FP_Cantidad = 1;
                    const CN_Clave = cn_clave;
                    const CJ_Clave = null;

                    const response = await fetch("/api/forma_de_pago", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        Tipo_FP,
                        FP_Titular,
                        FP_NumTarjetaCred,
                        FP_TipoDeTarjeta,
                        FP_CodigoSeg,
                        FP_NumTarjetaDeb,
                        FP_ClaveTarjeta,
                        FP_Email,
                        FP_Telefono,
                        FP_Email_PayPal,
                        FP_Cantidad,
                        CN_Clave,
                        CJ_Clave,
                      }),
                    });

                    alert("BIENVENIDO, YA PUEDE USAR SUS PUNTOS");
                  }
                }

                //sessionStorage.setItem("claveP", pf_clave);

                //resto los dulces del inventario
                //chequeo primero el pasillo, si la compra es mayor a la del pasillo, chequeo el inventario
                //si la compra es mayor tambien al inventario digo que no se puede

                for (const detalle of detalles) {
                        //chequeamos el pasillo
                        const response = await fetch(
                          `/api/zona_pasillo/${detalle.d_clave}/${t_clave}`,
                          {
                            method: "GET",
                          }
                        );
                        const zp = await response.json();

                        let zpcantidad = zp[0].zp_cantidad;
                        let zad = null;
                        let zpd = null;

                        if (detalle.dp_cantidad > zpcantidad) {
                          console.log("entra1");
                          //necesitamos mas de lo que hay en el pasillo
                          //resto primero del pasillo
                          let resta = 0;
                          resta = detalle.dp_cantidad - zpcantidad;

                          const response = await fetch(
                            `/api/zona_pasillo/${detalle.d_clave}/${t_clave}/${zpcantidad}`,
                            {
                              method: "PUT",
                            }
                          );
                          zpd = await response.json();
                          console.log(zpd);

                          //resto del almacen
                          const response1 = await fetch(
                            `/api/zona_almacen/${detalle.d_clave}/${t_clave}/${resta}`,
                            {
                              method: "PUT",
                            }
                          );
                          zad = await response1.json();
                          console.log(zad);
                        } else {
                          console.log("entra2");
                          //simplemente resto del pasillo y ya
                          const response = await fetch(
                            `/api/zona_pasillo/${detalle.d_clave}/${t_clave}/${detalle.dp_cantidad}`,
                            {
                              method: "PUT",
                            }
                          );
                          zpd = await response.json();
                          console.log(zpd);
                        }

                        //const rs = await reStock(zad, zpd, t_clave, detalle); //verificamos el reStock

                        if (zpd.zp_cantidad <= 20) {
                            //regla de negocio
                            //pasamos del almacen al pasillo

                            //////aca solo se suman 100 si el almacen los tiene disponibles,
                            // en caso contrario debemos sumar la cantidad total del almacen
                            ////// y restamos al almacen
                            const response = await fetch(
                              `/api/suma_zona_pasillo/${detalle.d_clave}/${t_clave}`,
                              {
                                method: "PUT",
                              }
                            );
                            const zpd1 = await response.json();
                            console.log(zpd1);
                        }

                          //verificamos si necesitamos restock, primero debemos de hacer el pedido, luego el detalle
                          //ya que podriamos necesitar mas de un tipo de caramelo
                          //aprovechamos las variables zpa y zpd
                          const response1 = await fetch(
                            `/api/zona_almacen/${detalle.d_clave}/${t_clave}`,
                            {
                              method: "GET",
                            }
                          );
                          const zpa1 = await response1.json();
                          console.log(zpa1);

                          if (zpa1[0].za_cantidad <= 100) {
                            //necesitamos generar una orden de restock
                            necesitoRestock = true;
                            console.log("necesito restock");
                            alert("Necesitamos restock");
                            rs = zpa1[0].d_clave;
                          } else {
                            rs =  null;
                          }

                        


                        if (rs != null) {
                          //necesito reStock

                          if (!tengoRestock && necesitoRestock) {
                            //alert("creo pedido de restock");
                            //creo el pedido de restock
                            const responsePedidoReStock = await fetch(
                              "/api/Pedido_ReStock",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json", //asi indicamos que el contenido es json
                                },
                                body: JSON.stringify({
                                  t_clave,
                                }), //enviamos la informacion al servidor
                              }
                            );
                            const dataPedidoReStock =
                              await responsePedidoReStock.json(); //obtenemos la respuesta del servidor
                            console.log(dataPedidoReStock);
                            rs_clave = dataPedidoReStock.rs_clave;

                            tengoRestock = true;
                          }
                          //agregamos el dulce necesario al reStock
                          const d_clave = detalle.d_clave;
                          const pf_clave = null;
                          const po_clave = null;
                          const dp_preciounitario = 0;
                          const dp_cantidad = 10000;

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
                          //detalles.push(data);
                        }
                }

                ///////
                //actualizamos el inventario
                //////
                const response2 = await fetch(
                  `/api/actualizar_inventario/${t_clave}`,
                  {
                    method: "PUT",
                  }
                );

                //Ahora generamos el estatus del pedido
                const ep_clave = 1; //siempre empieza con estado en 1
                //const pf_clave = dataPedidoFisico.pf_clave;
                const responseEPR = await fetch("/api/Estatus_Pedido_ReStock", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ep_clave,
                    rs_clave,
                  }),
                });

                if (pam === "true") {
                location.href = "/static/pdfPaM.html";
                sessionStorage.setItem("pam", false);
                } else {
                location.href = "/static/pdff.html";
                }
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


async function reStock(zad, zpd, t_clave, detalle){
  //verificamos si necesitamos pasar del almacen al pasillo

  if (zpd.zp_cantidad <= 20) { //regla de negocio
    //pasamos del almacen al pasillo

    //////aca solo se suman 100 si el almacen los tiene disponibles, 
    // en caso contrario debemos sumar la cantidad total del almacen
    ////// y restamos al almacen
     const response = await fetch(  
        `/api/suma_zona_pasillo/${detalle.d_clave}/${t_clave}`,
        {
          method: "PUT",
        }
      );
      const zpd1 = await response.json();
      console.log(zpd1);

    //verificamos si necesitamos restock, primero debemos de hacer el pedido, luego el detalle
    //ya que podriamos necesitar mas de un tipo de caramelo
    //aprovechamos las variables zpa y zpd
         const response1 = await fetch(
        `/api/zona_almacen/${detalle.d_clave}/${t_clave}`,
        {
          method: "GET",
        }
      );
      const zpa1 = await response1.json();
      console.log(zpa1);

      if (zpa1.zp_cantidad <= 100) { //necesitamos generar una orden de restock
        necesitoRestock = true;
        //alert("Necesitamos restock");
        return zpa1[0].d_clave;
      }

      return null;

    }

}

const formaPago = document.querySelector('#aggMP');
const info = sessionStorage.getItem("u_nombre")
const claveCliente = sessionStorage.getItem("data2")
const clienteNatural = sessionStorage.getItem("tipo");

console.log(claveCliente)
console.log(clienteNatural)



if (clienteNatural != "null") {

  const metodos = document.querySelector("#metodos"); //si proviene de un pedido fisico debemos agregar el metodo de pago efectivo

  metodos.innerHTML = `<h2>Seleccione el metodo de pago a agregar:</h2>
                    <input type="radio" name="metodo" id="Tarjeta de Credito">
                    <label for="Tarjeta de Credito">Tarjeta de Credito</label>

                    <input type="radio" name="metodo" id="Tarjeta de Debito">
                    <label for="Tarjeta de Debito">Tarjeta de Debito</label>

                    <input type="radio" name="metodo" id="Zelle">
                    <label for="Zelle">Zelle</label>

                    <input type="radio" name="metodo" id="PayPal">
                    <label for="PayPal">PayPal</label>

                    <input type="radio" name="metodo" id="Efectivo"> 
                    <label for="Efectivo">Efectivo</label>`;
}

function Redireccion(){
    formaPago.addEventListener('submit', async e=>{
        e.preventDefault()

        let jsonprueba = ""

        if (clienteNatural == "null") {
          const response = await fetch(`/api/users/i/${info}`, {
            method: "GET",
          });
          const data = await response.json();
          console.log(JSON.stringify(data));
          console.log(
            document.querySelector('input[name="metodo"]:checked').id
          );

          sessionStorage.setItem("data", JSON.stringify(data));
        } else {
          if (clienteNatural == "true") {
            //jsonprueba = "{u_tipo:Cliente Natural,cn_clave:"+claveCliente+",cj_clave:"+null+"}";
            var dict = {
              u_tipo: "Cliente Natural",
              cn_clave: claveCliente,
              cj_clave: null,
            };
            sessionStorage.setItem("data", JSON.stringify(dict));
          } else {
            //jsonprueba = "{u_tipo:Cliente Juridico,cj_clave:"+claveCliente+",cn_clave:"+null+"}";
            var dict = {
              u_tipo: "Cliente Juridico",
              cj_clave: claveCliente,
              cn_clave: null,
            };
            sessionStorage.setItem("data", JSON.stringify(dict));
          }
        }


        if(document.querySelector('input[name="metodo"]:checked').id === "Tarjeta de Credito"){
            location.href = "/static/tarjetaCred.html";
        }else if(document.querySelector('input[name="metodo"]:checked').id === "Tarjeta de Debito"){
            location.href = "/static/tarjetaDeb.html";
        }else if(document.querySelector('input[name="metodo"]:checked').id === "Zelle"){
            location.href = "/static/zelle.html";
        }else if(document.querySelector('input[name="metodo"]:checked').id === "PayPal"){
            location.href = "/static/PayPal.html";
        }else if(document.querySelector('input[name="metodo"]:checked').id === "Efectivo"){
            location.href = "/static/efectivo.html";
        }
    });
}
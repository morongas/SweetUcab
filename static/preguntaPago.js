const u_nombre = sessionStorage.getItem("u_nombre");
const em_clave = sessionStorage.getItem("em_clave");
sessionStorage.setItem("preguntaPago", true);

window.addEventListener("DOMContentLoaded", async () => {
  
});

const btn1 = document.querySelector("#agg"); //obtenemos el boton de cliente ya registrado
btn1.addEventListener("click", async () => {

    //sessionStorage.setItem("u_nombre", null);
  location.href = "/static/agregarMP.html";
});

const btn2 = document.querySelector("#pago"); //obtenemos el boton de cliente Natural
btn2.addEventListener("click", async () => {


    sessionStorage.setItem("preguntaPago", false);
  location.href = "/static/pagoF.html";
});

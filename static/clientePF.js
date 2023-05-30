
const u_nombre = sessionStorage.getItem("u_nombre");
const em_clave = sessionStorage.getItem("em_clave");

window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetch(`/api/empleado/${em_clave}`, {
    method: "GET",
  });
  const empleado = await data.json();

  const t_clave = empleado.t_clave

  sessionStorage.setItem("t_clave", t_clave);
 
});


const btn1 = document.querySelector("#cn"); //obtenemos el boton de cliente ya registrado
btn1.addEventListener("click", async () => {



  location.href = "/static/clienteNPF.html";
});

const btn2 = document.querySelector("#cj"); //obtenemos el boton de cliente Natural
btn2.addEventListener("click", async () => {



      location.href = "/static/clienteJPF.html";
});

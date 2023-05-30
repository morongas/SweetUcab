const info = sessionStorage.getItem("u_nombre");
sessionStorage.setItem("u_nombre", info);
console.log(info);
var aux = null;
var clienteNatural = true;
var tienda = null;
var claveEmp = null;

window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetch(`/api/users/i/${info}`, {
    method: "GET",
  });
  const user2 = await data.json();
  if (user2.u_tipo == "Cliente Natural") {
    aux = user2.cn_clave;
    clienteNatural = true;
  } else {
    aux = user2.cj_clave;
    clienteNatural = false;
  }

  if (user2.u_tipo == "Empleado") {
    claveEmp = user2.em_clave;
    const responsetiendaEM = await fetch(`/api/tienda/empleado/${claveEmp}`, {
      method: "GET",
    });
    const tiendaEM = await responsetiendaEM.json();
    tienda = tiendaEM.t_clave;
  }

  const bienvenido = document.querySelector("#bienvenido");
  bienvenido.innerHTML = `Bienvenido  ${info}`;

  const responseAcciones = await fetch(`/api/accionesUser/${info}`, {
    method: "GET",
  });
  const acciones = await responseAcciones.json();
  console.log(acciones);

  const responseUser = await fetch(`/api/users/i/${info}`, {
    method: "GET",
  });
  const user = await responseUser.json();
  console.log(user);

  for (const accion of acciones) {
    console.log(accion.ac_nombre);
    if (accion.ac_nombre === "compra") {
      document.getElementById("compra").style.display = "block";
      document.getElementById("fp").style.display = "block";
      document.getElementById("telf").style.display = "block";
      document.getElementById("desc").style.display = "block";
      if (user.u_tipo === "Cliente Juridico") {
        document.getElementById("dir").style.display = "block";
        document.getElementById("pc").style.display = "block";
      }
    }
    if (accion.ac_nombre === "descuentos") {
      const responseDescuentos = await fetch("/api/descuento/ff", {
        method: "GET",
      });
      const dataDescuentos = await responseDescuentos.json();
      console.log("holaa");
      console.log(dataDescuentos);
      const date = new Date();
      const dd = date.getDate();
      const mm = date.getMonth();
      const yyyy = date.getFullYear();
      const datee = new Date(yyyy, mm, dd);
      console.log(datee);
      console.log(dataDescuentos[0].de_fechafin);
      if (dataDescuentos[0].de_fechafin == datee) {
        alert("SE HA TERMINADO EL TIEMPO DE DESCUENTO, DEBE DE CREAR OTRO");
        location.href = "/static/descuentos.html";
      }
      document.getElementById("descuentos").style.display = "block";
    }
    if (accion.ac_nombre === "cajero") {
      document.getElementById("cajero").style.display = "block";
    }
    if (accion.ac_nombre === "despacho" || accion.ac_nombre === "entrega") {
      document.getElementById("pedidos").style.display = "block";
    }
    if (accion.ac_nombre === "restock") {
      document.getElementById("rt").style.display = "block";
    }
     if (accion.ac_nombre === "pasillo") {
       document.getElementById("pas").style.display = "block";
     }
  }
});

function Redireccion(x) {
  if (x == 1) {
    sessionStorage.setItem("u_nombre", info);
    location.href = "/static/formaDePagos.html";
  }
  if (x == 2) {
    sessionStorage.setItem("clave", aux);
    sessionStorage.setItem("tipo", clienteNatural);
    location.href = "/static/verdulce.html";
  }
  if (x == 3) {
    sessionStorage.setItem("u_nombre", info);
    location.href = "/static/pedidos.html";
  }
  if (x == 4) {
    sessionStorage.setItem("t_clave", tienda);
    sessionStorage.setItem("em_clave", claveEmp);
    location.href = "/static/clientePF.html";
  }
  if (x == 5) {
    location.href = "/static/descuentos.html";
  }
  if (x == 6) {
    sessionStorage.setItem("datos", aux);
    location.href = "/static/telefono.html";
  }
  if (x == 7) {
    sessionStorage.setItem("datos", aux);
    location.href = "/static/direccionJ.html";
  }
  if (x == 8) {
    sessionStorage.setItem("datos", aux);
    location.href = "/static/personaContacto.html";
  }
  if (x == 9) {
    sessionStorage.setItem("datos", aux);
    location.href = "/static/descuentosPDF.html";
  }
  if (x == 10) {
    sessionStorage.setItem("t_clave", tienda);
    location.href = "/static/confirmarReStock.html";
  }
  if (x == 11) {
    sessionStorage.setItem("t_clave", tienda);
    location.href = "/static/verPedidoPasillo.html";
  }
}

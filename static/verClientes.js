let clientesN = []; //array to store usuarios
let clientesJ = []

window.addEventListener("DOMContentLoaded", async () => {

  const responseClientesN = await fetch("/api/Cliente_Natural", { //obtenemos ususarios
    method: "GET",
  });
  const dataClientesN = await responseClientesN.json(); //debemos pasar la respuesta a json para que sea usable
  clientesN = dataClientesN;
  console.log(clientesN);

  const responseClientesJ = await fetch("/api/Cliente_Juridico", { //obtenemos ususarios
    method: "GET",
  });
  const dataClientesJ = await responseClientesJ.json(); //debemos pasar la respuesta a json para que sea usable
  clientesJ = dataClientesJ;
  console.log(clientesJ);

  renderUserNatural(clientesN);
  renderUserJuridico(clientesJ);
});

async function renderUserNatural(clientes) {
  //funcion para renderizar los usuarios
  const clientesList = document.querySelector("#clientesList");
  clientesList.innerHTML = "";

  for (const cliente of clientes) {
    const responseUser = await fetch(`/api/esUsuario/${cliente.cn_clave}`, {
      //obtenemos el rol de cada usuario
      method: "GET",
    });
    const dataRol = await responseUser.json(); //debemos pasar la respuesta a json para que sea usable
    rol = dataRol;
    console.log(rol);

    let esUsuario = "si"
    if (rol[0] == null) {
      console.log("chao")
      esUsuario = "no";
    }

    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>${cliente.cn_ci} </h3>
              <p> COD:
                <input  style="text-align:center;" type="text" id="u_clave" name="country" value=${cliente.cn_clave} maxlength="1" size="1" readonly>
              </p>
            </fieldset>
            <div>
                <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                <button class="btn-edit btn btn-secondary btn-sm">Editar</button>
            </div>
        </header>
        <p>RIF : ${cliente.cn_rif}</p>
        <p>NOMBRE : ${cliente.cn_pnombre}</p>
        <p>Tiene Usuario : ${esUsuario}</p>
        <p></p>
        
        </div>
        </center>
        `;

    const btnDelete = usuarioItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual
    btnDelete.addEventListener("click", async () => {
      //agregamos un evento click al boton
      const response = await fetch(`/api/Cliente_Natural/${cliente.cn_clave}`, {
        method: "DELETE",
      });
      const data = await response.json(); //obtenemos la respuesta del servidor

      location.reload(); //reload la pagina
    });

    const btnEdit = usuarioItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual
    btnEdit.addEventListener("click", async () => {
      //regresamos a la ventana de dulce
      sessionStorage.setItem("cn_clave", cliente.cn_clave);
      sessionStorage.setItem("editar", true);

      location.href = "/static/clienteNatural.html";
    });

    clientesList.append(usuarioItem);
  }
}

async function renderUserJuridico(clientes) {
  //funcion para renderizar los usuarios
  const clientesList = document.querySelector("#clientesList");
  clientesList.innerHTML = "";

  for (const cliente of clientes) {
    const responseUser = await fetch(`/api/esUsuario/${cliente.cj_clave}`, {
      //obtenemos el rol de cada usuario
      method: "GET",
    });
    const dataRol = await responseUser.json(); //debemos pasar la respuesta a json para que sea usable
    rol = dataRol;

    let esUsuario = "si"
    if (rol[0] == null) {
      console.log("chao")
      esUsuario = "no";
    }
    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML = `
          <header class="d-flex justify-content-between align-items-center">
              <fieldset>
                <h3>${cliente.cj_rif} </h3>
                <p> COD:
                  <input  style="text-align:center;" type="text" id="u_clave" name="country" value=${cliente.cj_clave} maxlength="1" size="1" readonly>
                </p>
              </fieldset>
              <div>
                <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                <button class="btn-edit btn btn-secondary btn-sm">Editar</button>
            </div>
          </header>
          <p>DS : ${cliente.cj_denominacionsocial}</p>
          <p>RS : ${cliente.cj_razonsocial}</p>
          <p>Tiene Usuario : ${esUsuario}</p>
          <p></p>
          
          </div>
          </center>
          `;

    const btnDelete = usuarioItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual
    btnDelete.addEventListener("click", async () => {
      //agregamos un evento click al boton

      const response2 = await fetch(`/api/persona_contacto/${cliente.cj_clave}`,
        {
          method: "DELETE",
        }
      );
      
      const response3 = await fetch(`/api/lugarJur/${cliente.cj_clave}`,
        {
          method: "DELETE",
        }
      );

      const response = await fetch(`/api/Cliente_Juridico/${cliente.cj_clave}`, {
        method: "DELETE",
      });

      location.reload(); //reload la pagina
    });

    const btnEdit = usuarioItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual
    btnEdit.addEventListener("click", async () => {
      //regresamos a la ventana de dulce
      sessionStorage.setItem("cj_clave", cliente.cj_clave);
      sessionStorage.setItem("editar", true);

      location.href = "/static/clienteJuridico.html";
    });

    clientesList.append(usuarioItem);
  }
}  
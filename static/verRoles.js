let roles = [];

window.addEventListener("DOMContentLoaded", async () => {

  const responseRoles = await fetch("/api/Rol", { //obtenemos ususarios
    method: "GET",
  });
  const dataUsuarios = await responseRoles.json(); //debemos pasar la respuesta a json para que sea usable
  roles = dataUsuarios;
  console.log(roles);
  renderUser(roles);
});

async function renderUser(roles) {
  //funcion para renderizar los usuarios
  const rolesList = document.querySelector("#rolesList");
  rolesList.innerHTML = "";

  for (const rol of roles) {
    
     const responseRol = await fetch(`/api/Rol`, {
       //obtenemos el rol de cada usuario
       method: "GET",
     });
     const dataRol = await responseRol.json(); //debemos pasar la respuesta a json para que sea usable
     

    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>${rol.r_nombre} </h3>
              <p> Descripcion:
                ${rol.r_descripcion}
              </p>
            </fieldset>
            <div>
                <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                <button class="btn-edit btn btn-secondary btn-sm" id = "Editar">editar</button>
                <button class="btn-edit btn btn-secondary btn-sm" id = "asignar">Asignar Acciones</button>
            </div>
        </header>
        <p></p>
        
        </div>
        </center>
        `;

    
    //boton para eliminar usuario
    const btnDelete = usuarioItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual
    btnDelete.addEventListener("click", async () => {
    //agregamos un evento click al boton
        const response = await fetch(`/api/Rol/${rol.r_clave}`, {
        //agregamos una peticion fetch al boton para eliminar el usuario
        method: "DELETE",
    });
    const data = await response.json(); //obtenemos la respuesta del servidor
    roles = roles.filter((rol) => rol.r_clave !== data.r_clave); //eliminamos el usuario del array
    //el array usuarios se actualzia con el metodo filter, donde comparamos los ids de los usuarios
    //si el id del usuario no es igual al id del usuario que se elimina, se agrega al array

    renderUser(roles); //actualizamos la lista de usuarios
    });

    //boton para editar usuario
    const btnEdit = usuarioItem.querySelector("#Editar"); //obtenemos el boton edit del item actual

    btnEdit.addEventListener("click", async () => {
        //abrimos una ventana donde podamos editar el usuario

        const response = await fetch(`/api/Rol/${rol.r_clave}`); 
        const data = await response.json(); //obtenemos la respuesta del servidor
        sessionStorage.setItem("rol", JSON.stringify(data)); //guardamos el usuario en sessionStorage
        location.href = "/static/editarRol.html"; //redireccionamos a la pagina de editar usuario
    });    
    const btnAcc = usuarioItem.querySelector("#asignar");//obtenemos el boton edit del item actual

    btnAcc.addEventListener("click", async () => {
        //abrimos una ventana donde podamos editar el usuario

        const response = await fetch(`/api/Rol/${rol.r_clave}`); 
        const data = await response.json(); //obtenemos la respuesta del servidor
        sessionStorage.setItem("rol", JSON.stringify(data)); //guardamos el usuario en sessionStorage
        location.href = "/static/asignarAcc.html"; //redireccionamos a la pagina de editar usuario
    }); 

        rolesList.append(usuarioItem); 
    }


}

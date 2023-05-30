let usuarios = []; //array to store usuarios
let roles = [];

window.addEventListener("DOMContentLoaded", async () => {

  const responseUsuarios = await fetch("/api/users", { //obtenemos ususarios
    method: "GET",
  });
  const dataUsuarios = await responseUsuarios.json(); //debemos pasar la respuesta a json para que sea usable
  usuarios = dataUsuarios;
  console.log(usuarios);
  renderUser(usuarios);
});

async function renderUser(usuarios) {
  //funcion para renderizar los usuarios
  const usuarioList = document.querySelector("#usuarioList");
  usuarioList.innerHTML = "";

  for (const usuario of usuarios) {
    
     const responseRol = await fetch(`/api/rol_usuario/${usuario.u_clave}`, {
       //obtenemos el rol de cada usuario
       method: "GET",
     });
     const dataRol = await responseRol.json(); //debemos pasar la respuesta a json para que sea usable
     rol = dataRol;

     let nombreRol = "No se ha asignado un rol";

     if (rol != null) {
        nombreRol = rol.r_nombre;
     }
    console.log(nombreRol);
    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>${usuario.u_nombre} </h3>
              <p> COD:
                <input  style="text-align:center;" type="text" id="u_clave" name="country" value=${usuario.u_clave} maxlength="1" size="1" readonly>
              </p>
            </fieldset>
            <div>
                <button class="btn-delete btn btn-danger btn-sm">Eliminar</button>
                <button class="btn-edit btn btn-secondary btn-sm" id = "Editar">editar</button>
                <button class="btn-edit btn btn-primary btn-sm" id ="rol"> Asignar Rol</button>
            </div>
        </header>
        <p>Tipo : ${usuario.u_tipo}</p>
        <p>Tipo : ${nombreRol}</p>
        <p></p>
        
        </div>
        </center>
        `;

    //boton para eliminar usuario
    const btnDelete = usuarioItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual
    btnDelete.addEventListener("click", async () => {
    //agregamos un evento click al boton
        console.log(usuario.u_clave);
        const response = await fetch(`/api/users/${usuario.u_clave}`, {
        //agregamos una peticion fetch al boton para eliminar el usuario
        method: "DELETE",
    });
    const data = await response.json(); //obtenemos la respuesta del servidor
    usuarios = usuarios.filter((usuario) => usuario.u_clave !== data.u_clave); //eliminamos el usuario del array
    //el array usuarios se actualzia con el metodo filter, donde comparamos los ids de los usuarios
    //si el id del usuario no es igual al id del usuario que se elimina, se agrega al array

    renderUser(usuarios); //actualizamos la lista de usuarios
    });

    //boton para editar usuario
    const btnEdit = usuarioItem.querySelector("#Editar"); //obtenemos el boton edit del item actual

    btnEdit.addEventListener("click", async () => {
        //abrimos una ventana donde podamos editar el usuario

        const response = await fetch(`/api/users/${usuario.u_clave}`); //agregamos una peticion fetch al boton para editar el usuario
        const data = await response.json(); //obtenemos la respuesta del servidor
        sessionStorage.setItem("usuario", JSON.stringify(data)); //guardamos el usuario en sessionStorage
        location.href = "/static/editarUser.html"; //redireccionamos a la pagina de editar usuario
    });

    const btnRol = usuarioItem.querySelector("#rol"); //obtenemos el boton edit del item actual

    btnRol.addEventListener("click", async () => {
      if(usuario.rol_clave == null){
        sessionStorage.setItem("usuario",usuario.u_clave);
        location.href = "/static/asignarRol.html";
      }else{
        alert("El usuario ya tiene un rol asignado");
      }
    });   
    
    

        

        usuarioList.append(usuarioItem); 
    }
}

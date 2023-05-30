const user = sessionStorage.getItem("usuario");
let roles = [];
console.log("hola "+user);

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
                  <button class="btn-edit btn btn-secondary btn-sm" id = "asignar">Asignar Rol</button>
              </div>
          </header>
          <p></p>
          
          </div>
          </center>
          `;
  
      
      //boton para eliminar usuario
      const btnAsignar = usuarioItem.querySelector("#asignar"); //obtenemos el boton delete del item actual
      btnAsignar.addEventListener("click", async () => {
        
        const response = await fetch(`/api/users/${user}`, {
            method: "GET",
        });
        const data = await response.json();
        console.log(data);

        const U_Nombre = data.u_nombre
        const U_Contrasena = data.u_contrasena
        const U_Tipo = data.u_tipo
        const Rol_Clave = rol.r_clave
        const Em_Clave = data.em_clave
        const CN_Clave = data.cn_clave
        const CJ_Clave = data.cj_clave
    
        const responseAct = await fetch(`/api/users/${data.u_clave}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                U_Nombre, 
                U_Contrasena,
                U_Tipo,
                Rol_Clave,
                Em_Clave,
                CN_Clave,
                CJ_Clave}),
        })
        const dataAct = await responseAct.json()
        console.log(dataAct)

        location.href = "/static/verUsuarios.html";
      });
  
          rolesList.append(usuarioItem); 
      }
  
  
  }
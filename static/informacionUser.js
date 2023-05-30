const info = sessionStorage.getItem("u_nombre")


window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(`/api/users/i/${info}`,{
        method: 'GET',
    })

    const data= await response.json()
    renderUser(data)

});

function renderUser(user){
    const divUsuarios = document.querySelector("#datos");
      divUsuarios.innerHTML = `
              <div>  <p>Nombre : ${user.u_nombre}</p>
              <p>Tipo de Usuario:  ${user.u_tipo}  </p>
              <p>Contraseña: ${user.u_contrasena}  </p>
              </div>  
              `;
}


const btnEdit = document.querySelector("#editar");

function Redireccion(){
    btnEdit.addEventListener("click", async () => {
        const response3 = await fetch(`/api/users/i/${info}`, {
            method: 'GET',
        })

        const data3 = await response3.json()

        const response2 = await fetch(`/api/users/${data3.u_clave}`);
        const data2 = await response2.json();
        sessionStorage.setItem("usuario", JSON.stringify(data2));
        location.href = "/static/editarUserU.html";
    });
}






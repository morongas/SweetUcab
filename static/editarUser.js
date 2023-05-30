const usuario = sessionStorage.getItem("usuario");
const user = JSON.parse(usuario);
const userForm = document.querySelector('#userForm')


window.addEventListener("DOMContentLoaded", async () => {
    const inputNombre = document.querySelector("#nombre");
    inputNombre.value = user.u_nombre;
    const inputTipo = document.querySelector("#tipo");
    inputTipo.value =user.u_tipo;
});

function Redireccion(){
    userForm.addEventListener('submit', async e=>{
        e.preventDefault()
        const U_Nombre = userForm['username'].value
        const U_Contrasena = userForm['password'].value
        const U_Tipo = userForm['tipo'].value
        const Rol_Clave = user.rol_clave
        const Em_Clave =null
        const CN_Clave = user.cn_clave;
        const CJ_Clave = user.cj_clave
    
        const response = await fetch(`/api/users/${user.u_clave}`,{
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
        const data = await response.json()
        console.log(data)
        location.href = "/static/verUsuarios.html";
    });
}
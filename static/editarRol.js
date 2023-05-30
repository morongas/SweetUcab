const info = sessionStorage.getItem("rol");


const rol = JSON.parse(info);
const rolForm = document.querySelector('#userForm')


window.addEventListener("DOMContentLoaded", async () => {
    const inputNombre = document.querySelector("#nombre");
    inputNombre.value = rol.r_nombre;
    const inputTipo = document.querySelector("#descripcion");
    inputTipo.value = rol.r_descripcion;
});

function Redireccion(){
    userForm.addEventListener('submit', async e=>{
        e.preventDefault()
        const r_nombre = userForm['nombre'].value
        const r_descripcion = userForm['descripcion'].value

        const response = await fetch(`/api/Rol/${rol.r_clave}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                r_nombre,
                r_descripcion}),
        })
        const data = await response.json()
        console.log(data)
        location.href = "/static/verRoles.html";
    });
}


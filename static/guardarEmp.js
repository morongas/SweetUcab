const userForm = document.querySelector('#userForm')
const CN_Nombre = sessionStorage.getItem("data")
console.log(JSON.parse(CN_Nombre).u_clave)

function Redireccion(){

    userForm.addEventListener('submit', async e=>{
        e.preventDefault()

        const response3 = await fetch(`/api/tienda/${userForm['tienda'].value}`,{
            method: 'GET',
        
        })
        const data3= await response3.json()
        clave = data3.t_clave

        const em_pnombre = userForm['nombre'].value
        const em_snombre = userForm['snombre'].value
        const em_papellido = userForm['apellido'].value
        const em_sapellido = userForm['sapellido'].value
        const em_ci = userForm['ci'].value
        const em_salario = userForm['sal'].value
        const t_clave = clave

        const response = await fetch('/api/empleado',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                em_pnombre,
                em_snombre,
                em_papellido,
                em_sapellido,
                em_ci,
                em_salario,
                t_clave}),
        })
        const data= await response.json()
    
        console.log(data)
        const id = JSON.parse(CN_Nombre).u_clave
        const U_Nombre = JSON.parse(CN_Nombre).u_nombre
        const U_Contrasena = JSON.parse(CN_Nombre).u_contrasena
        const U_Tipo = JSON.parse(CN_Nombre).u_tipo
        const Rol_Clave = null
        const Em_Clave =data.em_clave
        const CN_Clave = null
        const CJ_Clave =null

        const response2 = await fetch(`/api/users/${id}`,{
            method: "PUT",
            headers: {
            "Content-Type": "application/json", //asi indicamos que el contenido es json
            },
            body: JSON.stringify({
            //debemos enviarlo como json
                U_Nombre,
                U_Contrasena,
                U_Tipo,
                Rol_Clave,
                Em_Clave,
                CN_Clave,
                CJ_Clave,
            }), //enviamos la informacion al servidor
        });
        const data2 = await response2.json();

        userForm.reset()
        alert('Usuario registrado con exito')
        location.href = "/static/index.html";
    });
}
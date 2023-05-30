const userForm = document.querySelector('#userForm')

let users =[]

function Redireccion(){
    userForm.addEventListener('submit', async e=>{
        e.preventDefault()
        const U_Nombre = userForm['username'].value
        const U_Contrasena = userForm['password'].value
        const U_Tipo = userForm['tipoCliente'].value
        const Rol_Clave = null
        const Em_Clave =null
        const CN_Clave =null
        const CJ_Clave =null
    
        const response = await fetch('/api/users',{
            method: 'POST',
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
    
        const data= await response.json()
        console.log(data)
        userForm.reset()
        alert('Presione para continuar')

        sessionStorage.setItem("data",JSON.stringify(data))
        if(U_Tipo === "Cliente Natural"){
            location.href = "/static/clienteNatural.html";
        }else if(U_Tipo === "Cliente Juridico"){
            location.href = "/static/clienteJuridico.html";
        }if(U_Tipo === "Empleado"){
            location.href = "/static/empleado.html";
        }
    });
}

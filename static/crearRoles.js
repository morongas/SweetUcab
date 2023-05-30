const userForm = document.querySelector('#userForm')

function Redireccion(){
    userForm.addEventListener('submit', async e=>{
        e.preventDefault()
        const r_nombre = userForm['nombre'].value
        const r_contrasena = userForm['descripcion'].value

    
        const response = await fetch('/api/Rol',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                r_nombre: r_nombre,
                r_descripcion: r_contrasena}),
        })
    
        const data= await response.json()
        console.log(data)
        userForm.reset()
        location.href = "/static/admin.html"
    });
}
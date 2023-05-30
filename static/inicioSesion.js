const usuario = document.querySelector('#usuario');

function Redireccion(){
    usuario.addEventListener('submit', async e=>{
        e.preventDefault()
        const U_Nombre = usuario['username'].value
        const U_Contrasena = usuario['password'].value
    
        const response = await fetch(`/api/users/i/${U_Nombre}`,{
            method: 'GET',
        })
    
        const data= await response.json()

        if(data == null){
            alert('Usuario no existe')
        }
        usuario.reset()
        if((data.u_contrasena == U_Contrasena)&&(data.u_nombre == U_Nombre)){
            console.log(data)
            if(data.u_nombre==="admin"){
                location.href = "/static/admin.html"
            }else{
                location.href = "/static/usuario.html"
                sessionStorage.setItem("u_nombre", data.u_nombre)
            }
        }
    
    });
}

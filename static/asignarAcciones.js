let acciones = []; //array to store usuarios
const rol = sessionStorage.getItem("rol");
console.log(JSON.parse(rol));
let claveRol = JSON.parse(rol).r_clave;

window.addEventListener("DOMContentLoaded", async () => {

  const response= await fetch("/api/acciones", { //obtenemos ususarios
    method: "GET",
  });
  const data = await response.json(); //debemos pasar la respuesta a json para que sea usable
  acciones = data;
  console.log(acciones);
  
  renderUserNatural(acciones);
});

async function renderUserNatural(acciones) {
  //funcion para renderizar los usuarios
  const accList = document.querySelector("#accList");
  accList.innerHTML = "";

  for (const accion of acciones) {
    
    const usuarioItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    usuarioItem.classList = "list-group-item "; //le agrega una clase
    usuarioItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <fieldset>
              <h3>NOMBRE: ${accion.ac_nombre} </h3>
            </fieldset>
            <div>
                <button class="btn-edit btn btn-secondary btn-sm" id = "agg">Agregar</button>
            </div>
        </header>
        <p>Descripcion : ${accion.ac_descripcion}</p>
        <p>COD : ${accion.ac_clave}</p>
        <p></p>
        </div>
        </center>
        `;

        const btnEdit = usuarioItem.querySelector("#agg"); //obtenemos el boton edit del item actual

        btnEdit.addEventListener("click", async () => {
            //abrimos una ventana donde podamos editar el usuario
            const Ac_Clave = accion.ac_clave;
            const R_Clave = claveRol;
        
            const response = await fetch('/api/rol_accion',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Ac_Clave,
                    R_Clave}),
            })
        
            const data= await response.json()
            console.log(data)
        });    


        accList.append(usuarioItem); 
    }
}
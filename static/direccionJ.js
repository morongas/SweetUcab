const cj_clave = sessionStorage.getItem("data")
const userForm = document.querySelector('#userForm')

const editar = sessionStorage.getItem("editar");
sessionStorage.setItem("editar", false);

console.log(cj_clave)

/*
window.addEventListener("DOMContentLoaded", async () => {
  if (editar == "true") {
    datos = cj_clave;

    const responseClientesN = await fetch(`/api/Cliente_Juridico/${cj_clave}`, {
      //obtenemos ususarios
      method: "GET",
    });
    const dataClientesJ = await responseClientesJ.json(); //debemos pasar la respuesta a json para que sea usable
    clienteJ = dataClientesJ;
    console.log(clienteJ);

    const responseLugar = await fetch(`/api/lugar/${clienteJ.l_clave}`, {
      //obtenemos ususarios
      method: "GET",
    });
    const dataLugar = await responseLugar.json(); //debemos pasar la respuesta a json para que sea usable
    lugar = dataLugar;
    console.log(lugar);

    
    //userForm["l_nombre"].value = lugar.l_nombre;
    //userForm["l_tipo"].value = lugar.l_tipo;
  }
}); */

userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const l_nombre = userForm['l_nombre'].value
    const l_tipo = userForm['l_tipo'].value
    console.log(l_tipo)
    console.log(l_nombre)

    const lugar = await fetch(`/api/lugar/${l_nombre}/${l_tipo}`, {
        method: "GET",
    });
    const clave = await lugar.json()
    console.log(clave)

    const l_clave = clave.l_clave
    const lj_tipo = userForm['lj_tipo'].value


    const response = await fetch('/api/lugar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            l_clave,
            lj_tipo,
            cj_clave
        }),

    })

    const data = await response.json()

    console.log(data)


    alert('Presione OK para continuar')

    sessionStorage.setItem("data", cj_clave)
    location.href = "/static/telefonoJ.html";
});

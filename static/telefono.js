const userForm = document.querySelector('#userForm')
const datos = sessionStorage.getItem("data")
const pf = sessionStorage.getItem("pf")

const editar = sessionStorage.getItem("editar");
sessionStorage.setItem("editar", false);
sessionStorage.setItem("pf", false);

console.log(datos)

window.addEventListener("DOMContentLoaded", async () => {

    if (editar == "true") {

        const responseTelefono = await fetch(`/api/telefonocn/${datos}`, {
            //obtenemos ususarios
            method: "GET",
        });
        const dataTelefono = await responseTelefono.json(); //debemos pasar la respuesta a json para que sea usable
        telefono = dataTelefono;
        console.log(telefono);

        userForm["tlf_numero"].value = telefono.tlf_numero;
        userForm["tlf_codigoarea"].value = telefono.tlf_codigoarea;
    }
});

userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const tlf_numero = userForm['tlf_numero'].value
    const tlf_codigoarea = userForm['tlf_codigoarea'].value
    const cn_clave = datos
    const cj_clave = null
    console.log(tlf_numero)
    console.log(tlf_codigoarea)

    if (editar == "true") {

        const response = await fetch(`/api/telefono/${telefono.tlf_clave}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tlf_numero,
                tlf_codigoarea,
                cn_clave,
                cj_clave,
            }),
        });
        const data = await response.json();

    } else {

        const response = await fetch('/api/telefono', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tlf_numero,
                tlf_codigoarea,
                cn_clave,
                cj_clave
            }),
        })
        const data = await response.json()

    }

    userForm.reset();
    alert("Usuario Registrado con exito");

    if (pf == "true") {
        location.href = "/static/tipoPedido.html"; //el cajero va a registrar el pedido
    } else{
        location.href = "/static/index.html";
    }

});
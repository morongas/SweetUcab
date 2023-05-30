const userForm = document.querySelector('#userForm')
let datos = sessionStorage.getItem("data")

const cn_clave = sessionStorage.getItem("cn_clave")
const editar = sessionStorage.getItem("editar");
sessionStorage.setItem("editar", false);

console.log(datos)

window.addEventListener("DOMContentLoaded", async () => {

    if (editar == "true") {

        datos = cn_clave;

        const responseClientesN = await fetch(`/api/Cliente_Natural/${cn_clave}`, {
            //obtenemos ususarios
            method: "GET",
        });
        const dataClientesN = await responseClientesN.json(); //debemos pasar la respuesta a json para que sea usable
        clienteN = dataClientesN;
        console.log(clienteN);

        const responseLugar = await fetch(`/api/lugar/${clienteN.l_clave}`, {
            //obtenemos ususarios
            method: "GET",
        });
        const dataLugar = await responseLugar.json(); //debemos pasar la respuesta a json para que sea usable
        lugar = dataLugar;
        console.log(lugar);


        userForm["l_nombre"].value = lugar.l_nombre;
        userForm["l_tipo"].value = lugar.l_tipo;
    }

});

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
    console.log("hola" + clave)

    const user = await fetch(`/api/Cliente_Natural/${datos}`, {
        method: "GET",
    });
    const info = await user.json()
    console.log(info)

    const CN_Clave = info.cn_clave
    const CN_RIF = info.cn_rif
    const CN_CI = info.cn_ci
    const CN_PNombre = info.cn_pnombre
    const CN_SNombre = info.cn_snombre
    const CN_PApellido = info.cn_papellido
    const CN_SApellido = info.cn_sapellido
    const CN_Email = info.cn_email
    const CN_Codigo = info.cn_codigo
    const L_Clave = clave.l_clave
    const T_Clave = info.t_clave

    console.log(CN_Clave)
    console.log(CN_RIF)

    const response = await fetch(`/api/Cliente_Natural/${CN_Clave}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CN_RIF,
            CN_CI,
            CN_PNombre,
            CN_SNombre,
            CN_PApellido,
            CN_SApellido,
            CN_Email,
            CN_Codigo,
            L_Clave,
            T_Clave
        }),
    })

    const data = await response.json()

    console.log(data)
    userForm.reset()
    alert('Presione OK para continuar')
    sessionStorage.setItem("data", datos)

    if (editar == "true") {
        sessionStorage.setItem("editar", true);
    }

    location.href = "/static/telefono.html";

});
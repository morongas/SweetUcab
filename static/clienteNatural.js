const userForm = document.querySelector('#userForm')
const CN_Nombre = sessionStorage.getItem("data")
const cn_clave = sessionStorage.getItem("cn_clave")
const editar = sessionStorage.getItem("editar")

sessionStorage.setItem("editar", false);


console.log(JSON.parse(CN_Nombre).u_clave)

window.addEventListener("DOMContentLoaded", async () => {

    if (editar == "true") {

        const responseClientesN = await fetch(`/api/Cliente_Natural/${cn_clave}`, {
            //obtenemos ususarios
            method: "GET",
        });
        const dataClientesN = await responseClientesN.json(); //debemos pasar la respuesta a json para que sea usable
        clienteN = dataClientesN;
        console.log(clienteN);

        userForm["CN_RIF"].value = clienteN.cn_rif;
        userForm["CN_CI"].value = clienteN.cn_ci;
        userForm['CN_PNombre'].value = clienteN.cn_pnombre;
        userForm["CN_SNombre"].value = clienteN.cn_snombre;
        userForm["CN_PApellido"].value = clienteN.cn_papellido;
        userForm["CN_SApellido"].value = clienteN.cn_sapellido;
        userForm["CN_Email"].value = clienteN.cn_email;

    }
});


function Redireccion() {
    userForm.addEventListener('submit', async e => {
        e.preventDefault()

        const CN_RIF = userForm["CN_RIF"].value;
        const CN_CI = userForm["CN_CI"].value;
        console.log(userForm["CN_PNombre"].value)
        const CN_PNombre = userForm["CN_PNombre"].value;
        const CN_SNombre = userForm["CN_SNombre"].value;
        const CN_PApellido = userForm["CN_PApellido"].value;
        const CN_SApellido = userForm["CN_SApellido"].value;
        const CN_Email = userForm["CN_Email"].value;
        const CN_Codigo = null;
        const L_Clave = null;
        const T_Clave = null;

        if (editar == "true") { //para actualizar jeje
            const response = await fetch(`/api/Cliente_Natural/${cn_clave}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
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
                    T_Clave,
                }),
            });

            userForm.reset();
            alert("Presione OK para continuar");

            sessionStorage.setItem("cn_clave", cn_clave);
            sessionStorage.setItem("editar", true);
            location.href = "/static/direccion.html";

        } else { //para crear

            const response = await fetch('/api/Cliente_Natural', {
                method: 'POST',
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
            const id = JSON.parse(CN_Nombre).u_clave
            const U_Nombre = JSON.parse(CN_Nombre).u_nombre
            const U_Contrasena = JSON.parse(CN_Nombre).u_contrasena
            const U_Tipo = JSON.parse(CN_Nombre).u_tipo
            const Rol_Clave = null
            const Em_Clave = null
            const CN_Clave = data.cn_clave
            const CJ_Clave = null
            const response2 = await fetch(`/api/users/${id}`, {
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
            alert('Presione OK para continuar')

            sessionStorage.setItem("data", data.cn_clave)
            location.href = "/static/direccion.html";
        }
    });
}
const userForm = document.querySelector('#userForm')
const info = sessionStorage.getItem("data")

const cj_clave = sessionStorage.getItem("cj_clave");
const editar = sessionStorage.getItem("editar");
console.log(editar);
console.log(cj_clave);
sessionStorage.setItem("editar", false);



window.addEventListener("DOMContentLoaded", async () => {

    if (editar === "true") {
        const responseClientesJ = await fetch(`/api/Cliente_Juridico/${cj_clave}`, {
            //obtenemos ususarios
            method: "GET",
        });
        const dataClientesJ = await responseClientesJ.json(); //debemos pasar la respuesta a json para que sea usable
        clienteJ = dataClientesJ;
        console.log(clienteJ);

        userForm["CJ_RIF"].value = clienteJ.cj_rif;
        userForm["CJ_DenominacionSocial"].value = clienteJ.cj_denominacionSocial;
        userForm["CJ_RazonSocial"].value = clienteJ.cj_razonSocial;
        userForm["CJ_Email"].value = clienteJ.cj_email;
        userForm["CJ_PaginaWeb"].value = clienteJ.cj_paginaWeb;
        userForm["CJ_CapitalDisp"].value = clienteJ.cj_capitalDisp;

    }
});

userForm.addEventListener('submit', async e => {
    e.preventDefault()
    const CJ_RIF = userForm['CJ_RIF'].value
    const CJ_DenominacionSocial = userForm['CJ_DenominacionSocial'].value
    const CJ_RazonSocial = userForm['CJ_RazonSocial'].value
    const CJ_Email = userForm['CJ_Email'].value
    const CJ_PaginaWeb = userForm['CJ_PaginaWeb'].value
    const CJ_CapitalDisp = userForm['CJ_CapitalDisp'].value
    const CJ_Codigo = null
    const T_Clave = null


    if (editar === "true") {

        const response = await fetch(`/api/Cliente_juridico/${cj_clave}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                CJ_RIF,
                CJ_DenominacionSocial,
                CJ_RazonSocial,
                CJ_Email,
                CJ_PaginaWeb,
                CJ_CapitalDisp,
                CJ_Codigo,
                T_Clave,
            }),
        });

        userForm.reset();
        alert("Presione OK para continuar");

        sessionStorage.setItem("cj_clave", cj_clave);
        sessionStorage.setItem("editar", true);
        location.href = "/static/direccionJ.html";

    } else {

        const response = await fetch('/api/Cliente_Juridico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CJ_RIF,
                CJ_DenominacionSocial,
                CJ_RazonSocial,
                CJ_Email,
                CJ_PaginaWeb,
                CJ_CapitalDisp,
                CJ_Codigo,
                T_Clave
            }),
        })

        const data = await response.json()

        console.log(data)

        const id = JSON.parse(info).u_clave
        const U_Nombre = JSON.parse(info).u_nombre
        const U_Contrasena = JSON.parse(info).u_contrasena
        const U_Tipo = JSON.parse(info).u_tipo
        const Rol_Clave = null
        const Em_Clave = null
        const CN_Clave = null
        const CJ_Clave = data.cj_clave
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
        sessionStorage.setItem("data", data.cj_clave)
        location.href = "/static/direccionJ.html";
    }
});
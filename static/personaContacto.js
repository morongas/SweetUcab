const userForm = document.querySelector('#userForm')
const datos = sessionStorage.getItem("data")
const pf = sessionStorage.getItem("pf");


console.log(datos)

function Redireccion(){
    userForm.addEventListener('submit', async e => {
        e.preventDefault()

        const tlf_numero = userForm['tlf_numero'].value
        const tlf_codigoarea = userForm['tlf_codigoarea'].value
        let cn_clave = null
        let cj_clave = null
        console.log(tlf_numero)
        console.log(tlf_codigoarea)


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

        const pc_email = userForm['pc_email'].value
        console.log(pc_email)

        tlf_clave = data.tlf_clave
        cj_clave = datos

        const response2 = await fetch('/api/persona_contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pc_email,
                tlf_clave,
                cj_clave
            }),
        })

        const data2 = await response2.json()


        userForm.reset()
        alert('Usuario registrado correctamente')
        
        if (pf == "true") {
        location.href = "/static/tipoPedido.html"; //el cajero va a registrar el pedido
        } else {
        location.href = "/static/index.html";
        }

    });
}
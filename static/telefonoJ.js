const userForm = document.querySelector('#userForm')
const datos = sessionStorage.getItem("data")
const pf = sessionStorage.getItem("pf");

console.log(datos)

userForm.addEventListener('submit', async e => {
    e.preventDefault()

    const tlf_numero = userForm['tlf_numero'].value
    const tlf_codigoarea = userForm['tlf_codigoarea'].value
    const cn_clave = null
    const cj_clave = datos
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


    userForm.reset()
    alert('Presione OK para continuar')
    sessionStorage.setItem("data", cj_clave)
    location.href = "/static/personaContacto.html";
});
window.addEventListener("DOMContentLoaded", async () => {
    const responseDescuentos = await fetch("/api/descuento", {
        //fetch is a built-in JavaScript function that performs an HTTP request
        method: "GET",
    });
    const dataDescuentos = await responseDescuentos.json(); //debemos pasar la respuesta a json para que sea usable
    descuentos = dataDescuentos;

    renderUser(descuentos);
});


async function renderUser(descuentos) {
    const detalleList = document.querySelector("#insertar");
    detalleList.innerHTML = "";
    
    for (const detalle of descuentos) {
        //cuando tenemos cada detalle, capturamos el id del dulce
        const responseDulce = await fetch(`/api/Dulce/${detalle.d_clave}`, {
            method: "GET",
        });
        const dataDulce = await responseDulce.json();
        dulce = dataDulce;
        console.log(dulce);

        const dulceItem = document.createElement("li"); //crea un elemento li (de lista)
        //en este caso creamos un elemento li con el contenido del usuario
        //en este elemento tambien se agregan elementos de html como los botones
        dulceItem.classList = "list-group-item "; //le agrega una clase
        dulceItem.innerHTML = `
                        <header class="d-flex justify-content-between align-items-center">
                            <fieldset>
                            <h3>${dulce.d_nombre} </h3>
                            </fieldset>
                        </header>
                        <p>${dulce.d_descripcion}</p>       
                        <p>Precio : ${dulce.d_precio} </p>
                        <p>Descuento : ${detalle.de_porcentaje} % </p>
                        <p>Fecha Inicio del decuento: ${detalle.de_fechainicio} </p>
                        <p>Fecha Fin del decuento: ${detalle.de_fechafin} </p>
                        `;

        detalleList.append(dulceItem); //se agregam los elementos recien creados a pedidoList
    }

}

//Funcion para generar PDF
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.querySelector("#generar");
    boton.addEventListener("click", () => {
        const elementoParaConvertir = document.body;
        html2pdf()
            .set({
                margin: 0,
                filename: 'SweetFlyer.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 8 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            })
            .from(elementoParaConvertir)
            .save()
            .catch(err => console.error(err))
            .then(() => {
                alert("Pulse Ok para descargar PDF")
                location.href = "/static/usuario.html"
            });
    });SS
});
let users = []
let dataEstatus = []
let valoresE = []


window.addEventListener('DOMContentLoaded', async () => {

    const responsePedidos = await fetch('/api/asistencia/empleados');
    const data1 = await responsePedidos.json()
    users = data1




    renderUser(users)
});

async function renderUser(users) {
    const userTable = document.querySelector('#table')

    userTable.innerHTML = ''
    var i = 0

    for (let i = 0; i < users.length; i++) {
        const user = users[i]


        
        const responseEmpleados = await fetch(`/api/empleado/${user.em_clave}`, {
            method: "GET",
        });
        const dataEmpleado = await responseEmpleados.json();
        empleado = dataEmpleado;


        const response1 = await fetch(`/api/asistencia/primerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const primerTrimestre= await response1.json();
        cantidad1 = primerTrimestre[0].count;
        	
        const response2 = await fetch(`/api/asistencia/segundoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const st = await response2.json();
        cantidad2 = st[0].count;

        const response3 = await fetch(`/api/asistencia/tercerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const tt = await response3.json();
        cantidad3 = tt[0].count;

        const response4 = await fetch(`/api/asistencia/cuartoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const ct = await response4.json();
        cantidad4 = ct[0].count;
    
        const response5 = await fetch(`/api/asistencia/llegadaTardePrimerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const lt1 = await response5.json();
        cantidad5 = lt1[0].count;

        const response6 = await fetch(`/api/asistencia/llegadaTardeSegundoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const lt2 = await response6.json();
        cantidad6 = lt2[0].count;

        const response7 = await fetch(`/api/asistencia/llegadaTardeTercerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const lt3 = await response7.json();
        cantidad7 = lt3[0].count;

        const response8 = await fetch(`/api/asistencia/llegadaTardeCuartoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const lt4 = await response8.json();
        cantidad8 = lt4[0].count;

        const response9 = await fetch(`/api/asistencia/cumplimientoHorarioPrimerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const ch1 = await response9.json();
        cantidad9 = ch1[0].count;

        const response10 = await fetch(`/api/asistencia/cumplimientoHorarioSegundoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const ch2 = await response10.json();
        cantidad10 = ch2[0].count;

        const response11 = await fetch(`/api/asistencia/cumplimientoHorarioTercerTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const ch3 = await response11.json();
        cantidad11 = ch3[0].count;

        const response12 = await fetch(`/api/asistencia/cumplimientoHorarioCuartoTrimestre/${user.em_clave}`, {
            method: "GET",
        });
        const ch4 = await response12.json();
        cantidad12 = ch4[0].count;
        
        const response13 = await fetch(`/api/asistencia/horaEntradaPROM/${user.em_clave}`, {
            method: "GET",
        });
        const as1 = await response13.json();
        entradaProm = as1[0].avg;

        const response14 = await fetch(`/api/asistencia/horaSalidaPROM/${user.em_clave}`, {
            method: "GET",
        });
        const as2 = await response14.json();
        salidaProm = as2[0].avg;

        const response15 = await fetch(`/api/asistencia/horaEntradaAsignada/${user.em_clave}`, {
            method: "GET",
        });
        const as3 = await response15.json();
        entradas = as3;

        for(const entrada of entradas){
            if(entrada.ho_dia === "Lunes"){
                entradaLunes = entrada.ho_horaentrada
            }
            if(entrada.ho_dia === "Martes"){
                entradaMartes = entrada.ho_horaentrada
            }
            if(entrada.ho_dia === "Miercoles"){
                entradaMiercoles = entrada.ho_horaentrada
            }
            if(entrada.ho_dia === "Jueves"){
                entradaJueves = entrada.ho_horaentrada
            }
            if(entrada.ho_dia === "Viernes"){
                entradaViernes = entrada.ho_horaentrada
            }
        }

        const response16 = await fetch(`/api/asistencia/horaSalidaAsignada/${user.em_clave}`, {
            method: "GET",
        });
        const as4 = await response16.json();
        salidas = as4;

        for(const salida of salidas){
            if(salida.ho_dia === "Lunes"){
                salidaLunes = salida.ho_horasalida
            }
            if(salida.ho_dia === "Martes"){
                salidaMartes = salida.ho_horasalida
            }
            if(salida.ho_dia === "Miercoles"){
                salidaMiercoles = salida.ho_horasalida
            }
            if(salida.ho_dia === "Jueves"){
                salidaJueves = salida.ho_horasalida
            }
            if(salida.ho_dia === "Viernes"){
                salidaViernes = salida.ho_horasalida
            }
        }

        const userItem = document.createElement('tr')
        if ((i) % 2 != 0) {
            userItem.classList = 'table-secondary'
        } else {
            userItem.classList = ''
        }



        userItem.innerHTML = `
            <td>${empleado.em_ci}</td>
            <td>${empleado.em_papelido}, ${empleado.em_pnombre}</td>
            <td> Primer Trimestre: ${cantidad1} <br>Segundo Trimestre: ${cantidad2} <br> 
                Tercer Trimestre: ${cantidad3} <br>Cuarto Trimestre: ${cantidad4}</td>   
            <td>Primer Trimestre: ${cantidad5} <br> Segundo Trimestre: ${cantidad6} <br> 
                 Tercer Trimestre: ${cantidad7} <br>Cuarto Trimestre: ${cantidad8}</td> 
            <td>Primer Trimestre: ${cantidad9} <br> Segundo Trimestre: ${cantidad10} <br> 
                 Tercer Trimestre: ${cantidad11} <br>Cuarto Trimestre: ${cantidad12}</td>   
            <td>${entradaProm}</td>
            <td>${salidaProm}</td>   
            <td>Lunes: ${entradaLunes} <br>Martes: ${entradaMartes} <br> 
                 Miercoles: ${entradaMiercoles} <br>Jueves: ${entradaJueves}<br> Viernes: ${entradaViernes}</td>  
            <td>Lunes: ${salidaLunes} <br>Martes: ${salidaMartes} <br> 
                 Miercoles: ${salidaMiercoles} <br>Jueves: ${salidaJueves}<br> Viernes: ${salidaViernes}</td>                     
            `

        userTable.append(userItem)
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.querySelector("#generar");
    boton.addEventListener("click", () => {
        const elementoParaConvertir = document.body;
        html2pdf()
            .set({
                margin: 1,
                filename: 'Registro Talento Humano.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: window.devicePixelRatio, windowWidth: elementoParaConvertir.clientWidth, windowHeight: elementoParaConvertir.clientHeight, scrollX: Window.innerWidth, scrollY: Window.innerHeight },
                jsPDF: { unit: 'mm', format: 'tabloid', orientation: 'landscape' , compress: false, precision:2 },
                optimize_layout: true,
                page_size: 'Tabloid',
                zoom_level: 0,

            })
            .from(elementoParaConvertir)
            .save()
            .catch(err => console.error(err))
            .then(() => {
                alert("Se ha generado el PDF")
                location.href = "/static/admin.html"
            });
    });
});

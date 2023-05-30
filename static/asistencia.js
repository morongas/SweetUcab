const uploadconfirm = document.getElementById('uploadconfirm')

window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('/api/asistencia/delete', {
        method: "DELETE",
    });
    const data = await response.json();
});


addEventListener('click',  (e) => {
    Papa.parse(document.getElementById('uploadfile').files[0],{
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            console.log(results);
            for(const aux of results.data){
 
                var a_horaentrada = aux.a_horaentrada;
                console.log(a_horaentrada);
            
                var a_horasalida = aux.a_horasalida;
                var  em_clave = aux.em_clave;
                var a_dia = aux.a_dia;
                var a_fecha = aux.a_fecha;
                if(a_horaentrada == '' && a_horasalida == ''){
                    a_horaentrada = null;
                    a_horasalida = null;
                }
                
                const response = await fetch('/api/asistencia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        a_dia: a_dia,
                        a_fecha: a_fecha,
                        a_horaentrada: a_horaentrada,
                        a_horasalida: a_horasalida,
                        em_clave: em_clave
                    }),
                })


            }
            alert('Asistencia cargada');
            location.href = "/static/admin.html";
        }
    });
})

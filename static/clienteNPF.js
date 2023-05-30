const userForm = document.querySelector('#userForm')

const t_clave = sessionStorage.getItem("t_clave");
const u_nombre = sessionStorage.getItem("u_nombre");
const em_clave = sessionStorage.getItem("em_clave");


function Redireccion() {
    userForm.addEventListener('submit', async e => {
        e.preventDefault()

        const CN_CI = userForm["cedula"].value;

        const response1 = await fetch(`/api/Cliente_Natural/Cedula/${CN_CI}`,
          {
            method: "GET",
          });
        const data= await response1.json()


        if (data == null) {
          const CN_RIF = userForm["CN_RIF"].value;
          const CN_PNombre = userForm["CN_PNombre"].value;
          const CN_SNombre = userForm["CN_SNombre"].value;
          const CN_PApellido = userForm["CN_PApellido"].value;
          const CN_SApellido = userForm["CN_SApellido"].value;
          const CN_Email = userForm["CN_Email"].value;
          let CN_Codigo = null;
          const L_Clave = null;
          const T_Clave = t_clave;

          const response = await fetch("/api/Cliente_Natural", {
            //registramos el cliente
            method: "POST",
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

          const dataCN = await response.json();
          console.log(dataCN);

           if (t_clave <= 9) {
             CN_Codigo = dataCN.cn_clave + "-00000" + t_clave;
           } else {
             CN_Codigo = dataCN.cn_clave + "-0000" + t_clave;
           }

           const response1 = await fetch(
             `/api/Cliente_Natural/${dataCN.cn_clave}`,
             {
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
             }
           );

          alert("Nuevo CLiente Natural");
          //cn.reset();

          sessionStorage.setItem("data", dataCN.cn_clave);
          sessionStorage.setItem("pf", true);
          sessionStorage.setItem("tipo", true);
          location.href = "/static/direccion.html"; // el cajero va a registrar la direccion
        } else {
          
          console.log(data.cn_clave);
          sessionStorage.setItem("data", data.cn_clave);
          sessionStorage.setItem("tipo", true);
          alert("Cliente Natural ya registrado en el sistema");

          location.href = "/static/tipoPedido.html"; //el cajero va a registrar el pedido
        }

})
}

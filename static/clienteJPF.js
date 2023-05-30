const cj = document.querySelector("#cj");

const t_clave = sessionStorage.getItem("t_clave");
const u_nombre = sessionStorage.getItem("u_nombre");
const em_clave = sessionStorage.getItem("em_clave");

function Redireccion() {
    cj.addEventListener('submit', async e => {
    e.preventDefault()

    const CJ_RIF = cj["CJ_RIF"].value;

    const response = await fetch(`/api/Cliente_Juridico/Rif/${CJ_RIF}`, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (data == null) { //creamos el cliente

      const CJ_RIF = cj["CJ_RIF"].value;
      const CJ_DenominacionSocial = cj["CJ_DenominacionSocial"].value;
      const CJ_RazonSocial = cj["CJ_RazonSocial"].value;
      const CJ_Email = cj["CJ_Email"].value;
      const CJ_PaginaWeb = cj["CJ_PaginaWeb"].value;
      const CJ_CapitalDisp = cj["CJ_CapitalDisp"].value;
      let CJ_Codigo = null;
      const T_Clave = t_clave;

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

          const dataCJ = await response.json()
          console.log(dataCJ)

          if (t_clave <= 9){
            CJ_Codigo = dataCJ.cj_clave + "-00000" + t_clave;
          } else {
            CJ_Codigo = dataCJ.cj_clave + "-0000" + t_clave;
          }
          console.log(CJ_Codigo)

          const response1 = await fetch(
            `/api/Cliente_Juridico/${dataCJ.cj_clave}`,
            {
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
            }
          );

      alert("Nuevo CLiente Juridico");
      cj.reset();

      sessionStorage.setItem("data", dataCJ.cj_clave);
      sessionStorage.setItem("pf", true);
      sessionStorage.setItem("tipo", false);
      location.href = "/static/direccionJ.html"; //el cajero va a registrar la direccion
    } else {
      console.log(data.cj_clave);
      sessionStorage.setItem("data", data.cj_clave);
      sessionStorage.setItem("tipo", false);
      alert("Cliente Juridico ya registrado en el sistema");
      location.href = "/static/tipoPedido.html"; //el cajero va a registrar el pedido
    }
})
}

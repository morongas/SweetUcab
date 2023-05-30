const formaP = document.querySelector("#efectivo");
const info = sessionStorage.getItem("data");
const preguntaPago = sessionStorage.getItem("preguntaPago");

console.log(JSON.parse(info));
console.log(preguntaPago);

let tipo = JSON.parse(info).u_tipo;
//let clave = JSON.parse(info).u_clave
let CN_ClaveAux;
let CJ_ClaveAux;

function Redireccion() {
  formaP.addEventListener("submit", async (e) => {
    e.preventDefault();

    const FP_Titular = formaP["titular"].value;
    const FP_NumTarjetaCred = null;
    const FP_TipoDeTarjeta = null;
    const FP_CodigoSeg = null;
    const Tipo_FP = "Efectivo";
    const FP_NumTarjetaDeb = null;
    const FP_ClaveTarjeta = null;
    const FP_Email = null;
    const FP_Telefono = null;
    const FP_Email_PayPal = null;
    const FP_Cantidad = null;
    CN_Clave = null;
    CJ_Clave = null;

    if (tipo === "Cliente Natural") {
      CN_Clave = JSON.parse(info).cn_clave;
      CJ_Clave = null;
    } else {
      CJ_Clave = JSON.parse(info).cj_clave;
      CN_Clave = null;
    }

    const response = await fetch("/api/forma_de_pago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Tipo_FP,
        FP_Titular,
        FP_NumTarjetaCred,
        FP_TipoDeTarjeta,
        FP_CodigoSeg,
        FP_NumTarjetaDeb,
        FP_ClaveTarjeta,
        FP_Email,
        FP_Telefono,
        FP_Email_PayPal,
        FP_Cantidad,
        CN_Clave,
        CJ_Clave,
      }),
    });

        const data= await response.json()
        console.log(data)
        formaP.reset()
        if (preguntaPago === "true") {
            location.href = "/static/preguntaPago.html";
            sessionStorage.setItem("preguntaPago", "false");
        } else {
        location.href="/static/usuario.html"
        }

  });
}

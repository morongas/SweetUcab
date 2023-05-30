const formaP = document.querySelector('#tarjetaDeb')
const info = sessionStorage.getItem("data")
const preguntaPago = sessionStorage.getItem("preguntaPago");

console.log(info)
console.log(JSON.parse(info).u_clave)

let tipo = JSON.parse(info).u_tipo
let clave = JSON.parse(info).cn_clave
let CN_ClaveAux
let CJ_ClaveAux

function Redireccion(){
    formaP.addEventListener('submit', async e=>{
        e.preventDefault()
        const FP_Titular = formaP['titular'].value
        const FP_TipoDeTarjeta = null
        const FP_NumTarjetaCred = null
        const FP_CodigoSeg = null
        const Tipo_FP = "Tarjeta de Debito"
        const FP_NumTarjetaDeb = formaP['NumTarjetaDeb'].value
        const FP_ClaveTarjeta = formaP['Clave'].value
        const FP_Email= null
        const FP_Telefono = null
        const FP_Email_PayPal= null
        const FP_Cantidad = null
        
        console.log(FP_Titular)

        CN_Clave =null
        CJ_Clave = null
    
        if(tipo === "Cliente Natural"){
            CN_Clave = JSON.parse(info).cn_clave
            CJ_Clave = null
        }else{
            CJ_Clave = JSON.parse(info).cj_clave
            CN_Clave = null
        }
    
        const response = await fetch('/api/forma_de_pago',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Tipo_FP,
                FP_TipoDeTarjeta,
                FP_Titular, 
                FP_NumTarjetaCred,
                FP_CodigoSeg,
                FP_NumTarjetaDeb,
                FP_ClaveTarjeta,
                FP_Email,
                FP_Telefono,
                FP_Email_PayPal,
                FP_Cantidad,
                CN_Clave,
                CJ_Clave}),
        })
    
        const data= await response.json()
        console.log(data)
        formaP.reset()
        sessionStorage.setItem("data",data.u_nombre)

         if (preguntaPago === "true") {
           location.href = "/static/preguntaPago.html";
           sessionStorage.setItem("preguntaPago", "false");
         } else {
        location.href="/static/usuario.html"
        }
    });
}
const formaPago = document.querySelector('#FP');
sessionStorage.setItem("tipo", null);



function Redireccion(){
    formaPago.addEventListener('submit', async e=>{
      e.preventDefault()
      location.href = "/static/agregarMP.html"
    });
}

function Redireccion2(){
   formaPago.addEventListener('submit', async e=>{
     e.preventDefault()
     location.href = "/static/verMP.html"
   });
}
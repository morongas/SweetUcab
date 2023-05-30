window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/dashboard/primer_trimestre", {
    method: "GET",
  });
  const data = await response.json(); //debemos pasar la respuesta a json para que sea usable
  if (data[0].count == null) {
    primer_trimestre = 0;
  } else {
    primer_trimestre = data[0].count;
  }
  console.log(primer_trimestre);

  const response2 = await fetch("/api/dashboard/segundo_trimestre", {
    method: "GET",
  });
  const data2 = await response2.json(); //debemos pasar la respuesta a json para que sea usable
  if (data2[0].count == null) {
    segundo_trimestre = 0;
  } else {
    segundo_trimestre = data2[0].count;
  }
  console.log(segundo_trimestre);

  const response3 = await fetch("/api/dashboard/tercer_trimestre", {
    method: "GET",
  });
  const data3 = await response3.json(); //debemos pasar la respuesta a json para que sea usable
  if (data3[0].count == null) {
    tercer_trimestre = 0;
  } else {
    tercer_trimestre = data3[0].count;
  }
  console.log(tercer_trimestre);

  const response4 = await fetch("/api/dashboard/cuarto_trimestre", {
    method: "GET",
  });
  const data4 = await response4.json(); //debemos pasar la respuesta a json para que sea usable
  if (data4[0].count == null) {
    cuarto_trimestre = 0;
  } else {
    cuarto_trimestre = data4[0].count;
  }
  console.log(cuarto_trimestre);

  //pie
  var ctxP = document.getElementById("pieChart").getContext("2d");
  var myPieChart = new Chart(ctxP, {
    type: "pie",
    data: {
      labels: [
        "Ventas Primer Trimestre",
        "Ventas Segundo Trimestre",
        "Ventas Tercer Trimestre",
        "Ventas Cuarto Trimestre",
      ],
      datasets: [
        {
          data: [
            primer_trimestre,
            segundo_trimestre,
            tercer_trimestre,
            cuarto_trimestre,
          ],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"],
          hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  const response5 = await fetch("/api/dashboard/dulce_mas_vendido", {
    method: "GET",
  });
  const data5 = await response5.json(); //debemos pasar la respuesta a json para que sea usable
  dulce_mv = data5[0].d_clave;
  console.log(dulce_mv);
  cantidad = data5[0].suma;
  console.log(cantidad);

  const responseDulce = await fetch(`/api/Dulce/${dulce_mv}`, {
    method: "GET",
  });
  const dataDulce = await responseDulce.json();
  nombre = dataDulce.d_nombre;
  console.log(nombre);

  const dulceList = document.querySelector("#dulceList");
  dulceList.innerHTML = "";
  const dulceItem = document.createElement("li");
  dulceItem.classList = "list-group-item "; //le agrega una clase
  dulceItem.innerHTML = `
                <p>Nombre: ${nombre}</p>
                <p>Con la cantidad de = ${cantidad} </p>
    `;

  dulceList.append(dulceItem);

  const response6 = await fetch("/api/dashboard/dulce_menos_vendido", {
    method: "GET",
  });
  const data6 = await response6.json(); //debemos pasar la respuesta a json para que sea usable
  dulce_mnv = data6[0].d_clave;
  console.log(dulce_mv);
  cantidad2 = data6[0].suma;
  console.log(cantidad2);

  const responseDulce2 = await fetch(`/api/Dulce/${dulce_mnv}`, {
    method: "GET",
  });
  const dataDulce2 = await responseDulce2.json();
  nombre2 = dataDulce2.d_nombre;
  console.log(nombre2);

  const dulceList2 = document.querySelector("#dulceList2");
  dulceList2.innerHTML = "";
  const dulceItem2 = document.createElement("li");
  dulceItem2.classList = "list-group-item "; //le agrega una clase
  dulceItem2.innerHTML = `
                <p>Nombre: ${nombre2}</p>
                <p>Con la cantidad de = ${cantidad2} </p>
    `;

  dulceList2.append(dulceItem2);

  const response7 = await fetch("/api/dashboard/porcentaje_uso_metodos_pago", {
    method: "GET",
  });
  const data7 = await response7.json();
  console.log(data7);

  var arreglo = [];
  var n = 0;
  for (const aux of data7) {
    n = n + aux.count;
    arreglo.push(aux.tipo_fp);
  }
  console.log(n);
  console.log(arreglo);

  var poncentajes = [];
  for (const aux of data7) {
    porcentaje = (aux.count * 100) / n;
    poncentajes.push(porcentaje);
  }
  console.log(poncentajes);

  //bar
  var ctxB = document.getElementById("barChart").getContext("2d");
  var myBarChart = new Chart(ctxB, {
    type: "bar",
    data: {
      labels: arreglo,
      datasets: [
        {
          label: "Uso de metodos de pago %",
          data: poncentajes,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  const responsePuntosUsados = await fetch(
    "/api/dashboard/cantidad_puntos_cangeados",
    {
      method: "GET",
    }
  );
  const puntosU = await responsePuntosUsados.json();

  const responsePuntosObtenidos = await fetch(
    "/api/dashboard/cantidad_puntos_obtenidos",
    {
      method: "GET",
    }
  );
  const puntosOB = await responsePuntosObtenidos.json();

  puntosF = parseInt(puntosU.sum, 10) + parseInt(puntosOB.sum, 10);

  //DONA DE PUNTOS
  var ctxD = document.getElementById("doughnutChart").getContext("2d");
  var myLineChart = new Chart(ctxD, {
    type: "doughnut",
    data: {
      labels: ["Puntos Usados", "Puntos Obtenidos"],
      datasets: [
        {
          data: [puntosU.sum, puntosF],
          backgroundColor: [
            "#F7464A",
            "#46BFBD",
            "#FDB45C",
            "#949FB1",
            "#4D5360",
          ],
          hoverBackgroundColor: [
            "#FF5A5E",
            "#5AD3D1",
            "#FFC870",
            "#A8B3C5",
            "#616774",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  const response8 = await fetch("/api/dashboard/cantidad_venta_online", {
    method: "GET",
  });
  const data8 = await response8.json();
  console.log(data8);

  const inputNomb = document.querySelector("#vl");
  inputNomb.value = data8[0].count;

  const response9 = await fetch("/api/dashboard/cantidad_venta_fisica", {
    method: "GET",
  });
  const data9 = await response9.json();
  console.log(data9);

  var arreglo2 = [];
  var n2 = [];
  for (const aux of data9) {
    n2.push(aux.count);
    const responseTienda = await fetch(`/api/tienda/n/${aux.t_clave}`, {
      method: "GET",
    });
    const dataTienda = await responseTienda.json();
    arreglo2.push(dataTienda.t_nombre);
  }
  console.log(n2);
  console.log(arreglo2);

  //bar
  var ctxB = document.getElementById("barChart2").getContext("2d");
  var myBarChart = new Chart(ctxB, {
    type: "bar",
    data: {
      labels: arreglo2,
      datasets: [
        {
          label: "Cantidad de ventas fisicas",
          data: n2,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
});

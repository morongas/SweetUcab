const userForm = document.querySelector("#userForm");

let users = []; //array to store user data
let editing = false; //variable para saber si estamos editando o no
let userId = null;

window.addEventListener("DOMContentLoaded", async () => {
  //DOMContentLoaded is fired when the document has been loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
  const response = await fetch("/api/users", {
    //fetch is a built-in JavaScript function that performs an HTTP request
    method: "GET",
  });
  const data = await response.json(); //debemos pasar la respuesta a json para que sea usable
  users = data;
  renderUser(users);
});

userForm.addEventListener("submit", async (e) => {
  //debemos indicar que es codigo asincrono
  e.preventDefault(); //cancela el comportamiento por defecto del formulario

  const username = userForm["username"].value; //obtiene el valor del campo username
  const email = userForm["email"].value;
  const password = userForm["password"].value;

  if (!editing) {
    //si no estamos editando
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //asi indicamos que el contenido es json
      },
      body: JSON.stringify({
        //debemos enviarlo como json
        username,
        email,
        password,
      }), //enviamos la informacion al servidor
    });

    const data = await response.json(); //obtenemos la respuesta del servidor
    users.unshift(data); //agregamos el usuario al array

  } else {//si estamos editando

    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //asi indicamos que el contenido es json
      },
      body: JSON.stringify({
        //debemos enviarlo como json
        username,
        email,
        password,
      }), //enviamos la informacion al servidor
    });

    const updateUser = await response.json(); //obtenemos la respuesta del servidor
    users = users.map((user) => user.id === updateUser.id ? updateUser : user); //actualizamos el usuario
    // si coincide el usuario con el objeto actualizado, coloca el nuevo objeto actualizado, 
    //pero si no coincide, conserva el objeto actual

    editing = false;
    userId = null;
}

  renderUser(users); //para actualizar la lista de usuarios en la pagina
  userForm.reset(); //limpia el formulario
});

function renderUser(users) {
  //funcion para renderizar los usuarios
  const userList = document.querySelector("#userList");
  userList.innerHTML = "";

  users.forEach((user) => {
    const userItem = document.createElement("li"); //crea un elemento li (de lista)
    //en este caso creamos un elemento li con el contenido del usuario
    //en este elemento tambien se agregan elementos de html como los botones
    userItem.classList = "list-group-item list-group-item-dark"; //le agrega una clase
    userItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
            <h3>${user.username}</h3>
            <div>
                <button class="btn-delete btn btn-danger btn-sm">delete</button>
                <button class="btn-edit btn btn-secondary btn-sm">edit</button>
            </div>
        </header>
        <p>${user.email}</p>
        <p class="text-truncate">${user.password}</p>
        `;

    //boton para eliminar usuario
    const btnDelete = userItem.querySelector(".btn-delete"); //obtenemos el boton delete del item actual

    btnDelete.addEventListener("click", async () => {
      //agregamos un evento click al boton
      const response = await fetch(`/api/users/${user.id}`, {
        //agregamos una peticion fetch al boton para eliminar el usuario
        method: "DELETE",
      });
      const data = await response.json(); //obtenemos la respuesta del servidor
      users = users.filter((user) => user.id !== data.id); //eliminamos el usuario del array
      //el array users se actualzia con el metodo filter, donde comparamos los ids de los usuarios
      //si el id del usuario no es igual al id del usuario que se elimina, se agrega al array

      renderUser(users); //actualizamos la lista de usuarios
    });

    //boton para editar usuario
    const btnEdit = userItem.querySelector(".btn-edit"); //obtenemos el boton edit del item actual

    btnEdit.addEventListener("click", async () => {
      //agregamos un evento click al boton
      const response = await fetch(`/api/users/${user.id}`); //agregamos una peticion fetch al boton para editar el usuario
      const data = await response.json(); //obtenemos la respuesta del servidor

      userForm["username"].value = data.username; //le asignamos el valor del usuario al campo username
      userForm["email"].value = data.email; //le asignamos el valor del usuario al campo email

      editing = true; //cambiamos el valor de la variable editing a true
      userId = data.id;
    });

    userList.append(userItem); //se agregam los elementos recien creados a userList
  });
}

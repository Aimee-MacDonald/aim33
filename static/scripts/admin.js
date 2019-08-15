getTodos();

function getTodos(){
  var request = new XMLHttpRequest();

  request.open("GET", "/admin/todos");

  request.onload = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        addTodos(JSON.parse(request.responseText));
      } else {
        console.log("Error: " + request.status);
      }
    }
  };

  request.onerror = function(){
    console.log("Something went Wrong");
  };

  request.send(null);
}

function addTodos(todos){
  var el_todoList = document.getElementById("todos");

  for(var i = 0; i < todos.length; i++){
    var el_newTodo = document.createElement("li");
    el_newTodo.innerText = todos[i].title;
    el_newTodo.id = todos[i]._id;
    el_newTodo.addEventListener("click", function(e){
      tickTodo(e.target.id);
    });
    el_todoList.append(el_newTodo);
  }
}

function tickTodo(id){
  var csrftoken = document.getElementById("csrf").value;

  var request = new XMLHttpRequest();

  request.open("POST", "/admin/tickTodo");

  request.setRequestHeader("CSRF-Token", csrftoken);
  request.setRequestHeader("Content-Type", "application/json");
  request.withCredentials = true;

  request.onload = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var el_ttd = document.getElementById(id);
        el_ttd.parentNode.removeChild(el_ttd);
      } else {
        console.log("Error: " + request.status);
      }
    }
  };

  request.onerror = function(){
    console.log("Something went Wrong");
  };

  request.send(JSON.stringify({"id": id}));
}

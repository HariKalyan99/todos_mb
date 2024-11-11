let todoForm = document.getElementById("todo-submit");
let todoList = document.querySelector(".list-todo-container");
let check = document.querySelector("#checker");
let booklet = document.querySelector("#booklet");

let allTodosArr = [];
let todoStatus = {
  all: true,
  active: false,
  completed: false,
};


todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (check.className === "d-none") {
    check.className = "check-box-all";
  }

  if (booklet.className === "d-none") {
    booklet.className = "parent-conatiner";
  }

  let todoVal = event.target["addTodo"].value;
  let todo_id = Math.floor(Math.random() * 1000);

  if (!todoVal || todoVal?.length < 1) {
    alert("An Empty todo is not acceptable");
  } else {
    allTodosArr.push({
      todoItem: todoVal,
      todoId: todo_id,
      strike: false,
      giveEDitPermission: false,
    });

    let todoDiv = document.createElement("div");
    todoDiv.setAttribute("class", "todo-tag");
    todoDiv.setAttribute("id", `id${todo_id}`);
    todoDiv.setAttribute("onmouseover", `hoverFn(${todo_id})`);
    todoDiv.innerHTML = `
    <input type="checkbox" id="todo-check" name="todo-check"/>
    <label id="label-tick" for="todo-check" onclick="strikeFn(${todo_id})"><i class="fa fa-check-circle" id="tick"></i></label>
            <span class="todo-element" ondblclick="editFn(${todo_id})">${todoVal}</span>
            <i class="fa fa-close close-icon" id="over${todo_id}" style="font-size:1.2rem;" onclick="closeId(${todo_id})"></i>
        `;
    todoList.append(todoDiv);

    document.querySelector(".item-left").innerText = `${
      allTodosArr.filter((x) => x.strike === false).length
    } items left`;
    event.target["addTodo"].value = "";
    todoVal = "";
  }
});

function strikeFn(id) {
  allTodosArr.filter((x) => {
    if (x.todoId === id) {
      if (x.strike === false) {
        x.strike = true;
      } else {
        x.strike = false;
      }
    }
  });

  return addToDOM(allTodosArr, todoStatus);
}

function hoverFn(id) {
  let close = document.getElementById(`over${id}`);
  close.classList.add("close-hover");
  document.getElementById(`id${id}`).addEventListener("mouseout", (event) => {
    close.classList.remove("close-hover");
  });
}

function addToDOM(todoArrays, todoStatus) {
  let str = "";
  let { all, active, completed } = todoStatus;
  for (let i = 0; i < todoArrays.length; i++) {
    let { todoItem, todoId, strike } = todoArrays[i];
    if (all) {
      str += `
      <div class="todo-tag" id="id${todoId}" onmouseover="hoverFn(${todoId})">
     <input type="checkbox" id="todo-check" name="todo-check"/>
         <label id="${
           strike === true ? "label-tick-bg" : "label-tick"
         }" for="todo-check" onclick="strikeFn(${todoId})"><i class="fa fa-check-circle" id="tick"></i></label>
         <span class="${
           strike === true ? "todo-element-strike" : "todo-element"
         }" ondblclick="editFn(${todoId})">${todoItem}</span>
          <i class="fa fa-close close-icon" id="over${todoId}" style="font-size:1.2rem;" onclick="closeId(${todoId})"></i>
     </div>
       `;
    } else if (active) {
      if (strike == false) {
        str += `
      <div class="todo-tag" id="id${todoId}" onmouseover="hoverFn(${todoId})">
     <input type="checkbox" id="todo-check" name="todo-check"/>
         <label id="label-tick"
         }" for="todo-check" onclick="strikeFn(${todoId})"><i class="fa fa-check-circle" id="tick"></i></label>
         <span class="todo-element"
         }" ondblclick="editFn(${todoId})">${todoItem}</span>
          <i class="fa fa-close close-icon" id="over${todoId}" style="font-size:1.2rem;" onclick="closeId(${todoId})"></i>
     </div>
       `;
      }
    } else if (completed) {
      if (strike == true) {
        str += `
      <div class="todo-tag" id="id${todoId}" onmouseover="hoverFn(${todoId})">
     <input type="checkbox" id="todo-check" name="todo-check"/>
         <label id="${
           strike === true ? "label-tick-bg" : "label-tick"
         }" for="todo-check" onclick="strikeFn(${todoId})"><i class="fa fa-check-circle" id="tick"></i></label>
         <span class="${
           strike === true ? "todo-element-strike" : "todo-element"
         }" ondblclick="editFn(${todoId})">${todoItem}</span>
          <i class="fa fa-close close-icon" id="over${todoId}" style="font-size:1.2rem;" onclick="closeId(${todoId})"></i>
     </div>
       `;
      }
    } else {
      return clearCompletedFn(allTodosArr, todoStatus);
    }
  }

  if (todoArrays?.length < 1) {
    check.className = "d-none";
    booklet.className = "d-none";
  }

  document.querySelector(".item-left").innerText = `${
    completed === true
      ? todoArrays.filter((x) => x.strike === true).length
      : todoArrays.filter((x) => x.strike === false).length
  } items left`;

  return (todoList.innerHTML = str);
}

function clearCompletedFn(arr, status) {
  let { all, active, completed } = status;
  if (all === false || active === false || completed === false) {
    for (let i = 0; i < arr.length; i++) {
      let { strike, todoId } = arr[i];
      if (strike === true) {
        closeId(todoId);
      }
    }
  }
  status.all = true;
  return addToDOM(arr, status);
}

function updateToDom(arr) {
  let storeThisId = "";

  for (let i = 0; i < arr.length; i++) {
    let { todoItem, todoId, giveEDitPermission } = arr[i];
    if (giveEDitPermission) {
      storeThisId = todoId;
      document.getElementById(
        `id${todoId}`
      ).innerHTML = ` <div id="todo-submit-edit">
          <label for="edit-todo"></label>
          <input
            type="text"
            name="edit-todo"
            id="editTodo"
            value="${todoItem}"
          />
        </div>`;
    }
  }

  let editSubmitForm = document.querySelector("#editTodo");

  editSubmitForm?.addEventListener("keydown", (event) => {
    let edit = allTodosArr.filter((x) => x.todoId === storeThisId)[0];
    if (event.key === "Enter") {
      edit["todoItem"] = event.target.value;
      edit["giveEDitPermission"] = false;
      return addToDOM(allTodosArr, todoStatus);
    } else if (event.key === "Escape") {
      edit["giveEDitPermission"] = false;
      return addToDOM(allTodosArr, todoStatus);
    }
  });
}

function editFn(id) {
  allTodosArr.filter((x) => {
    if (x.todoId === id) {
      if (x.giveEDitPermission === false) {
        x.giveEDitPermission = true;
      } else {
        x.giveEDitPermission = false;
      }
    }
  });
  return updateToDom(allTodosArr, todoStatus);
}

function closeId(id) {
  for (let i = 0; i < allTodosArr.length; i++) {
    const { todoId } = allTodosArr[i];
    if (todoId === id) {
      allTodosArr.splice(i, 1);
    }
  }
  return addToDOM(allTodosArr, todoStatus);
}

document.querySelector("#handle-all")?.addEventListener("click", (event) => {
  document.querySelector("#handle-all").classList.add("handle-active");
  document.querySelector("#handle-complete").classList.remove("handle-active");
  document
    .querySelector("#handle-active-items")
    .classList.remove("handle-active");

  todoStatus.all = true;
  todoStatus.active = false;
  todoStatus.completed = false;
  return addToDOM(allTodosArr, todoStatus);
});

document
  .querySelector("#handle-active-items")
  ?.addEventListener("click", (event) => {
    document.querySelector("#handle-all").classList.remove("handle-active");
    document
      .querySelector("#handle-active-items")
      .classList.add("handle-active");
    document
      .querySelector("#handle-complete")
      .classList.remove("handle-active");

    todoStatus.active = true;
    todoStatus.all = false;
    todoStatus.completed = false;
    return addToDOM(allTodosArr, todoStatus);
  });

document
  .querySelector("#handle-complete")
  ?.addEventListener("click", (event) => {
    document.querySelector("#handle-complete").classList.add("handle-active");
    document.querySelector("#handle-all").classList.remove("handle-active");
    document
      .querySelector("#handle-active-items")
      .classList.remove("handle-active");

    todoStatus.completed = true;
    todoStatus.all = false;
    todoStatus.active = false;
    return addToDOM(allTodosArr, todoStatus);
  });

function clearItems() {
  todoStatus.completed = false;
  todoStatus.all = false;
  todoStatus.active = false;
  return addToDOM(allTodosArr, todoStatus);
}



document.getElementById("checker")?.addEventListener("click", (event) => {

  let down = document.querySelector('.downward-arrow');
  if(down.className.includes("colorize")){
    allTodosArr.map((x) => x.strike = false);
  todoStatus.all = true;
  todoStatus.completed = false;
  todoStatus.active = false;
  down.classList.remove("colorize")
  return addToDOM(allTodosArr, todoStatus)
  }else {
    allTodosArr.map((x) => x.strike = true);

  todoStatus.all = true;
  todoStatus.completed = false;
  todoStatus.active = false;
  down.classList.add("colorize")

  return addToDOM(allTodosArr, todoStatus)
  }
  
})
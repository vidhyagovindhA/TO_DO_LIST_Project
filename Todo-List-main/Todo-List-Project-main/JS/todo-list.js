// global variable
let filterValue = "all";

// selecting
const selectTodoForm = document.querySelector(".todo-form");
const selectTodoInput = document.querySelector(".todo-input");
const selectTodoList = document.querySelector(".todo-list");
const selectFilterTodos = document.querySelector(".filter-todos");
const selectBackdrop = document.querySelector(".backdrop");
const selectModal = document.querySelector(".modal");
const selectModalInput = document.querySelector(".modal__input");
const selectConfirmBtn = document.querySelector(".close-modal");

// evens
selectTodoForm.addEventListener("submit", addNewTodo);
selectFilterTodos.addEventListener("change", (event) => {
  (filterValue = event.target.value), filterTodos();
});
document.addEventListener("DOMContentLoaded", () => {
  const todos = getAllTodos();
  creatNewTodo(todos);
});

// functions
function addNewTodo(event) {
  event.preventDefault();

  if (!selectTodoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    title: selectTodoInput.value,
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };

  saveTodo(newTodo);
  filterTodos();
}
function creatNewTodo(array) {
  let result = "";
  array.forEach((todo) => {
    result += `
      <li class="todo">
          <p class="todo__title ${todo.isCompleted && "completed"}">
            ${todo.title}
          </p>
          <span class="todo__createdat">
            ${new Date(todo.createdAt).toLocaleDateString("en-US")}
          </span>
          <button class="todo__edit" data-todo-id=${todo.id}>
            <i class="far fa-pen-to-square"></i>
          </button>
          <button class="todo__check" data-todo-id=${todo.id}>
            <i class="far fa-check-square"></i>
          </button>
          <button class="todo__remove" data-todo-id=${todo.id}>
            <i class="far fa-trash-alt"></i>
          </button>
      </li>`;
  });

  selectTodoList.innerHTML = result;
  selectTodoInput.value = "";

  const selectRemoveBtns = [...document.querySelectorAll(".todo__remove")];
  selectRemoveBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const selectCheckBtns = [...document.querySelectorAll(".todo__check")];
  selectCheckBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  const selectEditBtns = [...document.querySelectorAll(".todo__edit")];
  selectEditBtns.forEach((btn) => btn.addEventListener("click", editTodo));
}
function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      creatNewTodo(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((todo) => todo.isCompleted);
      creatNewTodo(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((todo) => !todo.isCompleted);
      creatNewTodo(filteredTodos);
      break;
    }
    default:
      creatNewTodo(todos);
  }
}
function removeTodo(event) {
  let todos = getAllTodos();
  const todoId = Number(event.target.dataset.todoId);
  todos = todos.filter((todo) => todo.id !== todoId);

  saveAllTodos(todos);
  filterTodos();
}
function checkTodo(event) {
  const todos = getAllTodos();
  const todoId = Number(event.target.dataset.todoId);
  const checkedTodo = todos.find((todo) => todo.id === todoId);
  checkedTodo.isCompleted = !checkedTodo.isCompleted;

  saveAllTodos(todos);
  filterTodos();
}
function editTodo(event) {
  selectBackdrop.classList.remove("hidden");
  selectModal.classList.remove("hidden");

  const todos = getAllTodos();
  const todoId = Number(event.target.dataset.todoId);
  const editedTodo = todos.find((todo) => todo.id === todoId);
  selectModalInput.value = editedTodo.title;

  selectConfirmBtn.addEventListener("click", addEditedTodo);

  function addEditedTodo() {
    selectBackdrop.classList.add("hidden");
    selectModal.classList.add("hidden");

    if (selectModalInput.value != "") {
      editedTodo.title = selectModalInput.value;
    }

    saveAllTodos(todos);
    filterTodos();
  }
}

// local storage => web API
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}
function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

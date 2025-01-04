const themeSwitch = document.querySelector('.switch-theme');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-List');
const itemsLeft = document.querySelector('.items-left');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.querySelector('.clear-completed');
const todoItem = document.querySelector('.todo-item');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFliter = 'all';
let darkmode = localStorage.getItem('darkmode');


/// theme switch stuff
const enableDarkmode = () => {
  document.body.classList.add('dark-mode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('dark-mode')
  localStorage.setItem('darkmode', null)
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

//theme switch end.......................................




function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoItem(todo) {
  const div = document.createElement('div');
  div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  div.draggable = true;
  div.dataset.id = todo.id;
  div.innerHTML = `
    <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
    <p>${todo.text}</p>
    <button class="delete-todo"> X </button>   `;
  return div;
}

function renderTodos() {
  let filteredTodos = todos.filter(todo => {
    if (currentFliter === 'active') return !todo.completed;
    if (currentFliter === 'completed') return todo.completed;
    return true;
  });


  todoList.innerHTML = '';
  filteredTodos.forEach(todo => {
    todoList.appendChild(createTodoItem(todo));
  });

  itemsLeft.textContent = `${todos.filter(todo => !todo.completed).length} items left`;
}

todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && todoInput.value.trim()) {

    todos.push({
      id: Date.now(),
      text: e.target.value.trim(),
      completed: false
    });

    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});


todoList.addEventListener('click', e => {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  if (e.target.matches('.checkbox')) {
    const todo = todos.find(t => t.id === Number(item.dataset.id));
    todo.completed = e.target.checked;
    item.classList.toggle('completed', todo.completed);
    saveTodos();
    renderTodos();
  }

  if (e.target.matches('.delete-todo')) {
    todos = todos.filter(todo => todo.id !== Number(item.dataset.id));
    saveTodos();
    renderTodos();
  }

});


todoList.addEventListener('dragstart', e => {
  const item = e.target.closest('.todo-item');
  if (item) {
    item.classList.add('dragging');
    e.target.classList.add('dragging');
  }
});

todoList.addEventListener('dragend', e => {
  e.target.closest('.todo-item')?.classList.remove('dragging')
});

todoList.addEventListener('dragover', e => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  const target = e.target.closest('.todo-item');
  if (dragging && target && dragging !== target) {
    const dragggedId = Number(dragging.dataset.id);
    const targetId = Number(target.dataset.id);
    const draggedIndex = todos.findIndex(todo => todo.id === dragggedId);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);

    todos.splice(targetIndex, 0, todos.splice(draggedIndex, 1)[0]);
    saveTodos();
    renderTodos();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFliter = btn.dataset.filter;
    renderTodos();

  });
});


clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});









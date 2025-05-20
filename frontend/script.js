const apiUrl = 'http://localhost:5279/api/todo'; // change to match your backend port
const form = document.getElementById('todo-form');
const input = document.getElementById('new-todo');
const list = document.getElementById('todo-list');

async function fetchTodos() {
  const res = await fetch(apiUrl);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(addTodoToDOM);
}

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  li.className =
    'flex items-center justify-between bg-gray-100 px-4 py-2 rounded';

  const text = document.createElement('span');
  text.textContent = todo.title;
  if (todo.isComplete) {
    text.classList.add('line-through', 'text-gray-500');
  }

  const actions = document.createElement('div');
  actions.className = 'space-x-2';

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = todo.isComplete ? 'Undo' : 'Done';
  toggleBtn.className = 'text-sm text-green-600';
  toggleBtn.onclick = async () => {
    todo.isComplete = !todo.isComplete;
    await fetch(`${apiUrl}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    fetchTodos();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'text-sm text-red-600';
  deleteBtn.onclick = async () => {
    await fetch(`${apiUrl}/${todo.id}`, { method: 'DELETE' });
    fetchTodos();
  };

  actions.append(toggleBtn, deleteBtn);
  li.append(text, actions);
  list.appendChild(li);
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete: false }),
  });
  input.value = '';
  fetchTodos();
};

fetchTodos();

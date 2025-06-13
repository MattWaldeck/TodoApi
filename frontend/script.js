const apiUrl = 'http://localhost:5279/api/todo';
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

const API_BASE_URL = 'http://localhost:5279/api/todo';

document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const newTodoInput = document.getElementById('new-todo');
  const todoList = document.getElementById('todo-list');

  async function fetchTodos() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todos = await response.json();
      renderTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      displayMessage(
        'Failed to load todos. Please check the API connection.',
        'red'
      );
    }
  }

  function renderTodos(todos) {
    todoList.innerHTML = '';
    if (todos.length === 0) {
      todoList.innerHTML =
        '<li class="text-gray-500 text-center py-4">No tasks yet! Add one above.</li>';
      return;
    }

    todos.forEach((todo) => {
      const listItem = document.createElement('li');
      listItem.className =
        'flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm';
      listItem.setAttribute('data-id', todo.id);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.isComplete;
      checkbox.className =
        'mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500';
      checkbox.addEventListener('change', async () => {
        todo.isComplete = checkbox.checked;
        await updateTodo(todo);
        listItem
          .querySelector('span')
          .classList.toggle('line-through', todo.isComplete);
      });

      const todoText = document.createElement('span');
      todoText.textContent = todo.name;
      todoText.className = `flex-1 text-lg ${
        todo.isComplete ? 'line-through text-gray-500' : 'text-gray-800'
      }`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className =
        'ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200 ease-in-out';
      deleteButton.addEventListener('click', async () => {
        await deleteTodo(todo.id);
      });

      listItem.append(checkbox, todoText, deleteButton);
      todoList.appendChild(listItem);
    });
  }

  todoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const todoName = newTodoInput.value.trim();
    if (todoName === '') {
      displayMessage('Task name cannot be empty!', 'orange');
      return;
    }

    const newTodo = {
      name: todoName,
      isComplete: false,
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTodo = await response.json();
      displayMessage('Task added successfully!', 'green');
      newTodoInput.value = '';
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      displayMessage('Failed to add task. Please try again.', 'red');
    }
  });

  async function updateTodo(todo) {
    try {
      const response = await fetch(`${API_BASE_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      displayMessage('Task updated successfully!', 'green');
    } catch (error) {
      console.error('Error updating todo:', error);
      displayMessage('Failed to update task. Please try again.', 'red');
    }
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      displayMessage('Task deleted successfully!', 'green');
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      displayMessage('Failed to delete task. Please try again.', 'red');
    }
  }

  let messageTimeout;
  function displayMessage(text, type = 'blue') {
    const messageBoxId = 'app-message-box';
    let messageBox = document.getElementById(messageBoxId);

    if (!messageBox) {
      messageBox = document.createElement('div');
      messageBox.id = messageBoxId;
      messageBox.className =
        'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ease-in-out transform translate-x-full opacity-0';
      document.body.appendChild(messageBox);
    }

    clearTimeout(messageTimeout);
    messageBox.className = messageBox.className.replace(
      /bg-(red|green|orange|blue)-\d+/,
      ''
    );

    let bgColor;
    switch (type) {
      case 'green':
        bgColor = 'bg-green-500';
        break;
      case 'red':
        bgColor = 'bg-red-500';
        break;
      case 'orange':
        bgColor = 'bg-orange-500';
        break;
      case 'blue':
        bgColor = 'bg-blue-500';
        break;
      default:
        bgColor = 'bg-blue-500';
    }

    messageBox.textContent = text;
    messageBox.classList.add(bgColor);
    messageBox.classList.remove('translate-x-full', 'opacity-0');
    messageBox.classList.add('translate-x-0', 'opacity-100');

    messageTimeout = setTimeout(() => {
      messageBox.classList.remove('translate-x-0', 'opacity-100');
      messageBox.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
  }

  fetchTodos();
});

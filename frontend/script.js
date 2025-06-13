const apiUrl = 'http://localhost:5279/api/todo';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('new-todo');
  const list = document.getElementById('todo-list');

  // Load todos from API on page load
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      data.forEach(addTodoToList);
    })
    .catch((err) => console.error('Error fetching todos:', err));

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });

      const newTodo = await response.json();
      addTodoToList(newTodo);
      input.value = '';
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  });

  // Render a todo item
  function addTodoToList(todo) {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-2 bg-gray-100 rounded';

    li.innerHTML = `
      <span>${todo.title}</span>
      <button class="text-red-500" data-id="${todo.id}">✕</button>
    `;

    // Handle delete
    li.querySelector('button').addEventListener('click', async () => {
      const id = todo.id;
      try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        li.remove();
      } catch (err) {
        console.error('Error deleting todo:', err);
      }
    });

    list.appendChild(li);
  }
});

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const status = document.getElementById('status');

async function loadTasks() {
  status.textContent = 'Loading...';
  try {
    const res = await fetch(`${API_URL}/api/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
    status.textContent = '';
  } catch (err) {
    status.textContent = 'Could not reach the backend. Is API_URL correct?';
  }
}

function renderTasks(tasks) {
  list.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => toggleTask(task));

    const del = document.createElement('button');
    del.textContent = '✕';
    del.addEventListener('click', () => deleteTask(task.id));

    li.append(span, del);
    list.appendChild(li);
  });
}

async function toggleTask(task) {
  await fetch(`${API_URL}/api/tasks/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !task.done }),
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  input.value = '';
  loadTasks();
});

loadTasks();

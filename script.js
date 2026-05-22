let tasksData = {};
let dragElement = null;

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

const columns = [todo, progress, done];


// CREATE TASK

function addTask(title, desc, column) {

    const div = document.createElement('div');

    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    // Drag Start
    div.addEventListener('dragstart', () => {
        dragElement = div;
    });

    // Delete Task
    const deleteBtn = div.querySelector('.delete-btn');

    deleteBtn.addEventListener('click', () => {
        div.remove();

        updateTaskCount();
        saveTasks();
    });

    column.appendChild(div);

    updateTaskCount();
    saveTasks();
}


// UPDATE TASK COUNT

function updateTaskCount() {

    columns.forEach(col => {

        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        if (count) {
            count.textContent = tasks.length;
        }

    });

}

// SAVE TASKS

function saveTasks() {

    tasksData = {};

    columns.forEach(col => {

        const tasks = col.querySelectorAll('.task');

        tasksData[col.id] = Array.from(tasks).map(task => ({
            title: task.querySelector('h2').textContent,
            desc: task.querySelector('p').textContent
        }));

    });

    localStorage.setItem('tasks', JSON.stringify(tasksData));
}


// LOAD TASKS

function loadTasks() {

    const savedTasks = localStorage.getItem('tasks');

    if (!savedTasks) return;

    const data = JSON.parse(savedTasks);

    for (const col in data) {

        const column = document.querySelector(`#${col}`);

        if (!column) continue;

        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });

    }

}

loadTasks();

// DRAG & DROP

function addDragEventsOnColumn(column) {

    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });

    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('hover-over');
    });

    column.addEventListener('drop', (e) => {

        e.preventDefault();

        if (!dragElement) return;

        column.appendChild(dragElement);

        column.classList.remove('hover-over');

        updateTaskCount();
        saveTasks();

    });

}

columns.forEach(column => {
    addDragEventsOnColumn(column);
});


// MODAL

const toggleModalButton = document.querySelector('#toggle-modal');
const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal .bg');
const addTaskButton = document.querySelector('#add-new-task');

toggleModalButton.addEventListener('click', () => {
    modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
    modal.classList.remove('active');
});

// ADD NEW TASK

addTaskButton.addEventListener('click', () => {

    const title = document.querySelector('#task-title-input').value.trim();

    const desc = document.querySelector('#task-desc-input').value.trim();

    if (title === '' || desc === '') {
        alert('Please fill all fields');
        return;
    }

    addTask(title, desc, todo);

    modal.classList.remove('active');

    document.querySelector('#task-title-input').value = '';
    document.querySelector('#task-desc-input').value = '';

});
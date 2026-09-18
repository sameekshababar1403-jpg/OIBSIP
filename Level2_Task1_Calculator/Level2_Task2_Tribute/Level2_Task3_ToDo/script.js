// ================================
// To-Do App
// ================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");

// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ================================
// Save Tasks
// ================================

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// ================================
// Display Tasks
// ================================

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <p class="empty-message">
                No tasks yet. Add your first task!
            </p>
        `;

        updateTaskCount();
        return;
    }

    tasks.forEach(function (task) {
        const taskItem = document.createElement("article");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.innerHTML = `
            <div class="task-content">
                <h3>${escapeHTML(task.text)}</h3>
                <p>${task.time}</p>
            </div>

            <div class="task-actions">
                <button
                    class="complete-btn"
                    type="button"
                    data-id="${task.id}"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="edit-btn"
                    type="button"
                    data-id="${task.id}"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    type="button"
                    data-id="${task.id}"
                >
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    updateTaskCount();
}


// ================================
// Add Task
// ================================

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        time: new Date().toLocaleString()
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// ================================
// Complete / Edit / Delete
// ================================

taskList.addEventListener("click", function (event) {

    const button = event.target;

    if (!button.dataset.id) {
        return;
    }

    const taskId = Number(button.dataset.id);

    // Complete / Undo
    if (button.classList.contains("complete-btn")) {

        tasks = tasks.map(function (task) {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }


    // Edit
    if (button.classList.contains("edit-btn")) {

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });

        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) {
            return;
        }

        const trimmedText = updatedText.trim();

        if (trimmedText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = trimmedText;

        saveTasks();
        renderTasks();
    }


    // Delete
    if (button.classList.contains("delete-btn")) {

        const confirmed = confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        tasks = tasks.filter(function (task) {
            return task.id !== taskId;
        });

        saveTasks();
        renderTasks();
    }
});


// ================================
// Update Task Count
// ================================

function updateTaskCount() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}


// ================================
// Prevent HTML Injection
// ================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// Event Listeners
// ================================

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }
});


// ================================
// Initial Render
// ================================

renderTasks();
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskPerson = document.getElementById('task-person');
    const pendingTasks = document.getElementById('pending-tasks').querySelector('.task-container');
    const completedTasks = document.getElementById('completed-tasks').querySelector('.task-container');
    const pastDueTasks = document.getElementById('past-due-tasks').querySelector('.task-container');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.setAttribute('draggable', true);
        taskDiv.dataset.id = task.id;

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.innerHTML = `
            <strong>${task.content}</strong>
            <small>Due: ${task.dueDate}</small>
            <small>Assigned to: ${task.assignedTo}</small>
        `;

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            task.status = 'completed';
            saveTasks();
            renderTasks();
        });

        taskActions.appendChild(completeButton);
        taskDiv.appendChild(taskContent);
        taskDiv.appendChild(taskActions);

        taskDiv.addEventListener('dragstart', () => {
            taskDiv.classList.add('dragging');
        });

        taskDiv.addEventListener('dragend', () => {
            taskDiv.classList.remove('dragging');
        });

        return taskDiv;
    }

    function renderTasks() {
        const now = new Date();
        pendingTasks.innerHTML = '';
        completedTasks.innerHTML = '';
        pastDueTasks.innerHTML = '';

        tasks.forEach(task => {
            const taskDueDate = new Date(task.dueDate);
            if (task.status === 'completed') {
                completedTasks.appendChild(createTaskElement(task));
            } else if (taskDueDate < now) {
                pastDueTasks.appendChild(createTaskElement(task));
            } else {
                pendingTasks.appendChild(createTaskElement(task));
            }
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now().toString(),
            content: taskInput.value,
            dueDate: taskDate.value,
            assignedTo: taskPerson.value,
            status: 'pending'
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    document.querySelectorAll('.list .task-container').forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            container.appendChild(draggingTask);
        });

        container.addEventListener('drop', () => {
            const draggingTask = document.querySelector('.dragging');
            const taskId = draggingTask.dataset.id;
            const task = tasks.find(task => task.id === taskId);

            if (container === completedTasks) {
                task.status = 'completed';
            } else if (container === pendingTasks) {
                task.status = 'pending';
            }

            saveTasks();
            renderTasks();
        });
    });

    renderTasks();
});

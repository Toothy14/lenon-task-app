let taskList = JSON.parse(localStorage.getItem('taskList')) || []; //Contains all of the tasks

const currentUser = 'Alf';

const userTasks = taskList.filter((task) => task.assignedTo === currentUser);

const taskListElement = document.querySelector('.task-list');

function renderUserTasks() {
	let html = '';

	userTasks.forEach((task) => {
		html += `
        <li>
        <h3>${task.title}</h3>
        <p>Status: ${task.status}</p>
        </li>
        `;
	});
	taskListElement.innerHTML = html;
}

renderUserTasks();

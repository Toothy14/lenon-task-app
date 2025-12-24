const taskList = [
	{
		title: 'Clean the kitchen',
		assignedTo: 'Alf',
		status: 'pending',
	},
];

const form = document.querySelector('.js-task-form');
const addTask = document.querySelector('.js-add-button');
const inputElement = document.querySelector('.js-task-input');
const userSelect = document.querySelector('.js-user-select');

form.addEventListener('submit', (event) => {
	addTasks(event);
});

function addTasks(event) {
	event.preventDefault(); //prevents the default behavior of the browser (reloading automatically)

	const taskTitle = inputElement.value;
	const assignedUser = userSelect.value;

	if (!taskTitle || !assignedUser) return;
	//checks first if the taskTitle or assignedUser is empty

	//else if both are not empty
	taskList.push({
		title: taskTitle,
		assignedTo: assignedUser,
		status: 'pending',
	});
	renderTaskList();
}

function renderTaskList() {
	let taskListHTML = '';

	taskList.forEach((task) => {
		const html = `<li class="task">
							<h3>${task.title}</h3>
							<p>Assigned to: ${task.assignedTo}</p>
							<span data-status="pending">${task.status}</span>
						</li>`;
		taskListHTML += html;
	});
	document.querySelector('.task-list').innerHTML = taskListHTML;
}

//Data
let taskList = [
	{
		title: 'Clean the kitchen',
		assignedTo: 'Alf',
		status: 'pending',
	},
];

//DOM Elements
const form = document.querySelector('.js-task-form'); //Form
const inputElement = document.querySelector('.js-task-input'); //Input
const userSelect = document.querySelector('.js-user-select'); //Select
const taskListElement = document.querySelector('.task-list'); //UL

form.addEventListener('submit', (event) => {
	addTasks(event);
});

//functions
function addTasks(event) {
	event.preventDefault(); //prevents the default behavior of the browser (reloading automatically)

	const taskTitle = inputElement.value;
	const assignedUser = userSelect.value;

	if (!taskTitle || !assignedUser) return;
	//checks first if the taskTitle or assignedUser is empty

	//else if both are not empty
	taskList.push({
		id: Date.now(),
		title: taskTitle,
		assignedTo: assignedUser,
		status: 'pending',
	});
	console.log(taskList);
	renderTaskList();
}

//render the task list
function renderTaskList() {
	let taskListHTML = '';

	taskList.forEach((task) => {
		const html = `<li class="task">
							<h3>${task.title}</h3>
							<p>Assigned to: ${task.assignedTo}</p>
							<span data-status="pending">${task.status}</span>

							<button
				class="task-delete"
				data-id="${task.id}">
				Delete
			</button>
						</li>`;

		taskListHTML += html;
	});

	document.querySelector('.task-list').innerHTML = taskListHTML;
}

function deleteTask() {
	//UL (taskListElement) = handles the children (buttons)
	taskListElement.addEventListener('click', (event) => {
		if (event.target.classList.contains('task-delete')) {
			const id = Number(event.target.dataset.id);

			taskList = taskList.filter((task) => task.id !== id);
			//Creates a new array and move the tasks to the new array except for the id or task that we deleted

			renderTaskList();
			//update the task list after changing the data
		}
	});
}

deleteTask();

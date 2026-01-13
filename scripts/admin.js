import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';
import { saveTasks, loadTasks } from './utils/storage.js';
import { approveTask, rejectTask } from './utils/taskService.js';

//Local storage
let taskList = loadTasks();

//DOM Elements
const tasksContainer = document.querySelector('.tasks-container');
const taskListElement = document.querySelector('.pending-list'); //UL
const approvedListElement = document.querySelector('.approved-task-list'); //UL
const rejectedListElement = document.querySelector('.rejected-task-list'); //UL
//Form
const form = document.querySelector('.js-task-form');
form.addEventListener('submit', (event) => {
	addTasks(event);
});

//functions

//add tasks
function addTasks(event) {
	event.preventDefault(); //prevents the default behavior of the browser (reloading automatically)

	const inputElement = document.querySelector('.js-task-input'); //Input
	const userSelect = document.querySelector('.js-user-select'); //Select

	const taskTitle = inputElement.value.trim();
	const assignedUser = userSelect.value;

	//checks first if the taskTitle or assignedUser is empty
	if (!taskTitle || !assignedUser) return;

	//else if both are not empty
	taskList.push({
		id: Date.now(),
		title: taskTitle,
		assignedTo: assignedUser,
		assignedDate: getFormattedDate(),
		status: 'pending',
	});

	form.reset(); //Clears the elements
	saveTasks(taskList);
	renderTaskList();
}

let editTaskId = null; //stores the id of the task currently (being edited)

//render the task list
function renderTaskList() {
	let htmlPendingTasks = '';
	let htmlApprovedTasks = '';
	let htmlRejectedTasks = '';

	taskList.forEach((task) => {
		if (editTaskId !== null && task.id === editTaskId) {
			//editable view

			//PLEASE STUDY THE TAILWIND CSS YOU PUT
			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-3">
	<input
		type="text"
		class="edit-title w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
		value="${task.title}"
	/>

	<select
		class="edit-user w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
	>
		<option value="Alf" ${task.assignedTo === 'Alf' ? 'selected' : ''}>Alf</option>
		<option value="Princess" ${
			task.assignedTo === 'Princess' ? 'selected' : ''
		}>Princess</option>
	</select>

	<div class="flex gap-2">
		<button class="task-save bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600" data-id="${
			task.id
		}">
			Save
		</button>
		<button class="task-cancel bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400" data-id="${
			task.id
		}">
			Cancel
		</button>
		<button class="task-delete bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-auto" data-id="${
			task.id
		}">
			Delete
		</button>
	</div>
</li>
`;
		} else if (!task.proof) {
			//if no proof yet

			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>

	<p class="text-sm text-gray-600">Assigned to: <strong>${task.assignedTo}</strong></p>
	<p class="text-sm text-gray-500">Assigned on: ${task.assignedDate}</p>

	<span class="inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
		Pending
	</span>

	<div class="flex gap-2 pt-2">
		<button class="task-edit bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600" data-id="${task.id}">
			Edit
		</button>
		<button class="task-delete bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${task.id}">
			Delete
		</button>
	</div>
</li>
`;
		} else if (task.proof.status === 'pending') {
			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>

	<p class="text-sm">
		<strong>Status:</strong> Submitted by <strong>${task.assignedTo}</strong>
	</p>

	<p class="text-sm text-gray-500">Submitted on: ${task.submittedDate}</p>

	<p class="text-sm bg-gray-100 p-2 rounded">
		<strong>Proof:</strong> ${task.proof.text}
	</p>

	<div class="flex gap-2 pt-2">
		<button class="approve-button bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600" data-id="${task.id}">
			Approve
		</button>
		<button class="reject-button bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${task.id}">
			Reject
		</button>
	</div>
</li>
`;
		}
		//Reject/Approve Section
		else if (task.proof.status === 'approved') {
			htmlApprovedTasks += `
<li class="bg-green-50 rounded-xl border border-green-200 p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>
	<p class="text-sm">Approved for <strong>${task.assignedTo}</strong></p>
	<p class="text-sm text-gray-600">Approved on: ${task.reviewedDate}</p>
</li>
`;
		} else if (task.proof.status === 'rejected') {
			htmlRejectedTasks += `
<li class="bg-red-50 rounded-xl border border-red-200 p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>
	<p class="text-sm">Rejected for <strong>${task.assignedTo}</strong></p>
	<p class="text-sm text-gray-600">Rejected on: ${task.reviewedDate}</p>
</li>
`;
		}
	});

	taskListElement.innerHTML = htmlPendingTasks;
	approvedListElement.innerHTML = htmlApprovedTasks;
	rejectedListElement.innerHTML = htmlRejectedTasks;
}

function controllers() {
	//UL (taskListElement) = handles the children (buttons)
	tasksContainer.addEventListener('click', (event) => {
		const id = Number(event.target.dataset.id);

		//Delete button
		if (event.target.classList.contains('task-delete')) {
			taskList = taskList.filter((task) => task.id !== id);
			//Creates a new array and move the tasks to the new array except for the id or task that we deleted
			saveTasks(taskList);
			renderTaskList();
			//update the task list after changing the data
		}

		//Edit button
		if (event.target.classList.contains('task-edit')) {
			editTaskId = id; //set this 'id'(task) to edit mode
			renderTaskList();
			//update the task list after changing the data
		}

		//Cancel button
		if (event.target.classList.contains('task-cancel')) {
			editTaskId = null; //exit edit mode because null = no value
			renderTaskList();
			//update the task list after changing the data
		}

		//Save button
		if (event.target.classList.contains('task-save')) {
			//find the id that we want to save
			const task = findTaskById(taskList, id);

			if (!task) return;
			// --------------------------------------------------------
			//grab new values from editable view

			//to access the elements inside 'li' such as --
			//edit-title, and edit-user
			//basically, we need to go inside the 'li' first
			const li = event.target.closest('li');

			//what the user typed in the title input in editable view
			const newTitle = li.querySelector('.edit-title').value;

			//reads the new selected assigned user in editable view
			const newUser = li.querySelector('.edit-user').value;

			//update taskList
			task.title = newTitle;
			task.assignedTo = newUser;

			editTaskId = null; //Exit edit mode
			saveTasks(taskList);

			renderTaskList(); //update the page
		}

		if (event.target.classList.contains('approve-button')) {
			approveTask(taskList, id);
			renderTaskList();
		}

		if (event.target.classList.contains('reject-button')) {
			rejectTask(taskList, id);
			renderTaskList();
		}
	});
}
controllers(); //Run the controllers
renderTaskList(); //Render the task list

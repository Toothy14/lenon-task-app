import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';
import { saveTasks, loadTasks } from './utils/storage.js';

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
			htmlPendingTasks += `
			<li class="task">
				<input type="text" class="edit-title" value="${task.title}" />
				<select class="edit-user">
					<option value="Alf" ${task.assignedTo === 'Alf' ? 'selected' : ''}>Alf</option>
					<option value="Sister" ${
						task.assignedTo === 'Sister' ? 'selected' : ''
					}>Sister</option>
				</select>
				<button class="task-save" data-id="${task.id}">Save</button>
				<button class="task-cancel" data-id="${task.id}">Cancel</button>
				<button class="task-delete" data-id="${task.id}">Delete</button>
			</li>
		`;
		} else if (!task.proof) {
			//if no proof yet

			htmlPendingTasks += `<li class="task">
							<h3>${task.title}</h3>

							<p>Assigned to: ${task.assignedTo}</p>

							<label>Assigned on: ${task.assignedDate}</label>

							<span data-status="pending">Status: ${task.status}</span>

							<button
				class="task-delete"
				data-id="${task.id}">
				Delete
			</button>

			<button class="task-edit"
			data-id="${task.id}">
			Edit
			</button>
						</li>`;
		} else if (task.proof.status === 'pending') {
			htmlPendingTasks += `<li class="task">
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Submitted on: ${task.submittedDate}</label>
			<p><strong>Proof:</strong> ${task.proof.text}</p>

			<button class="approve-button"
			data-id="${task.id}"
			>Approve</button>
			<button class="reject-button"
			data-id="${task.id}"
			>Reject</button>
			</li>`;
		}
		//Reject/Approve Section
		else if (task.proof.status === 'approved') {
			htmlApprovedTasks += `<li>
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Approved on: ${task.reviewedDate}</label>
			</li>`;
		} else if (task.proof.status === 'rejected') {
			htmlRejectedTasks += `<li>
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Rejected on: ${task.reviewedDate}</label>
			</li>`;
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
			const task = findTaskById(taskList, id);

			if (!task || !task.proof) return;

			task.proof.status = 'approved';
			task.reviewedDate = getFormattedDate();
			saveTasks(taskList);
			renderTaskList();
		}

		if (event.target.classList.contains('reject-button')) {
			const task = findTaskById(taskList, id);

			if (!task || !task.proof) return;

			task.proof.status = 'rejected';
			task.reviewedDate = getFormattedDate();

			saveTasks(taskList);
			renderTaskList();
		}
	});
}
controllers(); //Run the controllers
renderTaskList(); //Render the task list

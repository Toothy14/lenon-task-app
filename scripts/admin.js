import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';
import { renderTaskList } from './utils/renderTaskList.js';
import { saveTasks, loadTasks } from './utils/storage.js';
import { approveTask, rejectTask } from './utils/taskService.js';
import { sidebarLogic } from './utils/sidebar.js';
//Local storage
let taskList = loadTasks();

//Form
const form = document.querySelector('.js-task-form');
form.addEventListener('submit', (event) => {
	addTasks(event);
});

// Sidebar logic
sidebarLogic();

// Every time the admin selects or unselects a user, update the UI
const userSelect = document.querySelector('.js-user-select');

userSelect.addEventListener('change', renderSelectedUsers);

// Display selected users
const selectedUsersContainer = document.querySelector('.selected-users');
function renderSelectedUsers() {
	const selectedUsers = Array.from(userSelect.selectedOptions).map(
		(option) => option.value,
	);
	selectedUsersContainer.innerHTML = selectedUsers
		.map(
			(user) => `
			<span class="px-2 py-1 bg-gray-200 rounded text-sm">
				${user}
			</span>
		`,
		)
		.join('');
}

// button logic to show the users when clicked
const toggleButton = document.querySelector('.js-toggle-users');

toggleButton.addEventListener('click', () => {
	userSelect.classList.toggle('hidden');
});

// functions

// add tasks
function addTasks(event) {
	event.preventDefault(); //prevents the default behavior of the browser (reloading automatically)

	const inputElement = document.querySelector('.js-task-input'); //Input

	const taskTitle = inputElement.value.trim();

	const dateElement = document.querySelector('.js-date-input');

	const dueDate = dateElement.value;

	// Default the date to today, so admins won't forget
	dateElement.value = dayjs().format('YYYY-MM-DD');

	// users selected
	const assignedUsers = Array.from(userSelect.selectedOptions).map(
		(option) => option.value,
	);

	//checks first if the taskTitle, assignedUser, and due date is empty
	if (!taskTitle || assignedUsers.length === 0 || !dueDate) return;

	// Prevents selecting past date for deadline
	if (dayjs(dueDate).isBefore(dayjs(), 'day')) {
		alert('Deadline cannot be in the past.');
		return;
	}

	//else if both are not empty
	taskList.push({
		id: Date.now(),
		title: taskTitle,
		assignedTo: assignedUsers,
		assignedDate: getFormattedDate(),
		status: 'pending',
		dueDate: dayjs(dueDate).format('MMM D, YYYY'),
	});

	form.reset(); //Clears the elements
	userSelect.classList.add('hidden');
	selectedUsersContainer.innerHTML = '';

	saveTasks(taskList);
	renderTaskList(taskList, editTaskId);
}

let editTaskId = null; //stores the id of the task currently (being edited)

//render task list
renderTaskList(taskList, editTaskId);

function controllers() {
	const tasksContainer = document.querySelector('.tasks-container'); //div

	//Div (handles the children)
	tasksContainer.addEventListener('click', (event) => {
		const id = Number(event.target.dataset.id);

		//Delete button
		if (event.target.classList.contains('task-delete')) {
			taskList = taskList.filter((task) => task.id !== id);
			//Creates a new array and move the tasks to the new array except for the id or task that we deleted
			saveTasks(taskList);
			renderTaskList(taskList, editTaskId);
			//update the task list after changing the data
		}

		//Edit button
		if (event.target.classList.contains('task-edit')) {
			editTaskId = id; //set this 'id'(task) to edit mode
			renderTaskList(taskList, editTaskId);
			//update the task list after changing the data
		}

		//Cancel button
		if (event.target.classList.contains('task-cancel')) {
			editTaskId = null; //exit edit mode because null = no value
			renderTaskList(taskList, editTaskId);
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

			const selectedUsers = Array.from(
				li.querySelector('.edit-user').selectedOptions,
			).map((option) => option.value);

			//update taskList
			task.title = newTitle;
			task.assignedTo = selectedUsers;

			editTaskId = null; //Exit edit mode
			saveTasks(taskList);

			renderTaskList(taskList, editTaskId); //update the page
		}

		if (event.target.classList.contains('approve-button')) {
			approveTask(taskList, id);
			renderTaskList(taskList, editTaskId);
		}

		if (event.target.classList.contains('reject-button')) {
			rejectTask(taskList, id);
			renderTaskList(taskList, editTaskId);
		}
	});
}
controllers(); //Run the controllers

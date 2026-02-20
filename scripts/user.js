import { loadTasks } from './utils/storage.js';
import { submitProof } from './utils/taskService.js';
import { setCurrentUser, getCurrentUser } from './utils/userService.js';
import { renderUserTasks } from './utils/renderUserTasks.js';
import { sidebarLogic } from './utils/sidebar.js';
import { sortTasksByDueDate } from './utils/sortTasks.js';
import { renderSortedUserTasks } from './utils/renderSortedTasks.js';

let taskList = loadTasks(); //Contains all of the tasks (local storage)

const currentUser = getCurrentUser(); //user state (Data)

const userSwitch = document.querySelector('.js-user-switch');

//user switch logic
if (userSwitch) {
	if (currentUser) {
		userSwitch.value = currentUser;
	}
	userSwitch.addEventListener('change', () => {
		const selectedUser = userSwitch.value;
		setCurrentUser(selectedUser);

		location.reload(); //reload the browser
	});
}

//Sidebar Logic
sidebarLogic();

// Filter Tasks
const filterSelect = document.querySelector('.js-due-filter');
filterSelect.addEventListener('change', () => {
	renderSortedUserTasks(taskList, currentUser, true);
});

// Render sorted tasks (Earliest to Latest)
renderSortedUserTasks(taskList, currentUser, true);

// Sort task by Due Date Logic
const sortSelect = document.querySelector('.js-sort-due');

sortSelect.addEventListener('change', () => {
	renderSortedUserTasks(taskList, currentUser, true);
});

const tasksContainer = document.querySelector('.tasks-container');

tasksContainer.addEventListener('click', (event) => {
	if (!event.target.classList.contains('submit-proof')) return;
	//id of task we want to submit proof
	const id = Number(event.target.dataset.id);

	//go inside the li
	const li = event.target.closest('li');

	//to access its element like input element
	const input = li.querySelector('.input-proof');

	//use .trim() to prevent human typos
	const proofText = input.value.trim();

	//check if input has no value
	if (!proofText) return;

	//submit proof logic
	submitProof(taskList, id, proofText);

	// render the filtered and sorted tasks
	renderSortedUserTasks(taskList, currentUser);
});

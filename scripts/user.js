import { loadTasks } from './utils/storage.js';
import { submitProof } from './utils/taskService.js';
import { setCurrentUser, getCurrentUser } from './utils/userService.js';
import { renderUserTasks } from './utils/renderUserTasks.js';
import { sidebarLogic } from './utils/sidebar.js';
import { sortTasksByDueDate } from './utils/sortTasks.js';

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

// Render sorted tasks (Earliest to Latest)
const sortValue = document.querySelector('.js-sort-due').value;
const sortedTasks = sortTasksByDueDate(taskList, sortValue);
renderUserTasks(sortedTasks, currentUser);

//Sidebar Logic
sidebarLogic();

// Sort task by Due Date Logic
const sortSelect = document.querySelector('.js-sort-due');

sortSelect.addEventListener('change', () => {
	const value = sortSelect.value;

	const userTasks = taskList.filter((task) =>
		task.assignedTo.includes(currentUser),
	);

	// Notice that 'tasks', and 'sortType' from sortTasks.js changed into 'userTasks', and 'value'
	// We can change variables or values using parameter
	const sortedTasks = sortTasksByDueDate(userTasks, value);

	// Render sorted user task list
	renderUserTasks(sortedTasks, currentUser, true);
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

	//re-render the updated data
	renderUserTasks(taskList, currentUser);
});

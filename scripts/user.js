import { loadTasks } from './utils/storage.js';
import { submitProof } from './utils/taskService.js';
import { setCurrentUser, getCurrentUser } from './utils/userService.js';
import { renderUserTasks } from './utils/renderUserTasks.js';

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

renderUserTasks(taskList, currentUser);

//Sidebar Logic
const sidebarButtons = document.querySelectorAll('.sidebar-btn');
const sections = document.querySelectorAll('.task-section');

sidebarButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const target = button.dataset.section;

		sections.forEach((section) => {
			section.classList.add('hidden');
		});

		document.getElementById(target).classList.remove('hidden');
	});
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

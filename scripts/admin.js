import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';
import { renderTaskList } from './utils/renderTaskList.js';
import { saveTasks, loadTasks } from './utils/storage.js';
import { approveTask, rejectTask } from './utils/taskService.js';

//Local storage
let taskList = loadTasks();

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
			const newUser = li.querySelector('.edit-user').value;

			//update taskList
			task.title = newTitle;
			task.assignedTo = newUser;

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

import { renderTaskList } from './renderTaskList.js';
import { sortTasksByDueDate } from './sortTasks.js';
import { filterTasksByDue } from './filterTasksByDue.js';
import { renderUserTasks } from './renderUserTasks.js';

export function renderSortedTasks(taskList, editTaskId) {
	const sortValue = document.querySelector('.js-sort-due').value;

	const filterValue = document.querySelector('.js-due-filter').value;

	// Filter first
	const filteredTasks = filterTasksByDue(taskList, filterValue); // Filter the task list (All tasks)

	// Then sort
	const sortedTasks = sortTasksByDueDate(filteredTasks, sortValue);

	// Render sorted tasks and filtered tasks
	renderTaskList(sortedTasks, editTaskId);
}

export function renderSortedUserTasks(taskList, currentUser) {
	const sortValue = document.querySelector('.js-sort-due').value;

	const filterValue = document.querySelector('.js-due-filter').value;

	const userTasks = taskList.filter((task) =>
		task.assignedTo.includes(currentUser),
	);

	// Filter First
	const filteredTasks = filterTasksByDue(userTasks, filterValue); // Filter the user tasks

	// Then sort
	const sortedTasks = sortTasksByDueDate(filteredTasks, sortValue);

	// Then render
	renderUserTasks(sortedTasks, currentUser, true);
}

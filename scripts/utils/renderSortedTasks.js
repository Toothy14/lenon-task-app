import { renderTaskList } from './renderTaskList.js';
import { sortTasksByDueDate } from './sortTasks.js';

export function renderSortedTasks(taskList, editTaskId) {
	const sortValue = document.querySelector('.js-sort-due').value;
	const sortedTasks = sortTasksByDueDate(taskList, sortValue);

	renderTaskList(sortedTasks, editTaskId);
}

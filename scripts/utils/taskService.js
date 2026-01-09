import { findTaskById } from './findTaskById.js';
import { getFormattedDate } from './date.js';
import { saveTasks } from './storage.js';

export function approveTask(taskList, id) {
	const task = findTaskById(taskList, id);

	if (!task || !task.proof) return taskList; //return the original array unchanged

	task.proof.status = 'approved';
	task.reviewedDate = getFormattedDate();
	saveTasks(taskList);
}

export function rejectTask(taskList, id) {
	const task = findTaskById(taskList, id);

	if (!task || !task.proof) return taskList; //return the original array unchanged

	task.proof.status = 'rejected';
	task.reviewedDate = getFormattedDate();

	saveTasks(taskList);
}

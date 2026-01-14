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

export function submitProof(taskList, id, proofText) {
	//find the id we want to submit proof
	const task = findTaskById(taskList, id);

	//check if the id is not there
	if (!task) return;

	//add the objects to local storage
	task.proof = {
		text: proofText,
		status: 'pending',
	};

	//add submitted date to local storage
	task.submittedDate = getFormattedDate();

	//review date becomes null, until the admin approve/reject again
	task.reviewedDate = null;

	//after adding, save it to local storage
	saveTasks(taskList);
}

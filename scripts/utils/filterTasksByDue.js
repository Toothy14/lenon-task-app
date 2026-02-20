import { getDueState } from './dueDate.js';

export function filterTasksByDue(tasks, filterType) {
	if (!filterType || filterType === 'all') return tasks; // tasks = raw data

	// filter first so we can access the dueDateRaw from taskList on getDueState
	return tasks.filter((task) => {
		const state = getDueState(task.dueDateRaw);

		// State now is equal to filterType
		// Example: getDueState has (Overdue/Near/Normal) same with filterType (Overdue/Near/Normal)
		return state === filterType;
	});
}

const STORAGE_KEY = 'taskList';

export function saveTasks(taskList) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
}

export function loadTasks() {
	const data = localStorage.getItem(STORAGE_KEY);

	if (!data) {
		return [];
	}

	try {
		return JSON.parse(data);
	} catch (error) {
		console.log('Failed to parse tasks from localStorage', error);
		return [];
	}
}

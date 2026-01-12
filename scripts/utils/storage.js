const STORAGE_KEY = 'taskList';

export function saveTasks(taskList) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
}

export function loadTasks() {
	const data = localStorage.getItem(STORAGE_KEY);

	if (!data) {
		return []; //return empty or keep it empty
	}

	try {
		return JSON.parse(data); //try
	} catch (error) {
		//if it fails
		console.log('Failed to parse tasks from localStorage', error);
		return [];
	}
}

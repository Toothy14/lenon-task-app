export function findTaskById(taskList, id) {
	return taskList.find((task) => task.id === id);
}

export function sortTasksByDueDate(tasks, sortType) {
	// tasks is just a temporary name. We will replace it with the original array 'taskList' by passing it to parameter
	const sortedTasks = [...tasks];

	// sortType is just a temporary name. It will replace it with 'value' on admin.js by passing it to parameter
	if (sortType === 'earliest') {
		sortedTasks.sort((a, b) => {
			return dayjs(a.dueDateRaw).valueOf() - dayjs(b.dueDateRaw).valueOf();
		});
	}

	if (sortType === 'latest') {
		sortedTasks.sort((a, b) => {
			return dayjs(b.dueDateRaw).valueOf() - dayjs(a.dueDateRaw).valueOf();
		});
	}

	// Final output needs to return
	return sortedTasks;
}

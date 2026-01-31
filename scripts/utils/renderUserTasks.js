export function renderUserTasks(taskList, currentUser) {
	const taskListElement = document.querySelector('.pending-list');
	const approvedListElement = document.querySelector('.approved-list');
	const rejectedListElement = document.querySelector('.rejected-list');

	const userTasks = taskList.filter((task) =>
		task.assignedTo.includes(currentUser),
	);
	let htmlPendingTasks = '';
	let htmlApprovedTasks = '';
	let htmlRejectedTasks = '';

	userTasks.forEach((task) => {
		if (!task.proof) {
			htmlPendingTasks += `
<li class="bg-gray-50 border rounded-lg p-4 space-y-2">
	<h3 class="font-semibold text-gray-800">${task.title}</h3>

	<p class="text-sm text-gray-600">Status: ${task.status}</p>
	<p class="text-sm text-gray-500">Assigned on: ${task.assignedDate}</p>
	<p class="text-sm text-gray-500">Due on: ${task.dueDate}</p>

	<input
		class="input-proof w-full border rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
		type="text"
		placeholder="Enter proof..."
	/>

	<button
		class="submit-proof bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
		data-id="${task.id}"
	>
		Submit Proof
	</button>
</li>
`;
		} else if (task.proof.status === 'pending') {
			htmlPendingTasks += `
<li class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
	<h3 class="font-semibold">${task.title}</h3>
	<p class="text-sm text-yellow-700">Proof submitted (Pending review)</p>
	<p class="text-sm text-gray-500">Submitted on: ${task.submittedDate}</p>
	<p class="text-sm"><strong>Proof:</strong> ${task.proof.text}</p>
</li>
`;
		} else if (task.proof.status === 'approved') {
			htmlApprovedTasks += `
<li class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
	<h3 class="font-semibold">${task.title}</h3>
	<p class="text-sm text-green-700">Approved on: ${task.reviewedDate}</p>
	<p class="text-sm text-gray-600">Task completed! 🎉</p>
</li>
`;
		} else if (task.proof.status === 'rejected') {
			htmlRejectedTasks += `
<li class="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
	<h3 class="font-semibold">${task.title}</h3>
	<p class="text-sm text-red-700">Rejected on: ${task.reviewedDate}</p>
	<p class="text-sm"><strong>Your proof:</strong> ${task.proof.text}</p>

	<input
		class="input-proof w-full border rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-red-300"
		type="text"
		placeholder="Submit new proof..."
	/>

	<button
		class="submit-proof bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
		data-id="${task.id}"
	>
		Resubmit Proof
	</button>
</li>
`;
		}
	});
	taskListElement.innerHTML = htmlPendingTasks;
	approvedListElement.innerHTML = htmlApprovedTasks;
	rejectedListElement.innerHTML = htmlRejectedTasks;
}

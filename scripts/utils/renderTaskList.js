import { getDueState } from './dueDate.js';
//render the task list
export function renderTaskList(taskList, editTaskId) {
	const taskListElement = document.querySelector('.pending-list'); //UL
	const approvedListElement = document.querySelector('.approved-task-list'); //UL
	const rejectedListElement = document.querySelector('.rejected-task-list'); //UL

	let htmlPendingTasks = '';
	let htmlApprovedTasks = '';
	let htmlRejectedTasks = '';

	taskList.forEach((task) => {
		if (editTaskId !== null && task.id === editTaskId) {
			//editable view

			//PLEASE STUDY THE TAILWIND CSS YOU PUT
			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-3">
	<input
		type="text"
		class="edit-title w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
		value="${task.title}"
	/>

	<select
		class="edit-user w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" multiple
	>
		<option value="Alf" ${task.assignedTo.includes('Alf') ? 'selected' : ''}>Alf</option>
		<option value="Princess" ${
			task.assignedTo.includes('Princess') ? 'selected' : ''
		}>Princess</option>
	</select>
	
	
	<div class="edit-selected-users flex gap-2 mt-2"></div>

	<!--Due Date-->
								<input
									type="date"
									id="dueDate"
									class="js-date-input border rounded-lg px-3 py-2" 
									value="${task.dueDateRaw}"
								/>

	

	<div class="flex gap-2">
		<button class="task-save bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600" data-id="${
			task.id
		}">
			Save
		</button>
		<button class="task-cancel bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400" data-id="${
			task.id
		}">
			Cancel
		</button>
		<button class="task-delete bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-auto" data-id="${
			task.id
		}">
			Delete
		</button>
	</div>
</li>
`;
		} else if (!task.proof) {
			//if no proof yet

			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>

	<p class="text-sm text-gray-600">Assigned to: <strong>${task.assignedTo.join(', ')}</strong></p>
	<p class="text-sm text-gray-500">Assigned on: ${task.assignedDate}</p>
	
	
	${(() => {
		const dueState = getDueState(task.dueDateRaw);

		if (dueState === 'overdue') {
			return `
			<p class="text-sm text-red-600 font-semibold">
				⚠ Overdue (Due on: ${task.dueDate})
			</p>
		`;
		}

		if (dueState === 'near') {
			return `
			<p class="text-sm text-orange-500 font-semibold">
				⏰ Near due (Due on: ${task.dueDate})
			</p>
		`;
		}

		return `
		<p class="text-sm text-gray-500">
			Due on: ${task.dueDate}
		</p>
	`;
	})()}


	<span class="inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
		Pending
	</span>

	<div class="flex gap-2 pt-2">
		<button class="task-edit bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600" data-id="${task.id}">
			Edit
		</button>
		<button class="task-delete bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${task.id}">
			Delete
		</button>
	</div>
</li>
`;
		} else if (task.proof.status === 'pending') {
			htmlPendingTasks += `
<li class="bg-white rounded-xl border shadow-sm p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>

	<p class="text-sm">
		<strong>Status:</strong> Submitted by <strong>${task.assignedTo.join(', ')}</strong>
	</p>

	<p class="text-sm text-gray-500">Submitted on: ${task.submittedDate}</p>

	<p class="text-sm text-gray-500">Due on: ${task.dueDate}</p>

	<p class="text-sm bg-gray-100 p-2 rounded">
		<strong>Proof:</strong> ${task.proof.text}
	</p>

	<div class="flex gap-2 pt-2">
		<button class="approve-button bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600" data-id="${task.id}">
			Approve
		</button>
		<button class="reject-button bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" data-id="${task.id}">
			Reject
		</button>
	</div>
</li>
`;
		}
		//Reject/Approve Section
		else if (task.proof.status === 'approved') {
			htmlApprovedTasks += `
<li class="bg-green-50 rounded-xl border border-green-200 p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>
	<p class="text-sm">Approved for <strong>${task.assignedTo.join(', ')}</strong></p>
	<p class="text-sm text-gray-600">Approved on: ${task.reviewedDate}</p>
</li>
`;
		} else if (task.proof.status === 'rejected') {
			htmlRejectedTasks += `
<li class="bg-red-50 rounded-xl border border-red-200 p-4 space-y-2">
	<h3 class="font-semibold text-lg">${task.title}</h3>
	<p class="text-sm">Rejected for <strong>${task.assignedTo.join(', ')}</strong></p>
	<p class="text-sm text-gray-600">Rejected on: ${task.reviewedDate}</p>
</li>
`;
		}
	});

	taskListElement.innerHTML = htmlPendingTasks;
	approvedListElement.innerHTML = htmlApprovedTasks;
	rejectedListElement.innerHTML = htmlRejectedTasks;
}

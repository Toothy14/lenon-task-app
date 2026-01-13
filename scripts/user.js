import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';
import { saveTasks, loadTasks } from './utils/storage.js';

let taskList = loadTasks(); //Contains all of the tasks (local storage)

//Temporary users log in logic ------------------------------------------
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
	alert('No user logged in');
}

const userSwitch = document.querySelector('.js-user-switch');

if (userSwitch) {
	if (currentUser) {
		userSwitch.value = currentUser;
	}
	userSwitch.addEventListener('change', () => {
		localStorage.setItem('currentUser', userSwitch.value);
		location.reload();
	});
}
//Temporary users log in logic ---------------------------------------------

const tasksContainer = document.querySelector('.tasks-container');
const taskListElement = document.querySelector('.pending-list');
const approvedListElement = document.querySelector('.approved-list');
const rejectedListElement = document.querySelector('.rejected-list');

function renderUserTasks() {
	const userTasks = taskList.filter((task) => task.assignedTo === currentUser);
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

renderUserTasks();

tasksContainer.addEventListener('click', (event) => {
	if (event.target.classList.contains('submit-proof')) {
		//id of task we want to submit proof
		const id = Number(event.target.dataset.id);

		//go inside the li
		const li = event.target.closest('li');

		//to access its element like input element
		const input = li.querySelector('.input-proof');

		//use .trim() to prevent human typos
		const proofText = input.value.trim();

		//check if input has no value
		if (!proofText) return;

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

		//re-render the updated data
		renderUserTasks();
	}
});

import { getFormattedDate } from './utils/date.js';
import { findTaskById } from './utils/findTaskById.js';

let taskList = JSON.parse(localStorage.getItem('taskList')) || []; //Contains all of the tasks

function saveToStorage() {
	localStorage.setItem('taskList', JSON.stringify(taskList));
}

const currentUser = 'Alf';
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
			htmlPendingTasks += `<li>
			
        <h3>${task.title}</h3>

        <p>Status: ${task.status}</p> 

		<label>Assigned on: ${task.assignedDate}</label>

		<input class="input-proof" type="text" placeholder="Enter proof.."></input>

        <button class="submit-proof"
        data-id="${task.id}"
        >Submit</button>
        </li>
        `;
		} else if (task.proof.status === 'pending') {
			htmlPendingTasks += `<li>
                <h3>${task.title}</h3>
                <p>Proof submitted (Pending review)</p>
				<label>Submitted on: ${task.submittedDate}</label>
                <p>Proof: ${task.proof.text}</p></li>
            `;
		} else if (task.proof.status === 'approved') {
			htmlApprovedTasks += `<li> <h3>${task.title}</h3>
            <p>Status: ${task.proof.status}</p>
			<p>Approved on: ${task.reviewedDate}</p>
            <p>Task completed! Great job!</p> </li>`;
		} else if (task.proof.status === 'rejected') {
			htmlRejectedTasks += `<li>
			<h3>${task.title}</h3>
            <p>Status: ${task.proof.status}</p>
			 <p>Rejected on: ${task.reviewedDate}</p>
			 <p>Your proof: ${task.proof.text}</p>

			<input class="input-proof" type="text" placeholder="Enter proof.."></input>
        <button class="submit-proof"
        data-id="${task.id}"
        >Submit Proof</button>
			</li>`;
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
		saveToStorage();

		//re-render the updated data
		renderUserTasks();
	}
});

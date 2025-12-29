//Data
let taskList = JSON.parse(localStorage.getItem('taskList'));

if (!taskList) {
	taskList = [
		{
			id: Date.now(),
			title: 'Clean the kitchen',
			assignedTo: 'Alf',
			status: 'pending',
		},
	];
}

//Local Storage
function saveToStorage() {
	localStorage.setItem('taskList', JSON.stringify(taskList));
}

//DOM Elements
const form = document.querySelector('.js-task-form'); //Form
const inputElement = document.querySelector('.js-task-input'); //Input
const userSelect = document.querySelector('.js-user-select'); //Select
const taskListElement = document.querySelector('.task-list'); //UL

form.addEventListener('submit', (event) => {
	addTasks(event);
});

//functions
function addTasks(event) {
	event.preventDefault(); //prevents the default behavior of the browser (reloading automatically)

	const taskTitle = inputElement.value.trim();
	const assignedUser = userSelect.value;

	//Date today
	const today = dayjs();
	const dateFormat = today.format('MMM M, YYYY • h:mm A');

	if (!taskTitle || !assignedUser) return;
	//checks first if the taskTitle or assignedUser is empty

	//else if both are not empty
	taskList.push({
		id: Date.now(),
		title: taskTitle,
		assignedTo: assignedUser,
		assignedDate: dateFormat,
		status: 'pending',
	});

	form.reset(); //Clears the elements
	saveToStorage();
	renderTaskList();
}

let editTaskId = null; //stores the id of the task currently (being edited)

//render the task list
function renderTaskList() {
	let html = '';

	taskList.forEach((task) => {
		if (task.id === editTaskId) {
			//editable view
			html += `
			<li class="task">
				<input type="text" class="edit-title" value="${task.title}" />
				<select class="edit-user">
					<option value="Alf" ${task.assignedTo === 'Alf' ? 'selected' : ''}>Alf</option>
					<option value="Sister" ${
						task.assignedTo === 'Sister' ? 'selected' : ''
					}>Sister</option>
				</select>
				<button class="task-save" data-id="${task.id}">Save</button>
				<button class="task-cancel" data-id="${task.id}">Cancel</button>
				<button class="task-delete" data-id="${task.id}">Delete</button>
			</li>
		`;
		} else if (!task.proof) {
			//if no proof yet

			html += `<li class="task">
							<h3>${task.title}</h3>

							<p>Assigned to: ${task.assignedTo}</p>

							<label>Assigned on: ${task.assignedDate}</label>

							<span data-status="pending">Status: ${task.status}</span>

							<button
				class="task-delete"
				data-id="${task.id}">
				Delete
			</button>

			<button class="task-edit"
			data-id="${task.id}">
			Edit
			</button>
						</li>`;
		} else if (task.proof.status === 'pending') {
			html += `<li class="task">
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Submitted on: ${task.submittedDate}</label>
			<p><strong>Proof:</strong> ${task.proof.text}</p>

			<button class="approve-button"
			data-id="${task.id}"
			>Approve</button>
			<button class="reject-button"
			data-id="${task.id}"
			>Reject</button>
			</li>`;
		} else if (task.proof.status === 'approved') {
			html += `<li>
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Approved on: ${task.reviewedDate}</label>
			</li>`;
		} else if (task.proof.status === 'rejected') {
			html += `<li>
			<h3>${task.title}</h3>
			<p> <strong>Status:</strong> Submitted from <strong>${task.assignedTo}</strong> <p/>
			<label>Rejected on: ${task.reviewedDate}</label>
			</li>`;
		}
	});

	document.querySelector('.task-list').innerHTML = html;
}

function controllers() {
	//UL (taskListElement) = handles the children (buttons)
	taskListElement.addEventListener('click', (event) => {
		const id = Number(event.target.dataset.id);

		//Delete button
		if (event.target.classList.contains('task-delete')) {
			taskList = taskList.filter((task) => task.id !== id);
			//Creates a new array and move the tasks to the new array except for the id or task that we deleted
			saveToStorage();
			renderTaskList();
			//update the task list after changing the data
		}

		//Edit button
		if (event.target.classList.contains('task-edit')) {
			editTaskId = id; //set this 'id'(task) to edit mode
			renderTaskList();
			//update the task list after changing the data
		}

		//Cancel button
		if (event.target.classList.contains('task-cancel')) {
			editTaskId = null; //exit edit mode because null = no value
			renderTaskList();
			//update the task list after changing the data
		}

		//Save button
		if (event.target.classList.contains('task-save')) {
			//find the id that we want to save
			const task = taskList.find((task) => task.id === id);
			// --------------------------------------------------------
			//grab new values from editable view

			//to access the elements inside 'li' such as --
			//edit-title, and edit-user
			//basically, we need to go inside the 'li' first
			const li = event.target.closest('li');

			//what the user typed in the title input in editable view
			const newTitle = li.querySelector('.edit-title').value;

			//reads the new selected assigned user in editable view
			const newUser = li.querySelector('.edit-user').value;

			//update taskList
			task.title = newTitle;
			task.assignedTo = newUser;

			editTaskId = null; //Exit edit mode
			saveToStorage();

			renderTaskList(); //update the page
		}

		if (event.target.classList.contains('approve-button')) {
			const task = taskList.find((task) => task.id === id);

			const today = dayjs();
			const dateFormat = today.format('MMM M, YYYY • h:mm A');

			if (!task || !task.proof) return;

			task.proof.status = 'approved';
			task.reviewedDate = dateFormat;
			saveToStorage();
			renderTaskList();
		}

		if (event.target.classList.contains('reject-button')) {
			const task = taskList.find((task) => task.id === id);

			const today = dayjs();
			const dateFormat = today.format('MMM M, YYYY • h:mm A');

			if (!task || !task.proof) return;

			task.proof.status = 'rejected';
			task.reviewedDate = dateFormat;

			saveToStorage();
			renderTaskList();
		}
	});
}
controllers(); //Run the controllers
renderTaskList(); //Render the task list

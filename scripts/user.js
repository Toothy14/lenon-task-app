let taskList = JSON.parse(localStorage.getItem('taskList')) || []; //Contains all of the tasks

function saveToStorage() {
	localStorage.setItem('taskList', JSON.stringify(taskList));
}

const currentUser = 'Alf';

const taskListElement = document.querySelector('.task-list');

function renderUserTasks() {
	const userTasks = taskList.filter((task) => task.assignedTo === currentUser);
	let html = '';

	userTasks.forEach((task, index) => {
		if (!task.proof) {
			html += `<li>
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
			html += `<li>
                <h3>${index + 1}. ${task.title}</h3>
                <p>Proof submitted (Pending review)</p>
				<label>Submitted on: ${task.submittedDate}</label>
                <p>Proof: ${task.proof.text}</p></li>
            `;
		} else if (task.proof.status === 'approved') {
			html += `<li> <h3>${index + 1}. ${task.title}</h3>
            <p>Status: ${task.proof.status}</p>
            <p>Task completed! Great job!</p> </li>`;
		} else if (task.proof.status === 'rejected') {
			html += `<li>
			<h3>${index + 1}. ${task.title}</h3>
            <p>Status: ${task.proof.status}</p>

			<input class="input-proof" type="text" placeholder="Enter proof.."></input>
        <button class="submit-proof"
        data-id="${task.id}"
        >Submit Proof</button>
			</li>`;
		}
	});
	taskListElement.innerHTML = html;
}

renderUserTasks();

taskListElement.addEventListener('click', (event) => {
	if (event.target.classList.contains('submit-proof')) {
		//id of task we want to submit proof
		const id = Number(event.target.dataset.id);

		//go inside the li
		const li = event.target.closest('li');

		//to access its element like input element
		const input = li.querySelector('.input-proof');

		//use .trim() to prevent human typos
		const proofText = input.value.trim();

		//date today
		const today = dayjs();

		//date format
		const dateFormat = today.format('MMM M, YYYY • h:mm A');

		//check if input has no value
		if (!proofText) return;

		//find the id we want to submit proof
		const task = taskList.find((task) => task.id === id);

		//check if the id is not there
		if (!task) return;

		//add the objects to local storage
		task.proof = {
			text: proofText,
			status: 'pending',
		};

		//add submitted date to local storage
		task.submittedDate = dateFormat;

		//after adding, save it to local storage
		saveToStorage();

		//re-render the updated data
		renderUserTasks();
	}
});

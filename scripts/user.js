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
        <p>Status: ${task.status}</p> <input class="input-proof" type="text" placeholder="Enter proof.."></input>
        <button class="submit-proof"
        data-id="${task.id}"
        >Submit Proof</button>
        </li>
        `;
		} else if (task.proof.status === 'pending') {
			html += `<li>
                <h3>${index + 1}. ${task.title}</h3>
                <p>Proof submitted (Pending review)</p>
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
		const id = Number(event.target.dataset.id); //id of task we want to submit proof
		const li = event.target.closest('li'); //go inside the li
		const input = li.querySelector('.input-proof'); //to access its element

		const proofText = input.value.trim();

		if (!proofText) return; //check if input has no value

		const task = taskList.find((task) => task.id === id); //find the id we want to submit proof
		task.proof = {
			//add the objects
			text: proofText,
			status: 'pending',
		};

		saveToStorage(); //after adding, save it to local storage
		renderUserTasks(); //re render
	}
});

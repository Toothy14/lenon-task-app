//Step 1
let editTaskId = null;
//stores the id of the task currently (being edited)
//editTaskId === edit mode

//render the task list
function renderTaskList() {
	let html = '';

	taskList.forEach((task) => {
		//Step 2
		//If task.id === edit mode
		if (task.id === editTaskId) {
			//Step 3
			//then render the editable view
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
		} else {
			//normal view
			html += `<li class="task">
							<h3>${task.title}</h3>
							<p>Assigned to: ${task.assignedTo}</p>
							<span data-status="pending">${task.status}</span>

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
		}
	});

	document.querySelector('.task-list').innerHTML = html;
}

//Step 4: Add the edit button
function controllers() {
	//UL (taskListElement) = handles the children (buttons)
	taskListElement.addEventListener('click', (event) => {
		const id = Number(event.target.dataset.id);
		//The id we want to delete/edit

		//Edit button
		if (event.target.classList.contains('task-edit')) {
			editTaskId = id; //set this task to edit mode
			//remember, editTaskId === edit mode.
			// Basically, id now will become edit mode and will render the editable html view
			renderTaskList(); //render/update again
		}
	});
}
controllers(); //call the function

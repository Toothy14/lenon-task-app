// Sidebar logic

export function sidebarLogic() {
	const sidebarButtons = document.querySelectorAll('.sidebar-btn');
	const sections = document.querySelectorAll('.task-section');
	sidebarButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const targetSection = button.dataset.section;

			// Hides all sections
			sections.forEach((section) => {
				section.classList.add('hidden');
			});

			// Remove the hidden class from target section to show only the selected one
			document.getElementById(targetSection).classList.remove('hidden');
		});
	});
}

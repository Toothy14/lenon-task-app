// Sidebar logic

export function sidebarLogic() {
	const sidebarButtons = document.querySelectorAll('.sidebar-btn');
	const sections = document.querySelectorAll('.task-section');

	sidebarButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const targetSection = button.dataset.section;

			// 1️⃣ Hide all sections
			sections.forEach((section) => {
				section.classList.add('hidden');
			});

			// 2️⃣ Show the selected section
			document.getElementById(targetSection).classList.remove('hidden');

			// 3️⃣ Remove "active" style from all buttons
			sidebarButtons.forEach((btn) => {
				btn.classList.remove('bg-blue-500', 'text-white');
				btn.classList.add('text-gray-700');
			});

			// 4️⃣ Add "active" style to clicked button
			button.classList.add('bg-blue-500', 'text-white');
			button.classList.remove('text-gray-700');
		});
	});
}

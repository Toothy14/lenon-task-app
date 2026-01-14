export function setCurrentUser(selectedUser) {
	localStorage.setItem('currentUser', selectedUser);
}

export function getCurrentUser() {
	return localStorage.getItem('currentUser');
}

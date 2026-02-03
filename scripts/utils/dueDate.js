// Due date logic
export function getDueState(dueDateRaw) {
	if (!dueDateRaw) return 'normal';

	const today = dayjs().startOf('day');
	const due = dayjs(dueDateRaw);

	if (due.isBefore(today)) return 'overdue'; // if due date is befire today
	if (due.diff(today, 'day') <= 2) return 'near'; // if due date is within 2 days
	return 'normal';
}

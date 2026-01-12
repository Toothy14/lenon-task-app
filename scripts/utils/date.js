export function getFormattedDate() {
	const today = dayjs();
	return today.format('MMM D, YYYY • h:mm A');
}

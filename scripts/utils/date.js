export function getFormattedDate() {
	const today = dayjs();
	return today.format('MMM M, YYYY • h:mm A');
}

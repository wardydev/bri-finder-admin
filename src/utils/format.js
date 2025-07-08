export function formatDate(dateString) {
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Adds leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

  // Format as "dd-mm-yy"
  return `${day}-${month}-${year}`;
}

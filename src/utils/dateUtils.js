/**
 * Formats a date string into "DD Mon YYYY" format (e.g., "12 Dec 2025").
 * 
 * @param {string|Date} dateString - The date to format.
 * @returns {string} The formatted date string, or the original string if invalid.
 */
export const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return dateString;
    }

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

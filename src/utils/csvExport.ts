/**
 * Converts an array of objects to CSV format and triggers a download.
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
        alert('No data to export');
        return;
    }

    // Get headers from first object, assuming uniform structure
    // or we can pass headers explicitly if needed.
    // For now, let's just take keys of the first object.
    // To make it cleaner, we might want to flatten nested objects or select specific fields before passing data.

    const headers = Object.keys(data[0]);

    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(fieldName => {
                const value = row[fieldName];
                // Handle strings with commas, quotes, or newlines
                if (typeof value === 'string') {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                // Handle objects/arrays roughly
                if (typeof value === 'object' && value !== null) {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, `${filename}.csv`);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

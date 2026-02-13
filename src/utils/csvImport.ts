export const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    // Simple parser assuming no commas in values for now to avoid complexity issues
    // For a robust implementation, use a library like PapaParse, but trying to keep dependencies low.
    // If commas are needed in values, we need a better regex or parser.
    /*
    const parseLine = (line: string) => {
        const result = [];
        let cur = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuote) {
                if (char === '"') {
                    if (i + 1 < line.length && line[i + 1] === '"') {
                        cur += '"';
                        i++;
                    } else {
                        inQuote = false;
                    }
                } else {
                    cur += char;
                }
            } else {
                if (char === '"') {
                    inQuote = true;
                } else if (char === ',') {
                    result.push(cur);
                    cur = '';
                } else {
                    cur += char;
                }
            }
        }
        result.push(cur);
        return result;
    };
    */

    // Let's use a simpler approach for now: standard split by comma
    // If user needs complex CSVs, they should use a library.

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index]?.trim();
            });
            result.push(obj);
        }
    }

    return result;
};

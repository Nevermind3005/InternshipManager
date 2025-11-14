export const getSeason = (date = new Date()) => {
    const month = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec
    // Winter: September (8) to January (0)
    if (month >= 8 || month <= 0) {
        return "winter";
    } else {
        return "summer";
    }
};

export const toDateOnlyString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseDateOnlyString = (dateString: string): Date => {
    // Parse date-only string (YYYY-MM-DD) as local date, not UTC
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const formatDateOnlyString = (dateValue: string) => {
    const formatted = dateValue
        ? new Date(dateValue).toLocaleDateString("sk-SK", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";
    return formatted;
};
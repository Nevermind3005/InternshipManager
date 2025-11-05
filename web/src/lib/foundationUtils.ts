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
    return date.toISOString().split('T')[0];
};
export const getTotal = (arr, property) => {
    if (!Array.isArray(arr) || typeof property !== 'string') {
        return 0;
    }
    if (arr.length === 0) {
        return 0;
    }
    return arr.reduce((total, item) => {
        const value = item[property];
        return (typeof value === 'number' && !isNaN(value)) ? total + value : total;
    }, 0);
};

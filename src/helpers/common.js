export const getTotal = (arr, property) => {
    return arr?.reduce((total, item) => total + item[property], 0);
};
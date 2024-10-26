export const useIsAdmin = () => {
    if (typeof window !== 'undefined') {
        const userRole = sessionStorage.getItem('userName');
        return userRole === 'administrator';
    }
    return false;
};

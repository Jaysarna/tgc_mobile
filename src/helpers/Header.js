
export function getAuthHeader() {
    if (typeof window !== 'undefined') {
        let api_key1 = sessionStorage.getItem('api_key');
        let api_secret1 = sessionStorage.getItem('api_secret');
        if (!api_key1 || !api_secret1) {
            return null;
        }

        return {
            headers: {
                'Authorization': `token ${api_key1}:${api_secret1}`,
                'Content-Type': 'application/json',
            },
        };
    }
}


let authHeader;

// Check if window is defined (client side) before accessing localStorage
if (typeof window !== 'undefined') {

    let api_key1 = sessionStorage.getItem('api_key');
    let api_secret1 = sessionStorage.getItem('api_secret');

    authHeader = {
        headers: {
            'Authorization': `token ${api_key1}:${api_secret1}`,
            'Content-Type': 'application/json',
        },
    };
} else {
    // Handle the case where the code is running on the server side
    authHeader = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

export { authHeader };


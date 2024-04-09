import { authHeader } from "@/helpers/Header";

async function fetchOutstanding(name) {
    if (name) {

        var requestOptions = {
            method: 'GET',
            headers: authHeader.headers,
            redirect: 'follow'
        };

        // console.log(name)

        fetch(`https://tgc67.online/api/resource/Sales%20Invoice?filters=%5B%5B%22customer%22%2C%22%3D%22%2C%22${name}%22%5D%2C%5B%22docstatus%22%2C%22%3D%22%2C%221%22%5D%2C%5B%22status%22%2C%22!%3D%22%2C%22Cancel%22%5D%5D&fields=%5B%22name%22%2C%22customer%22%2C%22grand_total%22%2C%22outstanding_amount%22%5D`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.data)
                return result.data
            })
            .catch(error => {
                console.log('error', error)
                return []
            });

    }

}

export { fetchOutstanding }
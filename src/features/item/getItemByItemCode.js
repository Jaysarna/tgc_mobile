import { handleError } from "@/Api/showError";
import { getAuthHeader } from "@/helpers/Header";
import axios from "axios";



async function handleItemPrice(code) {

    console.log(code)
    const authHeader = getAuthHeader();

    const apiUrl = 'https://tgc67.online/api/resource/Item%20Price';
    const filters = [["buying", "=", "1"], ["item_code", "=", code]];
    const fields = ["item_code", "price_list_rate"];

    const url = `${apiUrl}?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(fields))}`;
    // console.log(url)

    try {
        let price = 0
        const res = await axios.get(url, authHeader)
        if (res.data.data.length > 0) {
            price = res.data.data[0].price_list_rate
        }
        return price
    }
    catch (err) {
        console.log(err)
        if (err.response.status === 403) {
            sessionStorage.clear()
        }
        else {
            // handleError(err)
            console.log(err)
        }


    }
}

export { handleItemPrice }
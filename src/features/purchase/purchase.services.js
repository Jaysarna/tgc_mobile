

import { toast } from 'react-hot-toast';
import { post, put } from '@/configs/apiUtils';
import { useRouter } from 'next/router';
import { handleShowApiError } from '../error/getErrorApi';


const purchaseEndPoint = `/resource/Purchase%20Invoice/`

export const CreateNewPurchaseInvoice = async (invoice, data) => {

    console.log(data)

    const sampleRequestData = {
        data: {
            "supplier": data?.supplier,
            "set_warehouse": "Warehouse 1 - TGC",
            // "expense_account": 'Stock In Hand - TGC',
            "custom_payment_amount_in_advance": data?.paymentAmountInAdvance,
            "update_stock": 1,
            "docstatus": 1,
            // "custom_sample": !(data.docStatus),
            "items": data?.items.map((item) => ({
                "item_code": item.itemName,
                "qty": item.quantity,
                "rate": item.rate,
                "warehouse": "Warehouse 1 - TGC",
            })),
        },
    };

    try {

        let response1 = await put(purchaseEndPoint + invoice, sampleRequestData);

        console.log(response1)

        if (response1 && !response1.data.data.custom_sample) {

            var response = await put(purchaseEndPoint + '/' + response1.data.data.name, {
                data: {
                    "name": response1.data.data.name,
                    "docstatus": 1
                }
            }, authHeader);

        }

        console.log(response)


        if (response1.statusText === 'OK') {

            toast.success('Create Invoice Successfully')
            route.push('/main');
        }
    } catch (error) {
        handleShowApiError(error)
    }

};




export const updatePurchaseInvoice = async (invoice) => {

    const data = {
        "name": invoice,
        "docstatus": 1
    }


    try {
        const res = await put(purchaseEndPoint + invoice, data)
        console.log(res)
        if (res?.data?.name) {
            toast.success('Purchase Invoice Updated Successfully')
            window.location.replace('/samples')
        }
    }
    catch (err) {
        handleShowApiError(err)
    }
}
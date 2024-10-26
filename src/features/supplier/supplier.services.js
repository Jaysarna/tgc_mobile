import { toast } from 'react-hot-toast';
import { get, post, put } from '@/configs/apiUtils';
import { handleShowApiError } from '../error/getErrorApi';

const addNewSupplier = async (
    {
        supplierName = '',
        supplierGroup = 'All Supplier Groups',
        supplierType = 'Company',
        country = 'Canada',
        isTransporter = false,
    },

) => {


    try {
        const data = {
            data: {
                supplier_name: supplierName,
                supplier_group: supplierGroup,
                supplier_type: supplierType,
                // country: country,
                // isTransporter: isTransporter,
                // Additional fields as needed
            }
        };


        toast.promise(
            post('/resource/Supplier', data),
            {
                loading: 'Adding new supplier...',
                success: (res) => res?.data.name ? 'New Supplier Added Successfully' : 'Failed to add new supplier. Please try again.',
            },

        )

    } catch (error) {

        handleShowApiError(error)
    }
};


export const getSupplierList = async () => {
    try {
        const res = await get('resource/Supplier');
        return res
    } catch (err) {
        handleShowApiError(err)
    }
}
export const getSupplierOutstandingList = async () => {
    try {

        const res = await get('method/supplier_outstanding');
        return res
    } catch (err) {
        handleShowApiError(err)
    }
}






export const updateSupplier = async (name, data) => {
    try {
        toast.promise(put(`/resource/Supplier/${name}`, data),
            {
                loading: 'Updating supplier...',
                success: (res) => res?.data.name ? 'Supplier Details updated Successfully' : 'Failed to update supplier. Please try again.',
            },

        )

    } catch (err) {
        console.log(err)
    }
}





export default addNewSupplier;

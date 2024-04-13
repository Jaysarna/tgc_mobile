
import { toast } from 'react-hot-toast';
import { get, post } from '@/configs/apiUtils';
import { useRouter } from 'next/router';
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
                // error: 'Failed to add new supplier. Please try again.',


            },

        )

    } catch (error) {

        handleShowApiError(error)
    }
};


export const getSupplierList = async () => {
    try {
        // const res = await toast.promise(
        //     get('resource/Supplier'),
        //     {
        //         loading: '',
        //         success: (res) => res && '',
        //         error: 'Reload ...',
        //         style: {
        //             minWidth: '250px',
        //             borderRadius: '8px',
        //             padding: '16px',
        //             color: '#ffffff', // Text color
        //             backgroundColor: '#4caf50', // Success background color
        //             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        //         },


        //         icon: (status) => {
        //             return status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌';
        //         },
        //     }
        // )

        const res = await get('resource/Supplier');
        return res
    } catch (err) {
        handleShowApiError(err)
    }
}

export default addNewSupplier;

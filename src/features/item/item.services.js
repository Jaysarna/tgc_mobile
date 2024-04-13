
import { toast } from 'react-hot-toast';
import { post } from '@/configs/apiUtils';
import { useRouter } from 'next/router';
import { handleShowApiError } from '../error/getErrorApi';

const addnewItem = async (
    {
        itemName = '',
        supplierName = '',
        item_group = 'Products',
        stock_uom = 'Unit',

    },

) => {




    try {
        const requestData = {
            data: {
                item_name: itemName,
                item_group: item_group,
                stock_uom: stock_uom,
                is_stock_item: '1',
                supplier_items: [{
                    supplier: supplierName,
                }]
            },

        };


        const res = await toast.promise(
            post('/resource/Item', requestData),
            {
                loading: 'Adding new Item...',
                success: (res) => res?.data.name ? 'New Item Added Successfully' : 'Failed to add new Item. Please try again.',

            }
        )
        if (res?.data.name) {
            return res
        }

    } catch (error) {
        handleShowApiError(error)
    }
};

export default addnewItem;



export const addNewItemWithoutSupplier = async (
    {
        itemName = '',
        item_group = 'Products',
        stock_uom = 'Unit',

    },

) => {




    try {
        const requestData = {
            data: {
                item_name: itemName,
                item_group: item_group,
                stock_uom: stock_uom,
                is_stock_item: '1',
            },

        };


        const res = await toast.promise(
            post('/resource/Item', requestData),
            {
                loading: 'Adding new Item...',
                success: (res) => res?.data.name ? 'New Item Added Successfully' : 'Failed to add new Item. Please try again.',

            }
        )
        if (res?.data.name) {
            return res
        }

    } catch (error) {
        handleShowApiError(error)
    }
};

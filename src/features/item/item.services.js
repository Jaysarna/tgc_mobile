
import { toast } from 'react-hot-toast';
import { post } from '@/configs/apiUtils';
import { useRouter } from 'next/router';

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
                error: 'Failed to add new Item. Please try again.',
            }
        )
        if (res?.data.name) {
            return res
        }

    } catch (error) {
        console.log(error);

        if (error.response && error.response.status === 403) {
            sessionStorage.clear();
            alert('Login Expired');
            window.location.replace('/')
        } else {
            console.log(error)
        }

        toast.error('Please Try Again');
    } finally {
        console.log('end of new Item')
    }
};

export default addnewItem;

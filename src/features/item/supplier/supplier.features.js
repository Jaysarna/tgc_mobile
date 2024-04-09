

import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { post } from '@/configs/apiUtils';

const addNewSupplier = async (
    {
        supplierName = '',
        supplierGroup = 'All Supplier Groups',
        supplierType = 'Company',
        country = 'Canada',
        isTransporter = false,
    },
    setLoading,

) => {

    const route = useRouter();
    try {
        setLoading(true);

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

        const response = await post('/resource/Supplier', data);

        if (response && response.status === 200) {
            toast.success('New Supplier Added Successfully');
        } else {
            toast.error('Failed to add supplier. Please try again.');
        }


    } catch (error) {
        console.log(error);

        if (error.response && error.response.status === 403) {
            sessionStorage.clear();
            alert('Login Expired');
            route.push('/');
        } else {
            console.log(error)
        }

        toast.error('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
};

export default addNewSupplier;

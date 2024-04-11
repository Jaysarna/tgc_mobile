

import { toast } from 'react-hot-toast';
import { post } from '@/configs/apiUtils';
import { useRouter } from 'next/router';


const addNewCustomer = async (
    {
        customerName = '',
        customerGroup = 'All Customer Groups',
        customerType = 'Company',
        territory = "Canada",
    },

) => {


    try {
        const requestData = {
            data: {
                customer_name: customerName,
                customer_type: customerType,
                customer_group: customerGroup,
                territory: territory,
            },
        };


        toast.promise(
            post('/resource/Customer', requestData),
            {
                loading: 'Adding new Customer...',
                success: (res) => res?.data.name ? 'New Customer Added Successfully' : 'Failed to add new Customer. Please try again.',
                error: 'Failed to add new Customer. Please try again.',
            }
        )

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
        console.log('end of new supplier')
    }
};

export default addNewCustomer;

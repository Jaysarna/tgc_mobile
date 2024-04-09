import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import useNotifications from '@/customhook/notification';
import { handleError } from '@/Api/showError';
import { getAuthHeader } from '@/helpers/Header';

const NewCustomer = () => {

    const { showSuccessNotification, showErrorNotification } = useNotifications()


    const [customerData, setCustomerData] = useState({
        customerName: '',
        customerGroup: 'All Customer Groups',
        customerType: 'Company',
        territory: "Canada",
    });

    const route = useRouter();

    const handleCustomerDataChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomerData({
            ...customerData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault()

        const authHeader = getAuthHeader()

        // User is authenticated, proceed to add the item
        const apiUrl = 'https://tgc67.online/api/resource/Customer';

        const requestData = {
            data: {
                customer_name: customerData.customerName,
                customer_type: customerData.customerType,
                customer_group: customerData.customerGroup,
                territory: customerData.territory,
            },
        };
        try {
            const response = await axios.post(apiUrl, requestData,authHeader)

            if (response.statusText === 'OK') {
                alert("Customer Added Successfully")
                
                route.push('/main')
            }
            // console.log('API Response:', response.statusText)
        } catch (error) {
            // Handle any errors that occur during the request
         
            console.error('API Error:', error);
            if (error.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(error)
            }
        }

    };

    return (
        <>
            <Siderbar />
            <div>
                <div className="col-lg-6 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown" style={{ overflow: 'hidden' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: "relative" }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4"> New Customer </h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i class="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    className="form-control"
                                                    id="customerName"
                                                    required
                                                    value={customerData.customerName}
                                                    onChange={handleCustomerDataChange}
                                                />
                                                <div className="invalid-feedback">Please enter the customer name.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="customerGroup" className="form-label">Customer Group</label>
                                            <input
                                                type="text"
                                                name="customerGroup"
                                                className="form-control"
                                                id="customerGroup"
                                                required
                                                value={customerData.customerGroup}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the customer group.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="customerType" className="form-label">Customer Type</label>
                                            <input
                                                type="text"
                                                name="customerType"
                                                className="form-control"
                                                id="customerType"
                                                required
                                                value={customerData.customerType}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the customer type.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="territory" className="form-label">Territory</label>
                                            <input
                                                type="text"
                                                name="territory"
                                                className="form-control"
                                                id="territory"
                                                required
                                                value={customerData.territory}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the default price.</div>
                                        </div>
                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Add New Customer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(NewCustomer);




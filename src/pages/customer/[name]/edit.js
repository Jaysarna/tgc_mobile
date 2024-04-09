// pages/[slug]/edit.js

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Siderbar from '@/helpers/siderbar'; // Ensure the correct import path
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditCustomer = () => {
    const router = useRouter();
    const { name } = router.query; // Access the dynamic parameter "slug"

    const [customerData, setCustomerData] = useState({
        customerName: '',
        customerGroup: '',
        customerType: '',
        territory: '',
    });


    async function fetchCustomerData(nme) {

        const authHeader = getAuthHeader();

        if (nme) {
            try {
                const response = await axios.get(`https://tgc67.online/api/resource/Customer/${nme}`, authHeader)
                // console.log(res.data.data)
                if (response.status === 200) {
                    const customer = response.data.data;
                    // console.log(customer)
                    setCustomerData({
                        customerName: customer.customer_name,
                        customerGroup: customer.customer_group,
                        customerType: customer.customer_type,
                        territory: customer.territory,
                    });
                }
            }
            catch (err) {
                if (err.response.status === 403) {
                    sessionStorage.clear()
                    alert("Login Expired")
                    router.push('/')
                }
                else {
                    handleError(error)
                }
            }
        }

    }


    useEffect(() => {
        console.log(name)
        fetchCustomerData(name)

    }, [name]);

    const handleCustomerDataChange = (e) => {
        const { name, value } = e.target;
        setCustomerData({
            ...customerData,
            [name]: value,
        });
    };

    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        const authHeader = getAuthHeader();
        // Update the customer data based on the slug
        if (name) {
            // Replace 'update_customer_url' with the actual API endpoint to update customer data
            const apiUrl = `https://tgc67.online/api/resource/Customer/${name}`;

            const requestData = {
                data: {
                    customer_name: customerData.customerName,
                    customer_type: customerData.customerType,
                    customer_group: customerData.customerGroup,
                    territory: customerData.territory,
                },
            };

            try {
                const response = await axios.put(apiUrl, requestData, authHeader);

                if (response.status === 200) {
                    alert("Customer Updated Successfully");
                    router.push('/main');
                }
            } catch (error) {

                console.error('API Error:', error);
                if (error.response.status === 403) {
                    sessionStorage.clear()
                }
                else {
                    handleError(error)
                }
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
                                        <div className="row__title p-3 d-flex align-items-center">
                                            <div className="p-2" onClick={() => {
                                                router.push('/customer')
                                            }}>

                                                <ArrowBackIcon className='' />
                                            </div>
                                            <h5 className="card-title text-center pb-0 fs-4"> Update Customer </h5>
                                        </div>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        router.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i class="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateCustomer} method="post" className="row g-3 needs-validation">
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
                                            <button className="btn btn-primary login-btn" type="submit">Update Customer Info</button>
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

export default withAuth(EditCustomer);

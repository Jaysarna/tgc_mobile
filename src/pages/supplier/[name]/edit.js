// pages/[slug]/edit.js

import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Siderbar from '@/helpers/siderbar'; // Ensure the correct import path
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleError } from '@/Api/showError';

const EditCustomer = () => {
    const router = useRouter();
    const { name } = router.query; // Access the dynamic parameter "name"

    const [customerData, setCustomerData] = useState({
        customerName: '',
        customerGroup: '',
        customerType: '',
        country: '',
    });


    async function fetchCustomerData(nme) {
        if (nme) {
            const authHeader = getAuthHeader();
            try {
                const response = await axios.get(`https://tgc67.online/api/resource/Supplier/${nme}`, authHeader)
                // console.log(response.data.data)
                if (response?.status === 200) {
                    const customer = response.data.data;
                    // console.log(customer)
                    setCustomerData({
                        customerName: customer.supplier_name,
                        customerGroup: customer.supplier_group,
                        customerType: customer.supplier_type,
                        country: customer.country,
                    });
                }
            }
            catch (err) {
                console.log(err)
                if (err.response?.status === 403) {
                    alert("Login Expired")
                    router.push('/')
                }
                else {
                    handleError(err)
                }
            }
        }

    }


    useEffect(() => {

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
            const apiUrl = `https://tgc67.online/api/resource/Supplier/${name}`;

            const requestData = {
                data: {
                    supplier_name: customerData.customerName,
                    supplier_type: customerData.customerType,
                    supplier_group: customerData.customerGroup,
                    country: customerData.country,
                },
            };

            try {
                const response = await axios.put(apiUrl, requestData, authHeader);

                if (response?.status === 200) {
                    alert("Supplier Updated Successfully");
                    router.push('/supplier');
                }
            } catch (error) {

                if (error.response?.status === 403) {
                    sessionStorage.clear()
                    alert("Login Expired")
                    router.push('/')
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
                                                router.push('/supplier')
                                            }}>

                                                <ArrowBackIcon className='' />
                                            </div>
                                            <h5 className="card-title text-center pb-0 fs-4"> Update Supplier </h5>
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
                                            <label htmlFor="customerName" className="form-label">Supplier Name</label>
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
                                                <div className="invalid-feedback">Please enter the Supplier name.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="customerGroup" className="form-label">Supplier Group</label>
                                            <input
                                                type="text"
                                                name="customerGroup"
                                                className="form-control"
                                                id="customerGroup"
                                                required
                                                value={customerData.customerGroup}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the Supplier group.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="customerType" className="form-label">Supplier Type</label>
                                            <input
                                                type="text"
                                                name="customerType"
                                                className="form-control"
                                                id="customerType"
                                                required
                                                value={customerData.customerType}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the Supplier type.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="country" className="form-label">country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                className="form-control"
                                                id="country"
                                                required
                                                value={customerData.country}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the default price.</div>
                                        </div>
                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Update Supplier Info</button>
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

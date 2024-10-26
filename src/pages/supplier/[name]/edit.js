// pages/[slug]/edit.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Siderbar from '@/helpers/siderbar'; // Ensure the correct import path
import withAuth from '@/customhook/withAuth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get } from '@/configs/apiUtils';
import { updateSupplier } from '@/features/supplier/supplier.services';

const EditCustomer = () => {
    const router = useRouter();
    const { name } = router.query; // Access the dynamic parameter "name"

    const [supplierData, setSupplierData] = useState({
        name: '',
        group: '',
        type: '',
        country: '',
    });


    async function fetchCustomerData(nme) {
        if (nme) {
            try {
                const response = await get(`https://tgc67.online/api/resource/Supplier/${nme}`)
                // console.log(response.data.data)
                if (response?.data) {
                    const supplier = response.data;
                    setSupplierData({
                        name: supplier.supplier_name,
                        group: supplier.supplier_group,
                        type: supplier.supplier_type,
                        country: supplier.country,
                    });
                }
            }
            catch (err) {
                console.log(err)
            }
        }

    }


    useEffect(() => {
        fetchCustomerData(name)
    }, [name]);

    const handleCustomerDataChange = (e) => {
        const { name, value } = e.target;
        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };

    const handleUpdateSupplier = async (e) => {
        e.preventDefault();
        if (name) {
            const requestData = {
                data: {
                    supplier_name: supplierData.name,
                    supplier_type: supplierData.type,
                    supplier_group: supplierData.group,
                    country: supplierData.country,
                },
            };

            try {
                const response = updateSupplier(name, requestData)
                // console.log(response)

            } catch (error) {
                console.log(error)
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

                                    <form onSubmit={handleUpdateSupplier} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="name" className="form-label">Supplier Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    id="name"
                                                    required
                                                    value={supplierData.name}
                                                    onChange={handleCustomerDataChange}
                                                />
                                                <div className="invalid-feedback">Please enter the Supplier name.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="group" className="form-label">Supplier Group</label>
                                            <input
                                                type="text"
                                                name="group"
                                                className="form-control"
                                                id="group"
                                                required
                                                value={supplierData.group}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the Supplier group.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="type" className="form-label">Supplier Type</label>
                                            <input
                                                type="text"
                                                name="type"
                                                className="form-control"
                                                id="type"
                                                required
                                                value={supplierData.type}
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
                                                value={supplierData.country}
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

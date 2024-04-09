import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { handleError } from '@/Api/showError';
import { Autocomplete, TextField, } from '@mui/material';
import { LoadingPage } from '@/helpers/Loader';


const NewItem = () => {
    const [formData, setFormData] = useState({
        itemName: '',
        itemGroup: 'Products',
        unitOfMeasure: 'Unit',
        valuationRate: '',
        standardSellingRate: '',
        maintainStock: true,
        quantity: 1,
        docStatus: 1,
        supplier: ''
    });

    const [cusList, setCusList] = useState([]);
    const [isLoading, setLoading] = useState(false)

    const route = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddItem = async (e) => {
        setLoading(true)
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Item';

        const requestData = {
            data: {
                item_name: formData.itemName,
                item_group: formData.itemGroup,
                stock_uom: formData.unitOfMeasure,
                is_stock_item: formData.maintainStock ? '1' : '0',
                // valuation_rate: formData.valuationRate,
                // standard_rate: formData.standardSellingRate,
                open_stock: formData.quantity,
                // docstatus: '1',
                supplier_items: [{
                    supplier: formData.supplier,
                }]
            },
        };

        try {
            const response = await axios.post(apiUrl, requestData, authHeader);

            if (response.statusText === 'OK') {
                alert('Item Added Successfully');
                route.push('/main');
            }
        } catch (error) {

            console.error('API Error:', error);
            if (error.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(error)
            }
        }
        setLoading(false)
    };


    function handleSupplier(value) {
        setFormData({
            ...formData,
            supplier: value,
        });
    }

    async function fetchSupplier() {
        const authHeader = getAuthHeader()
        try {
            const res = await axios.get('https://tgc67.online/api/resource/Supplier', authHeader)
            setCusList(res.data.data);
        } catch (err) {
            console.log(err);
            setCusList([]);
        }
    }

    useEffect(() => {
        fetchSupplier();
    }, []);




    return (
        <>
            <Siderbar />
            {isLoading &&
                <LoadingPage
                    msg='Creating New Item '
                />}
            <div>
                <div className="col-lg-6 itemOuter mt-3">
                    <div className="rown" style={{ overflow: 'hidden' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Add New Item </h5>
                                    </div>
                                    <div
                                        className=""
                                        style={{ position: 'absolute', right: '20px', top: '20px' }}
                                        onClick={() => {
                                            route.push('/main');
                                        }}
                                    >
                                        <div className="btn btn-primary iconOuter cancelIcon">
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    <form onSubmit={handleAddItem} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="itemName" className="form-label">
                                                Item name
                                            </label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="itemName"
                                                    className="form-control"
                                                    id="itemName"
                                                    required
                                                    value={formData.itemName}
                                                    onChange={handleChange}
                                                />
                                                <div className="invalid-feedback">Please enter your item Name.</div>
                                            </div>
                                        </div>
                                        <div className='col-12 mb-4'>
                                            <label htmlFor="itemName" className="form-label">
                                                Supplier
                                            </label>
                                            <Autocomplete
                                                value={formData.supplier}
                                                onChange={(event, newValue) => handleSupplier(newValue)}
                                                options={cusList.map((option) => option.name)}
                                                renderInput={(params) => <TextField {...params} id="outlined-size-small" size='small' />}

                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="itemGroup" className="form-label">
                                                Item Group
                                            </label>
                                            <input
                                                type="text"
                                                name="itemGroup"
                                                className="form-control"
                                                id="itemGroup"
                                                required
                                                value={formData.itemGroup}
                                                onChange={handleChange}
                                            />
                                            <div className="invalid-feedback">Please enter the item group.</div>
                                        </div>
                                        {/* <div className="col-12 mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="docStatusCheckbox"
                                                    className="form-check-input"
                                                    id="docStatusCheckbox"
                                                    checked={formData.docStatus === 0}
                                                    onChange={handleDocStatusCheckboxChange}
                                                />
                                                <strong className="form-check-strong" htmlFor="docStatusCheckbox">
                                                    Sample
                                                </strong>
                                            </div>
                                        </div> */}

                                        <div className="col-12 mb-4">
                                            <label htmlFor="unitOfMeasure" className="form-label">
                                                Default Unit of Measure
                                            </label>
                                            <input
                                                type="text"
                                                name="unitOfMeasure"
                                                className="form-control"
                                                id="unitOfMeasure"
                                                required
                                                value={formData.unitOfMeasure}
                                                onChange={handleChange}
                                            />
                                            <div className="invalid-feedback">Please enter the unit of measure.</div>
                                        </div>
                                        {/* <div className="col-12 mb-4">
                                            <label htmlFor="valuationRate" className="form-label">
                                                Valuation Rate
                                            </label>
                                            <input
                                                type="number"
                                                name="valuationRate"
                                                className="form-control"
                                                id="valuationRate"
                                                required
                                                value={formData.valuationRate}
                                                onChange={handleChange}
                                            />
                                            <div className="invalid-feedback">Please enter the valuation rate.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="standardSellingRate" className="form-label">
                                                Standard Selling Rate
                                            </label>
                                            <input
                                                type="number"
                                                name="standardSellingRate"
                                                className="form-control"
                                                id="standardSellingRate"
                                                required
                                                value={formData.standardSellingRate}
                                                onChange={handleChange}
                                            />
                                            <div className="invalid-feedback">Please enter the standard selling rate.</div>
                                        </div> */}
                                        <div className="col-12 mb-4">
                                            <label htmlFor="standardSellingRate" className="form-label">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="form-control"
                                                id="quantity"
                                                required
                                                value={formData.quantity}
                                                onChange={handleChange}
                                            />
                                            <div className="invalid-feedback">Please enter the Quantity.</div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <div className="form-check ms-1">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="maintainStock"
                                                    checked={formData.maintainStock}
                                                    onChange={handleChange}

                                                />
                                                <label className="form-check-label" htmlFor="maintainStock">
                                                    Maintain Stock
                                                </label>
                                            </div>
                                        </div>
                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">
                                                Add New Item
                                            </button>
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

export default withAuth(NewItem);









// const handleDocStatusCheckboxChange = (e) => {
//     setFormData({
//         ...formData,
//         docStatus: formData.docStatus === 1 ? 0 : 1,
//     })
// }
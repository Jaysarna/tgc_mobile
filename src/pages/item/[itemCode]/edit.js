import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { handleError } from '@/Api/showError';
import { getAuthHeader } from '@/helpers/Header';

const NewItem = () => {


    const [formData, setFormData] = useState({
        itemName: '',
        itemGroup: 'Products',
        unitOfMeasure: 'Unit',
        valuationRate: '',
        standardSellingRate: '',
        maintainStock: true,
        quantity: 1,
    });

    const route = useRouter();

    const { itemCode } = route.query;

    const authHeader = getAuthHeader()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };



    const handleAddItem = async (e) => {
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Item/';

        const requestData = {
            data: {
                item_name: formData.itemName,
                valuation_rate: formData.valuationRate,
                item_code: itemCode,
            },
        };

        try {
            const response = await axios.put(apiUrl + itemCode, requestData, authHeader);

            if (response.statusText === 'OK') {
                alert('Item Updated Successfully');
                route.push('/item');
            }
        } catch (error) {

            console.error('API Error:', error);
            if (error.response?.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(error)
            }
        }
    };



    async function fetchItemDetail() {



        if (itemCode) {
            const baseURLItem = "https://tgc67.online/api/resource/Item";
            const filtersItem = encodeURIComponent(JSON.stringify([["item_code", "=", itemCode]]));
            const fieldsItem = encodeURIComponent(JSON.stringify(["item_code", "item_name", "item_group", "stock_uom", "valuation_rate"]));

            const urlItem = `${baseURLItem}?filters=${filtersItem}&fields=${fieldsItem}`;
            try {
                const res = await axios.get(urlItem, authHeader)
                let itemInfo = res.data.data[0]

                setFormData({
                    itemName: itemInfo.item_name,
                    itemGroup: itemInfo.item_group,
                    unitOfMeasure: itemInfo.stock_uom,
                    valuationRate: itemInfo.valuation_rate,
                })
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        fetchItemDetail()
    }, [itemCode])
    return (
        <>
            <Siderbar />
            <div>
                <div className="col-lg-6 itemOuter mt-3">
                    <div className="rown" style={{ overflow: 'hidden' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <div
                                            className='p-2'
                                            onClick={() => {
                                                route.push('/item')
                                            }}
                                        >
                                            <ArrowBackIcon className='' />
                                        </div>
                                        <h5 className="card-title text-center pb-0 fs-4">Update Item </h5>
                                    </div>
                                    <div
                                        className=""
                                        style={{ position: 'absolute', right: '20px', top: '20px' }}
                                        onClick={() => {
                                            route.push('/item');
                                        }}
                                    >
                                        <div className="btn btn-primary iconOuter cancelIcon">
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    <form onSubmit={handleAddItem} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="itemCode" className="form-label">
                                                Item Code
                                            </label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="itemCode"
                                                    className="form-control"
                                                    id="itemCode"
                                                    required
                                                    value={itemCode}
                                                    readOnly
                                                />
                                                <div className="invalid-feedback">Please enter your item Name.</div>
                                            </div>
                                        </div>
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
                                                readOnly
                                            />
                                            <div className="invalid-feedback">Please enter the item group.</div>
                                        </div>
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
                                                readOnly
                                            />
                                            <div className="invalid-feedback">Please enter the unit of measure.</div>
                                        </div>
                                        <div className="col-12 mb-4">
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
                                        {/* <div className="col-12 mb-4">
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
                                        </div>
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
                                        </div> */}

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">
                                                Update Item
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

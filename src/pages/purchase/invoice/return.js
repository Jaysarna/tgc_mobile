import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '../../../helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import Loader from '@/helpers/Loader';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';




const Index = () => {
    return (
        <div>
            <InvoiceData />
        </div>
    );
}

export default withAuth(Index);

const InvoiceData = () => {
    const [customerData, setCustomerData] = useState({
        supplier: '',
        paymentAmountInAdvance: 0,
        items: [
            {
                uid: uid(),
                itemCode: '',
                quantity: 1,
                rate: 0,
            },
        ],
    });


    const [isLoading, setLoading] = useState(false)

    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            itemCode: '',
            quantity: 1,
            rate: 0,
        };
        const updatedItems = [...customerData.items];
        updatedItems.push(newItem);
        setCustomerData({
            ...customerData,
            items: updatedItems,
        });
    };

    const removeList = (itemCodeToFilter) => {
        const filteredItems = customerData.items.filter(item => item.itemCode !== itemCodeToFilter);
        setCustomerData({
            ...customerData,
            items: filteredItems,
        });
    };

    function handleItemChange(updatedItem) {
        const updatedItems2 = customerData.items.map((item) => {
            if (item.uid === updatedItem.uid) {
                return updatedItem;
            }
            return item;
        });
        setCustomerData({
            ...customerData,
            items: updatedItems2,
        });
    };

    const [cusList, setCusList] = useState([])

    const route = useRouter();

    const handleCustomerDataChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomerData({
            ...customerData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const handleAddCustomer = async (e) => {
        setLoading(true)
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice';

        const requestData = {
            data: {
                "supplier": customerData.supplier,
                "custom_payment_amount_in_advance": customerData.paymentAmountInAdvance,
                "update_stock": "1",
                "docstatus": "1",
                "items": customerData.items.map((item) => ({
                    "item_code": item.itemCode,
                    "qty": item.quantity,
                    "rate": item.rate,
                })),
            },
        };

        try {
            const response = await axios.post(apiUrl, requestData, authHeader);

            if (response.statusText === 'OK') {
                setLoading(false)

                route.push('/main');
            }
        } catch (error) {


            if (error.response.status === 403) {
                sessionStorage.clear()
            }
            else {
                handleError(error)
            }
            setLoading(false)
            console.error('API Error:', error);

        }
    };

    async function fetchCustomerList() {
        try {
            const res = await axios.get('https://tgc67.online/api/resource/Supplier', authHeader)
            setCusList(res.data.data);
        } catch (err) {
            console.log(err);
            setCusList([]);
            if (err.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
        }
    }


    useEffect(() => {
        fetchCustomerList();
    }, []);

    return (
        <>

            <Siderbar />



            {isLoading &&
                <Loader />}

            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Return Purchase Invoice</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="supplier" className="form-label">Supplier</label>
                                            <div className="has-validation">
                                                <select
                                                    name="supplier"
                                                    className="form-select"
                                                    id="supplier"
                                                    required
                                                    value={customerData.supplier}
                                                    onChange={handleCustomerDataChange}
                                                >
                                                    <option value="">Select a supplier</option>
                                                    {
                                                        cusList.length > 0 && cusList.map((item, index) => {
                                                            return (
                                                                <option value={item.name} key={index}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <div className="invalid-feedback">Please select a supplier.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="paymentAmountInAdvance" className="form-label">Payment Amount In Advance</label>
                                            <input
                                                type="number"
                                                name="paymentAmountInAdvance"
                                                className="form-control"
                                                id="paymentAmountInAdvance"
                                                value={customerData.paymentAmountInAdvance}
                                                onChange={handleCustomerDataChange}
                                                required
                                            />
                                        </div>
                                        <DataTable
                                            head={[
                                                "Item Code",
                                                "Quantity",
                                                "Rate",
                                                "Amount"
                                            ]}
                                            title='Item'
                                            itemList={customerData.items}
                                            addNewItem={addNewItem}
                                            removeList={removeList}
                                            handleItemChange={handleItemChange}
                                        />
                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Create Invoice</button>
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

const DataTable = ({ head, itemList, addNewItem, removeList, handleItemChange }) => {
    return (
        <div>
            <div className="container-7" style={{ margin: 'auto' }}>
                <div className="row row--top-10">
                    <div className="col-md-12">
                        <div className="table-container">
                            <table className="table">
                                <thead className="table__thead">
                                    <tr>
                                        {
                                            head.map((item, index) => {
                                                return (
                                                    <th className="table__th" key={index}>{item}</th>
                                                )
                                            })
                                        }
                                        <th className="table__th"></th>
                                    </tr>
                                </thead>
                                <tbody className="table__tbody">
                                    {
                                        itemList.map((item, index) => {
                                            return (
                                                <TableDataList key={index}
                                                    item={item}
                                                    removeList={removeList}
                                                    handleItemChange={handleItemChange}
                                                />
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div style={{ width: '20%' }}>
                            <button className="btn btn-primary new-row login-btn" type="button" onClick={() => addNewItem()} >New Row</button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </div>
    );
};

const TableDataList = ({ item, removeList, handleItemChange }) => {
    const [itemOptionList, setItemOptionList] = useState([]);

    const router = useRouter()

    const handleItemNameChange = (e) => {
        const selectedItemId = e.target.value;
        const selectedOption = itemOptionList.find((option) => option.item_code === selectedItemId);

        if (selectedOption) {
            const newItem = {
                ...item,
                itemCode: selectedOption.item_code,
                rate: selectedOption.supplier_price,
                quantity: 1
            };
            handleItemChange(newItem);
        }
    };

    const handleQuantityChange = (e) => {

        const newItem = {
            ...item,
            quantity: parseInt(e.target.value, 10),
        };
        handleItemChange(newItem);
    };

    const handleRateChange = (e) => {
        const newItem = {
            ...item,
            rate: parseFloat(e.target.value),
        };
        handleItemChange(newItem);
    };



    async function fetchItemList() {
        const authHeader = getAuthHeader()
        try {
            const listRes = await axios.get('https://tgc67.online/api/resource/Item?fields=["item_code","item_name"]', authHeader);
            setItemOptionList(listRes.data.data);
        } catch (err) {
            console.log(err);
            if (err.response.status === 403) {
                sessionStorage.clear()
            }
            else {
                handleError(err)
            }
        }
    }

    useEffect(() => {
        fetchItemList();
    }, [itemOptionList]);


    return (
        <tr className="table-row table-row--chris">
            <td data-column="Policy" className="table-row__td" style={{ maxWidth: '200px', width: '40%' }}>
                <div className="table-row-input">
                    <select
                        value={item.itemCode}
                        onChange={handleItemNameChange}
                        className="form-select"
                    >
                        <option value="">Select Item Code</option>
                        {itemOptionList.length > 0 && itemOptionList.map((item) => (
                            <option value={item.item_code} key={item.item_code}>
                                {item.item_name}
                            </option>
                        ))}
                    </select>
                </div>
            </td>
            <td data-column="quantity" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        placeholder="Quantity"
                        step=".01"
                        required
                    />
                </div>
            </td>
            <td data-column="rate" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.rate}
                        onChange={handleRateChange}
                        required
                        placeholder="Rate"
                    />
                </div>
            </td>
            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name">{ }</p>
                </div>
            </td>

            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name" >
                        <i className="fa-solid fa-trash-can" onClick={() => removeList(item.itemCode)}></i>
                    </p>
                </div>
            </td>
        </tr>
    );
};

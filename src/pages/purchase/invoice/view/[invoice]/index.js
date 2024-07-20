
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { handleItemPrice } from '@/features/item/getItemByItemCode';

const url = 'https://tgc67.online/api/resource/Purchase%20Invoice/';


const view = () => {

    const router = useRouter();

    const { name, invoice } = router.query;

    const [customerData, setCustomerData] = useState({
        customerName: '', // Initialize with an empty string
        dueDate: '', // Set dueDate 10 days ahead of postingDate
        items: [{

            itemName: '',
            quantity: 1,
            rate: '',
            availableQuantity: '',
            amount: 0,
        },]
    });


    async function fetchCSData() {
        const authHeader = getAuthHeader();
        // console.log(invoice)
        if (invoice) {
            try {
                const response = await axios.get(url + invoice, authHeader)
                console.log(response.data.data)
                if (response?.status === 200) {
                    const customer = response.data.data;
                    setCustomerData({
                        customerName: customer.supplier_name, // Initialize with an empty string
                        dueDate: customer.due_date,

                        items: customer.items
                    })
                }
            }
            catch (error) {
                console.log(error)
                if (error.response?.status === 403) {
                    sessionStorage.clear()
                }
                else {
                    handleError(error)
                }
            }
        }


    }




    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            itemName: '',
            quantity: 1,
            rate: 0,
            amount: 0,
        };
        // Create a copy of the current items array
        const updatedItems = [...customerData.items];

        // Add the new item to the copy
        updatedItems.push(newItem);

        // Update the customerData state with the modified items array
        setCustomerData({
            ...customerData,
            items: updatedItems,
        });

    };



    useEffect(() => {
        fetchCSData()
    }, [invoice])



    return (
        <>
            <Siderbar />
            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">

                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4"> Invoice Details</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        router.push('/purchase/invoice')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form method="post" className="row g-3 needs-validation">
                                        <div className="col-12 mb-4">
                                            <label htmlFor="dueDate" className="form-label">Invoice Name</label>
                                            <input
                                                type="text"

                                                className="form-control"
                                                id="dueDate"
                                                value={invoice}

                                                readOnly
                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="dueDate" className="form-label">Supplier Name</label>
                                            <input
                                                type="text"

                                                className="form-control"
                                                id="dueDate"
                                                value={customerData.customerName}

                                                readOnly
                                            />
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label htmlFor="dueDate" className="form-label">Due Date</label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                className="form-control"
                                                id="dueDate"
                                                value={customerData.dueDate}

                                                readOnly
                                            />
                                        </div>


                                        <DataTable
                                            head={[
                                                "Item Name",
                                                "Quantity",
                                                "Rate",
                                                "Amount",
                                            ]}
                                            title='Customer'
                                            itemList={customerData.items}

                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="button" onClick={() => {
                                                router.push('/purchase/invoice')
                                            }}>Cancel Invoice</button>
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


const DataTable = ({ head, itemList, removeList, handleItemChange }) => {


    const [totalAmount, setTotalAmount] = useState(0)
    const [totalQuan, setTotalQuan] = useState(1)

    useEffect(() => {
        // console.log(itemList)
        setTotalAmount(itemList.reduce((total, item) => total + item.base_rate * item.qty, 0))
        setTotalQuan(itemList.reduce((total, item) => parseFloat(total) + parseFloat(item.qty), 0))
    }, [itemList])

    return (
        <>

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
                                                <>
                                                    <TableDataList key={index}
                                                        item={item}
                                                        removeList={removeList}
                                                        handleItemChange={handleItemChange}
                                                    />
                                                </>
                                            )
                                        })
                                    }



                                </tbody>
                            </table>
                        </div>

                        <div className="row mt-4" style={{ marginLeft: '0px', marginRight: '0px', padding: '10px' }}>
                            <div className="col-5 mb-4">
                                <label htmlFor="Total Amount" className="form-label">Total Amount </label>
                                <input
                                    type="number"
                                    className='form-control'
                                    value={totalAmount}
                                    placeholder="Total Amount"
                                    readOnly
                                />
                            </div>
                            <div className="col-5 mb-4">
                                <label htmlFor="total Quantity" className="form-label">Total Quantity</label>
                                <input
                                    type="number"
                                    className='form-control'
                                    value={totalQuan}
                                    placeholder="Total Quantity"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <br />

            </div>
        </>
    );
};




const TableDataList = ({ item, removeList, handleItemChange }) => {


    return (
        <tr className="table-row table-row--chris">
            <td data-column="Policy" className="table-row__td" style={{ maxWidth: '200px', width: '40%' }}>
                <div className="table-row-input">
                    <input
                        type="text"
                        value={item.item_name}
                        placeholder="Item Name"
                        readOnly
                    />
                </div>
            </td>

            <td data-column="availableQuantity" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.qty}
                        placeholder="Quantity"
                        readOnly
                    />
                </div>
            </td>
            <td data-column="amount" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.base_rate}
                        // onChange={handleRateChange}
                        placeholder="Amount"
                        readOnly
                    />
                </div>
            </td>
            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name">{item.base_rate * item.qty}</p>
                </div>
            </td>

        </tr>
    );
};




export default withAuth(view);
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { LoadingPage } from '@/helpers/Loader';
import { CreateNewPurchaseInvoice, updatePurchaseInvoice } from '@/features/purchase/purchase.services';
import Head from 'next/head';



const Index = () => {
    return (
        <div>
            <InvoiceData />
        </div>
    );
}

export default withAuth(Index);



const InvoiceData = () => {

    const route = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const { name, invoice } = route.query;

    const [supplierData, setSupplierData] = useState({
        supplierName: '',
        postingDate: new Date().toISOString().substr(0, 10),
        dueDate: new Date().toISOString().substr(0, 10),
        docStatus: 1,
        // custom_sample:0,
        items: [{
            uid: uid(),
            itemName: '',
            quantity: 1,
            rate: '',
            availableQuantity: 1,
            amount: 0,
        },]
    });


    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            itemName: '',
            quantity: 1,
            rate: 0,
            amount: 0,
        };
        // Create a copy of the current items array
        const updatedItems = [...supplierData.items];


        updatedItems.push(newItem);


        setSupplierData({
            ...supplierData,
            items: updatedItems,
        });

    };

    const removeList = (itemNameToFilter) => {
        // console.log(itemNameToFilter)

        const filteredItems = supplierData.items.filter(item => item.uid !== itemNameToFilter);


        setSupplierData({
            ...supplierData,
            items: filteredItems,
        });
        // console.log(customerData.items)
    };


    function handleItemChange(updatedItem) {

        const updatedItems2 = supplierData.items.map((item) => {
            if (item.uid === updatedItem.uid) {
                return updatedItem;
            }
            return item;
        });
        setSupplierData({
            ...supplierData,
            items: updatedItems2
        });


    };


    const [cusList, setCusList] = useState([])


    const handleUpdateSample = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        // const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice/' + invoice;


        function buildItemsArray(jsonItems) {

            return jsonItems.map((jsonItem) => ({
                "item_code": jsonItem.itemName,
                "qty": jsonItem.quantity,
                "rate": jsonItem.rate,
            }));
        }

        const requestData = {
            data: {
                "supplier": supplierData.supplierName,
                "docstatus": supplierData.docStatus,
                "update_stock": "1",
                "due_date": supplierData.dueDate,
                "items": buildItemsArray(supplierData.items),

            },
        };
        try {
            const response = updatePurchaseInvoice(invoice)
        } catch (error) {
            console.log(error)

        }
        setIsLoading(false)
    };


    async function fetchInvoiceDetails(customer, invoice) {


        try {
            const res = await axios.get('https://tgc67.online/api/resource/Purchase%20Invoice/' + invoice, authHeader)
            // console.log(res.data.data)

            const items = res.data.data.items
            const updatedItems = items.map((item) => (
                {
                    ...item,
                    uid: uid(),
                    itemName: item.item_code,
                    item_code: item.item_code,
                    quantity: item.qty,
                    availableQuantity: item.actual_qty,
                }
            ))


            setSupplierData({
                ...supplierData,
                supplierName: customer,
                items: updatedItems
            })
        }
        catch (err) {
            console.log(err)
            setCusList([])
        }
    }



    const handlePostingDateChange = (e) => {
        setSupplierData({
            ...supplierData,
            postingDate: e.target.value,
        });
    };






    useEffect(() => {
        if (name && invoice) {
            fetchInvoiceDetails(name, invoice)
        }

    }, [name, invoice])



    return (
        <>
            <Head>
                <title>Update Sample to Invoice</title>
            </Head>
            <Siderbar />

            {isLoading &&
                <LoadingPage
                    msg='Updating Invoice'
                />}
            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">

                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Update New Purchase Invoices</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/customer')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleUpdateSample} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="customerName" className="form-label">Supplier Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="input"
                                                    name="customerName"
                                                    className="form-control"
                                                    id="customerName"
                                                    value={supplierData.supplierName}
                                                    readOnly
                                                // onChange={handlePostingDateChange}
                                                />
                                                {/* <div className="invalid-feedback">Please enter the customer name.</div> */}
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="postingDate" className="form-label">Posting Date</label>
                                            <input
                                                type="date"
                                                name="postingDate"
                                                className="form-control"
                                                id="postingDate"
                                                value={supplierData.postingDate}
                                                onChange={handlePostingDateChange}
                                            />
                                        </div>



                                        <DataTable
                                            head={[
                                                "Item Name",
                                                "Avalable Quantity",
                                                "Quantity.",
                                                "Rate",
                                                "Amount",
                                            ]}
                                            title='Customer'
                                            itemList={supplierData.items}
                                            addNewItem={addNewItem}
                                            removeList={removeList}
                                            handleItemChange={handleItemChange}
                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Update Invoice</button>
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


    const [totalAmount, setTotalAmount] = useState(0)
    const [totalQuan, setTotalQuan] = useState(1)

    useEffect(() => {
        // console.log(itemList)
        setTotalAmount(itemList.reduce((total, item) => total + item.rate * item.quantity, 0))
        setTotalQuan(itemList.reduce((total, item) => total + item.quantity, 0))
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
                        <div style={{ width: '100%' }}>
                            <button className="btn btn-primary new-row login-btn" type="button" onClick={() => addNewItem()} >New Row</button>

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

    const [itemOptionList, setItemOptionList] = useState([]);
    const route = useRouter()

    const handleItemNameChange = (e) => {
        const selectedItemId = e.target.value;
        const selectedOption = itemOptionList.find((option) => option.item_code === selectedItemId);

        if (selectedOption) {
            const newItem = {
                ...item,
                itemName: selectedOption.item_code, // Set the item name based on the selected option
                rate: selectedOption.last_sale_price,
                availableQuantity: selectedOption.actual_qty
            };
            handleItemChange(newItem);
        }
    };

    const handleQuantityChange = (e) => {

        const newItem = {
            ...item,
            quantity: e.target.value,
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
            const listRes = await axios.get('https://tgc67.online/api/resource/Item?fields=["item_code","item_name"]&limit=500', authHeader);
            setItemOptionList(listRes.data.data);
        } catch (err) {
            console.log(err);

            if (err.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
            setItemOptionList([])
        }
    }

    useEffect(() => {
        //    let salesItem= localStorage.getItem('saleItem')
        fetchItemList();
        // handleItemChange(salesItem)
    }, []);

    return (
        <tr className="table-row table-row--chris">
            <td data-column="Policy" className="table-row__td" style={{ maxWidth: '200px', width: '40%' }}>
                <div className="table-row-input">
                    <select
                        value={item.itemName}
                        onChange={handleItemNameChange}
                        className="form-select"
                    >
                        <option value="">Select Any Item</option>
                        {itemOptionList.length > 0 && itemOptionList.map((item) => (
                            <option value={item.item_code} key={item.item_code}>
                                {item.item_name}
                            </option>
                        ))}
                    </select>
                </div>
            </td>
            <td data-column="rate" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.availableQuantity}
                        readOnly
                        placeholder="Available Quantity"
                    />
                </div>
            </td>
            <td data-column="availableQuantity" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        step=".01"
                        placeholder="Quantity"
                    />
                </div>
            </td>
            <td data-column="amount" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.rate}
                        onChange={handleRateChange}
                        placeholder="Amount"
                    />
                </div>
            </td>
            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name">{item.rate * item.quantity}</p>
                </div>
            </td>
            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name" >
                        <i className="fa-solid fa-trash-can" onClick={() => removeList(item.uid)}></i>
                    </p>
                </div>
            </td>
        </tr>
    );
};


import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
// import { uid } from 'uid';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { handleItemPrice } from '@/features/item/getItemByItemCode';
import { LoadingPage } from '@/helpers/Loader';
import addNewCustomer from '@/features/customer/customer.services';
import SearchSelect from '@/customhook/autocomplete/SeachSelect';
import SearchCreateItem from '@/customhook/autocomplete/SearchCreateItem';
import addnewItem, { addNewItemWithoutSupplier } from '@/features/item/item.services';
import { getSupplierList } from '@/features/supplier/supplier.services';
import { uid } from 'uid';
import Head from 'next/head';
import { handleShowApiError } from '@/features/error/getErrorApi';


let name = "Customer"
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
        customerName: '', // Initialize with an empty string
        postingDate: new Date().toISOString().substr(0, 10), // Set to today's date
        dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10), // Set dueDate 10 days ahead of postingDate
        docStatus: 1,
        custom_sample: 0,
        items: [{
            uid: uid(),
            item_code: localStorage.getItem('saleItem') ? localStorage.getItem('saleItem') : '',
            itemName: localStorage.getItem('saleItem') ? localStorage.getItem('saleItem') : '',
            quantity: 1,
            rate: localStorage.getItem('saleRate') ? localStorage.getItem('saleRate') : '',
            availableQuantity: localStorage.getItem('saleQuan') ? localStorage.getItem('saleQuan') : '',
            amount: 0,
        },]
    });


    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            item_code: '',
            item_name: '',
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

    const removeList = (itemNameToFilter) => {
        // console.log(itemNameToFilter)

        const filteredItems = customerData.items.filter(item => item.item_code !== itemNameToFilter);

        // Update the customerData state with the filtered array
        setCustomerData({
            ...customerData,
            items: filteredItems,
        });
        // console.log(customerData.items)
    };


    function handleItemChange(updatedItem) {
        console.log(updatedItem)
        // Update the item in customerData.items using the updatedItem data
        const updatedItems2 = customerData.items.map((item) => {

            if (item.item_code === updatedItem.item_code || item?.uid == updatedItem?.uid) {
                return updatedItem;
            }
            return item;
        });

        console.log(updatedItems2)
        setCustomerData({
            ...customerData,
            items: updatedItems2
        });

        console.log(customerData)
    };


    const [cusList, setCusList] = useState([])

    const route = useRouter();



    const handleAddCustomer = async (e) => {
        setLoading(true)

        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice';


        function buildItemsArray(jsonItems) {

            return jsonItems.map((jsonItem) => ({
                "item_code": jsonItem.item_code,
                "qty": jsonItem.quantity,
                "rate": jsonItem.rate,
            }));
        }

        const requestData = {
            data: {
                "customer": customerData.customerName,
                "docstatus": customerData.docStatus,
                "update_stock": 1,
                "due_date": customerData.dueDate,
                "items": buildItemsArray(customerData.items),
                "custom_sample": !(customerData.docStatus),
                "set_warehouse": "Warehouse 1 - TGC",
            },
        };

        // console.log(requestData)
        try {
            const response = await axios.post(apiUrl, requestData, authHeader)
            console.log(response)

            if (response.statusText === 'OK') {
                alert("Invoice Created Successfully")
                route.push('/main')
                localStorage.clear()
            }
            // console.log('API Response:', response.statusText)
        } catch (err) {
            handleShowApiError(err)
            handleError(err)
            console.error('API Error:', err);
        }
        setLoading(false)
    };


    async function fetchCustomerList() {

        const authHeader = getAuthHeader()

        try {
            const res = await axios.get('https://tgc67.online/api/resource/Customer', authHeader)
            // console.log(res.data.data)
            setCusList(res.data.data)
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 403) {
                sessionStorage.clear()
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
            setCusList([])
        }
    }



    const handlePostingDateChange = (e) => {
        setCustomerData({
            ...customerData,
            postingDate: e.target.value,
        });
    };

    const handleDueDateChange = (e) => {
        setCustomerData({
            ...customerData,
            dueDate: e.target.value,
        });
    };

    const handleDocStatusCheckboxChange = (e) => {
        setCustomerData({
            ...customerData,
            docStatus: customerData.docStatus === 1 ? 0 : 1,
        })
    }


    const handleUpdateValue = (value) => {
        // console.log(value)
        const newValue = (typeof value === 'object') ? value?.name : value;

        setCustomerData({ ...customerData, customerName: newValue });
    };



    useEffect(() => {
        fetchCustomerList()
    }, [])

    const [isLoading, setLoading] = useState(false)

    return (
        <>
            <Head>
                <title>New Sales Invoice </title>
            </Head>

            {isLoading &&
                <LoadingPage
                    msg='Creating Sales Invoice'
                />}
            <Siderbar />
            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">

                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">New Sales Invoices</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">


                                        <div className='col-12 mb-4'>
                                            <SearchSelect
                                                cusList={cusList}
                                                handleUpdateValue={handleUpdateValue}
                                                name="Customer"
                                                handleAdd={(updatedValue) => {
                                                    addNewCustomer({ customerName: updatedValue })
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="postingDate" className="form-label">Posting Date</label>
                                            <input
                                                type="date"
                                                name="postingDate"
                                                className="form-control"
                                                id="postingDate"
                                                value={customerData.postingDate}
                                                onChange={handlePostingDateChange}
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
                                                onChange={handleDueDateChange}

                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="docStatusCheckbox"
                                                    className="form-check-input"
                                                    id="docStatusCheckbox"
                                                    checked={customerData.docStatus === 0}
                                                    onChange={handleDocStatusCheckboxChange}
                                                />
                                                <strong className="form-check-strong" htmlFor="docStatusCheckbox">
                                                    Sample
                                                </strong>
                                            </div>
                                        </div>

                                        <DataTable
                                            head={[
                                                "Item Name",

                                                "Quantity.",
                                                "Rate",
                                                "Amount",
                                            ]}
                                            title='Customer'
                                            itemList={customerData.items}
                                            addNewItem={addNewItem}
                                            removeList={removeList}
                                            handleItemChange={handleItemChange}
                                            cusList={cusList}
                                            handleUpdateValue={handleUpdateValue}

                                            handleAdd={(updatedValue) => {
                                                addNewCustomer({ customerName: updatedValue })
                                            }}
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


const DataTable = ({ head, itemList, addNewItem, removeList, handleItemChange, handleAdd, handleUpdateValue, cusList }) => {


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

                                                <TableDataList
                                                    key={index}
                                                    item={item}
                                                    removeList={removeList}
                                                    handleItemChange={handleItemChange}
                                                    cusList={cusList}
                                                    handleUpdateValue={handleUpdateValue}
                                                    handleAdd={handleAdd}
                                                />

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




const TableDataList = ({ item, removeList, handleItemChange, handleAdd, handleUpdateValue, cusList }) => {
    const [itemOptionList, setItemOptionList] = useState([]);
    const route = useRouter();


    const handleItemNameChange = async (item, uid, quantity) => {
        console.log(item)
        const selectedItemId = item?.item_code;
        const selectedOption = itemOptionList.find((option) => option.item_code === selectedItemId);

        const last_sale_price = await handleItemPrice(selectedItemId)

        // console.log(selectedOption)

        if (selectedOption) {
            const newItem = {
                ...item,
                uid: uid,
                itemName: selectedOption?.item_code,
                item_code: selectedOption?.item_code,
                quantity: quantity,
                rate: last_sale_price,
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
                sessionStorage.clear()

            }
            else {
                handleError(err)
            }
            setItemOptionList([])
        }
    }

    const [supplierList, setSupplierList] = useState([])
    async function fetchSupplierList() {
        const res = await getSupplierList()

        if (res?.data.length > 0) {

            setSupplierList(res?.data)
        }
        else {
            setSupplierList([])
        }
    }

    useEffect(() => {
        fetchItemList();
        fetchSupplierList();
        // handleItemChange(salesItem)
    }, []);

    return (
        <tr className="table-row table-row--chris" >
            <td data-column="Policy" className="table-row__td" style={{ maxWidth: '200px', width: '40%' }}>
                <div className="table-row-input">
                    <SearchCreateItem
                        name={name}
                        itemOptionList={itemOptionList}
                        uid={item?.uid}
                        quantity={item?.quantity}
                        handleItemNameChange={handleItemNameChange}
                        cusList={cusList}
                        handleUpdateValue={handleUpdateValue}

                        selectList={supplierList}
                        handleAdd={handleAdd}
                        handleAddNewItem={async (itemName, supplierName) => {
                            console.log('itemName:', itemName)
                            console.log('suppliername:', supplierName)

                            const res = await addNewItemWithoutSupplier({ itemName })
                            if (res?.data) {

                                handleItemNameChange({
                                    uid: item.uid,
                                    quantity: item.quantity,
                                    item_name: res?.data.item_name,
                                    item_code: res?.data?.item_code
                                })
                            }

                        }}
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
                        <i className="fa-solid fa-trash-can" onClick={() => removeList(item?.item_code)}></i>
                    </p>
                </div>
            </td>
        </tr>
    );
};


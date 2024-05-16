import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
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

    const router = useRouter();
    const { name, customer } = router.query;


    const [customerData, setCustomerData] = useState({
        customerName: '', // Initialize with an empty string,
        return_invoice: '',
        // postingDate: new Date().toISOString().substr(0, 10), // Set to today's date
        dueDate: new Date().toISOString().substr(0, 10),
        items: [{
            uid: uid(),
            itemName: '',
            quantity: 1,
            rate: '',
            availableQuantity: '',
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

        const filteredItems = customerData.items.filter(item => item.uid !== itemNameToFilter);

        // Update the customerData state with the filtered array
        setCustomerData({
            ...customerData,
            items: filteredItems,
        });
        // console.log(customerData.items)
    };


    function handleItemChange(updatedItem) {
        // Update the item in customerData.items using the updatedItem data
        const updatedItems2 = customerData.items.map((item) => {
            if (item.uid === updatedItem.uid) {
                return updatedItem;
            }
            return item;
        });
        setCustomerData({
            ...customerData,
            items: updatedItems2
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
        e.preventDefault();

        const authHeader = getAuthHeader()

        const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice';


        function buildItemsArray(jsonItems) {

            return jsonItems.map((jsonItem) => ({
                "item_code": jsonItem.itemCode,
                "qty": jsonItem.quantity,
                "rate": jsonItem.rate,
            }));
        }

        const requestData = {
            data: {
                "return_against": customerData.customerName,
                "is_return": 1,
                "customer": customerData.return_invoice,
                "update_stock": "1",
                "docstatus": "1",
                "posting_date": customerData.dueDate,
                "items": buildItemsArray(customerData.items),

            },
        };

        // console.log(requestData)
        try {
            const response = await axios.post(apiUrl, requestData, authHeader)


            if (response.statusText === 'OK') {
                alert("Return Successfully")
                route.push('/sales/invoice/')
            }
            // console.log('API Response:', response.statusText)
        } catch (error) {

            console.error('API Error:', error);
            if (err.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
        }
    };


    async function fetchCustomerList(name, customer) {

        const authHeader = getAuthHeader()
        try {
            const res = await axios.get('https://tgc67.online/api/resource/Sales%20Invoice/' + name, authHeader)
            // console.log(res.data.data)
            const itemsArr = res.data.data.items;
            const itemsWithUuid = itemsArr.map(item => ({
                ...item,
                uid: uid(),
                itemCode: item.item_code,
                itemName: item.item_name,
                quantity: -(item.qty),
                rate: item.rate,
                amount: (-item.qty) * (item.rate)
            }));
            setCustomerData({
                ...customerData,
                customerName: name,
                return_invoice: customer,
                items: itemsWithUuid
            })
            setCusList(res.data.data)

        }
        catch (err) {
            console.log(err)
            setCusList([])
            if (err.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
        }
    }





    const handleDueDateChange = (e) => {
        setCustomerData({
            ...customerData,
            dueDate: e.target.value,
        });
    };




    useEffect(() => {

        if (name && customer) {
            fetchCustomerList(name, customer)
        }
    }, [name, customer])



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
                                        <h5 className="card-title text-center pb-0 fs-4">Sales Return</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/sales/invoice')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name=""
                                                    className="form-control"
                                                    id=""
                                                    value={customerData.customerName}
                                                    readOnly
                                                // onChange={handlePostingDateChange}
                                                />
                                                {/* <div className="invalid-feedback">Please enter the customer name.</div> */}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="customerName" className="form-label">Return Invoice</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"

                                                    className="form-control"

                                                    value={customerData.return_invoice}
                                                    readOnly

                                                />
                                                {/* <div className="invalid-feedback">Please enter the customer name.</div> */}
                                            </div>
                                        </div>


                                        <div className="col-12 mb-4">
                                            <label htmlFor="dueDate" className="form-label">Posting Date</label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                className="form-control"
                                                id="dueDate"
                                                value={customerData.dueDate}
                                                onChange={handleDueDateChange}

                                            />
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
                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Return Sales</button>
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
        setTotalQuan(itemList.reduce((total, item) => parseFloat(total) + parseFloat(item.quantity), 0))
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
                        {/* <div style={{ width: '20%' }}>
                            <button className="btn btn-primary new-row login-btn" type="button" onClick={() => addNewItem()} >New Row</button>
                        </div> */}
                    </div>
                </div>
                <br />
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
            quantity: -parseInt(e.target.value, 10),
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


                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="text"
                        value={item.itemName}
                        readOnly
                        placeholder="Item"
                    />

                </div>
            </td>

            <td data-column="availableQuantity" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        placeholder="Available Quantity"
                    />
                </div>
            </td>
            <td data-column="amount" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.rate}
                        onChange={handleRateChange}
                        placeholder="Amount $"
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


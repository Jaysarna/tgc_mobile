import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { handleItemPrice } from '@/features/item/getItemByItemCode';



const Index = () => {
    return (
        <div>
            <InvoiceData />
        </div>
    );
}

export default withAuth(Index);


const InvoiceData = () => {
    const [stockData, setStockData] = useState({
        purpose: 'Opening Stock',
        expense_account: 'Temporary Opening - TGC',
        docstatus: 1,
        items: [
            {
                uid: uid(),
                item_code: '',
                qty: 1,
                warehouse: 'Warehouse 1 - TGC',
                valuation_rate: 0,
            },
        ],
    });

    const route = useRouter()

    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            item_code: '',
            qty: 1,
            warehouse: '',
            valuation_rate: 0,
        };
        const updatedItems = [...stockData.items, newItem];
        setStockData({
            ...stockData,
            items: updatedItems,
        });
    };

    // const removeItem = (itemIndex) => {
    //     console.log('fired')
    //     const updatedItems = stockData.items.filter((item, index) => index !== itemIndex);
    //     setStockData({
    //         ...stockData,
    //         items: updatedItems,
    //     });
    // };

    const removeItem = (itemNameToFilter) => {
        // console.log(itemNameToFilter)

        const filteredItems = stockData.items.filter(item => item.uid !== itemNameToFilter);

        // Update the customerData state with the filtered array
        setStockData({
            ...stockData,
            items: filteredItems,
        });
        // console.log(customerData.items)
    };

    const handleItemChange = (updatedItem2) => {
        const updatedItem = stockData.items.map((item) => {
            if (item.uid === updatedItem2.uid) {
                return updatedItem2;
            }
            return item;
        });
        setStockData({
            ...stockData,
            items: updatedItem,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        function buildItemsArray(jsonItems) {

            return jsonItems.map((jsonItem) => ({
                "item_code": jsonItem.item_code,
                "qty": jsonItem.qty,
                "valuation_rate": jsonItem.valuation_rate,
                "warehouse": "Warehouse 1 - TGC",
            }));
        }

        const requestData = {
            data: {
                "purpose": stockData.purpose,
                "docstatus": "1",
                "expense_account": stockData.expense_account,
                "items": buildItemsArray(stockData.items),

            },
        };
        const apiUrl = "https://tgc67.online/api/resource/Stock%20Reconciliation";

        // console.log(requestData)

        const authHeader = getAuthHeader()

        try {
            const response = await axios.post(apiUrl, requestData, authHeader);
            console.log(response)
            if (response.statusText === 'OK') {
                alert('Stock Created Successfully');
                route.push('/main')
            }
        } catch (error) {

            if (error.response.status === 403) {
                sessionStorage.clear()
            }
            else {
                handleError(error)
            }
            console.log(error)

        }
    };

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
                                        <h5 className="card-title text-center pb-0 fs-4">Add Existing Stock</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit} method="post" className="row g-3 needs-validation">
                                        {/* ... (existing form elements) */}
                                        {/* New section for handling stock data */}
                                        <div className="col-12">
                                            <label htmlFor="purpose" className="form-label">
                                                Purpose
                                            </label>
                                            <select
                                                name="purpose"
                                                className="form-select"
                                                id="purpose"
                                                value={stockData.purpose}
                                                onChange={(e) => setStockData({ ...stockData, purpose: e.target.value })}
                                            >
                                                <option value="Opening Stock">Opening Stock</option>
                                                <option value="Stock Reconciliation">Stock Reconciliation</option>
                                            </select>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="expenseAccount" className="form-label">
                                                Expense Account
                                            </label>
                                            <input
                                                type="text"
                                                name="expenseAccount"
                                                className="form-control"
                                                id="expenseAccount"
                                                value={stockData.expense_account}
                                                onChange={(e) => setStockData({ ...stockData, expense_account: e.target.value })}
                                            />
                                        </div>
                                        {/* Iterate over items and create form elements */}
                                        <DataTable
                                            head={[
                                                "Item Name",
                                                "Quantity.",
                                                "Rate",
                                                "Amount",
                                            ]}
                                            title='Customer'
                                            itemList={stockData.items}
                                            addNewItem={addNewItem}
                                            removeList={removeItem}
                                            handleItemChange={handleItemChange}
                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Create Existing Stock</button>
                                        </div>

                                        {/* ... (existing form elements) */}
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
        setTotalAmount(itemList.reduce((total, item) => total + item.valuation_rate * item.qty, 0))
        setTotalQuan(itemList.reduce((total, item) => total + item.qty, 0))
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
    const handleItemNameChange = async (e) => {
        const selectedItemId = e.target.value;
        const selectedOption = itemOptionList.find((option) => option.item_code === selectedItemId);

        const supplier_price = await handleItemPrice(selectedItemId)

        if (selectedOption) {
            const newItem = {
                ...item,
                item_code: selectedOption.item_code, // Set the item name based on the selected option
                valuation_rate: supplier_price,
                availableQuantity: selectedOption.actual_qty
            };
            handleItemChange(newItem);
        }
    };

    const handleQuantityChange = (e) => {

        const newItem = {
            ...item,
            qty: e.target.value,
        };
        handleItemChange(newItem);
    };

    const handleRateChange = (e) => {
        const newItem = {
            ...item,
            valuation_rate: parseFloat(e.target.value),
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
                        value={item.item_code}
                        onChange={handleItemNameChange}
                        className="form-select"
                    >
                        <option value="">Select Any Item</option>
                        {itemOptionList.length > 0 && itemOptionList.map((item) => (
                            <option value={item.item_code} key={item.item_code}>
                                <li>{item.item_name}</li>
                                {/* <br/>   */}
                                {/* <span>{item.item_code}</span> */}
                            </option>
                        ))}
                    </select>
                </div>
            </td>
            {/* <td data-column="rate" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.availableQuantity}
                        readOnly
                        placeholder="quant"
                    />
                </div>
            </td> */}
            <td data-column="quantity" className="table-row__td" style={{ maxWidth: '200px', width: '10%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.qty}
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
                        value={item.valuation_rate}
                        onChange={handleRateChange}
                        placeholder="Amount"
                    />
                </div>
            </td>
            <td className="table-row__td">
                <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                    <p className="table-row__name">{item.valuation_rate * item.qty}</p>
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


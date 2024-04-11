import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import { LoadingPage } from '@/helpers/Loader';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { handleItemPrice } from '@/features/item/getItemByItemCode';
import { Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import newitem from '@/pages/item/newitem';
import SearchSelect from '@/customhook/autocomplete/SeachSelect';
import addNewSupplier from '@/features/supplier/supplier.services';





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
        docStatus: 1,
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
    const authHeader = getAuthHeader();

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
        const filteredItems = customerData.items.filter(item => item.uid !== itemCodeToFilter);
        setCustomerData({
            ...customerData,
            items: filteredItems,
        });
    };

    function handleItemChange(updatedItem) {
        console.log(updatedItem)

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

    const route = useRouter();

    const handleCustomerDataChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomerData({
            ...customerData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const handleSupplierChange = (value) => {
        setCustomerData({
            ...customerData,
            supplier: value,
        });
    }


    const handleAddSupplier = async (e) => {
        setLoading(true)
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice';

        const sampleRequestData = {
            data: {
                "supplier": customerData.supplier,
                "set_warehouse": "Warehouse 1 - TGC",
                // "expense_account": 'Stock In Hand - TGC',
                "custom_payment_amount_in_advance": customerData.paymentAmountInAdvance,
                "update_stock": "1",
                "docstatus": 0,
                "custom_sample": !(customerData.docStatus),
                "items": customerData.items.map((item) => ({
                    "item_code": item.itemCode,
                    "qty": item.quantity,
                    "rate": item.rate,
                    "warehouse": "Warehouse 1 - TGC",
                })),
            },
        };
        // const requestData = {
        //     data: {
        //         "supplier": customerData.supplier,
        //         "set_warehouse": "Warehouse 1 - TGC",
        //         // "expense_account": 'Stock In Hand - TGC',
        //         "custom_payment_amount_in_advance": customerData.paymentAmountInAdvance,
        //         "update_stock": "1",
        //         "docstatus": 1,
        //         "custom_sample": !(customerData.docStatus),
        //         "items": customerData.items.map((item) => ({
        //             "item_code": item.itemCode,
        //             "qty": item.quantity,
        //             "rate": item.rate,
        //             "warehouse": "Warehouse 1 - TGC",
        //         })),
        //     },
        // };




        try {
            let response1 = await axios.post(apiUrl, sampleRequestData, authHeader);

            if (response1 && !response1.data.data.custom_sample) {

                var response = await axios.put(apiUrl + '/' + response1.data.data.name, {
                    data: {
                        "name": response1.data.data.name,
                        "docstatus": 1
                    }
                }, authHeader);

            }



            if (response1.statusText === 'OK') {
                setLoading(false)
                alert('Create Invoice Successfully')
                route.push('/main');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                sessionStorage.clear()
            }
            else {
                handleError(error)
            }
            setLoading(false)
        }
        setLoading(false)
    };


    useEffect(() => {
        fetchSupplier();
    }, []);

    const [newItem, setNewItem] = useState('');


    const [updateSelectItem, setUpdateSelectItem] = useState(false)

    const handleDocStatusCheckboxChange = (e) => {
        setCustomerData({
            ...customerData,
            docStatus: customerData.docStatus === 1 ? 0 : 1,
        })
    }


    const handleUpdateValue = (value) => {
        console.log(value)
        const newValue = (typeof value === 'object') ? value?.name : value;
        console.log(newValue)
        setCustomerData({ ...customerData, supplier: newValue });
    };




    return (
        <>

            <Siderbar />


            {isLoading &&
                <LoadingPage
                    msg='Creating Purchase Invoice'
                />}

            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">New Purchase Invoice</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>
                                    <form onSubmit={handleAddSupplier} method="post" className="row g-3 needs-validation">

                                        <div className='col-12 mb-4'>
                                            <SearchSelect
                                                cusList={cusList}
                                                handleUpdateValue={handleUpdateValue}
                                                name="Supplier"
                                                handleAdd={(updatedValue) => {

                                                    // console.log('=---------fireing', updatedValue)
                                                    addNewSupplier({ supplierName: updatedValue })

                                                }}
                                            />
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
                                            updateSelectItem={updateSelectItem}
                                            customerData={customerData}
                                            handleSupplierChange={handleSupplierChange}
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

const DataTable = ({ head, itemList, addNewItem, removeList, handleItemChange, updateSelectItem, customerData, handleSupplierChange }) => {


    const [totalAmount, setTotalAmount] = useState(0)
    const [totalQuan, setTotalQuan] = useState(1)

    useEffect(() => {
        // console.log(itemList)
        setTotalAmount(itemList.reduce((total, item) => total + item.rate * item.quantity, 0))
        setTotalQuan(itemList.reduce((total, item) => {
            if (parseInt(total) + parseInt(item.quantity) < 10) {
                return (total + item.quantity)
            } else {
                return parseFloat(total) + parseFloat(item.quantity)
            }
        }, 0))
    }, [itemList])


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
                                                    updateSelectItem={updateSelectItem}
                                                    handleItemChange={handleItemChange}
                                                    customerData={customerData}
                                                    handleSupplierChange={handleSupplierChange}
                                                />
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0px 20px' }}>
                            <button className="btn btn-primary new-row login-btn" style={{ margin: '0px' }} type="button" onClick={() => addNewItem()} >New Row</button>
                            <div style={{}}>
                                <li>Total Quantity : {totalQuan}</li>
                                <li>Total Amount :  {totalAmount}</li>
                            </div>
                        </div> */}
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
            </div>
            <br />

        </div>
    );
};

const TableDataList = ({ item, removeList, handleItemChange, updateSelectItem, customerData, handleSupplierChange }) => {
    const [itemOptionList, setItemOptionList] = useState([]);
    const router = useRouter()

    const [cusList, setCusList] = useState([])

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

    function newItemUpdate(val) {
        // if(typeof val === 'object' && val !== null){

        // }
        const newItem = {
            ...item,
            itemCode: (typeof val === 'object' && val !== null) && val?.value || val
        };


        handleItemChange(newItem)

    }


    const handleItemNameChange = async (proName) => {

        if (!proName) {
            return
        }
        else {
            const selectedOption = itemOptionList.find((option) => option.item_code === proName?.value || '');

            // if(item.value||item.label)

            const supplier_price = await handleItemPrice(proName.value)

            if (supplier_price) {

                if (selectedOption) {
                    console.log(selectedOption)
                    const newItem = {
                        ...item,
                        itemCode: selectedOption.item_code,
                        rate: supplier_price,
                        quantity: 1
                    };
                    console.log(newItem)
                    handleItemChange(newItem);
                }
            }
            else {
                console.log(selectedOption)
                if (selectedOption) {
                    const newItem = {
                        ...item,
                        itemCode: selectedOption.item_code,
                        rate: 0,
                        quantity: 1
                    };
                    handleItemChange(newItem);
                }
            }
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
                alert("Login Expired")
                router.push('/')
            }
            else {
                handleError(err)
            }
            setItemOptionList([])
        }
    }

    useEffect(() => {
        fetchItemList();
        fetchSupplier()
    }, [updateSelectItem]);


    const [openDialog, setOpenDialog] = useState(false);
    // const [dialogItem, setDialogItem] = useState('');
    // const [dialogSupplier, setDialogSupplier] = useState('');
    // const [newItem, setNewItem] = useState('')
    const authHeader = getAuthHeader();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const handleNewItem = async (e) => {
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Item';

        const requestData = {
            data: {
                item_name: item.itemCode,
                item_group: 'Products',
                stock_uom: 'Unit',
                is_stock_item: '1',
                supplier_items: [{
                    supplier: customerData.supplier,
                }]
            },

        };
        setOnlyItemNames([
            ...onlyItemNames,
            {

                uid: item.uid,
                item_name: item.itemCode
            }])

        try {
            const response = await axios.post(apiUrl, requestData, authHeader);
            // console.log(response)
            if (response.statusText === 'OK') {

                alert('New Item Added');
                const newItem = {
                    ...item,
                    itemCode: response.data.data.name,
                };
                handleItemChange(newItem);

            }
        } catch (error) {
            handleError(error)
            console.error('API Error:', error);

        }
    }
    const handleSubmitDialog = (e) => {
        handleNewItem(e)
        handleCloseDialog();
    };


    const [onlyItemNames, setOnlyItemNames] = useState([{
        uid: '',
        item_name: ''
    }])



    return (
        <tr className="table-row table-row--chris">
            <td data-column="Supplier" className="table-row__td">
                <Autocomplete
                    value={
                        itemOptionList
                            ? (
                                itemOptionList.find(option => option.item_code === item?.itemCode)
                                    ?
                                    `${itemOptionList.find(option => option.item_code === item?.itemCode)?.item_name ?? ''} - ${item?.itemCode ?? ''}`
                                    : item?.itemCode ?? ''
                            )
                            : item?.itemCode ?? ''
                    }

                    onChange={(event, newValue) => handleItemNameChange(newValue)}

                    options={[
                        { label: '', value: 'add_new_item' },
                        ...itemOptionList.map((option) => ({
                            label: `${(option.item_name || onlyItemNames.length > 0 && onlyItemNames.map((f) => f.uid == item?.uid))} - ${option.item_code}`,
                            value: option.item_code,
                        })),

                    ]}

                    renderOption={(optionProps, option) => (
                        <li {...optionProps}>
                            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>

                                {option.value === 'add_new_item' ? (

                                    <Button onClick={() => handleOpenDialog()}>Add New Item +</Button>

                                )
                                    :
                                    (<span>{option.label}</span>)
                                }
                            </div>
                        </li>
                    )}

                    renderInput={(params) => <TextField {...params} label="Select Item" id="outlined-size-small" size='small' />}
                />
            </td>


            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{ style: { minWidth: 400 } }} // Adjust the minWidth as needed
            >
                <DialogTitle>New Item with Supplier</DialogTitle>
                <DialogContent>


                    <div className="col-12 mb-4">
                        {/* <label htmlFor="itemName" className="form-label">Item Name</label> */}
                        <input
                            type="text"
                            name="itemName"
                            className="form-control"
                            id="itemName"
                            // value={item.itemCode}
                            onChange={(e) => {

                                newItemUpdate(e.target.value)
                            }}
                            placeholder='Item Name'
                        />
                        <br />
                        <Autocomplete
                            value={customerData.supplier}
                            onChange={(event, newValue) => handleSupplierChange(newValue)}
                            options={cusList.map((option) => option.name)}
                            renderInput={(params) => <TextField {...params} label="Select Supplier" id="outlined-size-small" size='small' />}

                        />
                    </div>

                    <div className='d-flex' style={{ alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
                        <button type="button" className="btn btn-primary" onClick={handleSubmitDialog}>Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>Cancel</button>
                    </div>

                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>


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
                    <p className="table-row__name">{(isNaN(item.rate) ? 0 : item.rate) * (isNaN(item.quantity) ? 0 : item.quantity)}</p>
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








{/* <div className="col-4" style={{ zIndex: 2000 }}>




                                            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                Create New Item
                                            </button> 


                                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: 2000, background: '#00000021' }}>
                                                <div className="modal-dialog" style={{ zIndex: 2000 }}>
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="exampleModalLabel">New Item</h5>
                                                            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> 
                                                        </div>
                                                        <div className="modal-body">


                                                            <div className="col-12 mb-4">
                                                                <label htmlFor="itemName" className="form-label">Item Name</label>
                                                                <input
                                                                    type="text"
                                                                    name="itemName"
                                                                    className="form-control"
                                                                    id="itemName"
                                                                    value={newItem}
                                                                    onChange={(e) => setNewItem(e.target.value)}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="button" className="btn btn-primary" onClick={(e) => handleNewItem(e)} data-bs-dismiss="modal">New Item</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}


{/**  // <div className="col-12">
    //     <label htmlFor="supplier" className="form-label">Supplier</label>
    //     <div className="has-validation">
    //         <select
    //             name="supplier"
    //             className="form-select"
    //             id="supplier"
    //             required
    //             value={customerData.supplier}
    //             onChange={handleCustomerDataChange}
    //         >
    //             <option value="">Select a supplier</option>
    //             {
    //                 cusList.length > 0 && cusList.map((item, index) => {
    //                     return (
    //                         <option value={item.name} key={index}>{item.name}</option>
    //                     )
    //                 })
    //             }
    //         </select>
    //         <div className="invalid-feedback">Please select a supplier.</div>
    //     </div>
    // </div>
*/}


// const handleNewItem = async (e) => {
//     e.preventDefault();

//     const apiUrl = 'https://tgc67.online/api/resource/Item';

//     const requestData = {
//         data: {
//             item_name: newItem,
//             item_group: 'Products',
//             stock_uom: 'Unit',
//             is_stock_item: '1',
//             supplier_items: [{
//                 supplier: customerData.supplier,
//             }]
//         },
//     };

//     try {
//         const response = await axios.post(apiUrl, requestData, authHeader);

//         if (response.statusText === 'OK') {
//             alert('New Item Added');
//             setNewItem('')
//             setUpdateSelectItem(!updateSelectItem)

//             //  console.log(response.data.data.item_code)

//             const newItem = {
//                 uid: uid(),
//                 itemCode: response.data.data.item_code,
//                 quantity: 1,
//                 rate: 0,
//             };
//             const updatedItems = [...customerData.items];
//             updatedItems[updatedItems.length - 1] = newItem;
//             setCustomerData({
//                 ...customerData,
//                 items: updatedItems,
//             });

//         }
//     } catch (error) {
//         handleError(error)
//         console.error('API Error:', error);
//         //  if (error.response.status === 403) {
//         //      alert("Login Expired")
//         //      route.push('/')
//         //  }
//         //  else {
//         //      handleError(error)
//         //  }
//     }
// }
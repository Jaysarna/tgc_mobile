import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { getAuthHeader } from '@/helpers/Header';
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
    const [journalEntry, setJournalEntry] = useState({
        entryType: 'Journal Entry',
        type: '', // Initialize with an empty string
        postingDate: new Date().toISOString().substr(0, 10), // Set to today's date
        referenceNumber: '',
        amount: 0,
        referenceDate: new Date().toISOString().substr(0, 10), // Set to today's date,,
        // dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10), // Set dueDate 10 days ahead of postingDate
        items: [{
            uid: uid(),
            account: '',
            debit: 0,
            credit: 0

        },]
    });

    const [total, setTotal] = useState({
        credit: 0,
        debit: 0
    })


    const getTotal = (property) => {
        return journalEntry.items.reduce((total, item) => total + item[property], 0);
    };




    const addNewItem = () => {
        const newItem = {
            uid: uid(),
            account: '',
            debit: 0,
            credit: 0
        };
        // Create a copy of the current items array
        const updatedItems = [...journalEntry.items];

        // Add the new item to the copy
        updatedItems.push(newItem);

        // Update the journalEntry state with the modified items array
        setJournalEntry({
            ...journalEntry,
            items: updatedItems,
        });

    };

    const removeList = (accountToFilter) => {
        // console.log(accountToFilter)

        const filteredItems = journalEntry.items.filter(item => item.uid !== accountToFilter);

        // Update the journalEntry state with the filtered array
        setJournalEntry({
            ...journalEntry,
            items: filteredItems,
        });
        // console.log(journalEntry.items)
    };


    function handleItemChange(updatedItem) {
        // Update the item in journalEntry.items using the updatedItem data
        const totalDebit = getTotal('debit');
        const totalCredit = getTotal('credit');
        setTotal({
            credit: totalCredit,
            debit: totalDebit
        })


        const updatedItems2 = journalEntry.items.map((item) => {
            if (item.uid === updatedItem.uid) {
                return updatedItem;
            }
            return item;
        });
        setJournalEntry({
            ...journalEntry,
            items: updatedItems2
        });


    };


    const handleAmount = (e) => {
        setJournalEntry({
            ...journalEntry,
            amount: e.target.value,
        });
    }


    const [cusList, setCusList] = useState([])

    const route = useRouter();

    const handlejournalEntryChange = (e) => {
        // const { name, value, type, checked } = e.target;
        // setJournalEntry({
        //     ...journalEntry,
        //     [name]: type === 'checkbox' ? checked : value,
        // });
        // console.log(e.target.value)
        setJournalEntry({
            ...journalEntry,
            type: e.target.value,
        });
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        const authHeader = getAuthHeader()



        const apiUrl = 'https://tgc67.online/api/resource/Journal%20Entry';


        const add = [
            {
                "account": 'Cash - TGC',
                "debit_in_account_currency": journalEntry.amount,
                "credit_in_account_currency": 0,
            },
            {
                "account": 'Capital Stock - TGC',
                "debit_in_account_currency": 0,
                "credit_in_account_currency": journalEntry.amount,
            }
        ];

        const remove = [
            {
                "account": 'Cash - TGC',
                "credit_in_account_currency": journalEntry.amount,
                "debit_in_account_currency": 0,
            },
            {
                "account": 'Capital Stock - TGC',
                "credit_in_account_currency": 0,
                "debit_in_account_currency": journalEntry.amount,
            }
        ];



        const requestData = {

            data: {
                "entry_type": 'Journal Entry',
                "cheque_no": journalEntry.referenceNumber,
                // "cheque_date": journalEntry.referenceDate,
                "docstatus": "1",
                "posting_date": journalEntry.postingDate,
                // "accounts": buildItemsArray(journalEntry.items),
                "accounts": journalEntry.type === "Add" ? add : remove,

            },
        };
        // console.log(requestData)
        try {
            const response = await axios.post(apiUrl, requestData, authHeader)


            if (response.statusText === 'OK') {
                if(journalEntry.type==='Add'){
                    alert("Money Added Successfully")
                }
                else{
                    alert("Money Removed Successfully")
                }
                
                route.push('/main')
            }
            // console.log('API Response:', response.statusText)
        } catch (error) {


            if (error.response.status === 403) {

                sessionStorage.clear()
            }
            else {
                handleError(error)
            }
        }
    }



    const handleReference = (e) => {
        setJournalEntry({
            ...journalEntry,
            referenceNumber: e.target.value
        })
    }


    const handlePostingDateChange = (e) => {
        setJournalEntry({
            ...journalEntry,
            postingDate: e.target.value,
        });
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
                                        <h5 className="card-title text-center pb-0 fs-4"> Add/Remove Money</h5>
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
                                            <label htmlFor="entryType" className="form-label">Entry Type</label>
                                            <div className="has-validation">
                                                <select
                                                    name="type"
                                                    className="form-select"
                                                    id="type"
                                                    required
                                                    value={journalEntry.type}
                                                    onChange={handlejournalEntryChange}
                                                >
                                                    <option value="">Select a Entry Type</option>
                                                    <option value="Add">Add Money</option>
                                                    <option value="Remove">Remove Money</option>
                                                </select>
                                                <div className="invalid-feedback">Please enter the Entry Type</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="postingDate" className="form-label">Entry Date</label>
                                            <input
                                                type="date"
                                                name="postingDate"
                                                className="form-control"
                                                id="postingDate"
                                                value={journalEntry.postingDate}
                                                onChange={handlePostingDateChange}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="amount" className="form-label"> Amount</label>
                                            <input
                                                type="number"
                                                name="amount"
                                                className="form-control"
                                                id="amount"
                                                value={journalEntry.amount}
                                                onChange={handleAmount}
                                            />
                                        </div>


                                        <div className="col-12">
                                            <label htmlFor="referenceNumber" className="form-label">Reference Number or Note</label>
                                            <input
                                                type="text"
                                                name="referenceNumber"
                                                className="form-control"
                                                id="referenceNumber"
                                                value={journalEntry.referenceNumber}
                                                onChange={handleReference}
                                            />
                                        </div>







                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Create Journal</button>
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


const DataTable = ({ head, itemList, addNewItem, removeList, handleItemChange, total }) => {
    const [totalDebit, setTotalDebit] = useState(0)
    const [totalCredit, setTotalCredit] = useState(0)

    useEffect(() => {
        // console.log(itemList)
        setTotalDebit(itemList.reduce((total, item) => total + item.debit, 0))
        setTotalCredit(itemList.reduce((total, item) => total + item.credit, 0))
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
                                                    <th className="table__th" scope='col' key={index}>{item}</th>
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
                    </div>
                </div>
                <br />
            </div>
            <div className="row mt-4" style={{ marginLeft: '0px', marginRight: '0px', padding: '10px' }}>
                <div className="col-5 mb-4">
                    <label htmlFor="total debit" className="form-label">Total Debit </label>
                    <input
                        type="number"
                        className='form-control'
                        value={totalDebit}
                        placeholder="Debit"
                        readOnly
                    />
                </div>
                <div className="col-5 mb-4">
                    <label htmlFor="total Credit" className="form-label">Total Credit</label>
                    <input
                        type="number"
                        className='form-control'
                        value={totalCredit}
                        placeholder="Credit"
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

    const handleaccountChange = (e) => {
        const selectedItemId = e.target.value;
        const selectedOption = itemOptionList.find((option) => option.name === selectedItemId);

        if (selectedOption) {
            const newItem = {
                ...item,
                account: selectedOption.name, // Set the item name based on the selected option

            };
            handleItemChange(newItem);
        }
    };

    const handleCredit = (e) => {

        const newItem = {
            ...item,
            credit: parseFloat(e.target.value),
        };
        handleItemChange(newItem);
    };

    const handleDebit = (e) => {
        const newItem = {
            ...item,
            debit: parseFloat(e.target.value),
        };
        handleItemChange(newItem);
    };


    async function fetchAccount() {
        const authHeader = getAuthHeader()


        try {
            const res = await axios.get('https://tgc67.online/api/resource/Account?limit_page_length=100&limit=100&&filters=[["is_group", "=", "0"]]', authHeader)
            // console.log(res.data.data)
            setItemOptionList(res.data.data)
        }
        catch (err) {
            console.log(err)
            setItemOptionList([])

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
        //    let salesItem= localStorage.getItem('saleItem')
        fetchAccount();
        // handleItemChange(salesItem)
    }, []);

    return (
        <tr className="table-row table-row--chris">
            <td data-column="Policy" className="table-row__td" style={{ maxWidth: '200px', width: '40%' }}>
                <div className="table-row-input">
                    <select
                        value={item.account}
                        onChange={handleaccountChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Any Account</option>
                        {/* {itemOptionList.length > 0 && itemOptionList.map((item) => (
                            <option value={item.name} key={item.name}>
                                {item.name}
                            </option>
                        ))} */}

                        <option>Cash - TGC</option>
                        <option>Capital Stock - TGC</option>
                    </select>
                </div>
            </td>

            <td data-column="debit" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.debit}
                        onChange={handleDebit}
                        placeholder="Debit"
                        readOnly={item.credit > 0}
                    />
                </div>
            </td>
            <td data-column="credit" className="table-row__td" style={{ maxWidth: '200px', width: '15%' }}>
                <div className="table-row-input" style={{ maxWidth: '200px' }}>
                    <input
                        type="number"
                        value={item.credit}
                        onChange={handleCredit}
                        placeholder="Credit"
                        readOnly={item.debit > 0}
                    />
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


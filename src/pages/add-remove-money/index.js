import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { getAuthHeader } from '@/helpers/Header';
import { uid } from 'uid';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { post } from '@/configs/apiUtils';
import toast from 'react-hot-toast';



const Index = () => {
    return (
        <div>
            <AddRemoveForm />
        </div>
    );
}

export default withAuth(Index);



const AddRemoveForm = () => {

    const intialData = {
        entryType: 'Journal Entry',
        type: '',
        postingDate: new Date().toISOString().substr(0, 10),
        referenceNumber: '',
        amount: 0,
        referenceDate: new Date().toISOString().substr(0, 10),
        // dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10), // Set dueDate 10 days ahead of postingDate
        items: [{
            uid: uid(),
            account: '',
            debit: 0,
            credit: 0

        },]
    }

    const [journalEntry, setJournalEntry] = useState(intialData);

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

    const route = useRouter();

    const handlejournalEntryChange = (e) => {
        setJournalEntry({
            ...journalEntry,
            type: e.target.value,
        });
    };

    const handleAddMoney = async (e) => {
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
                "cheque_date": journalEntry.postingDate,
                "accounts": journalEntry.type === "Add" ? add : remove,

            },
        };
        // console.log(requestData)
        try {
            const response = await post(apiUrl, requestData)

            console.log(response)
            if (response?.data) {
                if (journalEntry.type === 'Add') {
                    toast.success("Money Added Successfully")
                }
                else {
                    toast.success("Money Removed Successfully")
                }
                setJournalEntry(intialData)
            }

            if (response.statusText === 'OK') {
                if (journalEntry.type === 'Add') {
                    alert("Money Added Successfully")
                }
                else {
                    alert("Money Removed Successfully")
                }

                route.push('/main')
            }
            // console.log('API Response:', response.statusText)
        } catch (error) {


            if (error.response?.status === 403) {

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

                                    <form onSubmit={handleAddMoney} method="post" className="row g-3 needs-validation">
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
                                            <textarea
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





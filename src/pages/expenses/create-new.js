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
        items: [{
            uid: uid(),
            account: '',
            debit: 0,
            credit: 0

        },]
    }

    const [journalEntry, setJournalEntry] = useState(intialData);


    const getTotal = (property) => {
        return journalEntry.items.reduce((total, item) => total + item[property], 0);
    };




    const handleAmount = (e) => {
        setJournalEntry({
            ...journalEntry,
            amount: e.target.value,
        });
    }

    const route = useRouter();


    const handleAddMoney = async (e) => {
        e.preventDefault();

        const apiUrl = 'https://tgc67.online/api/resource/Journal%20Entry';

        // const add = [
        //     {
        //         "account": 'Cash - TGC',
        //         "debit_in_account_currency": journalEntry.amount,
        //         "credit_in_account_currency": 0,
        //     },
        //     {
        //         "account": 'Capital Stock - TGC',
        //         "debit_in_account_currency": 0,
        //         "credit_in_account_currency": journalEntry.amount,
        //     }
        // ];

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
                "accounts": remove,

            },
        };
        // console.log(requestData)
        try {
            const response = await post(apiUrl, requestData)

            console.log(response)
            if (response?.data) {

                toast.success("Expense Added Successfully")

                setJournalEntry(intialData)
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
                                        <h5 className="card-title text-center pb-0 fs-4"> Add Expense</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddMoney} method="post" className="row g-3 needs-validation">

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
                                            <button className="btn btn-primary login-btn" type="submit">Add Expense</button>
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





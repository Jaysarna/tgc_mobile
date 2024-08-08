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
import { LoadingPage } from '@/helpers/Loader';



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

    const [setExpenses, setJournalEntry] = useState(intialData);
    const [isLoading, setLoading] = useState(false)




    const handleAmount = (e) => {
        setJournalEntry({
            ...setExpenses,
            amount: e.target.value,
        });
    }

    const route = useRouter();


    const handleAddMoney = async (e) => {
        e.preventDefault();
        setLoading(true)
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
                "credit_in_account_currency": setExpenses.amount,
                "debit_in_account_currency": 0,
            },
            {
                "account": 'Capital Stock - TGC',
                "credit_in_account_currency": 0,
                "debit_in_account_currency": setExpenses.amount,
            }
        ];



        const requestData = {

            data: {
                "entry_type": 'Journal Entry',
                "cheque_no": setExpenses.referenceNumber,
                // "cheque_date": journalEntry.referenceDate,
                "docstatus": "1",

                "posting_date": setExpenses.postingDate,
                "cheque_date": setExpenses.postingDate,
                "accounts": remove,

            },
        };
        // console.log(requestData)
        try {
            const response = await post(apiUrl, requestData)

            if (response?.data) {

                toast.success("Expense Added Successfully")

                setJournalEntry(intialData)
            }

            // console.log('API Response:', response.statusText)
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }



    const handleReference = (e) => {
        setJournalEntry({
            ...setExpenses,
            referenceNumber: e.target.value
        })
    }


    const handlePostingDateChange = (e) => {
        setJournalEntry({
            ...setExpenses,
            postingDate: e.target.value,
        });
    };




    return (
        <>
            {isLoading &&
                <LoadingPage
                    msg='Adding...'
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
                                                value={setExpenses.postingDate}
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
                                                value={setExpenses.amount}
                                                onChange={handleAmount}
                                            />
                                        </div>


                                        <div className="col-12">
                                            <label htmlFor="referenceNumber" className="form-label">Reference Number or Note</label>
                                            <textarea
                                                name="referenceNumber"
                                                className="form-control"
                                                id="referenceNumber"
                                                value={setExpenses.referenceNumber}
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





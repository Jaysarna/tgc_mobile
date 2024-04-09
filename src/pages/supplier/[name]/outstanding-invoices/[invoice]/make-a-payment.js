import { fetchOutstanding } from '@/customhook/outstanding';
import withAuth from '@/customhook/withAuth';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import Siderbar from '@/helpers/siderbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleError } from '@/Api/showError';


const MakeAPayment = () => {

    const router = useRouter();
    const { name, invoice } = router.query;
    // console.log(name)

    async function fetchCSData(nme) {
        if (nme) {
            const authHeader = getAuthHeader();
            try {
                const response = await axios.get(`https://tgc67.online/api/resource/Supplier/${nme}`, authHeader)
                // console.log(response.data.data)
                if (response.status === 200) {
                    const customer = response.data.data;
                    // console.log(customer)
                    setPaymentData({
                        ...paymentData,
                        party: customer.name
                    })
                }
            }
            catch (err) {
                console.log(err)
                if (err.response.status === 403) {
                    alert("Login Expired")
                    router.push('/')
                }
                else {
                    handleError(err)
                }
            }
        }

    }


    const [paymentData, setPaymentData] = useState({
        posting_date: '2023-11-10',
        payment_type: 'Pay',
        party_type: 'Supplier',
        party: '',
        paid_amount: 0,
        paymentMethod: '',
        paymentDate: new Date().toISOString().substr(0, 10),
    });

    const [cusList, setCusList] = useState([])

    const handlePaymentDataChange = (e) => {
        const { name, value, type } = e.target;

        // Clear the input values in the table when the "Paid Amount" changes
        const clearedData = tableData.map((item) => ({ ...item, input: value }));
        setTableData(clearedData);
        const grandTotal = clearedData.reduce((total, item) => total + parseFloat(item.grand_total || 0), 0);
        if (value > grandTotal) {
            alert("Warning: Paid amount exceeds total amount.");
            // You can add additional handling or UI updates here if needed
        }
        // Update the "Paid Amount" in the paymentData
        setPaymentData((prevPaymentData) => ({
            ...prevPaymentData,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };



    const handleParty = (e) => {
        const { name, value } = e.target;
        setPaymentData({
            ...paymentData,
            party: value,
        });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        // console.log(paymentData)
        // Create an array to store references with allocated amounts
        const references = tableData.map((item, index) => ({
            reference_doctype: "Purchase Invoice",
            reference_name: item.name,
            total_amount: item.grand_total,
            outstanding_amount: item.outstanding_amount,
            allocated_amount: parseFloat(item.input || 0),
        }));


        // Prepare the payment data
        const paymentData1 = {
            data: {
                posting_date: paymentData.paymentDate,
                payment_type: paymentData.payment_type,
                party_type: paymentData.party_type,
                party: paymentData.party,
                paid_amount: paymentData.paid_amount,
                mode_of_payment: "Cash",
                paid_from: "Cash - TGC",
                received_amount: paymentData.paid_amount,
                source_exchange_rate: 1,
                references: references,
                docstatus: '1'
            },
        };
        const authHeader = getAuthHeader();
        console.log(paymentData1)
        try {
            const res = await axios.post(
                'https://tgc67.online/api/resource/Payment%20Entry',
                paymentData1,
                authHeader
            );
            // console.log(res)
            if (res.status === 200) {
                alert(`${res.data.data.name} Made a Payment`);
                router.push('/supplier')
            }

        } catch (err) {
            console.log(err.response.data);
            if (err.response.status === 403) {
                alert("Login Expired")
                router.push('/')
            }
            else {
                handleError(err)
            }
        }

    };




    const [tableData, setTableData] = useState([])

    async function fetchOutstanding(name) {
        const authHeader = getAuthHeader();
        const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice';
        const filters = [
            ['supplier', '=', name],  // Update to use the provided name parameter
            ['docstatus', '=', '1'],
            ['status', '!=', 'Cancel']
        ];
        const fields = ['name', 'supplier', 'grand_total', 'outstanding_amount'];

        // Construct the dynamic URL
        const url = `${apiUrl}?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(fields))}`;
        var requestOptions = {
            method: 'GET',
            headers: authHeader.headers,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result.data)
                if (result.data) {
                    // Filter the data based on the invoice value
                    const filteredData = result.data.filter((item) => item.name === invoice);

                    setTableData(filteredData);
                }

            })
            .catch(error => {
                console.log('error', error)
                setTableData([])
                if (error.response.status === 403) {
                    alert("Login Expired")
                    router.push('/')
                }
                else {
                    handleError(error)
                }
            });
    }


    const handleDelete = (index) => {
        // Copy the current table data to avoid mutating the state directly
        const updatedData = [...tableData];

        // Get the name of the item to be deleted
        const deletedItemName = updatedData[index].name;

        // Remove the item from the copied data
        updatedData.splice(index, 1);

        // Update the state with the new data
        setTableData(updatedData);

        // Optionally, you can perform additional logic related to the deletion
        // console.log(`Deleted outstanding amount for invoice: ${deletedItemName}`);
    };



    const distributeAmount = (amount, tableData) => {
        const updatedData = [...tableData];
        let remainingAmount = parseFloat(amount);

        for (let i = 0; i < updatedData.length; i++) {
            const outstandingAmount = parseFloat(updatedData[i].outstanding_amount);
            let distributedAmount = remainingAmount;

            if (distributedAmount > outstandingAmount) {
                distributedAmount = outstandingAmount;
                alert('Amout Exceeded')
            }

            updatedData[i].input = distributedAmount > 0 ? distributedAmount.toFixed(2) : '0.00';

            remainingAmount -= distributedAmount;

            if (remainingAmount <= 0) break;
        }

        return updatedData;
    };

    const handleInputChange = (index, value) => {
        // console.log('fired')
        setTableData((prevData) => {
            const updatedData = [...prevData];
            const outstandingAmount = updatedData[index].grand_total;


            if (parseFloat(value) > outstandingAmount) {
                alert("Warning: Paid amount exceed total amount.");
                // You can also add further UI/UX handling here if needed
            }

            // Update the input value in the specific row
            updatedData[index].input = value;

            // Update the paid_amount in paymentData based on the input changes
            const totalPaidAmount = updatedData.reduce((total, item) => total + parseFloat(item.input || 0), 0);
            setPaymentData({
                ...paymentData,
                paid_amount: totalPaidAmount,
            });

            return updatedData;
        });
    };



    useEffect(() => {
        if (name && invoice) {
            // Fetch outstanding amounts for a specific invoice
            fetchOutstanding(name, invoice);

            // Fetch customer data for the payment form
            fetchCSData(name);

            // Filter the tableData based on the invoice value

        }
    }, [name, invoice]);

    return (
        <>
            <Siderbar />
            <div>
                <div className="col-lg-12 itemOuter mt-3">

                    <div className="rown">
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <h4 className="text-center p-4">Make a Payment</h4>
                                <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                    router.push('/supplier')
                                }}>
                                    <div className="btn btn-primary iconOuter cancelIcon"  >
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handlePaymentSubmit} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="posting_date" className="form-label">Posting Date</label>
                                            <div className="has-validation">
                                                <input
                                                    type="date"
                                                    name="posting_date"
                                                    className="form-control"
                                                    id="posting_date"
                                                    required
                                                    value={paymentData.posting_date}
                                                    onChange={handlePaymentDataChange}
                                                />
                                                <div className="invalid-feedback">Please select the posting date.</div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="paymentMethod" className="form-label">Payment Type</label>
                                            {/* <select
                                                name="paymentMethod"
                                                className="form-select"
                                                id="paymentMethod"
                                                required
                                                value={paymentData.paymentMethod}
                                                onChange={handlePaymentDataChange}
                                            >
                                                <option value="">Select a payment method</option>
                                                <option value="Credit Card">Recieve</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Bank Transfer">Bank Transfer</option>
                                            </select> */}
                                            <input
                                                type="text"
                                                name="payment_type"
                                                className="form-control"
                                                id="payment_type"
                                                required
                                                value={paymentData.payment_type}
                                                onChange={handlePaymentDataChange}
                                            />
                                        </div>

                                        <div className="col-12 ">
                                            <label htmlFor="party_type" className="form-label">Party Type</label>
                                            <input
                                                type="text"
                                                name="party_type"
                                                className="form-control"
                                                id="party_type"
                                                value={paymentData.party_type}
                                                onChange={handlePaymentDataChange}

                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="party" className="form-label">Party</label>
                                            <input
                                                type="text"
                                                name="party"
                                                className="form-control"
                                                id="party"
                                                value={paymentData.party}
                                                onChange={handlePaymentDataChange}

                                            />

                                        </div>

                                        <div className="col-12 ">
                                            <label htmlFor="paid_amount" className="form-label">Paid Amount</label>
                                            <input
                                                type="number"
                                                name="paid_amount"
                                                className="form-control"
                                                id="paid_amount"
                                                required
                                                value={paymentData.paid_amount}
                                                onChange={handlePaymentDataChange}
                                            />
                                        </div>

                                        <DataTable
                                            name={name}
                                            handleInputChange={handleInputChange}
                                            tableData={tableData}
                                            handleDelete={handleDelete}
                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Make Payment</button>
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
}

export default withAuth(MakeAPayment);


const DataTable = ({ tableData, head, handleInputChange, handleDelete }) => {

    const router = useRouter()
    // const { name } = route.query;
    // console.log(name)


    // useEffect(() => {

    // }, [name]);


    return (
        <>
            <div className='table-vw-size' style={{ width: '100%' }}>
                {/* <div className="row row--top-40">
                    <div className="col-md-12"></div>
                </div> */}
                <div className="row row--top-20">
                    <div className="col-md-12">
                        <div className="table-container">

                            <table className="w-100">
                                <thead className="table__thead">
                                    <tr className="tbl-head-bgvw">

                                        <th className="table__th">Supplier Name</th>
                                        <th className="table__th">
                                            Outstanding Amount <i className="bi bi-arrow-down"></i>
                                        </th>
                                        {/* <th className="table__th">Outstanding Amount</th> */}
                                        <th className="table__th">Grand Total</th>
                                        <th className="table__th">Allocated (CAD)</th>
                                        {/* <th className="table__th">Teams</th> */}
                                        {/* <th className="table__th"></th>
                                        <th className="table__th"></th> */}
                                    </tr>
                                </thead>
                                <tbody className="table__tbody">


                                    {
                                        tableData.length > 0 && tableData.map((item, index) => {
                                            return (
                                                <TableDataList
                                                    key={index}
                                                    customer={item.customer}
                                                    amount={item.outstanding_amount}
                                                    total={item.grand_total}
                                                    name={item.name}
                                                    input={item.input}
                                                    index={index}
                                                    handleInputChange={handleInputChange}
                                                    handleDelete={handleDelete}
                                                />
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            {/* <Pagination /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const TableDataList = ({ amount, name, customer, total, input, index, handleInputChange, handleDelete }) => {

    const route = useRouter()
    async function handleEdit(name) {
        route.push('/customer/' + name + '/edit')
    }

    return (
        <>
            <tr className="table-row table-row--chris">
                {/* <td className="table-row__td">
                        <input
                          id=""
                          type="checkbox"
                          className="table__select-row"
                        />
                      </td> */}
                <td className="table-row__td">
                    {/* <div className="table-row__img"></div> */}
                    <div className="table-row__info">
                        <p className="table-row__name">{name}</p>
                        <span className="table-row__small">{customer}</span>
                    </div>
                </td>
                <td data-column="Outstanding Amount" className="table-row__td">
                    {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
                    <p className="table-row__status">
                        <i className="bi bi-currency-dollar"></i> {amount}
                    </p>
                </td>
                <td data-column="Outstanding Amount" className="table-row__td">
                    {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
                    <p className="table-row__status">
                        <i className="bi bi-currency-dollar"></i> {total}
                    </p>
                </td>
                <td data-column="Outstanding Amount" className="table-row__td">
                    {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
                    <p className="table-row__status">
                        <input
                            type="text"
                            name="customerName"
                            className="form-control"
                            id="customerName"
                            required
                            value={input}
                            onChange={(e) => handleInputChange(index, e.target.value)}

                        />
                    </p>
                </td>
                <td data-column="Outstanding Amount" className="table-row__td">
                    {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
                    <p className="table-row__status">
                        <DeleteIcon onClick={() => handleDelete(index)}></DeleteIcon>
                    </p>
                </td>
            </tr>
        </>
    );
};  
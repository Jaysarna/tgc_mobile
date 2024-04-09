import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { getAuthHeader } from '@/helpers/Header';
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
    const [customerData, setCustomerData] = useState({
        customerName: '', // Initialize with an empty string
        postingDate: new Date().toISOString().substr(0, 10), // Set to today's date
        dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10), // Set dueDate 10 days ahead of postingDate
        items: []
    });


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
        // User is authenticated, proceed to add the item
        const apiUrl = 'https://tgc67.online/api/resource/Sales Invocie';

        const requestData = {
            data: {
                customer_name: customerData.customerName,
                posting_date: customerData.postingDate,
                due_date: customerData.dueDate,
                items: customerData.items,
            },
        };
        try {
            const response = await axios.post(apiUrl, requestData, authHeader)

            if (response.statusText === 'OK') {
                alert("Customer Added Successfully")
                route.push('/main')
            }
            // console.log('API Response:', response.statusText)
        } catch (error) {
            if (err.response.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
            console.error('API Error:', error);
        }
    };

    return (
        <>
            <Siderbar />
            <div>
                <div className="col-lg-12 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown" style={{ overflow: 'hidden' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: 'relative' }}>
                                <div className="card-body">

                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4"> Sales Invoices</h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon"  >
                                            <i class="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">
                                        <div className="col-12">
                                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    className="form-control"
                                                    id="customerName"
                                                    required
                                                    value={customerData.customerName}
                                                    onChange={handleCustomerDataChange}
                                                />
                                                <div className="invalid-feedback">Please enter the customer name.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="postingDate" className="form-label">Posting Date</label>
                                            <input
                                                type="text"
                                                name="postingDate"
                                                className="form-control"
                                                id="postingDate"
                                                disabled // Disabling the input field
                                                value={customerData.postingDate}
                                            />
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label htmlFor="dueDate" className="form-label">Due Date</label>
                                            <input
                                                type="text"
                                                name="dueDate"
                                                className="form-control"
                                                id="dueDate"
                                                disabled // Disabling the input field
                                                value={customerData.dueDate}
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
                                        />

                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Save</button>
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


const DataTable = ({ head, title }) => {

    const [countTable, setCountTable] = useState([{ "item": '1' }])

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
                                        countTable.map((item, index) => {
                                            return (
                                                <>
                                                    <TableDataList key={index} />
                                                </>
                                            )
                                        })
                                    }



                                </tbody>
                            </table>
                        </div>
                        <div style={{ width: '20%' }}>
                            <button className="btn btn-primary new-row login-btn" type="button" onClick={() => {
                                setCountTable([...countTable, { "item": '2' }])
                            }} >New Row</button>
                        </div>
                    </div>
                </div>
                <br />
            </div>
        </>
    );
};





const TableDataList = (props) => {
    const [item, setItem] = useState(''); // Initial state for item
    const [quantity, setQuantity] = useState(1); // Initial state for quantity

    // Function to update the item state
    const handleItemChange = (e) => {
        setItem(e.target.value);
    };

    // Function to update the quantity state
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    return (
        <>
            <tr className="table-row table-row--chris">
                <td data-column="Policy" className="table-row__td">
                    <div className="table-row-input">
                        <input
                            type="text"
                            value={item}
                            onChange={handleItemChange}
                            placeholder="Item"
                        />
                    </div>
                </td>
                <td data-column="Policy" className="table-row__td">
                    <div className="table-row-input">
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            step=".01"
                            placeholder="Quantity"
                        />
                    </div>
                </td>
                <td data-column="Destination" className="table-row__td">
                    $5898
                </td>
                <td className="table-row__td">
                    <div className="table-row__info" style={{ paddingLeft: '0px' }}>
                        <p className="table-row__name"></p>
                    </div>
                </td>
            </tr>
        </>
    );
}






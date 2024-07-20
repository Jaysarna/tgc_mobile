// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AddIcon, EditIcon } from '@/icons/actions';
import { Pagination } from '@/customhook/pagination';
import { handleError } from '@/Api/showError';
import { getAuthHeader } from '@/helpers/Header';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';




// ItemList Component
const ItemList = () => {
    const [tableData, setTableData] = useState([]);
    const router = useRouter();

    // async function fetchCsList() {
    //     try {
    //         const listRes = await axios.get('https://tgc67.online/api/method/supplier_outstanding');
    //         // console.log(listRes.data)
    //         setTableData(listRes.data.message);
    //     } catch (err) {
    //         console.log(err);
    //         if (err.response?.status === 403) {
    //             sessionStorage.clear()
    //             alert("Login Expired")
    //             router.push('/')
    //         }
    //         else {
    //             handleError(err)
    //         }
    //     }
    // }

    // useEffect(() => {
    //     fetchCsList();
    // }, []);

    return (
        <div>
            <Siderbar />
            <DataTable
            />
        </div>
    );
};

export default withAuth(ItemList);

// DataTable Component
const DataTable = () => {

    const [sample, setSample] = useState(0);

    const route = useRouter()

    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([])

    async function fetchCsList() {
        const authHeader = getAuthHeader();

        try {
            const listRes = await axios.get('https://tgc67.online/api/method/supplier_outstanding', authHeader);
            // console.log(listRes.data)
            setTableData(listRes.data.message);
        } catch (err) {
            setTableData([])
            console.log(err);
            if (err.response?.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(err)
            }
        }
    }

    useEffect(() => {
        fetchCsList();
    }, []);



    async function fetchSampleCustomerList() {
        const authHeader = getAuthHeader();

        try {
            const listRes = await axios.get('https://tgc67.online/api/method/supplier_with_samples', authHeader);
            // console.log(listRes.data)
            setSampleData(listRes.data.message);
        } catch (err) {
            console.log(err);
            if (err.response?.status === 403) {
                sessionStorage.clear()
            }
            else {
                handleError(err)
            }
        }
    }




    const handleSample = () => {
        if (sample === 0) {
            fetchSampleCustomerList();

            setSample(1)
        }
        else {
            fetchCsList();
            setSample(0)
        }
    }



    return (
        <div className='table-vw-size mbvw-tbl-scrl'>
            <div className="container row p-3">
                <h6 className="row__title col-md-3">
                    Supplier List<span className="span-user-clr">{tableData.length}</span>
                </h6>
                <div className="col-md-2">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            name="docStatusCheckbox"
                            className="form-check-input"
                            id="docStatusCheckbox"
                            checked={sample === 1}
                            onChange={handleSample}
                        />
                        <strong className="form-check-strong" htmlFor="docStatusCheckbox">
                            Sample
                        </strong>
                    </div>
                </div>
            </div>


            {!sample ? <table className="table">
                <thead className="table-light">
                    <tr>
                        <th className='table-head-fntsz'>Supplier Name</th>
                        <th className='table-head-fntsz'>Outstanding Amount</th>
                        <th className='table-head-fntsz'>New</th>
                        <th className='table-head-fntsz'>Edit </th>
                    </tr>
                </thead>
                {tableData.length > 0 ?
                    <tbody>

                        {tableData.map((item) => (
                            <TableDataList key={item[0]} name={item[0]} amount={item[1]} />
                        ))}

                    </tbody>
                    :
                    <tbody className='no-record-bdy'>
                        <h4>No Records Found</h4>
                    </tbody>
                }
            </table>

                : <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className='table-head-fntsz'>Supplier Name</th>
                            <th className='table-head-fntsz'>Label</th>

                        </tr>
                    </thead>
                    {sampleData.length > 0 ?
                        <tbody>

                            {sampleData.map((item) => (
                                <TableDataList2
                                    key={item[0]}
                                    name={item.supplier}
                                    invoices={item.invoices}
                                    amount="Sample"
                                />
                            ))}
                        </tbody>
                        :
                        <tbody className='no-record-bdy'>
                            <h4>No Records Found</h4>
                        </tbody>

                    }
                </table>}

            <Pagination />
        </div>
    );
};

const TableDataList = ({ amount, name }) => {
    const route = useRouter();

    const handleEdit = () => {
        route.push(`/supplier/${name}/edit`);
    };
    const handleOutstanding = () => {
        route.push(`/supplier/${name}/outstanding-invoices`);
    };

    const handlePayment = () => {
        route.push(`/supplier/${name}/recive-payment`);
    };

    return (
        <tr className="table-row table-row--chris">
            <td className="table-row__td d-flex">
                <div className="table-row__info" onClick={handleOutstanding} style={{ cursor: 'pointer' }}>
                    <p className="table-row__name">{name}</p>
                    <span className="table-row__small">Supplier</span>
                </div>
            </td>
            <td data-column="Outstanding Amount" className="table-row__td">
                <p className="table-row__status">
                    {amount}
                </p>
            </td>
            <td data-column="Create Button" className="table-row__td">
                <div className="">
                    <AddIcon className='plus-icon-btn' onClick={handlePayment} />
                </div>
            </td>
            <td data-column="Edit Button" className="table-row__td">
                <EditIcon onClick={handleEdit} />
            </td>
        </tr>
    );
};

// Pagination Component


const TableDataList2 = ({ amount, name, invoices }) => {
    const route = useRouter();

    const [isInvoice, setIsInvoice] = useState(false)



    return (
        <tr className="table-row table-row--chris">
            <td className="table-row__td d-flex">
                <div className="table-row__info">
                    <p className="table-row__name" onClick={() => setIsInvoice(!isInvoice)} style={{ cursor: 'pointer' }}>{name}</p>
                    {isInvoice && invoices.length > 0 ? invoices.map((list) => (
                        <InvoiceList
                            invoice={list.invoice}
                            itemList={list.item_list}
                            name={name}
                        />
                    )) :
                        null

                    }
                </div>
            </td>
            <td data-column="Outstanding Amount" className="table-row__td">
                <p className="table-row__status">
                    <i className="bi bi-currency-dollar"></i> {amount}
                </p>
            </td>

        </tr>
    );
};

const InvoiceList = ({ invoice, itemList, name }) => {

    const route = useRouter()
    const [isItemList, setIsItemList] = useState(false);


    const handleEdit = () => {
        route.push(`/supplier/${name}/sample-list/${invoice}/edit-sample-to-invoice`);
    };

    return (
        <>
            <div className='list-invoice '>
                <span
                    className='d-flex align-item-center btn btn-outline-primary customer-sample'

                >
                    {isItemList ? <ArrowDropUpIcon onClick={() => { setIsItemList(!isItemList) }} /> : <ArrowDropDownIcon onClick={() => { setIsItemList(!isItemList) }} />}
                    <li onClick={() => {
                        setIsItemList(!isItemList)
                    }
                    }

                        style={{ cursor: 'pointer', listStyle: 'none' }}
                    >{invoice}</li>

                    <h6 className='ml-2 mb-2' style={{ cursor: 'pointer' }} ><EditIcon onClick={handleEdit} /></h6>
                </span>

            </div>
            <div className="list-invoice-item ml-4">
                {
                    isItemList && itemList.length > 0 && itemList.map(item => (
                        <li className='sample-item-li'>{item}</li>
                    ))
                }
            </div>
        </>
    )
}
// Pagination Component

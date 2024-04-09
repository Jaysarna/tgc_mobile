import React, { useEffect, useState } from 'react';
import ListDesign from '@/helpers/ListDesign';
// import './customerList.module.css';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AddIcon } from '@/icons/actions';


const outstandingInvoices = () => {

    const router = useRouter();
    const { name } = router.query;


    const [tableData, setTableData] = useState([])




    async function fetchOutstanding(name) {
        const authHeader = getAuthHeader();
        const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice';
        const filters = [
            ['supplier', '=', name],  // Update to use the provided name parameter
            ['docstatus', '=', '1'],
            ['status', '!=', 'Cancel'],
            ['outstanding_amount', '>', '0']
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
                    setTableData(result.data)
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


    useEffect(() => {

        if (name) {
            // console.log(name)
            fetchOutstanding(name);
        }
    }, [name]);



    return (
        <>
            <Siderbar />

            <DataTable
                head={[
                    "Supplier Name",
                    "Grand Total",
                    "Outstanding Amount",

                ]}
                title='Supplier'
                newIocn={false}
                tableData={tableData}
            />
        </>
    )
}

export default withAuth(outstandingInvoices)

const DataTable = ({ tableData, head }) => {

    const router = useRouter();

    return (
        <>
            <div className='table-vw-size'>
                {/* <div className="row row--top-40">
                    <div className="col-md-12"></div>
                </div> */}
                <div className="row row--top-20">
                    <div className="col-md-12">
                        <div className="table-container">
                            <h6 className="row__title p-3 d-flex align-items-center">
                                <div className="p-2" onClick={() => {
                                    router.push('/supplier')
                                }}>

                                    <ArrowBackIcon className='' />
                                </div>
                                Outstanding Amount <span className="span-user-clr">{tableData && tableData.length} </span>
                            </h6>

                            <table className="w-100">
                                <thead className="table__thead">
                                    <tr className="tbl-head-bgvw">

                                        <th className="table__th">Supplier Name</th>
                                        <th className="table__th">
                                            Outstanding Amount <i className="bi bi-arrow-down"></i>
                                        </th>
                                        {/* <th className="table__th">Outstanding Amount</th> */}
                                        <th className="table__th">Grand Total</th>
                                        {/* <th className="table__th">Teams</th> */}
                                        {/* <th className="table__th"></th>
                                        <th className="table__th"></th> */}
                                        <th className="table__th" >Pay</th>
                                    </tr>
                                </thead>
                                {
                                    tableData.length > 0 ?
                                        <tbody className="table__tbody">


                                            {tableData.map((item => {
                                                return (
                                                    <TableDataList
                                                        customer={item.supplier}
                                                        amount={item.outstanding_amount}
                                                        total={item.grand_total}
                                                        name={item.name}
                                                    />
                                                )
                                            }))
                                            }

                                        </tbody>

                                        : <tbody className='no-record-bdy'>
                                            <h4>No Records Found</h4>
                                        </tbody>
                                }
                            </table>
                            <Pagination />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const TableDataList = ({ amount, name, customer, total }) => {

    const route = useRouter()
    async function handlePay(name, customer) {
        route.push('/supplier/' + customer + '/outstanding-invoices/' + name + '/make-a-payment')
    }

    async function handleView(name, customer) {
        route.push('/supplier/' + customer + '/outstanding-invoices/' + name + '/view')
    }
    return (
        <>
            <tr className="table-row table-row--chris">

                <td className="table-row__td" onClick={() => handleView(name, customer)}>
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
                    <p onClick={() => handlePay(name, customer)}>
                        <AddIcon />
                    </p>

                </td>

            </tr>
        </>
    );
};

const Pagination = () => {
    return (
        <>
            <div className="pgn-vw-box mt-3 p-2" style={{ overflow: 'scroll' }}>
                <div className="pre-btnvw d-flex">
                    {/* <i className="bi bi-arrow-left fs-5 mt-1"></i> */}
                    <ArrowBackIcon className='mt-1' />
                    <p className="mt-2 mb-vw-page">Previous</p>
                </div>

                <div className="pagination">
                    <p>1</p>
                    <p className="ms-2">2</p>
                    <p className="ms-2">3</p>
                    <p className="ms-2">4</p>
                    <p className="ms-2">5</p>
                </div>
                {/* <div><p className='mb-pagefnt-size'>Page 1 to 10</p></div> */}
                {/* <p className="pre-btnvw">Next <i className="bi bi-arrow-right fs-5"></i></p> */}
                <div className="pre-btnvw d-flex">
                    <p className="mt-2 mb-vw-page">Next</p>
                    {/* <i className="bi bi-arrow-right fs-5 mt-1"></i> */}
                    <ArrowForwardIcon className='mt-1' />
                </div>
            </div>
        </>
    );
};

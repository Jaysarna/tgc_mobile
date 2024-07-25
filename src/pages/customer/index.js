import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { get } from '@/configs/apiUtils';
import { AddIcon, EditIcon } from '@/icons/actions';
import { handleError } from '@/Api/showError';

const DataTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [sample, setSample] = useState(0);
    const [rowId, setRowId] = useState(false)
    const [customerData, setCustomerData] = useState('')

    async function fetchCsList() {
        try {
            const listRes = await get('/method/customer_outstanding');
            setTableData(listRes.message);
        } catch (err) {
            setTableData([]);
            console.log(err);
            if (err.response?.status === 403) {
                alert("Login Expired");
                router.push('/');
            } else {
                handleError(err);
            }
        }
    }

    async function fetchSampleCustomerList() {
        try {
            const listRes = await get('/method/customer_with_samples');
            setSampleData(listRes.message);
        } catch (err) {
            console.log(err);
            if (err.response?.status === 403) {
                sessionStorage.clear();
            } else {
                handleError(err);
            }
        }
    }

    const handleSample = () => {
        if (sample === 0) {
            fetchSampleCustomerList();
            setSample(1);
        } else {
            fetchCsList();
            setSample(0);
        }
    };

    useEffect(() => {
        fetchCsList();
    }, []);


    async function fetchTransactionList() {
        try {
            const customerId = data[rowId][1];
            const res = await get(`https://tgc67.online/api/resource/GL%20Entry?filters=[["account", "=", "Debtors - TGC"],["party_type","=","Customer"],["party", "=", "${customerId}"]]&fields=["posting_date","account","debit_in_account_currency","credit_in_account_currency","against","voucher_no"]&limit=20&order_by=posting_date&limit_start=0`);
            // console.log(res);
            setCustomerData(res?.data)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchTransactionList()
    }, [rowId])


    const columns = !sample
        ? [
            { name: 'creation', label: 'Date' },
            {
                name: 'Customer Name',
                label: 'Customer Name',
                options: {
                    customBodyRender: (value, tableMeta) => (
                        <div>
                            {value}
                        </div>
                    )
                }
            },
            {
                name: 'Outstanding Amount',
                label: 'Outstanding Amount',
                options: {
                    customBodyRender: (value) => (
                        <>
                            ${value}
                        </>
                    )
                }
            },
            {
                name: 'Receive Payment',
                filter: false,
                options: {
                    customBodyRender: (value, tableMeta) => (
                        <AddIcon
                            className="plus-icon-btn"
                            onClick={() => router.push(`/customer/${tableMeta.rowData[0]}/recive-payment`)}
                        />
                    )
                }
            },
            {
                name: 'Edit',
                options: {
                    customBodyRender: (value, tableMeta) => (
                        <EditIcon
                            onClick={() => router.push(`/customer/${tableMeta.rowData[0]}/edit`)}
                        />
                    )
                }
            }
        ]
        : [
            { name: 'Customer Name', label: 'Customer Name' },
            { name: 'Receive Payment', label: 'Label' },
            { name: 'creation', label: 'Date' },
        ];

    const data = !sample
        ? tableData.map(item => [
            moment(item[2]).format('DD-MM-yyyy'),
            item[0],
            item[1],
            item[0],
            item[0],
        ])
        : sampleData.map(item => [item.customer, item.invoices.length > 0 ? "Sample" : null]);

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        textLabels: {
            body: {
                noMatch: 'No Records Found',
            },
        },
        print: false,
        expandableRows: true,
        expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const colSpan = rowData.length + 1;
            setRowId(rowMeta?.rowIndex)

            return (
                <tr>
                    <td colSpan={colSpan}>
                        <div style={{ padding: '25px' }}>
                            <GLTable customerData={customerData} />
                        </div>
                    </td>
                </tr>
            );


        }
    };

    return (
        <div className='table-vw-size mbvw-tbl-scrl'>
            <MUIDataTable
                title={
                    <div className="container row p-3">
                        <h6 className='row__title p-3 d-flex align-items-center'>
                            <div
                                className='p-2'
                                onClick={() => {
                                    router.push('/main');
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <ArrowBackIcon className='' />
                            </div>
                            <div className='col-md-5'>
                                Customer List<span className="span-user-clr">{tableData?.length}</span>
                            </div>
                            <div className="col-md-12">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        name="docStatusCheckbox"
                                        className="form-check-input"
                                        id="docStatusCheckbox"
                                        checked={sample === 1}
                                        onChange={handleSample}
                                    />
                                    <strong className="form-check-strong " htmlFor="docStatusCheckbox" style={{ marginTop: '3px' }}>
                                        Sample
                                    </strong>
                                </div>
                            </div>
                        </h6>
                    </div>
                }
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
};

export default DataTable;




const GLTable = ({ customerData }) => {


    const glColumns = [
        {
            name: 'posting_date', label: 'Posting Date', options: {
                customBodyRender: (value, tableMeta) => (

                    <>
                        {moment(value).format('DD-MM-yyyy')}
                    </>
                )
            }
        },
        { name: 'account', label: 'Account' },
        { name: 'debit_in_account_currency', label: 'Debit' },
        { name: 'credit_in_account_currency', label: 'Credit' },
        { name: 'against', label: 'Against' },
        { name: 'voucher_no', label: 'Voucher No.' },
    ];



    return (
        <MUIDataTable
            title=""
            data={customerData || []}
            columns={glColumns}
            options={{
                filterType: 'dropdown',
                search: false,
                download: false,
                filter: false,
                responsive: 'standard',
                selectableRows: 'none',
                viewColumns: false,
                pagination: false,
                elevation: 0,

                textLabels: {
                    body: {
                        noMatch: 'No GL Entries Found',
                    },
                },
                print: false
            }}
        />
    );
};

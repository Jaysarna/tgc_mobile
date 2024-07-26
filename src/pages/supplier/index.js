import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import { AddIcon, EditIcon } from '@/icons/actions';
import { handleError } from '@/Api/showError';
import { getAuthHeader } from '@/helpers/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { get } from '@/configs/apiUtils';

const ItemList = () => {
    return (
        <div>
            <Siderbar />
            <DataTable />
        </div>
    );
};

export default withAuth(ItemList);

const DataTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [sample, setSample] = useState(0);
    const [rowId, setRowId] = useState(false);
    const [supplierData, setSupplierData] = useState('');

    async function fetchData() {
        try {
            const authHeader = getAuthHeader();
            const listRes = await axios.get('https://tgc67.online/api/method/supplier_outstanding', authHeader);
            setTableData(listRes.data.message);
        } catch (err) {
            setTableData([]);
            console.log(err);
            if (err.response?.status === 403) {
                sessionStorage.clear();
            } else {
                handleError(err);
            }
        }
    }

    async function fetchSampleData() {
        try {
            const listRes = await get('supplier_with_samples');
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
            fetchSampleData();
            setSample(1);
        } else {
            fetchData();
            setSample(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchTransactionList() {
        try {
            const supplierId = data[rowId][1];
            const res = await get(`https://tgc67.online/api/resource/GL%20Entry?filters=[["account", "=", "Creditors - TGC"],["party_type","=","Supplier"],["party", "=", "${supplierId}"]]&fields=["posting_date","account","debit_in_account_currency","credit_in_account_currency","against","voucher_no"]&limit=20&order_by=posting_date&limit_start=0`);
            setSupplierData(res?.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchTransactionList();
    }, [rowId]);

    const columns = !sample
        ? [
            {
                name: 'Date',
                options: {
                    customBodyRender: (value) => (
                        <div>
                            {moment(value).format('l')}
                        </div>
                    )
                }
            },
            { name: 'Supplier Name' },
            {
                name: 'Outstanding Amount',
                options: {
                    customBodyRender: (value) => (
                        <>$ {value}</>
                    )
                }
            },
            {
                name: 'Make a Payment',
                options: {
                    customBodyRender: (value, tableMeta) => (
                        <AddIcon
                            className="plus-icon-btn"
                            onClick={() => router.push(`/supplier/${tableMeta.rowData[1]}/make-payment`)}
                        />
                    )
                }
            },
            {
                name: 'Edit',
                options: {
                    customBodyRender: (value, tableMeta) => (
                        <EditIcon
                            onClick={() => router.push(`/supplier/${tableMeta.rowData[1]}/edit`)}
                        />
                    )
                }
            }
        ]
        : [
            {
                name: 'Supplier',
                options: {
                    customBodyRender: (value) => <div>{value}</div>
                }
            },
            {
                name: 'Invoices',
                options: {
                    customBodyRender: (value) => (
                        <div>
                            {value.map(invoice => (
                                <div key={invoice.invoice}>
                                    <div>{invoice.invoice} {" "} {moment(invoice?.posting_date).format('DD MMM YY')}</div>
                                    <div>
                                        {invoice.item_list.map(item => (
                                            <div key={item}>{item}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            }
        ];

    const data = !sample
        ? tableData.map(item => [
            item[2],
            item[0],
            item[1],
            item[0],
            item[0]
        ])
        : sampleData.map(item => [
            item.supplier,
            item.invoices
        ]);

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
            setRowId(rowMeta?.rowIndex);

            return (
                <tr>
                    <td colSpan={colSpan}>
                        <div style={{ padding: '25px' }}>
                            <GLTable supplierData={supplierData} />
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
                                Supplier List<span className="span-user-clr">{tableData?.length}</span>
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

const GLTable = ({ supplierData }) => {
    const glColumns = [
        {
            name: 'posting_date',
            label: 'Posting Date',
            options: {
                customBodyRender: (value, tableMeta) => (
                    <>
                        {moment(value).format('DD-MM-yyyy')}
                    </>
                )
            }
        },
        // { name: 'account', label: 'Account' },
        { name: 'debit_in_account_currency', label: 'Debit' },
        { name: 'credit_in_account_currency', label: 'Credit' },
        { name: 'against', label: 'Against' },
        { name: 'voucher_no', label: 'Voucher No.' },
    ];

    return (
        <MUIDataTable
            title=""
            data={supplierData || []}
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

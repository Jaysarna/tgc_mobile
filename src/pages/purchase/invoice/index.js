import { useEffect, useState } from 'react';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import { handleError } from '@/Api/showError';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AddIcon } from '@/icons/actions';
import { get } from '@/configs/apiUtils';
import moment from 'moment';

const PurchaseInvoiceList = () => {
    const [tableData, setTableData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();

    async function fetchPurchaseInvoiceList(page = 0, rowsPerPage = 10) {
        const apiUrl = 'https://tgc67.online/api/resource/Purchase%20Invoice';
        const filters = [
            ['docstatus', '=', '1'],
            ['status', '!=', 'Cancel'],
        ];
        const fields = ['name', 'supplier', 'grand_total', 'outstanding_amount', 'posting_date', 'is_return', 'custom_payment_amount_in_advance', 'total_qty'];
        const orderBy = "outstanding_amount desc";

        // Construct the dynamic URL with pagination
        const url = `${apiUrl}?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(fields))}&order_by=${orderBy}&limit_start=${page * rowsPerPage}&limit_page_length=${rowsPerPage}`;

        try {
            const listRes = await get(url);
            setTableData(listRes?.data);
            setTotalRecords(listRes?.data?.length);
        }
        catch (err) {
            console.log(err);
            if (err.response?.status === 403) {
                alert("Login Expired");
                router.push('/');
            }
            else {
                handleError(err);
            }
        }
    }

    useEffect(() => {
        fetchPurchaseInvoiceList(page, rowsPerPage);
    }, [page, rowsPerPage]);

    return (
        <div>
            <Siderbar />
            <DataTable tableData={tableData} fetchPurchaseInvoiceList={fetchPurchaseInvoiceList} totalRecords={totalRecords} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        </div>
    );
};

export default withAuth(PurchaseInvoiceList);

const DataTable = ({ tableData, totalRecords, page, setPage, rowsPerPage, setRowsPerPage, fetchPurchaseInvoiceList }) => {
    const router = useRouter();

    const columns = [
        {
            name: 'posting_date',
            label: 'Date',
            options: {
                customBodyRender: (value) => {
                    return (
                        <>
                            {moment(value).format('l')}
                        </>
                    )
                }
            }
        },
        {
            name: 'supplier',
            options: {
                display: false
            }
        },

        {
            name: 'name',
            label: 'Supplier Name',
            options: {
                customBodyRender: (value, tableMeta) => {
                    const name = tableMeta.rowData[1];

                    return (
                        <div className='table-row__info' style={{ cursor: 'pointer' }} onClick={() => {
                            router.push(`/purchase/invoice/view/${value}`)
                        }}>
                            <p className='table-row__name'>{name}</p>
                            <span className='table-row__small ms-1'>{value}</span>
                        </div>
                    );
                }
            }
        },

        {
            name: 'is_return',
            options: {
                display: false
            }
        },
        {
            name: 'total_qty',
            label: 'Total Quantity',
        },

        {
            name: 'grand_total',
            label: 'Grand Total',
            options: {
                customBodyRender: (value) => {
                    return (
                        <>
                            $ {value}
                        </>
                    );
                }
            }
        },
        {
            name: 'custom_payment_amount_in_advance',
            label: 'Amount Pay',
            options: {
                customBodyRender: (value) => {
                    return (
                        <>
                            $ {value}
                        </>
                    );
                }
            }
        },

        {
            name: 'outstanding_amount',
            label: 'Outstanding Amount',
            options: {
                customBodyRender: (value) => {
                    return (
                        <>
                            $ {value}
                        </>
                    );
                }
            }
        },

        {
            name: 'payment',
            label: 'Make a Payment',
            options: {
                customBodyRender: (dataIndex, tableMeta) => {
                    const name = tableMeta.rowData[1];
                    return (
                        <AddIcon
                            className="plus-icon-btn"
                            onClick={() => router.push(`/supplier/${name}/make-payment`)}
                        />
                    );
                }
            }
        },

        {
            name: 'Return',
            label: 'Return',
            options: {
                customBodyRender: (dataIndex, tableMeta) => {
                    const name = tableMeta.rowData[1];
                    const invoice = tableMeta.rowData[2];
                    const is_return = tableMeta.rowData[3];
                    if (!is_return) {
                        return (
                            <button className="btn btn-primary" onClick={() => {
                                router.push(`/purchase/invoice/${invoice}/${name}/return`);
                            }}>Return</button>
                        );
                    }
                    else {
                        return (
                            <>
                                --
                            </>
                        );
                    }
                }
            }
        }
    ];

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',

        textLabels: {
            body: {
                noMatch: 'No Records Found'
            }
        },
        print: false,
        serverSide: true,
        count: (totalRecords >= 10 ? (totalRecords * (page + 1)) + rowsPerPage : totalRecords + rowsPerPage),
        page: page,
        rowsPerPage: rowsPerPage,
        onChangePage: (newPage) => {
            setPage(newPage);
            fetchPurchaseInvoiceList(newPage, rowsPerPage);
        },
        onChangeRowsPerPage: (newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            fetchPurchaseInvoiceList(page, newRowsPerPage);
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
                            <div className='col-md-8'>
                                All Purchase Invoice List{' '}
                                <span className='span-user-clr'>{tableData.length}</span>
                            </div>
                            <div className='col-6'>
                                Total Amount{' '}
                                <span className='span-user-clr'>
                                    {'$ '}
                                    {tableData.length > 0
                                        ? tableData.reduce(
                                            (total, item) => total + item.outstanding_amount,
                                            0
                                        )
                                        : 0}
                                </span>
                            </div>
                        </h6>
                    </div>
                }
                data={tableData}
                columns={columns}
                options={options}
            />
        </div>
    );
};

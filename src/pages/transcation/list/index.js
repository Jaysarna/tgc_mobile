import React, { useState, useEffect, useCallback } from 'react';
import MUIDataTable from 'mui-datatables';
import TablePagination from '@mui/material/TablePagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import moment from 'moment';
import Siderbar from '@/helpers/siderbar';
import { LoadingPage } from '@/helpers/Loader';
import withAuth from '@/customhook/withAuth';
import TableSearchBar from '@/customhook/customSearch';
import { del, get, put } from '@/configs/apiUtils';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

const columns = [
    {
        name: "posting_date",
        label: "Payment Date",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value) => moment(value).format('l'),
        }
    },
    {
        name: "voucher_no",
        label: "Voucher No",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "debit_in_account_currency",
        label: "+",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "credit_in_account_currency",
        label: "-",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "remarks",
        label: "Notes",
        options: {
            filter: true,
            sort: true,
        },
    },
];

const Index = () => {
    const router = useRouter();

    const [data, setData] = useState({
        transcation: [],
        filteredTranscation: [],
        loading: true,
        page: 0,
        rowsPerPage: 10,
        totalCount: 0,
        totalAmount: { debit: 0, credit: 0 },
        startDate: new Date(),
        endDate: new Date(),
        dateRange: [new Date(), new Date()],
    });

    const { transcation, filteredTranscation, loading, page, rowsPerPage, totalCount, totalAmount, dateRange } = data;
    const { debit, credit } = totalAmount;


    const fetchData = useCallback(async (page, rowsPerPage) => {
        try {
            const baseURL = "https://tgc67.online/api/resource/GL%20Entry";
            const filters = encodeURIComponent(JSON.stringify([["account", "=", "Cash - TGC"]]));
            const fields = encodeURIComponent(JSON.stringify(["posting_date", "account", "remarks", "debit_in_account_currency", "credit_in_account_currency", "against", "voucher_no"]));
            const limit = rowsPerPage;
            const offset = page * rowsPerPage;
            const orderBy = "posting_date";

            const url = `${baseURL}?filters=${filters}&fields=${fields}&limit=${limit}&order_by=${orderBy}&limit_start=${offset}`;

            const response = await get(url);

            if (!response.data) {
                throw new Error("Failed to fetch data");
            }

            const data = response.data || [];
            setData({
                transcation: data,
                filteredTranscation: data,
                loading: false,
                page,
                rowsPerPage,
                totalCount: response.totalCount || 0,
                totalAmount: {
                    debit: data.reduce((acc, item) => acc + item.debit_in_account_currency, 0),
                    credit: data.reduce((acc, item) => acc + item.credit_in_account_currency, 0)
                }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(prevState => ({
                ...prevState,
                loading: false
            }));
        }
    }, []);

    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [fetchData, page, rowsPerPage]);

    const handleSearch = useCallback((value) => {
        const filteredData = transcation.filter(item =>
            item.voucher_no.toLowerCase().includes(value?.toLowerCase()) ||
            item.remarks.toLowerCase().includes(value?.toLowerCase())
        );
        setData(prevState => ({
            ...prevState,
            filteredTranscation: filteredData,
            totalAmount: {
                debit: filteredData.reduce((acc, item) => acc + item.debit_in_account_currency, 0),
                credit: filteredData.reduce((acc, item) => acc + item.credit_in_account_currency, 0)
            }
        }));
    }, [transcation]);

    const handleReset = () => {
        setData(prevState => ({
            ...prevState,
            filteredTranscation: prevState.transcation,
            totalAmount: {
                debit: prevState.transcation.reduce((acc, item) => acc + item.debit_in_account_currency, 0),
                credit: prevState.transcation.reduce((acc, item) => acc + item.credit_in_account_currency, 0)
            }
        }));
    };

    const options = React.useMemo(() => ({
        filterType: "dropdown",
        responsive: "standard",
        pagination: false,
        search: true,
        reset: true,
        selectableRows: 'none',
        onSearchChange: handleSearch,
        customFooter: () => (
            <div className="container row p-3">
                <h6 className='row__title p-3 d-flex align-items-center'>
                    <div className='col-4'>
                        Total Debit{' '}
                        <span className='span-user-clr'>
                            {'$ '}{debit}
                        </span>
                    </div>
                    <div className='col-4'>
                        Total Credit{' '}
                        <span className='span-user-clr'>
                            {'$ '}{credit}
                        </span>
                    </div>
                </h6>
                <div className='col-12'>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(event, newPage) => setData(prevState => ({ ...prevState, page: newPage }))}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => setData(prevState => ({ ...prevState, rowsPerPage: parseInt(event.target.value, 10), page: 0 }))}
                    />
                </div>
            </div>
        ),
        customSearchRender: (searchText, handleSearch, hideSearch, options) => (
            <TableSearchBar
                searchText={searchText}
                onSearch={handleSearch}
                onHide={hideSearch}
                options={options}
                handleReset={handleReset}
            />
        ),
    }), [handleSearch, transcation, debit, credit, page, rowsPerPage]);

    // console.log(dateRange)


    const tableTitle = (
        <div className="container row p-3">
            <h6 className='row__title d-flex align-items-center'>
                <div
                    className='p-2'
                    onClick={() => router.push('/main')}
                    style={{ cursor: 'pointer' }}
                >
                    <ArrowBackIcon className='' />
                </div>
                <div className='col-md-6'>
                    Accounting Transactions{' '}
                    <span className='span-user-clr'>{filteredTranscation.length}</span>
                </div>
                <div className='col-4'>
                    Cash{' '}
                    <span className='span-user-clr'>
                        {'$ '}
                        {debit - credit}
                    </span>
                </div>
                <div className='col-1 d-flex justify-content-end'>
                    <IconButton onClick={handleReset}>
                        <RefreshIcon />
                    </IconButton>
                </div>
            </h6>


            <div className="col-md-12 d-flex align-items-center mt-4 ">
                <span className="mr-1"></span>
                <DatePicker
                    selectsRange={true}
                    startDate={dateRange ? dateRange[0] : new Date()}
                    endDate={dateRange ? dateRange[1] : new Date()}
                    onChange={(update) => {
                        // console.log(dateRange)
                        setData({
                            ...data,
                            dateRange: update
                        })

                    }}
                    isClearable={true}
                    withPortal
                    className='datepicker'
                />
                <button className='btn btn-sm btn-primary ml-2' >Filter</button>
            </div>
        </div>
    );


    async function handleDelete(voucher_no) {
        try {
            const res = await put('/resource/Journal Entry/' + voucher_no, {
                data: {
                    name: voucher_no,
                    docstatus: "2"
                }

            });

            if (res) {
                const res1 = await del('/resource/Journal Entry/' + voucher_no);

                // console.log(res1)
                if (res1) {
                    toast.success('Removed Successfully')
                    fetchData(page, rowsPerPage);
                }
            }
        }
        catch (err) {
            console.log(err)
        }


    }

    const updatedColumn = [
        ...columns,
        {
            name: "actions",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta) => {
                    const voucher_no = tableMeta.rowData[1];
                    return (
                        <IconButton
                            onClick={() => handleDelete(voucher_no)}
                            aria-label="delete"
                        >
                            <DeleteIcon />
                        </IconButton>
                    );
                }
            }
        }
    ]

    return (
        <>
            <Siderbar />
            <div className='table-vw-size mbvw-tbl-scrl'>
                {loading ? (
                    <LoadingPage msg='Loading' />
                ) : (
                    <MUIDataTable
                        title={tableTitle}
                        data={filteredTranscation}
                        columns={updatedColumn}
                        options={options}

                    />
                )}
            </div>
        </>
    );
};

export default withAuth(Index);

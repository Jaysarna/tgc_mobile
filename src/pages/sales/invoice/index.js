import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import { AddIcon, EditIcon } from '@/icons/actions';
import { Pagination } from '@/customhook/pagination';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { handleError } from '@/Api/showError';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Head from 'next/head';
import { get } from '@/configs/apiUtils';
import moment from 'moment';

const ItemList = () => {
    const [tableData, setTableData] = useState([]);
    const router = useRouter();

    async function fetchCsList() {
        const authHeader = getAuthHeader()

        const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice'
        const filters = [
            ['docstatus', '=', '1'],
            ['status', '!=', 'Cancel']
        ]
        const fields = ["name", "customer", "grand_total", "outstanding_amount", "advance_received", "posting_date"];

        // Construct the dynamic URL
        const url = `${apiUrl}?filters=${encodeURIComponent(
            JSON.stringify(filters)
        )}&fields=${encodeURIComponent(JSON.stringify(fields))}`

        try {
            const res = await get(url)
            // const listRes = await axios.get(url, authHeader)
            // console.log(listRes.data)
            setTableData(res.data)
        } catch (err) {
            if (err?.response?.status === 403) {
                sessionStorage.clear()
                alert('Login Expired')
                router.push('/')
            } else {
                handleError(err)
            }
        }
    }

    useEffect(() => {
        fetchCsList();
    }, []);

    return (
        <div>
            <Siderbar />
            <DataTable tableData={tableData} />
        </div>
    );
};

export default withAuth(ItemList);

const DataTable = ({ tableData }) => {
    const [sample, setSample] = useState(0);
    const router = useRouter();

    async function handleReturn(e) {
        // Handle return action
    }

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
            name: 'name',
            label: 'Customer Name',
            options: {

                customBodyRender: (value, tableMeta) => {
                    const name = tableMeta.rowData[2]

                    return (
                        < div className='table-row__info' >
                            <p className='table-row__name'>{name}</p>
                            <span className='table-row__small ms-1'>{value}</span>
                        </div >
                    )
                }
            }
        },
        {
            name: 'customer',
            label: 'Customer',
            // options: {
            //     display: false
            // }
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
                    )
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
                    )
                }
            }
        },
        {
            name: 'advance_received',
            label: 'Advance Amount',
            options: {
                customBodyRender: (value) => {
                    return (
                        <>
                            $ {value}
                        </>
                    )
                }
            }
        },
        {
            name: 'Return',
            label: 'Return',
            options: {
                customBodyRender: (dataIndex, tableMeta) => {
                    const name = tableMeta.rowData[1]
                    const invoice = tableMeta.rowData[0]
                    return (
                        <button className="btn btn-primary" onClick={() => {
                            router.push(`/sales/invoice/${invoice}/${name}/return`)
                        }}>Return</button>
                    )

                }
            }
        }
    ];

    // const data = tableData.map(item => [
    //     {
    //         item.customer,
    //         itme.name
    //     },
    //     item.grand_total,
    //     item.outstanding_amount,
    //     null
    // ]);

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        textLabels: {
            body: {
                noMatch: 'No Records Found'
            }
        },
        print: false,

    };

    return (
        <>
            <Head>
                <title>Sales Invoice List</title>
            </Head>
            <div className='table-vw-size mbvw-tbl-scrl'>

                <MUIDataTable
                    title={
                        <div className="container row p-3">
                            <h6 className='row__title p-3 d-flex align-items-center'>
                                <div
                                    className='p-2'
                                    onClick={() => {
                                        router.push('/main')
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ArrowBackIcon className='' />
                                </div>
                                <div className='col-md-8'>
                                    All Sales Invoice List{' '}
                                    <span className='span-user-clr'>{tableData?.length}</span>
                                </div>
                                {/* <div className='col-md-3'>
                                <div className='form-check'>
                                    <input
                                        type='checkbox'
                                        name='return'
                                        className='form-check-input'
                                        id='return'
                                        checked={sample === 1}
                                        onChange={handleReturn}
                                        style={{ marginTop: '2px' }}
                                    />
                                    <strong
                                        className='form-check-strong return-chk-box'
                                        htmlFor='return'
                                    >
                                        Return
                                    </strong>
                                </div>
                            </div> */}
                                <div className='col-6'>
                                    Total Amount{' '}
                                    <span className='span-user-clr'>
                                        {'$ '}
                                        {tableData?.length > 0
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
                {/* <Pagination /> */}
            </div>
        </>
    );
};

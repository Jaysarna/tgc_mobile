import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import React from 'react';
import { get } from '@/configs/apiUtils';

const GLTable = ({ type }) => {
    const [tableData, setTableData] = useState([]);

    const router = useRouter()

    const { invoice } = router?.query

    async function fetchGLData() {
        if (!router?.isReady) return
        const apiUrl = '/resource/GL%20Entry';
        const filters = [
            ["against_voucher_type", "=", type],
            ["against_voucher", "=", invoice],
            ["voucher_type", "=", "Payment Entry"]
        ];
        const fields = ["voucher_no", "debit", "remarks", "posting_date"];

        // Construct the dynamic URL
        const url = `${apiUrl}?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(fields))}`;

        try {
            const response = await get(url);
            setTableData(response.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            // if (err.response?.status === 403) {
            //     router.push('/');
            // }
        }
    }

    useEffect(() => {
        fetchGLData();
    }, [invoice]);

    return (

        <DataTable tableData={tableData} />

    );
};

export default withAuth(GLTable);

const DataTable = ({ tableData }) => {


    const router = useRouter()
    const columns = [
        {
            name: 'posting_date',
            label: 'Posting Date',
            options: {
                customBodyRender: (value) => (
                    moment(value).format('L')
                )
            }
        },
        {
            name: 'voucher_no',
            label: 'Voucher Number',
            options: {
                customBodyRender: (value) => (
                    <span style={{ cursor: 'pointer' }} onClick={() => router.push(`/voucher/${value}`)}>
                        {value}
                    </span>
                )
            }
        },
        {
            name: 'debit',
            label: 'Debit Amount',
            options: {
                customBodyRender: (value) => `$ ${value}`
            }
        },
        {
            name: 'remarks',
            label: 'Remarks',
            options: {
                customBodyRender: (value) => value || '--'
            }
        }
    ];

    const options = {
        filter: false,
        filterType: 'none',
        download: false,
        print: false,
        viewColumns: false,
        selectableRows: 'none',
        search: true,
        pagination: true,
        responsive: 'standard',
        textLabels: {
            body: {
                noMatch: 'No Records Found'
            }
        }
    };



    return (
        <div className='w-100'>
            <MUIDataTable
                title={
                    <div className="container row p-3">
                        <h6 className='row__title p-3 d-flex align-items-center'>

                            <div className='col-md-8'>
                                Against List <span className='span-user-clr'>{tableData.length}</span>
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

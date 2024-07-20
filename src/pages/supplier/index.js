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
    const router = useRouter();

    return (
        <div>
            <Siderbar />
            <DataTable />
        </div>
    );
};

export default withAuth(ItemList);

// DataTable Component
const DataTable = () => {
    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [sample, setSample] = useState(0);
    const route = useRouter();

    async function fetchData() {
        const authHeader = getAuthHeader();

        try {
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
        const authHeader = getAuthHeader();

        try {
            const listRes = await get('supplier_with_samples')
            // const listRes = await axios.get('https://tgc67.online/api/method/supplier_with_samples', authHeader);
            console.log(listRes.data.message)
            setSampleData(listRes.data.message);
        } catch (err) {
            console.log(err);
            if (err.response?.status === 403) {
                sessionStorage.clear();
            } else {
                handleError(err);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSample = () => {
        if (sample === 0) {
            fetchSampleData();
            setSample(1);
        } else {
            fetchData();
            setSample(0);
        }
    };

    const columns = !sample
        ? [
            { name: 'Date ', },
            { name: 'Supplier Name', },
            {
                name: 'Outstanding Amount', options: {
                    customBodyRender: (value) => {
                        return (
                            <>$ {value}
                            </>
                        )
                    }
                }
            },
            { name: 'Make a Payment', },
            { name: 'Edit ', },

        ]
        : [
            {
                name: 'Supplier',
                options: {
                    customBodyRender: (value) => (
                        <div>{value}</div>
                    )
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
            },

        ];


    const data = !sample
        ? tableData.map(item => [
            item[2],
            item[0],
            item[1],

            <AddIcon
                className="plus-icon-btn"
                onClick={() => route.push(`/supplier/${item[0]}/make-payment`)}
            />,
            <EditIcon onClick={() => route.push(`/supplier/${item[0]}/edit`)} />,
        ])
        : sampleData.map(item => [
            item.supplier,
            item.invoices,
            item.invoices
        ]);
    // sampleData.map(item => [
    //     item.supplier,
    //     item.invoices.length > 0 ? (
    //         <ArrowDropDownIcon
    //             onClick={() => {
    //                 // Handle expanding invoice details
    //             }}
    //         />
    //     ) : null,
    // ]);

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        textLabels: {
            body: {
                noMatch: 'No Records Found',
            },
        },
        print: false,

    };

    return (

        // <div className='container'>
        <div className='table-vw-size mbvw-tbl-scrl'>

            <MUIDataTable
                title={
                    <div className="container row p-3">
                        <h6 className='row__title p-3 d-flex align-items-center'>
                            <div
                                className='p-2'
                                onClick={() => {
                                    route.push('/main')
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <ArrowBackIcon className='' />
                            </div>
                            <div className='col-md-5'>
                                Supplier List<span className="span-user-clr">{tableData.length}</span>
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
                                    <strong className="form-check-strong" htmlFor="docStatusCheckbox">
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


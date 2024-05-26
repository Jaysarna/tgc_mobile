// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables'
import { AddIcon, EditIcon } from '@/icons/actions';
import { Pagination } from '@/customhook/pagination';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { handleError } from '@/Api/showError';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


const ItemList = () => {

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
    const [sample, setSample] = useState(0);
    const route = useRouter();

    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([]);

    async function fetchCsList() {
        const authHeader = getAuthHeader();

        try {
            const listRes = await axios.get('https://tgc67.online/api/method/customer_outstanding', authHeader);
            setTableData(listRes.data.message);
        } catch (err) {
            setTableData([]);
            console.log(err);
            if (err.response?.status === 403) {
                alert("Login Expired");
                route.push('/');
            } else {
                handleError(err);
            }
        }
    }

    useEffect(() => {
        fetchCsList();
    }, []);

    async function fetchSampleCustomerList() {
        const authHeader = getAuthHeader();

        try {
            const listRes = await axios.get('https://tgc67.online/api/method/customer_with_samples', authHeader);
            setSampleData(listRes.data.message);
        } catch (err) {
            console.log(err);
            if (err.response.status === 403) {
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

    const columns = !sample
        ? [

            { name: 'Customer Name', label: 'Customer Name' },
            { name: 'Outstanding Amount', label: 'Outstanding Amount' },

            {
                name: 'Make Payment',
                filter: false,
                // options: { customBodyRender: () => <AddIcon className='plus-icon-btn' onClick={() => route.push(`/customer/${item[0]}/recive-payment`)} /> }
            },
            {
                name: 'Edit',

                // options: { customBodyRender: () => <EditIcon onClick={() => route.push(`/customer/${item[0]}/edit`)} /> } },
            },
            { name: 'creation', label: 'Date' },

        ]
        : [
            { name: 'Customer Name', label: 'Customer Name' },
            { name: 'Receive Payment', label: 'Label' },
            { name: 'creation', label: 'Date' },
        ];

    const data = !sample
        ? tableData.map(item => [
            item[0],
            item[1],
            <AddIcon
                className="plus-icon-btn"
                onClick={() => route.push(`/customer/${item[0]}/recive-payment`)}
            />,
            <EditIcon onClick={() => route.push(`/customer/${item[0]}/edit`)} />,
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

        print: false
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
                                    route.push('/main')
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <ArrowBackIcon className='' />
                            </div>
                            <div className='col-md-5'>
                                Customer List<span className="span-user-clr">{tableData.length}</span>
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
                            {/* <div className="col-md-12">
                                <div className="btn btn-primary iconOuter" onClick={() => {
                                    route.push('/customer/new-customer')
                                }}  >
                                    <i className="bi bi-plus-circle"></i>
                                </div>
                            </div> */}
                        </h6>


                    </div>
                }
                data={data}
                columns={columns}
                options={options}
            />
            {/* <Pagination /> */}
        </div>
    );
};

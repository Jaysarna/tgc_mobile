// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import { AddIcon, EditIcon } from '@/icons/actions';
import { Pagination } from '@/customhook/pagination';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { handleError } from '@/Api/showError';

const Samplelist = () => {

    const route = useRouter()

    const { name } = route.query;

    const [tableData, setTableData] = useState([]);

    async function fetchCsList() {
        const authHeader = getAuthHeader();
        const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice';
        const filters = [
            ['customer', '=', name],
            ["custom_sample", "=", "1"],
            ['docstatus', '=', '0'],
            ['status', '!=', 'Cancel']
        ];
        const fields = ['name', 'customer', 'grand_total', 'outstanding_amount'];

        // Construct the dynamic URL
        const url = `${apiUrl}?filters=${encodeURIComponent(JSON.stringify(filters))}&fields=${encodeURIComponent(JSON.stringify(fields))}`;


        try {
            const listRes = await axios.get(url, authHeader);
            console.log(listRes.data)
            setTableData(listRes.data.data);
        } catch (error) {
            console.log(error);
            if (error.response?.status === 403) {
                alert("Login Expired")
                route.push('/')
            }
            else {
                handleError(error)
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
    )
}


export default withAuth(Samplelist)






// DataTable Component
const DataTable = ({ tableData }) => {



    return (
        <div className='table-vw-size mbvw-tbl-scrl'>
            <div className="container row">
                <h6 className="row__title p-3 col-md-4">
                    Sample List<span className="span-user-clr">{tableData.length}</span>
                </h6>

            </div>


            <table className="table">
                <thead className="table-light">
                    <tr>
                        <th className='table-head-fntsz'>Customer Name</th>
                        <th className='table-head-fntsz'>Outstanding Amount</th>
                        <th className='table-head-fntsz'>Grand Total</th>
                        <th className='table-head-fntsz'>Edit </th>
                    </tr>
                </thead>
                {tableData.length > 0 ?
                    <tbody>

                        {tableData.map((item) => (
                            <TableDataList
                                key={item.name}
                                name={item.name}
                                customer={item.customer}
                                grand_total={item.grand_total}
                                outstanding_amount={item.outstanding_amount}
                            />
                        ))}

                    </tbody>
                    :
                    <tbody className='no-record-bdy'>
                        <h4>No Records Found</h4>
                    </tbody>
                }
            </table>



            <Pagination />
        </div>
    );
};

// TableDataList Component
const TableDataList = ({ customer, name, grand_total, outstanding_amount }) => {
    const route = useRouter();

    const handleEdit = () => {
        route.push(`/customer/${customer}/sample-list/${name}/edit-sample-to-invoice`);
    };


    return (
        <tr className="table-row table-row--chris">
            <td className="table-row__td d-flex">
                <div className="table-row__info" style={{ cursor: 'pointer' }}>
                    <p className="table-row__name">{name}</p>
                    <span className="table-row__small ms-1">{customer}</span>
                </div>
            </td>
            <td data-column="Outstanding Amount" className="table-row__td">
                <p className="table-row__status">
                    <i className="bi bi-currency-dollar"></i> {outstanding_amount}
                </p>
            </td>
            <td data-column="Outstanding Amount" className="table-row__td">
                <p className="table-row__status">
                    <i className="bi bi-currency-dollar"></i> {grand_total}
                </p>
            </td>

            <td data-column="Edit Button" className="table-row__td">
                <EditIcon onClick={handleEdit} />
            </td>
        </tr>
    );
};

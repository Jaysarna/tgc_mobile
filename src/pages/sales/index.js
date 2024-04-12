import React, { useEffect, useState } from 'react';
// import './customerList.module.css';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';

import axios from 'axios';
import { authHeader, getAuthHeader } from '@/helpers/Header';
import { AddIcon, EditIcon } from '@/icons/actions';
import { Pagination } from '@/customhook/pagination';
import { useRouter } from 'next/router';
import { handleError } from '@/Api/showError';




const ItemList = () => {
    const [tableData, setTableData] = useState([]);
    const router = useRouter()

    async function fetchCsList() {
        const authHeader = getAuthHeader();
        try {
            const listRes = await axios.get('https://tgc67.online/api/method/customer_outstanding', authHeader)
            // console.log(listRes.data.message)
            setTableData(listRes.data.message)
        }
        catch (err) {
            console.log(err)
            if (err.response.status === 403) {
                alert("Login Expired")
                router.push('/')
            }
            else {
                handleError(err)
            }
        }
    }

    useEffect(() => {
        fetchCsList()
    }, [])

    return (
        <div>
            <Siderbar />
            <DataTable
                head={[
                    "Supplier Name",
                    "Supplier Group",
                    "Status",
                    "ID",
                    "Actions"
                ]}
                title='Customer'
                newIocn={false}
                tableData={tableData}
            />
        </div>
    );
}

export default withAuth(ItemList);


const DataTable = ({ tableData }) => {
    return (
        <>


            <div className='table-vw-size mbvw-tbl-scrl'>
                <h6 className="row__title p-3">
                    Supplier List <span className="span-user-clr">{tableData.length}</span>
                </h6>

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className='table-head-fntsz'>Customer Name</th>
                            <th className='table-head-fntsz'>Outstanding Amount</th>
                            <th className='table-head-fntsz'>Grand Total</th>
                            {/* <th className='table-head-fntsz'>Edit Button</th> */}
                        </tr>
                    </thead>
                    {
                        tableData.length > 0 ?
                            <tbody>
                                {tableData.map((item => {
                                    return (
                                        <TableDataList
                                            name={item[0]}
                                            amount={item[1]}
                                        />
                                    )
                                }))
                                }
                            </tbody>
                            :
                            <tbody className='no-record-bdy'>
                                <h4>No Records Found</h4>
                            </tbody>

                    }
                </table>
                <Pagination />
            </div>
        </>
    );
};


const TableDataList = ({ amount, name }) => {
    return (
        <>
            <tr className="table-row table-row--chris">
                <td className="table-row__td d-flex">
                    {/* <div className="table-row__img"></div> */}
                    <div className="table-row__info">
                        <p className="table-row__name">{name}</p>
                        <span className="table-row__small ms-1">Customer</span>
                    </div>
                </td>
                <td data-column="Outstanding Amount" className="table-row__td">

                    <p className="table-row__status">
                        <i className="bi bi-currency-dollar"></i> {amount}
                    </p>
                </td>
                <td data-column="Create Button" className="table-row__td">

                    <AddIcon />
                    {/* <i className="fa-solid fa-square-plus "></i> */}

                </td>
                <td data-column="Edit Button" className="table-row__td">
                    <EditIcon />
                    {/* <i className='fas edit-icon-btn'>&#xf304;</i> */}
                </td>
            </tr>
        </>
    );
};

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { TablePagination } from '@mui/material';
import { getAuthHeader } from "@/helpers/Header";
import withAuth from "@/customhook/withAuth";
import Siderbar from "@/helpers/siderbar";
import { LoadingPage } from "@/helpers/Loader";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";
import { get } from "@/configs/apiUtils";
import moment from "moment";

const columns = [
    {
        name: "posting_date",
        label: "Payment Date",
        options: {
            filter: true,
            sort: true,
        },
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
    // {
    //     name: "account",
    //     label: "Account",
    //     options: {
    //         filter: true,
    //         sort: false,
    //     },
    // },
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
        label: "Debit",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "credit_in_account_currency",
        label: "Credit",
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
    // {
    //     name: "against",
    //     label: "Party Name",

    // },

];

const Index = () => {

    const router = useRouter()

    const [transcation, setTranscation] = useState([])

    const options = {
        filterType: "dropdown",
        responsive: "standard",
        // customFooter: (currentPage, pageRows, totalPages, changeRowsPerPage, changePage, textLabels) => {
        //     const totalDebit = transcation.reduce((total, item) => total + item.debit_in_account_currency, 0);
        //     const totalCredit = transcation.reduce((total, item) => total + item.credit_in_account_currency, 0);

        //     return (
        //         <div className="row p-4 ">
        //             <div className="col-md-6 p-3">
        //                 Total Debit:  {" "}<span className="span-user-clr">{totalDebit}</span> {" "}
        //                 Total Credit {" "}
        //                 <span className="span-user-clr">{totalCredit}</span>

        //             </div>
        //             {/* <div className="col-md-6">
        //                 <TablePagination
        //                     count={transcation.length - 1} // Exclude the total row for pagination
        //                     page={currentPage}
        //                     rowsPerPage={pageRows}
        //                     totalPages={totalPages}
        //                     changeRowsPerPage={changeRowsPerPage}
        //                     changePage={changePage}
        //                     textLabels={textLabels}
        //                 />
        //             </div> */}

        //         </div>
        //     );
        // },
    };



    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {

            const authheader = getAuthHeader()

            try {
                const baseURL = "https://tgc67.online/api/resource/GL%20Entry";
                const filters = encodeURIComponent(JSON.stringify([["account", "=", "Cash - TGC"]]));
                const fields = encodeURIComponent(JSON.stringify(["posting_date", "account", "remarks", "debit_in_account_currency", "credit_in_account_currency", "against", "voucher_no"]));
                const limit = "100000";
                const orderBy = "posting_date";
                const limitStart = "0";

                const url = `${baseURL}?filters=${filters}&fields=${fields}&limit=${limit}&order_by=${orderBy}&limit_start=${limitStart}`;

                const response = await get(url)

                if (!response.data) {
                    throw new Error("Failed to fetch data");
                }

                setTranscation(response?.data || []);

                const totalDebit = transcation.reduce((total, item) => total + item.debit_in_account_currency, 0);
                const totalCredit = transcation.reduce((total, item) => total + item.credit_in_account_currency, 0);

                // Add a total row to the transcation array
                // console.log(totalDebit)
                // const totalRow = {
                //     posting_date: "Total",
                //     voucher_no: "",
                //     debit_in_account_currency: totalDebit,
                //     credit_in_account_currency: totalCredit,
                //     against: "",
                // };

                setTranscation((prevTranscation) => [...prevTranscation]);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    // const title = (
    //     <div>
    //         <div className="col-md-6">
    //             Accounting Transactions  {" "}<span className="span-user-clr">{transcation.length}</span> {" "}
    //             Cash {" "}
    //             <span className="span-user-clr">{(transcation.reduce((total, item) => total + item.debit_in_account_currency, 0) - transcation.reduce((total, item) => total + item.credit_in_account_currency, 0))}</span>

    //         </div>
    //         <div className="col-md-9">

    //         </div>
    //     </div>
    // );

    return (
        <>
            <Siderbar />
            <div className='table-vw-size mbvw-tbl-scrl'>


                {loading ? (
                    <LoadingPage msg='Loading' />
                ) : (

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
                                        Accounting Transactions{' '}
                                        <span className='span-user-clr'>{transcation.length}</span>
                                    </div>

                                    <div className='col-6'>
                                        Cash{' '}
                                        <span className='span-user-clr'>
                                            {'$ '}
                                            {(transcation.reduce((total, item) => total + item.debit_in_account_currency, 0) - transcation.reduce((total, item) => total + item.credit_in_account_currency, 0))}
                                        </span>
                                    </div>
                                </h6>
                                {/* { const totalDebit = transcation.reduce((total, item) => total + item.debit_in_account_currency, 0);
            const totalCredit = transcation.reduce((total, item) => total + item.credit_in_account_currency, 0);} */}
                            </div>
                        }

                        data={transcation}
                        columns={columns}
                        options={options}
                    />

                )}
            </div>
        </>
    );
};

export default withAuth(Index);

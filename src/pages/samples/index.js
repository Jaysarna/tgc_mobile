import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { getAuthHeader } from "@/helpers/Header";
import withAuth from "@/customhook/withAuth";
import Siderbar from "@/helpers/siderbar";
import { LoadingPage } from "@/helpers/Loader";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Head from "next/head";


const Index = () => {
    const [sampleList, setSampleList] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter()



    const columns = [
        {
            name: 'parenttype',
            label: 'Invoice Type',
            options: {
                display: 'none'
            }
        },
        {
            name: 'parent',
            label: 'Invoice',
            options: {
                display: 'none'
            }
        },
        {
            name: 'party_name',
            label: 'Party Name',
            options: {
                display: 'none'
            }
        },
        {
            name: "creation",
            label: "Date",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    return (
                        <span>{moment(value).format("MMM Do YYYY")}</span>
                    )
                },
            },
        },
        {
            name: "qty",
            label: "QTY",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "item_name",
            label: "Sample Name",
            options: {
                filter: true,
                sort: false,
            },
        },

        {
            name: "create_invoice",
            label: "Create Invoice",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (dataIndex, tableMeta) => {
                    const pType = tableMeta.rowData[0]
                    const invoice = tableMeta.rowData[1]
                    const party_name = tableMeta.rowData[2]
                    const name = tableMeta.rowData[4]
                    return (
                        <>
                            {party_name && (pType == 'Sales Invoice' ?
                                <button className="btn btn-primary" onClick={() => {
                                    router.push(`/customer/${party_name}/sample-list/${invoice}/edit-sample-to-invoice`)
                                }}>Sales</button> :
                                <button className="btn btn-primary" onClick={() => {
                                    //  router.push(`/purchase/invoice/${invoice}/${name}/return`)
                                    router.push(`/supplier/${party_name}/sample-list/${invoice}/edit-sample-to-invoice`)
                                }}>Purchase</button>)
                            }
                        </>

                    )

                },
            },
        },
    ];


    useEffect(() => {
        const fetchData = async () => {
            const authheader = getAuthHeader();

            try {
                const baseURL = "https://tgc67.online/api/method/all_samples";


                const response = await axios.get(baseURL, authheader);

                if (!response.data) {
                    throw new Error("Failed to fetch data");
                }

                setSampleList(response.data.message || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [filterType, setFilterType] = useState("supplier");

    const handleSupplierSamplesClick = () => {
        setFilterType("supplier");
    };

    const handleCustomerSamplesClick = () => {
        setFilterType("customer");
    };


    const toggleFilterType = (type) => {
        if (filterType === type) {
            setFilterType("all");
        } else {
            setFilterType(type);
        }
    };

    const filteredSampleList = sampleList.filter(sample => {
        if (filterType === "supplier") {
            return sample.parenttype === "Purchase Invoice";
        } else if (filterType === "customer") {
            return sample.parenttype === "Sales Invoice";
        }
        return true;
    });



    return (
        <>
            <Head>
                <title>Sample List</title>
            </Head>
            <Siderbar />
            <div className="container-2">
                {loading ? (
                    <LoadingPage msg="Loading" />
                ) : (
                    <MUIDataTable
                        // title="Samples "
                        title={
                            <>

                                <h6 className='row__title p-3 d-flex align-items-center'>
                                    <div
                                        className='p-2'
                                        onClick={() => {
                                            router.push('/main')
                                        }}
                                    >
                                        <ArrowBackIcon className='' />
                                    </div>
                                    <div className='col-md-5'>
                                        Sample List{' '}
                                        <span className='span-user-clr'>
                                            {sampleList && sampleList.length}{' '}
                                        </span>
                                    </div>



                                </h6>
                                <div className='col-12 d-flex header-btn-outer'>
                                    <button className={`btn btn-primary supplier-btn ${filterType === 'supplier' ? 'active' : ''}`} onClick={() => toggleFilterType('supplier')}>
                                        Samples taken from suppliers
                                    </button>
                                    <button className={`btn btn-primary supplier-btn ${filterType === 'customer' ? 'active' : ''}`} onClick={() => toggleFilterType('customer')}>
                                        Samples given to customer
                                    </button>

                                </div>
                            </>
                        }
                        // data={sampleList}
                        data={filteredSampleList}
                        columns={columns}
                        options={{
                            filterType: 'dropdown',
                            responsive: "standard",
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default withAuth(Index);

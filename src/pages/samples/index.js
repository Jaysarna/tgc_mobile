import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { getAuthHeader } from "@/helpers/Header";
import withAuth from "@/customhook/withAuth";
import Siderbar from "@/helpers/siderbar";
import { LoadingPage } from "@/helpers/Loader";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";

const Index = () => {
    const [supplerList, setSupplierList] = useState([]);
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

                setSupplierList(response.data.message || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Siderbar />
            <div className="container-2">
                {loading ? (
                    <LoadingPage msg="Loading" />
                ) : (
                    <MUIDataTable
                        title="Samples "
                        data={supplerList}
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

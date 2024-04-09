import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { getAuthHeader } from "@/helpers/Header";
import withAuth from "@/customhook/withAuth";
import Siderbar from "@/helpers/siderbar";
import { LoadingPage } from "@/helpers/Loader";
import axios from "axios";

const columns = [
    {
        name: "posting_date",
        label: "Date",
        options: {
            filter: true,
            sort: true,
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
        name: "sample_name",
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
            customBodyRender: () => <span>+</span>,
        },
    },
];

const Index = () => {
    const [supplerList, setSupplierList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const authheader = getAuthHeader();

            try {
                const baseURL = "https://tgc67.online/api/method/supplier_with_samples";
                // ... (rest of your code remains unchanged)

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
                        title="Your Table Title"
                        data={supplerList.map(({ posting_date, qty, sample_name }) => [
                            posting_date,
                            qty,
                            sample_name,
                            <span>+</span>,
                        ])}
                        columns={columns}
                        options={{
                            filterType: "checkbox",
                            responsive: "scroll",
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default withAuth(Index);

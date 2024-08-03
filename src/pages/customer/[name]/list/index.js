import { get } from '@/configs/apiUtils';
import withAuth from '@/customhook/withAuth';
import Siderbar from '@/helpers/siderbar';
import moment from 'moment';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getTotal } from '@/helpers/common';




const CustomerDetails = () => {

    const router = useRouter();
    const [customerData, setCustomerData] = useState([])
    const { name } = router.query;

    async function fetchTransactionList() {
        try {
            const res = await get(`https://tgc67.online/api/resource/GL%20Entry?filters=[["account", "=", "Debtors - TGC"],["party_type","=","Customer"],["party", "=", "${name}"]]&fields=["posting_date","account","debit_in_account_currency","credit_in_account_currency","against","voucher_no"]&limit=20&order_by=posting_date&limit_start=0`);
            // console.log(res
            setCustomerData(res?.data)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!router?.isReady) return
        fetchTransactionList()
    }, [router?.isReady])


    const glColumns = [
        {
            name: 'posting_date', label: 'Posting Date', options: {
                customBodyRender: (value, tableMeta) => (

                    <>
                        {moment(value).format('DD-MM-yyyy')}
                    </>
                )
            }
        },
        { name: 'debit_in_account_currency', label: 'Debit' },
        { name: 'credit_in_account_currency', label: 'Credit' },
        { name: 'against', label: 'Against' },
        { name: 'voucher_no', label: 'Voucher No.' },
    ];

    const handleRowClick = (rowData) => {
        const voucherNo = rowData[4];

        router.push(`/sales/invoice/view/${voucherNo}`);
    };


    return (
        <>
            <Siderbar />
            <div className='table-vw-size mbvw-tbl-scrl'>
                <MUIDataTable
                    title={
                        <div className="container row p-3">
                            <h6 className='row__title p-3 d-flex align-items-center'>
                                <div
                                    className='p-2'
                                    onClick={() => {
                                        router.push('/customer')
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ArrowBackIcon />
                                </div>
                                <div className='col-md-4'>
                                    {name} {' '}
                                    <span className='span-user-clr'>{customerData.length}</span>
                                </div>


                                <div className='col-md-4'>
                                    Debit Total {' '}
                                    <span className='span-user-clr'> {getTotal(customerData, 'debit_in_account_currency')}</span>
                                </div>


                                <div className='col-md-4'>
                                    Credit Total {' '}
                                    <span className='span-user-clr'> {getTotal(customerData, 'credit_in_account_currency')}</span>
                                </div>

                            </h6>
                        </div>
                    }

                    data={customerData || []}
                    columns={glColumns}
                    options={{
                        filterType: 'dropdown',
                        responsive: 'standard',
                        selectableRows: 'none',
                        viewColumns: false,
                        pagination: true,
                        elevation: 0,

                        textLabels: {
                            body: {
                                noMatch: 'No GL Entries Found',
                            },
                        },
                        print: false,
                        onRowClick: handleRowClick,

                    }}
                />
            </div>
        </>

    );
};



export default withAuth(CustomerDetails);
import { useEffect, useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { useRouter } from 'next/router';
import MUIDataTable from 'mui-datatables';
import { AddIcon, EditIcon } from '@/icons/actions';
import { handleError } from '@/Api/showError';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { get } from '@/configs/apiUtils';
import { getSupplierList, getSupplierOutstandingList } from '@/features/supplier/supplier.services';
import Link from 'next/link';

const ItemList = () => {
    return (
        <div>
            <Siderbar />
            <DataTable />
        </div>
    );
};

export default withAuth(ItemList);

const DataTable = () => {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);
    const [sampleData, setSampleData] = useState([]);
    const [sample, setSample] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    async function fetchData() {
        try {
            const res = await getSupplierOutstandingList();
            // const res1 = await getSupplierList(page * rowsPerPage, rowsPerPage);
            const res1 = await getSupplierList();

            const outstandingData = res.message.map(([name, amount, date]) => ({ name, amount, date }));

            const supplierMap = new Map();

            res1.data.forEach(supplier => {
                supplierMap.set(supplier.name, { name: supplier.name });
            });

            outstandingData.forEach(outstanding => {
                if (supplierMap.has(outstanding.name)) {
                    supplierMap.set(outstanding.name, { ...supplierMap.get(outstanding.name), ...outstanding });
                } else {
                    supplierMap.set(outstanding.name, outstanding);
                }
            });

            const mergedData = Array.from(supplierMap.values());

            console.log(mergedData)

            setTableData(mergedData);
            setTotalRecords(mergedData.length);
        } catch (err) {
            // console.log('working')
            setTableData([]);
            setTotalRecords(0); // Reset total records on error
            console.log(err);
            if (err.response?.status === 403) {
                sessionStorage.clear();
            } else {
                handleError(err);
            }
        }
    }

    async function fetchSampleData() {
        try {
            const listRes = await get('supplier_with_samples');
            setSampleData(listRes.message);
            setTotalRecords(listRes.message.length);
        } catch (err) {
            console.log(err);
            setTotalRecords(0);
            if (err.response?.status === 403) {
                sessionStorage.clear();
            } else {
                handleError(err);
            }
        }
    }

    const handleSample = () => {
        if (sample === 0) {
            fetchSampleData();
            setSample(1);
        } else {
            fetchData();
            setSample(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // useEffect(() => {
    //     fetchData()
    // }, [page, rowsPerPage]);

    const columns = !sample
        ? [
            { name: 'Date', options: { customBodyRender: value => (value?.date ? moment(value?.date).format('l') : '-') } },
            { name: 'Supplier Name', options: { customBodyRender: value => <Link href={`/supplier/${value?.name}/list`}> {value?.name}</Link> } },
            { name: 'Outstanding Amount', options: { customBodyRender: value => (value?.amount ? '$' + value?.amount : '-') } },
            {
                name: 'Make a Payment',
                options: {
                    customBodyRender: (value, tableMeta) =>
                        tableMeta.rowData[0]?.amount ? (
                            <AddIcon
                                className="plus-icon-btn"
                                onClick={() => router.push(`/supplier/${tableMeta.rowData[0]?.name}/make-payment`)}
                            />
                        ) : (
                            <AddIcon className="plus-icon-btn-disable" />
                        )
                }
            },
            { name: 'Edit', options: { customBodyRender: (value, tableMeta) => <EditIcon onClick={() => router.push(`/supplier/${tableMeta.rowData[1]?.name}/edit`)} /> } },
        ]
        : [
            { name: 'Supplier', options: { customBodyRender: value => <div>{value}</div> } },
            {
                name: 'Invoices',
                options: {
                    customBodyRender: value => (
                        <div>
                            {value.map(invoice => (
                                <div key={invoice.invoice}>
                                    <div>{invoice.invoice} {" "} {moment(invoice?.posting_date).format('DD MMM YY')}</div>
                                    <div>{invoice.item_list.map(item => <div key={item}>{item}</div>)}</div>
                                </div>
                            ))}
                        </div>
                    )
                }
            },
        ];

    const data = !sample
        ? tableData.map(item => [item, item, item, item, item])
        : sampleData.map(item => [item.supplier, item.invoices]);

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        selectableRows: 'none',
        textLabels: { body: { noMatch: 'No Records Found' } },
        print: false,
        pagination: true,
        count: totalRecords,
        // count: (totalRecords >= 10 ? (totalRecords * (page + 1)) + rowsPerPage : totalRecords + rowsPerPage),
        rowsPerPage: rowsPerPage,
        rowsPerPageOptions: [5, 10, 15, 20],
        // onChangePage: currentPage => setPage(currentPage),
        // onChangeRowsPerPage: numberOfRows => {
        //     setRowsPerPage(numberOfRows);
        //     setPage(0);
        // },
    };

    console.log(data)


    return (
        <div className='table-vw-size mbvw-tbl-scrl'>
            <MUIDataTable
                title={
                    <div className="container row p-3">
                        <h6 className='row__title p-3 d-flex align-items-center'>
                            <div className='p-2' onClick={() => router.push('/main')} style={{ cursor: 'pointer' }}>
                                <ArrowBackIcon />
                            </div>
                            <div className='col-md-5'>
                                Supplier List<span className="span-user-clr"> ({totalRecords})</span>
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
                                    <strong className="form-check-strong" htmlFor="docStatusCheckbox" style={{ marginTop: '3px' }}>
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


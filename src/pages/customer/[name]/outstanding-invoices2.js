import React, { useEffect, useState } from 'react'
// import './customerList.module.css';
import Siderbar from '@/helpers/siderbar'
import withAuth from '@/customhook/withAuth'
import axios from 'axios'
import { getAuthHeader } from '@/helpers/Header'
import { useRouter } from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const outstandingInvoices = () => {
  const router = useRouter()
  const { name } = router.query
  // console.log(name)
  const [tableData, setTableData] = useState([])

  // async function fetchOutstanding() {
  //     try {
  //         const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice/';
  //         const filters = JSON.stringify([["customer", "=", name], ["docstatus", "=", "1"], ["status", "!=", "Cancel"]]);
  //         const fields = JSON.stringify(["name", "customer", "grand_total", "outstanding_amount"]);

  //         const url = `${apiUrl}?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`;

  //         console.log(url)
  //         const res = await axios.get(url, authHeader);

  //         if (res.data && res.data.data) {
  //             setTableData(res.data.data);
  //         } else {
  //             console.error('Invalid response structure:', res.data);
  //         }
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  // jay code
  // async function fetchOutstanding() {
  //     try {
  //       const apiUrl = 'https://tgc67.online/api/resource/Sales%20Invoice/';

  //       const filters = [
  //         { name: 'customer', value: name, operator: '=' },
  //         { name: 'docstatus', value: '1', operator: '=' },
  //         { name: 'status', value: 'Cancel', operator: '!=' }
  //       ];
  //       const params = new URLSearchParams();

  //       filters.forEach((filter) => {
  //         params.append('filters', JSON.stringify([[filter.name, filter.operator, filter.value]]));
  //       });

  //       params.append('fields', JSON.stringify(['name', 'customer', 'grand_total', 'outstanding_amount']));

  //       const url = `${apiUrl}?${params.toString()}`;

  //       const res = await axios.get(url, authHeader);

  //       if (res.data && res.data.data) {
  //         setTableData(res.data.data);
  //       } else {
  //         console.error('Invalid response structure:', res.data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  async function fetchOutstanding(name) {
    const authHeader = getAuthHeader()

    var requestOptions = {
      method: 'GET',
      headers: authHeader.headers,
      redirect: 'follow'
    }

    fetch(
      `https://tgc67.online/api/resource/Sales%20Invoice?filters=%5B%5B%22customer%22%2C%22%3D%22%2C%22${name}%22%5D%2C%5B%22docstatus%22%2C%22%3D%22%2C%221%22%5D%2C%5B%22status%22%2C%22!%3D%22%2C%22Cancel%22%5D%5D&fields=%5B%22name%22%2C%22customer%22%2C%22grand_total%22%2C%22outstanding_amount%22%5D`,
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        console.log(result.data)
        if (result.data) {
          setTableData(result.data)
        }
      })
      .catch(error => {
        console.log('error', error)
        setTableData([])
      })
  }

  useEffect(() => {
    if (name) {
      console.log(name)
      fetchOutstanding(name)
    }
  }, [name])

  return (
    <>
      <Siderbar />

      <DataTable
        head={['Customer Name', 'Grand Total', 'Outstanding Amount']}
        title='Customer'
        newIocn={false}
        tableData={tableData}
      />
    </>
  )
}

export default withAuth(outstandingInvoices)

const DataTable = ({ tableData, head }) => {
  const router = useRouter()
  return (
    <>
      <div className='table-vw-size'>
        {/* <div className="row row--top-40">
                    <div className="col-md-12"></div>
                </div> */}
        <div className='row row--top-20'>
          <div className='col-md-12'>
            <div className='table-container'>
              <h6 className='row__title p-3 d-flex align-items-center'>
                <div
                  className='p-2'
                  onClick={() => {
                    router.push('/customer')
                  }}
                >
                  <ArrowBackIcon className='' />
                </div>
                Outstanding Amount{' '}
                <span className='span-user-clr'>
                  {tableData && tableData.length}{' '}
                </span>
              </h6>

              <table className='w-100'>
                <thead className='table__thead'>
                  <tr className='tbl-head-bgvw'>
                    <th className='table__th'>Customer Name</th>
                    <th className='table__th'>
                      Outstanding Amount <i className='bi bi-arrow-down'></i>
                    </th>
                    {/* <th className="table__th">Outstanding Amount</th> */}
                    <th className='table__th'>Grand Total</th>
                    {/* <th className="table__th">Teams</th> */}
                    {/* <th className="table__th"></th>
                                        <th className="table__th"></th> */}
                  </tr>
                </thead>
                <tbody className='table__tbody'>
                  {tableData.length > 0 &&
                    tableData.map(item => {
                      return (
                        <TableDataList
                          customer={item.customer}
                          amount={item.outstanding_amount}
                          total={item.grand_total}
                          name={item.name}
                        />
                      )
                    })}
                </tbody>
              </table>
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const TableDataList = ({ amount, name, customer, total }) => {
  const route = useRouter()
  async function handleEdit(name) {
    route.push('/customer/' + name + '/edit')
  }

  return (
    <>
      <tr className='table-row table-row--chris'>
        {/* <td className="table-row__td">
                        <input
                          id=""
                          type="checkbox"
                          className="table__select-row"
                        />
                      </td> */}
        <td className='table-row__td'>
          {/* <div className="table-row__img"></div> */}
          <div className='table-row__info'>
            <p className='table-row__name'>{name}</p>
            <span className='table-row__small'>{customer}</span>
          </div>
        </td>
        <td data-column='Outstanding Amount' className='table-row__td'>
          {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
          <p className='table-row__status'>
            <i className='bi bi-currency-dollar'></i> {amount}
          </p>
        </td>
        <td data-column='Outstanding Amount' className='table-row__td'>
          {/* <p className="table-row__status status--green status team-bg-clr">
                          Active
                        </p> */}
          <p className='table-row__status'>
            <i className='bi bi-currency-dollar'></i> {total}
          </p>
        </td>
      </tr>
    </>
  )
}

const Pagination = () => {
  return (
    <>
      <div className='pgn-vw-box mt-3 p-2' style={{ overflow: 'scroll' }}>
        <div className='pre-btnvw d-flex'>
          {/* <i className="bi bi-arrow-left fs-5 mt-1"></i> */}
          <ArrowBackIcon className='mt-1' />
          <p className='mt-2 mb-vw-page'>Previous</p>
        </div>

        <div className='pagination'>
          <p>1</p>
          <p className='ms-2'>2</p>
          <p className='ms-2'>3</p>
          <p className='ms-2'>4</p>
          <p className='ms-2'>5</p>
        </div>
        {/* <div><p className='mb-pagefnt-size'>Page 1 to 10</p></div> */}
        {/* <p className="pre-btnvw">Next <i className="bi bi-arrow-right fs-5"></i></p> */}
        <div className='pre-btnvw d-flex'>
          <p className='mt-2 mb-vw-page'>Next</p>
          {/* <i className="bi bi-arrow-right fs-5 mt-1"></i> */}
          <ArrowForwardIcon className='mt-1' />
        </div>
      </div>
    </>
  )
}

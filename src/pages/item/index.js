import React, { useEffect, useState } from 'react'
import MUIDataTable from 'mui-datatables'
import Siderbar from '@/helpers/siderbar'
import axios from 'axios'
import withAuth from '@/customhook/withAuth'
import { useRouter } from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getAuthHeader } from '@/helpers/Header'
import moment from 'moment'

const ItemList = () => {
  const [tableData, setTableData] = useState([])
  const router = useRouter()

  async function fetchItemList() {
    const authHeader = getAuthHeader()
    try {
      const res = await axios.get(
        'https://tgc67.online/api/method/item_list',
        authHeader
      )
      setTableData(res.data.message)
    } catch (err) {
      console.log(err)
      setTableData([])
    }
  }

  useEffect(() => {
    fetchItemList()
  }, [])

  const columns = [
    {
      name: 'item_code',
      label: 'Item Code',
      options: {
        display: false,
      },
    },
    {
      name: 'item_name',
      label: 'Item',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const item_code = tableMeta.rowData[0]
          return (
            <>
              <p onClick={() => {
                router.push(`/item/${item_code}/edit`)
              }} style={{ cursor: 'pointer' }}>{value}</p>
            </>
          )
        }
      }
    },
    {
      name: 'posting_date',
      label: 'Last Date',
      options: {
        customBodyRender: value => {
          return <> {value ? moment(value).format('DD-MM-YYYY') : 'N/A'}</>
        }
      }
    },
    {
      name: 'actual_qty',
      label: 'QTY Purchased'
    },
    {
      name: 'supplier_price',
      label: 'Supplier Price',
      options: {
        customBodyRender: value => {
          return <>$ {value}</>
        }
      }
    },
    {
      name: 'last_sale_price',
      label: 'Last Sale Price',
      options: {
        customBodyRender: value => {
          return <>$ {value}</>
        }
      }
    },
    {
      name: 'actual_qty',
      label: 'Available Stock'
    },
    {
      name: 'item_code',
      label: 'New Invoice',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <button
              className='btn btn-primary new-row login-btn'
              type='button'
              style={{ maxWidth: '130px', padding: '4px !important' }}
              onClick={() => {
                localStorage.setItem('saleItem', value)
                localStorage.setItem('saleQuan', tableMeta.rowData[1])
                localStorage.setItem('saleRate', tableMeta.rowData[3])
                router.push('/sales/invoice/new-invoice')
              }}
            >
              New Invoice
            </button>
          )
        }
      }
    }
  ]

  const options = {
    filterType: 'dropdown',
    responsive: 'standard',
    textLabels: {
      body: {
        noMatch: 'No Records Found'
      }
    },
    print: 'false'
  }

  return (
    <div>
      <Siderbar />
      <div className='table-vw-size mbvw-tbl-scrl'>
        <MUIDataTable
          title={
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
                Item List{' '}
                <span className='span-user-clr'>
                  {tableData && tableData.length}{' '}
                </span>
              </div>

              <div className='col-md-12'>
                Inventory Value{' '}
                <span className='span-user-clr'>
                  {tableData.length > 0
                    ? tableData.reduce(
                      (total, item) => total + item.last_sale_price,
                      0
                    )
                    : 0}
                </span>
              </div>
            </h6>
          }
          data={tableData}
          columns={columns}
          options={options}
          pagination={true}
        />
      </div>
    </div>
  )
}

export default withAuth(ItemList)

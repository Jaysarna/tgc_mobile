import { useRouter } from "next/router";
import React from "react";

const DataTable = ({ head, title, newIcon, tableData }) => {

  return (
    <>

      <div className="container-1" style={{ margin: 'auto' }}>
        <div className="row-1 row--top-40">
          <div className="col-md-12">
            <h2 className="row__title">{title} </h2>
          </div>
        </div>
        <div className="row-1 row--top-20">
          <div className="col-md-12">
            <div className="table-container">
              <table className="table">
                <thead className="table__thead">
                  <tr>

                    {
                      head.map((item) => {
                        return (
                          <th className="table__th">{item}</th>
                        )
                      })
                    }

                    <th className="table__th"></th>
                  </tr>
                </thead>
                <tbody className="table__tbody">
                  {
                    tableData.map((listItem) => {
                      return (
                        <>
                          <TableDataList
                            name={listItem.item_name} // Update the name to item_name
                            icon={newIcon}
                            item_code={listItem.item_code}
                            supplier_price={listItem.supplier_price}
                            last_sale_price={listItem.last_sale_price}
                            actual_qty={listItem.actual_qty}
                          />
                        </>
                      )
                    })
                  }


                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataTable;



const TableDataList = ({ item_code, name, supplier_price, last_sale_price, actual_qty }) => {

  const route = useRouter()

  return (
    <>
      <tr className="table-row table-row--chris">

        <td className="table-row__td">
          {/* <div className="table-row__img"></div> */}
          <div className="table-row__info">
            <p className="table-row__name">{item_code}</p>
            {/* <span className="table-row__small">CFO</span> */}
          </div>
        </td>
        <td data-column="Policy" className="table-row__td">
          <div className="">
            <p className="table-row__policy">{name}</p>
            {/* <span className="table-row__small">Basic Policy</span> */}
          </div>
        </td>
        <td data-column="Policy status" className="table-row__td">
          <p className="table-row__p-status  status">
            {supplier_price}
          </p>
        </td>
        <td data-column="Destination" className="table-row__td">
         {last_sale_price}
        </td>
        <td data-column="Status" className="table-row__td">
          <p className="table-row__status  status">
           {actual_qty}
          </p>
        </td>
        {<td data-column="" className="table-row__td">
          <button className="btn btn-primary new-row login-btn" type="button" style={{ maxWidth: "130px", padding: '4px !important' }} onClick={()=>{
            localStorage.setItem('saleItem',item_code)
            localStorage.setItem('saleQuan',actual_qty)
            localStorage.setItem('saleRate',last_sale_price)
            route.push('/sales/invoice/new-invoice')
          }}>New Invoice</button>
        </td>}


      </tr>
    </>
  )
}

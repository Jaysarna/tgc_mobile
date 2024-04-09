import React from 'react';
import '@/helpers/list.module.css';
import Head from 'next/head';
// import Link from 'next/link';


const ListDesign = () => {
    return (
        <>
           <Head>
           
            </Head> 
            <div>
                <div className="container">
                    <div className="row row--top-40">
                        <div className="col-md-12">
                            <h2 className="row__title">Employees (7)</h2>
                        </div>
                    </div>
                    <div className="row row--top-20">
                        <div className="col-md-12">
                            <div className="table-container">
                                <table className="table">
                                    <thead className="table__thead">
                                        <tr>
                                            <th className="table__th"><input id="selectAll" type="checkbox" className="table__select-row" /></th>
                                            <th className="table__th">Name</th>
                                            <th className="table__th">Policy</th>
                                            <th className="table__th">Policy status</th>
                                            <th className="table__th">Destination</th>
                                            <th className="table__th">Status</th>
                                            <th className="table__th">Progress</th>
                                            <th className="table__th"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="table__tbody">
                                        <tr className="table-row table-row--chris">
                                            <td className="table-row__td">
                                                <input id="" type="checkbox" className="table__select-row" />
                                            </td>
                                            <td className="table-row__td">
                                                <div className="table-row__img"></div>
                                                <div className="table-row__info">
                                                    <p className="table-row__name">Christin Ericssen</p>
                                                    <span className="table-row__small">CFO</span>
                                                </div>
                                            </td>
                                            <td data-column="Policy" className="table-row__td">
                                                <div className="">
                                                    <p className="table-row__policy">$5,000</p>
                                                    <span className="table-row__small">Basic Policy</span>
                                                </div>
                                            </td>
                                            <td data-column="Policy status" className="table-row__td">
                                                <p className="table-row__p-status status--green status">Approved</p>
                                            </td>
                                            <td data-column="Destination" className="table-row__td">
                                                Huston, US
                                            </td>
                                            <td data-column="Status" className="table-row__td">
                                                <p className="table-row__status status--green status">Active</p>
                                            </td>
                                            <td data-column="Progress" className="table-row__td">
                                                <p className="table-row__progress status--blue status">On Track</p>
                                            </td>

                                            <td className="table-row__td">

                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </div>


            </div >
        </>
    );
}

export default ListDesign;






import React, { useEffect, useState } from "react";
import Siderbar, { ContextMenu } from "../helpers/siderbar";
import axios from "axios";
import withAuth from "@/customhook/withAuth";
import { handleError } from "@/Api/showError";
import { useRouter } from "next/router";
import Head from "next/head";


const apiUrl = 'https://tgc67.online/api/method/number_card';

const symbol = [
    "+",
    "+",
    "-",
    "="
];


const cardRouting = [
    "/transcation/list",
    "/item",
    "/customer",
    "purchase/invoice",
    "/main"
]

const Main = () => {

    const router = useRouter()
    const [cardData, setCardData] = useState([])

    async function fetchData() {
        try {
            const res = await axios.get(apiUrl)
            setCardData(res.data.message)
            console.log(res.data.message)
        }
        catch (err) {
            console.log(err)
            if (err.response?.status === 403) {
                alert("Login Expired")
                router.push('/')
            }
            else {
                handleError(err)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Head>
                <title>TGC APP</title>
            </Head>
            <Siderbar />
            <div className="card-container main-item-card-outer">

                {cardData.length > 0 && cardData.map((item, index) => (
                    <>
                        <ItemCard
                            key={index}
                            name={item.name}
                            amount={item.money}
                            url="/main"
                            color={item.color}
                            id={index}
                        />
                        <span className="card-plus">{symbol[index]}</span>
                    </>


                ))

                }
                <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => { router.push('/samples') }}>

                    <div className="product-text">
                        <h6 style={{ color: 'green' }}>Samples</h6>
                        <span>{'item'}</span>
                        <p style={{ fontSize: "22px" }}></p>


                    </div>

                </div>
            </div >

        </>
    )
}

export default withAuth(Main);




const ItemCard = ({ name, amount, url, color, span, id }) => {

    const route = useRouter();

    function handleRouting() {
        const routeValue = cardRouting[id]
        // console.log(routeValue)
        route.push(routeValue)
    }

    return (
        <>
            <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => handleRouting()}>

                <div className="product-text">
                    <h6 style={{ color: color }}>{name}</h6>
                    <span>{span}</span>
                    <p style={{ fontSize: "22px" }}>$ {amount}</p>


                </div>

            </div>
        </>
    )
}


import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

var user;

const Siderbar = ({ children }) => {


    const [isOpen, setIsopen] = useState(false);
    const [openProfile, setProfile] = useState(false)

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }

    const route = useRouter()

    const handleRoutePage = (link) => {
        route.push(link)
    }

    async function logout() {
        try {
            const res = await axios.get('https://tgc67.online/api/method/user?cmd=logout')
            console.log(res.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function handleLogOut() {
        localStorage.clear()
        sessionStorage.clear()
        logout();
        handleRoutePage('/')
    }

    useEffect(() => {
        user = sessionStorage.getItem('userName') ? sessionStorage.getItem('userName') : 'Master';
    }, [])

    return (
        <>


            <div>
                <div className="">

                    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
                        <div className="container-fluid p-2 header">

                            <div className="btn btn-primary iconOuter" onClick={ToggleSidebar}  >
                                <i className="fa-solid fa-bars"></i>
                            </div>
                            <a className="navbar-brand-user text-primary mr-0">
                                <button className="btn btn-primary login-btn" type="submit" onClick={() => {
                                    route.push('/main')
                                }}>Home</button>

                            </a>
                            <Notification />




                        </div>
                    </nav>
                    <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                        <div className="sd-header">
                            <h4 className="mb-0">{user}</h4>
                            <div className="btn btn-primary iconOuter" onClick={ToggleSidebar}><i className="fa-solid fa-right-to-bracket fa-rotate-180"></i></div>
                        </div>
                        <div className="sd-body">
                            <ul>

                                <li className="sd-link" onClick={() => handleRoutePage('/item')}>Item Inventory</li>
                                <li className="sd-link" onClick={() => handleRoutePage('/supplier')}>Supplier List</li>
                                <li className="sd-link" onClick={() => handleRoutePage('/customer')}>Customer List</li>
                                {/* <Link href='/sales' className='sd-link'>Supplier List</Link> */}
                                <li className="sd-link" onClick={() => handleRoutePage('/purchase/invoice')}>All Purchase Invoices</li>
                                <li className="sd-link" onClick={() => handleRoutePage('/sales/invoice')}>All Sales Invoices</li>

                                <li className="sd-link" onClick={() => handleRoutePage('/transcation/list')}>Transcation List</li>
                                {/* <li className="sd-link" onClick={() => handleRoutePage('/samples/supplier')}>Samples List</li> */}

                                {/* <li className="sd-link" onClick={() => handleRoutePage('/customer')}>Customer List</li> */}
                                {/* <li className="sd-link" onClick={() => handleRoutePage('/item')}>All Purchase Invoices</li>
                                <li className="sd-link" onClick={() => handleRoutePage('/supplier')}>All Sales Invoices</li> */}
                                <DropLi
                                    nav='Other Features '
                                    navItems={[
                                        {
                                            name: 'Add/Remove Money',
                                            url: '/add-remove-money'
                                        },
                                        {
                                            name: 'Add Existing Stock',
                                            url: '/add-existing-stock'
                                        }

                                    ]}
                                    handleRoutePage={handleRoutePage}
                                />

                            </ul>
                        </div>
                        <li className="sd-link logoutbtn" onClick={() => handleLogOut()}>LogOut <i className="fa-solid fa-power-off ms-3"></i></li>

                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
                </div>
                {children}

            </div>
            <ContextMenu />
        </>
    );
}

export default Siderbar;



const DropLi = ({ nav, navItems, handleRoutePage }) => {

    const [isNavOpen, setIsNavOpen] = useState(false)

    return (
        <>

            <li onClick={() => setIsNavOpen(!isNavOpen)} className="sd-link">{nav}
                {<i className="fa-solid fa-sort-down" style={{ transform: isNavOpen && 'rotate(180deg)' }}></i>}
            </li>
            {
                isNavOpen && navItems.length > 0 && navItems.map((item, i) => {
                    return (
                        <div key={i} className="navbarLi">

                            <li className="sd-link" style={{ paddingLeft: '30px' }} onClick={() => handleRoutePage(item.url)}>{item.name}</li>
                        </div>
                    )
                })
            }


        </>
    )
}


const ContextMenu = () => {

    const [isMenuOpened, setIsMenuOpened] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpened(!isMenuOpened);
    };

    const route = useRouter()

    const handleRoutePage = (link) => {
        route.push(link)
    }
    // Close the menu when a click occurs outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpened && !event.target.closest(".menuOuter")) {
                setIsMenuOpened(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isMenuOpened]);

    return (
        <>
            <div className="menuOuter">
                <div className="more-menu" onClick={toggleMenu} style={isMenuOpened ? {
                    transform: 'rotate(45deg)', zoom: 1.4, "bottom": "26px",
                    "right": "17px"
                } : []}>
                    {<i className="fa-solid fa-circle-plus"></i>}
                </div>

                {isMenuOpened && <nav className="more-options">
                    <section>
                        <li onClick={() => handleRoutePage('/customer/new-customer')}>Create a New Customer</li>

                        {/* // <li onClick={() => handleRoutePage('/item/newitem')}>Create New Item</li>*/}
                        {/* <li>Create a New Customer</li>   */}
                        <li onClick={() => handleRoutePage('/supplier/newsupplier')}>Create a New Supplier</li>
                        <li onClick={() => handleRoutePage('/purchase/invoice/new-invoice')}>Create Purchase Invoice</li>
                        <li onClick={() => handleRoutePage('/sales/invoice/new-invoice')}>Create Sales Invoice</li>
                        {/* // <li onClick={() => handleRoutePage('/main')}>Main Dashboard</li> */}
                        {/* <li onClick={() => handleRoutePage('/main')}>Sales Dashboard</li> */}
                        <li onClick={() => handleRoutePage('/payment/make-a-payment')}>Make a Payment</li>
                        <li onClick={() => handleRoutePage('/payment/recieve-a-payment')}>Receive a Payment</li>
                        {/* <li onClick={() => handleRoutePage('/journal-entry')}>Journal Entry</li> */}
                    </section>

                </nav>
                }

                {/* <div onClick={handleMenuClicked} className="contextMenu" /> */}


            </div >
        </>
    );
};


export { ContextMenu }




const Notification = () => {

    const [isOpenNotify, setOpenNotify] = useState(false)
    return (
        <>

            <div className="notification-outer">


                <div className="bell-outer" onClick={() => setOpenNotify(!isOpenNotify)}>
                    <div className="col-md-2">
                        <button className="btn btn-primary bell-icon"><i className="bi bi-bell"></i></button>
                    </div>

                </div>
                {<div className={`notification-wrapper${isOpenNotify ? '-active' : ''} card`}>
                    <li>This is notificaton This is notificaton This is notificaton This is notificaton</li>
                    <li>This is notificaton</li>
                </div>}
            </div>
        </>

    )
}
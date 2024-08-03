import { get } from '@/configs/apiUtils';
import { fetchOutstanding } from '@/customhook/outstanding';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, List, Typography } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


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
                                <li className="sd-link" onClick={() => handleRoutePage('/expenses/list')}>Expenses List</li>

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

                        <li onClick={() => handleRoutePage('/supplier/newsupplier')}>Create a New Supplier</li>
                        <li onClick={() => handleRoutePage('/purchase/invoice/new-invoice')}>Create Purchase Invoice</li>
                        <li onClick={() => handleRoutePage('/sales/invoice/new-invoice')}>Create Sales Invoice</li>

                        <li onClick={() => handleRoutePage('/payment/make-a-payment')}>Make a Payment</li>
                        <li onClick={() => handleRoutePage('/payment/recieve-a-payment')}>Receive a Payment</li>
                        <li onClick={() => handleRoutePage('/expenses/newexpenses')}>Add Expenses</li>
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

    const [isOpenNotify, setOpenNotify] = useState(false);
    const [totalCount, setTotal] = useState(0)

    function handleClose() {
        setOpenNotify(false)
    }
    function handleOpen() {
        setOpenNotify(true)
    }

    const [notifications, setNotifications] = useState([])


    function countUnseenMessages(data) {
        let unseenCount = 0;
        data.forEach(message => {
            if (message._seen === null) {
                unseenCount++;
            }
        });
        return unseenCount;
    }


    async function fetchNotification() {
        try {
            const res = await get('/resource/Notification%20Log?order_by=creation%20desc&limit=10&fields=["name","subject","email_content","_seen"]');
            setNotifications(res?.data)
            const count = countUnseenMessages(res?.data)
            setTotal(count)
            // console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchNotification()
    }, [])


    return (
        <>

            <div className="notification-outer">


                <div className="bell-outer" onClick={() => handleOpen()}>
                    <div className="col-md-2">
                        <button className="btn btn-primary bell-icon"><span className='notify-count'>{totalCount}</span><i className="bi bi-bell"></i></button>
                    </div>

                </div>

                {/* <Button onClick={() => handleOpen()}>open</Button> */}
                <Drawer
                    anchor={'right'}
                    open={isOpenNotify}
                    onClose={() => handleClose()}
                    className='notification-drawer'
                >
                    <h3 className='text-center mt-2'>Notifications</h3>
                    <hr />

                    {
                        notifications?.length > 0 && notifications?.map((notify) => {
                            return (
                                <NotificatonList
                                    noteData={notify}
                                    fetchNotification={fetchNotification}
                                />
                            )
                        })
                    }


                </Drawer>

            </div>
        </>

    )
}



// const CustomChip = ({ document_type }) => {
//     return (
//         <div className='custom-chip'>

//             <Chip label="success" color="success" />
//         </div>
//     )
// }




const NotificatonList = ({ noteData, fetchNotification }) => {

    const [isOpen, setOpen] = useState(false)


    async function markAsRead() {

        try {
            const res = await get(`/method/tgc_custom.server_script.has_seen.update_seen?notification_id=${noteData?.name}`)
            // console.log(res)npm 
            toast.success(res?.message)
            fetchNotification()
        }
        catch (err) {
            console.log(err)
        }

    }

    const handleOpen = () => {
        setOpen(true)
        markAsRead()
    };
    const handleClose = () => setOpen(false);

    return (
        <div key={noteData?.name}>
            {!noteData?._seen ?
                <div className='notifications' onClick={handleOpen}>

                    <div className='notify-dot'></div>

                    <div className='text-container'>
                        <h2 className='limit-1'>{noteData?.subject}</h2>
                        <p className='limit-2'>{noteData?.email_content}</p>
                    </div>
                </div>
                :
                <div className=' notifications nt-seen' onClick={handleOpen}>
                    <div className='notify-dot'></div>

                    <div className='text-container'>
                        <h2 className='limit-1'>{noteData?.subject}</h2>
                        <p className='limit-2'>{noteData?.email_content}</p>
                    </div>
                </div>
            }


            <Dialog onClose={handleClose} open={isOpen} sx={{ p: 4 }}>
                <DialogTitle sx={{ color: '#7f56d9', fontSize: '18px' }}>{noteData?.subject}</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom sx={{ color: "#666", fontSize: '14px' }}>
                        {noteData?.email_content}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        cancel
                    </Button>
                </DialogActions>
            </Dialog >
        </div>
    )
}






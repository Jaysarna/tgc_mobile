import Notification from '@/components/notification/notifications';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Divider,
    Typography
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Logout as LogoutIcon,
    AddCircle as AddCircleIcon,
    Receipt as ReceiptIcon,
    PersonAdd as PersonAddIcon,
    Inventory as InventoryIcon,
    Payment as PaymentIcon
} from '@mui/icons-material';
import {
    MoneyOff as MoneyOffIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import {
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    AttachMoney as AttachMoneyIcon,
    Assessment as AssessmentIcon,
    MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import Groups2Icon from '@mui/icons-material/Groups2';
import CloseIcon from '@mui/icons-material/Close';
import { useIsAdmin } from '@/utils/auth';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openOtherFeatures, setOpenOtherFeatures] = useState(false);
    const [isMasterFeature, setIsMasterFeature] = useState(false);
    const [user, setUser] = useState('Master');
    const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleRoutePage = (link) => {
        router.push(link);
    };

    const logout = async () => {
        try {
            await axios.get('https://tgc67.online/api/method/user?cmd=logout');
            localStorage.clear();
            sessionStorage.clear();
            handleRoutePage('/');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('userName') || 'Master';
        setUser(storedUser);
    }, []);

    const isAdmin = useIsAdmin();

    const mainMenuItems = [
        { label: 'Item Inventory', route: '/item', icon: <InventoryIcon /> },
        { label: 'Supplier Owed', route: '/supplier', icon: <MonetizationOnIcon /> }, // Represents money owed
        { label: 'Customer List', route: '/customer', icon: <PeopleIcon /> }, // Represents customers
        { label: 'All Purchase Invoices', route: '/purchase/invoice', icon: <ShoppingCartIcon /> }, // Shopping cart for purchases
        { label: 'All Sales Invoices', route: '/sales/invoice', icon: <ShoppingCartIcon /> }, // Shopping cart for sales
        { label: 'Transaction List', route: '/transcation/list', icon: <AssessmentIcon /> }, // Represents assessments or analysis
        { label: 'Expenses List', route: '/expenses/list', icon: <AttachMoneyIcon /> }, // Represents expenses or financial outflows
    ];

    const otherFeaturesItems = [
        { label: 'Add/Remove Money', route: '/add-remove-money', icon: <PaymentIcon /> },
        { label: 'Add Existing Stock', route: '/add-existing-stock', icon: <InventoryIcon /> },
    ];


    const masterItem = [
        { label: 'Users List', route: '/user/list', icon: <Groups2Icon /> },
        // { label: 'Add Existing Stock', route: '/add-existing-stock', icon: <InventoryIcon /> },
    ];






    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
                    <div className="container-fluid p-2 header ">
                        <IconButton onClick={toggleSidebar} className='btn btn-primary header-center-lines '>
                            <MenuIcon />
                        </IconButton>
                        <IconButton onClick={() => handleRoutePage('/main')}>
                            <HomeIcon />
                        </IconButton>
                        {isAdmin && <Notification />}
                    </div>
                </nav>

                <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                    <div className="sd-header">
                        <Typography variant="h6">{user}</Typography>
                        <div className='close-sidebar' onClick={toggleSidebar}>
                            <CloseIcon />
                        </div>
                    </div>
                    <Divider />

                    <List>
                        {mainMenuItems.map((item) => (
                            <ListItem
                                key={item.label}
                                className={`sidebar-list ${router.pathname === item.route ? 'active' : ''}`}
                                onClick={() => handleRoutePage(item.route)}
                            >
                                {item.icon}
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}

                        <ListItem className='sidebar-list' onClick={() => setOpenOtherFeatures(!openOtherFeatures)}>
                            <ListItemText primary="Other Features" />
                            {openOtherFeatures ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItem>
                        <Collapse in={openOtherFeatures} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {otherFeaturesItems.map((item) => (
                                    <ListItem
                                        key={item.label}
                                        className={`sidebar-list ${router.pathname === item.route ? 'active' : ''}`}
                                        onClick={() => handleRoutePage(item.route)}
                                    >
                                        {item.icon}
                                        <ListItemText primary={item.label} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        {
                            isAdmin &&
                            <>
                                <ListItem className='sidebar-list' onClick={() => setIsMasterFeature(!isMasterFeature)}>
                                    <ListItemText primary="Master" />
                                    {isMasterFeature ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItem>
                                <Collapse in={isMasterFeature} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {masterItem.map((item) => (
                                            <ListItem
                                                key={item.label}
                                                className={`sidebar-list ${router.pathname === item.route ? 'active' : ''}`}
                                                onClick={() => handleRoutePage(item.route)}
                                            >
                                                {item.icon}
                                                <ListItemText primary={item.label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        }



                        <ListItem className='sidebar-list' onClick={logout}>
                            <LogoutIcon />
                            <ListItemText primary="Log Out" />
                        </ListItem>
                    </List>
                </div>
                <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

                {children}
            </div>
            <ContextMenu />
        </>
    );
};

export default Sidebar;

const ContextMenu = () => {
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpened(!isMenuOpened);
    };

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
    const contextMenuItems = [
        { label: 'Create a New Item', route: '/item/newitem', icon: <AddCircleIcon /> },
        { label: 'Create a New Customer', route: '/customer/new-customer', icon: <PersonAddIcon /> },
        { label: 'Create a New Supplier', route: '/supplier/newsupplier', icon: <PersonAddIcon /> },
        { label: 'Create Purchase Invoice', route: '/purchase/invoice/new-invoice', icon: <ReceiptIcon /> },
        { label: 'Create Sales Invoice', route: '/sales/invoice/new-invoice', icon: <ReceiptIcon /> },
        { label: 'Make a Payment', route: '/payment/make-a-payment', icon: <PaymentIcon /> },
        { label: 'Receive a Payment', route: '/payment/recieve-a-payment', icon: <MoneyOffIcon /> },
        { label: 'Add Expenses', route: '/expenses/create-new', icon: <AssignmentIcon /> },
    ];


    return (
        <div className="menuOuter">
            <IconButton onClick={toggleMenu} >
                <AddCircleIcon style={isMenuOpened ? { transform: 'rotate(45deg)', zoom: 1.4 } : {}} />
            </IconButton>

            {isMenuOpened && (
                <nav className="more-options">
                    <List>
                        {contextMenuItems.map((item) => (
                            <ListItem
                                key={item.label}
                                className='sidebar-list-shortcut'
                                onClick={() => router.push(item.route)}
                            >
                                {/* {item.icon} */}
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                </nav>
            )}
        </div>
    );
};

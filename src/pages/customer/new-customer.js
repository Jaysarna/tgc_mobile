import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customhook/withAuth';
import { handleError } from '@/Api/showError';
import { getAuthHeader } from '@/helpers/Header';
import toast from 'react-hot-toast';
import { get, post } from '@/configs/apiUtils';
import { Autocomplete, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { LoadingPage } from '@/helpers/Loader';

const NewCustomer = () => {

    const [csGroupList, setCSGroupList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const customerTypes = ['Company', 'Individual', 'Proprietorship', 'Partnership'];
    const [isLoading, setIsLoading] = useState(false)

    const [customerData, setCustomerData] = useState({
        customerName: '',
        customerGroup: 'All Customer Groups',
        customerType: 'Company',
        territory: "Canada",
    });

    const route = useRouter();

    const handleCustomerDataChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomerData({
            ...customerData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddCustomer = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        const authHeader = getAuthHeader();

        const apiUrl = 'https://tgc67.online/api/resource/Customer';

        const requestData = {
            data: {
                customer_name: customerData.customerName,
                customer_type: customerData.customerType,
                customer_group: customerData.customerGroup,
                territory: customerData.territory,
            },
        };

        try {
            const response = await post(apiUrl, requestData);

            if (response?.data) {
                toast.success("Customer Added Successfully");
                route.push('/main');
            }
        } catch (error) {
            toast.error('API Error:');
            if (error.response?.status === 403) {
                alert("Login Expired");
                route.push('/');
            } else {
                handleError(error);
            }
        }
        setIsLoading(false)
    };

    useEffect(() => {
        handleGetCustomerGroup();
    }, []);

    const handleGetCustomerGroup = async () => {
        try {
            const res = await get('/resource/Customer Group');
            setCSGroupList(res?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const handleNewGroupSubmit = async () => {
        try {
            const res = await post('/resource/Customer Group', {
                customer_group_name: newGroupName
            });
            setCSGroupList([...csGroupList, res.data]);
            setCustomerData({
                ...customerData,
                customerGroup: newGroupName,
            });
            setOpenDialog(false);
            toast.success("New Customer Group Added Successfully");
        } catch (err) {
            console.log(err);
            toast.error('Failed to add new customer group.');
        }
    };

    return (
        <>
            <Siderbar />
            {isLoading &&
                <LoadingPage
                    msg='Creating Customer'
                />}
            <div>
                <div className="col-lg-6 itemOuter mt-3">
                    <h4 className="text-center"></h4>
                    <div className="rown" style={{ overflow: 'hidden' }}>
                        <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3" style={{ position: "relative" }}>
                                <div className="card-body">
                                    <div className="pt pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4"> New Customer </h5>
                                    </div>
                                    <div className='' style={{ position: 'absolute', right: '20px', top: '20px' }} onClick={() => {
                                        route.push('/main')
                                    }}>
                                        <div className="btn btn-primary iconOuter cancelIcon">
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddCustomer} method="post" className="row g-3 needs-validation">
                                        <div className="col-12 mb-2">
                                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                                            <div className="has-validation">
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    className="form-control"
                                                    id="customerName"
                                                    required
                                                    value={customerData.customerName}
                                                    onChange={handleCustomerDataChange}
                                                />
                                                <div className="invalid-feedback">Please enter the customer name.</div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-2">
                                            <Autocomplete
                                                value={customerData.customerGroup}
                                                onChange={(event, newValue) => {
                                                    if (typeof newValue === 'string') {
                                                        setTimeout(() => {
                                                            setNewGroupName(newValue);
                                                            setOpenDialog(true);
                                                        });
                                                    } else if (newValue && newValue.inputValue) {
                                                        setNewGroupName(newValue.inputValue);
                                                        setOpenDialog(true);
                                                    } else {
                                                        setCustomerData({
                                                            ...customerData,
                                                            customerGroup: newValue?.title || '',
                                                        });
                                                    }
                                                }}
                                                filterOptions={(options, params) => {
                                                    const filtered = options.filter(option =>
                                                        option.title.toLowerCase().includes(params.inputValue.toLowerCase())
                                                    );

                                                    if (params.inputValue !== '') {
                                                        filtered.push({
                                                            inputValue: params.inputValue,
                                                            title: `Add "${params.inputValue}"`,
                                                        });
                                                    }

                                                    return filtered;
                                                }}
                                                id="customer-group-autocomplete"
                                                options={csGroupList.map(group => ({ title: group.name }))}
                                                getOptionLabel={(option) => {
                                                    if (typeof option === 'string') {
                                                        return option;
                                                    }
                                                    if (option.inputValue) {
                                                        return option.inputValue;
                                                    }
                                                    return option.title;
                                                }}
                                                selectOnFocus
                                                clearOnBlur
                                                handleHomeEndKeys
                                                freeSolo
                                                renderInput={(params) => <TextField {...params} label="Customer Group" size='small' />}
                                            />

                                        </div>
                                        <div className="col-12 mb-2">
                                            <label htmlFor="customerType" className="form-label">Customer Type</label>
                                            <Autocomplete
                                                value={customerData.customerType}
                                                onChange={(event, newValue) => setCustomerData({
                                                    ...customerData,
                                                    customerType: newValue
                                                })}
                                                options={customerTypes.map((option) => option)}
                                                renderInput={(params) => <TextField {...params} id="outlined-size-small" size='small' />}
                                            />
                                            <div className="invalid-feedback">Please enter the customer type.</div>
                                        </div>
                                        <div className="col-12 mb-2">
                                            <label htmlFor="territory" className="form-label">Territory</label>
                                            <input
                                                type="text"
                                                name="territory"
                                                className="form-control"
                                                id="territory"
                                                required
                                                value={customerData.territory}
                                                onChange={handleCustomerDataChange}
                                            />
                                            <div className="invalid-feedback">Please enter the territory.</div>
                                        </div>
                                        <div className="w-100">
                                            <button className="btn btn-primary login-btn" type="submit">Add New Customer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Customer Group</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="new-group-name"
                        label="Customer Group Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleNewGroupSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withAuth(NewCustomer);

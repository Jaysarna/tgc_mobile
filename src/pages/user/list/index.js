// pages/userList.js
import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Siderbar from "@/helpers/siderbar";
import LoadingPage from "@/helpers/Loader";
import useUserStore from "@/features/user/user.service";
import withAuth from "@/customhook/withAuth";



const UserList = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", password: '' });


    const columns = [
        { name: "username", label: "User Name", },
        { name: "name", label: "Name" },
        { name: "email", label: "Email" },
        // {
        //     name: "actions",
        //     label: "Actions",
        //     options: {
        //         customBodyRender: (value, tableMeta) => {
        //             const handleEdit = () => openDialog("edit", tableMeta.rowData);
        //             return (
        //                 <Button onClick={handleEdit} variant="outlined" size="small" startIcon={<EditIcon />}>Edit</Button>
        //             );
        //         },
        //     },
        // },
    ];

    const store = useUserStore()
    useEffect(() => {
        store.get.paginate({ page: 1, size: 10 })
    }, []);

    const openDialog = (type, userData = {}) => {
        console.log(userData)
        setDialogType(type);
        setFormData(userData);
        setDialogOpen(true);
    };

    const closeDialog = () => setDialogOpen(false);

    const handleSubmit = async () => {
        if (dialogType === "add") {
            store.select(null)
            await store.add(formData)
        } else if (dialogType === "edit") {
            // store.select(username)
            await store.update(username)
        }
        closeDialog();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <>
            <Siderbar />
            <div className="table-vw-size mbvw-tbl-scrl">
                {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openDialog("add")}>
                    Add New User
                </Button> */}

                {store.user.loading ? (
                    <LoadingPage msg="Loading" />
                ) : (
                    <MUIDataTable title="User List" data={store.user.list} columns={columns} options={{ filterType: "dropdown", responsive: "standard", selectableRows: "none", }} />
                )}

                <Dialog open={dialogOpen} onClose={closeDialog}>
                    <DialogTitle>{dialogType === "add" ? "Add New User" : "Edit User"}</DialogTitle>
                    <DialogContent>
                        <TextField label="First Name" name="first_name" value={formData.name} onChange={handleInputChange} fullWidth margin="normal" />
                        <TextField label="Password" name="password" value={formData.password} onChange={handleInputChange} fullWidth margin="normal" />
                        <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth margin="normal" />
                        {/* <TextField label="Role" name="role_profile_name" value={formData.role_profile_name} onChange={handleInputChange} fullWidth margin="normal" /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="secondary">Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">{dialogType === "add" ? "Add" : "Update"}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default withAuth(UserList);

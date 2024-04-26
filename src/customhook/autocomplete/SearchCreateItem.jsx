import React, { useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import SearchSelect from './SeachSelect';
import { addNewItemWithoutSupplier } from '@/features/item/item.services';

export default function SearchCreateItem({ selectList, uid, quantity, handleAddNewItem, cusList, handleItemNameChange, handleUpdateValue, name, handleAdd, itemOptionList }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newSupplierName, setNewSupplierName] = useState('');
    const [value, setValue] = useState(null);

    const filter = createFilterOptions();

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue && newValue.inputValue) {
            setOpenDialog(true);
            // console.log(newValue)
            setNewItemName(newValue.inputValue);

        } else {
            console.log(newValue)
            setValue(newValue);
            handleItemNameChange(newValue, uid, quantity);
            setNewSupplierName(newValue)
        }
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewItemName('');
        setNewSupplierName('');
    };

    const handleAddItem = async () => {
        handleAddNewItem(newItemName, newSupplierName);

        handleDialogClose();
    };

    const handleNewItemNameChange = (event) => {
        setNewItemName(event.target.value);
    };

    const handleNewSupplierNameChange = (value) => {
        const newValue = (typeof value === 'object') ? value?.name : value;
        setNewSupplierName(newValue);
    };

    return (
        <div className="col-12">
            <Autocomplete
                size='small'
                defaultValue={value}
                onChange={handleAutocompleteChange}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    // if (params.inputValue !== '') {
                    //     filtered.push({
                    //         inputValue: params.inputValue,
                    //         item_name: `Add "${params.inputValue}"`,
                    //     });
                    // }

                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={itemOptionList}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option?.item_name || '';
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option?.item_name}</li>}
                sx={{ width: '100%' }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label={`Select Item`} />
                )}
            />
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    {/* <SearchSelect
                        cusList={selectList}
                        handleUpdateValue={handleNewSupplierNameChange}
                        name={name}
                        handleAdd={handleAdd}

                    /> */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newItemName"
                        label={`New Item Name`}
                        type="text"
                        size='small'
                        value={newItemName}
                        onChange={handleNewItemNameChange}
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAddItem}
                        disabled={!newItemName.trim()}
                        variant="contained"
                        color="primary"
                    >
                        Add
                    </Button>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

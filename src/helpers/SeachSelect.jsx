import React, { useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

export default function SearchSelect({ cusList, handleUpdateValue, name, handleAdd }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState('');
    const [value, setValue] = useState(null); // Initialize value state

    const filter = createFilterOptions();

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue && newValue.inputValue) {
            // Open dialog if user typed a new value
            setOpenDialog(true);
            setNewSupplierName(newValue.inputValue); // Set new supplier name
        } else {
            // Update value state for existing options
            setValue(newValue);
            handleUpdateValue(newValue); // Call parent handler
        }
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewSupplierName('');
    };

    const handleAddSupplier = () => {



        handleDialogClose();
    };

    const handleNewSupplierNameChange = (event) => {
        setNewSupplierName(event.target.value);
    };

    return (
        <div className="col-12">
            <Autocomplete
                size='small'
                defaultValue={value}
                onChange={handleAutocompleteChange}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            name: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={cusList}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option?.name || '';
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option?.name}</li>}
                sx={{ width: '100 %' }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label={`Select ${name}`} />
                )}
            />
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Add New {name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newSupplierName"
                        label={`${name}`}
                        type="text"
                        fullWidth
                        value={newSupplierName}
                        onChange={handleNewSupplierNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleAdd(newSupplierName)
                    }}>Cancel</Button>
                    <Button
                        onClick={handleAddSupplier}
                        disabled={!newSupplierName.trim()}
                        variant="contained"
                        color="primary"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

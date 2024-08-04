import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

const TableSearchBar = ({ searchText, onSearch, onHide, handleReset }) => {
    const [inputValue, setInputValue] = useState(searchText);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onSearch(value);
    };

    const clearSearch = () => {
        setInputValue('');
        onSearch('');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end", gap: '10px  ' }}>
            <TextField
                id="custom-search-input"
                label="Search"
                size='small'
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                InputProps={{
                    endAdornment: inputValue && (
                        <ClearIcon
                            onClick={clearSearch}
                            style={{ cursor: 'pointer' }}
                        />
                    ),
                }}
                autoFocus
            />
            {inputValue && (
                <ClearIcon
                    onClick={onHide}
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                />
            )}
            {!inputValue && (
                <IconButton onClick={handleReset}>
                    <RefreshIcon />
                </IconButton>
            )}
        </div>
    );
};

export default TableSearchBar;

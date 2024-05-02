import React from 'react';
import './ReadOnlyTextField.css';

import TextField from '@mui/material/TextField';

interface ReadOnlyTextFieldProps {
    label: string;
    value: number;
    actualValues: number[];
}

const ReadOnlyTextField: React.FC<ReadOnlyTextFieldProps> = ({ label, value, actualValues }) => (
    <TextField
        className='text-field'
        label={label}
        value={actualValues.includes(value) ? 'Немає' : value}
        InputProps={{
            readOnly: true,
        }}
    />
);

export default ReadOnlyTextField;
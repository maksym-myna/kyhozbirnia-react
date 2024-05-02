import React from 'react';
import './ToggleButtonGroupComponent.css';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface Option<T extends string | number> {
    value: T;
    IconComponent: React.ElementType;
    label: string;
}

interface ToggleButtonGroupComponentProps<T extends string | number> {
    options: Option<T>[];
    value: T | T[];
    onChange: (event: React.MouseEvent<HTMLElement>, newValue: T | null) => void;
}

const ToggleButtonGroupComponent = <T extends string | number,>({ options, value, onChange }: ToggleButtonGroupComponentProps<T>) => (
    <ToggleButtonGroup className='toggle-button-group' value={value} onChange={onChange} exclusive>
        {options.map(({ value, IconComponent, label }) => (
            <ToggleButton key={value.toString()} value={value} className='toggle-button'>
                <IconComponent />
                {label}
            </ToggleButton>
        ))}
    </ToggleButtonGroup>
);

export default ToggleButtonGroupComponent;
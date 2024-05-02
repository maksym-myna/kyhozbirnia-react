import React from 'react';
import './RangeSlider.css';

import Slider from '@mui/material/Slider';

import ReadOnlyTextField from '../ReadOnlyTextField';

interface RangeSliderProps {
    min: number;
    max: number;
    onChange: (newValue: (number | undefined)[]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, onChange }) => {
    const actualMin = min - 1;
    const actualMax = max + 1;
    const [value, setValue] = React.useState<number[]>([actualMin, actualMax]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        const newValues = newValue as number[]
        setValue(newValues);
        const mappedNewValues = newValues.map(value => (value === actualMin || value === actualMax) ? undefined : value);
        onChange(mappedNewValues)
    };

    return (
        <div className='range-slider-container'>
            <Slider
                className='slider'
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                min={actualMin}
                max={actualMax}
            />
            <section className='range-slider-values-container'>
                <ReadOnlyTextField label="Мінімум" value={value[0]} actualValues={[actualMin, actualMax]} />
                <ReadOnlyTextField label="Максимум" value={value[1]} actualValues={[actualMin, actualMax]} />
            </section>
        </div>
    );
}

export default RangeSlider;
import React, { useContext } from "react";
import './Chip.css';

import { WorksContext } from '../../contexts/WorksContext';

import CancelIcon from '@mui/icons-material/Cancel';

interface ChipProps {
    content: string;
    type: 'languages' | 'subjects' | 'authors' | 'publishers';
}

const Chip: React.FC<ChipProps> = ({ content, type }) => {
    const { setState } = useContext(WorksContext);

    const deleteChip = () => {
        setState(prevState => ({
            ...prevState,
            [type]: prevState[type].filter(item => item !== content)
        }));
    }

    return (
        <div className='chip'>
            {content}
            <CancelIcon
                onClick={deleteChip}
                className='remove-chip'
            />
        </div>
    );
}

export default Chip;
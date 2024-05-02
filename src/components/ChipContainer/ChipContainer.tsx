import React, { useContext } from "react";
import Chip from "../Chip/";
import { WorksContext } from "../../contexts/WorksContext";

interface ChipContainerProps {
    type: 'languages' | 'subjects' | 'authors' | 'publishers';
}

const ChipContainer: React.FC<ChipContainerProps> = ({ type }) => {
    const { languages, subjects, authors, publishers } = useContext(WorksContext);

    const typeMap = {
        'languages': languages,
        'subjects': subjects,
        'authors': authors,
        'publishers': publishers
    };

    const data = typeMap[type];

    return (
        <div className='filter-chips-container'>
            {data.map(item => (
                <Chip
                    key={`${type} ${item}`}
                    content={item}
                    type={type}
                />
            ))}
        </div>
    )
}

export default ChipContainer;
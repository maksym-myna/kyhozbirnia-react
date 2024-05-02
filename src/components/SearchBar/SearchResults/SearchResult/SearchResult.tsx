import React from 'react';
import './SearchResult.css';

import AuthorIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/LibraryBooks';
import PublisherIcon from '@mui/icons-material/Print';
import SubjectIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Translate';
import UserIcon from '@mui/icons-material/Person';

interface SearchResultProps {
    //  id: string | number;
    name: string;
    resultType: 'author' | 'work' | 'subject' | 'publisher' | 'language' | 'user';
    onClick?: () => void;
    className: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ name, resultType, onClick, className }) => {
    const ICONS = {
        'author': <AuthorIcon />,
        'work': <WorkIcon />,
        'subject': <SubjectIcon />,
        'publisher': <PublisherIcon />,
        'language': <LanguageIcon />,
        'user': <UserIcon />
    };

    const result = ICONS[resultType]
    // const processedName = name.length > 85 ? name.slice(0, 85) + '...' : name;

    return (
        <div className={`${className}search-result-container`} onClick={onClick}>
            {result}
            <div className='search-result-image'></div>
            <div className='search-result'>{name}</div>
        </div>
    );
};

export default SearchResult;
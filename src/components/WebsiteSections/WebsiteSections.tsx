import React, { useContext, useState } from 'react';
import './WebsiteSections.css';
import { CurrentPageProps } from '../Header';
import Link from '../Link';
import Button from '../Button';
import Popup from '../Popup';
import SearchBar from '../SearchBar';
import ToggleButtonGroup from '../ToggleButtonGroupComponent';
import { AuthContext } from '../../contexts/AuthContext';
import { Book as BookIcon, TabletMac as TabletMacIcon, Headset as HeadsetIcon } from '@mui/icons-material';
import PostPopup from '../PostPopup';

interface WebsiteSectionProps extends CurrentPageProps {
    type: string;
    postButton?: boolean;
}

const WebsiteSections: React.FC<WebsiteSectionProps> = ({ type, currentPage, postButton = true }) => {
    const { role } = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const sections = [
        { name: 'Книжки', page: 'works', path: '/works' },
        { name: 'Видавництва', page: 'publishers', path: '/publishers' },
        { name: 'Автори', page: 'authors', path: '/authors' },
        { name: 'Жанри', page: 'subjects', path: '/subjects' },
    ];
    const popupTitles = {
        works: 'Додати книжку',
        publishers: 'Додати видавництво',
        authors: 'Додати автора'
    }

    return (
        <>
            <div className={`sections ${type === 'header' ? 'header-sections' : type === 'footer' ? 'footer-sections' : ''}`}>
                {sections.map(section => (
                    <Link key={section.page} className={`section-item ${currentPage === section.page ? 'selected-section' : ''}`} to={section.path}>
                        {section.name}
                    </Link>
                ))}
            </div>
            {
                role === 'ADMIN' && currentPage && postButton && currentPage != 'subjects' ?
                    <div className='add-button-container'>
                        <Button outlined onClick={togglePopup}>
                            Додати
                        </Button>
                        {showPopup && <PostPopup title={popupTitles[currentPage]} togglePopup={togglePopup} destination={currentPage} />}
                    </div> : ''
            }
        </>
    )
}

export default WebsiteSections;
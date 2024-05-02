import React, { useEffect } from "react";
import './Popup.css';
import CloseIcon from '@mui/icons-material/Close';
import Button from "../Button";

interface PopupProps {
    togglePopup: () => void;
    children?: React.ReactNode;
    title: string;
}

const Popup: React.FC<PopupProps> = ({ togglePopup, children, title }) => {
    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => { document.body.classList.remove('no-scroll') };
    }, []);

    return (
        <div className="popup-container">
            <div className="popup">
                <div className="close-popup">
                </div>
                <div className="popup-content">
                    <div className="popup-header">
                        <h3 className="popup-title">{title}</h3>
                        <Button width="1.75rem" height="1.75rem" inverted onClick={togglePopup}>
                            <CloseIcon />
                        </Button>
                    </div>
                    <div className="popup-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;
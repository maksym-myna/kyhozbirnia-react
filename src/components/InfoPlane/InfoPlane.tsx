import React from 'react';
import './InfoPlane.css';


interface InfoPlaneProps {
    header: string;
    content: string | number;
    outline?: boolean;
}

const InfoPlane: React.FC<InfoPlaneProps> = ({ header, content, outline = false }) => {
    return (
        <div className={`info-plane${outline ? ' info-plane-outlined' : ''}`}>
            <div className='info-plane-header'>
                {header}
            </div>
            <div className='info-plane-content'>
                {content}
            </div>
        </div>
    )
}
export default InfoPlane;


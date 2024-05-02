import React, { useState } from "react";
import './Cover.css';
import { defaultBookCoverURL } from "../../config";

interface CoverProps {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    onError?: () => void;
    roundBorders?: boolean;
}

const Cover: React.FC<CoverProps> = ({ src, alt, width = '300px', height = '360px', onError, roundBorders = false }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const style = { width, height, ...(roundBorders ? { borderRadius: '2rem' } : {}) };

    const handleError = () => {
        if (onError) {
            onError();
        }
        setImgSrc(`../../${defaultBookCoverURL}`);
    };

    return (
        <div className="work-cover-container" style={style}>
            <img className='work-cover' src={imgSrc} alt={alt} onError={handleError} />
        </div>
    );
}

export default Cover;
// import React from 'react';
import './CarouselArrow.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIos from '@mui/icons-material/ArrowForward';
import { ArrowProps } from 'react-multi-carousel';

interface CarouselArrowProps extends ArrowProps {
    direction: 'left' | 'right';
}

const CarouselArrow: React.FC<CarouselArrowProps> = ({ onClick, direction }) => {
    const iconStyle = { "height": "2rem", "width": "2rem" }

    return (<button onClick={onClick} className="carousel-arrow" style={direction === 'left' ? { left: '0' } : { right: '0' }}>
        {direction === 'left' ? <ArrowBackIosNewIcon style={iconStyle} /> : <ArrowForwardIos style={iconStyle} />}
    </button>)
};

export default CarouselArrow;
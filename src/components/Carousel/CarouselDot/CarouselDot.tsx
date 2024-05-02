import React from 'react';
import './CarouselDot.css';
import { DotProps } from 'react-multi-carousel';

const CarouselDot: React.FC<DotProps> = ({ active, onClick, }) => (
    <div
        className={`carousel-dot ${active ? 'active-carousel-dot' : ''}`}
        onClick={onClick}
    ></div>
);

export default CarouselDot;
import React from 'react';
import './CarouselItem.css';
import { CarouselItemProps } from './CarouselItemProps';
import Cover from '../../Cover'
import Link from '../../Link'
import Button from '../../Button'


const CarouselItem: React.FC<CarouselItemProps> = ({ src, alt, description, url, onClick, label }) => {
    return (
        <>
            {onClick &&
                <div className='carousel-button'>
                    <Button outlined noshadow height="3rem" onClick={onClick}>{label}</Button>
                </div>
            }
            <Link to={url} className="carousel-item">
                <Cover src={src} alt={alt} />
                <p className="legend">{description}</p>
            </Link>
        </>
    )
};

export default CarouselItem;
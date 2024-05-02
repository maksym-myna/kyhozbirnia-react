import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CarouselItem from './CarouselItem';
import CarouselDot from './CarouselDot';
import CarouselArrow from './CarouselArrow';
import { CarouselItemProps } from './CarouselItem/CarouselItemProps';

interface CarouselProps {
    items: CarouselItemProps[];
}

const responsive = {
    superDuperLargeDesktop: { breakpoint: { max: 4000, min: 2500 }, items: 12 },
    superLargeDesktop: { breakpoint: { max: 2500, min: 2250 }, items: 9 },
    PrettyLargeDesktop: { breakpoint: { max: 2250, min: 2000 }, items: 8 },
    LargeDesktop: { breakpoint: { max: 2000, min: 1750 }, items: 7 },
    prettyBigDesktop: { breakpoint: { max: 1750, min: 1550 }, items: 6 },
    bigDesktop: { breakpoint: { max: 1550, min: 1420 }, items: 5 },
    fullSizeDesktop: { breakpoint: { max: 1360, min: 1150 }, items: 4 },
    desktop: { breakpoint: { max: 1150, min: 900 }, items: 3 },
    tablet: { breakpoint: { max: 900, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [autoPlay, setAutoPlay] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                entry.isIntersecting
                    ? setAutoPlay(true)
                    : setAutoPlay(false);
            }, { threshold: 0.25 }
        );

        if (carouselRef.current) {
            observer.observe(carouselRef.current);
        }

        return () => {
            if (carouselRef.current) {
                observer.unobserve(carouselRef.current);
            }
        };
    }, []);

    return (
        <div className="carousel-container" ref={carouselRef}>
            <MultiCarousel
                responsive={responsive}
                infinite
                autoPlay={autoPlay}
                autoPlaySpeed={2500}
                keyBoardControl
                draggable
                swipeable
                showDots
                rewind
                focusOnSelect={false}
                removeArrowOnDeviceType={["tablet", "mobile"]}
                customTransition={"transform 750ms linear"}
                itemClass="carousel-item"
                customLeftArrow={<CarouselArrow direction='left' />}
                customRightArrow={<CarouselArrow direction='right' />}
                customDot={<CarouselDot />}
            >
                {items.map((item, index) => (
                    <CarouselItem key={index} {...item} />
                ))}
            </MultiCarousel >
        </div>
    );
};


export default Carousel;
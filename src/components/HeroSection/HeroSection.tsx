import React, { useState, useEffect, useRef } from 'react';

import './HeroSection.css';

import Button from '../../components/Button';
import InfoPlane from '../../components/InfoPlane';
import { BookCover } from 'book-cover-3d'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';

import { serverURL } from '../../config';
import axios from 'axios';
import Link from '../Link';
import { Medium } from '../FilteringSideBar';

interface Work {
    "id": number,
    "title": string,
    "pages": number,
    "releaseYear": number,
    "isbn": string,
    "medium": Medium,
    "weight": number,
    "modifiedAt": Date,
    "publisher": {
        "id": number,
        "name": string
    },
    "language": {
        "id": string,
        "name": string
    },
    "authors": string[],
    "subjects": string[],
    "currentlyReading": number,
    "wantToRead": number,
    "alreadyRead": number,
    "rating": number,
    "scored": number,
    "copies": number,
    "availableCopies": number
}

interface HeroSectionProps {
    isbn: string;
    title: string;
    description: string;
    hideButton?: boolean
}

const HeroSection: React.FC<HeroSectionProps> = ({ isbn, title, description, hideButton = false }) => {
    const [heroSectionWork, setHeroSectionWork] = useState<Work>();

    useEffect(() => {
        const fetchHeroSectionWork = async () => {
            try {
                const response = await axios.get(`${serverURL}/works/isbn/${isbn}/`);
                setHeroSectionWork(response.data);
            } catch (error) {
                console.error('Failed to fetch hero section work:', error);
            }
        };

        fetchHeroSectionWork();
    }, [isbn]);


    return (
        <section className='hero-section'>
            <section className='left-hero-section'>
                <h1 className='hero-title' dangerouslySetInnerHTML={{ __html: title }}>
                </h1>
                <p className='hero-description' dangerouslySetInnerHTML={{ __html: description }}>
                </p>
                {!hideButton &&
                    <Link to='/works' className='hero-button-container'>
                        <Button>
                            До каталогу
                        </Button>
                    </Link>
                }
            </section>
            <section className='right-hero-section'>
                <div className='book-cover-container'>
                    <BookCover
                        rotate={15}
                        rotateHover={15}
                        thickness={70}
                        height={330}
                        width={220}
                    >
                        <img
                            alt={heroSectionWork ? `${heroSectionWork.title} book cover` : 'This was supposed to be a hero object book cover, but something went wrong'}
                            src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`} />
                    </BookCover>
                </div>
                <div className='hero-book-information'>
                    <section className="hero-book-title">
                        {heroSectionWork?.title ?? 'Вантажимо...'}
                    </section>
                    <section className='hero-book-authors'>
                        {heroSectionWork?.authors.map((author, index) => (
                            <Link
                                className='hero-book-author'
                                key={author}
                                to={`/author/${author}`}
                            >
                                {author}
                                {index < heroSectionWork.authors.length - 1 ? ', ' : ''}
                            </Link>
                        ))
                            ?? 'Вантажимо...'
                        }
                    </section>
                    <div className='hero-book-rating'>
                        <Typography component="legend">
                            {heroSectionWork?.scored ?? 0} оцінок
                        </Typography>
                        <Rating
                            name="book-rating"
                            readOnly
                            value={heroSectionWork?.rating ?? 0}
                        />
                    </div>
                    <div className='book-info'>
                        <InfoPlane header='Рік' content={heroSectionWork?.releaseYear ?? 'Вантажимо...'} />
                        <InfoPlane header='Сторінок' content={heroSectionWork?.pages ?? 'Вантажимо...'} />
                        <InfoPlane header='Мова' content={heroSectionWork?.language.name ?? 'Вантажимо...'} />
                        <InfoPlane header='Видавець' content={heroSectionWork?.publisher.name ?? 'Вантажимо...'} />
                    </div>
                    <div className="to-work-container">
                        <Link to={`/works/isbn/${heroSectionWork?.isbn}`} className="to-work">
                            <p className='to-work-text'>
                                Перейти до книги
                            </p>
                            <p className='to-work-icon'>
                                <EastIcon style={{ height: "2rem", width: "1.75rem" }} />
                            </p>
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    )
};

export default HeroSection;
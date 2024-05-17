import React, { useEffect, useState, useContext } from 'react';
import Link from '../Link';
import { WorksContext } from "../../contexts/WorksContext";
import { serverURL } from '../../config';
import Cover from '../Cover';
import Paging from '../Paging';
import './Works.css';
import { LinearProgress } from '@mui/material';
import { ListingType } from '../FilteringSideBar';

interface Work {
    id: number,
    title: string,
    pages: number,
    releaseYear: number,
    isbn: string,
    medium: string,
    weight: number,
    modifiedAt: Date,
    publisher: {
        id: number,
        name: string
    },
    language: {
        id: string,
        name: string
    },
    authors: string[],
    subjects: string[]
}

const Works: React.FC = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [isLoading, setIsLoading] = useState(true); // add this state variable
    const { userId, mediums, minReleaseYear, maxReleaseYear, minPages, maxPages, languages, subjects, defaultSubjects, publishers, defaultPublishers, authors, defaultAuthors, isAvailable, isAccounted, searchTrigger, first, last, page, listings, ratings, displayListings, displayRatings, displayAvailability, setState } = useContext(WorksContext);

    const goForward = () => {
        setState(prevState => ({
            ...prevState,
            page: page + 1,
            searchTrigger: !prevState.searchTrigger
        }));
    }

    const goBack = () => {
        setState(prevState => ({
            ...prevState,
            page: page - 1,
            searchTrigger: !prevState.searchTrigger
        }));
    }

    useEffect(() => {
        const listing: ListingType[] = displayListings && !listings.length ? ['WANT_TO_READ', 'CURRENTLY_READING', 'ALREADY_READ'] : listings
        const rating = displayRatings && !ratings.length ? [1, 2, 3, 4, 5] : ratings
        setState(prevState => ({
            ...prevState,
            listings: listing,
            ratings: rating
        }));
        try {
            const url = new URL(`${serverURL}/works/`);
            const params: { [key: string]: any } = {
                size: 24,
                page,
                mediums,
                minReleaseYear,
                maxReleaseYear,
                minPages,
                maxPages,
                languages,
                subjects: defaultSubjects?.length ? defaultSubjects : subjects,
                publishers: defaultPublishers?.length ? defaultPublishers : publishers,
                authors: defaultAuthors?.length ? defaultAuthors : authors,
                isAvailable: displayAvailability && isAvailable,
                isAccounted,
                listings: listing,
                ratings: rating,
                userId
            };
            console.log(userId)

            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && !(Array.isArray(params[key]) && params[key].length === 0)) {
                    url.searchParams.append(key, params[key]);
                }
            });
            console.log(url.toString());

            fetch(url.toString())
                .then(response => response.json())
                .then(data => {
                    setWorks(data.content.map((work: Work) => ({ ...work })));
                    setState(prevState => ({
                        ...prevState,
                        first: data.first,
                        last: data.last,
                        page: data.pageable.pageNumber
                    }));
                    setIsLoading(false);
                });
        } catch (error: any) {

        }
    }, [searchTrigger]);

    return (
        <div className={'results-container'}>
            {isLoading ? (
                <LinearProgress color="inherit" />
            ) : (
                works.map(work => (
                    <div key={work.id}>
                        <Link to={`/works/isbn/${work.isbn}`}>
                            <div className='image-container'>
                                <Cover
                                    src={`https://covers.openlibrary.org/b/isbn/${work.isbn}-L.jpg?default=false`}
                                    alt={work.title}
                                    width='240px'
                                    height='280px'
                                />
                            </div>
                            <div className="book-legend">
                                <div className='book-legend-top'>
                                    <span className='book-legend-title'>
                                        {work.title.slice(0, 66) + (work.title.length > 66 ? '…' : '')}
                                    </span>
                                </div>
                                <div className='book-legend-author'>
                                    <i>
                                        {work.authors.join(', ')}
                                    </i>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            )}
            <Paging goBack={goBack} goForward={goForward} first={first} last={last} page={page} />
        </div>
    );
};

export default Works;
import React, { useEffect, useState, useContext } from 'react';
import Link from '../Link';
import { serverURL } from '../../config';
import Cover from '../Cover';
import Paging from '../Paging';
import '../Works/Works.css';
import './ListOfReferalObjects.css';
import { LinearProgress } from '@mui/material';

interface ListObject {
    isbn: string,
    name: string,
}

interface ListOfReferalObjectsProps {
    destination: string;
}

const ListOfReferalObjects: React.FC<ListOfReferalObjectsProps> = ({ destination }) => {
    const [listObjects, setListObjects] = useState<ListObject[]>([]);
    const [searchTrigger, setSearchTrigger] = useState(false);
    const [page, setPage] = useState(0);
    const [first, setFirst] = useState(true);
    const [last, setLast] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // add this state variable

    const goForward = () => {
        setPage(page + 1);
        setSearchTrigger(!searchTrigger);
    }

    const goBack = () => {
        setPage(page - 1);
        setSearchTrigger(!searchTrigger);
    }

    useEffect(() => {
        const url = new URL(`${serverURL}/${destination}/`);
        const params: { [key: string]: any } = {
            size: 20,
            page
        };
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && !(Array.isArray(params[key]) && params[key].length === 0)) {
                url.searchParams.append(key, params[key]);
            }
        });

        fetch(url.toString())
            .then(response => response.json())
            .then(data => {
                setListObjects(data.content.map((obj: ListObject) => ({ ...obj })));
                setFirst(data.first);
                setLast(data.last);
                setPage(data.pageable.pageNumber);
                setIsLoading(false);
            });
    }, [searchTrigger]);

    return (
        <div className='list-results'>
            <div className={'results-container'}>
                {isLoading ? (
                    <LinearProgress color="inherit" />
                ) : (
                    listObjects.map(obj => (
                        <div key={obj.isbn}>
                            <Link to={`/${destination}/${obj.name}`} >
                                <div className='image-container'>
                                    <Cover
                                        src={`https://covers.openlibrary.org/b/isbn/${obj.isbn}-L.jpg?default=false`}
                                        alt={obj.name}
                                        width='240px'
                                        height='280px'
                                    />
                                </div>
                                <div className="book-legend">
                                    <div className='book-legend-top'>
                                        <span className='book-legend-title'>
                                            {obj.name.slice(0, 66) + (obj.name.length > 66 ? '…' : '')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
                <Paging
                    page={page}
                    first={first}
                    last={last}
                    goForward={goForward}
                    goBack={goBack}
                />
            </div>
        </div>
    );
};

export default ListOfReferalObjects;
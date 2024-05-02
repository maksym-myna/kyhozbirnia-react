import React from 'react';
import Link from '../Link';
import { subjectItems } from '../../config';
import Cover from '../Cover';
import '../Works/Works.css';
import '../ListOfReferalObjects/ListOfReferalObjects.css';

const Subjects: React.FC = () => {
    return (
        <div className='list-results'>
            <div className={'results-container'}>
                {Object.entries(subjectItems).map(([name, isbn]) => (
                    <div key={`${name}-${isbn}`}>
                        <Link to={`/subjects/${name}`} >
                            <div className='image-container'>
                                <Cover
                                    src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`}
                                    alt={name}
                                    width='240px'
                                    height='280px'
                                />
                            </div>
                            <div className="book-legend">
                                <div className='book-legend-top'>
                                    <span className='book-legend-title'>
                                        {name}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default Subjects;
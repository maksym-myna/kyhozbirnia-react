import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchResult from './SearchResult';
import FocusedOnClickContext from '../../../contexts/SearchBarContext';
import { WorksContext, WorksState } from '../../../contexts/WorksContext';

import './SearchResults.css';

interface WorkSearch {
    isbn: string;
    title: string;
}

interface UserSearch {
    id: number;
    firstName: string;
    lastName: string;
}

interface ItemSearch {
    id: number;
    name: string;
}

interface SearchResultsProps {
    works?: WorkSearch[];
    authors?: ItemSearch[];
    authorsRedirect?: boolean;
    publishers?: ItemSearch[];
    subjects?: ItemSearch[];
    languages?: ItemSearch[];
    users?: UserSearch[];
    focusedIndex: number,
    maxValues?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ works: foundWorks = [], authors: foundAuthors = [], authorsRedirect, publishers: foundPublishers = [], subjects: foundSubjects = [], languages: foundLanguages = [], users: foundUsers = [], focusedIndex, maxValues }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { setState } = useContext(WorksContext);

    const toggleArrayItem = (array: string[], item: string) => {
        if (maxValues && array.length >= maxValues)
            return array;
        return array.includes(item)
            ? array.filter(i => i !== item)
            : [...array, item];
    }

    const setField = (field: keyof WorksState, value: string) => {
        setState(prevState => ({
            ...prevState,
            [field]: toggleArrayItem(prevState[field] as string[], value)
        }));
    }

    const setLanguages = (language: string) => setField('languages', language);
    const setAuthors = (author: string) => setField('authors', author);
    const setPublishers = (publisher: string) => setField('publishers', publisher);
    const setSubjects = (subject: string) => setField('subjects', subject);


    const adjustWidth = () => {
        if (containerRef.current && containerRef.current.parentElement) {
            containerRef.current.style.width = `${containerRef.current.parentElement.offsetWidth}px`;
        }
    };
    window.addEventListener('resize', adjustWidth);

    useEffect(() => {
        const timer = setTimeout(() => {
            adjustWidth();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    type SearchResultItem = { name: string; resultType: 'work' | 'author' | 'publisher' | 'subject' | 'language' | 'user'; onClick?: () => void; };

    const move = (to: string) => {
        navigate(to)
        window.scrollTo(0, 0)
    }

    const allResults: SearchResultItem[] = [
        ...foundWorks.map((work) => ({ name: work.title, resultType: 'work' as const, onClick: () => move(`/works/isbn/${work.isbn}`) })),
        ...foundAuthors.map((author) => ({ ...author, resultType: 'author' as const, onClick: authorsRedirect ? () => move(`/authors/${author.name}`) : () => setAuthors(author.name) })),
        ...foundPublishers.map((publisher) => ({ ...publisher, resultType: 'publisher' as const, onClick: () => setPublishers(publisher.name) })),
        ...foundSubjects.map((subject) => ({ ...subject, resultType: 'subject' as const, onClick: () => setSubjects(subject.name) })),
        ...foundLanguages.map((language) => ({ ...language, resultType: 'language' as const, onClick: () => setLanguages(language.name) })),
        ...foundUsers.map((user) => ({ name: `${user.firstName} ${user.lastName}`, resultType: 'user' as const, onClick: () => move(`/profile/${user.id}`) })),
    ];

    const setFocusedOnClick = useContext(FocusedOnClickContext);

    useEffect(() => {
        setFocusedOnClick && setFocusedOnClick(() => allResults[focusedIndex]?.onClick)
    }, [focusedIndex]);

    return (
        <div className='search-results-container' ref={containerRef}>
            {allResults.map((result, index) => (
                <SearchResult
                    key={index}
                    name={result.name}
                    resultType={result.resultType}
                    onClick={result.onClick}
                    className={index === focusedIndex ? 'focused ' : ''}
                />
            ))}
        </div>
    );
};

export default SearchResults;
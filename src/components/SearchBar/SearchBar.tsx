import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './SearchResults';
import FocusedOnClickContext from '../../contexts/SearchBarContext';
import axios from 'axios';
import { serverURL } from '../../config';

interface SearchBarProps {
    placeholder: string;
    searchType?: 'languages' | 'publishers' | 'subjects' | 'authors' | 'worksAndAuthors' | 'users';
    authorsRedirect?: boolean;
    maxValues?: number;
    onValueChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', searchType, authorsRedirect = true, maxValues, onValueChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState({ works: [], authors: [], publishers: [], subjects: [], languages: [], users: [] });
    const [focusedOnClick, setFocusedOnClick] = useState<(() => void) | undefined>(undefined);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const searchDelay = 250;
    const inputRef = useRef<HTMLInputElement>(null);


    const handleKeyDown = (event: React.KeyboardEvent) => {
        const totalResults = (results?.works?.length || 0) +
            (results?.authors?.length || 0) +
            (results?.publishers?.length || 0) +
            (results?.subjects?.length || 0) +
            (results?.languages?.length || 0) +
            (results?.users?.length || 0);
        console.log(totalResults);

        if (event.key === 'ArrowDown') {
            if (focusedIndex === totalResults - 1) {
                setFocusedIndex(-1);
            } else {
                setFocusedIndex((focusedIndex + 1) % totalResults);
            }
        } else if (event.key === 'ArrowUp') {
            if (focusedIndex === 0) {
                setFocusedIndex(totalResults);
            } else {
                setFocusedIndex((focusedIndex - 1 + totalResults) % totalResults);
            }
        } else if (event.key === 'Enter' && focusedIndex !== -1) {
            if (focusedOnClick) {
                focusedOnClick()
                setSearchTerm('')
            }
        }
    };


    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            performSearch()
        }
    }

    var clearResults = () => {
        setTimeout(() => {
            setResults({ works: [], authors: [], publishers: [], subjects: [], languages: [], users: [] });
            setFocusedIndex(-1);
        }, 200);
    }

    const performSearch = () => {
        if (searchTerm) {
            var searchLocation = searchType === 'worksAndAuthors' ? '' : searchType + '/';
            axios.get(`${serverURL}/search/${searchLocation}?q=${searchTerm}&page=0&size=5`)
                .then(response => {
                    setResults({
                        works: response.data.works,
                        authors: searchType === 'authors' ? response.data.content : response.data.authors,
                        publishers: searchType === 'publishers' ? response.data.content : [],
                        subjects: searchType === 'subjects' ? response.data.content : [],
                        languages: searchType === 'languages' ? response.data.content : [],
                        users: searchType === 'users' ? response.data.content : []
                    });
                    console.log(response.data.content)
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        } else {
            clearResults();
        }
    }

    useEffect(() => {
        const timerId = setTimeout(performSearch, searchDelay);
        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const handleInputChange = (event: React.ChangeEvent<{ value: string }>) => {
        const newValue = event.target.value;
        setSearchTerm(newValue)
        // ...

        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <div
            className='search-container'
            onClick={handleContainerClick}>
            <section className="input-container">
                <SearchIcon
                    className="search-icon"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                />
                <input
                    ref={inputRef}
                    className="search-bar"
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onBlur={clearResults}
                    onKeyDown={handleKeyDown}
                />
            </section>
            <FocusedOnClickContext.Provider value={setFocusedOnClick}>
                <SearchResults
                    works={results.works}
                    authors={results.authors}
                    authorsRedirect={authorsRedirect}
                    publishers={results.publishers}
                    subjects={results.subjects}
                    languages={results.languages}
                    users={results.users}
                    focusedIndex={focusedIndex}
                    maxValues={maxValues}
                />
            </FocusedOnClickContext.Provider>
        </div>
    );
};
export default SearchBar;
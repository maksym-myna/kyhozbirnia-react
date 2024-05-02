import React, { useState, useContext } from "react";

import './FilteringSideBar.css'

import Button from '../../components/Button';
import RangeSlider from '../../components/RangeSlider';
import SearchBar from '../../components/SearchBar';
import ChipContainer from '../../components/ChipContainer';
import { WorksContext, initialState } from '../../contexts/WorksContext';
import ToggleButtonGroup from '../../components/ToggleButtonGroupComponent';
import { Book, TabletMac, Headset, CheckCircleOutline, Assignment, AllInbox, Clear, Star, AutoStories as ReadingIcon, Done as ReadIcon, Inventory2 as ToReadIcon } from '@mui/icons-material';

export type Medium = 'BOOK' | 'EBOOK' | 'AUDIOBOOK';
export type ListingType = "ALREADY_READ" | "CURRENTLY_READING" | "WANT_TO_READ"
interface FilteringSideBarProps {
    unsetState?: () => void;
}

const FilteringSideBar: React.FC<FilteringSideBarProps> = ({ unsetState }) => {
    const [availability, setAvailability] = useState<string>('available');

    const { mediums, displayMediums, displayYears, displayPages, displayLanguages, displaySubjects, displayPublishers, displayAuthors, displayAvailability, displayRatings, ratings, displayListings, listings, setState } = useContext(WorksContext);

    const handleMedium = (
        event: React.MouseEvent<HTMLElement>,
        newMedium: string | null,
    ) => {
        if (newMedium !== null) {
            setState(prevState => ({
                ...prevState,
                mediums: prevState.mediums.includes(newMedium)
                    ? prevState.mediums.filter(medium => medium !== newMedium)
                    : [...prevState.mediums, newMedium]
            }));
        }
    };

    const handleListings = (
        event: React.MouseEvent<HTMLElement>,
        newListing: ListingType | null,
    ) => {
        if (newListing !== null) {
            setState(prevState => ({
                ...prevState,
                listings: prevState.listings.includes(newListing)
                    ? prevState.listings.filter(listing => listing !== newListing)
                    : [...prevState.listings, newListing]
            }));
        }
    };


    const handleRatings = (
        event: React.MouseEvent<HTMLElement>,
        newRating: string | null,
    ) => {
        const rating = newRating ? parseInt(newRating) : null;

        if (rating !== null) {
            setState(prevState => ({
                ...prevState,
                ratings: prevState.ratings.includes(rating)
                    ? prevState.ratings.filter(r => r !== rating)
                    : [...prevState.ratings, rating]
            }));
        }
    };

    const handlePages = (newPages: (number | undefined)[]) => {
        setState(prevState => ({
            ...prevState,
            minPages: newPages[0],
            maxPages: newPages[1],
        }));
    };

    const handleYears = (newYears: (number | undefined)[]) => {
        setState(prevState => ({
            ...prevState,
            minReleaseYear: newYears[0],
            maxReleaseYear: newYears[1],
        }));
    };

    const handleAvailability = (
        event: React.MouseEvent<HTMLElement>,
        newAvailability: string | null,
    ) => {
        if (newAvailability !== null) {
            setAvailability(newAvailability);

            const stateMapping = {
                available: { isAccounted: false, isAvailable: true },
                accounted: { isAccounted: true, isAvailable: false },
                default: { isAccounted: false, isAvailable: false },
            };

            const { isAccounted, isAvailable } = stateMapping[newAvailability as keyof typeof stateMapping] || stateMapping.default;

            setState(prevState => ({
                ...prevState,
                isAccounted,
                isAvailable,
            }));
        }
    };

    const triggerSearch = () => {
        setState(prevState => ({
            ...prevState,
            searchTrigger: !prevState.searchTrigger
        }));
    }

    const clearFilters = () => {
        if (unsetState) {
            unsetState();
        } else {
            setState(initialState);
        }
        setAvailability('available');
        triggerSearch();
    }

    return <div className='filters-container'>
        {displayListings && <ToggleButtonGroup<ListingType>
            options={[
                { value: 'WANT_TO_READ', IconComponent: ToReadIcon, label: 'Хоче' },
                { value: 'CURRENTLY_READING', IconComponent: ReadingIcon, label: 'Читає' },
                { value: 'ALREADY_READ', IconComponent: ReadIcon, label: 'Читав' },
            ]}
            value={listings}
            onChange={handleListings}
        />
        }
        {displayRatings && <ToggleButtonGroup<string>
            options={Array.from({ length: 5 }, (_, i) => ({ value: (i + 1).toString(), IconComponent: Star, label: (i + 1).toString() }))}
            value={ratings.map(String)}
            onChange={handleRatings}
        />
        }
        {displayMediums && <section className="toggle-button-group-container">
            <ToggleButtonGroup<Medium>
                options={[
                    { value: 'BOOK', IconComponent: Book, label: 'Папір' },
                    { value: 'EBOOK', IconComponent: TabletMac, label: 'Е-книга' },
                    { value: 'AUDIOBOOK', IconComponent: Headset, label: 'Авдіо' },
                ]}
                value={mediums as Medium[]}
                onChange={handleMedium}
            />
        </section>}
        {displayYears && <section className='filter-container with-slider'>
            <div className='filter-title'>
                Рік випуску
            </div>
            <RangeSlider min={1900} max={new Date(Date.now()).getFullYear()} onChange={handleYears} />
        </section>}
        {displayPages && <section className='filter-container with-slider'>
            <div className='filter-title'>
                Сторінки
            </div>
            <RangeSlider min={0} max={500} onChange={handlePages} />
        </section>}
        {displayLanguages && <section className='filter-container'>
            <div className='filter-title'>
                Мови
            </div>
            <SearchBar placeholder='Введіть текст...' searchType='languages' />
            <ChipContainer type='languages' />
        </section>}
        {displaySubjects && <section className='filter-container'>
            <div className='filter-title'>
                Жанри
            </div>
            <SearchBar placeholder='Введіть текст...' searchType='subjects' />
            <ChipContainer type='subjects' />
        </section>}
        {displayPublishers && <section className='filter-container'>
            <div className='filter-title'>
                Видавництва
            </div>
            <SearchBar placeholder='Введіть текст...' searchType='publishers' />
            <ChipContainer type='publishers' />
        </section>}
        {displayAuthors && <section className='filter-container'>
            <div className='filter-title'>
                Автори
            </div>
            <SearchBar placeholder='Введіть текст...' searchType='authors' authorsRedirect={false} />
            <ChipContainer type='authors' />
        </section>}
        {displayAvailability && <ToggleButtonGroup<'available' | 'accounted' | 'all'>
            options={[
                { value: 'available', IconComponent: CheckCircleOutline, label: 'Наявні' },
                { value: 'accounted', IconComponent: Assignment, label: 'Обліковані' },
                { value: 'all', IconComponent: AllInbox, label: 'Усі' },
            ]}
            value={availability as 'available' | 'accounted' | 'all'}
            onChange={handleAvailability}
        />
        }
        <section className='search-buttons-container'>
            <Clear className="clear-filters" style={{
                "fill": "var(--primary-color)",
                "height": "2rem",
                "width": "2rem"
            }} onClick={() => clearFilters()} />
            <Button width="12rem" height="3rem" onClick={triggerSearch} >
                Знайти
            </Button>
        </section>
    </div >;
}

export default FilteringSideBar;
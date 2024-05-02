import React, { useState, useContext, useEffect } from 'react';
import './WorksFilteringPage.css';
import Header from '../../components/Header';
import FilteringSideBar, { ListingType } from '../../components/FilteringSideBar';
import Footer from '../../components/Footer';
import WorksResults from '../../components/Works';
import { WorksContext, WorksState, initialState, VisibilityProps } from '../../contexts/WorksContext';
import HeroSection from '../../components/HeroSection';

interface WorksFilteringPageProps extends VisibilityProps {
    currentPage?: 'subjects' | 'publishers' | 'authors' | 'works';
    title?: string;
    description?: string;
    isbn?: string;
    showHeader?: boolean;
    listings?: boolean;
    ratings?: boolean;
    userId?: number;
}

const WorksFilteringPage: React.FC<WorksFilteringPageProps> = ({
    mediums = true,
    years = true,
    pages = true,
    languages = true,
    subjects = true,
    publishers = true,
    authors = true,
    availability = true,
    defaultSubject,
    defaultAuthor,
    defaultPublisher,
    currentPage,
    title,
    description,
    isbn,
    showHeader = true,
    listings: showListings = false,
    ratings: showRatings = false,
    userId
}) => {

    const defaultState = {
        displayMediums: mediums,
        displayYears: years,
        displayPages: pages,
        displayLanguages: languages,
        displaySubjects: subjects,
        displayPublishers: publishers,
        displayAuthors: authors,
        displayAvailability: availability,
        displayListings: showListings,
        displayRatings: showRatings,
        defaultSubjects: defaultSubject ? [defaultSubject] : [],
        defaultAuthors: defaultAuthor ? [defaultAuthor] : [],
        defaultPublishers: defaultPublisher ? [defaultPublisher] : [],
        userId: userId,
    }

    const [state, setState] = useState<WorksState>({ ...initialState, ...defaultState });

    const unsetState = () => setState({ ...state, ...defaultState });

    useEffect(() => {
        unsetState();
    }, []);

    return (
        <div className="home">
            {showHeader &&
                <>
                    <Header currentPage={currentPage} />
                    <div className='page-title'>
                        {defaultAuthor ? defaultAuthor : ''}
                        {defaultPublisher ? defaultPublisher : ''}
                    </div>
                </>
            }
            {title && description && isbn && <HeroSection title={title} description={description} isbn={isbn} hideButton />}
            <WorksContext.Provider value={{ ...state, setState }}>
                <main className="works-main-container">
                    <FilteringSideBar unsetState={unsetState} />
                    <WorksResults />
                </main>
            </WorksContext.Provider>
            {showHeader &&
                <Footer />
            }
        </div>
    );
};

export default WorksFilteringPage;
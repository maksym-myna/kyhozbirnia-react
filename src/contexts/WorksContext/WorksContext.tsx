import React from 'react';
import { ListingType } from '../../components/FilteringSideBar';

export interface WorksState {
    minReleaseYear: number | undefined;
    maxReleaseYear: number | undefined;
    minPages: number | undefined;
    maxPages: number | undefined;
    mediums: string[];
    languages: string[];
    subjects: string[];
    publishers: string[];
    authors: string[];
    ratings: number[];
    listings: ListingType[];
    isAccounted: boolean;
    isAvailable: boolean;
    searchTrigger: boolean;
    displayMediums: boolean;
    displayYears: boolean;
    displayPages: boolean;
    displayLanguages: boolean;
    displaySubjects: boolean;
    displayPublishers: boolean;
    displayAuthors: boolean;
    displayAvailability: boolean;
    displayRatings: boolean;
    displayListings: boolean;
    defaultSubjects?: string[];
    defaultAuthors?: string[];
    defaultPublishers?: string[];
    first: boolean;
    last: boolean;
    page: number;
    userId?: number;
}

interface WorksContextType extends WorksState {
    setState: React.Dispatch<React.SetStateAction<WorksState>>;
}

export const initialState: WorksState = {
    minReleaseYear: undefined,
    maxReleaseYear: undefined,
    minPages: undefined,
    maxPages: undefined,
    mediums: [],
    languages: [],
    subjects: [],
    publishers: [],
    authors: [],
    ratings: [],
    listings: [],
    isAccounted: false,
    isAvailable: true,
    searchTrigger: false,
    displayMediums: true,
    displayYears: true,
    displayPages: true,
    displayLanguages: true,
    displaySubjects: true,
    displayPublishers: true,
    displayAuthors: true,
    displayAvailability: true,
    displayRatings: false,
    displayListings: false,
    defaultSubjects: [],
    defaultAuthors: [],
    defaultPublishers: [],
    first: true,
    last: false,
    page: 0,
    userId: undefined
};

export interface VisibilityProps {
    mediums?: boolean;
    years?: boolean;
    pages?: boolean;
    languages?: boolean;
    subjects?: boolean;
    publishers?: boolean;
    authors?: boolean;
    availability?: boolean;
    defaultSubject?: string;
    defaultAuthor?: string;
    defaultPublisher?: string;
}

const WorksContext = React.createContext<WorksContextType>({ ...initialState, setState: () => { } });

export { WorksContext };
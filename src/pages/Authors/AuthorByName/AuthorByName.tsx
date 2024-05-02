import React from 'react';
import { useParams } from 'react-router-dom';
import WorksFilteringPage from '../../../components/WorksFilteringPage';

const AuthorByName: React.FC = () => {
    const { name } = useParams<{ name: string }>();

    return (
        <WorksFilteringPage
            currentPage='authors'
            defaultAuthor={name}
            authors={false}
        />
    );
};

export default AuthorByName;
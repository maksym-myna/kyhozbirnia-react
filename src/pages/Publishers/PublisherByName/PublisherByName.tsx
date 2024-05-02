import React from 'react';
import { useParams } from 'react-router-dom';
import WorksFilteringPage from '../../../components/WorksFilteringPage';

const PublisherByName: React.FC = () => {
    const { name } = useParams<{ name: string }>();

    return (
        <WorksFilteringPage
            currentPage='publishers'
            defaultPublisher={name}
            publishers={false}
        />
    );
};

export default PublisherByName;
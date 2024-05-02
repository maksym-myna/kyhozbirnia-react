import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SubjectList } from '../../components/Subjects';

const Subjects: React.FC = () => {
    return (
        <>
            <Header currentPage='subjects' />
            <SubjectList />
            <Footer />
        </>
    );
};

export default Subjects;
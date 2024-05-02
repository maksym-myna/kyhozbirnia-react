import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ListOfReferalObjects from '../../components/ListOfReferalObjects';

const Authors: React.FC = () => {
    return (
        <>
            <Header currentPage='authors' />
            <ListOfReferalObjects destination='authors' />
            <Footer />
        </>
    );
};

export default Authors;
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ListOfReferalObjects from '../../components/ListOfReferalObjects';

const Publishers: React.FC = () => {
    return (
        <>
            <Header currentPage='publishers' />
            <ListOfReferalObjects destination='publishers' />
            <Footer />
        </>
    );
};

export default Publishers;
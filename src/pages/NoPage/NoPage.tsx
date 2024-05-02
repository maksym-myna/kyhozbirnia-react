import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import './NoPage.css';

const NoPage: React.FC = () => {

    return (
        <>
            <Header />
            <h1 className="page-not-found-header">Такої сторінки не існує 😿</h1>
            <div className="no-page-image-container">
                <img className="no-page-image" src="https://i.imgflip.com/2pg2s7.jpg?a475896"></img>
            </div>
            <Footer />
        </>
    )
}

export default NoPage;
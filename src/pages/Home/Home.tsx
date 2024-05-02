import React from 'react';
import './Home.css';
import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Carousel from '../../components/Carousel';
import Footer from '../../components/Footer';
import { subjectItems } from '../../config';

const Home: React.FC = () => {
    const mappedItems = Object.entries(subjectItems).map(([genre, isbn]) => ({
        src: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
        alt: `${genre} genre section cover`,
        description: genre,
        url: `/subjects/${encodeURIComponent(genre)}`
    }));

    return (
        <div className="home">
            <Header />
            <main className="main-container">
                <section>
                    <HeroSection
                        isbn="9780375712364"
                        title='Твоє наступне книжкове <u>кохання</u> вже чекає.'
                        description='Відкривай для себе книжки з <u><b>тисяч</b></u> наявних та поринай у захопливий світ літератури.
                        <br />
                        Переходь до нашого каталогу та <b>знаходь</b> книгу до душі. Не забудь <b>оцінити</b> прочитані книги для нашої дружньої спільноти.'
                    />
                </section>
                <section className='main-page-section'>
                    <p className='section-title'>Обирай за жанром</p>
                    <Carousel items={mappedItems} />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
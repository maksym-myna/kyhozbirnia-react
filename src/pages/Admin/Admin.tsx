import React, { useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import Footer from "../../components/Footer";
import './Admin.css';
import SearchBar from "../../components/SearchBar";
import BigQueryImport from "../../components/BigQueryImport";
import BigQueryExport from "../../components/BigQueryExport";

const Admin: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState<string>('Дешборди');

    const handleSectionClick = (section: string) => {
        setSelectedSection(section);
    }

    return (
        <div className="admin-page-container">
            <Header />
            <section className="sections header-sections tabs-container">
                <div className={`section-item ${selectedSection === 'Дешборди' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Дешборди')}>
                    Дешборди
                </div>
                <div className={`section-item ${selectedSection === 'Експорт та імпорт' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Експорт та імпорт')}>
                    Експорт та імпорт
                </div>
                <div className={`section-item ${selectedSection === 'Закриття позик' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Закриття позик')}>
                    Закриття позик
                </div>
            </section>
            {selectedSection === 'Дешборди' &&
                <Dashboard />
            }
            {selectedSection === 'Експорт та імпорт' &&
                <>
                    <h2 className='admin-page-subheader'>Імпорт в BigQuery</h2>
                    <BigQueryImport />
                    <h2 className='admin-page-subheader'>Експорт з BigQuery</h2>
                    <BigQueryExport />
                </>
            }
            {selectedSection === 'Закриття позик' &&
                <div className="user-search-bar-container">
                    <SearchBar searchType="users" placeholder="Введіть ім'я"></SearchBar>
                </div>
            }
            <Footer />
        </div>
    )
}

export default Admin;
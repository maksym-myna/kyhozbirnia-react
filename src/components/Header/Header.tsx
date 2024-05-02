import React, { useContext, useEffect } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import FaceIcon from '@mui/icons-material/Face';
import SearchBar from '../SearchBar';
import Button from '../Button';
import Link from '../Link';
import './Header.css';
import WebsiteSections from '../WebsiteSections';
import { AuthContext, unauthorizedUser } from '../../contexts/AuthContext';
import { serverURL } from '../../config';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export interface HeaderProps {
    currentPage?: 'works' | 'publishers' | 'authors' | 'subjects';
    postButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentPage, postButton }) => {
    const { role, pfpUrl, handleLogin, setUser } = useContext(AuthContext);
    const location = useLocation()

    const handleLoginClick = () => {
        handleLogin(location.pathname);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${serverURL}/users/`, { withCredentials: true });
                setUser({ ...response.data });
            } catch (error: any) {
                if (error.response && error.response.data.error === 'No value present') {
                    setUser(unauthorizedUser);
                } else {
                    console.error('Failed to check auth:', error);
                }
            }
        };

        checkAuth();
    }, []);

    return (
        <>
            <header className="header">
                <div className="title-container">
                    <Link to="/" className="title">
                        Книгозбірня
                    </Link>
                </div>
                <SearchBar placeholder="Search by title or author..." searchType="worksAndAuthors" />
                <section className="profile-login-container">
                    {!role || role !== 'UNAUTHORIZED'
                        ?
                        <div className="profile-text-container">
                            {role === 'ADMIN' ? <Link to='/admin'> <Button width='8rem' height='3rem' margin="0 1rem 0 0" outlined onClick={() => { }}>Адмінка</Button></Link> : ''}
                            {

                                !pfpUrl ?
                                    <FaceIcon style={{ width: "2rem", height: "2rem" }} />
                                    :
                                    <img className="pfp" src={pfpUrl} alt="Profile" />
                            }
                            <Link to="/profile" className="profile-text">Профіль</Link>
                        </div>
                        :
                        <Link to="/" className="profile-text-container">
                            <LoginIcon style={{ width: "2rem", height: "2rem" }} onClick={handleLoginClick} />
                            <p className="profile-text" onClick={handleLoginClick}>Увійти</p>
                        </Link>
                    }
                </section >
            </header >
            <WebsiteSections type='header' currentPage={currentPage} postButton={postButton} />
        </>
    );
};

export default Header;
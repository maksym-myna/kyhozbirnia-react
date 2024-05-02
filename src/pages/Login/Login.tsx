import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverURL } from '../../config';
import axios from 'axios';

export interface CurrentPageProps {
    currentPage?: 'works' | 'publishers' | 'authors' | 'subjects';
}

const Login: React.FC<CurrentPageProps> = ({ currentPage }) => {
    const { handleLogin } = useContext(AuthContext);
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${serverURL}/users/`, { withCredentials: true });

                navigate('/profile')
            } catch (error: any) {
                handleLogin(location.pathname);
            }
        };

        checkAuth();
    }, []);

    return (
        <></>
    )
}

export default Login;


import React, { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { AuthContext, UserState, unauthorizedUser } from '../../contexts/AuthContext';

const OAauthRedirectHandler: React.FC = () => {
    const { pfpUrl, role, id, fetchUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            fetchUser()
            const prevLocation = localStorage.getItem('pathname');
            if (prevLocation) {
                navigate(prevLocation);
            } else {
                navigate('/');
            }
        };

        fetch();
    }, []);

    return (
        <div>Успішно!</div>
    )
}

export default OAauthRedirectHandler;
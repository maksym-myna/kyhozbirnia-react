import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, unauthorizedUser } from '../../contexts/AuthContext';
import axios from 'axios';
import { serverURL } from '../../config';

interface PrivateRouteProps {
    path: string;
    element: React.ReactElement;
    requiredRole: 'ADMIN' | 'USER' | 'UNAUTHORIZED';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, element, path }) => {
    const { role, email, fetchUser, handleLogin, setUser } = useContext(AuthContext);
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const location = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${serverURL}/users/`, { withCredentials: true });
                setUser({ ...response.data });
                const authorized = (response.data.role === 'ADMIN') ||
                    (response.data.role === 'USER' && (requiredRole === 'USER' || requiredRole === 'UNAUTHORIZED')) ||
                    (response.data.role === 'UNAUTHORIZED' && requiredRole === 'UNAUTHORIZED')
                if (!authorized) {
                    navigate('/login')
                }
                setIsAuthorized(authorized);
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

    return isAuthorized ? element : null;
};

export default PrivateRoute;
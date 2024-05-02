import React, { useState } from 'react';
import { serverURL } from '../../config';
import axios from 'axios';

export interface UserState {
    id: number | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    gender: 'm' | 'f' | 'n' | undefined,
    role: 'ADMIN' | 'USER' | 'UNAUTHORIZED',
    pfpUrl: string | undefined,
    handleLogin: (pathname: string) => void,
    fetchUser(): void
}

interface AuthContextType extends UserState {
    setUser: React.Dispatch<React.SetStateAction<UserState>>,
    handleLogin: (pathname: string) => void,
    fetchUser(): void
}

export const unauthorizedUser: UserState = {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    gender: undefined,
    role: 'UNAUTHORIZED',
    pfpUrl: undefined,
    handleLogin: (pathname: string) => {
        localStorage.setItem('pathname', pathname);
        window.location.href = `${serverURL}/oauth2/authorization/google`;
    },
    fetchUser: () => { }
};

const AuthContext = React.createContext<AuthContextType>({
    ...unauthorizedUser,
    setUser: () => { },
});

export { AuthContext };
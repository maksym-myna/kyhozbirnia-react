import React from 'react';

export interface ConnectionContextProps {
    isConnected: boolean;
    setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConnectionContext = React.createContext<ConnectionContextProps>({
    isConnected: false,
    setConnected: () => { },
});
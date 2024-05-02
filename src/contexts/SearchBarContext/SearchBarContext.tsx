import React from 'react';

const FocusedOnClickContext = React.createContext<React.Dispatch<React.SetStateAction<(() => any) | undefined>> | undefined>(undefined);

export default FocusedOnClickContext;
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
    userValue: string;
    updateUserValue: (newValue: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
    const [userValue, setUserValue] = useState<string>('');

    const updateUserValue = (newValue: string) => {
        setUserValue(newValue);
    };

    return (
        <UserContext.Provider value={{ userValue, updateUserValue }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};

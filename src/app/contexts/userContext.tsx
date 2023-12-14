import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserContextProps, userValueDT } from '../types/KanbanTypes';



const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
    const [userValue, setUserValue] = useState<userValueDT>({
        token: '',
        userData: {
            email: '',
            gender: '',
            id: 0,
            name: '',
            nationality: '',
            permissionLevel: '',
            profilePicture: null,
            pushEmail: null,
            registrationDate: '',
            role: '',
        },
        usersList: [],
    });

    const updateUserValue = (newValue: userValueDT) => {
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

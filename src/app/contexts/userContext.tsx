import { createContext, useContext, useState } from 'react';

interface UserContextProps {
    value: string,
    setValue: (newValue: string) => void;
}

const UserContext = createContext<UserContextProps | any>({});

export function useUserContext() {
    return useContext(UserContext);
}

export function UserContextWrapper({ children }: any) {
    const [value, setValue] = useState<string>("");

    const updateValue = (newValue: string) => {
        setValue(newValue);
    }
    return (
        <UserContext.Provider value={{ value, updateValue }}>
            {children}
        </ UserContext.Provider>
    );
}


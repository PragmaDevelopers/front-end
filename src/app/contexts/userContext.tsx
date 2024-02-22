import React, { createContext, useContext, useState, ReactNode } from 'react';
import { userValueDT } from '../types/KanbanTypes';
import { UserContextProps } from '../interfaces/KanbanInterfaces';

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [userValue, setUserValue] = useState<userValueDT>({
    token: '',
    profileData: {
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
      isReceiveNotification: false
    },
    notifications: [],
    notificationCount: 0,
    userList: [],
  });

  return (
    <UserContext.Provider value={{ userValue, setUserValue }}>
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
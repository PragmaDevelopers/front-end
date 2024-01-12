import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Kanban } from '../types/KanbanTypes';
import { ModalContextProps } from '../interfaces/KanbanInterfaces';

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalContextProviderProps {
  children: ReactNode;
}

export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({ children }) => {

    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalDescription, setModalDescription] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalOptions, setModalOptions] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalBorderColor, setModalBorderColor] = useState<string>("");
    const [modalFocusRef, setModalFocusRef] = useState<any>();

    const modalProps:ModalContextProps = {
        modalTitle, setModalTitle,
        modalDescription, setModalDescription,
        modalText, setModalText,
        modalOptions, setModalOptions,
        modalOpen, setModalOpen,
        modalBorderColor, setModalBorderColor,
        modalFocusRef, setModalFocusRef 
    }

    return (
        <ModalContext.Provider value={modalProps}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext  must be used within a ModalContextProvider');
  }
  return context;
};
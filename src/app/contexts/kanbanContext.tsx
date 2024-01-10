import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Kanban } from '../types/KanbanTypes';
import { KanbanContextProps } from '../interfaces/KanbanInterfaces';

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

interface KanbanContextProviderProps {
  children: ReactNode;
}

export const KanbanContextProvider: React.FC<KanbanContextProviderProps> = ({ children }) => {
  const [kanbanValues, setKanbanValues] = useState<Kanban[]>([]);

  return (
    <KanbanContext.Provider value={{ kanbanValues, setKanbanValues }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanbanContext = (): KanbanContextProps => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanbanContext  must be used within a KanbanContextProvider');
  }
  return context;
};
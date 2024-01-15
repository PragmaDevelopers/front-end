import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card, Column, Kanban } from '../types/KanbanTypes';
import { KanbanContextProps } from '../interfaces/KanbanInterfaces';

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

interface KanbanContextProviderProps {
  children: ReactNode;
}

export const KanbanContextProvider: React.FC<KanbanContextProviderProps> = ({ children }) => {
  const [kanbanList, setKanbanList] = useState<Kanban[]>([]);
  const [tempKanban, setTempKanban] = useState<Kanban>({
    id: 0,
    title: "",
    members: [],
    columns: []
  });
  const [tempColumn, setTempColumn] = useState<Column>({
    id: 0,
    title: "",
    index: 0,
    cards: []
  });
  const [tempCard, setTempCard] = useState<Card>({
    id: "",
    columnID: "",
    kanbanID: "",
    title: "",
    index: 0,
    description: "",
    checklists: [],
    tags: [],
    members: [],
    comments: [],
    dropdowns: [],
    deadline: {
      id: "",
      category: "",
      date: null,
      overdue: false,
      toColumnId: ""
    },
    customFields: [],
    innerCards: []
  });

  const [cardManager,setCardManager] = useState({
    isSubmit: false,
    isEditElseCreate: false,
    isShowCreateCard: false,
    isShowCreateDeadline: false,
    isShowAddMember: false,
    isShowCreateTag: false,
    isShowCreateCustomField: false,
    isShowCreateAnsweredComment: false,
    isShowCreateInnerCard: false
  });

  return (
    <KanbanContext.Provider value={{ 
      kanbanList, setKanbanList,
      tempKanban, setTempKanban,
      tempColumn, setTempColumn,
      tempCard, setTempCard,
      cardManager,setCardManager 
    }}>
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
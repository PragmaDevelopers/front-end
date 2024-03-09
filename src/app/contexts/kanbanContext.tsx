import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card, Column, Kanban, SystemID, User } from '../types/KanbanTypes';
import { KanbanContextProps } from '../interfaces/KanbanInterfaces';

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

interface KanbanContextProviderProps {
  children: ReactNode;
}

export const KanbanContextProvider: React.FC<KanbanContextProviderProps> = ({ children }) => {
  const [kanbanList, setKanbanList] = useState<Kanban[] | null>(null);
  const [tempKanban, setTempKanban] = useState<Kanban>({
    id: "",
    title: "",
    version: "",
    columns: []
  });
  const [tempKanbanMembers,setTempKanbanMembers] = useState<User[]>([]);
  const [tempColumn, setTempColumn] = useState<Column>({
    id: "",
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
    comments: null,
    dropdowns: [],
    deadline: {
      id: "",
      category: "",
      date: null,
      overdue: false,
      toColumnId: "",
      toKanbanId: ""
    },
    customFields: [],
    innerCards: null
  });
  const [deleteTempCardIds,setDeleteTempCardIds] = useState<{type:string,id:SystemID}[]>([]);
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
  const [tempKanbanIntervalId,setTempKanbanIntervalId] = useState<any|null>(null);

  return (
    <KanbanContext.Provider value={{ 
      kanbanList, setKanbanList,
      tempKanban, setTempKanban,
      tempKanbanMembers, setTempKanbanMembers,
      tempColumn, setTempColumn,
      tempCard, setTempCard,
      deleteTempCardIds,setDeleteTempCardIds,
      cardManager,setCardManager,
      tempKanbanIntervalId,setTempKanbanIntervalId
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
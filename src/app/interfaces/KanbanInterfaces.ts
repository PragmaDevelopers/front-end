import { Card, Column } from "../types/KanbanTypes";

export interface CardElementProps {
    card: Card,
    deleteCard: (columnID: string, cardID: string) => void;
    setShowCreateCardForm: (state: boolean) => void;
    setTempCard: (card: Card) => void;
    setIsEdition: (state: boolean) => void;
    setTempColumnID: (id: string) => void;
    setEditorText: any;
}

export interface ColumnContainerProps {
    column: Column;
    deleteColumn: (id: string) => void;
    updateColumnTitle: (id: string, title: string) => void;
    createCard: (columnID: string) => void;
    deleteCard: (columnID: string, cardID: string) => void;
    setShowCreateCardForm: (state: boolean) => void;
    setTempCard: (card: Card) => void;
    setIsEdition: (state: boolean) => void;
    setTempColumnID: (id: string) => void;
    setEditorText: any;
}

export interface CreateEditCardProps {
    showCreateCardForm: boolean;
    createCardForm: (event: any, isEdition: boolean) => void;
    card: Card;
    updateListTitle: any;
    handleRemoveInput: any;
    handleRemoveList: any;
    handleAddList: any;
    handleAddInput: any;
    setShowCreateCardForm: any;
    handleInputChange: any;
    handleToggleCheckbox: any;
    isEdition: boolean;
    addNewTag: any;
    removeCurrentTag: any;
    cardDate: any;
    setCardDate: any;
    editorText: any;
    setEditorText: any;
}

export interface RichEditorProps {
    markdown?: string;
    getMarkdown?: any;
    setMarkdown?: any;
    setMarkdownContent?: string;
    onChange?: any;
    display?: any;
}


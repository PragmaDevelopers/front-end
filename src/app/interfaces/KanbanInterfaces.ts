import { Card, Column } from "../types/KanbanTypes";

export interface CardElementProps {
    card: Card,
    deleteCard: (columnID: string | number, cardID: string | number) => void;
    setShowCreateCardForm: (state: boolean) => void;
    setTempCard: (card: Card) => void;
    setIsEdition: (state: boolean) => void;
    setTempColumnID: (id: string | number) => void;
    setEditorText: any;

    setModalTitle: any;
    setModalDescription: any;
    setModalText: any;
    setModalOptions: any;
    setModalOpen: any;
    setModalBorderColor: any;
    setModalFocusRef: any;

}

export interface ColumnContainerProps {
    column: Column;
    deleteColumn: (id: string | number) => void;
    updateColumnTitle: (id: string | number, title: string) => void;
    createCard: (columnID: string | number) => void;
    deleteCard: (columnID: string | number, cardID: string | number) => void;
    setShowCreateCardForm: (state: boolean) => void;
    setTempCard: (card: Card) => void;
    setIsEdition: (state: boolean) => void;
    setTempColumnID: (id: string | number) => void;
    setEditorText: any;

    setModalTitle: any;
    setModalDescription: any;
    setModalText: any;
    setModalOptions: any;
    setModalOpen: any;
    setModalBorderColor: any;
    setModalFocusRef: any;
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
    addCustomField: any;
    addInnerCard: any;
    createInnerCard: any;
    tempCardsArr: Card[];
    isCreatingInnerCard: boolean;
    setIsCreatingInnerCard: any;
    isEdittingInnerCard: boolean;
    setIsEdittingInnerCard: any;
    _appendToTempCardsArray: any;
    _popFromTempCardsArray: any;



    setModalTitle: any;
    setModalDescription: any;
    setModalText: any;
    setModalOptions: any;
    setModalOpen: any;
    setModalBorderColor: any;
    setModalFocusRef: any;
}

export interface RichEditorProps {
    markdown?: string;
    getMarkdown?: any;
    setMarkdown?: any;
    setMarkdownContent?: string;
    onChange?: any;
    display?: any;
}

export interface ConfirmDeleteProps {
    message: string;
    yesText: string;
    noText: string;
    yesFunction: any;
    noFunction: any;
    showPrompt: boolean;
}

export interface InnerCardElementProps {
    card: Card;
    addInnerCard: any;
    createInnerCard: any;
    tempCardsArr: Card[];
    isCreatingInnerCard: boolean;
    setIsCreatingInnerCard: any;
    isEdittingInnerCard: boolean;
    setIsEdittingInnerCard: any;
    _appendToTempCardsArray: any;
    _popFromTempCardsArray: any;
}

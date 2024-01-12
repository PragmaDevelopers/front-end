import { MutableRefObject } from "react";
import { Card, Column, Member, SystemID, Comment, userValueDT, Kanban } from "../types/KanbanTypes";

export interface CardElementProps {
    card: Card,
    kanban: Kanban,
    column: Column,
    modalContextProps: ModalContextProps
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

    handleAddDate: any;

    setTempCard: any;
    setTempCardsArr: any;
    kanbanValues: Kanban[],
    kanban: Kanban
}

export interface RichEditorProps {
    markdown?: string;
    getMarkdown?: any;
    setMarkdown?: any;
    setMarkdownContent?: string;
    onChange?: any;
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
    tempCard: any;
    setTempCard: any;
    setTempCardsArr: any;
}

export interface CommentEntryProps extends Comment {
    setIsAnswering: (arg0: { isAnswering: boolean, answeringUser: Member, commentId: SystemID }) => void;
    removeCurrentComment: (targetId: SystemID) => void,
    editComment: (arg0: Comment) => void,
}

export interface UserContextProps {
    userValue: userValueDT;
    setUserValue: (newValue: userValueDT) => void;
}

export interface CardManager{
    isSubmit:boolean;
    isEditElseCreate: boolean,
    isShowCreateCard:boolean
    isShowCreateDeadline: boolean;
    isShowAddMember: boolean;
    isShowCreateTag: boolean;
    isShowCreateCustomField: boolean;
}

export interface KanbanContextProps {
    kanbanValues: Kanban[];
    setKanbanValues: (newValue: Kanban[]) => void;
    tempKanban: Kanban;
    setTempKanban: (newValue: Kanban) => void;
    tempColumn: Column;
    setTempColumn: (newValue: Column) => void;
    tempCard: Card;
    setTempCard: (newValue: Card) => void;
    cardManager: CardManager;
    setCardManager:  (newValue: CardManager) => void
};

export interface ModalContextProps {
    modalTitle: string,
    setModalTitle: (newValue: string) => void;
    modalDescription: string,
    setModalDescription: (newValue: string) => void;
    modalText: string,
    setModalText: (newValue: string) => void;
    modalOptions: any,
    setModalOptions: (newValue: any) => void;
    modalOpen: boolean,
    setModalOpen: (newValue: boolean) => void;
    modalBorderColor: string;
    setModalBorderColor: (newValue: string) => void;
    modalFocusRef: MutableRefObject<any>;
    setModalFocusRef: (newValue: MutableRefObject<any>) => void;
}

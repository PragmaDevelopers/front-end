import { MutableRefObject } from "react";
import { Card, Column, User, SystemID, Comment, userValueDT, Kanban, NotificationUser } from "../types/KanbanTypes";

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

export interface RichEditorProps {
    setTempCard: (newValue:Card)=>void,
    tempCard: Card
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
    setIsAnswering: (arg0: { isAnswering: boolean, answeringUser: User, commentId: SystemID }) => void;
    removeCurrentComment: (targetId: SystemID) => void,
    editComment: (arg0: Comment) => void,
}

export interface UserContextProps {
    userValue: userValueDT;
    setUserValue: (newValue: userValueDT) => void;
    notificationCount: number,
    setNotificationCount: (newValue:number)=>void,
    notifications: NotificationUser[],
    setNotifications: (newValue:NotificationUser[])=>void
}

export interface CardManager{
    isSubmit:boolean;
    isEditElseCreate: boolean,
    isShowCreateCard:boolean
    isShowCreateDeadline: boolean;
    isShowAddMember: boolean;
    isShowCreateTag: boolean;
    isShowCreateCustomField: boolean;
    isShowCreateInnerCard: boolean;
    isShowCreateAnsweredComment: boolean;
}

export interface KanbanContextProps {
    kanbanList: Kanban[] | null;
    setKanbanList: (newValue: Kanban[] | null) => void;
    tempKanban: Kanban;
    setTempKanban: (newValue: Kanban) => void;
    tempColumn: Column;
    setTempColumn: (newValue: Column) => void;
    tempCard: Card;
    setTempCard: (newValue: Card) => void;
    deleteTempCardIds: {type:string,id:SystemID}[],
    setDeleteTempCardIds: (newValue:{type:string,id:SystemID}[]) => void,
    cardManager: CardManager;
    setCardManager:  (newValue: CardManager) => void,
    tempKanbanIntervalId:any|null,
    setTempKanbanIntervalId: (newValue:any|null)=>void
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

import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { RefObject } from "react";

export async function ShowCreateDeadline(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_PRAZOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateDeadline:true});
}

export function ConfirmDeleteDeadline(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_PRAZOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Prazo");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateCustomField(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userData.profileData, "CRIAR_CAMPO")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateCustomField:true});     
};

export function ConfirmDeleteCustomField(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CAMPO")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Campo");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateTag(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
): void {
    if (!isFlagSet(userData.profileData, "CRIAR_TAG")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateTag:true});
};

export function ConfirmDeleteTag(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_TAG")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Etiqueta");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export async function CreateChecklist(
    userData: userValueDT,
    setTempCard: (newValue: Card) => void,
    tempCard: Card,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_CHECKLISTS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setTempCard({...tempCard,checklists:[...tempCard.checklists,{
        id: "",
        items: [],
        name: ""
    }]});
}

export function ConfirmDeleteChecklist(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CHECKLISTS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Lista");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export async function CreateChecklistItem(
    userData: userValueDT,
    setTempCard: (newValue: Card) => void,
    tempCard: Card,
    checklistIndex: number,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_CHECKLISTITEMS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const checklists = tempCard.checklists;
    checklists[checklistIndex].items.push({
        id: "",
        completed: false,
        name: "",
        checklistId: ""
    });
    setTempCard({...tempCard,checklists:checklists});
}

export function ConfirmDeleteChecklistItem(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CHECKLISTITEMS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Tarefa");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateAnsweredComment(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_COMENTÁRIOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateAnsweredComment:true});
}

export function CreateComment(
    userData: userValueDT,
    content: string,
    setContent: (newValue: string) => void,
    setTempCard: (newValue: Card) => void,
    tempCard: Card, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_COMENTÁRIOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setTempCard({...tempCard,comments:[...tempCard.comments,{
        content: content,
        edited: false,
        id: "prov"+tempCard.comments.length ,
        registrationDate: new Date(),
        user: userData.profileData,
        answers: []
    }]});
    setContent("");
}

export function ConfirmDeleteOtherComment(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_COMENTÁRIOS_EXTERNOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Comentário");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ConfirmDeleteYourComment(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_COMENTÁRIOS_PRÓPRIOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Comentário");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}
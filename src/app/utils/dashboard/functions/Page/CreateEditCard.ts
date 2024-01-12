import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { userValueDT } from "@/app/types/KanbanTypes";
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

export function ShowCreationTag(
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
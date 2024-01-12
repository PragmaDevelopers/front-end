import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Column, Kanban, SystemID, userData, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_column, patch_column, post_column } from "@/app/utils/fetchs";
import { API_BASE_URL } from "@/app/utils/variables";
import { RefObject, useRef } from "react";

export async function CreateNewColumn(
    userValue: userValueDT,
    setTempColumn: (prevState: Column) => void,
    kanban: Kanban,
    falseModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {

    if (!isFlagSet(userValue.profileData, "CRIAR_COLUNAS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(falseModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }

    const columnCount = kanban.columns != undefined ? kanban.columns.length : 0;

    post_column({
        kanbanId: kanban.id,
        title: `Column ${columnCount}`
    },userValue.token,(response)=>response.json().then((id)=>{
        console.log(id)
        setTempColumn({
            id: id,
            title: `Column ${columnCount}`,
            index: columnCount,
            cards: []
        }); 
    }))
}

export function ConfirmRemoveColumn(
    userValue: userValueDT, 
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {

    if (!isFlagSet(userValue.profileData, "DELETAR_COLUNAS")) {
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

    modalContextProps.setModalTitle("Deletar Coluna");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function RemoveColumn(
    columnIDToRemove: SystemID, 
    userValue: userValueDT, 
    setTempColumn: (prevState: Column) => void,
    setKanban: (prevState: Kanban) => void,
    kanban: Kanban,
) {
    const columns = kanban.columns;
    if(columns){
        const filteredColumns = columns.filter(column=>column.id!=columnIDToRemove);
        kanban.columns = filteredColumns;
        console.log(filteredColumns)
        setKanban(kanban);
    }
    delete_column(undefined,columnIDToRemove,userValue.token,(response)=>{
        if(response.ok){
            console.log("DELETE COLUMN SUCCESS")
            setTempColumn({
                id: 0,
                title: "",
                index: 0,
                cards: []
            });
        }
    });
}

export function UpdateColumnTitle(
    columnID: SystemID, 
    userValue: userValueDT, 
    setTempColumn: (prevState: Column) => void,
    title: string,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userValue.profileData, "EDITAR_COLUNAS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return
    }    
    patch_column({title:title},columnID,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("UPDATE COLUMN SUCCESS")
            setTempColumn({
                id: 0,
                title: title,
                index: 0,
                cards: []
            });
        }
    }))
};

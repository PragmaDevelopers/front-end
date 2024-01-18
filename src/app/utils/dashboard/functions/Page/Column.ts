import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Column, Kanban, SystemID, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_column, patch_column, post_column } from "@/app/utils/fetchs";
import { API_BASE_URL } from "@/app/utils/variables";
import { RefObject, useRef } from "react";

export async function CreateNewColumn(
    userValue: userValueDT,
    setTempKanban: (newValue:Kanban) => void,
    tempKanban: Kanban,
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

    const columnCount = tempKanban.columns != undefined ? tempKanban.columns.length : 0;
    const provColumnId = "prov"+columnCount;

    const newColumnWithoutId = [...tempKanban.columns,{
        id: provColumnId,
        title: `Column ${columnCount}`,
        index: columnCount,
        cards: []
    }];

    setTempKanban({...tempKanban,columns:newColumnWithoutId});

    post_column({
        kanbanId: tempKanban.id,
        title: `Column ${columnCount}`
    },userValue.token,(response)=>response.json().then((columnId)=>{
        if(response.ok){
            console.log("CREATE COLUMN SUCCESS");
            const newColumnWithId = newColumnWithoutId.map((column)=>{
                if(column.id == provColumnId){
                    column.id = columnId;
                    return column;
                }else{
                    return column;
                }
            });
            setTempKanban({...tempKanban,columns:newColumnWithId});
        }
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
    columnID: SystemID, 
    userValue: userValueDT, 
    setTempColumn: (prevState: Column) => void,
    setTempKanban: (prevState: Kanban) => void,
    tempKanban: Kanban,
) {
    const columns = tempKanban.columns;
    if(columns){
        const filteredColumns = columns.filter(column=>column.id!=columnID);
        tempKanban.columns = filteredColumns;
        setTempKanban(tempKanban);
    }
    delete_column(undefined,columnID,userValue.token,(response)=>{
        if(response.ok){
            console.log("DELETE COLUMN SUCCESS");
        }
    });
}

export function UpdateColumnTitle(
    columnID: SystemID, 
    userValue: userValueDT, 
    setTempKanban: (prevState: Kanban) => void,
    tempKanban: Kanban,
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
    const columns = tempKanban.columns;
    const columnIndex = columns.findIndex(column=>column.id!=columnID);
    if(columnIndex != -1){
        columns[columnIndex].title = title;
        tempKanban.columns = columns;
        setTempKanban(tempKanban);
    }
    patch_column({title:title},columnID,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("UPDATE COLUMN SUCCESS")
        }
    }))
};

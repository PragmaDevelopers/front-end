import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { Column, Kanban, SystemID, userData, userValueDT } from "@/app/types/KanbanTypes";
import { delete_column, patch_column, post_column } from "@/app/utils/fetchs";
import { API_BASE_URL } from "@/app/utils/variables";
import { RefObject } from "react";

export async function CreateNewColumn(
    userValue: userValueDT,
    setModalTitle: (value: string) => void,
    setModalDescription: (value: string) => void,
    setModalText: (value: string) => void,
    setModalBorderColor: (value: string) => void,
    setModalFocusRef: (value: any) => void,
    setModalOptions: (value: any) => void,
    setModalOpen: (value: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    isFlagSet: (value: userData, flag: string) => boolean,
    setTempColumn: (prevState: Column) => void,
    kanban: Kanban
) {
    if (!isFlagSet(userValue.profileData, "CRIAR_COLUNAS")) {
        const optAttrs: CustomModalButtonAttributes[] = [
            {
                text: "Entendido.",
                onclickfunc: () => setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ];
        const modalOpt: any = optAttrs.map(
            (el: CustomModalButtonAttributes, idx: number) => `<button className=${el?.className} type=${el.type} key=${idx} onClick=${el.onclickfunc} ref=${el?.ref}>${el.text}</button>`
        );

        setModalTitle("Ação Negada.");
        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        setModalText("Fale com seu administrador se isto é um engano.");
        setModalBorderColor("border-red-500");
        setModalFocusRef(noButtonRef);
        setModalOptions(modalOpt);
        setModalOpen(true);
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

export function RemoveColumn(
    columnIDToRemove: SystemID, 
    userValue: userValueDT, 
    setTempColumn: (prevState: Column) => void,
    setKanban: (prevState: Kanban) => void,
    kanban: Kanban
) {
    const columns = kanban.columns;
    if(columns){
        const filteredColumns = columns.filter(column=>column.id!=columnIDToRemove);
        kanban.columns = filteredColumns;
        setKanban(kanban);
    }
    delete_column(undefined,columnIDToRemove,userValue.token,(response)=>{
        if(response.ok){
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
    title: string, 
    userValue: userValueDT, 
    setTempColumn: (prevState: Column) => void
) {
    patch_column({title:title},columnID,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            setTempColumn({
                id: 0,
                title: title,
                index: 0
            });
        }
    }))
};

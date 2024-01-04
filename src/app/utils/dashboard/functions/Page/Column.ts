import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { Column, KanbanData, SystemID, userData, userValueDT } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { RefObject } from "react";

export function CreateNewColumn(
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
    setKanbanData: (arg0: (prevData: KanbanData) => any | KanbanData) => void,
    kanbanData: KanbanData,
    params: { id: SystemID; },
    ) {
    for (const key in userValue) {
      if (key === "userData") {
        for (const item in userValue.userData) {
          console.log("[INFO]\t@ Create New Column Function", item, (userValue as any).userData[item]);
        } 
      } else {
        console.log("[INFO]\t@ Create New Column Function", key, (userValue as any)[key]);
      }
    
  }

    console.log("[INFO]\t@ Create New Column Function USER PERMISSONS", "permissionLevel", userValue.userData.permissionLevel);

    if (!isFlagSet(userValue.userData, "CRIAR_COLUNAS")) {
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
            (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
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

    if (kanbanData.columns !== undefined) {
        let newColumn = {
            id: "",                                         /////////////////////////////////////////////////////////////////////////////
            type: 0,
            title: `Column ${kanbanData.columns.length}`,
            cardsList: [],
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
            body: JSON.stringify({
                title: newColumn.title,
                kanbanId: params.id,
            }),
        };

        fetch(`${API_BASE_URL}/api/private/user/kanban/column`, requestOptions).then(response => response.text()).then(data => newColumn.id = data)

        setKanbanData((prevData: KanbanData) => ({
            ...prevData,
            columns: [...prevData.columns, newColumn],
        }));
    } else {
        let newColumn = {
            id: "",                                         /////////////////////////////////////////////////////////////////////////////
            type: 0,
            title: 'Column 0',
            cardsList: [],
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
            body: JSON.stringify({
                title: newColumn.title,
                kanbanId: params.id,
            }),
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban/column`, requestOptions).then(response => response.text()).then(data => newColumn.id = data)


        setKanbanData((prevData: KanbanData) => ({
            ...prevData,
            columns: [newColumn],
        }));
    }
}

export function RemoveColumn(
    columnIDToRemove: SystemID, 
    userValue: userValueDT, 
    setKanbanData: (arg0: (prevData: KanbanData) => any | KanbanData) => void, 
    kanbanData: KanbanData
    ) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
    };
    fetch(`${API_BASE_URL}/api/private/user/kanban/column/${columnIDToRemove}`, requestOptions).then(response => response.text()).then(data => console.log(data))
    const updatedColumns = kanbanData.columns.filter(
        (column: Column) => column.id !== columnIDToRemove
    );

    // Update the Kanban data state with the updated columns array
    setKanbanData((prevData: KanbanData) => ({
        ...prevData,
        columns: updatedColumns,
    }));
}


export function UpdateColumnTitle(
    columnID: SystemID, 
    title: string, 
    userValue: userValueDT, 
    setKanbanData: (arg0: (prevKanbanData: KanbanData) => any | KanbanData) => void
    ) {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
        body: JSON.stringify({
            title: title,
        }),
    };

    fetch(`${API_BASE_URL}/api/private/user/kanban/column/${columnID}`, requestOptions).then(response => response.text()).then(data => console.log(data))

    setKanbanData((prevKanbanData: KanbanData) => {
        const newColumns: Column[] = prevKanbanData.columns.map((col: Column) => {
            if (col.id !== columnID) return col;
            return { ...col, title: title };
        })
        return {
            ...prevKanbanData,
            columns: newColumns,
        }
    })
};

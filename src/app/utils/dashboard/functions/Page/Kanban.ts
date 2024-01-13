import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Kanban, User, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_uninvite_kanban, patch_kanban, post_invite_kanban } from "@/app/utils/fetchs";
import { RefObject } from "react";

export async function RenameTitleKanban (
    userValue: userValueDT,
    title: string,
    setTempKanban: (newValue:Kanban) => void,
    tempKanban: Kanban,
    falseModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userValue.profileData, "EDITAR_DASHBOARDS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(falseModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }

    const newTempKanban = tempKanban;
    newTempKanban.title = title;
    setTempKanban(newTempKanban);

    patch_kanban({title:title},tempKanban.id,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("PATCH KANBAN SUCCESS");
        }
    }));
}

export async function InviteToKanban(
    userValue: userValueDT,
    inviteUser: User | undefined,
    setTempKanban: (newValue:Kanban) => void,
    tempKanban: Kanban,
    falseModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(inviteUser != undefined){
        if (!isFlagSet(userValue.profileData, "CONVIDAR_PARA_O_KANBAN")) {
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(falseModalOptions);
            modalContextProps.setModalOpen(true);
            return;
        }

        setTempKanban({...tempKanban,members:[...tempKanban.members,inviteUser]});

        post_invite_kanban({
            kanbanId: tempKanban.id,
            userId: inviteUser.id
        },userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("INVITE TO KANBAN SUCCESS");
            }
        }))
    }
}

export async function UninviteFromKanban(
    userValue: userValueDT,
    uninviteUser: User | undefined,
    setTempKanban: (newValue:Kanban) => void,
    tempKanban: Kanban,
    falseModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(uninviteUser != undefined){
        if (!isFlagSet(userValue.profileData, "RETIRAR_DO_KANBAN")) {
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(falseModalOptions);
            modalContextProps.setModalOpen(true);
            return;
        }

        const memberIndex = tempKanban.members.findIndex(member=>member.id==uninviteUser.id)
        if(memberIndex != -1){
            const newKanban = tempKanban;
            newKanban.members.splice(memberIndex,1);
            setTempKanban(newKanban);
            delete_uninvite_kanban(undefined,tempKanban.id,uninviteUser.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("UNINVITE FROM KANBAN SUCCESS");
                }
            }))
        }
    }
}
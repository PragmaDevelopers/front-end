import { SystemID, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "../../checkers";
import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { RefObject } from "react";
import { post_client_template } from "../../fetchs";

export function CreateClientTemplate(
    isValue: boolean,
    userValue: userValueDT,
    bodyTemplate: {name:string,template:object},
    templateList: any,
    setTemplateList: any,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_TEMPLATES_CLIENTE")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    post_client_template(bodyTemplate,isValue,userValue.token,(response)=>response.json().then((id:SystemID)=>{
        console.log("CREATE CLIENT TEMPLATE SUCCESS");
        setTemplateList([
            ...templateList,
            {
                id,
                ...bodyTemplate
            }
        ]);
        alert("Rascunho salvo!");
    }));
}

export function ConfirmDeleteClientTemplate(
    userValue: userValueDT, 
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userValue.profileData, "DELETAR_TEMPLATES_CLIENTE")) {
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
    modalContextProps.setModalTitle("Deletar Template do Cliente");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}
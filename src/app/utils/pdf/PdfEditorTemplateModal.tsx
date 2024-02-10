import { SystemID, userValueDT } from "@/app/types/KanbanTypes";
import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { RefObject } from "react";
import { post_client_template, post_pdf_template } from "../fetchs";
import { isFlagSet } from "../checkers";

export function CreatePDFTemplate(
    userValue: userValueDT,
    bodyTemplate: {name:string,template:object},
    templateList: any,
    setTemplateList: any,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_TEMPLATES_PDF")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    post_pdf_template(bodyTemplate,userValue.token,(response)=>response.json().then((id:SystemID)=>{
        console.log("CREATE PDF TEMPLATE SUCCESS");
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

export function ConfirmDeletePDFTemplate(
    userValue: userValueDT, 
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userValue.profileData, "DELETAR_TEMPLATES_PDF")) {
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
    modalContextProps.setModalTitle("Deletar Template do PDF");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}
import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { Card, SystemID, userData } from "@/app/types/KanbanTypes";
import { RefObject } from "react";
// import { isFlagSet } from "@/app/utils/checkers";

export function DeleteColumn(
    setModalTitle: (value: string) => void,
    setModalDescription: (value: string) => void,
    setModalText: (value: string) => void,
    setModalBorderColor: (value: string) => void,
    setModalFocusRef: (value: any) => void,
    setModalOptions: (value: any) => void,
    setModalOpen: (value: boolean) => void,

    noButtonRef: RefObject<HTMLButtonElement>,
    modalOptsElements: HTMLButtonElement[],

    isFlagSet: (value: userData, flag: string) => boolean,
    userData: userData,

): void {
    if (isFlagSet(userData, "DELETAR_COLUNAS")) {
        setModalTitle("Deletar Coluna");
        setModalDescription("Esta ação é irreversivel.");
        setModalText("Tem certeza que deseja continuar?");
        setModalBorderColor("border-red-500");
        setModalFocusRef(noButtonRef);
        setModalOptions(modalOptsElements);
        setModalOpen(true);
    } else {
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
            (el: CustomModalButtonAttributes, idx: number) => `<button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>`

        );

        setModalTitle("Ação Negada.");
        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        setModalText("Fale com seu administrador se isto é um engano.");
        setModalBorderColor("border-red-500");
        setModalFocusRef(noButtonRef);
        setModalOptions(modalOpt);
        setModalOpen(true);
    }
};


export function EditMode(
    setModalTitle: (value: string) => void,
    setModalDescription: (value: string) => void,
    setModalText: (value: string) => void,
    setModalBorderColor: (value: string) => void,
    setModalFocusRef: (value: any) => void,
    setModalOptions: (value: any) => void,
    setModalOpen: (value: boolean) => void,

    noButtonRef: RefObject<HTMLButtonElement>,

    isFlagSet: (value: userData, flag: string) => boolean,
    userData: userData,

    setEditMode: (state: boolean) => void,
): void {
    if (isFlagSet(userData, "EDITAR_COLUNAS")) {
        setEditMode(true);
    } else {
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
    }
}
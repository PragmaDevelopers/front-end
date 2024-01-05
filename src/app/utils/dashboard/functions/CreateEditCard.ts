import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { ChangeEvent, RefObject } from "react";
import { isFlagSet } from "../../checkers";
import { Card, userData } from "@/app/types/KanbanTypes";

export function ShowTag(
    userData: userData, 
    setViewAddTag: (arg0: boolean) => void,
    viewAddTag: any,
    setModalOpen: (arg0: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    setModalTitle: (arg0: string) => void,
    setModalDescription: (arg0: string) => void,
    setModalText: (arg0: string) => void,
    setModalBorderColor: (arg0: string) => void,
    setModalFocusRef: (arg0: any) => void,
    setModalOptions: (arg0: any) => void,
): void {
    if (isFlagSet(userData, "CRIAR_TAG")) {
        setViewAddTag(!viewAddTag)
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
        return;
    }
};


export function ShowDate(
    userData: userData, 
    setModalOpen: (arg0: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    setModalTitle: (arg0: string) => void,
    setModalDescription: (arg0: string) => void,
    setModalText: (arg0: string) => void,
    setModalBorderColor: (arg0: string) => void,
    setModalFocusRef: (arg0: any) => void,
    setModalOptions: (arg0: any) => void,
    setViewAddDate: (arg0: boolean) => void,
    viewAddDate: boolean,
) {
    if (isFlagSet(userData, "CRIAR_PRAZOS")) {
        setViewAddDate(!viewAddDate)
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
        return;
    }
};

export function ShowField(
    userData: userData, 
    setModalOpen: (arg0: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    setModalTitle: (arg0: string) => void,
    setModalDescription: (arg0: string) => void,
    setModalText: (arg0: string) => void,
    setModalBorderColor: (arg0: string) => void,
    setModalFocusRef: (arg0: any) => void,
    setModalOptions: (arg0: any) => void,
    setViewAddField: (arg0: boolean) => void,
    viewAddField: boolean,
) {
    if (isFlagSet(userData, "CRIAR_CAMPO")) {
        setViewAddField(!viewAddField)
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
        return;
    }
};

export function ShowMember(
    userData: userData, 
    setModalOpen: (arg0: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    setModalTitle: (arg0: string) => void,
    setModalDescription: (arg0: string) => void,
    setModalText: (arg0: string) => void,
    setModalBorderColor: (arg0: string) => void,
    setModalFocusRef: (arg0: any) => void,
    setModalOptions: (arg0: any) => void,

    setViewAddMember: (arg0: boolean) => void,
    viewAddMember: boolean,
) {
    if (isFlagSet(userData, "CONVIDAR_PARA_O_KANBAN")) {
        setViewAddMember(!viewAddMember)
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
        return;
    }
};

export function ShowMoveCard(
    userData: userData, 
    setModalOpen: (arg0: boolean) => void,
    noButtonRef: RefObject<HTMLButtonElement>,
    setModalTitle: (arg0: string) => void,
    setModalDescription: (arg0: string) => void,
    setModalText: (arg0: string) => void,
    setModalBorderColor: (arg0: string) => void,
    setModalFocusRef: (arg0: any) => void,
    setModalOptions: (arg0: any) => void,

    setViewMoveCard: (arg0: boolean) => void,
    viewMoveCard: boolean,
    ) {
    if (isFlagSet(userData, "MOVER_CARDS")) {
        setViewMoveCard(!viewMoveCard)
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
        return;
    }
};

export function CustomFieldChange(event: ChangeEvent<HTMLInputElement>, setCustomFieldsData: (arg0: (prevData: any) => any) => void) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value);
    setCustomFieldsData((prevData: any) => {
        return {
            ...prevData,
            [name]: value,
        };
    });
}

export function createNewTag(event: any, setViewAddTag: (arg0: boolean) => void, addNewTag: (arg0: string, arg1: string) => void, setColor: (arg0: string) => void, color: string) {
    event.preventDefault();
    const tagTitle: string = event?.target?.title?.value;
    addNewTag(tagTitle, color);
    event.target.reset();
    setViewAddTag(false);
    setColor("#aabbcc");
}

export function createNewCustomField(event: any, setViewAddField: (arg0: boolean) => void, addCustomField: (arg0: any, arg1: string | number, arg2: string) => void) {
    event.preventDefault();
    setViewAddField(false);
    // (name: string, value: string | number, fieldType: "text" | "number")
    // const selectedValue = event?.target?.elements?.fieldType.value;
    const selectedValue = event?.target?.elements?.fieldType?.value;
    const fieldName = event?.target?.elements?.fieldTitle?.value;
    console.log("FUNCTION", "SELECTED VALUE:", selectedValue, "FIELD NAME:", fieldName);
    if (selectedValue === "text") {
        addCustomField(fieldName, "", "text");
    } else {
        addCustomField(fieldName, 0, "number");
    }
    event.target.reset();
}

export function closeCalendar(e: any, setViewAddDate: (arg0: boolean) => void) {
    e.preventDefault();
    setViewAddDate(false);
    e.target.reset();
}

export function closeMoveCard(e: any, setViewMoveCard: (arg0: boolean) => void) {
    e.preventDefault();
    setViewMoveCard(false);
    e.target.reset();
}

export function closeAddMember(e: any, setViewAddMember: (arg0: boolean) => void) {
    e.preventDefault();
    setViewAddMember(false);
    e.target.reset();
}

export function BootstrapCreateInnerCard(
userData: userData, 
setModalOpen: (arg0: boolean) => void,
noButtonRef: RefObject<HTMLButtonElement>,
setModalTitle: (arg0: string) => void,
setModalDescription: (arg0: string) => void,
setModalText: (arg0: string) => void,
setModalBorderColor: (arg0: string) => void,
setModalFocusRef: (arg0: any) => void,
setModalOptions: (arg0: any) => void,

setIsCreatingInnerCard: (arg0: boolean) => void,
tempCardsArr: Card[],

) {
    if (isFlagSet(userData, "CRIAR_CARDS")) {
        console.log(`BUTTON PUSH CREATE INNER CARD ${tempCardsArr}`, tempCardsArr);
        setIsCreatingInnerCard(true);
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
        return;
    }
}

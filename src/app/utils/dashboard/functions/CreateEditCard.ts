export function handleShowTag() {
    if (isFlagSet(userValue.userData, "CRIAR_TAG")) {
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
            (el: CustomModalButtonAttributes, idx: number) => <button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>);

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


export function handleShowDate() {
    if (isFlagSet(userValue.userData, "CRIAR_PRAZOS")) {
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
            (el: CustomModalButtonAttributes, idx: number) => <button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>);

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

export function handleShowField() {
    if (isFlagSet(userValue.userData, "CRIAR_CAMPO")) {
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
            (el: CustomModalButtonAttributes, idx: number) => <button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>);

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

export function handleShowMember() {
    if (isFlagSet(userValue.userData, "CONVIDAR_PARA_O_KANBAN")) {
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
            (el: CustomModalButtonAttributes, idx: number) => <button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>);

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

export function handleShowMoveCard() {
    if (isFlagSet(userValue.userData, "MOVER_CARDS")) {
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
            (el: CustomModalButtonAttributes, idx: number) => <button className={ el?.className } type = { el.type } key = { idx } onClick = { el.onclickfunc } ref = { el?.ref } > { el.text } < /button>);

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

    export function handleCustomFieldChange(event: ChangeEvent<HTMLInputElement>) {
        const name = event.target.name;
        const value = event.target.value;
        console.log(name, value);
        setCustomFieldsData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    }

    export function createNewTag(event: any) {
        event.preventDefault();
        const tagTitle: string = event?.target?.title?.value;
        addNewTag(tagTitle, color);
        event.target.reset();
        setViewAddTag(false);
        setColor("#aabbcc");
    }

    export function createNewCustomField(event: any) {
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

    export function closeCalendar(e: any) {
        e.preventDefault();
        setViewAddDate(false);
        e.target.reset();
    }

    export function closeMoveCard(e: any) {
        e.preventDefault();
        setViewMoveCard(false);
        e.target.reset();
    }

    export function closeAddMember(e: any) {
        e.preventDefault();
        setViewAddMember(false);
        e.target.reset();
    }

    export function handleCreateInnerCard() {
        if (isFlagSet(userValue.userData, "CRIAR_CARDS")) {
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
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

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


import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { userValueDT, userData, Kanban, Column, Card, SystemID } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { RefObject } from "react";

export function OnDragStart(
    event: DragStartEvent,
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
    setActiveCard: (arg0:  Card | null | any) => void,
    setActiveColumn: (arg0:  Column | null | any) => void,
    setTempDragState: (arg0: DragStartEvent) => void,
    ) {
    //console.log("DRAG START", event);
    if (!(isFlagSet(userValue.profileData, "MOVER_COLUNAS") && isFlagSet(userValue.profileData, "MOVER_CARDS"))) {
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
    } else {

        setTempDragState(event);

        if (event.active.data.current !== undefined) {
            if (event.active.data.current.type === "COLUMN") {
                if (isFlagSet(userValue.profileData, "MOVER_COLUNAS")) {
                    setActiveColumn(event.active.data.current.column);
                    return;
                }
                else {
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
        }

        if (event.active.data.current !== undefined) {
            if (event.active.data.current.type === "CARD") {
                if (isFlagSet(userValue.profileData, "MOVER_CARDS")) {
                    setActiveCard(event.active.data.current.card);
                    return;
                }
                else {
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
        }

        // if (event.active.data.current !== undefined) {
        //     if (event.active.data.current.type === "COLUMN") {
        //         setActiveColumn(event.active.data.current.column);
        //         return;
        //     }
        // }

        // if (event.active.data.current !== undefined) {
        //     if (event.active.data.current.type === "CARD") {
        //         setActiveCard(event.active.data.current.card);
        //         return;
        //     }
        // }
    }
}

export function OnDragEnd(
    event: DragEndEvent,
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
    setKanban: (arg0: (prevKanban: Kanban) => Kanban | Kanban | undefined) => void,
    setActiveColumn: (arg0: Column | null | any) => void,
    setActiveCard: (arg0: Card | null | any) => void,
    tempDragState: DragEndEvent | DragStartEvent | DragOverEvent,
    ) {
    if (!(isFlagSet(userValue.profileData, "MOVER_COLUNAS") && isFlagSet(userValue.profileData, "MOVER_CARDS"))) {
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
    } else {

        setActiveColumn(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) return;

        const activeColumnID = active.id;
        const overColumnID = over.id;
        if (activeColumnID === overColumnID) return;

        //console.log("ON DRAG END EVENT", event);
        if (active.data.current?.type === "COLUMN") {
            if (isFlagSet(userValue.profileData, "MOVER_COLUNAS")) {
                //console.log("ACTIVE COLUMN");
                setKanban((prevKanban: Kanban) => {
                    const activeColumnIndex = prevKanban.columns.findIndex((col: Column) => col?.id === activeColumnID);
                    const overColumnIndex = prevKanban.columns.findIndex((col: Column) => col?.id === overColumnID);
                    const newColumnsArray: Column[] = arrayMove(prevKanban.columns, activeColumnIndex, overColumnIndex);

                    const requestOptions = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
                        body: JSON.stringify({
                            "columnId": prevKanban.columns[activeColumnIndex].id,
                            "toIndex": overColumnIndex,
                        }),
                    };
                    fetch(`${API_BASE_URL}/api/private/user/kanban/move/column`, requestOptions).then(response => response.text()).then(data => console.log(data))


                    return {
                        ...prevKanban,
                        columns: newColumnsArray,
                    };
                });
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
        } else {
            //console.log("ACTIVE CARD", active.data.current?.type);

            if (isFlagSet(userValue.profileData, "MOVER_COLUNAS")) {
                if (over.data.current?.type === "COLUMN") {
                    //console.log("OVER COLUMN");
                    setKanban((prevKanban: Kanban) => {
                        // Drop on other column
                        const cardEl: Card = active.data.current?.card;
                        const destCol: Column = over.data.current?.column;
                        const srcCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === active.data.current?.card.columnID);
                        if (!srcCol) return;

                        const updatedCardsList = srcCol.cards.filter((card) => card.id !== cardEl.id);

                        const updatedColumn = {
                            ...srcCol,
                            cards: updatedCardsList,
                        };

                        const newCard: Card = {
                            ...cardEl,
                            columnID: destCol.id,
                        }

                        const resultDestCol: Column = {
                            ...destCol,
                            cards: [...destCol.cards, newCard],
                        }

                        const updatedSrcColumns: Column[] = prevKanban.columns.map((column: Column) =>
                            column?.id === updatedColumn.id ? updatedColumn : column
                        );

                        const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);



                        return {
                            ...prevKanban,
                            columns: updatedColumns,
                        };

                        // drop on card in other column

                    })
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

            } else if (over.data.current?.type === "CARD") {
                //console.log("OVER CARD");
                if (isFlagSet(userValue.profileData, "MOVER_CARDS")) {

                    if (Object.keys(active.data.current as any).length !== 0) {
                        //console.log("CURRENT NOT EMPTY", event);
                        setKanban((prevKanban: Kanban) => {
                            const cardEl: Card = active.data.current?.card;
                            const destCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                            const srcCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === active.data.current?.card.columnID);
                            if (!srcCol) return;
                            if (destCol === undefined) return;

                            //console.log(destCol, srcCol);
                            const updatedCardsList = srcCol.cards.filter((card) => card.id !== cardEl.id);

                            const updatedColumn = {
                                ...srcCol,
                                cards: updatedCardsList,
                            };

                            const newCard: Card = {
                                ...cardEl,
                                columnID: destCol.id,
                            }
                            const resultDestCol: Column = {
                                ...destCol,
                                cards: [...destCol.cards, newCard],
                            }

                            const updatedSrcColumns: Column[] = prevKanban.columns.map((column: Column) =>
                                column?.id === updatedColumn.id ? updatedColumn : column
                            );

                            const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);

                            return {
                                ...prevKanban,
                                columns: updatedColumns,
                            };

                        });

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

                } else {
                    //console.log("CURRENT EMPTY");
                    if (isFlagSet(userValue.profileData, "MOVER_CARDS")) {
                        setKanban((prevKanban: Kanban) => {
                            const tempEndDragState: DragEndEvent = tempDragState as DragEndEvent;
                            const cardEl: Card = tempEndDragState.active.data.current?.card;
                            const destCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                            const srcCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === tempEndDragState.active.data.current?.card.columnID);
                            if (!srcCol) return;
                            if (destCol === undefined) return;

                            const updatedCardsList = srcCol.cards.filter((card) => card.id !== cardEl.id);

                            const updatedColumn = {
                                ...srcCol,
                                cards: updatedCardsList,
                            };

                            const newCard: Card = {
                                ...cardEl,
                                columnID: destCol.id,
                            }
                            const resultDestCol: Column = {
                                ...destCol,
                                cards: [...destCol.cards, newCard],
                            }

                            const updatedSrcColumns: Column[] = prevKanban.columns.map((column: Column) =>
                                column?.id === updatedColumn.id ? updatedColumn : column
                            );

                            const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);

                            return {
                                ...prevKanban,
                                columns: updatedColumns,
                            };

                        });
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
            }
        }

        //console.log("DRAG END", event);
    }
}

export function OnDragOver(
    event: DragOverEvent,
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
    setKanban: (arg0: (prevKanban: Kanban) => Kanban | Kanban | undefined) => void,
    ) {
    if (!(isFlagSet(userValue.profileData, "MOVER_COLUNAS") && isFlagSet(userValue.profileData, "MOVER_CARDS"))) {
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
    } else {
        const { active, over } = event;
        if (!over) return;

        const activeID = active.id;
        const overID = over.id;
        if (activeID === overID) return;

        //console.log("DRAG OVER", event);

        const isActiveCard = active.data.current?.type === "CARD";
        const isOverCard = over.data.current?.type === "CARD";

        if (isActiveCard && isOverCard) {
            setKanban((prevKanban: Kanban) => {
                if (active.data.current?.card.columnID === over.data.current?.card.columnID) {
                    if (isFlagSet(userValue.profileData, "MOVER_CARDS")) {

                        const targetColumn = prevKanban.columns.find((column) => column?.id === active.data.current?.card.columnID);
                        if (!targetColumn) return prevKanban;

                        const activeCardIndex = targetColumn.cards.findIndex((card: Card) => card?.id === activeID);
                        const overCardIndex = targetColumn.cards.findIndex((card: Card) => card?.id === overID);

                        const newCardArray: Card[] = arrayMove(targetColumn.cards, activeCardIndex, overCardIndex);

                        const updatedColumn = {
                            ...targetColumn,
                            cards: newCardArray,
                        };

                        const updatedColumns = prevKanban.columns.map((column: Column) =>
                            column?.id === active.data.current?.card.columnID ? updatedColumn : column
                        );

                        return {
                            ...prevKanban,
                            columns: updatedColumns,
                        };
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
                } else {
                    if (isFlagSet(userValue.profileData, "MOVER_COLUNAS")) {

                        const sourceColumn = prevKanban.columns.find((column) => column?.id === active.data.current?.card.columnID);
                        if (!sourceColumn) return prevKanban;
                        const destColumn = prevKanban.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                        if (!destColumn) return prevKanban;

                        //const srcCardIndex = sourceColumn.cardsList.findIndex((card: Card) => card?.id === activeID);
                        //const destCardIndex = destColumn.cardsList.findIndex((card: Card) => card?.id === overID);

                        const updatedSourceCardsList = sourceColumn.cards.filter((card) => card.id !== activeID);

                        const updatedSourceColumn = {
                            ...sourceColumn,
                            cards: updatedSourceCardsList,
                        };

                        const updatedColumns = prevKanban.columns.map((column: Column) =>
                            column?.id === active.data.current?.card.columnID ? updatedSourceColumn : column
                        );

                        return {
                            ...prevKanban,
                            columns: updatedColumns,
                        };
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
            });
        }
    }
}
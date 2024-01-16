import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { userValueDT, User, Kanban, Column, Card, SystemID } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { move_card, move_column } from "@/app/utils/fetchs";
import { API_BASE_URL } from "@/app/utils/variables";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { RefObject } from "react";

export function OnDragStart(
    event: DragStartEvent,
    userValue: userValueDT,
    modalContextProps: ModalContextProps,
    noButtonRef: RefObject<HTMLButtonElement>,
    setActiveCard: (arg0:  Card | null | any) => void,
    setActiveColumn: (arg0:  Column | null | any) => void,
    setTempDragState: (arg0: DragStartEvent) => void,
    ) {
    //console.log("DRAG START", event);
    if (!(isFlagSet(userValue.profileData, "MOVER_COLUNAS") && isFlagSet(userValue.profileData, "MOVER_CARDS"))) {
        const optAttrs: CustomModalButtonAttributes[] = [
            {
                text: "Entendido.",
                onclickfunc: () => modalContextProps.setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ];

        const modalOpt: any = optAttrs.map(
            (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
            );

        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(modalOpt);
        modalContextProps.setModalOpen(true);
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
                            onclickfunc: () => modalContextProps.setModalOpen(false),
                            ref: noButtonRef,
                            type: "button",
                            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                        }
                    ];

                    const modalOpt: any = optAttrs.map(
                        (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                        );

                    modalContextProps.setModalTitle("Ação Negada.");
                    modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                    modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                    modalContextProps.setModalBorderColor("border-red-500");
                    modalContextProps.setModalFocusRef(noButtonRef);
                    modalContextProps.setModalOptions(modalOpt);
                    modalContextProps.setModalOpen(true);
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
                            onclickfunc: () => modalContextProps.setModalOpen(false),
                            ref: noButtonRef,
                            type: "button",
                            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                        }
                    ];

                    const modalOpt: any = optAttrs.map(
                        (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                        );

                    modalContextProps.setModalTitle("Ação Negada.");
                    modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                    modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                    modalContextProps.setModalBorderColor("border-red-500");
                    modalContextProps.setModalFocusRef(noButtonRef);
                    modalContextProps.setModalOptions(modalOpt);
                    modalContextProps.setModalOpen(true);
                    return;
                }
            }
        }

        if (event.active.data.current !== undefined) {
            if (event.active.data.current.type === "COLUMN") {
                setActiveColumn(event.active.data.current.column);
                return;
            }
        }

        if (event.active.data.current !== undefined) {
            if (event.active.data.current.type === "CARD") {
                setActiveCard(event.active.data.current.card);
                return;
            }
        }
    }
}

export function OnDragEnd(
    event: DragEndEvent,
    userValue: userValueDT,
    modalContextProps: ModalContextProps,
    noButtonRef: RefObject<HTMLButtonElement>,
    setKanban: any,
    setActiveColumn: (arg0: Column | null | any) => void,
    setActiveCard: (arg0: Card | null | any) => void,
    tempDragState: any,
    ) {
   
        setActiveColumn(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) return;

        const activeColumnID = active.id;
        const overColumnID = over.id;
        if (activeColumnID == overColumnID) return;

        //console.log("ON DRAG END EVENT", event);
        if (active.data.current?.type === "COLUMN") {
            if (isFlagSet(userValue.profileData, "MOVER_COLUNAS")) {
                //console.log("ACTIVE COLUMN");
                setKanban((prevKanban: Kanban) => {
                    const activeColumnIndex = prevKanban.columns.findIndex((col: Column) => col?.id === activeColumnID);
                    const overColumnIndex = prevKanban.columns.findIndex((col: Column) => col?.id === overColumnID);
                    const newColumnsArray: Column[] = arrayMove(prevKanban.columns, activeColumnIndex, overColumnIndex);

                    move_column({
                        columnId: prevKanban.columns[activeColumnIndex].id,
                        toIndex: overColumnIndex,
                    },userValue.token,(response)=>response.text().then(()=>{
                        if(response.ok){
                            console.log("MOVE COLUMN SUCCESS");
                        }
                    }))

                    return {
                        ...prevKanban,
                        columns: newColumnsArray.map((column,index)=>{
                            column.index = index;
                            return column;
                        })
                    };
                });
            } else {
                const optAttrs: CustomModalButtonAttributes[] = [
                    {
                        text: "Entendido.",
                        onclickfunc: () => modalContextProps.setModalOpen(false),
                        ref: noButtonRef,
                        type: "button",
                        className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                    }
                ];

                const modalOpt: any = optAttrs.map(
                    (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                    );

                modalContextProps.setModalTitle("Ação Negada.");
                modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                modalContextProps.setModalBorderColor("border-red-500");
                modalContextProps.setModalFocusRef(noButtonRef);
                modalContextProps.setModalOptions(modalOpt);
                modalContextProps.setModalOpen(true);
                return;

            }
        } else {
            //console.log("ACTIVE CARD", active.data.current?.type);

            if (isFlagSet(userValue.profileData, "MOVER_CARDS")) {
                const cardEl: Card = tempDragState.active?.data.current.card || active.data.current?.card;
                const columnElId: SystemID | undefined = over.data.current?.card?.columnID || over.data.current?.column.id;
                setKanban((prevKanban: Kanban) => {
                    const destCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === columnElId);
                    const srcCol: Column | undefined = prevKanban.columns.find((col: Column) => col?.id === cardEl?.columnID);

                    if (!srcCol || !destCol) return prevKanban;

                    let destIndex = destCol.cards.length;
                    if(over.data.current?.type == "CARD"){
                        destIndex = over.data.current.card.index;
                    }

                    if(srcCol.id == destCol.id){
                        destCol.cards = destCol.cards.filter((card)=>card.id != cardEl?.id);
                        destCol.cards.splice(destIndex,0,cardEl);
                        destCol.cards = destCol.cards.map((card,index)=>{
                            card.index = index;
                            return card;
                        });
                        prevKanban.columns[destCol.index] = srcCol;
                    }else{
                        console.log(cardEl)
                        const newSrcCol = srcCol;
                        newSrcCol.cards = newSrcCol.cards.filter((card) => card.id != cardEl?.id);
                        newSrcCol.cards = newSrcCol.cards.map((card,index)=>{
                            card.index = index;
                            return card;
                        });
                        cardEl.columnID = destCol.id;
                        const newDestCol = destCol;
                        newDestCol.cards.push(cardEl);
                        newDestCol.cards = newDestCol.cards.map((card,index)=>{
                            card.index = index;
                            return card;
                        });
                        prevKanban.columns[srcCol.index] = newSrcCol;
                        prevKanban.columns[destCol.index] = newDestCol;
                    }

                    move_card({cardId:cardEl.id,toColumnId:destCol.id,toIndex:destIndex},userValue.token,(response)=>response.text().then(()=>{
                        if(response.ok){
                            console.log("MOVE CARD SUCCESS");
                        }
                    }));

                    return prevKanban;
                });

            } else {
                const optAttrs: CustomModalButtonAttributes[] = [
                    {
                        text: "Entendido.",
                        onclickfunc: () => modalContextProps.setModalOpen(false),
                        ref: noButtonRef,
                        type: "button",
                        className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                    }
                ];

                const modalOpt: any = optAttrs.map(
                    (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                    );

                modalContextProps.setModalTitle("Ação Negada.");
                modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                modalContextProps.setModalBorderColor("border-red-500");
                modalContextProps.setModalFocusRef(noButtonRef);
                modalContextProps.setModalOptions(modalOpt);
                modalContextProps.setModalOpen(true);
                return;

            }

        }

    //console.log("DRAG END", event);
}

export function OnDragOver(
    event: DragOverEvent,
    userValue: userValueDT,
    modalContextProps: ModalContextProps,
    noButtonRef: RefObject<HTMLButtonElement>,
    setKanban: any,
    setTempDragState: any,
    ) {
    if (!(isFlagSet(userValue.profileData, "MOVER_COLUNAS") && isFlagSet(userValue.profileData, "MOVER_CARDS"))) {
        const optAttrs: CustomModalButtonAttributes[] = [
            {
                text: "Entendido.",
                onclickfunc: () => modalContextProps.setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ];

        const modalOpt: any = optAttrs.map(
            (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
            );

        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(modalOpt);
        modalContextProps.setModalOpen(true);
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

                        // setTempDragState(active.data.current);

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
                                onclickfunc: () => modalContextProps.setModalOpen(false),
                                ref: noButtonRef,
                                type: "button",
                                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                            }
                        ];

                        const modalOpt: any = optAttrs.map(
                            (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                            );

                        modalContextProps.setModalTitle("Ação Negada.");
                        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                        modalContextProps.setModalBorderColor("border-red-500");
                        modalContextProps.setModalFocusRef(noButtonRef);
                        modalContextProps.setModalOptions(modalOpt);
                        modalContextProps.setModalOpen(true);
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
                                onclickfunc: () => modalContextProps.setModalOpen(false),
                                ref: noButtonRef,
                                type: "button",
                                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                            }
                        ];

                        const modalOpt: any = optAttrs.map(
                            (el: CustomModalButtonAttributes, idx: number) => `<button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>`
                            );

                        modalContextProps.setModalTitle("Ação Negada.");
                        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
                        modalContextProps.setModalBorderColor("border-red-500");
                        modalContextProps.setModalFocusRef(noButtonRef);
                        modalContextProps.setModalOptions(modalOpt);
                        modalContextProps.setModalOpen(true);
                        return;
                    }
                }
            });
        }
    }
}
import { useUserContext } from "@/app/contexts/userContext";
import { ColumnContainerProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Column, Kanban, SystemID } from "@/app/types/KanbanTypes";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useMemo, useRef, useEffect } from "react";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { CardElement } from "./Card";
import { CSS } from '@dnd-kit/utilities';
import { isFlagSet } from "@/app/utils/checkers";
import { useModalContext } from "@/app/contexts/modalContext";
import { ConfirmRemoveColumn, RemoveColumn, UpdateColumnTitle } from "@/app/utils/dashboard/functions/Page/Column";
import { delete_column } from "@/app/utils/fetchs";
import { CreateCard } from "@/app/utils/dashboard/functions/Page/Card";
import { useKanbanContext } from "@/app/contexts/kanbanContext";

export function ColumnContainer({column}:{column:Column}) {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(column.title);
    const { userValue } = useUserContext();
    const modalContextProps = useModalContext();
    const { setTempColumn, tempKanban, setTempKanban } = useKanbanContext();
        
    const cardsIds = useMemo(() => {
        const ids:SystemID[] = [];
        if(column.cards && column.cards.length > 0){
            column.cards.forEach(card=>ids.push(card?.id));
        }
        return ids;
    }, [tempKanban]);

    const noButtonRef = useRef<HTMLButtonElement>(null);

    const failOption: CustomModalButtonAttributes[] = [
        {
            text: "Entendido.",
            onclickfunc: () => modalContextProps.setModalOpen(false),
            ref: noButtonRef,
            type: "button",
            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
        }
    ];

    const failModalOption: any = failOption.map(
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
    );

    function handleRemoveColumn(columnId:SystemID){
        
        const delCol = () => {
            RemoveColumn(
                columnId,
                userValue,
                setTempColumn,
                setTempKanban,
                tempKanban
            );
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delCol,
                type: "button",
                className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            },
            {
                text: "Não",
                onclickfunc: () => modalContextProps.setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ]

        const successModalOption: any = successOption.map(
            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
        );

        ConfirmRemoveColumn(
            userValue,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'COLUMN',
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className='h-full min-w-64 bg-neutral-300 rounded-md border-2 border-neutral-950 content-[" "]'>
            </div>
        );
    }

    const handleEditMode = () => {
        UpdateColumnTitle(
            column.id,
            userValue,
            setTempKanban,
            tempKanban,
            title,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    function handleCreateCard(){
        CreateCard(
            userValue,
            setTempKanban,
            column,
            tempKanban
        );
    }

    return (
        <div className={`${column.id == "" || column.id.toString().includes("|") ? "loading-element" : ""} relative min-w-64 w-64 h-full p-1`}
            ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <div className='w-full bg-neutral-50 rounded-md drop-shadow p-2 mb-4 flex flex-row justify-between items-center'>
                <div
                    onClick={()=>setEditMode(true)}>
                    {editMode ? <input
                        type='text'
                        autoFocus
                        onBlur={() => setEditMode(false)}
                        onKeyDown={(e: any) => {
                            if (e.key !== "Enter") return;
                            setEditMode(false);
                            handleEditMode()
                        }}
                        defaultValue={title}
                        onChange={(e: any) => setTitle(e.target.value)}
                        className='form-input w-full bg-neutral-50 outline-none'
                    /> :
                    title}
                </div>
                <button onClick={()=>handleRemoveColumn(column.id)}>
                    <XCircleIcon className='w-6 aspect-square' />
                </button>
            </div>
            <div>
                <SortableContext items={cardsIds}>
                    {column.cards ? column.cards.sort((a,b)=>a.index-b.index).map((card: Card) => {
                        return <CardElement
                            key={card.id}
                            card={card}
                        />
                    }) : <div className="ps-2 mb-3">Carregando...</div>}
                </SortableContext>
            </div>
            <button onClick={handleCreateCard} className='relative rounded-md drop-shadow bg-neutral-50 p-2 flex w-full items-center justify-center'>
                <PlusCircleIcon className='w-6 aspect-square absolute top-1 left-2' />
                <h1 className='w-full text-center'>Add Card</h1>
            </button>
        </div>
    );
}
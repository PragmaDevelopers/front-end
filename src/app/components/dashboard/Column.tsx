import { useUserContext } from "@/app/contexts/userContext";
import { ColumnContainerProps } from "@/app/interfaces/KanbanInterfaces";
import { Card } from "@/app/types/KanbanTypes";
import { EditMode, DeleteColumn } from "@/app/utils/dashboard/functions/Column";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useMemo, useRef } from "react";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { CardElement } from "./Card";
import { CSS } from '@dnd-kit/utilities';
import { isFlagSet } from "@/app/utils/checkers";

export function ColumnContainer(props: ColumnContainerProps) {
    const {
        column,
        deleteColumn,
        updateColumnTitle,
        createCard,
        deleteCard,
        setShowCreateCardForm,
        setTempCard,
        setIsEdition,
        setTempColumnID,
        setEditorText,
        setModalTitle,
        setModalDescription,
        setModalOptions,
        setModalOpen,
        setModalBorderColor,
        setModalFocusRef,
        setModalText,
    } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const { userValue, updateUserValue } = useUserContext();
    const cardsIds = useMemo(() => { return column.cardsList.map((card: Card) => card.id) }, [column]);

    const delCol = () => {
        deleteColumn(column.id);
        setModalOpen(false);
    }

    const noButtonRef = useRef<HTMLButtonElement>(null);

    const modalOpts: CustomModalButtonAttributes[] = [
        {
            text: "Sim",
            onclickfunc: delCol,
            type: "button",
            className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        },
        {
            text: "Não",
            onclickfunc: () => setModalOpen(false),
            ref: noButtonRef,
            type: "button",
            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
        }
    ]

    const modalOptsElements: any = modalOpts.map(
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);


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
            <div ref={setNodeRef} style={style} className='h-full w-64 bg-neutral-300 rounded-md border-2 border-neutral-950 content-[" "]'>
            </div>
        );
    }

    const handleCreateCard = () => {
        createCard(column.id);
    }

    const handleEditMode = () => {
        EditMode(
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            userValue.userData,
            setEditMode,

        );
    }

    const handleDeleteColumn = () => {
        DeleteColumn(
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            modalOptsElements,
            isFlagSet,
            userValue.userData,
        );
    }

    return (
        <div className='relative w-64 h-full overflow-auto p-1'
            ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <div className='w-full bg-neutral-50 rounded-md drop-shadow p-2 mb-4 flex flex-row justify-between items-center'>
                <div
                    onClick={handleEditMode}>
                    {editMode ? <input
                        type='text'
                        autoFocus
                        onBlur={() => setEditMode(false)}
                        onKeyDown={(e: any) => {
                            if (e.key !== "Enter") return;
                            setEditMode(false);
                        }}
                        value={column.title}
                        onChange={(e: any) => updateColumnTitle(column.id, e.target.value)}
                        className='form-input w-full bg-neutral-50 outline-none'
                    /> :
                        column.title}
                </div>
                <button onClick={handleDeleteColumn}>
                    <XCircleIcon className='w-6 aspect-square' />
                </button>
            </div>
            <div>
                <SortableContext items={cardsIds}>
                    {column.cardsList.map((card: Card) => {
                        return <CardElement
                            setTempColumnID={setTempColumnID}
                            setTempCard={setTempCard}
                            setShowCreateCardForm={setShowCreateCardForm}
                            card={card}
                            deleteCard={deleteCard}
                            setIsEdition={setIsEdition}
                            key={card.id}
                            setEditorText={setEditorText}
                            setModalOptions={props.setModalOptions}
                            setModalOpen={props.setModalOpen}
                            setModalDescription={props.setModalDescription}
                            setModalFocusRef={props.setModalFocusRef}
                            setModalBorderColor={props.setModalBorderColor}
                            setModalTitle={props.setModalTitle}
                            setModalText={props.setModalText}
                        />
                    })}
                </SortableContext>
            </div>
            <button onClick={handleCreateCard} className='relative rounded-md drop-shadow bg-neutral-50 p-2 flex w-full items-center justify-center'>
                <PlusCircleIcon className='w-8 aspect-square absolute top-1 left-2' />
                <h1 className='w-full text-center'>Add Card</h1>
            </button>
        </div>
    );
}
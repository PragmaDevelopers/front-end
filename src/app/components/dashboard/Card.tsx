import { useUserContext } from "@/app/contexts/userContext";
import { isFlagSet } from "@/app/utils/checkers";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { useRef } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useModalContext } from "@/app/contexts/modalContext";
import { Card, SystemID } from "@/app/types/KanbanTypes";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { ConfirmDeleteCard, DeleteCard, ShowEditCard } from "@/app/utils/dashboard/functions/Page/Card";
import { System } from "@mdxeditor/editor";

export function CardElement({card}:{card:Card}) {

    const noButtonRef = useRef<any>(null);
    const { userValue } = useUserContext();
    const { cardManager, setTempCard, setCardManager, tempCard,tempKanban,setTempKanban } = useKanbanContext();
    const modalContextProps = useModalContext();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: {
            type: 'CARD',
            card,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div className='bg-neutral-300 border-neutral-950 rounded-md w-64 h-16 border-2'
                ref={setNodeRef} style={style} />
        );
    }
    
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

    const handleDeleteCard = (cardId:SystemID) => {
        const delCard = () => {
            DeleteCard(
                cardId,
                card.columnID,
                userValue,
                setTempKanban,
                tempKanban
            );
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delCard,
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
        ConfirmDeleteCard(
            userValue,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleShowEditCard = () => {
        ShowEditCard(
            userValue,
            card,
            setCardManager,
            setTempCard,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    return (
        <div className={`${card.id == "" || card.id.toString().includes("|") ? "loading-element" : ""} my-2 bg-neutral-50 drop-shadow rounded-md relative`}
            ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className='p-2 w-full h-full' onClick={handleShowEditCard}>
                <h1 className='font-black font-lg truncate'>{card.title}</h1>
            </div>
            <button className='absolute top-2 right-2' onClick={()=>handleDeleteCard(card.id)}>
                <XCircleIcon className='w-6 aspect-square' />
            </button>
        </div>
    );
}
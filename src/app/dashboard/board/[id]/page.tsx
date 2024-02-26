"use client";

import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    DragOverEvent
} from '@dnd-kit/core';
import {
    SetStateAction,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    SortableContext,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import {
    ArrowPathIcon,
    CircleStackIcon,
    Cog6ToothIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
    Card,
    Column,
    DateValue,
    Kanban,
    SystemID,
    User,
} from '@/app/types/KanbanTypes';
import { CustomModal, CustomModalButtonAttributes } from '@/app/components/ui/CustomModal';
import Link from 'next/link';
import { useUserContext } from '@/app/contexts/userContext';
import { ColumnContainer } from '@/app/components/dashboard/Column';
import CreateEditCard from '@/app/components/dashboard/CreateEditCard';
import { OnDragEnd, OnDragOver, OnDragStart } from '@/app/utils/dashboard/functions/Page/DnDKit';
import { CreateNewColumn } from '@/app/utils/dashboard/functions/Page/Column';
import { useKanbanContext } from '@/app/contexts/kanbanContext';
import { get_columns, get_kanban_members } from '@/app/utils/fetchs';
import { useModalContext } from '@/app/contexts/modalContext';
import { CardElement } from '@/app/components/dashboard/Card';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShowEditCard } from '@/app/utils/dashboard/functions/Page/Card';

export default function Page({ params }: { params: { id: SystemID } }) {
    const [tempDragState, setTempDragState] = useState<any>(null);
    const [generalLoading,setGeneralLoading] = useState<any|null>(null);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const searchParams = useSearchParams();
    const { userValue } = useUserContext();
    const { kanbanList,setKanbanList, cardManager, tempKanban, setTempKanban, tempCard, setTempCard, setCardManager } = useKanbanContext();
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,  // 2px
        }
    }));

    const modalContextProps = useModalContext();

    const columnsId = useMemo(() => {
        if (!tempKanban) {
            return [];
        }
        const ids:SystemID[] = [];
        tempKanban?.columns.forEach(col=>ids.push(col.id));
        return ids;
    }, [tempKanban]);

    useLayoutEffect(() => {
        if(searchParams.get("card") != null){
            ShowEditCard(
                userValue,
                searchParams.get("card") as SystemID,
                setCardManager,
                setTempCard,
                cardManager,
                modalOpt,
                noButtonRef,
                modalContextProps
            );
        }
        const kanbanIndex = kanbanList?.findIndex(kanban=>kanban.id==params.id);
        if(kanbanIndex != undefined && kanbanIndex != null && kanbanIndex != -1){
            getKanbanValues(kanbanIndex);
            sessionStorage.setItem("previous_dashboard_id",params.id.toString());
        }
        // const intervalId = setInterval(()=>{
        //     const kanbanIndex = kanbanList?.findIndex(kanban=>kanban.id==params.id);
        //     if(kanbanIndex != undefined && kanbanIndex != null && kanbanIndex != -1){
        //         console.log("Tempo real: Lista das colunas e cards "+params.id)
        //         getKanbanValues(kanbanIndex);
        //     }
        // },10000)
        // return () => clearInterval(intervalId);
    }, []);

    function getKanbanValues(kanbanIndex:number){
        if(kanbanList){
            const kanban = kanbanList[kanbanIndex];
            setTempKanban({...kanban});
            get_columns(undefined,kanban.id,userValue.token,(response)=>response.json().then((dbColumns:Column[])=>{
                if(sessionStorage.getItem("previous_dashboard_id") == kanban.id){
                    setTempKanban({...kanban,columns:dbColumns});
                    kanbanList[kanbanIndex].columns = dbColumns;
                    setKanbanList(kanbanList);
                    setGeneralLoading(false)
                }
            }));
        }
    }

    const handleRefleshKanban = () => {
        const kanbanIndex = kanbanList?.findIndex(kanban=>kanban.id==params.id);
        if(kanbanIndex != undefined && kanbanIndex != null && kanbanIndex != -1){
            setGeneralLoading(true);
            getKanbanValues(kanbanIndex);
        }
    }

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
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
    );

    const onDragStart = (event: DragStartEvent) => {
        OnDragStart(
            event,
            userValue,
            modalContextProps,
            noButtonRef,
            setActiveCard,
            setActiveColumn,
            setTempDragState,
        );
    }

    const onDragEnd = (event: DragEndEvent) => {
        OnDragEnd(
            event,
            userValue,
            modalContextProps,
            noButtonRef,
            setTempKanban,
            setActiveColumn,
            setActiveCard,
            tempDragState,
        );
    }

    const onDragOver = (event: DragOverEvent) => {
        OnDragOver(
            event,
            userValue,
            modalContextProps,
            noButtonRef,
            setTempKanban,
        );
    }

    const handleCreateNewColumn = () => {
        CreateNewColumn(
            userValue,
            setTempKanban,
            setKanbanList,
            kanbanList,
            tempKanban,
            modalOpt,
            noButtonRef,
            modalContextProps
        );
    }

    return (
        <main className={`sw-full h-full overflow-x-auto overflow-y-hidden shrink-0`}>
            { cardManager?.isShowCreateCard && <CreateEditCard />}
            <div className="flex justify-between items-center w-[80%] h-[4%] fixed">
                <h1>{tempKanban?.title}</h1>
                <div className="flex gap-3">
                    <button onClick={handleRefleshKanban} type='button' className={generalLoading ? "loading-element" : ""}><ArrowPathIcon className="aspect-square w-5 hover:rotate-180 transition-all rotate-0" /></button>
                    <Link className='me-3' href={`/dashboard/config/board/${params.id}`}><Cog6ToothIcon className='aspect-square w-8 hover:rotate-180 transition-all rotate-0' /></Link>
                </div>
            </div>
            <DndContext autoScroll={true} sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="flex flex-row justify-start items-start gap-x-2 w-full h-[92%] mt-[4%] shrink-0">
                    <SortableContext items={columnsId}>
                        {tempKanban?.columns.sort((a,b)=>a.index-b.index).map((column) => {
                            return <ColumnContainer
                                key={column.id}
                                column={column}
                            />
                        })}
                    </SortableContext>
                    <button 
                    className='min-w-64 w-64 h-full rounded-md shadow-inner bg-[#F0F0F0] border-neutral-200 border-[1px] flex flex-col justify-center items-center' 
                    onClick={handleCreateNewColumn}>
                        <h1 className='mb-2'>Add Column</h1>
                        <PlusCircleIcon className='w-8 aspect-square' />
                    </button>
                </div>
                {createPortal(
                    <DragOverlay className='w-full h-full'>
                        {activeColumn && <ColumnContainer
                            column={activeColumn}
                        />}
                        {activeCard && <CardElement
                            card={activeCard}
                        />}
                    </DragOverlay>,
                    document?.body)}
            </DndContext>
        </main>
    );
}

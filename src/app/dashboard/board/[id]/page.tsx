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
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    SortableContext,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import {
    Cog6ToothIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
    Card,
    Column,
    DateValue,
    Kanban,
    SystemID,
} from '@/app/types/KanbanTypes';
import { MDXEditorMethods } from "@mdxeditor/editor";
import { CustomModal, CustomModalButtonAttributes } from '@/app/components/ui/CustomModal';
import Link from 'next/link';
import { useUserContext } from '@/app/contexts/userContext';
import { isFlagSet } from '@/app/utils/checkers';
import { ColumnContainer } from '@/app/components/dashboard/Column';
import CreateEditCard from '@/app/components/dashboard/CreateEditCard';
import { OnDragEnd, OnDragOver, OnDragStart } from '@/app/utils/dashboard/functions/Page/DnDKit';
import { AddCardDate, CreateCardForm, DeleteCard } from '@/app/utils/dashboard/functions/Page/Card';
import { UpdateListTitle, InputChange, AddList, AddInput, RemoveList, RemoveInput, ToggleCheckbox } from '@/app/utils/dashboard/functions/Page/Checklist';
import { UpdateColumnTitle, RemoveColumn, CreateNewColumn } from '@/app/utils/dashboard/functions/Page/Column';
import { AppendToTempCardsArray, PopFromTempCardsArray } from '@/app/utils/dashboard/functions/Page/InnerCardUtils';
import { AddTag, RemoveTag } from '@/app/utils/dashboard/functions/Page/Tag';
import { PageAddInnerCard, PageCreateInnerCard, PageEditInnerCard } from '@/app/utils/dashboard/functions/Page/InnerCard';
import { API_BASE_URL } from '@/app/utils/variables';
import { useKanbanContext } from '@/app/contexts/kanbanContext';
import { get_columns } from '@/app/utils/fetchs';
import { useModalContext } from '@/app/contexts/modalContext';


export default function Page({ params }: { params: { id: SystemID } }) {
    const [tempDragState, setTempDragState] = useState<any>(null);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [, setActiveCard] = useState<Card | null>(null);
    const [showCreateCardForm, setShowCreateCardForm] = useState<boolean>(false);
    const [tempCard, setTempCard] = useState<any>({});
    const [isEdition, setIsEdition] = useState<boolean>(false);
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [editorText, setEditorText] = useState<string>("");
    const [tempCardsArr, setTempCardsArrr] = useState<Card[]>([]);
    const [isCreatingInnerCard, setIsCreatingInnerCard] = useState<boolean>(false);
    const [isEdittingInnerCard, setIsEdittingInnerCard] = useState<boolean>(false);
    const { userValue } = useUserContext();
    const { kanbanValues, tempColumn, setTempColumn } = useKanbanContext();
    const [kanban, setKanban] = useState<Kanban>({
        id: 0,
        title: "",
        columns: []
    });
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const columnsId = useMemo(() => {
        const ids:SystemID[] = [];
        kanbanValues?.forEach(kanban=>{
            if(kanban.columns && kanban.columns.length > 0){
                kanban.columns.forEach(column=>ids.push(column.id));
            }
        });
        return ids;
    }, [kanbanValues]);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,  // 2px
        }
    }));

    const modalContextProps = useModalContext();

    useEffect(() => {
        const kanbanIndex = kanbanValues?.findIndex(kanban=>kanban.id==params.id);
        if(kanbanIndex != -1){
            const tempKanban = kanbanValues[kanbanIndex];
            if(tempKanban.columns && tempKanban.columns.length > 0){
                get_columns(undefined,params.id,userValue.token,(response=>response.json().then((columns:Column[])=>{
                    setKanban({
                        id: tempKanban.id,
                        title: tempKanban.title,
                        columns: columns
                    });
                    // setKanbanValues((prevState:Kanban[]) => {
                    //     const newKanbanValues = [...prevState];
                    //     newKanbanValues[kanbanIndex] = {
                    //         ...newKanbanValues[kanbanIndex],
                    //         columns: columns
                    //     };
                    //     return newKanbanValues;
                    // });
                })));
            }else{
                setKanban(tempKanban);
            }
        }
    }, [tempColumn]);


    // function getIntervalColumns(){
    //     get_columns(undefined,Number(params.id),userValue.token,(response=>response.json().then((column:Column)=>{
    //         const kanbanIndex = kanbanValues?.findIndex(kanban=>kanban.id==params.id);
    //         if(kanbanIndex != -1){
    //             const newKanbanValues = 
    //         }
    //     })));
    // }

    //useEffect(() => {
    //    fetch(`http://localhost:8080/api/dashboard/column/getall/${params.id}`).then(response => response.json()).then(data => {
    //    })
    //}, [params]);
    const onDragStart = (event: DragStartEvent) => {
        // OnDragStart(
        //     event,
        //     userValue,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     setActiveCard,
        //     setActiveColumn,
        //     setTempDragState,
        // );
    }

    const onDragEnd = (event: DragEndEvent) => {
        // OnDragEnd(
        //     event,
        //     userValue,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     setKanbanValues,
        //     setActiveColumn,
        //     setActiveCard,
        //     tempDragState,
        // );
    }

    const onDragOver = (event: DragOverEvent) => {
        // OnDragOver(
        //     event,
        //     userValue,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     setKanbanValues,            
        // );
    }

    const handleCreateCardForm = (event: any, isEdition: boolean) => {
        // CreateCardForm(
        //     event,
        //     isEdition,
        //     editorRef,
        //     tempColumnID,
        //     tempCard,
        //     setKanbanValues,
        //     userValue,
        //     setTempColumnID,
        //     setEditorText,
        //     setTempCard,
        //     setShowCreateCardForm,
        // );
    }

    const handleUpdateListTitle = (listIndex: number, value: string) => {
        // UpdateListTitle(
        //     listIndex,
        //     value,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,

        // );
    }

    const handleInputChange = (listIndex: number, inputIndex: number, value: string) => {
        // InputChange(
        //     listIndex,
        //     inputIndex,
        //     value,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,
        // );
    }

    const handleAddList = () => {
        // AddList(
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,
        // );
    }

    const handleAddInput = (listIndex: number) => {
        // AddInput(
        //     listIndex,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,
        // );
    }

    const handleRemoveList = (listIndex: number,) => {
        // RemoveList(
        //     listIndex,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,
        // );
    }

    const handleRemoveInput = (listIndex: number, inputIndex: number) => {
        // RemoveInput(
        //     listIndex,
        //     inputIndex,
        //     setModalTitle,
        //     setModalDescription,
        //     setModalText,
        //     setModalBorderColor,
        //     setModalFocusRef,
        //     setModalOptions,
        //     setModalOpen,
        //     noButtonRef,
        //     isFlagSet,
        //     userValue.profileData,
        //     setTempCard,
        // );
    }

    const handleToggleCheckbox = (listIndex: number, itemIndex: number) => {
        ToggleCheckbox(
            listIndex, 
            itemIndex,
            setTempCard,
        );
    }

    const handleAddTag = (tagTitle: string, tagColor: string) => {
        AddTag(
            tagTitle,
            tagColor,
            setTempCard,
            userValue,
        );
    }

    const handleRemoveCurrentTag = (tagID: SystemID) => {
        console.log("HANDLE REMOVE TAG, ID", tagID);
        RemoveTag(
            tagID,
            setTempCard,
        );
    }

    const handleAddCustomField = (name: string, value: string | number, fieldType: "text" | "number") => {
        // AddCustomField(
        //     name,
        //     value,
        //     fieldType,
        //     setTempCard,
        // );
    }







    const setTempCardsArr = (value: any) => {
        console.log("## APPENDING VALUE", value, "TO", tempCardsArr);
        setTempCardsArrr(value);
    }

    const handleAddInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        console.log("#0 HANDLE ADD INNER CARD ON PAGE FILE", tempCardsArr);
        // PageAddInnerCard(
        //     event,
        //     isEdittingInnerCard,
        //     editorRef,
        //     tempCard,
        //     setEditorText,
        //     tempCardsArr,
        //     setTempCardsArr,
        //     setTempCard,
        // );
    }

    const handleCreateInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        console.log("#0 HANDLE CREATE INNER CARD ON PAGE FILE", tempCardsArr);
        console.log("#0 HANDLE CREATE INNER CARD ON PAGE FILE", isEdittingInnerCard);
        // PageCreateInnerCard(
        //         event,
        //         isEdittingInnerCard,
        //         editorRef,
        //         tempCard,
        //         setEditorText,
        //         setIsCreatingInnerCard,
        //         tempCardsArr,
        //         setTempCardsArr,
        //         setTempCard,
        //     );
    }

    const handleAppendToTempCardsArray = (newCard: Card) => {
        AppendToTempCardsArray(newCard, tempCardsArr, setTempCardsArr);
    }

    const handlePopFromTempCardsArray = (): Card | undefined => {
        const res = PopFromTempCardsArray(tempCardsArr, setTempCardsArr);
        return res;
    }

    const handleCreateNewColumn = () => {
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
        CreateNewColumn(
            userValue,
            setTempColumn,
            kanban,
            modalOpt,
            noButtonRef,
            modalContextProps
        );
    }

    const handleAddDate = (value: any) => {
        AddCardDate(value, tempCard, setTempCard);
    }

    const editEditorText = (text: string) => {
        // editorRef.current?.setMarkdown(text);
    }

    return (
        <main className="w-full h-full overflow-x-auto overflow-y-hidden shrink-0">
            {/* <CustomModal /> */}
            <CreateEditCard
                showCreateCardForm={showCreateCardForm}
                setShowCreateCardForm={setShowCreateCardForm}
                card={tempCard as Card}
                createCardForm={handleCreateCardForm}
                updateListTitle={handleUpdateListTitle}
                handleInputChange={handleInputChange}
                handleAddList={handleAddList}
                handleAddInput={handleAddInput}
                handleRemoveList={handleRemoveList}
                handleRemoveInput={handleRemoveInput}
                handleToggleCheckbox={handleToggleCheckbox}
                isEdition={isEdition}
                addNewTag={handleAddTag}
                removeCurrentTag={handleRemoveCurrentTag}
                cardDate={cardDate}
                setCardDate={setCardDate}
                editorText={editorText}
                setEditorText={editEditorText}
                addCustomField={handleAddCustomField}
                addInnerCard={handleAddInnerCard}
                createInnerCard={handleCreateInnerCard}
                tempCardsArr={tempCardsArr}
                isCreatingInnerCard={isCreatingInnerCard}
                setIsCreatingInnerCard={setIsCreatingInnerCard}
                isEdittingInnerCard={isEdittingInnerCard}
                setIsEdittingInnerCard={setIsEdittingInnerCard}
                _appendToTempCardsArray={handleAppendToTempCardsArray}
                _popFromTempCardsArray={handlePopFromTempCardsArray}
                handleAddDate={handleAddDate}
                setTempCard={setTempCard}
                setTempCardsArr={setTempCardsArr}
                kanbanValues={kanbanValues}
                kanban={kanban}
            />
            <div className="flex justify-between items-center w-[80%] fixed">
                <h1>{kanban.title}</h1>
                <Link className='me-3' href={`/dashboard/config/board/${params.id}`}><Cog6ToothIcon className='aspect-square w-8 hover:rotate-180 transition-all rotate-0' /></Link>
            </div>
            <DndContext autoScroll={true} sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="flex flex-row justify-start items-start gap-x-2 w-full h-full mt-9 shrink-0">
                    <SortableContext items={columnsId}>
                        {kanban.columns?.map((column) => <ColumnContainer
                            key={column.id}
                            column={column}
                            kanban={kanban}
                            setKanban={setKanban}
                        />)}
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
                            kanban={kanban}
                            setKanban={setKanban}
                        />}
                    </DragOverlay>,
                    document.body)}
            </DndContext>
        </main>
    );
}

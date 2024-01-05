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
    SystemID,
} from '@/app/types/KanbanTypes';
import { MDXEditorMethods } from "@mdxeditor/editor";
import { CustomModal } from '@/app/components/ui/CustomModal';
import Link from 'next/link';
import { useUserContext } from '@/app/contexts/userContext';
import { isFlagSet } from '@/app/utils/checkers';
import { ColumnContainer } from '@/app/components/dashboard/Column';
import CreateEditCard from '@/app/components/dashboard/CreateEditCard';
import { OnDragEnd, OnDragOver, OnDragStart } from '@/app/utils/dashboard/functions/Page/DnDKit';
import { AddCardDate, CreateCard, CreateCardForm, DeleteCard } from '@/app/utils/dashboard/functions/Page/Card';
import { UpdateListTitle, InputChange, AddList, AddInput, RemoveList, RemoveInput, ToggleCheckbox } from '@/app/utils/dashboard/functions/Page/Checklist';
import { UpdateColumnTitle, RemoveColumn, CreateNewColumn } from '@/app/utils/dashboard/functions/Page/Column';
import { AddCustomField } from '@/app/utils/dashboard/functions/Page/CustomField';
import { AppendToTempCardsArray, PopFromTempCardsArray } from '@/app/utils/dashboard/functions/Page/InnerCardUtils';
import { AddTag, RemoveTag } from '@/app/utils/dashboard/functions/Page/Tag';
import { PageAddInnerCard, PageCreateInnerCard } from '@/app/utils/dashboard/functions/Page/InnerCard';
import { API_BASE_URL } from '@/app/utils/variables';


export default function Page({ params }: { params: { id: SystemID } }) {
    const [tempDragState, setTempDragState] = useState<any>(null);
    const [kanbanData, setKanbanData] = useState<any>({});
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [, setActiveCard] = useState<Card | null>(null);
    const columnsId = useMemo(() => {
        if (kanbanData && kanbanData.columns && kanbanData.columns.length > 0) {
            return kanbanData.columns.map((col: any) => col.id);
        } else {
            return [];
        }
    }, [kanbanData]);
    const [showCreateCardForm, setShowCreateCardForm] = useState<boolean>(false);
    const [tempColumnID, setTempColumnID] = useState<SystemID>("");
    const [tempCard, setTempCard] = useState<any>({});
    const [isEdition, setIsEdition] = useState<boolean>(false);
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [editorText, setEditorText] = useState<string>("");
    const [tempCardsArr, setTempCardsArr] = useState<Card[]>([]);
    const [isCreatingInnerCard, setIsCreatingInnerCard] = useState<boolean>(false);
    const [isEdittingInnerCard, setIsEdittingInnerCard] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalDescription, setModalDescription] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalOptions, setModalOptions] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalBorderColor, setModalBorderColor] = useState<string>("");
    const [modalFocusRef, setModalFocusRef] = useState<any>();
    const [kanbansArray, setKanbansArray] = useState<{ id: SystemID, title: string }[]>([]);
    const [kanbansColumnsArray, setKanbansColumnsArray] = useState<{id: SystemID, columns: Column[]}[]>([]);
    const [kanbanTitle, setKanbanTitle] = useState<string>("");
    const { userValue } = useUserContext();
    const editorRef = useRef<MDXEditorMethods>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,  // 2px
        }
    }));


    

    useEffect(() => {
        const appendToKanbansColumnsArray = (element: any) => {
            let _tmpArr = kanbansColumnsArray;
            _tmpArr.push(element);
            setKanbansColumnsArray(_tmpArr);
        }


        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban`, requestOptions).then(response => response.json()).then((data: {id: SystemID, title:string}[]) => {
            data.forEach((element: { id: SystemID, title: string }) => {
                let id = element.id;
                let title = element.title;
                if ((id as number) === parseInt(params.id as string)) {
                    console.log(title);
                    setKanbanTitle(title);
                }
                fetch(`${API_BASE_URL}/api/private/user/kanban/${id}/columns`).then(response => response.json()).then((data: any) => {
                    let _newEntry = {
                        id: id,
                        columns: data,
                    }

                    appendToKanbansColumnsArray(_newEntry);
                })
            });

            setKanbansArray(data);
        })
    }, [setKanbansArray, userValue, kanbansColumnsArray, setKanbansColumnsArray, setKanbanTitle, params]);






    //useEffect(() => {
    //    fetch(`http://localhost:8080/api/dashboard/column/getall/${params.id}`).then(response => response.json()).then(data => {
    //    })
    //}, [params]);
    const onDragStart = (event: DragStartEvent) => {
        OnDragStart(
            event,
            userValue,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            setActiveCard,
            setActiveColumn,
            setTempDragState,
        );
    }

    const onDragEnd = (event: DragEndEvent) => {
        OnDragEnd(
            event,
            userValue,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            setKanbanData,
            setActiveColumn,
            setActiveCard,
            tempDragState,
        );
    }

    const onDragOver = (event: DragOverEvent) => {
        OnDragOver(
            event,
            userValue,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            setKanbanData,            
        );
    }

    const handleCreateCardForm = (event: any, isEdition: boolean) => {
        CreateCardForm(
            event,
            isEdition,
            editorRef,
            tempColumnID,
            tempCard,
            setKanbanData,
            userValue,
            setTempColumnID,
            setEditorText,
            setTempCard,
            setShowCreateCardForm,
        );
    }

    const handleUpdateListTitle = (listIndex: number, value: string) => {
        UpdateListTitle(
            listIndex,
            value,
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
            setTempCard,

        );
    }

    const handleInputChange = (listIndex: number, inputIndex: number, value: string) => {
        InputChange(
            listIndex,
            inputIndex,
            value,
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
            setTempCard,
        );
    }

    const handleAddList = () => {
        AddList(
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
            setTempCard,
        );
    }

    const handleAddInput = (listIndex: number) => {
        AddInput(
            listIndex,
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
            setTempCard,
        );
    }

    const handleRemoveList = (listIndex: number,) => {
        RemoveList(
            listIndex,
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
            setTempCard,
        );
    }

    const handleRemoveInput = (listIndex: number, inputIndex: number) => {
        RemoveInput(
            listIndex,
            inputIndex,
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
            setTempCard,
        );
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
        AddCustomField(
            name,
            value,
            fieldType,
            setTempCard,
        );
    }









    const handleAddInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        console.log("#0 HANDLE ADD INNER CARD ON PAGE FILE", tempCardsArr);
        PageAddInnerCard(
            event,
            isEdittingInnerCard,
            editorRef,
            tempCard,
            setEditorText,
            tempCardsArr,
            setTempCardsArr,
            setTempCard,
        );
    }

    const handleCreateInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        console.log("#0 HANDLE CREATE INNER CARD ON PAGE FILE", tempCardsArr);
        PageCreateInnerCard(
            event,
            isEdittingInnerCard,
            editorRef,
            tempCard,
            setEditorText,
            setIsCreatingInnerCard,
            tempCardsArr,
            setTempCardsArr,
            setTempCard,
        );
        
    }








    const handleAppendToTempCardsArray = (newCard: Card) => {
        AppendToTempCardsArray(newCard, tempCardsArr, setTempCardsArr);
    }

    const handlePopFromTempCardsArray = (): Card | undefined => {
        const res = PopFromTempCardsArray(tempCardsArr, setTempCardsArr);
        return res;
    }










    const handleCreateCard = (columnID: SystemID) => {
        CreateCard(
            columnID,
            userValue.userData,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            setTempColumnID,
            setEditorText,
            setTempCard,
            setIsEdition,
            setShowCreateCardForm,
            editorRef,
        );
    }

    const handleDeleteCard = (columnID: SystemID, cardID: SystemID) => {
        DeleteCard(columnID, cardID, setKanbanData);
    }

    const handleUpdateColumnTitle = (columnID: SystemID, title: string) => {
        UpdateColumnTitle(
            columnID, 
            title, 
            userValue, 
            setKanbanData,
        );
    }

    const handleRemoveColumn = (columnIDToRemove: SystemID) => {
        RemoveColumn(
            columnIDToRemove, 
            userValue, 
            setKanbanData, 
            kanbanData,
        );
    }

    const handleCreateNewColumn = () => {
        CreateNewColumn(
            userValue,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setModalOpen,
            noButtonRef,
            isFlagSet,
            setKanbanData,
            kanbanData,
            params,
        );
    }

    const handleAddDate = (value: any) => {
        AddCardDate(value, tempCard, setTempCard);
    }

    const editEditorText = (text: string) => {
        editorRef.current?.setMarkdown(text);
    }

    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <CustomModal
                title={modalTitle}
                description={modalDescription}
                text={modalText}
                options={modalOptions}
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                borderColor={modalBorderColor}
                focusRef={modalFocusRef}
            />
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
                ref={editorRef}
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
                setModalOptions={setModalOptions}
                setModalOpen={setModalOpen}
                setModalDescription={setModalDescription}
                setModalFocusRef={setModalFocusRef}
                setModalBorderColor={setModalBorderColor}
                setModalTitle={setModalTitle}
                setModalText={setModalText}
                handleAddDate={handleAddDate}
                columnsArray={kanbansColumnsArray}
                dashboards={kanbansArray}

            />
            <div className="flex justify-between items-center w-full px-2">
                <h1>{kanbanTitle}</h1>
                <Link href={`/dashboard/config/board/${params.id}`}><Cog6ToothIcon className='aspect-square w-8 hover:rotate-180 transition-all rotate-0' /></Link>
            </div>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="flex flex-row justify-start items-start gap-x-2 w-full h-[95%] overflow-auto shrink-0">
                    <SortableContext items={columnsId}>
                        {kanbanData.columns?.map((col: Column) => <ColumnContainer
                            createCard={handleCreateCard}
                            deleteCard={handleDeleteCard}
                            updateColumnTitle={handleUpdateColumnTitle}
                            key={col.id}
                            column={col}
                            deleteColumn={handleRemoveColumn}
                            setShowCreateCardForm={setShowCreateCardForm}
                            setTempCard={setTempCard}
                            setIsEdition={setIsEdition}
                            setTempColumnID={setTempColumnID}
                            setEditorText={editEditorText}
                            setModalOptions={setModalOptions}
                            setModalOpen={setModalOpen}
                            setModalDescription={setModalDescription}
                            setModalFocusRef={setModalFocusRef}
                            setModalBorderColor={setModalBorderColor}
                            setModalTitle={setModalTitle}
                            setModalText={setModalText}
                        />)}
                    </SortableContext>
                    <button 
                    className='w-64 h-full rounded-md shadow-inner bg-[#F0F0F0] border-neutral-200 border-[1px] flex flex-col justify-center items-center' 
                    onClick={handleCreateNewColumn}>
                        <h1 className='mb-2'>Add Column</h1>
                        <PlusCircleIcon className='w-8 aspect-square' />
                    </button>
                </div>
                {createPortal(
                    <DragOverlay className='w-full h-full'>
                        {activeColumn && <ColumnContainer
                            deleteCard={handleDeleteCard}
                            createCard={handleCreateCard}
                            updateColumnTitle={handleUpdateColumnTitle}
                            column={activeColumn}
                            deleteColumn={handleRemoveColumn}
                            setTempCard={setTempCard}
                            setShowCreateCardForm={setShowCreateCardForm}
                            setIsEdition={setIsEdition}
                            setTempColumnID={setTempColumnID}
                            setEditorText={setEditorText}
                            setModalOptions={setModalOptions}
                            setModalOpen={setModalOpen}
                            setModalDescription={setModalDescription}
                            setModalFocusRef={setModalFocusRef}
                            setModalBorderColor={setModalBorderColor}
                            setModalTitle={setModalTitle}
                            setModalText={setModalText}
                        />}
                    </DragOverlay>,
                    document.body)}
            </DndContext>
        </main>
    );
}

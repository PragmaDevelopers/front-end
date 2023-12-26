"use client";

/* ==========================================================================================

BUG:
    Go to Line 1540;

============================================================================================= */

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
    CSSProperties,
    MutableRefObject,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
    Ref,
    ChangeEvent,
    Fragment
} from 'react';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    arrayMove,
    useSortable
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import {
    ArrowUpOnSquareIcon,
    Cog6ToothIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { CalendarDaysIcon, XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { HexColorPicker } from "react-colorful";
import {
    CardElementProps,
    ColumnContainerProps,
    CreateEditCardProps,
    InnerCardElementProps,
    RichEditorProps
} from '@/app/interfaces/KanbanInterfaces';
import {
    Card,
    CheckList,
    CheckListItem,
    Column,
    CustomFieldNumber,
    CustomFieldText,
    CustomFields,
    DateValue,
    KanbanData,
    Member,
    Tag,
    userData
} from '@/app/types/KanbanTypes';
import '@mdxeditor/editor/style.css';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    tablePlugin,
    markdownShortcutPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    InsertImage,
    InsertTable,
    ListsToggle,
    CreateLink,
    MDXEditor,
    MDXEditorMethods,
} from "@mdxeditor/editor";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Combobox, Transition } from '@headlessui/react';
import { CustomModal, CustomModalButtonAttributes } from '@/app/components/ui/CustomModal';
import Link from 'next/link';
import { API_BASE_URL, SYSTEM_PERMISSIONS } from '@/app/utils/variables';
import { useUserContext } from '@/app/contexts/userContext';
import { isFlagSet } from '@/app/utils/checkers';
import { InnerCardElement } from '@/app/components/dashboard/InnerCard';
import { CardElement } from '@/app/components/dashboard/Card';
import RichEditor from '@/app/components/dashboard/RichEditor';
import { ColumnContainer } from '@/app/components/dashboard/Column';
import CreateEditCard from '@/app/components/dashboard/CreateEditCard';


export default function Page({ params }: { params: { id: string } }) {
    const [tempDragState, setTempDragState] = useState<any>(null);
    const [kanbanData, setKanbanData] = useState<any>({});
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const columnsId = useMemo(() => {
        if (kanbanData && kanbanData.columns && kanbanData.columns.length > 0) {
            return kanbanData.columns.map((col: any) => col.id);
        } else {
            return [];
        }
    }, [kanbanData]);
    const [showCreateCardForm, setShowCreateCardForm] = useState<boolean>(false);
    const [tempColumnID, setTempColumnID] = useState<string | number>("");
    const [lists, setLists] = useState([]);
    const [tempCard, setTempCard] = useState<any>({});
    const [isEdition, setIsEdition] = useState<boolean>(false);
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [editorText, setEditorText] = useState<string>("");
    const [tempCardsArr, setTempCardsArr] = useState<Card[]>([]);
    const [isCreatingInnerCard, setIsCreatingInnerCard] = useState<boolean>(false);
    const [isEdittingInnerCard, setIsEdittingInnerCard] = useState<boolean>(false);




    // const [confirmDeleteYesFunc, setConfirmDeleteYesFunc] = useState<any>(null);
    // const [confirmDeleteNoFunc, setConfirmDeleteNoFunc] = useState<any>(null);
    // const [confirmDeleteYesText, setModalOpen] = useState<string>("");
    // const [confirmDeleteNoText, setModalDescription] = useState<string>("");
    // const [viewConfirmDelete, setModalTitle] = useState<boolean>(false);
    // const [confirmDeleteText, setConfirmDeleteText] = useState<string>("");

    // title: string,
    // description: string,
    // text: string,
    // options: any,
    // isOpen: boolean,
    // setIsOpen: any,
    // borderColor: string,
    // focusRef: any,

    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalDescription, setModalDescription] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalOptions, setModalOptions] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalBorderColor, setModalBorderColor] = useState<string>("");
    const [modalFocusRef, setModalFocusRef] = useState<any>();


    const { userValue, updateUserValue } = useUserContext();


    const editorRef = useRef<MDXEditorMethods>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);


    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,  // 2px
        }
    }));

    //useEffect(() => {
    //    fetch(`http://localhost:8080/api/dashboard/column/getall/${params.id}`).then(response => response.json()).then(data => {
    //    })
    //}, [params]);
















    const onDragStart = (event: DragStartEvent) => {
        
    }

    const onDragEnd = (event: DragEndEvent) => {
        
    }

    const onDragOver = (event: DragOverEvent) => {
        
    }

























    const handleAddCustomField = (name: string, value: string | number, fieldType: "text" | "number") => {
        setTempCard((prevCard: Card) => {
            console.log(prevCard);
            if (fieldType === "text") {
                const Field: CustomFieldText = {
                    name: name,
                    value: value as string,
                    id: "",                                         /////////////////////////////////////////////////////////////////////////////
                    fieldType: "text",
                }
                const newCustomFields: CustomFields[] = [...prevCard.customFields, Field as unknown as CustomFields];
                return {
                    ...prevCard,
                    customFields: newCustomFields,
                };
            } else {
                const Field: CustomFieldNumber = {
                    name: name,
                    value: value as number,
                    id: "",                                         /////////////////////////////////////////////////////////////////////////////
                    fieldType: "number",
                }
                const newCustomFields: CustomFields[] = [...prevCard.customFields, Field as unknown as CustomFields];
                return {
                    ...prevCard,
                    customFields: newCustomFields,
                };
            }
        });
    }







    const editEditorText = (text: string) => {
        editorRef.current?.setMarkdown(text);
    }






    //
    // INNER CARD LOGIC
    //
    const _appendToTempCardsArray = (newCard: Card) => {
        console.log("APPENDING", newCard, "TO", tempCardsArr);
        setTempCardsArr((prevArr: Card[]) => {
            console.log(prevArr);
            console.log(tempCardsArr);
            return [...prevArr, newCard] as Card[];
        });
        console.log(tempCardsArr);
    }

    const _popFromTempCardsArray = (): Card => {
        const retVal = tempCardsArr[tempCardsArr.length - 1];
        setTempCardsArr((prevArr: Card[]) => {
            console.log(prevArr);
            console.log(tempCardsArr);
            const tPrevArr: Card[] = prevArr.slice(0, -1);
            return tPrevArr;
        });
        console.log("POPPING", retVal, "FROM", tempCardsArr);
        return retVal;
    }

    const createInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        if (!isEdittingInnerCard) {
            event.preventDefault();
            let localTempCard: Card = tempCard;
            let localTempCardsArray: Card[] = tempCardsArr;
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            // console.log("createInnerCard", "OLD CARD", cardTitle, cardDescription);
            console.log(localTempCard);
            const newCard: Card = {
                ...localTempCard,
                title: cardTitle,
                description: cardDescription as unknown as string,
            }
            // console.log("createInnerCard", `APPENDING A CARD TO THE TEMPS CARD ARRAY`, tempCardsArr);
            localTempCardsArray.push(newCard);
            const tCard: Card = {
                id: "",                                         /////////////////////////////////////////////////////////////////////////////
                title: "",
                columnID: tempCard.columnID,
                description: "",
                checklists: [],
                tags: [],
                members: [],
                comments: [],
                dropdowns: [],
                date: 0,
                customFields: [],
                innerCards: [],
            }
            event.target.reset();
            setEditorText("");
            setTempCard(tCard);
            setTempCardsArr(localTempCardsArray);
            setIsCreatingInnerCard(false);
            editorRef.current?.setMarkdown("");
        } else {
            // const selectedInnerCard: Card = _popFromTempCardsArray();
            let localTempCard: Card = tempCard;
            let localTempCardsArray: Card[] = tempCardsArr;
            let selectedInnerCard: Card = tempCardsArr.pop() as unknown as Card;
            event.preventDefault();
            //Outer Card
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            // console.log("createInnerCard tempCard", tempCard);
            // console.log("createInnerCard", "OLD OUTER CARD", cardTitle, cardDescription);
            // console.log(tempCard, selectedInnerCard);
            const newCard: Card = { // OUTER CARD
                ...localTempCard,
                title: cardTitle,
                description: cardDescription as unknown as string,
            }
            console.log("createInnerCard", `APPENDING OUTER CARD TO THE TEMPS CARD ARRAY`, localTempCardsArray, newCard);
            //_appendToTempCardsArray(newCard);
            localTempCardsArray.push(newCard);
            console.log("createInnerCard", `APPENDED OUTER CARD TO THE TEMPS CARD ARRAY`, localTempCardsArray);
            //const targetCard = newCard.innerCards.findIndex((card: Card) => card?.id === tempCard.id);
            event.target.reset();
            event.target.title.value = selectedInnerCard.title;
            setEditorText(selectedInnerCard.description);
            editorRef.current?.setMarkdown(selectedInnerCard.description);
            setTempCard(selectedInnerCard);
            setTempCardsArr(localTempCardsArray)
            //setIsCreatingInnerCard(false);
            //setIsEdittingInnerCard(false);
        }
    }

    const addInnerCard = (event: any, _isEdittingInnerCard: boolean) => {
        if (!_isEdittingInnerCard) {
            event.preventDefault();
            let localTempCard: Card = tempCard;
            let localTempCardsArray: Card[] = tempCardsArr;
            // console.log("_isEdittingInnerCard: FALSE", _isEdittingInnerCard);
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            // console.log("addInnerCard", cardTitle, cardDescription);
            const newCard: Card = {
                ...localTempCard,
                title: cardTitle,
                description: cardDescription as unknown as string,
            }
            // console.log("addInnerCard tempCardsArr", tempCardsArr)
            //const _prevCard: Card = _popFromTempCardsArray();
            let _prevCard: Card = localTempCardsArray.pop() as unknown as Card;
            // console.log("addInnerCard _prevCard", _prevCard)
            // console.log("addInnerCard", "PREVIOUS CARD", _prevCard)
            const _nInnerCardsArr: Card[] = [..._prevCard.innerCards, newCard];
            const ntCard: Card = {
                ..._prevCard,
                innerCards: _nInnerCardsArr,
            }
            event.target.reset();
            setEditorText(ntCard.description);
            setTempCard(ntCard);
            setTempCardsArr(localTempCardsArray);
            // console.log("addInnerCard", "NEW TEMPCARD", ntCard);
            editorRef.current?.setMarkdown(ntCard.description);
        } else {
            event.preventDefault();
            let localTempCard: Card = tempCard;
            let localTempCardsArray: Card[] = tempCardsArr;
            console.log("====================================", localTempCardsArray);
            // console.log("_isEdittingInnerCard: TRUE", _isEdittingInnerCard);
            // Inner Card
            console.log("addInnerCard INNER_tempCard", localTempCard);
            console.log("AAAAAAAAAAAAAAAAA", localTempCardsArray); // tempCardsArr is empty for some reason.
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            const newCard: Card = { // EDITED INNER CARD
                ...localTempCard,
                title: cardTitle,
                description: cardDescription as unknown as string,
            }
            //const _prevOuterCard: Card = _popFromTempCardsArray();
            let _prevOuterCard: Card = localTempCardsArray.pop() as unknown as Card;
            console.log("addInnerCard _prevOuterCard", _prevOuterCard)
            const updatedInnerCardsList = _prevOuterCard?.innerCards?.map((card: Card) => card?.id === newCard?.id ? newCard : card)
            console.log("updatedInnerCardsList", updatedInnerCardsList)
            const ntCard: Card = { // Previous Outer Card
                ..._prevOuterCard,
                innerCards: updatedInnerCardsList,
            }
            console.log("ntCard", ntCard);
            setEditorText(ntCard.description);
            event.target.title.value = ntCard.title;
            editorRef.current?.setMarkdown(ntCard.description);
            setTempCard(ntCard);
            setTempCardsArr(localTempCardsArray);
            console.log("addInnerCard", "NEW TEMPCARD", ntCard);
            event.target.reset();
        }
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
                createCardForm={createCardForm}
                updateListTitle={updateListTitle}
                handleInputChange={handleInputChange}
                handleAddList={handleAddList}
                handleAddInput={handleAddInput}
                handleRemoveList={handleRemoveList}
                handleRemoveInput={handleRemoveInput}
                handleToggleCheckbox={handleToggleCheckbox}
                isEdition={isEdition}
                addNewTag={handleAddTag}
                removeCurrentTag={removeCurrentTag}
                cardDate={cardDate}
                setCardDate={setCardDate}
                editorText={editorText}
                setEditorText={editEditorText}
                ref={editorRef}
                addCustomField={handleAddCustomField}
                addInnerCard={addInnerCard}
                createInnerCard={createInnerCard}
                tempCardsArr={tempCardsArr}
                isCreatingInnerCard={isCreatingInnerCard}
                setIsCreatingInnerCard={setIsCreatingInnerCard}
                isEdittingInnerCard={isEdittingInnerCard}
                setIsEdittingInnerCard={setIsEdittingInnerCard}
                _appendToTempCardsArray={_appendToTempCardsArray}
                _popFromTempCardsArray={_popFromTempCardsArray}
                setModalOptions={setModalOptions}
                setModalOpen={setModalOpen}
                setModalDescription={setModalDescription}
                setModalFocusRef={setModalFocusRef}
                setModalBorderColor={setModalBorderColor}
                setModalTitle={setModalTitle}
                setModalText={setModalText}
            />
            <div className="flex justify-between items-center w-full px-2">
                <h1>{params.id}</h1>
                <Link href={`/dashboard/config/board/${params.id}`}><Cog6ToothIcon className='aspect-square w-8 hover:rotate-180 transition-all rotate-0' /></Link>
            </div>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="flex flex-row justify-start items-start gap-x-2 w-full h-[95%] overflow-auto shrink-0">
                    <SortableContext items={columnsId}>
                        {kanbanData.columns?.map((col: Column) => <ColumnContainer
                            createCard={createCard}
                            deleteCard={deleteCard}
                            updateColumnTitle={updateColumnTitle}
                            key={col.id}
                            column={col}
                            deleteColumn={removeColumn}
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
                    <button className='w-64 h-full rounded-md shadow-inner bg-[#F0F0F0] border-neutral-200 border-[1px] flex flex-col justify-center items-center' onClick={createNewColumn}>
                        <h1 className='mb-2'>Add Column</h1>
                        <PlusCircleIcon className='w-8 aspect-square' />
                    </button>
                </div>
                {createPortal(
                    <DragOverlay className='w-full h-full'>
                        {activeColumn && <ColumnContainer
                            deleteCard={deleteCard}
                            createCard={createCard}
                            updateColumnTitle={updateColumnTitle}
                            column={activeColumn}
                            deleteColumn={removeColumn}
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

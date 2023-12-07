"use client";

/* ==========================================================================================

BUG:
    The outer card is being assigned as a inner card of the inner card, breaking the system.

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
    MinusCircleIcon,
    PlusCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { CalendarDaysIcon, XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { HexColorPicker } from "react-colorful";
import {
    CardElementProps,
    ColumnContainerProps,
    ConfirmDeleteProps,
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
    Tag
} from '@/app/types/KanbanTypes';
import { generateRandomString } from '@/app/utils/generators';
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

function ConfirmDelete(props: ConfirmDeleteProps) {
    return (
        <div className={(props.showPrompt ? 'block' : 'hidden') + ' absolute z-50 top-0 left-0 w-screen h-screen flex justify-center items-center'}>
            <div className='bg-neutral-50 drop-shadow-lg rounded-md p-4 flex justify-center items-center flex-col'>
                <h1 className='mb-4'>{props.message}</h1>
                <div className='m-2'>
                    <button type="button" onClick={props.yesFunction} className='mx-2 p-2 rounded-md border-neutral-950 border-2 bg-neutral-50 text-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 transition-all'>{props.yesText}</button>
                    <button type="button" onClick={props.noFunction} className='mx-2 p-2 rounded-md border-red-600 border-2 bg-neutral-50 text-red-600 hover:bg-red-600 hover:text-neutral-950 transition-all'>{props.noText}</button>
                </div>
            </div>
        </div>
    );
}

const RichEditor = forwardRef((props: RichEditorProps, ref: Ref<MDXEditorMethods> | undefined) => {
    return (
        <MDXEditor
            className={"MDXEditor " + (props.display ? "block" : "hidden")}
            onChange={props.onChange}
            markdown={props.markdown != undefined ? props?.markdown : ""}
            ref={ref}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                tablePlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <UndoRedo />
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <InsertTable />
                            <ListsToggle />
                            <CreateLink />
                        </>
                    )
                }),
            ]}

        />
    );
});
RichEditor.displayName = "RichEditor";

function InnerCardElemnt(props: InnerCardElementProps) {
    const {
        card,
        addInnerCard,
        createInnerCard,
        tempCardsArr,
        isCreatingInnerCard,
        setIsCreatingInnerCard,
        setIsEdittingInnerCard,
        isEdittingInnerCard,
        _appendToTempCardsArray,
        _popFromTempCardsArray,
    } = props;

    const handleEditCard = () => {
        console.log("editing inner card", card);
        setIsEdittingInnerCard(true);
        _appendToTempCardsArray(card);
    }

    return (
        <button type='submit' className='mx-2 bg-neutral-50 drop-shadow rounded-md relative' onClick={handleEditCard}>
            <div className='p-2 w-full h-full'>
                <h1 className='font-black font-lg truncate'>{card.title}</h1>
            </div>
        </button>
    );

}

function CardElement(props: CardElementProps) {
    const {
        card,
        deleteCard,
        setShowCreateCardForm,
        setTempCard,
        setIsEdition,
        setTempColumnID,
        setEditorText,
        setViewConfirmDelete,
        setConfirmDeleteNoText,
        setConfirmDeleteMessage,
        setConfirmDeleteYesText,
        setConfirmDeleteNoFunction,
        setConfirmDeleteYesFunction,
    } = props;
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

    const editCard = () => {
        setTempCard(card as Card);
        setTempColumnID(card.columnID);
        setEditorText(card.description);
        setIsEdition(true);
        setShowCreateCardForm(true);
    }

    const delCard = () => {
        deleteCard(card.columnID, card.id);
        setViewConfirmDelete(false);
    }

    const hideConfirmDelete = () => {
        console.log("HIDE CONFIRM DELETE");
        setViewConfirmDelete(false);
    }

    const showConfirmDelete = () => {
        console.log("SHOW CONFIRM DELETE");
        setViewConfirmDelete(true);
    }

    const handleDeleteCard = () => {
        setConfirmDeleteNoFunction(() => { return hideConfirmDelete });
        setConfirmDeleteYesFunction(() => { return delCard });
        setConfirmDeleteMessage("Deseja remover o card?");
        setConfirmDeleteYesText("Sim");
        setConfirmDeleteNoText("Não");
        showConfirmDelete();
    };

    return (
        <div className='my-2 bg-neutral-50 drop-shadow rounded-md relative'
            ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className='p-2 w-full h-full' onClick={editCard}>
                <h1 className='font-black font-lg truncate'>{card.title}</h1>
            </div>
            <button className='absolute top-2 right-2' onClick={handleDeleteCard}>
                <XCircleIcon className='w-6 aspect-square' />
            </button>
        </div>
    );
}

function ColumnContainer(props: ColumnContainerProps) {
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
        setViewConfirmDelete,
        setConfirmDeleteNoText,
        setConfirmDeleteMessage,
        setConfirmDeleteYesText,
        setConfirmDeleteNoFunction,
        setConfirmDeleteYesFunction,
    } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const cardsIds = useMemo(() => { return column.cardsList.map((card: Card) => card.id) }, [column]);

    const delCol = () => {
        deleteColumn(column.id);
        setViewConfirmDelete(false);
    }

    const hideConfirmDelete = () => {
        console.log("HIDE CONFIRM DELETE");
        setViewConfirmDelete(false);
    }

    const showConfirmDelete = () => {
        console.log("SHOW CONFIRM DELETE");
        setViewConfirmDelete(true);
    }

    const handleDeleteColumn = () => {
        setConfirmDeleteNoFunction(() => { return hideConfirmDelete });
        setConfirmDeleteYesFunction(() => { return delCol });
        setConfirmDeleteMessage("Deseja remover a coluna?");
        setConfirmDeleteYesText("Sim");
        setConfirmDeleteNoText("Não");
        showConfirmDelete();
    };

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

    return (
        <div className='relative w-64 h-full overflow-auto p-1'
            ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <div className='w-full bg-neutral-50 rounded-md drop-shadow p-2 mb-4 flex flex-row justify-between items-center'>
                <div
                    onClick={() => setEditMode(true)}>
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
                            setConfirmDeleteMessage={props.setConfirmDeleteMessage}
                            setConfirmDeleteYesText={props.setConfirmDeleteYesText}
                            setConfirmDeleteNoText={props.setConfirmDeleteNoText}
                            setConfirmDeleteYesFunction={props.setConfirmDeleteYesFunction}
                            setConfirmDeleteNoFunction={props.setConfirmDeleteNoFunction}
                            setViewConfirmDelete={props.setViewConfirmDelete}
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



const CreateEditCard = forwardRef((props: CreateEditCardProps, ref: Ref<MDXEditorMethods> | undefined) => {
    const { setShowCreateCardForm,
        showCreateCardForm,
        createCardForm,
        card,
        handleAddList,
        handleRemoveInput,
        handleRemoveList,
        updateListTitle,
        handleAddInput,
        handleInputChange,
        handleToggleCheckbox,
        isEdition,
        addNewTag,
        removeCurrentTag,
        //cardDate,
        //setCardDate,
        editorText,
        setEditorText,
        addCustomField,
        addInnerCard,
        createInnerCard,
        tempCardsArr,
        isCreatingInnerCard,
        setIsCreatingInnerCard,
        setIsEdittingInnerCard,
        isEdittingInnerCard,
        _appendToTempCardsArray,
        _popFromTempCardsArray,
    } = props;



    const [color, setColor] = useState<string>("#aabbcc");
    const [viewAddTag, setViewAddTag] = useState<boolean>(false);
    const [viewAddMember, setViewAddMember] = useState<boolean>(false);
    const [viewAddDate, setViewAddDate] = useState<boolean>(false);
    const [viewAddField, setViewAddField] = useState<boolean>(false);
    const [viewMoveCard, setViewMoveCard] = useState<boolean>(false);
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [textFieldValue, setTextFieldValue] = useState<string>("");
    const [numberFieldValue, setNumberFieldValue] = useState<number>(0);
    const [customFieldsData, setCustomFieldsData] = useState<{ [key: string]: string | number }>({});
    const [members, setMembers] = useState<Member[]>([]);
    const [dashboards, setDashboards] = useState<{ kanbanId: string, name: string }[]>([
        { kanbanId: "wwepLJuRkq-VxFtGrcbC8-RQ5vDvohgN", name: "Test" },
        { kanbanId: "FZnHPlm7ni-ckiACczVhu-Oe4LoyQj30", name: "Example" },
    ]);
    useEffect(() => {
        fetch("http://localhost:8080/api/dashboard/kanban/getall").then(response => response.json()).then(data => setDashboards(data))
    }, [setDashboards]);


    const [selected, setSelected] = useState(members[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? members
            : members.filter((person: any) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })



    const handleCreateCardForm = (event: any) => {
        const clickedButton = event.nativeEvent.submitter;
        if (isCreatingInnerCard || clickedButton.id === "innerCard") {
            console.log(`SUBMIT CRETING INNER CARD START ${tempCardsArr.length}`, tempCardsArr)
            createInnerCard(event, isEdittingInnerCard);
            console.log(`SUBMIT CRETING INNER CARD END ${tempCardsArr.length}`, tempCardsArr)
        } else {
            if (tempCardsArr.length > 0) {
                console.log(`SUBMIT ADDING INNER CARD START ${tempCardsArr.length}`, tempCardsArr)
                addInnerCard(event, isEdittingInnerCard);
                console.log(`SUBMIT ADDING INNER CARD END ${tempCardsArr.length}`, tempCardsArr)
            } else {
                console.log(`SUBMIT CRETING FINAL CARD START ${tempCardsArr.length}`, tempCardsArr)
                createCardForm(event, isEdition);
                console.log(`SUBMIT CRETING FINAL CARD END ${tempCardsArr.length}`, tempCardsArr)
            }
        }

    }

    const handleCustomFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    const createNewTag = (event: any) => {
        event.preventDefault();
        const tagTitle: string = event?.target?.title?.value;
        addNewTag(tagTitle, color);
        event.target.reset();
        setViewAddTag(false);
        setColor("#aabbcc");
    }

    const createNewCustomField = (event: any) => {
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

    const closeCalendar = (e: any) => {
        e.preventDefault();
        setViewAddDate(false);
        e.target.reset();
    }

    const closeMoveCard = (e: any) => {
        e.preventDefault();
        setViewMoveCard(false);
        e.target.reset();
    }

    const closeAddMember = (e: any) => {
        e.preventDefault();
        setViewAddMember(false);
        e.target.reset();
    }

    const handleCreateInnerCard = () => {
        console.log(`BUTTON PUSH CREATE INNER CARD ${tempCardsArr.length}`, tempCardsArr);
        setIsCreatingInnerCard(true);
    }

    return (
        <div className={(showCreateCardForm ? 'flex ' : 'hidden ') + 'absolute top-0 left-0 w-screen h-screen z-20 justify-center items-center bg-neutral-950/25'}>
            <div className='relative w-[80%] h-[80%] bg-neutral-50 rounded-lg flex justify-center items-start px-8 drop-shadow-lg'>
                <h1 className='absolute top-2 w-full text-center'>Card Creation</h1>
                <form onSubmit={handleCreateCardForm} className='w-full h-full flex justify-center items-center mt-8 relative'>
                    <div className='w-[80%] h-[85%] relative'>
                        <div className='w-full h-[85%] overflow-y-auto pb-4'>
                            <div className='flex my-2'>
                                <input className='font-bold text-xl form-input bg-neutral-50 w-full border-none outline-none p-1 m-1 rounded-md' id="CardTitle" type='text' defaultValue={card.title} name='title' placeholder='Digite um titulo' />
                            </div>
                            <RichEditor markdown={card?.description} onChange={console.log} getMarkdown={setEditorText} ref={ref} display={showCreateCardForm} />
                            <div className='p-2 grid grid-cols-4 auto-rows-auto gap-2'>
                                {card?.customFields?.map((item: CustomFields, idx: any) => {
                                    console.log("MAP LOOP", item?.fieldType);
                                    if (item?.fieldType === "text") {
                                        return (
                                            <div key={idx} className='w-24 flex justify-center items-center'>
                                                <h1 className='mr-1'>{item?.name}:</h1>
                                                <input className='w-32 bg-neutral-50 border-none outline-none' type='text' name={item?.name} defaultValue={item?.value} onChange={handleCustomFieldChange} placeholder='Digite um valor' />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={idx} className='w-24 flex justify-center items-center'>
                                                <h1 className='mr-1'>{item?.name}:</h1>
                                                <input className='w-32 bg-neutral-50 border-none outline-none' type='number' name={item?.name} defaultValue={item?.value} onChange={handleCustomFieldChange} placeholder='Digite um valor' />
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            <div className='grid p-2 grid-cols-6 auto-rows-auto gap-2 overflow-auto h-20'>
                                {card.tags?.map((items: Tag) => (
                                    <div key={items?.id} className='w-fit h-fit py-1 pr-2 pl-1 rounded-md flex justify-center items-center drop-shadow-md transition-all' style={{ backgroundColor: items?.color } as CSSProperties}>
                                        <button type='button' onClick={() => removeCurrentTag(items?.id)}><XMarkIcon className='aspect-square w-4' /></button>
                                        <h1 style={{ backgroundColor: items?.color } as CSSProperties} className='ml-1'>{items?.title}</h1>
                                    </div>
                                ))}
                            </div>
                            <div className='p-1'>
                                {card.checklists?.map((list: CheckList, listIndex: number) => (
                                    <div key={listIndex} className='rounded-md bg-neutral-50 drop-shadow-md p-2 w-96 h-fit my-2'>
                                        <div className='flex items-center mb-4'>
                                            <input type='text'
                                                className='form-input border-none shrink-0 mr-2 p-0.5 bg-neutral-50 outline-none w-80'
                                                placeholder='Digite um nome' onChange={(e) => updateListTitle(listIndex, e.target.value)} />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveList(listIndex)}
                                            >
                                                <MinusCircleIcon className='w-6 aspect-square' />
                                            </button>
                                        </div>



                                        {list.items?.map((inputValue: CheckListItem, inputIndex: number) => (
                                            <div key={inputIndex} className='flex items-center my-2'>
                                                <input
                                                    type="checkbox"
                                                    checked={inputValue.completed}
                                                    onChange={() => handleToggleCheckbox(listIndex, inputIndex)}
                                                    className="bg-blue-100 border-blue-200 rounded-full focus:ring-blue-300 form-checkbox mr-2"
                                                />
                                                <input
                                                    className='form-input shadow-inner border-neutral-200 border-[1px] rounded-md bg-neutral-100 mr-2 p-0.5 w-64'
                                                    type="text"
                                                    value={inputValue.name}
                                                    placeholder='Adicionar Tarefa'
                                                    onChange={(e) =>
                                                        handleInputChange(listIndex, inputIndex, e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInput(listIndex, inputIndex)}
                                                >
                                                    <MinusCircleIcon className='w-6 aspect-square' />
                                                </button>
                                                <button className='mx-2'>
                                                    <CalendarDaysIcon className='aspect-square w-6' />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" className="flex items-center justify-center w-full" onClick={() => handleAddInput(listIndex)}>
                                            <h1 className='mr-2'>Nova Tarefa</h1>
                                            <PlusCircleIcon className='w-6 aspect-square' />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddList} className='bg-neutral-50 my-2 rounded-md w-96 p-2 drop-shadow flex justify-center items-center'>
                                    <h1 className="mr-2">Nova Lista</h1>
                                    <PlusCircleIcon className='w-6 aspect-square' />
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            {card?.innerCards?.map((card: Card, idx: number) => (
                                <InnerCardElemnt
                                    key={idx}
                                    card={card}
                                    tempCardsArr={tempCardsArr}
                                    _appendToTempCardsArray={_appendToTempCardsArray}
                                    _popFromTempCardsArray={_popFromTempCardsArray}
                                    addInnerCard={addInnerCard}
                                    createInnerCard={createInnerCard}
                                    isCreatingInnerCard={isCreatingInnerCard}
                                    setIsCreatingInnerCard={setIsCreatingInnerCard}
                                    setIsEdittingInnerCard={setIsEdittingInnerCard}
                                    isEdittingInnerCard={isEdittingInnerCard}

                                />
                            ))}
                        </div>
                    </div>
                    <div className='w-56 ml-4 flex flex-col items-center justify-start h-[75%] relative'>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={() => setViewAddTag(!viewAddTag)}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Tag</h1>
                        </button>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={() => setViewAddMember(!viewAddMember)}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Member</h1>
                        </button>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={() => setViewAddDate(!viewAddDate)}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Date</h1>
                        </button>

                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={() => setViewAddField(!viewAddField)}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Field</h1>
                        </button>

                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={() => setViewMoveCard(!viewMoveCard)}>
                            <ArrowUpOnSquareIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Move Card</h1>
                        </button>
                        <button type="submit" className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative'
                            onClick={handleCreateInnerCard} id='innerCard'>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Card</h1>
                        </button>
                    </div>
                    <div className='w-full absolute bottom-0 flex justify-center items-center'>
                        <button id="outerCard" type='submit' className='w-fit p-2 rounded-md bg-neutral-50 drop-shadow'>Create Card</button>
                    </div>
                </form>
                <div className='ml-4 flex flex-col items-center justify-start h-[75%] relative'>
                    <div className={(viewAddMember ? 'flex' : 'hidden') + ' absolute -left-56 top-28 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
                        <form onSubmit={closeAddMember}>
                            <Combobox value={selected} onChange={setSelected}>
                                <div className="relative mt-1">
                                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                        <Combobox.Input
                                            className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                            displayValue={(person: any) => person.name}
                                            onChange={(event: any) => setQuery(event.target.value)}
                                        />
                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </Combobox.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => setQuery('')}
                                    >
                                        <Combobox.Options className="form-select absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {filteredPeople.length === 0 && query !== '' ? (
                                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                    Nothing found.
                                                </div>
                                            ) : (
                                                filteredPeople.map((person: any) => (
                                                    <Combobox.Option
                                                        key={person.id}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={person}
                                                    >
                                                        {({ selected, active }: any) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {person.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-teal-600' : 'text-teal-600'
                                                                            }`}
                                                                    >
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>
                            </Combobox>

                            <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Close</button>
                        </form>
                    </div>

                    <div className={(viewAddDate ? 'flex' : 'hidden') + ' absolute -left-56 top-44 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
                        <form onSubmit={closeCalendar}>
                            <Calendar value={cardDate} onChange={setCardDate} />
                            <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Close</button>
                        </form>
                    </div>

                    <div className={(viewAddField ? 'flex' : 'hidden') + ' absolute  -left-56 top-56 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
                        <form onSubmit={createNewCustomField} className='flex flex-col items-center'>
                            <input type='text' name='fieldTitle' placeholder='Field Name' className='bg-neutral-50 border-none outline-none' />
                            <select name='fieldType' className='bg-neutral-50 border-none outline-none w-full'>
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                            </select>
                            <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Add Field</button>
                        </form>
                    </div>

                    <div className={(viewMoveCard ? 'flex' : 'hidden') + ' absolute  -left-56 top-72 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
                        <form onSubmit={closeMoveCard} className='flex flex-col items-center'>
                            <select name='fieldType' className='bg-neutral-50 border-none outline-none w-full'>
                                {dashboards?.map((kanban: { kanbanId: string, name: string }) => {
                                    return <option value={kanban?.kanbanId} key={kanban?.kanbanId}>{kanban?.name}</option>;
                                })}
                            </select>
                            <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Add Field</button>
                        </form>
                    </div>

                    <div className={(viewAddTag ? 'flex' : 'hidden') + ' absolute -left-56 top-14 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
                        <form onSubmit={createNewTag}>
                            <input type='text' name='title' placeholder='Nome da Etiqueta' className='form-input bg-neutral-100 w-48 border-[1px] border-neutral-200 rounded-md p-1 shadow-inner my-2' />
                            <HexColorPicker color={color} onChange={setColor} className='my-2' />
                            <button type='submit' className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Criar</button>
                        </form>
                    </div>
                </div>

                <button onClick={() => setShowCreateCardForm(false)}><XCircleIcon className='w-8 aspect-square absolute top-2 right-2' /></button>
            </div>
        </div>
    );
});

CreateEditCard.displayName = "CreateEditCard";

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
    const [tempColumnID, setTempColumnID] = useState<string>("");
    const [lists, setLists] = useState([{ title: 'New List', inputs: [{ name: '', checked: false }], id: generateRandomString() }]);
    const [tempCard, setTempCard] = useState<any>({});
    const [isEdition, setIsEdition] = useState<boolean>(false);
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [editorText, setEditorText] = useState<string>("");
    const [confirmDeleteYesFunc, setConfirmDeleteYesFunc] = useState<any>(null);
    const [confirmDeleteNoFunc, setConfirmDeleteNoFunc] = useState<any>(null);
    const [confirmDeleteYesText, setConfirmDeleteYesText] = useState<string>("");
    const [confirmDeleteNoText, setConfirmDeleteNoText] = useState<string>("");
    const [viewConfirmDelete, setViewConfirmDelete] = useState<boolean>(false);
    const [confirmDeleteText, setConfirmDeleteText] = useState<string>("");
    const [tempCardsArr, setTempCardsArr] = useState<Card[]>([]);
    const [isCreatingInnerCard, setIsCreatingInnerCard] = useState<boolean>(false);
    const [isEdittingInnerCard, setIsEdittingInnerCard] = useState<boolean>(false);


    const editorRef = useRef<MDXEditorMethods>(null);


    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,  // 2px
        }
    }));

    useEffect(() => {
        fetch(`http://localhost:8080/api/dashboard/column/getall/${params.id}`).then(response => response.json()).then(data => {

        })
    }, [params.id]);


    const createNewColumn = () => {
        if (kanbanData.columns !== undefined) {
            const newColumn = {
                id: generateRandomString(),
                type: 0,
                title: `Column ${kanbanData.columns.length}`,
                cardsList: [],
            };

            setKanbanData((prevData: KanbanData) => ({
                ...prevData,
                columns: [...prevData.columns, newColumn],
            }));
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    columnId: newColumn.id,
                    title: newColumn.title,
                    columnType: newColumn.type,
                    kanbanId: params.id,
                }),
            };

            fetch(`http://localhost:8080/api/dashboard/column/create/${params.id}`, requestOptions).then(response => response.json).then(data => console.log(data))
        } else {
            const newColumn = {
                id: generateRandomString(),
                type: 0,
                title: 'Column 0',
                cardsList: [],
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: newColumn.id,
                    title: newColumn.title,
                    columnType: newColumn.type,
                    kanbanId: params.id,
                }),
            };

            fetch(`http://localhost:8080/api/dashboard/column/create/${params.id}`, requestOptions).then(response => response.json).then(data => console.log(data))

            setKanbanData((prevData: KanbanData) => ({
                ...prevData,
                columns: [newColumn],
            }));
        }
    }

    const removeColumn = (columnIDToRemove: string) => {
        const updatedColumns = kanbanData.columns.filter(
            (column: Column) => column.id !== columnIDToRemove
        );

        // Update the Kanban data state with the updated columns array
        setKanbanData((prevData: KanbanData) => ({
            ...prevData,
            columns: updatedColumns,
        }));
    }


    const onDragStart = (event: DragStartEvent) => {
        //console.log("DRAG START", event);
        setTempDragState(event);

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

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) return;

        const activeColumnID = active.id;
        const overColumnID = over.id;
        if (activeColumnID === overColumnID) return;

        //console.log("ON DRAG END EVENT", event);
        if (active.data.current?.type === "COLUMN") {
            //console.log("ACTIVE COLUMN");
            setKanbanData((prevKanbanData: KanbanData) => {
                const activeColumnIndex = prevKanbanData.columns.findIndex((col: Column) => col?.id === activeColumnID);
                const overColumnIndex = prevKanbanData.columns.findIndex((col: Column) => col?.id === overColumnID);
                const newColumnsArray: Column[] = arrayMove(prevKanbanData.columns, activeColumnIndex, overColumnIndex);

                return {
                    ...prevKanbanData,
                    columns: newColumnsArray,
                };
            });
        } else {
            //console.log("ACTIVE CARD", active.data.current?.type);
            if (over.data.current?.type === "COLUMN") {
                //console.log("OVER COLUMN");
                setKanbanData((prevKanbanData: KanbanData) => {
                    // Drop on other column
                    const cardEl: Card = active.data.current?.card;
                    const destCol: Column = over.data.current?.column;
                    const srcCol: Column | undefined = prevKanbanData.columns.find((col: Column) => col?.id === active.data.current?.card.columnID);
                    if (!srcCol) return;

                    const updatedCardsList = srcCol.cardsList.filter((card) => card.id !== cardEl.id);

                    const updatedColumn = {
                        ...srcCol,
                        cardsList: updatedCardsList,
                    };

                    const newCard: Card = {
                        ...cardEl,
                        columnID: destCol.id,
                    }

                    const resultDestCol: Column = {
                        ...destCol,
                        cardsList: [...destCol.cardsList, newCard],
                    }

                    const updatedSrcColumns: Column[] = prevKanbanData.columns.map((column: Column) =>
                        column?.id === updatedColumn.id ? updatedColumn : column
                    );

                    const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);

                    return {
                        ...prevKanbanData,
                        columns: updatedColumns,
                    };

                    // drop on card in other column

                })
            } else if (over.data.current?.type === "CARD") {
                //console.log("OVER CARD");
                if (Object.keys(active.data.current as any).length !== 0) {
                    //console.log("CURRENT NOT EMPTY", event);
                    setKanbanData((prevKanbanData: KanbanData) => {
                        const cardEl: Card = active.data.current?.card;
                        const destCol: Column | undefined = prevKanbanData.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                        const srcCol: Column | undefined = prevKanbanData.columns.find((col: Column) => col?.id === active.data.current?.card.columnID);
                        if (!srcCol) return;
                        if (destCol === undefined) return;

                        //console.log(destCol, srcCol);
                        const updatedCardsList = srcCol.cardsList.filter((card) => card.id !== cardEl.id);

                        const updatedColumn = {
                            ...srcCol,
                            cardsList: updatedCardsList,
                        };

                        const newCard: Card = {
                            ...cardEl,
                            columnID: destCol.id,
                        }
                        const resultDestCol: Column = {
                            ...destCol,
                            cardsList: [...destCol.cardsList, newCard],
                        }

                        const updatedSrcColumns: Column[] = prevKanbanData.columns.map((column: Column) =>
                            column?.id === updatedColumn.id ? updatedColumn : column
                        );

                        const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);

                        return {
                            ...prevKanbanData,
                            columns: updatedColumns,
                        };

                    });
                } else {
                    //console.log("CURRENT EMPTY");
                    setKanbanData((prevKanbanData: KanbanData) => {
                        const tempEndDragState: DragEndEvent = tempDragState as DragEndEvent;
                        const cardEl: Card = tempEndDragState.active.data.current?.card;
                        const destCol: Column | undefined = prevKanbanData.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                        const srcCol: Column | undefined = prevKanbanData.columns.find((col: Column) => col?.id === tempEndDragState.active.data.current?.card.columnID);
                        if (!srcCol) return;
                        if (destCol === undefined) return;

                        const updatedCardsList = srcCol.cardsList.filter((card) => card.id !== cardEl.id);

                        const updatedColumn = {
                            ...srcCol,
                            cardsList: updatedCardsList,
                        };

                        const newCard: Card = {
                            ...cardEl,
                            columnID: destCol.id,
                        }
                        const resultDestCol: Column = {
                            ...destCol,
                            cardsList: [...destCol.cardsList, newCard],
                        }

                        const updatedSrcColumns: Column[] = prevKanbanData.columns.map((column: Column) =>
                            column?.id === updatedColumn.id ? updatedColumn : column
                        );

                        const updatedColumns: Column[] = updatedSrcColumns.map((col: Column) => col?.id === resultDestCol.id ? resultDestCol : col);

                        return {
                            ...prevKanbanData,
                            columns: updatedColumns,
                        };

                    });
                }
            }
        }

        //console.log("DRAG END", event);
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeID = active.id;
        const overID = over.id;
        if (activeID === overID) return;

        //console.log("DRAG OVER", event);

        const isActiveCard = active.data.current?.type === "CARD";
        const isOverCard = over.data.current?.type === "CARD";

        if (isActiveCard && isOverCard) {
            setKanbanData((prevKanbanData: KanbanData) => {
                if (active.data.current?.card.columnID === over.data.current?.card.columnID) {
                    const targetColumn = prevKanbanData.columns.find((column) => column?.id === active.data.current?.card.columnID);
                    if (!targetColumn) return prevKanbanData;

                    const activeCardIndex = targetColumn.cardsList.findIndex((card: Card) => card?.id === activeID);
                    const overCardIndex = targetColumn.cardsList.findIndex((card: Card) => card?.id === overID);

                    const newCardArray: Card[] = arrayMove(targetColumn.cardsList, activeCardIndex, overCardIndex);

                    const updatedColumn = {
                        ...targetColumn,
                        cardsList: newCardArray,
                    };

                    const updatedColumns = prevKanbanData.columns.map((column: Column) =>
                        column?.id === active.data.current?.card.columnID ? updatedColumn : column
                    );

                    return {
                        ...prevKanbanData,
                        columns: updatedColumns,
                    };
                } else {
                    const sourceColumn = prevKanbanData.columns.find((column) => column?.id === active.data.current?.card.columnID);
                    if (!sourceColumn) return prevKanbanData;
                    const destColumn = prevKanbanData.columns.find((col: Column) => col?.id === over.data.current?.card.columnID);
                    if (!destColumn) return prevKanbanData;

                    //const srcCardIndex = sourceColumn.cardsList.findIndex((card: Card) => card?.id === activeID);
                    //const destCardIndex = destColumn.cardsList.findIndex((card: Card) => card?.id === overID);

                    const updatedSourceCardsList = sourceColumn.cardsList.filter((card) => card.id !== activeID);

                    const updatedSourceColumn = {
                        ...sourceColumn,
                        cardsList: updatedSourceCardsList,
                    };

                    const updatedColumns = prevKanbanData.columns.map((column: Column) =>
                        column?.id === active.data.current?.card.columnID ? updatedSourceColumn : column
                    );

                    return {
                        ...prevKanbanData,
                        columns: updatedColumns,
                    };
                }
            });
        }

    }



    const updateColumnTitle = (columnID: string, title: string) => {
        setKanbanData((prevKanbanData: KanbanData) => {
            const newColumns: Column[] = prevKanbanData.columns.map((col: Column) => {
                if (col.id !== columnID) return col;
                return { ...col, title: title };
            })
            return {
                ...prevKanbanData,
                columns: newColumns,
            }
        })
    };

    const createCard = (columnID: string) => {
        setTempColumnID(columnID);
        setEditorText("");
        setTempCard({
            id: generateRandomString(),
            title: "",
            columnID: columnID,
            description: "",
            checklists: [],
            tags: [],
            members: [],
            comments: [],
            dropdowns: [],
            date: 0,
            customFields: [],
            innerCards: [],
        } as Card);
        setIsEdition(false);
        setShowCreateCardForm(true);
        editorRef.current?.setMarkdown("");
        console.log("CREATING CARD");
    };

    const createCardForm = (event: any, isEdition: boolean) => {
        event.preventDefault();
        const cardTitle: string = event.target.title.value;
        //const cardDescription: string = event.target.description.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        console.log("CARD TEXT", cardDescription);

        // Check if the card title is not empty before creating the card
        if (cardTitle.trim() !== "") {
            setKanbanData((prevData: KanbanData) => {
                const newCard: Card = {
                    ...tempCard,
                    title: cardTitle,
                    description: cardDescription,
                }
                const targetColumn = prevData.columns.find((column) => column?.id === tempColumnID);
                if (!targetColumn) {
                    return prevData;
                }

                if (!isEdition) {
                    console.log(`CARD ${newCard.id} CREATED.`);
                    const updatedColumn = {
                        ...targetColumn,
                        cardsList: [...targetColumn.cardsList, newCard],
                    };

                    const updatedColumns = prevData.columns.map((column) =>
                        column?.id === tempColumnID ? updatedColumn : column
                    );

                    return {
                        ...prevData,
                        columns: updatedColumns,
                    };
                } else {
                    console.log(`CARD ${newCard.id} EDITED.`);
                    const cardIndex = targetColumn.cardsList.findIndex((card: Card) => card?.id === newCard.id);
                    if (cardIndex !== -1) {
                        const updatedColumnCardList = targetColumn.cardsList.map((card: Card) => card?.id === newCard.id ? newCard : card)
                        console.log(updatedColumnCardList);
                        const updatedColumn = {
                            ...targetColumn,
                            cardsList: updatedColumnCardList,
                        };

                        const updatedColumns = prevData.columns.map((column) =>
                            column?.id === tempColumnID ? updatedColumn : column
                        );

                        return {
                            ...prevData,
                            columns: updatedColumns,
                        };
                    }
                }
            });
        }
        event.target.reset();
        setEditorText("");
        setTempColumnID("");
        setTempCard({
            id: generateRandomString(),
            title: "",
            columnID: "",
            description: "",
            checklists: [],
            tags: [],
            members: [],
            comments: [],
            dropdowns: [],
            date: 0,
            customFields: [],
            innerCards: [],
        } as Card);
        setShowCreateCardForm(false);
    };

    const deleteCard = (columnID: string, cardID: string) => {
        setKanbanData((prevData: KanbanData) => {
            const targetColumn = prevData.columns.find((column) => column?.id === columnID);
            if (!targetColumn) {
                return prevData;
            }

            const updatedCardsList = targetColumn.cardsList.filter((card) => card.id !== cardID);

            const updatedColumn = {
                ...targetColumn,
                cardsList: updatedCardsList,
            };

            const updatedColumns = prevData.columns.map((column) =>
                column?.id === columnID ? updatedColumn : column
            );

            return {
                ...prevData,
                columns: updatedColumns,
            };
        });
    };

    const handleInputChange = (listIndex: any, inputIndex: any, value: any) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].items[inputIndex].name = value;
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    };

    const updateListTitle = (listIndex: any, value: string) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].name = value;
            console.log(newChecklists[listIndex].name, listIndex);
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    }

    const handleAddList = () => {
        const checklistId = generateRandomString();
        setTempCard((prevCard: Card) => ({
            ...prevCard,
            checklists: [
                ...prevCard.checklists,
                {
                    name: '',
                    items: [{ name: '', completed: false, checklistId: checklistId }],
                    id: checklistId,
                },
            ],
        }) as Card);
    };

    const handleAddInput = (listIndex: any) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].items.push({ name: '', completed: false, checklistId: newChecklists[listIndex].id } as CheckListItem);
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    };

    const handleRemoveInput = (listIndex: any, inputIndex: any) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].items.splice(inputIndex, 1);
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    };

    const handleRemoveList = (listIndex: any) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists.splice(listIndex, 1);
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    };

    const handleToggleCheckbox = (listIndex: any, itemIndex: any) => {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].items[itemIndex].completed = !newChecklists[listIndex].items[itemIndex].completed;
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
    };

    const handleAddTag = (tagTitle: string, tagColor: string) => {
        setTempCard((prevCard: Card) => {
            const newTag: Tag = { title: tagTitle, color: tagColor, id: generateRandomString() };
            const newTagsList: Tag[] = [...prevCard.tags, newTag];
            return {
                ...prevCard,
                tags: newTagsList,
            } as Card;
        });
    }

    const removeCurrentTag = (tagID: string) => {
        setTempCard((prevCard: Card) => {
            const newTagsList: Tag[] = prevCard.tags.filter((tag: Tag) => tag.id != tagID);
            return {
                ...prevCard,
                tags: newTagsList,
            } as Card;
        });
    }

    const handleAddCustomField = (name: string, value: string | number, fieldType: "text" | "number") => {
        setTempCard((prevCard: Card) => {
            console.log(prevCard);
            if (fieldType === "text") {
                const Field: CustomFieldText = {
                    name: name,
                    value: value as string,
                    id: generateRandomString(),
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
                    id: generateRandomString(),
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

    const _appendToTempCardsArray = (newCard: Card) => {
        console.log("APPENDING", newCard, "TO", tempCardsArr);
        setTempCardsArr(prevArr => [...prevArr, newCard]);
        console.log(tempCardsArr, tempCardsArr.length);
    }

    const _popFromTempCardsArray = (): Card => {
        if (tempCardsArr.length > 0) {
            const retVal = tempCardsArr[tempCardsArr.length - 1];
            setTempCardsArr(prevArr => prevArr.slice(0, -1));
            console.log("POPPING", retVal, "FROM", tempCardsArr);
            return retVal;
        } else {
            return {} as Card;
        }
    }

    const createInnerCard = (event: any, isEdittingInnerCard: boolean) => {
        if (!isEdittingInnerCard) {
            event.preventDefault();
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            console.log("createInnerCard", "OLD CARD", cardTitle, cardDescription);
            console.log(tempCard);
            const newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription,
            }
            console.log("createInnerCard", `APPENDING A CARD TO THE TEMPS CARD ARRAY`, tempCardsArr);
            _appendToTempCardsArray(newCard);
            const tCard: Card = {
                id: generateRandomString(),
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
            setIsCreatingInnerCard(false);
            editorRef.current?.setMarkdown("");
        } else {
            const selectedInnerCard: Card = _popFromTempCardsArray();
            event.preventDefault();
            //Outer Card
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            console.log("createInnerCard", "OLD OUTER CARD", cardTitle, cardDescription);
            console.log(tempCard, selectedInnerCard);
            const newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription,
            }
            console.log("createInnerCard", `APPENDING OUTER CARD TO THE TEMPS CARD ARRAY`, tempCardsArr);
            _appendToTempCardsArray(newCard);
            //const targetCard = newCard.innerCards.findIndex((card: Card) => card?.id === tempCard.id);
            event.target.reset();
            event.target.title.value = selectedInnerCard.title;
            setEditorText(selectedInnerCard.description);
            editorRef.current?.setMarkdown(selectedInnerCard.description);
            setTempCard(selectedInnerCard);
            setIsCreatingInnerCard(false);
            setIsEdittingInnerCard(false);
        }
    }

    const addInnerCard = (event: any, _isEdittingInnerCard: boolean) => {
        if (!_isEdittingInnerCard) {
            event.preventDefault();
            console.log("_isEdittingInnerCard: FALSE", _isEdittingInnerCard);
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            console.log("addInnerCard", cardTitle, cardDescription);
            const newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription,
            }
            const _prevCard: Card = _popFromTempCardsArray();
            console.log("addInnerCard", "PREVIOUS CARD", _prevCard)
            const _nInnerCardsArr: Card[] = [..._prevCard.innerCards, newCard];
            const ntCard: Card = {
                ..._prevCard,
                innerCards: _nInnerCardsArr,
            }
            event.target.reset();
            setEditorText(ntCard.description);
            setTempCard(ntCard);
            console.log("addInnerCard", "NEW TEMPCARD", ntCard);
            editorRef.current?.setMarkdown(ntCard.description);
        } else {
            event.preventDefault();
            console.log("_isEdittingInnerCard: TRUE", _isEdittingInnerCard);
            // Inner Card
            const cardTitle: string = event.target.title.value;
            const cardDescription: string | undefined = editorRef.current?.getMarkdown();
            const newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription,
            }
            const _prevCard: Card = _popFromTempCardsArray();
            const updatedInnerCardsList = _prevCard.innerCards.map((card: Card) => card?.id === newCard.id ? newCard : card)
            const ntCard: Card = {
                ..._prevCard,
                innerCards: updatedInnerCardsList,
            }
            event.target.reset();
            setEditorText(ntCard.description);
            setTempCard(ntCard);
            console.log("addInnerCard", "NEW TEMPCARD", ntCard);
            editorRef.current?.setMarkdown(ntCard.description);
        }
    }

    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <ConfirmDelete
                message={confirmDeleteText}
                yesText={confirmDeleteYesText}
                noText={confirmDeleteNoText}
                yesFunction={confirmDeleteYesFunc}
                noFunction={confirmDeleteNoFunc}
                showPrompt={viewConfirmDelete}
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
            />
            <div className="">
                <h1>{params.id}</h1>
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
                            setConfirmDeleteMessage={setConfirmDeleteText}
                            setConfirmDeleteYesText={setConfirmDeleteYesText}
                            setConfirmDeleteNoText={setConfirmDeleteNoText}
                            setConfirmDeleteYesFunction={setConfirmDeleteYesFunc}
                            setConfirmDeleteNoFunction={setConfirmDeleteNoFunc}
                            setViewConfirmDelete={setViewConfirmDelete}
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
                            setConfirmDeleteMessage={setConfirmDeleteText}
                            setConfirmDeleteYesText={setConfirmDeleteYesText}
                            setConfirmDeleteNoText={setConfirmDeleteNoText}
                            setConfirmDeleteYesFunction={setConfirmDeleteYesFunc}
                            setConfirmDeleteNoFunction={setConfirmDeleteNoFunc}
                            setViewConfirmDelete={setViewConfirmDelete}
                        />}
                    </DragOverlay>,
                    document.body)}
            </DndContext>
        </main>
    );
}

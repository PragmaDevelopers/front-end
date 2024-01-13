import { UserContextProvider, useUserContext } from "@/app/contexts/userContext";
import { DateValue, Tag, CheckList, CheckListItem, Card, SystemID, User, Column, Kanban, userValueDT, CustomField } from "@/app/types/KanbanTypes";
import { Combobox, Transition } from "@headlessui/react";
import { XMarkIcon, MinusCircleIcon, CalendarDaysIcon, PlusCircleIcon, ArrowUpOnSquareIcon, ChevronUpDownIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { MDXEditorMethods } from "@mdxeditor/editor";
import React, { forwardRef, Ref, useRef, useState, ChangeEvent, CSSProperties, Fragment, useEffect, useContext, RefObject, ReactNode, useLayoutEffect } from "react";
import Calendar from "react-calendar";
import { HexColorPicker } from "react-colorful";
import { InnerCardElement } from "@/app/components/dashboard/InnerCard";
import RichEditor from "@/app/components/dashboard/RichEditor";
import 'react-calendar/dist/Calendar.css';
import { CommentSection } from "@/app/components/dashboard/Comment";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { AddCardDate } from "@/app/utils/dashboard/functions/Page/Card";
import { ModalContextProvider, useModalContext } from "@/app/contexts/modalContext";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { AddMember, ConfirmDeleteChecklist, ConfirmDeleteChecklistItem, ConfirmDeleteCustomField, ConfirmDeleteDeadline, ConfirmDeleteTag, CreateChecklist, CreateChecklistItem, ShowCreateCustomField, ShowCreateDeadline, ShowCreateTag } from "@/app/utils/dashboard/functions/Page/CreateEditCard";
import { get_kanban_members } from "@/app/utils/fetchs";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

function ModalCard({children}:{children:React.ReactNode}){
    return (
        <div className='absolute top-0 left-0 w-full h-full z-[99999] flex justify-center items-center bg-neutral-950/25'>
            {children}
        </div>
    )
}

interface CardTitleProps { title: string; }
function CardTitle(props: CardTitleProps) {
    const {title} = props;
    const { tempCard,setTempCard } = useKanbanContext();
    return (
        <input 
            id="CardTitle" 
            type='text' 
            defaultValue={title}
            onChange={(e)=>setTempCard({
                ...tempCard,
                title: e.target.value
            })} 
            name='title' 
            placeholder='Digite um titulo' 
            className='my-3 mx-1 font-bold text-xl form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inne w-full p-1' 
        />
    );
}

interface CardDateSectionProps {
    card: Card;
    failModalOption: any,
    noButtonRef: RefObject<HTMLButtonElement>
}
function CardDateSection(props: CardDateSectionProps) {
    const { card, failModalOption, noButtonRef } = props;

    let isDateValid = false;
    if(card.deadline != null && dayjs(card.deadline.date).isValid()){
        isDateValid = true;
    }

    const [dateExists, setDateExists] = useState(isDateValid);

    const [cardDeadline,setCardDeadline] = useState<Date>(new Date());

    const [toKanban,setToKanban] = useState<SystemID>("");

    const { userValue } = useUserContext();
    const { cardManager, setCardManager, kanbanList, tempCard, setTempCard } = useKanbanContext();
    const modalContextProps = useModalContext();

    useEffect(()=>{
        const kanban = kanbanList.find(kanban=>kanban.columns.find(column=>column.id==card.deadline.toColumnId));
        if(kanban){
            setToKanban(kanban.id);
        }
    },[])

    const handleShowCreateDeadline = () => {
        ShowCreateDeadline(
            userValue,
            setCardManager,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleDeleteDeadline = () => {
        const delDeadline = () => {
            setTempCard({...tempCard,deadline:{
                id: "",
                date: null,
                category: "",
                overdue: false,
                toColumnId: ""
            }})
            setDateExists(false);
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delDeadline,
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

        ConfirmDeleteDeadline(
            userValue,
            cardManager,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    return (
        <div>
            {
                cardManager.isShowCreateDeadline && (
                    <ModalCard>
                        <div className='flex bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'>
                            <Calendar defaultValue={cardDeadline} onChange={(date)=>{setCardDeadline(date as Date)}} />
                            <div className="flex justify-between w-full">
                                <button type='button' onClick={()=>{
                                    setDateExists(true);
                                    setCardManager({...cardManager,isShowCreateDeadline:false})
                                }} className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Adicionar</button>
                                <button type='button' onClick={()=>{
                                    setCardManager({...cardManager,isShowCreateDeadline:false})
                                }} className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Voltar</button>
                            </div>
                        </div>
                    </ModalCard>
                )
            }
            <button type="button" className={`${dateExists ? 'hidden' : 'flex'}`} onClick={handleShowCreateDeadline}>
                <PlusCircleIcon className='aspect-square w-6 mr-2' />
                Criar prazo
            </button>
            <div className={`${dateExists ? 'flex' : 'hidden'} flex-col`}>
                <div className="flex justify-between">
                    <h1 className="text-neutral-700 text-lg font-semibold my-1">
                        Prazo: {dayjs(cardDeadline).format('DD/MM/YYYY')}, tempo restante: {dayjs().to(cardDeadline)}
                    </h1>
                    <button type="button" onClick={handleDeleteDeadline}><MinusCircleIcon className='w-8 aspect-square' /></button>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col justify-center items-center w-fit">
                        <h1 className="px-4 py-2 font-semibold">Ação ao finalizar prazo:</h1>
                        <select defaultValue={card.deadline.category} className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner" onChange={(e)=>
                            setTempCard({...tempCard,deadline:{
                                ...tempCard.deadline,
                                category: e.target.value            
                            }})
                        }>
                            <option value="" disabled> -- Nenhuma -- </option>
                            <option value="MOVE_CARD">
                                Mover Card
                            </option>
                        </select>
                    </div>
                    <div className="flex flex-col justify-center items-center w-fit">
                        <h1 className="px-4 py-2 font-semibold">Dashboard de destino:</h1>
                        <select defaultValue={toKanban} className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner" onChange={(e)=>{
                            setToKanban(e.target.value);
                        }}>
                            <option value="" disabled> -- Nenhuma -- </option>
                            {kanbanList.map((kanban) => <option key={kanban.id} value={kanban.id}>{kanban.title}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center items-center w-fit">
                        <h1 className="px-4 py-2 font-semibold">Coluna de destino:</h1>
                        <select defaultValue={card.deadline.toColumnId} className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner" onChange={(e)=>{
                            setTempCard({...tempCard,deadline:{
                                ...tempCard.deadline,
                                toColumnId: e.target.value            
                            }})
                        }}>
                            <option value="" disabled> -- Nenhuma -- </option>
                            {kanbanList.filter((kanban) => kanban.id == toKanban)
                            .map((kanban) => kanban.columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CustomFieldSectionProps { 
    customFieldsArray: CustomField[];
    failModalOption: any,
    noButtonRef: RefObject<HTMLButtonElement>
}
function CustomFieldsSection(props: CustomFieldSectionProps) {

    const [managerCustomField,setManagerCustomField] = useState<{
        type: "text" | "number",
        value: string,
        name: string
    }>({
        type: "text",
        value: "",
        name: ""
    });

    const { customFieldsArray,noButtonRef,failModalOption } = props;
    const { userValue } = useUserContext();
    const { cardManager, setCardManager, tempCard, setTempCard } = useKanbanContext();
    const modalContextProps = useModalContext();

    const handleShowCreateField = () => {
        ShowCreateCustomField(
            userValue,
            setCardManager,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleDeleteCustomField = (customFieldIndex:number) => {
        const delCustomField = () => {
            const customFields = customFieldsArray;
            customFields.splice(customFieldIndex,1);
            setTempCard({...tempCard,customFields:customFields});
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delCustomField,
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

        ConfirmDeleteCustomField(
            userValue,
            cardManager,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    return (
        <div className="bg-neutral-100 border-[1px] border-neutral-100 rounded-md shadow-inner p-1 my-1">
            {
                cardManager.isShowCreateCustomField && (
                    <div className=' bg-neutral-50 p-2 mb-3 drop-shadow-md rounded-md flex-col items-center'>
                        <div className='flex flex-col items-center'>
                            <div className="flex justify-between w-full gap-3">
                                <input type="text" onChange={(e)=>{
                                    setManagerCustomField({...managerCustomField,name:e.target.value});
                                }} placeholder='Field Name' name="field_name" className='form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner w-[60%]' />
                                <select name='fieldType' onChange={(e)=>{
                                    setManagerCustomField({...managerCustomField,type:e.target.value as "text" | "number"});
                                }} className='form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner w-[40%]'>
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                </select>
                            </div>
                            <div className="flex justify-between w-full">
                                <button type='button' onClick={()=>{
                                    setTempCard({...tempCard,customFields:[
                                        ...tempCard.customFields,
                                        {
                                            id: "",
                                            fieldType: managerCustomField.type,
                                            value: "",
                                            name: managerCustomField.name
                                        }
                                    ]})
                                }} className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Adicionar Campo</button>
                                <button type='button' onClick={()=>{
                                    setCardManager({...cardManager,isShowCreateCustomField:false})
                                }} className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Voltar</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <button type='button' className={`${cardManager.isShowCreateCustomField ? 'hidden' : 'flex'} transition-all`}
                onClick={handleShowCreateField}>
                <PlusCircleIcon className='aspect-square w-6 mr-2' />
            </button>
            <div className='flex flex-col gap-2 w-full'>
                {customFieldsArray?.map((item: CustomField, idx: any) => {
                    return (
                        <div key={idx} className='w-full flex justify-center gap-3 items-center '>
                            {
                                !(item.id != "" && cardManager.isEditElseCreate) && <span className="opacity-60 ms-1">-</span>
                            }
                            <h1 className="text-nowrap">{item.name}:</h1>
                            <input required className={`bg-neutral-50 min-w-[25%] w-full form-input border-[1px] border-neutral-200 rounded-md shadow-inner`} 
                            type={item.fieldType} name={item.name} defaultValue={item.value}
                            disabled={item.id != "" && cardManager.isEditElseCreate}
                            onChange={(e)=>{
                                const customFields = customFieldsArray;
                                customFields[idx].value = e.target.value;
                                setTempCard({...tempCard,customFields:customFields});
                            }} placeholder='Digite um valor' />
                            <button type="button" onClick={()=>handleDeleteCustomField(idx)}><MinusCircleIcon className='w-8 aspect-square' /></button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface TagsSectionProps { 
    tagsArray: Tag[]; 
    failModalOption: any,
    noButtonRef: RefObject<HTMLButtonElement>
}
function TagsSection(props: TagsSectionProps) {
    const { tagsArray, failModalOption, noButtonRef } = props;

    const [managerTag,setManagerTag] = useState<Tag>({
        id: "",
        color: "#4C5C54",
        name: ""
    })

    const { userValue } = useUserContext();
    const { cardManager, setCardManager, kanbanList, tempCard, setTempCard } = useKanbanContext();
    const modalContextProps = useModalContext();

    const handleShowCreateTag = () => {
        ShowCreateTag(
            userValue,
            setCardManager,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleDeleteTag = (tagIndex:number) => {

        const delCustomField = () => {
            const tags = tagsArray;
            tags.splice(tagIndex,1);
            setTempCard({...tempCard,tags:tags});
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delCustomField,
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

        ConfirmDeleteTag(
            userValue,
            cardManager,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    return (
        <div className="bg-neutral-100 border-[1px] border-neutral-100 rounded-md shadow-inner p-1 my-1">
            {
                cardManager.isShowCreateTag && (
                    <div className='flex bg-neutral-50 p-2 drop-shadow-md flex-col rounded-md mb-1 items-center'>
                        <div className="flex items-center gap-3">
                            <input required type='text' onChange={(e)=>{
                                setManagerTag({...managerTag,name:e.target.value});
                            }} name='tag_name' placeholder='Nome da Etiqueta' className='form-input bg-neutral-100 w-48 border-[1px] border-neutral-200 rounded-md p-1 shadow-inner my-2' />
                            <HexColorPicker color={managerTag.color} onChange={(hex)=>{
                                setManagerTag({...managerTag,color:hex})
                            }} className='my-2' />
                        </div>
                        <div className="flex justify-between w-full">
                            <button type='button' onClick={()=>{
                                setTempCard({...tempCard,tags:[...tempCard.tags,{
                                    id: "",
                                    color: managerTag.color,
                                    name: managerTag.name
                                }]})
                            }} className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Criar</button>
                            <button type='button' onClick={()=>{
                                setCardManager({...cardManager,isShowCreateTag:false})
                            }} className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Voltar</button>
                        </div>
                    </div>   
                )
            }
            <button className={`${cardManager.isShowCreateTag ? 'hidden' : 'flex'} transition-all`} type='button'
                onClick={handleShowCreateTag}>
                <PlusCircleIcon className='aspect-square w-6 mr-2' />
            </button>
            <div className='gap-3 overflow-auto flex px-2'>
                {tagsArray?.map((item: Tag, index: number) => (
                    <div key={index} className='text-nowrap my-2 py-2 ps-1 pe-2 rounded-md flex justify-center items-center drop-shadow-md transition-all' style={{ backgroundColor: item?.color } as CSSProperties}>
                        <button type='button' onClick={() => {handleDeleteTag(index)}}><MinusCircleIcon className='w-6 aspect-square p-0 m-0' /></button>
                        <h1 style={{ backgroundColor: item?.color } as CSSProperties} className="p-0 m-0">{item?.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ChecklistsSectionProps {
    checklistArray: CheckList[];
    failModalOption: any;
    noButtonRef: RefObject<HTMLButtonElement>
}
function ChecklistsSection(props: ChecklistsSectionProps) {
    const { checklistArray, failModalOption, noButtonRef } = props;

    const { userValue } = useUserContext();
    const { cardManager, setCardManager, kanbanList, tempCard, setTempCard } = useKanbanContext();
    const modalContextProps = useModalContext();

    function handleCreateChecklist(){
        CreateChecklist(
            userValue,
            setTempCard,
            tempCard,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    const handleDeleteChecklist = (checklistIndex:number) => {
        const delChecklist = () => {
            const checklists = checklistArray;
            checklists.splice(checklistIndex,1);
            setTempCard({...tempCard,checklists:checklists});
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delChecklist,
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

        ConfirmDeleteChecklist(
            userValue,
            cardManager,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleCreateChecklistItem = (checklistIndex:number) => {
        CreateChecklistItem(
            userValue,
            setTempCard,
            tempCard,
            checklistIndex,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    const handleDeleteChecklistItem = (checklistIndex:number,itemIndex:number) => {
        const delChecklistItem = () => {
            const checklists = checklistArray;
            const items = checklists[checklistIndex].items;
            items.splice(itemIndex,1);
            checklists[checklistIndex].items = items;
            setTempCard({...tempCard,checklists:checklists});
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delChecklistItem,
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

        ConfirmDeleteChecklistItem(
            userValue,
            cardManager,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    return (
        <div className="bg-neutral-100 border-[1px] w-full border-neutral-100 rounded-md shadow-inner p-1 my-1 flex justify-center">
            <div className='p-1 overflow-y-auto max-h-[17.2rem] w-full'>
                {checklistArray?.map((checklist: CheckList,listIndex: number) => (
                    <div key={listIndex} className='rounded-md bg-neutral-50 drop-shadow-md p-2 w-full h-fit my-2'>
                        {
                            !(checklist.id != "" && cardManager.isEditElseCreate) && <span className="opacity-60">-</span>
                        }
                        <div className='flex items-center mb-4'>
                            <input type='text' required
                                defaultValue={checklist.name}
                                disabled={checklist.id != "" && cardManager.isEditElseCreate}
                                className={`bg-neutral-100" form-input border-[1px] border-neutral-200 rounded-md mr-2 shadow-inner w-full`}
                                placeholder='Digite o nome da lista' onChange={(e) => {
                                    const checklists = checklistArray;
                                    checklists[listIndex].name = e.target.value;
                                    setTempCard({...tempCard,checklists:checklists});
                                }} />
                            <button
                                type="button"
                                onClick={() => handleDeleteChecklist(listIndex)}
                            >
                                <MinusCircleIcon className='w-6 aspect-square' />
                            </button>
                        </div>
                        <button type="button" className="flex items-center justify-center w-full" onClick={() => handleCreateChecklistItem(listIndex)}>
                            <h1 className='mr-2'>Nova Tarefa</h1>
                            <PlusCircleIcon className='w-6 aspect-square' />
                        </button>
                        {checklist.items?.map((item: CheckListItem, itemIndex: number) => (
                            <div key={itemIndex} className='flex gap-2 w-full items-center my-2'>
                                {
                                    !(item.id != "" && cardManager.isEditElseCreate) && <span className="opacity-60">-</span>
                                }
                                <input
                                    type="checkbox"
                                    disabled={item.id != "" && cardManager.isEditElseCreate}
                                    checked={item.completed}
                                    onChange={(e) => {
                                        const checklists = checklistArray;
                                        const items = checklists[listIndex].items;
                                        items[itemIndex].completed = e.target.checked;
                                        checklists[listIndex].items = items;
                                        setTempCard({...tempCard,checklists:checklists});
                                    }}
                                    className="bg-blue-100 border-blue-200 rounded-full focus:ring-blue-300 form-checkbox"
                                />
                                <input
                                    className='form-input shadow-inner border-neutral-200 border-[1px] rounded-md bg-neutral-100 p-0.5 w-full'
                                    type="text"
                                    disabled={item.id != "" && cardManager.isEditElseCreate}
                                    value={item.name}
                                    placeholder='Digite o nome da tarefa'
                                    onChange={(e) => {
                                        const checklists = checklistArray;
                                        const items = checklists[listIndex].items;
                                        items[itemIndex].name = e.target.value;
                                        checklists[listIndex].items = items;
                                        setTempCard({...tempCard,checklists:checklists});
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteChecklistItem(listIndex, itemIndex)}
                                >
                                    <MinusCircleIcon className='w-6 aspect-square' />
                                </button>
                                {/* <button type="button" className='mx-2'>
                                    <CalendarDaysIcon className='aspect-square w-6' />
                                </button> */}
                            </div>
                        ))}
                    </div>
                ))}
                <button type="button" onClick={handleCreateChecklist} className='bg-neutral-50 my-2 rounded-md w-full p-2 drop-shadow flex justify-center items-center'>
                    <h1 className="mr-2">Nova Lista</h1>
                    <PlusCircleIcon className='w-6 aspect-square' />
                </button>
            </div>
        </div>
    );
}

interface MembersSectionProps { 
    membersList: User[]; 
    failModalOption: any;
    noButtonRef: RefObject<HTMLButtonElement>;
}
function MembersSection(props: MembersSectionProps) {
    const { membersList, failModalOption, noButtonRef } = props;

    const [selectedMember,setSelectedMember] = useState<User>();
    const [filteredUsers,setFilteredUsers] = useState<User[]>([]);

    const { userValue } = useUserContext();
    const { cardManager, setCardManager, tempKanban, tempCard, setTempCard } = useKanbanContext();
    const modalContextProps = useModalContext();

    function updateFilteredUsers(){
        const newFilteredUsers = tempKanban.members.filter(user=>{
            const isMember = membersList?.some((member:User)=>member.id==user.id);
            return !isMember;
        })
        setFilteredUsers(newFilteredUsers);
    }

    const handleShowAddMember = () => {
        AddMember(
            userValue,
            setCardManager,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    return (
        <div className="bg-neutral-100 border-[1px] border-neutral-100 rounded-md shadow-inner p-1 my-1">
            {
                cardManager.isShowAddMember && (
                    <div className='relative z-40 bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'>
                        <div>
                            <Combobox defaultValue={selectedMember} onChange={(user)=>setSelectedMember(user)}>
                                <div className="relative mt-1">
                                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                        <Combobox.Input
                                            className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                            displayValue={(user: User) => user.name}
                                        />
                                        <Combobox.Button onClick={updateFilteredUsers} className="absolute inset-y-0 right-0 flex items-center pr-2">
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
                                        afterLeave={() => {}}
                                    >
                                        <Combobox.Options className="form-select absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                            {filteredUsers.length === 0 ? (
                                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                    Nothing found.
                                                </div>
                                            ) : (
                                                filteredUsers.map((person: any) => (
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
                            <div className="flex justify-between w-full">
                            <button type='button' onClick={()=>{
                                if(selectedMember){
                                    setTempCard({...tempCard,members:[...tempCard.members,selectedMember]});
                                }
                            }} className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Adicionar</button>
                            <button type='button' onClick={()=>{
                                setCardManager({...cardManager,isShowAddMember:false});
                            }} className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Voltar</button>
                        </div>
                        </div>
                    </div>
                )
            }
            <button className={`${cardManager.isShowAddMember ? 'hidden' : 'flex'} transition-all`} type='button'
                onClick={handleShowAddMember}>
                <PlusCircleIcon className='aspect-square w-6 mr-2' />
            </button>
            <div className="flex flex-col gap-2 p-2 relative z-10 overflow-y-auto max-h-64">
                {membersList?.map((member: User, index: number) => {
                    return (
                        <div className="flex flex-col items-center bg-neutral-50 p-2 drop-shadow-md rounded-md" key={index}>
                            <button onClick={()=>{
                                membersList.splice(index,1);
                                setTempCard(tempCard);
                            }} className="text-end w-full">
                               <MinusCircleIcon className='w-6 aspect-square' />
                            </button>
                            <div>
                                <div className="w-full text-center">
                                    <h1>{member.name}</h1>
                                </div>
                                <div className="w-full text-center">
                                    <h2>{member.email}</h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface MoveCardFormProps {
    viewMoveCard: boolean;
    handleCloseMoveCard: any;
    dashboardsArray: Kanban[];
}
function MoveCardForm(props: MoveCardFormProps) {
    const { dashboardsArray, handleCloseMoveCard, viewMoveCard } = props;
    return (
        <div className={(viewMoveCard ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCloseMoveCard} className='flex flex-col items-center'>
                <select name='fieldType' className='bg-neutral-50 border-none outline-none w-full'>
                    {dashboardsArray?.map((kanban) => {
                        console.log(kanban.id)
                        return <option value={kanban?.id} key={kanban?.id}>{kanban?.title}</option>;
                    })}
                </select>
                <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Mover</button>
            </form>
        </div>
    );
}



interface InnerCardsSectionProps {
    innerCardsArray: Card[];
    tempCardsArr: Card[];
    _appendToTempCardsArray: () => void;
    _popFromTempCardsArray: () => void;
    addInnerCard: () => void;
    createInnerCard: () => void;
    isCreatingInnerCard: boolean;
    setIsCreatingInnerCard: () => void;
    setIsEdittingInnerCard: () => void;
    isEdittingInnerCard: boolean;
    handleCreateInnerCard: () => void;
    tempCard: any;
    setTempCard: any;
    setTempCardsArr: any;
}
function InnerCardSection(props: InnerCardsSectionProps) {
    const { 
        _appendToTempCardsArray,
        _popFromTempCardsArray,
        addInnerCard,
        createInnerCard,
        innerCardsArray,
        isCreatingInnerCard,
        isEdittingInnerCard,
        setIsCreatingInnerCard,
        setIsEdittingInnerCard,
        tempCardsArr,
        handleCreateInnerCard,
        tempCard,
        setTempCardsArr,
        setTempCard,
    } = props;

    return (
        <div className="bg-neutral-100 border-[1px] border-neutral-100 rounded-md shadow-inner p-1 my-1">
        <div className='flex flex-row'>
            {innerCardsArray?.map((card: Card, idx: number) => (
                <InnerCardElement
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
                    tempCard={tempCard}
                    setTempCard={setTempCard}
                    setTempCardsArr={setTempCardsArr}

                />
            ))}
            <button type="submit" className='transition-all my-2 mx-4'
                onClick={handleCreateInnerCard} id='innerCard'>
                <PlusCircleIcon className='aspect-square w-6' />
            </button>
        </div>
        </div>
    );
}

const CreateEditCard = () => {

    const modalContextProps = useModalContext();

    const { userValue } = useUserContext();
    const { tempCard, setTempCard, cardManager, setCardManager } = useKanbanContext();
    const cardDescriptionRef = useRef<MDXEditorMethods>(null);

    const [members, setMembers] = useState<User[]>([]);
    // const [dashboards, setDashboards] = useState<{ kanbanId: string, name: string }[]>([
    //     { kanbanId: "wwepLJuRkq-VxFtGrcbC8-RQ5vDvohgN", name: "Test" },
    //     { kanbanId: "FZnHPlm7ni-ckiACczVhu-Oe4LoyQj30", name: "Example" },
    // ]);
    //useEffect(() => {
    //    fetch("http://localhost:8080/api/dashboard/kanban/getall").then(response => response.json()).then(data => setDashboards(data))
    //}, [setDashboards]);


    const [selected, setSelected] = useState(members[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? members
            : members.filter((person: any) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })


    const handleCreateCardForm = (e: any) => {
        e.preventDefault();
        const description = cardDescriptionRef.current?.getMarkdown() || "";
        setTempCard({...tempCard,description:description})
    }

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
    
    const handleCreateInnerCard = () => {
        // BootstrapCreateInnerCard(
        //     userValue.profileData,
        //     noButtonRef,
        //     setIsCreatingInnerCard,
        //     tempCardsArr,
        // )
    }

    return (
        <div className={(cardManager?.isShowCreateCard ? 'flex ' : 'hidden ') + 'absolute top-0 left-0 w-screen h-screen z-[1] justify-center items-center bg-neutral-950/25'}>
            {/* <div className={`${(viewAddTag || viewAddMember || viewAddField || viewMoveCard ) ? 'flex' : 'hidden'} w-full h-full bg-neutral-950/25 absolute justify-center items-center z-[99999]`}>
                    <AddMemberForm
                        filteredPeople={filteredPeople}
                        handleCloseAddMember={handleCloseAddMember}
                        selected={selected}
                        setQuery={setQuery}
                        setSelected={setSelected}
                        viewAddMember={viewAddMember}
                        query={query}
                    />
                    
                    <AddCustomFieldForm 
                        handleCreateNewCustomField={handleCreateNewCustomField}
                        viewAddField={viewAddField}
                    />
                    <MoveCardForm 
                        dashboardsArray={kanbanList}
                        handleCloseMoveCard={handleCloseMoveCard}
                        viewMoveCard={viewMoveCard}
                    />
                    <AddTagForm 
                        color={color}
                        handleCreateNewTag={handleCreateNewTag}
                        setColor={setColor}
                        viewAddTag={viewAddTag}
                    />
                </div> */}

            <div className={`${(
                cardManager.isShowCreateDeadline 
            ) ? "overflow-hidden" : "overflow-y-auto"} overflow-x-hidden w-[80%] h-[80%] bg-neutral-50 rounded-lg px-8 drop-shadow-lg`}>
                <form className='w-full h-fit' onSubmit={handleCreateCardForm}>
                    <div className="w-full h-fit flex justify-center items-center relative">
                        <h1 className="my-2 text-center font-semibold text-xl">Card Creation</h1>
                        <button type="button" onClick={() => setCardManager({
                            ...cardManager,
                            isSubmit: false,
                            isShowCreateCard:false
                        })}><XCircleIcon className='w-8 aspect-square absolute top-2 right-2' /></button>
                    </div>
                    <CardTitle title={tempCard.title} />
                    <CardDateSection
                        card={tempCard}
                        failModalOption={failModalOption}
                        noButtonRef={noButtonRef}
                    />
                    <h1 className="my-2 font-semibold">Descrição</h1>
                    <RichEditor 
                        ref={cardDescriptionRef} 
                        markdown={tempCard.description} 
                    />
                    <h1 className="my-2 font-semibold">Campos</h1>
                    <CustomFieldsSection 
                        customFieldsArray={tempCard.customFields} 
                        failModalOption={failModalOption}
                        noButtonRef={noButtonRef}
                    />
                    
                    <h1 className="my-2 font-semibold">Etiquetas</h1>
                    <TagsSection 
                        tagsArray={tempCard.tags} 
                        failModalOption={failModalOption}
                        noButtonRef={noButtonRef}
                    />
                    <div className="flex justify-between items-center">
                        <div className="w-full mr-2">
                            <h1 className="my-2 font-semibold">Tarefas</h1>
                            <ChecklistsSection 
                                checklistArray={tempCard.checklists}
                                failModalOption={failModalOption}
                                noButtonRef={noButtonRef}
                            />
                        </div>
                        <div className="w-full ml-2">
                            <h1 className="my-2 font-semibold">Membros</h1>
                            <MembersSection 
                                membersList={tempCard.members}
                                failModalOption={failModalOption}
                                noButtonRef={noButtonRef}
                            />
                        </div>
                    </div>
                    <h1 className="my-2 font-semibold">Cartões Internos</h1>
                    {/* <InnerCardSection
                        innerCardsArray={tempCard.innerCards}
                        _appendToTempCardsArray={_appendToTempCardsArray}
                        _popFromTempCardsArray={_popFromTempCardsArray}
                        addInnerCard={addInnerCard}
                        createInnerCard={createInnerCard}
                        isCreatingInnerCard={isCreatingInnerCard}
                        isEdittingInnerCard={isEdittingInnerCard}
                        setIsCreatingInnerCard={setIsCreatingInnerCard}
                        setIsEdittingInnerCard={setIsEdittingInnerCard}
                        tempCardsArr={tempCardsArr}
                        handleCreateInnerCard={handleCreateInnerCard}
                        setTempCard={setTempCard}
                        setTempCardsArr={setTempCardsArr}
                        tempCard={tempCard}
                    /> */}
                    <div className="w-full -bottom-80 flex justify-center items-center">
                        <button 
                            className='w-fit p-2 rounded-md bg-neutral-50 drop-shadow'
                            id="outerCard" 
                            type='submit' 
                        >
                            Finalizar
                        </button> {/* button off the natural flow */}
                    </div>
                </form>
                <div className='w-full max-h-96'>
                    <h1 className="my-2 font-semibold">Comentários</h1>
                    <CommentSection 
                        commentsArray={tempCard.comments}
                        failModalOption={failModalOption}
                        noButtonRef={noButtonRef} 
                    />
                </div>
            </div>
        </div>
    );
};
CreateEditCard.displayName = "CreateEditCard";


export default CreateEditCard;

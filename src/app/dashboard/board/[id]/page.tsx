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


    const createNewColumn = () => {
        if (!isFlagSet(userValue.userData, "CRIAR_COLUNAS")) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }

        if (kanbanData.columns !== undefined) {
            let newColumn = {
                id: "",                                         /////////////////////////////////////////////////////////////////////////////
                type: 0,
                title: `Column ${kanbanData.columns.length}`,
                cardsList: [],
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
                body: JSON.stringify({
                    title: newColumn.title,
                    kanbanId: params.id,
                }),
            };

            fetch(`${API_BASE_URL}/api/private/user/kanban/column`, requestOptions).then(response => response.text()).then(data => newColumn.id = data)

            setKanbanData((prevData: KanbanData) => ({
                ...prevData,
                columns: [...prevData.columns, newColumn],
            }));
        } else {
            let newColumn = {
                id: "",                                         /////////////////////////////////////////////////////////////////////////////
                type: 0,
                title: 'Column 0',
                cardsList: [],
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
                body: JSON.stringify({
                    title: newColumn.title,
                    kanbanId: params.id,
                }),
            };
            fetch(`${API_BASE_URL}/api/private/user/kanban/column`, requestOptions).then(response => response.text()).then(data => newColumn.id = data)


            setKanbanData((prevData: KanbanData) => ({
                ...prevData,
                columns: [newColumn],
            }));
        }
    }

    const removeColumn = (columnIDToRemove: string | number) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban/column/${columnIDToRemove}`, requestOptions).then(response => response.text()).then(data => console.log(data))
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
        if (!(isFlagSet(userValue.userData, "MOVER_COLUNAS") && isFlagSet(userValue.userData, "MOVER_CARDS"))) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        } else {

            setTempDragState(event);

            if (event.active.data.current !== undefined) {
                if (event.active.data.current.type === "COLUMN") {
                    if (isFlagSet(userValue.userData, "MOVER_COLUNAS")) {
                        setActiveColumn(event.active.data.current.column);
                        return;
                    }
                    else {
                        const optAttrs: CustomModalButtonAttributes[] = [
                            {
                                text: "Entendido.",
                                onclickfunc: () => setModalOpen(false),
                                ref: noButtonRef,
                                type: "button",
                                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                            }
                        ];

                        const modalOpt: any = optAttrs.map(
                            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                        setModalTitle("Ação Negada.");
                        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                        setModalText("Fale com seu administrador se isto é um engano.");
                        setModalBorderColor("border-red-500");
                        setModalFocusRef(noButtonRef);
                        setModalOptions(modalOpt);
                        setModalOpen(true);
                        return;
                    }
                }
            }

            if (event.active.data.current !== undefined) {
                if (event.active.data.current.type === "CARD") {
                    if (isFlagSet(userValue.userData, "MOVER_CARDS")) {
                        setActiveCard(event.active.data.current.card);
                        return;
                    }
                    else {
                        const optAttrs: CustomModalButtonAttributes[] = [
                            {
                                text: "Entendido.",
                                onclickfunc: () => setModalOpen(false),
                                ref: noButtonRef,
                                type: "button",
                                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                            }
                        ];

                        const modalOpt: any = optAttrs.map(
                            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                        setModalTitle("Ação Negada.");
                        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                        setModalText("Fale com seu administrador se isto é um engano.");
                        setModalBorderColor("border-red-500");
                        setModalFocusRef(noButtonRef);
                        setModalOptions(modalOpt);
                        setModalOpen(true);
                        return;
                    }
                }
            }

            // if (event.active.data.current !== undefined) {
            //     if (event.active.data.current.type === "COLUMN") {
            //         setActiveColumn(event.active.data.current.column);
            //         return;
            //     }
            // }

            // if (event.active.data.current !== undefined) {
            //     if (event.active.data.current.type === "CARD") {
            //         setActiveCard(event.active.data.current.card);
            //         return;
            //     }
            // }
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        if (!(isFlagSet(userValue.userData, "MOVER_COLUNAS") && isFlagSet(userValue.userData, "MOVER_CARDS"))) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        } else {

            setActiveColumn(null);
            setActiveCard(null);

            const { active, over } = event;
            if (!over) return;

            const activeColumnID = active.id;
            const overColumnID = over.id;
            if (activeColumnID === overColumnID) return;

            //console.log("ON DRAG END EVENT", event);
            if (active.data.current?.type === "COLUMN") {
                if (isFlagSet(userValue.userData, "MOVER_COLUNAS")) {
                    //console.log("ACTIVE COLUMN");
                    setKanbanData((prevKanbanData: KanbanData) => {
                        const activeColumnIndex = prevKanbanData.columns.findIndex((col: Column) => col?.id === activeColumnID);
                        const overColumnIndex = prevKanbanData.columns.findIndex((col: Column) => col?.id === overColumnID);
                        const newColumnsArray: Column[] = arrayMove(prevKanbanData.columns, activeColumnIndex, overColumnIndex);

                        const requestOptions = {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
                            body: JSON.stringify({
                                "columnId": prevKanbanData.columns[activeColumnIndex].id,
                                "toIndex": overColumnIndex,
                            }),
                        };
                        fetch(`${API_BASE_URL}/api/private/user/kanban/move/column`, requestOptions).then(response => response.text()).then(data => console.log(data))


                        return {
                            ...prevKanbanData,
                            columns: newColumnsArray,
                        };
                    });
                } else {
                    const optAttrs: CustomModalButtonAttributes[] = [
                        {
                            text: "Entendido.",
                            onclickfunc: () => setModalOpen(false),
                            ref: noButtonRef,
                            type: "button",
                            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                        }
                    ];

                    const modalOpt: any = optAttrs.map(
                        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                    setModalTitle("Ação Negada.");
                    setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                    setModalText("Fale com seu administrador se isto é um engano.");
                    setModalBorderColor("border-red-500");
                    setModalFocusRef(noButtonRef);
                    setModalOptions(modalOpt);
                    setModalOpen(true);
                    return;

                }
            } else {
                //console.log("ACTIVE CARD", active.data.current?.type);

                if (isFlagSet(userValue.userData, "MOVER_COLUNAS")) {
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
                    } else {
                        const optAttrs: CustomModalButtonAttributes[] = [
                            {
                                text: "Entendido.",
                                onclickfunc: () => setModalOpen(false),
                                ref: noButtonRef,
                                type: "button",
                                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                            }
                        ];

                        const modalOpt: any = optAttrs.map(
                            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                        setModalTitle("Ação Negada.");
                        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                        setModalText("Fale com seu administrador se isto é um engano.");
                        setModalBorderColor("border-red-500");
                        setModalFocusRef(noButtonRef);
                        setModalOptions(modalOpt);
                        setModalOpen(true);
                        return;

                    }

                } else if (over.data.current?.type === "CARD") {
                    //console.log("OVER CARD");
                    if (isFlagSet(userValue.userData, "MOVER_CARDS")) {

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
                            const optAttrs: CustomModalButtonAttributes[] = [
                                {
                                    text: "Entendido.",
                                    onclickfunc: () => setModalOpen(false),
                                    ref: noButtonRef,
                                    type: "button",
                                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                                }
                            ];

                            const modalOpt: any = optAttrs.map(
                                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                            setModalTitle("Ação Negada.");
                            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                            setModalText("Fale com seu administrador se isto é um engano.");
                            setModalBorderColor("border-red-500");
                            setModalFocusRef(noButtonRef);
                            setModalOptions(modalOpt);
                            setModalOpen(true);
                            return;

                        }

                    } else {
                        //console.log("CURRENT EMPTY");
                        if (isFlagSet(userValue.userData, "MOVER_CARDS")) {
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
                        } else {
                            const optAttrs: CustomModalButtonAttributes[] = [
                                {
                                    text: "Entendido.",
                                    onclickfunc: () => setModalOpen(false),
                                    ref: noButtonRef,
                                    type: "button",
                                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                                }
                            ];

                            const modalOpt: any = optAttrs.map(
                                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                            setModalTitle("Ação Negada.");
                            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                            setModalText("Fale com seu administrador se isto é um engano.");
                            setModalBorderColor("border-red-500");
                            setModalFocusRef(noButtonRef);
                            setModalOptions(modalOpt);
                            setModalOpen(true);
                            return;

                        }
                    }
                }
            }

            //console.log("DRAG END", event);
        }
    }

    const onDragOver = (event: DragOverEvent) => {
        if (!(isFlagSet(userValue.userData, "MOVER_COLUNAS") && isFlagSet(userValue.userData, "MOVER_CARDS"))) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
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
                setKanbanData((prevKanbanData: KanbanData) => {
                    if (active.data.current?.card.columnID === over.data.current?.card.columnID) {
                        if (isFlagSet(userValue.userData, "MOVER_CARDS")) {

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
                            const optAttrs: CustomModalButtonAttributes[] = [
                                {
                                    text: "Entendido.",
                                    onclickfunc: () => setModalOpen(false),
                                    ref: noButtonRef,
                                    type: "button",
                                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                                }
                            ];

                            const modalOpt: any = optAttrs.map(
                                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                            setModalTitle("Ação Negada.");
                            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                            setModalText("Fale com seu administrador se isto é um engano.");
                            setModalBorderColor("border-red-500");
                            setModalFocusRef(noButtonRef);
                            setModalOptions(modalOpt);
                            setModalOpen(true);
                            return;
                        }
                    } else {
                        if (isFlagSet(userValue.userData, "MOVER_COLUNAS")) {

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
                        } else {
                            const optAttrs: CustomModalButtonAttributes[] = [
                                {
                                    text: "Entendido.",
                                    onclickfunc: () => setModalOpen(false),
                                    ref: noButtonRef,
                                    type: "button",
                                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                                }
                            ];

                            const modalOpt: any = optAttrs.map(
                                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

                            setModalTitle("Ação Negada.");
                            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
                            setModalText("Fale com seu administrador se isto é um engano.");
                            setModalBorderColor("border-red-500");
                            setModalFocusRef(noButtonRef);
                            setModalOptions(modalOpt);
                            setModalOpen(true);
                            return;
                        }
                    }
                });
            }
        }
    }

    const updateColumnTitle = (columnID: string | number, title: string) => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userValue.token}` },
            body: JSON.stringify({
                title: title,
            }),
        };

        fetch(`${API_BASE_URL}/api/private/user/kanban/column/${columnID}`, requestOptions).then(response => response.text()).then(data => console.log(data))

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

    const createCard = (columnID: string | number) => {
        if (!isFlagSet(userValue.userData, "CRIAR_CARDS")) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }

        setTempColumnID(columnID);
        setEditorText("");

        setTempCard({
            id: "",
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
            backendID: 0,
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
                let newCard: Card = {
                    ...tempCard,
                    title: cardTitle,
                    description: cardDescription,
                }
                const targetColumn = prevData.columns.find((column) => column?.id === tempColumnID);
                if (!targetColumn) {
                    return prevData;
                }

                if (!isEdition) {


                    // CheckList      Fetch [x]
                    // CheckListItem  Fetch [x]
                    // Comment        Fetch [ ]
                    // Comment Answer Fetch [ ]
                    // InnerCard      Fetch [ ]
                    // Prazo          Fetch [ ]
                    // Membro         Fetch [ ]
                    // Custom Fields  Fetch [ ]

                    /*
                    fetch();
                    fetch();
                    fetch();
                    fetch();
                    fetch();
                    fetch();
                    fetch();
                    fetch();
                    */

                    const fetchCard: any = {
                        title: newCard.title,
                        description: newCard.description,
                        //:
                    }

                    let tnCard: Card = newCard;
                    tnCard.checklists.forEach((element) => {
                        let checklistRequest = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${userValue.token}`,
                            },
                            body: JSON.stringify({ cardId: newCard.id, name: element.name }),
                        }
                        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList`, checklistRequest).then(
                            response => response.text()
                        ).then((data) => element.id = data);
                        console.log(`[INFO]\tPOST Request for CheckList [${element.name}] #${element.id} was sucessfully made.`);
                    });

                    tnCard.checklists.forEach((element: CheckList) => {
                        element.items.forEach((e: CheckListItem) => {
                            let checklistItemRequest = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userValue.token}`,
                                },
                                body: JSON.stringify({ checklistId: element.id, name: e.name }),
                            }

                            fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, checklistItemRequest).then(
                                response => response.text()
                            ).then((data) => e.id = data);
                            console.log(`[INFO]\tPOST Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
                        });

                        element.items.forEach((e: CheckListItem) => {
                            if (e.completed) {
                                let markItemAsCompletedRequest = {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${userValue.token}`,
                                    },
                                    body: JSON.stringify({ name: e.name, completed: e.completed }),
                                }
                                fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, markItemAsCompletedRequest);
                                console.log(`[INFO]\tPATCH Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
                            }

                        })
                    });


                    const cardRequestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userValue.token}`,
                        },
                        body: JSON.stringify(fetchCard),
                    };



                    // NOTE: WORKING ON. working on.
                    fetch(`${API_BASE_URL}/api/private/user/kanban/column/card`, cardRequestOptions).then(response => response.text()).then(data => newCard.id = data);
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
            id: "",                                         /////////////////////////////////////////////////////////////////////////////
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

    const deleteCard = (columnID: string | number, cardID: string | number) => {
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
        if (isFlagSet(userValue.userData, "CRIAR_CHECKLISTS") || isFlagSet(userValue.userData, "EDITAR_CHECKLISTS")) {

            setTempCard((prevCard: Card) => {
                const newChecklists = [...prevCard.checklists];
                newChecklists[listIndex].items[inputIndex].name = value;
                return {
                    ...prevCard,
                    checklists: newChecklists,
                } as Card;
            });
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    };

    const updateListTitle = (listIndex: any, value: string) => {
        if (isFlagSet(userValue.userData, "CRIAR_CHECKLISTS") || isFlagSet(userValue.userData, "EDITAR_CHECKLISTS")) {

            setTempCard((prevCard: Card) => {
                const newChecklists = [...prevCard.checklists];
                newChecklists[listIndex].name = value;
                console.log(newChecklists[listIndex].name, listIndex);
                return {
                    ...prevCard,
                    checklists: newChecklists,
                } as Card;
            });
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    }

    const handleAddList = () => {
        if (isFlagSet(userValue.userData, "CRIAR_CHECKLISTS")) {
            const checklistId = "";                                         /////////////////////////////////////////////////////////////////////////////
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
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    };

    const handleAddInput = (listIndex: any) => {
        if (isFlagSet(userValue.userData, "CRIAR_CHECKLISTS")) {

            setTempCard((prevCard: Card) => {
                const newChecklists = [...prevCard.checklists];
                newChecklists[listIndex].items.push({ name: '', completed: false, checklistId: newChecklists[listIndex].id } as CheckListItem);
                return {
                    ...prevCard,
                    checklists: newChecklists,
                } as Card;
            });

        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    };

    const handleRemoveInput = (listIndex: any, inputIndex: any) => {
        if (isFlagSet(userValue.userData, "DELETAR_CHECKLISTS")) {

            setTempCard((prevCard: Card) => {
                const newChecklists = [...prevCard.checklists];
                newChecklists[listIndex].items.splice(inputIndex, 1);
                return {
                    ...prevCard,
                    checklists: newChecklists,
                } as Card;
            });
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    };

    const handleRemoveList = (listIndex: any) => {
        if (isFlagSet(userValue.userData, "DELETAR_CHECKLISTS")) {

            setTempCard((prevCard: Card) => {
                const newChecklists = [...prevCard.checklists];
                newChecklists.splice(listIndex, 1);
                return {
                    ...prevCard,
                    checklists: newChecklists,
                } as Card;
            });
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
    };

    const handleToggleCheckbox = (listIndex: any, itemIndex: any) => {
        //if (isFlagSet(userValue.userData, "CRIAR_CHECKLISTS")) {
        setTempCard((prevCard: Card) => {
            const newChecklists = [...prevCard.checklists];
            newChecklists[listIndex].items[itemIndex].completed = !newChecklists[listIndex].items[itemIndex].completed;
            return {
                ...prevCard,
                checklists: newChecklists,
            } as Card;
        });
        /*
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        }
        */
    };

    const handleAddTag = (tagTitle: string, tagColor: string) => {
        setTempCard((prevCard: Card) => {
            const newTag: Tag = {
                title: tagTitle, color: tagColor, id: ""
            };
            const newTagsList: Tag[] = [...prevCard.tags, newTag];
            return {
                ...prevCard,
                tags: newTagsList,
            } as Card;
        });
    }

    const removeCurrentTag = (tagID: string | number) => {
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

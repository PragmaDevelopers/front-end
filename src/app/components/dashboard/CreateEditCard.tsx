import { useUserContext } from "@/app/contexts/userContext";
import { CreateEditCardProps } from "@/app/interfaces/KanbanInterfaces";
import { DateValue, Member, CustomFields, Tag, CheckList, CheckListItem, Card } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { Combobox, Transition } from "@headlessui/react";
import { XMarkIcon, MinusCircleIcon, CalendarDaysIcon, PlusCircleIcon, ArrowUpOnSquareIcon, ChevronUpDownIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { forwardRef, Ref, useRef, useState, ChangeEvent, CSSProperties, Fragment } from "react";
import Calendar from "react-calendar";
import { HexColorPicker } from "react-colorful";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { InnerCardElement } from "./InnerCard";
import RichEditor from "./RichEditor";

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

        setModalTitle,
        setModalDescription,
        setModalOptions,
        setModalOpen,
        setModalBorderColor,
        setModalFocusRef,
        setModalText,
    } = props;

    const { userValue, updateUserValue } = useUserContext();
    const noButtonRef = useRef<HTMLButtonElement>(null);

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



    const handleCreateCardForm = (event: any) => {
        const clickedButton = event.nativeEvent.submitter;
        if (isCreatingInnerCard || clickedButton.id === "innerCard") {
            console.log(`SUBMIT CRETING INNER CARD START ${tempCardsArr.length}`, tempCardsArr)
            createInnerCard(event, isEdittingInnerCard);
            console.log(`SUBMIT CRETING INNER CARD END ${tempCardsArr.length}`, tempCardsArr)
        } else {
            if (tempCardsArr.length > 0 || isEdittingInnerCard) {
                console.log(`SUBMIT ADDING INNER CARD START ${tempCardsArr.length}`, tempCardsArr)
                createInnerCard(event, isEdittingInnerCard);
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
        if (isFlagSet(userValue.userData, "CRIAR_CARDS")) {
            console.log(`BUTTON PUSH CREATE INNER CARD ${tempCardsArr}`, tempCardsArr);
            setIsCreatingInnerCard(true);
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

    const handleShowDate = () => {
        if (isFlagSet(userValue.userData, "CRIAR_PRAZOS")) {
            setViewAddDate(!viewAddDate)
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

    const handleShowField = () => {
        if (isFlagSet(userValue.userData, "CRIAR_CAMPO")) {
            setViewAddField(!viewAddField)
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

    const handleShowMember = () => {
        if (isFlagSet(userValue.userData, "CONVIDAR_PARA_O_KANBAN")) {
            setViewAddMember(!viewAddMember)
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

    const handleShowMoveCard = () => {
        if (isFlagSet(userValue.userData, "MOVER_CARDS")) {
            setViewMoveCard(!viewMoveCard)
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

                                />
                            ))}
                        </div>
                    </div>
                    <div className='w-56 ml-4 flex flex-col items-center justify-start h-[75%] relative'>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={handleShowTag}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Tag</h1>
                        </button>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={handleShowMember}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Member</h1>
                        </button>
                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={handleShowDate}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Date</h1>
                        </button>

                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={handleShowField}>
                            <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
                            <h1 className="w-fit h-fit flex justify-center items-center">Add Field</h1>
                        </button>

                        <button className='hover:scale-110 transition-all drop-shadow rounded-md p-2 bg-neutral-50 flex justify-center items-center my-2 w-48 relative' type='button'
                            onClick={handleShowMoveCard}>
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


export default CreateEditCard;

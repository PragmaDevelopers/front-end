import { useUserContext } from "@/app/contexts/userContext";
import { CreateEditCardProps } from "@/app/interfaces/KanbanInterfaces";
import { DateValue, Member, CustomFields, Tag, CheckList, CheckListItem, Card, SystemID } from "@/app/types/KanbanTypes";
import { Combobox, Transition } from "@headlessui/react";
import { XMarkIcon, MinusCircleIcon, CalendarDaysIcon, PlusCircleIcon, ArrowUpOnSquareIcon, ChevronUpDownIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { forwardRef, Ref, useRef, useState, ChangeEvent, CSSProperties, Fragment } from "react";
import Calendar from "react-calendar";
import { HexColorPicker } from "react-colorful";
import { InnerCardElement } from "@/app/components/dashboard/InnerCard";
import RichEditor from "@/app/components/dashboard/RichEditor";
import { ShowTag, ShowDate, ShowField, ShowMember, ShowMoveCard, CustomFieldChange, closeCalendar, closeMoveCard, closeAddMember, CreateInnerCard, createNewTag, createNewCustomField } from "@/app/utils/dashboard/functions/CreateEditCard";
import 'react-calendar/dist/Calendar.css';
import { CommentSection } from "@/app/components/dashboard/Comment";

interface AddMemberFormProps {
    viewAddMember: boolean;
    handleCloseAddMember: any;
    selected: any;
    setSelected: any;
    setQuery: any;
    filteredPeople: any;
    query: any;
}

function AddMemberForm(props: AddMemberFormProps) {
    const { filteredPeople, handleCloseAddMember, selected, setQuery, setSelected, viewAddMember, query } = props;
    return (
        <div className={(viewAddMember ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCloseAddMember}>
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

                <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Adicionar</button>
            </form>
        </div>
    );
}

interface AddCardDateFormProps {
    viewAddDate: boolean;
    handleCloseCalendar: any;
    cardDate: any;
    setCardDate: any;
}
function AddCardDateForm(props: AddCardDateFormProps) {
    const { cardDate, handleCloseCalendar, setCardDate, viewAddDate } = props;
    return (
        <div className={(viewAddDate ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCloseCalendar}>
                <Calendar value={cardDate} onChange={setCardDate} />
                <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Adicionar</button>
            </form>
        </div>
    );
}

interface AddCustomFieldForm {
    viewAddField: boolean;
    handleCreateNewCustomField: any;
}
function AddCustomFieldForm(props: AddCustomFieldForm) {
    const {viewAddField, handleCreateNewCustomField} = props;
    return (
        <div className={(viewAddField ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCreateNewCustomField} className='flex flex-col items-center'>
                <input type='text' name='fieldTitle' placeholder='Field Name' className='bg-neutral-50 border-none outline-none' />
                <select name='fieldType' className='bg-neutral-50 border-none outline-none w-full'>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                </select>
                <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Adicionar Campo</button>
            </form>
        </div>
    );
}

interface MoveCardFormProps {
    viewMoveCard: boolean;
    handleCloseMoveCard: any;
    dashboardsArray: { kanbanId: string, name: string }[];
}
function MoveCardForm(props: MoveCardFormProps) {
    const { dashboardsArray, handleCloseMoveCard, viewMoveCard } = props;
    return (
        <div className={(viewMoveCard ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCloseMoveCard} className='flex flex-col items-center'>
                <select name='fieldType' className='bg-neutral-50 border-none outline-none w-full'>
                    {dashboardsArray.map((kanban: { kanbanId: string, name: string }) => {
                        return <option value={kanban?.kanbanId} key={kanban?.kanbanId}>{kanban?.name}</option>;
                    })}
                </select>
                <button type='submit' className='bg-neutral-50 p-2 drop-shadow rounded-md my-2'>Mover</button>
            </form>
        </div>
    );
}

interface AddTagFormProps {
    viewAddTag: boolean;
    handleCreateNewTag: any;
    color: any;
    setColor: any;
}
function AddTagForm(props: AddTagFormProps) {
    const { color, handleCreateNewTag, setColor, viewAddTag } = props;
    return (
        <div className={(viewAddTag ? 'flex' : 'hidden') + ' bg-neutral-50 p-2 drop-shadow-md rounded-md flex-col items-center'}>
            <form onSubmit={handleCreateNewTag}>
                <input type='text' name='title' placeholder='Nome da Etiqueta' className='form-input bg-neutral-100 w-48 border-[1px] border-neutral-200 rounded-md p-1 shadow-inner my-2' />
                <HexColorPicker color={color} onChange={setColor} className='my-2' />
                <button type='submit' className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Criar</button>
            </form>
        </div>
    );
}


interface CardTitleProps { title: string; }
function CardTitle(props: CardTitleProps) {
    const {title} = props;
    return (
        <input 
            id="CardTitle" 
            type='text' 
            defaultValue={title} 
            name='title' 
            placeholder='Digite um titulo' 
            className='my-3 mx-1 font-bold text-xl form-input bg-neutral-50 w-full border-none outline-none p-1 rounded-md' 
        />
    );
}

interface CustomFieldsSectionProps { 
    customFieldsArray: CustomFields[];
    handleCustomFieldChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleShowField: () => void;
}
function CustomFieldsSection(props: CustomFieldsSectionProps) {
    const { customFieldsArray, handleCustomFieldChange, handleShowField } = props;
    return (
        <div className='p-2 grid grid-cols-4 auto-rows-auto gap-2'>
            {customFieldsArray.map((item: CustomFields, idx: any) => {
                console.log("MAP LOOP", item?.fieldType);
                if (item?.fieldType === "text") {
                    return (
                        <div key={idx} className='w-24 flex justify-center items-center'>
                            <h1 className='mr-1'>{item?.name}:</h1>
                            <input 
                            className='w-32 bg-neutral-50 border-none outline-none' 
                            type='text' name={item?.name}  defaultValue={item?.value}
                            onChange={handleCustomFieldChange} placeholder='Digite um valor' />
                        </div>
                    );
                } else {
                    return (
                        <div key={idx} className='w-24 flex justify-center items-center'>
                            <h1 className='mr-1'>{item?.name}:</h1>
                            <input 
                            className='w-32 bg-neutral-50 border-none outline-none' 
                            type='number' name={item?.name} defaultValue={item?.value} 
                            onChange={handleCustomFieldChange} placeholder='Digite um valor' />
                        </div>
                    );
                }
            })}
            <button type='button' className='transition-all'
                onClick={handleShowField}>
                <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
            </button>
        </div>
    );
}
interface TagsSectionProps { tagsArray: Tag[]; removeCurrentTag: (arg0: SystemID) => void; handleShowTag: () => void; }
function TagsSection(props: TagsSectionProps) {
    const { tagsArray, removeCurrentTag, handleShowTag } = props;
    return (
        <div className='grid p-2 grid-cols-6 auto-rows-auto gap-2 overflow-auto h-20'>
            {tagsArray.map((items: Tag) => (
                <div key={items?.id} className='w-fit h-fit py-1 pr-2 pl-1 rounded-md flex justify-center items-center drop-shadow-md transition-all' style={{ backgroundColor: items?.color } as CSSProperties}>
                    <button type='button' onClick={() => removeCurrentTag(items?.id)}><XMarkIcon className='aspect-square w-4' /></button>
                    <h1 style={{ backgroundColor: items?.color } as CSSProperties} className='ml-1'>{items?.name}</h1>
                </div>
            ))}
            <button className='transition-all' type='button'
                onClick={handleShowTag}>
                <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
            </button>
        </div>
    );
}

interface ChecklistsSectionProps {
    checklistArray: CheckList[];
    updateListTitle: (arg0: number, arg1: string) => void;
    handleRemoveList: (arg0: number) => void;
    handleToggleCheckbox: (arg0: number, arg1: number) => void;
    handleInputChange: (arg0: number, arg1: number, arg2: string) => void;
    handleRemoveInput: (arg0: number, arg1: number) => void;
    handleAddInput: (arg0: number) => void;
    handleAddList: () => void;
}
function ChecklistsSection(props: ChecklistsSectionProps) {
    const { 
        checklistArray, 
        handleAddInput, 
        handleAddList, 
        handleInputChange, 
        handleRemoveInput, 
        handleRemoveList, 
        handleToggleCheckbox, 
        updateListTitle 
    } = props;
    return (
        <div className='p-1'>
            {checklistArray.map((list: CheckList, listIndex: number) => (
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
        handleCreateInnerCard
    } = props;

    return (
        <div className='flex flex-row'>
            {innerCardsArray.map((card: Card, idx: number) => (
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
            <button type="submit" className='transition-all'
                onClick={handleCreateInnerCard} id='innerCard'>
                <PlusCircleIcon className='absolute right-2 aspect-square w-6 mr-2' />
            </button>
        </div>
    );
}

const CreateEditCard = forwardRef((props: CreateEditCardProps, ref: Ref<MDXEditorMethods> | undefined) => {
    const { 
        setShowCreateCardForm,
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


    const handleShowTag = () => {
        ShowTag(
            userValue.userData,
            setViewAddTag,
            viewAddTag,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
        )
    }
    const handleShowDate = () => {
        ShowDate(
            userValue.userData,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setViewAddDate,
            viewAddDate,
        )
    }
    const handleShowField = () => {
        ShowField(
            userValue.userData,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setViewAddField,
            viewAddField,
        )
    }
    const handleShowMember = () => {
        ShowMember(
            userValue.userData,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setViewAddMember,
            viewAddMember,
        )
    }
    const handleShowMoveCard = () => {
        ShowMoveCard(
            userValue.userData,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setViewMoveCard,
            viewMoveCard,
        )
    }
    const handleCustomFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        CustomFieldChange(
            event,
            setCustomFieldsData,
        )
    }
    const handleCreateNewTag = (event: any) => {
        createNewTag(
            event,
            setViewAddTag,
            addNewTag,
            setColor,
            color
        )
    }
    const handleCreateNewCustomField = (event: any) => {
        createNewCustomField(
            event,
            setViewAddField,
            addCustomField,
        )
    }
    const handleCloseCalendar = (e: any) => {
        closeCalendar(
            e,
            setViewAddDate
        )
    }
    const handleCloseMoveCard = (e: any) => {
        closeMoveCard(
            e,
            setViewMoveCard
        )
    }
    const handleCloseAddMember = (e: any) => {
        closeAddMember(
            e,
            setViewAddMember
        )
    }
    const handleCreateInnerCard = () => {
        CreateInnerCard(
            userValue.userData,
            setModalOpen,
            noButtonRef,
            setModalTitle,
            setModalDescription,
            setModalText,
            setModalBorderColor,
            setModalFocusRef,
            setModalOptions,
            setIsCreatingInnerCard,
            tempCardsArr,
        )
    }

    return (
        <div className={(showCreateCardForm ? 'flex ' : 'hidden ') + 'absolute top-0 left-0 w-screen h-screen z-20 justify-center items-center bg-neutral-950/25'}>
            <div className='w-[80%] h-[80%] relative bg-neutral-50 rounded-lg px-8 drop-shadow-lg overflow-y-auto'>
                <div className={`${(viewAddTag || viewAddMember || viewAddDate || viewAddField || viewMoveCard ) ? 'flex' : 'hidden'} w-full h-full absolute justify-center items-center`}>
                    <AddMemberForm
                        filteredPeople={filteredPeople}
                        handleCloseAddMember={handleCloseAddMember}
                        selected={selected}
                        setQuery={setQuery}
                        setSelected={setSelected}
                        viewAddMember={viewAddMember}
                        query={query}
                    />
                    <AddCardDateForm 
                        cardDate={cardDate}
                        handleCloseCalendar={handleCloseCalendar}
                        setCardDate={setCardDate}
                        viewAddDate={viewAddDate}
                    />
                    <AddCustomFieldForm 
                        handleCreateNewCustomField={handleCreateNewCustomField}
                        viewAddField={viewAddField}
                    />
                    <MoveCardForm 
                        dashboardsArray={dashboards}
                        handleCloseMoveCard={handleCloseMoveCard}
                        viewMoveCard={viewMoveCard}
                    />
                    <AddTagForm 
                        color={color}
                        handleCreateNewTag={handleCreateNewTag}
                        setColor={setColor}
                        viewAddTag={viewAddTag}
                    />
                </div>
                <form className='w-full h-full'>
                    <h1>Card Creation</h1>
                    <CardTitle title={card.title} />
                    <RichEditor 
                        ref={ref} 
                        onChange={console.log} 
                        getMarkdown={setEditorText} 
                        markdown={card?.description} 
                        display={showCreateCardForm}
                    />
                    <CustomFieldsSection 
                        customFieldsArray={card?.customFields} 
                        handleCustomFieldChange={handleCustomFieldChange}
                        handleShowField={handleShowField}
                    />
                    <TagsSection 
                        removeCurrentTag={removeCurrentTag} 
                        tagsArray={card.tags} 
                        handleShowTag={handleShowTag}
                    />
                    <ChecklistsSection 
                        checklistArray={card?.checklists} 
                        handleAddInput={handleAddInput}  
                        handleAddList={handleAddList} 
                        handleInputChange={handleInputChange}
                        handleRemoveInput={handleRemoveInput}
                        handleRemoveList={handleRemoveList}
                        handleToggleCheckbox={handleToggleCheckbox}
                        updateListTitle={updateListTitle}
                    />
                    <InnerCardSection
                        innerCardsArray={card?.innerCards}
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
                    />

                    <button className="absolute bottom-2">test btn</button> {/* button off the natural flow */}
                </form>
                <div className='mb-8 w-full h-60'> 
                    <CommentSection userData={userValue.userData} />
                </div>
            </div>
        </div>
    );
});
CreateEditCard.displayName = "CreateEditCard";


export default CreateEditCard;

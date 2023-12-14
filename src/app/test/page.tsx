"use client";

import { useState, Fragment, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { XCircleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ExclamationTriangleIcon, PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { DateValue } from "../types/KanbanTypes";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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
import { Combobox, Transition } from '@headlessui/react';
import { CalendarDaysIcon, XMarkIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { CustomModal, CustomModalButtonAttributes } from "../components/ui/CustomModal";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

type User = {
    name: string;
}

interface CommentEntryProps {
    user: User;
    content: string;
    date: any;
}

function CommentEntry(props: CommentEntryProps) {
    const { content, date, user } = props;

    const sinceDate: string = dayjs().to(dayjs(date));
    return (
        <div className="flex flex-col justify-start items-start w-full h-fit">
            <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-start items-center p-1">
                    <UserIcon className="w-6 aspect-square mr-2" />
                    <h1 className="font-bold text-sm">{user.name}</h1>
                </div>
                <h2 className="text-sm">{sinceDate}</h2>
            </div>
            <p className="mt-2 text-justify text-sm">
                {content}
            </p>
        </div>
    );
}

function CommentSection() {
    const newUser: User = {
        name: "Fulano da Silva"
    }

    const commentDate = dayjs('15-11-2023');
    const commentContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    const [comments, setComments] = useState<{ user: User, content: string, date: any }[]>([{ user: newUser, content: commentContent, date: commentDate }]);

    const addComment = (e: any) => {
        e.preventDefault();
        const commentcont = e.target.commentarea.value;
        setComments((prevComments) => {
            return [
                ...prevComments,
                {
                    user: newUser,
                    content: commentcont,
                    date: commentDate
                }
            ]
        });
        e.target.commentarea.value = "";
    }

    return (
        <div className="flex flex-col justify-start items-start h-fit w-[50%]">
            <div className="h-64 overflow-auto mb-1 shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2">
                {comments.map((i: { user: User, content: string, date: any }, idx: number) => <CommentEntry key={idx} user={i.user} content={i.content} date={i.date} />)}
            </div>
            <form onSubmit={addComment} className="w-full flex flex-row items-center">
                <textarea name="commentarea" className="w-full resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1" placeholder="Insira um comentário" />
                <button type="submit" className="ml-2"><PaperAirplaneIcon className="w-8 aspect-square stroke-neutral-950 hover:stroke-green-600 transition-all" /></button>
            </form>
        </div>
    );
}




export default function Page() {
    const [cardDate, setCardDate] = useState<DateValue>(new Date());
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');

    const handleSetCardDate = (value: DateValue) => {
        setCardDate(value);
        const dayjsDate = dayjs(value?.valueOf() as number);
        console.log(dayjsDate);
        console.log(dayjsDate.fromNow());
    }

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleUrlChange = (e: any) => {
        setUrl(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Handle file or URL submission
        if (file) {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            // // Send formData to the API route
            // const response = await fetch('/api/upload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // const result = await response.json();
            // console.log(result);
            console.log(formData.get('file'));
            console.log(formData.get('file')?.valueOf());
        } else if (url) {
            // // Handle URL submission
            // const response = await fetch('/api/upload?url=' + encodeURIComponent(url));
            // const result = await response.json();
            // console.log(result);
            console.log(encodeURIComponent(url));
        }
    };

    type Person = {
        id: number,
        name: string,
    }

    const people: Person[] = [
        { id: 1, name: 'Durward Reynolds' },
        { id: 2, name: 'Kenton Towne' },
        { id: 3, name: 'Therese Wunsch' },
        { id: 4, name: 'Benedict Kessler' },
        { id: 5, name: 'Katelyn Rohan' },
    ]

    const [selected, setSelected] = useState(people[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? people
            : people.filter((person) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })



    const [permsNumber, setPermsNumber] = useState<number>(0b1);

    const leftShiftValue = () => {
        const res: number = permsNumber << 4;
        setPermsNumber(res);
    }

    const rightShiftValue = () => {
        const res: number = permsNumber >> 1;
        setPermsNumber(res);
    }

    const resetValue = () => {
        setPermsNumber(1);
    }

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const closeModalRef = useRef(null);

    const optionsmeta: CustomModalButtonAttributes[] = [
        {
            text: "Sim",
            onclickfunc: () => console.log("deleted element"),
            type: "button",
            className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        },
        {
            text: "Não",
            onclickfunc: () => setIsModalOpen(false),
            ref: closeModalRef,
            type: "button",
            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
        }
    ]
    const options: any = optionsmeta.map(
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

    return (
        <main className="w-full h-full bg-neutral-50 overflow-scroll flex flex-row">
            <CustomModal
                description="Essa ação irá deletar o elemento para sempre."
                text="Tem certeza que deseja continuar?"
                title="Deletar Elemento"
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                focusRef={closeModalRef}
                options={options}
                borderColor="border-red-500"
            />
            <button onClick={() => setIsModalOpen(true)}>Toggle Modal</button>

            {/* <div>
                <div className="flex flex-col justify-center items-center p-2">
                    <h1>{permsNumber.toString(2)}</h1>
                    <div className="flex">
                        <h2 className="mr-2">{permsNumber}</h2>
                        <h2 className="ml-2">{permsNumber.toString(2).length}</h2>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <button type="button" onClick={leftShiftValue} className="mr-4">
                        <ChevronDoubleLeftIcon className="aspect-square w-8" />
                    </button>
                    <button type="button" onClick={resetValue} className="mx-4">
                        Reset
                    </button>
                    <button type="button" onClick={rightShiftValue} className="ml-4">
                        <ChevronDoubleRightIcon className="aspect-square w-8" />
                    </button>
                </div>
            </div>

            <div className="hidden ">

                <Combobox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input
                                className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(person: Person) => person.name}
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
                                    filteredPeople.map((person) => (
                                        <Combobox.Option
                                            key={person.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                                                }`
                                            }
                                            value={person}
                                        >
                                            {({ selected, active }) => (
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

            </div> */}
        </main>
    );
}

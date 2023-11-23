"use client";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/24/outline";
import { DateValue } from "../types/KanbanTypes";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

    return (
        <div className="flex flex-col justify-start items-start h-fit w-[50%]">
            <div className="h-64 overflow-auto mb-1 shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2">
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
            </div>
            <form className="w-full flex flex-row items-center">
                <textarea className="resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1" placeholder="Insira um comentário" />
                <button type="submit" className="ml-2 stroke-neutral-950 hover:stroke-green-600 transition-all"><PaperAirplaneIcon className="w-8 aspect-square" /></button>
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

    return (
        <main className="w-full h-full bg-neutral-50 overflow-scroll flex flex-row">
            <CommentSection />
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <br />
                    <input type="text" placeholder="Enter URL" value={url} onChange={handleUrlChange} />
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div>
                <Calendar value={cardDate} onChange={handleSetCardDate} />
            </div>
        </main>
    );
}

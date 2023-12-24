"use client";

import { Member } from "@/app/types/KanbanTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { BACKEND_DATE_FORMAT } from "@/app/utils/variables";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

type Comment = {
    user: Member;
    content: string;
    id: string | number;
    answers: Comment | null;
    edited: boolean;
    date: string;
}

function CommentEntry(props: Comment) {
    const { content, user, answers, date, edited, id } = props;
    const currDate = dayjs();
    const sinceDate: string = currDate.to(dayjs(date, BACKEND_DATE_FORMAT));
    return (
        <div className="flex flex-col justify-start items-start w-full h-fit p-1 my-2">
            <div className="flex justify-between items-center mb-1 w-full h-fit">
                <div className="flex flex-row justify-start items-center w-fit h-fit mr-1">
                    <Image width={64} height={64} alt="Profile" src="/84693449.png" className="w-8 aspect-square rounded-full mr-1" />
                    <h1 className="ml-2 flex font-medium text-base">{user.name}</h1>
                </div>
                <h2 className="text-sm ml-1 text-neutral-500">{sinceDate}</h2>
            </div>
            <p className="mt-1 text-justify text-sm">
                {content}
            </p>
        </div>
    );
}

function CommentSection() {
    const newUser: Member = {
        name: "Fulano da Silva",
        email: null,
        nacionalidade: null,
        password: null,
        gender: null,
        accountCreation: null,
        profilePicture: null,
        pushEmail: null,
        generalPermissions: null,
        id: null,
        role: null,
        kanban_role: null
    }
    const exampleDate: string = "2023-12-06T11:56:43.800294";
    const commentContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    const [comments, setComments] = useState<Comment[]>([{ user: newUser, content: commentContent, id: 0, edited: false, date: exampleDate, answers: null }]);

    const addComment = (e: any) => {
        e.preventDefault();
        const commentcont = e.target.commentarea.value;
        setComments((prevComments: any) => {
            let currId: number = prevComments[prevComments.length - 1].id as number + 1;
            return [
                ...prevComments,
                {
                    user: newUser,
                    content: commentcont,
                    id: currId,
                    edited: false,
                    date: dayjs().toISOString(),
                    answers: null,
                }
            ]
        });
        e.target.commentarea.value = "";
    }

    return (
        <div className="flex flex-col justify-start items-start h-full w-full">
            <div className="h-64 overflow-auto mb-1 shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 divide-y divide-neutral-300">
                {comments.map((i: Comment, idx: number) => <CommentEntry key={idx} user={i.user} content={i.content} id={i.id} answers={i.answers} edited={i.edited} date={i.date} />)}
            </div>
            <form onSubmit={addComment} className="w-full flex flex-row items-center">
                <textarea name="commentarea" className="w-full resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1" placeholder="Insira um comentário" />
                <button type="submit" className="ml-2"><PaperAirplaneIcon className="w-8 aspect-square stroke-neutral-950 hover:stroke-green-600 fill-neutral-100 hover:fill-green-100 transition-all" /></button>
            </form>
        </div>
    );
}

export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-50 flex flex-col justify-center items-center">
            <div className="w-[50%] h-96">
                <CommentSection />
            </div>
        </main>
    );
}
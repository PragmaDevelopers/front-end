"use client";

import { Component } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { UserIcon } from "@heroicons/react/24/outline";

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
                    <UserIcon className="w-8 aspect-square mr-2" />
                    <h1 className="font-bold">{user.name}</h1>
                </div>
                <h2>{sinceDate}</h2>
            </div>
            <p className="mt-4 text-justify">
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
    const commentContent: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quisque non tellus orci ac. Tellus id interdum velit laoreet id donec ultrices. In nisl nisi scelerisque eu ultrices vitae auctor. Pellentesque habitant morbi tristique senectus.";

    return (
        <div className="flex flex-col justify-start items-start h-fit w-96">
            <div className="h-48 overflow-auto">
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
                <CommentEntry user={newUser} content={commentContent} date={commentDate} />
            </div>
            <form>
                <textarea placeholder="Insira um comentário" />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-50">
            <CommentSection />
        </main>
    );
}

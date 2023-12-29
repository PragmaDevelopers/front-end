"use client";

import { Member, SystemID } from "@/app/types/KanbanTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { BACKEND_DATE_FORMAT } from "@/app/utils/variables";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

type Comment = {
    user: Member;
    content: string;
    id: SystemID;
    answers: Comment[];
    edited: boolean;
    date: string;
}



export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-50 flex flex-col justify-center items-center">
            <div className="w-[50%] h-96">
                <h1>bruh</h1>
            </div>
        </main>
    );
}
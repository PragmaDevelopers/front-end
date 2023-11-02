"use client";

import { ArrowTopRightOnSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function NotificationElement() {
    return (
        <Link href="#" className="w-[70%] h-16 bg-neutral-transparent hover:bg-neutral-100/25 transition-all block overflow-x-hidden">
            <div className="w-full h-full px-4 py-2 flex flex-row justify-between items-center">
                <UserCircleIcon className="w-8 mr-2 aspect-square fill-neutral-950" />
                <div className="w-full h-full flex flex-col mx-2">
                    <h1 className="text-lg font-bold">Title</h1>
                    <h2 className="truncate text-sm text-neutral-600 w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Facilisis volutpat est velit egestas dui id ornare arcu odio. Nunc sed blandit libero volutpat sed cras. Commodo nulla facilisi nullam vehicula.</h2>
                </div>
                <ArrowTopRightOnSquareIcon className="w-12 ml-2 aspect-square" />
            </div>
        </Link>
    );
}

export default function Page() {
    return (
        <main className="w-full h-full flex flex-col">
            <h1 className="font-bold text-xl my-4">Notificações</h1>
            <div className="w-full h-full flex flex-row justify-between items-center">
                <div className="h-[80%] m-4 shadow-inner border-[1px] border-neutral-300 bg-neutral-200 rounded-md w-[20%]">
                    <h1>Menu</h1>
                </div>
                <div className="w-[75%] h-[80%] shadow-inner border-[1px] border-neutral-300 bg-neutral-200 m-4 rounded-md divide-y divide-neutral-400 overflow-auto">
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                    <NotificationElement />
                </div>
            </div>
        </main>
    );
}


"use client";

import { ArrowTopRightOnSquareIcon, TagIcon, TrashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function NotificationElement() {
    return (
        <Link href="#" className="w-full h-16 bg-neutral-transparent hover:bg-neutral-50/25 transition-all block overflow-x-hidden">
            <div className="w-full h-full px-4 py-2 flex flex-row justify-between items-center">
                <UserCircleIcon className="aspect-square w-12 mr-2" />
                <div className="flex flex-col mx-2 grow w-12 overflow-hidden">
                    <h1 className="text-lg font-bold">Title</h1>
                    <h2 className="truncate text-sm text-neutral-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Facilisis volutpat est velit egestas dui id ornare arcu odio. Nunc sed blandit libero volutpat sed cras. Commodo nulla facilisi nullam vehicula.</h2>
                </div>
                <ArrowTopRightOnSquareIcon className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />
                <TrashIcon className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-red-500" />
            </div>
        </Link>
    );
}

export default function Page() {
    return (
        <main className="w-full h-full flex flex-col">
            <h1 className="font-bold text-xl mt-4 text-center">Central de notificações</h1>
            <div className="w-full h-full flex flex-row justify-start items-start">
                <div className="h-[88%] ml-4 mr-4 mt-4 mb-8 shadow-inner border-[1px] border-neutral-300 bg-neutral-200 rounded-md w-[20%]">
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all my-2 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Notificações PUSH</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Movimentações</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Prazos Expirados</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Ações do Sistema</h1>
                    </div>
                </div>
                <div className="w-[75%] h-[88%] shadow-inner border-[1px] border-neutral-300 bg-neutral-200 ml-4 mr-4 mt-4 mb-8 rounded-md divide-y divide-neutral-400 overflow-auto">
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


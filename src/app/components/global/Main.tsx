"use client";

import { useState } from "react";
import Header from "./header";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { UserContextProvider } from "@/app/contexts/userContext";
import { KanbanContextProvider } from "@/app/contexts/kanbanContext";
import { ModalContextProvider } from "@/app/contexts/modalContext";

function Notification() {
    return (
        <div className="w-full p-2 h-16 relative flex flex-col justify-start items-start">
            <div className="relative w-full h-fit flex flex-row items-center justify-start">
                <h1 className="font-semibold">Notificação</h1>
                <div className="flex flex-row absolute top-1 right-1 w-fit h-fit p-0.5">
                    <h2 className="text-neutral-400 font-xs">Há 32min.</h2>
                    <ClockIcon className="stoke-neutral-200 w-4 aspect-square ml-1" />
                </div>
            </div>
            <div className="w-full h-fit truncate">
                <h1 className="truncate font-sm">lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet </h1>
            </div>
        </div>
    );
}

export default function Main({ children }: any) {
    const [showNotification, setShowNotifications] = useState<boolean>(false);

    const handleShowNotifications = () => {
        setShowNotifications(!showNotification);
    }

    return (
        <UserContextProvider>
            <KanbanContextProvider>
                <ModalContextProvider>
                    <div className="w-full h-full relative">
                        <Header showNotifications={handleShowNotifications} />
                        <div className={(showNotification ? "block" : "hidden") + " w-full h-full bg-transparent z-10 absolute top-[4.5rem] left-0"}>
                            <div className="bg-transparent w-full h-full relative">
                                <div className="bg-neutral-50 drop-shadow-lg rounded-md w-64 m-4 absolute top-0 right-4 p-2">
                                    <h1 className="font-bold text-lg">Notificações</h1>
                                    <div className="divide-y divide-neutral-200 my-4 max-h-64 overflow-auto">
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                        <Notification />
                                    </div>
                                    <Link href="/dashboard/notifications" className="ml-0 hover:ml-2 text-sm fill-blue-400 hover:fill-blue-500 text-blue-400 hover:text-blue-500 transition-all flex flex-row items-center">Ver todas as notificações <ArrowRightIcon className="ml-2 w-4 aspect-square" /></Link>
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-full'>
                            {children}
                        </div>
                    </div>
                </ModalContextProvider>
            </KanbanContextProvider>
        </UserContextProvider>
    );
}

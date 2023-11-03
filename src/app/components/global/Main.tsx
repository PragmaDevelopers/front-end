"use client";

import { useState } from "react";
import Header from "./header";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";



export default function Main({ children }: any) {
    const [showNotification, setShowNotifications] = useState<boolean>(false);

    const handleShowNotifications = () => {
        setShowNotifications(!showNotification);
    }

    return (
        <div className="w-full h-full relative">
            <Header showNotifications={handleShowNotifications} />
            <div className={(showNotification ? "block" : "hidden") + " w-full h-full bg-transparent z-10 absolute top-[4.5rem] left-0 bg-neutral-950/50"}>
                <div className="bg-transparent w-full h-full relative">
                    <div className="bg-neutral-50 drop-shadow-lg rounded-md w-64 m-4 absolute top-0 right-4 p-2">
                        <h1 className="font-bold text-lg">Notificações</h1>
                        <div className="divide-y divide-neutral-200 my-4">
                            <div className="h-full p-2">
                                <h1>Notificação #00</h1>
                            </div>
                            <div className="w-full p-2">
                                <h1>Notificação #01</h1>
                            </div>
                            <div className="w-full p-2">
                                <h1>Notificação #02</h1>
                            </div>
                            <div className="w-full p-2">
                                <h1>Notificação #03</h1>
                            </div>
                        </div>
                        <Link href="/dashboard/notifications" className="ml-0 hover:ml-2 text-sm fill-blue-400 hover:fill-blue-500 text-blue-400 hover:text-blue-500 transition-all flex flex-row items-center">Ver todas as notificações <ArrowRightIcon className="ml-2 w-4 aspect-square" /></Link>
                    </div>
                </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
                {children}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Header from "./header";
import Link from "next/link";



export default function Main({ children }: any) {
    const [showNotification, setShowNotifications] = useState<boolean>(false);

    const handleShowNotifications = () => {
        setShowNotifications(!showNotification);
    }

    return (
        <div className="w-full h-full relative">
            <Header showNotifications={handleShowNotifications} />
            <div className={(showNotification ? "block" : "hidden") + " w-full h-full bg-transparent z-10 absolute top-[4.5rem] left-0 bg-neutral-950/50 relative"}>
                <div className="bg-neutral-50 drop-shadow-lg rounded-md w-64 m-4 absolute top-0 right-4">
                    <div className="p-2">
                        <div className="h-full p-2 border-2 rounded-md border-neutral-400 my-2">
                            <h1>Notificação #00</h1>
                        </div>
                        <div className="w-full p-2 border-2 rounded-md border-neutral-400 my-2">
                            <h1>Notificação #01</h1>
                        </div>
                        <div className="w-full p-2 border-2 rounded-md border-neutral-400 my-2">
                            <h1>Notificação #02</h1>
                        </div>
                        <div className="w-full p-2 border-2 rounded-md border-neutral-400 my-2">
                            <h1>Notificação #03</h1>
                        </div>
                    </div>
                    <Link href="/dashboard/notifications" className="text-blue-400 hover:text-blue-500 transition-all">Ver todas as notificações</Link>
                </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
                {children}
            </div>
        </div>
    );
}

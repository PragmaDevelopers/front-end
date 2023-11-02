"use client";

import { useState } from "react";
import Header from "./header";



export default function Main({ children }: any) {
    const [showNotification, setShowNotifications] = useState<boolean>(false);

    const handleShowNotifications = () => {
        setShowNotifications(!showNotification);
    }

    return (
        <div className="w-full h-full relative">
            <Header showNotifications={handleShowNotifications} />
            <div className={(showNotification ? "block" : "hidden") + " w-full h-full bg-transparent z-10 absolute top-20 left-0 bg-neutral-950/50"}>
                <div className="w-full h-full relative">
                    <div className="bg-neutral-50 drop-shadow-lg rounded-md w-96 m-4 absolute top-0 right-8 last:border-none">
                        <div className="border-neutral-400 w-full p-2 w-80">
                            <h1>Notificação #00</h1>
                        </div>
                        <div className="border-neutral-400 w-full p-2 w-80">
                            <h1>Notificação #01</h1>
                        </div>
                        <div className="border-neutral-400 w-full p-2 w-80">
                            <h1>Notificação #02</h1>
                        </div>
                        <div className="border-neutral-400 w-full p-2 w-80">
                            <h1>Notificação #03</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
                {children}
            </div>
        </div>
    );
}

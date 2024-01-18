"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Header from "./header";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { UserContextProvider, useUserContext } from "@/app/contexts/userContext";
import { KanbanContextProvider } from "@/app/contexts/kanbanContext";
import { ModalContextProvider } from "@/app/contexts/modalContext";
import { get_notifications } from "@/app/utils/fetchs";
import Notification from "./Notification";

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
                            <Notification isShow={showNotification} />
                        </div>
                        <div className='w-full h-[92%]'>
                            {children}
                        </div>
                    </div>
                </ModalContextProvider>
            </KanbanContextProvider>
        </UserContextProvider>
    );
}

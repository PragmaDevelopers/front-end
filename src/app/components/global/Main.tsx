"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Header from "./header";
import { UserContextProvider } from "@/app/contexts/userContext";
import { KanbanContextProvider } from "@/app/contexts/kanbanContext";
import { ModalContextProvider } from "@/app/contexts/modalContext";
import Notification from "./Notification";
import { PdfEditorContextProvider } from "@/app/contexts/pdfEditorContext";

export default function Main({ children }: any) {
    const [showNotification, setShowNotifications] = useState<boolean>(false);
    const handleShowNotifications = () => {
        setShowNotifications(!showNotification);
    }
    return (
        <UserContextProvider>
            <KanbanContextProvider>
                <div className="w-full h-full relative">
                    <Header showNotifications={handleShowNotifications} />
                    <div className={(showNotification ? "block" : "hidden") + " w-full h-full bg-transparent z-10 absolute top-[4.5rem] left-0"}>
                        <Notification isShow={showNotification} />
                    </div>
                    <div className='w-full h-[92%]'>
                        <ModalContextProvider>
                            <PdfEditorContextProvider>
                                {children}
                            </PdfEditorContextProvider>
                        </ModalContextProvider>
                    </div>
                </div>
            </KanbanContextProvider>
        </UserContextProvider>
    );
}

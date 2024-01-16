import { useUserContext } from "@/app/contexts/userContext";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Notification() {
    const { userValue } = useUserContext();
    dayjs.locale('pt-br');
    dayjs.extend(relativeTime);
    return (
        <div className="bg-transparent w-full h-full relative">
            <div className="bg-neutral-50 drop-shadow-lg rounded-md w-96 m-4 absolute top-0 right-4 p-2">
                <h1 className="font-bold text-lg">Notificações</h1>
                <div className="divide-y divide-neutral-200 my-4 max-h-64 overflow-auto">
                    {
                        userValue.notifications.map(notification=>{
                            return (
                                <div key={notification.id} className="w-full p-2 h-16 relative flex flex-col justify-start items-start">
                                    <div className="relative w-full h-fit flex flex-row items-center justify-start">
                                        <h1 className="font-semibold">Notificação</h1>
                                        <div className="flex flex-row absolute top-1 right-1 w-fit h-fit p-0.5">
                                            <h2 className="text-neutral-400 font-xs">Há {dayjs(notification.registrationDate).toNow(true)}.</h2>
                                            <ClockIcon className="stoke-neutral-200 w-4 aspect-square ml-1" />
                                        </div>
                                    </div>
                                    <div className="w-full h-fit truncate">
                                        <h1 className="truncate font-sm">{notification.message}</h1>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <Link href="/dashboard/notifications" className="ml-0 hover:ml-2 text-sm fill-blue-400 hover:fill-blue-500 text-blue-400 hover:text-blue-500 transition-all flex flex-row items-center">Ver todas as notificações <ArrowRightIcon className="ml-2 w-4 aspect-square" /></Link>
            </div>
        </div>
    );
}
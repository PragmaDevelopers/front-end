"use client";

import { ProfilePicture } from "@/app/components/dashboard/user/ProfilePicture";
import { useUserContext } from "@/app/contexts/userContext";
import { User, NotificationUser, SystemID } from "@/app/types/KanbanTypes";
import { get_notification_count, get_notifications, patch_notification_viewed } from "@/app/utils/fetchs";
import { NOTIFICATION_CATEGORIES_TITLE } from "@/app/utils/variables";
import { ArchiveBoxArrowDownIcon, ArrowTopRightOnSquareIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type parsedNotification = {
    id: SystemID,
    title: string;
    message: string;
    category: string;
    viewed: boolean;
    user: User;
    registrationDate: string
}
function parseRawNotificationsArray(notificationsArray: NotificationUser[], userList: User[]): parsedNotification[] {
    let newArray: parsedNotification[] = [];
    notificationsArray.forEach((notification: NotificationUser) => {
        let user: User = userList.filter((value: User) => {
            if (value.id === notification.sender_user_id) {
                return value;
            }
        })[0];

        let id: SystemID = notification.id;
        let message: string = notification.message;
        let title: string = NOTIFICATION_CATEGORIES_TITLE[notification.category];
        let category: string = notification.category;
        let viewed: boolean = notification.viewed;
        let registrationDate: string = notification.registrationDate;

        let newNotification: parsedNotification = {
            id,
            title: title,
            message: message,
            category: category,
            viewed: viewed,
            user: user,
            registrationDate: registrationDate
        }

        newArray.push(newNotification);
    });

    return newArray;
}


function NotificationElement({notification}:{notification:parsedNotification}) {
    const {userValue} = useUserContext();
    const handleViewedNotification = () => {
        notification.viewed = true;
        userValue.notificationCount--;
        patch_notification_viewed(undefined,notification.id,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("PATCH VIEWED NOTIFICATION SUCCESS");
            }
        }));
    }
    return (
        <Link href="#" className="w-full h-16 bg-neutral-transparent hover:bg-neutral-50/25 transition-all block overflow-x-hidden">
            <div className="w-full h-full px-4 py-2 flex flex-row justify-between items-center">
                <ProfilePicture className="aspect-square w-12 mr-2" size={512} source={notification.user.profilePicture} />
                <div className="flex flex-col mx-2 grow w-12 overflow-hidden">
                    <h1 className="text-lg font-bold">{notification.title}</h1>
                    <h2 className="truncate text-sm text-neutral-600">{notification.message}</h2>
                </div>
                <h2 className="text-sm ml-1 text-neutral-500">{dayjs(notification.registrationDate).format('DD [de] MMMM [de] YYYY')}</h2>
                {!notification.viewed && <ArchiveBoxArrowDownIcon onClick={handleViewedNotification} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />}
                {/* <ArrowTopRightOnSquareIcon className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" /> */}
                {/* <TrashIcon className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-red-500" /> */}
            </div>
        </Link>
    );
}

function filterNotifications(category: string, notificationsArray: parsedNotification[], setParsedNotifications: Dispatch<SetStateAction<parsedNotification[]>>) {
    let filteredNotifications: parsedNotification[] = [];

    switch (category.toLowerCase()) {
        case "kanban":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "KANBAN_CREATE") || (value.category === "KANBAN_UPDATE") || (value.category === "KANBAN_DELETE") || (value.category === "KANBAN_INVITE") || (value.category === "KANBAN_UNINVITE"));
            break;
        case "coluna":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "COLUMN_CREATE") || (value.category === "COLUMN_UPDATE") || (value.category === "COLUMN_DELETE") || (value.category === "COLUMN_MOVE"));
            break;
        case "card":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARD_CREATE") || (value.category === "INNERCARD_CREATE") || (value.category === "CARD_UPDATE") || (value.category === "CARD_DELETE") || (value.category === "CARD_MOVE"));
            break;
        case "tag":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDTAG_CREATE") || (value.category === "CARDTAG_UPDATE") || (value.category === "CARDTAG_DELETE"));
            break;
        case "comentario":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDCOMMENT_CREATE") || (value.category === "CARDCOMMENTANSWERED_CREATE") || (value.category === "CARDCOMMENT_UPDATE") || (value.category === "CARDCOMMENT_DELETE"));

            break;
        case "checklist":
            filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDCHECKLIST_CREATE") || (value.category === "CARDCHECKLIST_UPDATE") || (value.category === "CARDCHECKLIST_DELETE") || (value.category === "CARDCHECKLISTITEM_CREATE") || (value.category === "CARDCHECKLISTITEM_UPDATE") || (value.category === "CARDCHECKLISTITEM_DELETE"));
            break;

        default:
            filteredNotifications = notificationsArray;
            break;
    }

    setParsedNotifications(filteredNotifications);
}

export default function Page() {
    const [notificationsArray, setNotificationsArray] = useState<Notification[]>([]);
    const [parsedNotifications, setParsedNotifications] = useState<parsedNotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { userValue,setUserValue } = useUserContext();
    useEffect(() => {
        let pNot: parsedNotification[] = parseRawNotificationsArray(userValue.notifications, userValue.userList);
        setParsedNotifications(pNot);
    }, [userValue]);

    function handleRefleshNotification(){
        setIsLoading(true);
        get_notification_count(undefined,userValue.token,(response)=>response.json().then((dbNotificationCount:number)=>{
            const newUserValue = userValue;
            newUserValue.notificationCount = dbNotificationCount;
            setUserValue({...newUserValue});
        }));
        get_notifications(undefined,userValue.token,(response)=>response.json().then((dbNotifications:NotificationUser[])=>{
            let pNot: parsedNotification[] = parseRawNotificationsArray(dbNotifications, userValue.userList);
            setParsedNotifications(pNot);
            setIsLoading(false);
        }));
    }

    return (
        <main className={`${isLoading ? "loading-element" : ""} w-full h-full flex flex-col overflow-y-auto`}>
            <h1 className="font-bold text-xl mt-4 text-center">Central de notificações do sistema.</h1>
            <div className="w-full text-end">
                <button onClick={handleRefleshNotification} type='button'><CircleStackIcon className="aspect-square w-8" /></button>
            </div>
            <div className="w-full h-full flex flex-row justify-start items-start">
                {/* FILTRAGEM DE NOTIFICAÇÕES FICA PRA DPS PQ POR ENQUANTO SÓ EXISTE NOTIFICAÇÃO DE SISTEMA */}
                {/* <div className="h-[88%] ml-4 mr-4 mt-4 mb-8 shadow-inner border-[1px] border-neutral-300 bg-neutral-200 rounded-md w-[20%]">
                    <h1>Filtrar Notificações</h1>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all my-2 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Ações em Cards</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Ações em Colunas</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Ações em Comentários</h1>
                    </div>
                    <div className="w-full h-8 ml-0 hover:ml-2 transition-all mt-4 flex flex-row justify-start items-center fill-neutral-950 stroke-neutral-950 text-neutral-950 hover:fill-blue-500 hover:stroke-blue-500 hover:text-blue-500">
                        <TagIcon className="w-6 aspect-square mx-4" />
                        <h1 className="text-sm font-semibold">Ações do Sistema</h1>
                    </div>
                </div>
                <div className="w-[75%] h-[88%] shadow-inner border-[1px] border-neutral-300 bg-neutral-200 ml-4 mr-4 mt-4 mb-8 rounded-md divide-y divide-neutral-400 overflow-auto">
                    {parsedNotifications.map((element: parsedNotification, index: number) => <NotificationElement message={element.message} title={element.title} key={index}/>)}
                </div> */}
                <div className="w-full shadow-inner border-[1px] border-neutral-300 bg-neutral-200 ml-4 mr-5 mt-4 mb-8 rounded-md divide-y divide-neutral-400">
                    {parsedNotifications.map((element: parsedNotification, index: number) => <NotificationElement notification={element} key={index}/>)}
                </div>
            </div>
        </main>
    );
}


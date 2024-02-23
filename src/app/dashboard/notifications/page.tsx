"use client";

import { ProfilePicture } from "@/app/components/dashboard/user/ProfilePicture";
import { useUserContext } from "@/app/contexts/userContext";
import { User, NotificationUser, SystemID } from "@/app/types/KanbanTypes";
import { get_notification_count, get_notifications, patch_notification_viewed } from "@/app/utils/fetchs";
import { NOTIFICATION_CATEGORIES_TITLE } from "@/app/utils/variables";
import { ArchiveBoxArrowDownIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon, CircleStackIcon, XCircleIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function NotificationElement({notification,handleShowEdit}:{notification:NotificationUser,handleShowEdit:(value:NotificationUser)=>void}) {
    const {userValue,setUserValue} = useUserContext();
    const handleViewedNotification = () => {
        const newNotifications = userValue.notifications.map((n)=>{
            if(n.id == notification.id){
                n.viewed = true;
            }
            return n;
        })
        const newNotificationCount = userValue.notificationCount - 1;
        setUserValue({...userValue,notificationCount:newNotificationCount,notifications:newNotifications});
        patch_notification_viewed(undefined,notification.id,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("PATCH VIEWED NOTIFICATION SUCCESS");
            }
        }));
    }
    return (
        <Link href="#" className="w-full h-16 bg-neutral-transparent hover:bg-neutral-50/25 transition-all block">
            <div className="w-full h-full px-4 py-2 flex flex-row justify-between items-center">
                <ProfilePicture className="aspect-square w-12 h-12 mr-2" size={512} source={notification.sender_user_profilePicture} />
                <div className="flex flex-col mx-2 grow w-12 overflow-hidden">
                    <h1 className="text-lg font-bold">{NOTIFICATION_CATEGORIES_TITLE[notification.category]}</h1>
                    <h2 className="truncate text-sm text-neutral-600">{notification.message}</h2>
                </div>
                <h2 className="text-sm ml-1 text-neutral-500">{dayjs(notification.registrationDate).format('DD [de] MMMM [de] YYYY')}</h2>
                {!notification.viewed && <ArchiveBoxArrowDownIcon onClick={handleViewedNotification} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />}
                <ArrowTopRightOnSquareIcon onClick={()=>handleShowEdit(notification)} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />
                {/* <TrashIcon className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-red-500" /> */}
            </div>
        </Link>
    );
}

// function filterNotifications(category: string, notificationsArray: parsedNotification[], setParsedNotifications: Dispatch<SetStateAction<parsedNotification[]>>) {
//     let filteredNotifications: parsedNotification[] = [];

//     switch (category.toLowerCase()) {
//         case "kanban":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "KANBAN_CREATE") || (value.category === "KANBAN_UPDATE") || (value.category === "KANBAN_DELETE") || (value.category === "KANBAN_INVITE") || (value.category === "KANBAN_UNINVITE"));
//             break;
//         case "coluna":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "COLUMN_CREATE") || (value.category === "COLUMN_UPDATE") || (value.category === "COLUMN_DELETE") || (value.category === "COLUMN_MOVE"));
//             break;
//         case "card":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARD_CREATE") || (value.category === "INNERCARD_CREATE") || (value.category === "CARD_UPDATE") || (value.category === "CARD_DELETE") || (value.category === "CARD_MOVE"));
//             break;
//         case "tag":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDTAG_CREATE") || (value.category === "CARDTAG_UPDATE") || (value.category === "CARDTAG_DELETE"));
//             break;
//         case "comentario":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDCOMMENT_CREATE") || (value.category === "CARDCOMMENTANSWERED_CREATE") || (value.category === "CARDCOMMENT_UPDATE") || (value.category === "CARDCOMMENT_DELETE"));

//             break;
//         case "checklist":
//             filteredNotifications = notificationsArray.filter((value: parsedNotification) => (value.category === "CARDCHECKLIST_CREATE") || (value.category === "CARDCHECKLIST_UPDATE") || (value.category === "CARDCHECKLIST_DELETE") || (value.category === "CARDCHECKLISTITEM_CREATE") || (value.category === "CARDCHECKLISTITEM_UPDATE") || (value.category === "CARDCHECKLISTITEM_DELETE"));
//             break;

//         default:
//             filteredNotifications = notificationsArray;
//             break;
//     }

//     setParsedNotifications(filteredNotifications);
// }

export default function Page() {
    const [isShowEditNotification, setIsShowEditNotification] = useState<boolean>(false);
    const [tempEditNotification, setTempEditNotification] = useState<NotificationUser>();
    const { userValue,setUserValue } = useUserContext();

    const [loadingScroll, setLoadingScroll] = useState(false);
    const [page, setPage] = useState(1);

    const handleShowEditNotification = (notification:NotificationUser) => {
        setIsShowEditNotification(true);
        setTempEditNotification(notification);
    }

    const handleScroll = () => {
        setLoadingScroll(true);
        get_notifications(undefined,page + 1,userValue.token,(response)=>response.json().then((dbNotifications:NotificationUser[])=>{
            if(dbNotifications.length != 0){
                setUserValue({...userValue,notifications:[...userValue.notifications,...dbNotifications]});
                setPage(prevPage => prevPage + 1);
            }
            setLoadingScroll(false);
        }));
    }

    return (
        <main className="w-full h-full flex flex-col p-2">
            {isShowEditNotification && (
                <div className="flex absolute top-0 left-0 w-screen h-screen z-[1] justify-center items-center bg-neutral-950/25">
                    <div className="overflow-x-hidden w-[80%] h-[80%] bg-neutral-50 rounded-lg px-8 drop-shadow-lg">
                        <div className="w-full h-fit flex justify-center items-center relative">
                            <div className="my-2 text-center font-semibold">
                                {/* <h1 className="text-xl">{tempEditNotification?.category ? NOTIFICATION_CATEGORIES_TITLE[tempEditNotification.category] : ""}</h1>
                                <h2 className="text-lg opacity-75">{tempEditNotification?.message}</h2> */}
                                <h1 className="text-xl">Funcionalidade em desenvolvimento!</h1>
                            </div>
                            <button type="button" onClick={() => setIsShowEditNotification(false)}><XCircleIcon className='w-8 aspect-square absolute top-2 right-0' /></button>
                        </div>
                        {/* <div className="flex w-full items-center justify-evenly">
                            <div className="flex flex-col justify-center items-center w-fit">
                                <h1 className="px-4 py-2 font-semibold">Criar:</h1>
                                <select disabled={userValue.profileData.permissionLevel.charAt(1) == "0" ? true : false}
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value="" onChange={(e)=>{}}>
                                    <option value=""> -- Nenhuma -- </option>
                                    <option value="">List</option>
                                    <option value="">Tarefa</option>
                                    <option value="">Card</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-evenly">
                            <div className="flex flex-col justify-center items-center w-fit">
                                <h1 className="px-4 py-2 font-semibold">Dashboard:</h1>
                                <select disabled={userValue.profileData.permissionLevel.charAt(1) == "0" ? true : false}
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value="" onChange={(e)=>{}}>
                                    <option value=""> -- Nenhuma -- </option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-center items-center w-fit">
                                <h1 className="px-4 py-2 font-semibold">Coluna:</h1>
                                <select disabled={userValue.profileData.permissionLevel.charAt(1) == "0" ? true : false}
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value="" onChange={(e)=>{}}>
                                    <option value=""> -- Nenhuma -- </option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-center items-center w-fit">
                                <h1 className="px-4 py-2 font-semibold">Card:</h1>
                                <select disabled={userValue.profileData.permissionLevel.charAt(1) == "0" ? true : false}
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value="" onChange={(e)=>{}}>
                                    <option value=""> -- Nenhuma -- </option>
                                </select>
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
            <h1 className="font-bold text-xl text-center">Central de notificações do sistema.</h1>
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
            <div className="shadow-inner h-full m-4  overflow-y-auto border-[1px] border-neutral-300 bg-neutral-200 rounded-md divide-y divide-neutral-400">
                {userValue.notifications.map((element: NotificationUser) => <NotificationElement handleShowEdit={handleShowEditNotification} notification={element} key={element.id}/>)}
            </div>
            {loadingScroll ? <p className="text-center bg-neutral-200 transition-all drop-shadow font-bold rounded-md p-2 border-gray-400">Loading...</p> : <button type="button" className="bg-neutral-200 hover:bg-neutral-300 transition-all drop-shadow font-bold rounded-md p-2 text-center border-gray-400" onClick={handleScroll}>Mais notificações</button>}
        </main>
    );
}


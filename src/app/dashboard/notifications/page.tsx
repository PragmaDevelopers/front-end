"use client";

import { ProfilePicture } from "@/app/components/dashboard/user/ProfilePicture";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { useUserContext } from "@/app/contexts/userContext";
import { User, NotificationUser, SystemID, Kanban, Column, Card } from "@/app/types/KanbanTypes";
import { CreateCard } from "@/app/utils/dashboard/functions/Page/Card";
import { delete_notification, get_notification_count, get_notifications, patch_notification_all_viewed, patch_notification_viewed, post_card, post_checklist } from "@/app/utils/fetchs";
import { NOTIFICATION_CATEGORIES_TITLE } from "@/app/utils/variables";
import { ArchiveBoxArrowDownIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon, CircleStackIcon, EyeIcon, EyeSlashIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

function NotificationElement({notification,handleShowEdit}:{notification:NotificationUser,handleShowEdit:(value:NotificationUser)=>void}) {
    const {userValue,notificationCount,setNotificationCount,notifications,setNotifications} = useUserContext();
    const handleViewedNotification = () => {
        const newNotifications = notifications.map((n)=>{
            if(n.id == notification.id){
                n.viewed = true;
            }
            return n;
        })
        setNotificationCount(notificationCount - 1);
        setNotifications(newNotifications);
        patch_notification_viewed(undefined,notification.id,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("PATCH VIEWED NOTIFICATION SUCCESS");
            }
        }));
    }
    const handleDeleteNotification = () => {
        const newNotifications = notifications.filter((n)=>{
            if(n.id == notification.id){
                if(n.viewed == false){
                    setNotificationCount(notificationCount - 1);
                }
                return false;
            }
            return true;
        })
        setNotifications(newNotifications);
        delete_notification(undefined,notification.id,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("DELETE NOTIFICATION SUCCESS");
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
                {!notification.viewed && <EyeIcon onClick={handleViewedNotification} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />}
                <ArrowTopRightOnSquareIcon onClick={()=>handleShowEdit(notification)} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-blue-500" />
                <TrashIcon onClick={handleDeleteNotification} className="w-6 ml-2 aspect-square stroke-neutral-950 hover:stroke-red-500" />
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
    const [createLoading,setCreateLoading] = useState<boolean|null>(null);
    const [refreshLoading,setRefreshLoading] = useState<boolean>(false);
    const [viewedLoading,setViewedLoading] = useState<boolean>(false);
    const [createType, setCreateType] = useState<"task"|"card"|"">("");
    const [selectedKanbanId, setSelectedKanbanId] = useState<SystemID>("");
    const [selectedColumnId, setSelectedColumnId] = useState<SystemID>("");
    const [selectedCardId, setSelectedCardId] = useState<SystemID>("");
    const { userValue,notifications,setNotifications,setNotificationCount } = useUserContext();
    const { kanbanList, setKanbanList } = useKanbanContext();

    const [loadingScroll, setLoadingScroll] = useState(false);
    const [page, setPage] = useState(1);

    const handleShowEditNotification = (notification:NotificationUser) => {
        setIsShowEditNotification(true);
        setTempEditNotification(notification);
    }

    const handleMoreNotification = () => {
        setLoadingScroll(true);
        get_notifications(undefined,page + 1,userValue.token,(response)=>response.json().then((dbNotifications:NotificationUser[])=>{
            if(dbNotifications.length != 0){
                setNotifications([...notifications,...dbNotifications]);
                setPage(prevPage => prevPage + 1);
            }
            setLoadingScroll(false);
        }));
    }

    const handleCreate = (e:any) => {
        e.preventDefault();
        if(createType == "card"){
            const kanban = kanbanList?.find(kanban=>kanban.id==selectedKanbanId);
            const column = kanban?.columns.find(column=>column.id==selectedColumnId);
            if(kanbanList && kanban && column){
                const title = "Card "+column.cards.length; // TITLE É OBRIGATÓRIO
                const description = "";
                const members:SystemID[] = [];
                setCreateLoading(true);
                post_card({columnId:column.id,title,description,members},userValue.token,(response)=>response.json().then((cardId)=>{
                    if(response.ok){
                        console.log("CREATE CARD SUCESSS");
                        setSelectedCardId(cardId);
                        setCreateLoading(false);
                        const newKanbanList = kanbanList?.map(kanban=>{
                            kanban.columns = kanban.columns.map((c)=>{
                                if(c.id == column.id){
                                    c.cards.push({
                                        id: cardId,
                                        columnID: selectedColumnId,
                                        kanbanID: selectedKanbanId,
                                        title: title,
                                        index: column.cards.length,
                                        description: "",
                                        checklists: [],
                                        tags: [],
                                        members: [],
                                        comments: [],
                                        dropdowns: [],
                                        deadline: {
                                            id: "",
                                            category: "",
                                            date: null,
                                            overdue: false,
                                            toColumnId: "",
                                            toKanbanId: ""
                                        },
                                        customFields: [],
                                        innerCards: []
                                    })
                                }
                                return c;
                            })
                            return kanban;
                        });
                        setKanbanList(newKanbanList);
                    }
                }));
            }
        }else if(createType == "task"){
            setCreateLoading(true);
            post_checklist({cardId:selectedCardId,name:""},userValue.token,(response)=>response.json().then(()=>{
                if(response.ok){
                    setCreateLoading(false);
                    console.log("CREATE CHECKLIST SUCCESS");
                }
            }));
        }
    }
    const handleRefreshNotifications = () => {
        setRefreshLoading(true);
        get_notifications(undefined,1,userValue.token,(response)=>response.json().then((dbNotifications:NotificationUser[])=>{
            setNotifications(dbNotifications);
            setPage(1);
            setRefreshLoading(false);
        }));
    }
    const handleViewedAllNotification = () => {
        setViewedLoading(true);
        patch_notification_all_viewed(undefined,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("PATCH VIEWED ALL NOTIFICATION SUCCESS");
                setViewedLoading(false);
                const newNotifications = notifications.map((n)=>{
                    if(n.viewed == false){
                        n.viewed = true;
                    }
                    return n;
                })
                setNotificationCount(0);
                setNotifications(newNotifications);
            }
        }));
    }
    return (
        <main className="w-full h-full flex flex-col p-2">
            {isShowEditNotification && (
                <div className="flex absolute top-0 left-0 w-screen h-screen z-[1] justify-center items-center bg-neutral-950/25">
                    <form onSubmit={(e)=>{handleCreate(e)}} className="overflow-x-hidden w-[80%] h-[80%] bg-neutral-50 rounded-lg px-8 drop-shadow-lg">
                        <div className="w-full h-fit flex justify-center items-center relative">
                            <div className="my-2 text-center font-semibold">
                                <h1 className="text-xl">{tempEditNotification?.category ? NOTIFICATION_CATEGORIES_TITLE[tempEditNotification.category] : ""}</h1>
                                <h2 className="text-lg opacity-75">{tempEditNotification?.message}</h2>
                            </div>
                            <button type="button" onClick={() => setIsShowEditNotification(false)}><XCircleIcon className='w-8 aspect-square absolute top-2 right-0' /></button>
                        </div>
                        <div className="flex w-full justify-center mb-3">
                            <div className="flex flex-col justify-center items-center w-[33.3%]">
                                <h1 className="px-4 py-2 font-semibold">Criar:</h1>
                                <select required
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value={createType} onChange={(e)=>setCreateType(e.target.value as any)}>
                                    <option value=""> -- Nenhuma -- </option>
                                    <option disabled={userValue.profileData.permissionLevel.charAt(0) == "0" ? true : false} value="card">Card</option>
                                    <option disabled={userValue.profileData.permissionLevel.charAt(11) == "0" ? true : false} value="task">Tarefa</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full justify-center gap-10">
                            <div className="flex flex-col w-[33.3%]">
                                <h1 className="px-4 py-2 font-semibold">Dashboard:</h1>
                                <select required
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value={selectedKanbanId} onChange={(e)=>{setSelectedKanbanId(e.target.value)}}>
                                    <option value=""> -- Nenhuma -- </option>
                                    {kanbanList?.map(kanban=><option key={kanban.id} value={kanban.id}>{kanban.title}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col w-[33.3%]">
                                <h1 className="px-4 py-2 font-semibold">Coluna:</h1>
                                <select required
                                    className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                    value={selectedColumnId} onChange={(e)=>setSelectedColumnId(e.target.value)}>
                                    <option value=""> -- Nenhuma -- </option>
                                    {kanbanList?.map(kanban=>{
                                        if(kanban.id == selectedKanbanId){
                                            return kanban.columns.map(column=><option key={column.id} value={column.id}>{column.title}</option>)
                                        }
                                    })}
                                </select>
                            </div>
                            {
                                createType == "task" && (
                                    <div className="flex flex-col w-[33.3%]">
                                        <h1 className="px-4 py-2 font-semibold">Card:</h1>
                                        <select required
                                            className="w-full form-input bg-neutral-100 border-[1px] border-neutral-200 rounded-md shadow-inner"
                                            value={selectedCardId} onChange={(e)=>{setSelectedCardId(e.target.value)}}>
                                            <option value=""> -- Nenhuma -- </option>
                                            {kanbanList?.map(kanban=>{
                                                if(kanban.id == selectedKanbanId){
                                                    return kanban.columns.map(column=>{
                                                        if(column.id == selectedColumnId){
                                                            return column.cards?.map(card=><option key={card.id} value={card.id}>{card.title}</option>)
                                                        }
                                                    })
                                                }
                                            })}
                                        </select>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex w-full justify-center mt-6">
                            <button type="submit" className="bg-neutral-50 drop-shadow rounded-md px-4 py-2">Criar</button>
                        </div>
                        <div className="flex w-full justify-center mt-6">
                            {
                                createLoading == true && <div>Criando...</div>
                            }
                            {
                                createLoading == false && <Link className="text-blue-500 underline p-2" href={"/dashboard/board/"+selectedKanbanId+"?card="+selectedCardId}>{
                                    createType == "card" ? "Editar o card" : "Editar a tarefa"
                                }</Link>
                            }
                        </div>
                    </form>
                </div>
            )}
            <h1 className="font-bold text-xl text-center">Central de notificações do sistema.</h1>
            <div className="flex justify-between w-full mt-4 ps-4 pe-4">
                <button onClick={handleViewedAllNotification} type='button' className={viewedLoading ? "loading-element" : ""}><EyeSlashIcon className="aspect-square w-5 hover:rotate-180 transition-all rotate-0" /></button>
                <button onClick={handleRefreshNotifications} type='button' className={refreshLoading ? "loading-element" : ""}><ArrowPathIcon className="aspect-square w-5 hover:rotate-180 transition-all rotate-0" /></button>
            </div>
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
            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #C4C4C4; /* Cor do indicador da barra de rolagem */
                }        
            `}</style>
            <div className="shadow-inner h-full m-2  overflow-y-auto border-[1px] border-neutral-300 bg-neutral-200 rounded-md divide-y divide-neutral-400">
                {notifications.map((element: NotificationUser) => <NotificationElement handleShowEdit={handleShowEditNotification} notification={element} key={element.id}/>)}
            </div>
            {loadingScroll ? 
                <p className="text-center bg-neutral-200 transition-all drop-shadow font-bold rounded-md p-2 border-gray-400">Carregando...</p> : 
                <button type="button" className="bg-neutral-200 hover:bg-neutral-300 transition-all drop-shadow font-bold rounded-md p-2 text-center border-gray-400" onClick={handleMoreNotification}>Carregar mais notificações</button>}
        </main>
    );
}


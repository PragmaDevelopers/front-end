"use client";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { useUserContext } from "@/app/contexts/userContext";
import { Kanban, NotificationUser, User } from "@/app/types/KanbanTypes";
import { get_kanban, get_kanban_members, get_notification_count, get_notifications, get_profile, get_user } from "@/app/utils/fetchs";
import { BellIcon, ArrowLeftEndOnRectangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from "react";

interface VercelLogoProps { className: string; }
function VercelLogo(props: VercelLogoProps) {
    const { className } = props;
    return (
        <svg className={className} viewBox="0 0 1155 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
        </svg>
    );
}

interface HeaderProps { showNotifications: (newValue:boolean|undefined)=>void };
export default function Header(props: HeaderProps) {
    const currentPath: string = usePathname();
    const { setUserValue,userValue,notificationCount,setNotificationCount } = useUserContext();
    const { setTempKanban, setTempKanbanMembers,tempKanbanIntervalId } = useKanbanContext();
    const [tempIntervalId,setTempIntervalId] = useState<any|null>(null);
    const router = useRouter();
    useEffect(()=>{
        if(currentPath != '/' && !currentPath.includes("/account/")){
            if(!currentPath.includes("/dashboard/board/")){
                clearInterval(tempKanbanIntervalId);
            }
            const intervalId = setInterval(()=>{
                console.log("Tempo real: Lista do perfil e notificações")
                get_profile(undefined,userValue.token,(response)=>response.json().then((profileData:User)=>{
                    const newUserValue = userValue;
                    newUserValue.profileData = profileData;
                    setUserValue({...newUserValue});
                    getNotificationUserCount();
                }));
                const getNotificationUserCount = () => {
                    get_notification_count(undefined,userValue.token,(response)=>response.json().then((dbNotificationCount:number)=>{
                        setNotificationCount(dbNotificationCount);
                    }));
                }
            },10000);
            setTempIntervalId(intervalId);
            return () => clearInterval(intervalId);
        }else{
            clearInterval(tempIntervalId);
        }
    },[currentPath])

    if (currentPath != '/' && !currentPath.includes("/account/")) {
        return (
            <div className='w-full h-[8%] flex flex-row justify-between items-center p-2'>
                <div className="ml-2 p-0.5 w-6 rounded-full border-[1px] border-neutral-950 aspect-square flex justify-center items-center overflow-hidden">
                    <VercelLogo className="fill-neutral-950 aspect-square w-3.5" />
                </div>
                <div className="flex flex-row items-center">
                    <nav className='flex flex-row items-center'>
                        <Link href="/dashboard" className='text-neutral-950 hover:text-blue-400 mx-2'>Dashboard</Link>
                        <Link href="/register/client" className='text-neutral-950 hover:text-blue-400 mx-2'>Cadastrar</Link>
                        <Link href="/pdf/create" className='text-neutral-950 hover:text-blue-400 mx-2'>Editor</Link>
                    </nav>
                    <button className="relative" type="button" onClick={()=>props.showNotifications(undefined)}>
                        {notificationCount > 0 && <div className="absolute truncate bg-red-800 rounded-[50%] w-6 h-6 leading-6 text-center text-white text-sm -right-1 -top-1">{notificationCount}</div>}
                        <BellIcon className="aspect-square w-6 mr-2 ml-4" />
                    </button>
                    <button type="button" onClick={()=>{
                        setUserValue({token:"",userList:[],profileData:{
                            email: "",
                            id: "",
                            gender: "",
                            name: "",
                            nationality: "",permissionLevel:"",
                            profilePicture: null,
                            pushEmail: "",
                            registrationDate: "",
                            role: "",
                            isReceiveNotification: false
                        }})
                        setTempKanban({
                            id: "",
                            title: "",
                            columns: []
                        });
                        setTempKanbanMembers([]);
                        props.showNotifications(false);
                        router.push("/");
                    }}>
                        <ArrowLeftEndOnRectangleIcon className="aspect-square w-6 mr-2 ml-4" />
                    </button>
                </div>
            </div>
        );
    }
}

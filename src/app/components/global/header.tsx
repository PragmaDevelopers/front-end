"use client";
import { useUserContext } from "@/app/contexts/userContext";
import { BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';

interface VercelLogoProps { className: string; }
function VercelLogo(props: VercelLogoProps) {
    const { className } = props;
    return (
        <svg className={className} viewBox="0 0 1155 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
        </svg>
    );
}

interface HeaderProps { showNotifications?: any };
export default function Header(props: HeaderProps) {
    const currentPath: string = usePathname();
    const { setUserValue } = useUserContext();
    const router = useRouter();
    if (currentPath != '/' && currentPath != '/pdf/view') {
        return (
            <div className='w-full h-[8%] flex flex-row justify-between items-center p-2'>
                <div className="ml-2 p-0.5 w-6 rounded-full border-[1px] border-neutral-950 aspect-square flex justify-center items-center overflow-hidden">
                    <VercelLogo className="fill-neutral-950 aspect-square w-3.5" />
                </div>
                <div className="flex flex-row items-center">
                    <nav className='flex flex-row'>
                        <Link href="/dashboard" className='text-neutral-950 hover:text-blue-400 mx-2'>Dashboard</Link>
                        <Link href="/register/client" className='text-neutral-950 hover:text-blue-400 mx-2'>Cadastrar</Link>
                        <Link href="/pdf/create" className='text-neutral-950 hover:text-blue-400 mx-2'>Editor</Link>
                    </nav>
                    <button type="button" onClick={props?.showNotifications}>
                        <BellIcon className="aspect-square w-6 mr-2 ml-4" />
                    </button>
                    <button type="button" onClick={()=>{
                        setUserValue({token:"",notifications:[],userList:[],profileData:{
                            email: "",
                            id: "",
                            gender: "",
                            name: "",
                            nationality: "",permissionLevel:"",
                            profilePicture: "",
                            pushEmail: "",
                            registrationDate: "",
                            role: ""
                        }})
                        router.push("/");
                    }}>
                        Sair
                    </button>
                </div>
            </div>
        );
    }
}

"use client";
import { BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface VercelLogoProps { className: string; }
function VercelLogo(props: VercelLogoProps) {
    const { className } = props;
    return (
        <svg className={className} viewBox="0 0 1155 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
        </svg>
    );
}

export default function Header() {
    const currentPath: string = usePathname();
    if (currentPath != '/') {
        return (
            <div className='w-full h-16 flex flex-row justify-between items-center p-2'>
                <div className="ml-2 p-0.5 w-8 rounded-full border-2 border-neutral-950 aspect-square flex justify-center items-center">
                    <VercelLogo className="fill-neutral-950 aspect-square w-6" />
                </div>
                <div className="flex flex-row items-center">
                    <nav className='flex flex-row'>
                        <Link href="/dashboard" className='text-neutral-950 hover:text-blue-400 mx-2'>Dashboard</Link>
                        <Link href="/login" className='text-neutral-950 hover:text-blue-400 mx-2'>Cadastrar</Link>
                    </nav>
                    <BellIcon className="aspect-square w-6 mr-2 ml-4" />
                </div>
            </div>
        );
    }
}

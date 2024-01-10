"use client";

import { useUserContext } from "@/app/contexts/userContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LinkToAdminPage() {
    return (
        <Link href="/dashboard/config/admin" className="font-bold p-2 bg-neutral-50 drop-shadow-md rounded-md text-red-600 hover:bg-red-600 hover:text-neutral-50 hover:scale-110 transition-all">
            Acessar Painel do Administrador
        </Link>
    );
}

export default function Page() {
    const router = useRouter();
    const { userValue } = useUserContext();

    useEffect(() => {
        console.log(userValue);
    }, [userValue]);

    return (
        <main className="w-full h-full bg-neutral-100">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Configurações</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-start">
                <div className="bg-neutral-50 rounded-lg drop-shadow-md p-4 flex flex-row justify-center items-center">
                    <UserCircleIcon className="aspect-square w-24 mr-4" />
                    <div>
                        <h1 className="text-lg font-bold text-neutral-900 mb-1">Fulano da Silva</h1>
                        <h2 className="text-neutral-700 text-sm my-0.5">usuario@exemplo.com</h2>
                        <Link className="text-blue-500 hover:text-blue-700 transition-all text-sm my-0.5" href="/dashboard/config/user">Configurar perfil</Link>
                    </div>
                </div>
                <div className="m-4 w-[28rem] flex flex-col items-center">
                    <form className="w-full">
                        <div className="bg-neutral-50 p-2 rounded-md m-4 drop-shadow-md">
                            <h1 className="font-bold text-xl mb-2 text-neutral-900">Sistema Push</h1>
                            <div className="flex flex-row justify-center items-center w-full">
                                <label htmlFor="emailPush" className="mr-2">Email:</label>
                                <input id="emailPush" type="email" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira um email" />
                                <button className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">Salvar</button>
                            </div>
                        </div>
                    </form>
                    {userValue.profileData.role === "ROLE_ADMIN" ? <LinkToAdminPage /> : null}
                </div>

            </div>
        </main>
    );
}

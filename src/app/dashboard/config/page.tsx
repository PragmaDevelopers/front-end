"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <main className="w-full h-full bg-neutral-100">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-2 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Configurações</h1>
            </div>
            <div className="mt-2 flex flex-col items-center justify-start">
                <div className="bg-neutral-50 rounded-lg drop-shadow-lg p-4 flex flex-row justify-center items-center">
                    <UserCircleIcon className="aspect-square w-16" />
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900">Fulano da Silva</h1>
                        <h2 className="text-neutral-700 text-lg">usuario@exemplo.com</h2>
                        <h3 className="text-blue-500 hover:text-blue-700 transition-all">Configurar perfil</h3>
                    </div>
                </div>
                <form>
                    <div className="bg-neutral-50 p-2 rounded-md m-4">
                        <h1 className="font-bold text-xl">Sistema Push</h1>
                        <label htmlFor="emailPush">Email:</label>
                        <input id="emailPush" type="email" className="bg-neutral-100 border-none outline-none p-2 shadow-inner" placeholder="Insira um email" />
                    </div>
                </form>
            </div>
        </main>
    );
}

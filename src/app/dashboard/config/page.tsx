"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <main className="w-full h-full bg-neutral-100 shadow-inner rounded-tl-md">
            <div className="flex flex-row justify-center items-center relative">
                <button className="absolute left-2 hover:left-1 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8" /></button>
                <h1 className="font-bold text-2xl">Configurações</h1>
            </div>
        </main>
    );
}

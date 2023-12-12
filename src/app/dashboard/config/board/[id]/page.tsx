"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";


export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();

    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <div className="relative w-full flex flex-row justify-center items-center px-2 my-2">
                <h1 className="">Configurações da Dashboard {params.id}</h1>
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
            </div>
        </main>
    );

}

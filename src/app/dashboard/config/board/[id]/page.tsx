"use client";

import { useUserContext } from "@/app/contexts/userContext";
import { SystemID } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page({ params }: { params: { id: string } }) {
    const { userValue } = useUserContext();
    const router = useRouter();
    const [kanbanTitle, setKanbanTitle] = useState<string>("");
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban`, requestOptions).then(response => response.json()).then((data: {id: SystemID, title:string}[]) => {
            data.forEach((element: { id: SystemID, title: string }) => {
                let id = element.id;
                let title = element.title;
                if ((id as number) === parseInt(params.id as string)) {
                    console.log(title);
                    setKanbanTitle(title);
                }
            });

        })
    }, [userValue, params, setKanbanTitle]);


    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <div className="relative w-full flex flex-row justify-center items-center px-2 my-2">
                <h1 className="">Configurações da Dashboard {kanbanTitle}</h1>
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
            </div>
            <div>

            </div>
        </main>
    );

}

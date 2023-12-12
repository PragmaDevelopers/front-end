'use client';

import { useRouter } from "next/navigation";
import { CalendarIcon, ChartPieIcon, ServerStackIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BuildingOffice2Icon } from "@heroicons/react/24/solid";
import { generateRandomString } from "../utils/generators";
import { Cog6ToothIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useUserContext } from "../contexts/userContext";
import { API_BASE_URL } from "../utils/variables";
import ConfirmDelete from "../components/ui/ConfirmDelete";

interface BoardMenuEntryProps {
    href: string;
    name: string;
    deleteKanban: any;
    kanbanID: string;
    setConfirmDeleteMessage: any;
    setConfirmDeleteYesText: any;
    setConfirmDeleteNoText: any;
    setConfirmDeleteYesFunction: any;
    setConfirmDeleteNoFunction: any;
    setViewConfirmDelete: any;
    //picture: string;
}

//function BoardMenuEntry(props: BoardMenuEntryProps) {
//    return (
//        <Link href={props.href} className="my-2 flex flex-row items-center">
//            <Image src={props.picture} alt={props.name} width={640} height={640} className="w-8 aspect-square rounded-md overflow-hidden mr-2" />
//            <h1>{props.name}</h1>
//        </Link>
//    );
//}

function BoardMenuEntry(props: BoardMenuEntryProps) {
    const deleteCurrEntry = () => {
        props.deleteKanban(props.kanbanID);
        props.setViewConfirmDelete(false);
    }

    const hideConfirmDelete = () => {
        console.log("HIDE CONFIRM DELETE");
        props.setViewConfirmDelete(false);
    }

    const showConfirmDelete = () => {
        console.log("SHOW CONFIRM DELETE");
        props.setViewConfirmDelete(true);
    }

    const handleDeleteEntry = () => {
        props.setConfirmDeleteNoFunction(() => { return hideConfirmDelete });
        props.setConfirmDeleteYesFunction(() => { return deleteCurrEntry });
        props.setConfirmDeleteMessage("Deseja remover a dashboard?");
        props.setConfirmDeleteYesText("Sim");
        props.setConfirmDeleteNoText("Não");
        showConfirmDelete();
    };

    return (
        <div className="flex flex-row items-center relative">
            <Link href={props.href} className="my-2 flex flex-row items-center">
                <BuildingOffice2Icon className="w-6 aspect-square mr-2" />
                <h1>{props.name}</h1>
            </Link>
            <button className="absolute right-0" type="button"><XCircleIcon className="aspect-square w-6" onClick={handleDeleteEntry} /></button>
        </div>
    );
}

export default function Layout({ children }: any) {
    const { userValue, updateUserValue } = useUserContext();


    const [confirmDeleteYesFunc, setConfirmDeleteYesFunc] = useState<any>(null);
    const [confirmDeleteNoFunc, setConfirmDeleteNoFunc] = useState<any>(null);
    const [confirmDeleteYesText, setConfirmDeleteYesText] = useState<string>("");
    const [confirmDeleteNoText, setConfirmDeleteNoText] = useState<string>("");
    const [viewConfirmDelete, setViewConfirmDelete] = useState<boolean>(false);
    const [confirmDeleteText, setConfirmDeleteText] = useState<string>("");

    const router = useRouter();

    const [dashboards, setDashboards] = useState<{ kanbanId: string, name: string }[]>([]);
    const IconStyles: string = "w-8 aspect-square mr-2";

    useEffect(() => {
        fetch(`${API_BASE_URL}/`, {}).then(response => response.json()).then(data => setDashboards(data))
    }, [setDashboards]);

    const returnToHome = () => {
        router.push("/");
    }

    useEffect(() => {
        if (userValue === "") {
            returnToHome();
        }
    }, [userValue, returnToHome]);

    const addDashBoard = (event: any) => {
        event.preventDefault();
        const dashboardItem: { name: string, kanbanId: string } = {
            name: event.target.boardname.value, kanbanId: generateRandomString()
        }

        if (dashboards !== undefined) {
            if (dashboards?.length >= 0) {
                setDashboards([...dashboards as unknown as { name: string, kanbanId: string }[], dashboardItem]);
            } else {
                setDashboards([dashboardItem]);
            }
        } else {
            setDashboards([dashboardItem]);
        }

        console.log(dashboards);

        if (dashboardItem !== undefined) {
            console.log(JSON.stringify(dashboardItem));
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kanbanId: dashboardItem.kanbanId,
                    name: dashboardItem.name,
                }),
            };
            fetch('http://localhost:8080/api/dashboard/kanban/create', requestOptions).then(response => response.json()).then(data => console.log(data));
        }
    }

    const deleteKanban = (kanbanID: string) => {
        setDashboards((dash: { kanbanId: string, name: string }[]) => {
            const newDashboardList: { kanbanId: string, name: string }[] = dash.filter((ds: { kanbanId: string, name: string }) => ds.kanbanId != kanbanID);
            return newDashboardList as { kanbanId: string, name: string }[];
        });
    }

    return (
        <main className="w-full h-full flex flex-row items-start justify-between overflow-hidden">
            <ConfirmDelete
                message={confirmDeleteText}
                yesText={confirmDeleteYesText}
                noText={confirmDeleteNoText}
                yesFunction={confirmDeleteYesFunc}
                noFunction={confirmDeleteNoFunc}
                showPrompt={viewConfirmDelete}
            />
            <div className="grow relative w-56 h-full flex flex-col justify-start items-start shrink-0">
                <details className="p-2 hidden">
                    <summary>Seções</summary>
                    <div className="">
                        <Link href="/" className="my-1 flex flex-row items-center">
                            <UserGroupIcon className={IconStyles} />
                            <h1>Usuários</h1>
                        </Link>
                        <Link href="/" className="my-1 flex flex-row items-center">
                            <ServerStackIcon className={IconStyles} />
                            <h1>Areas de Trabalho</h1>
                        </Link>
                        <Link href="/" className="my-1 flex flex-row items-center">
                            <ChartPieIcon className={IconStyles} />
                            <h1>Relatorios</h1>
                        </Link>
                        <Link href="/" className="my-1 flex flex-row items-center">
                            <CalendarIcon className={IconStyles} />
                            <h1>Caléndario</h1>
                        </Link>
                    </div>
                </details>
                <div className="h-full flex flex-col justify-between overflow-hidden">
                    <details className="p-2 overflow-x-hidden overflow-y-auto">
                        <summary>Areas de Trabalho</summary>
                        <div className="">
                            {dashboards?.map((element, index) => <BoardMenuEntry
                                setConfirmDeleteMessage={setConfirmDeleteText}
                                setConfirmDeleteYesText={setConfirmDeleteYesText}
                                setConfirmDeleteNoText={setConfirmDeleteNoText}
                                setConfirmDeleteYesFunction={setConfirmDeleteYesFunc}
                                setConfirmDeleteNoFunction={setConfirmDeleteNoFunc}
                                setViewConfirmDelete={setViewConfirmDelete}
                                kanbanID={element.kanbanId}
                                key={index}
                                href={`/dashboard/board/${element.kanbanId}`}
                                name={element.name}
                                deleteKanban={deleteKanban} />)}
                        </div>
                        <div>

                            <form onSubmit={addDashBoard} className="flex flex-row justify-center items-center">
                                <input className="form-input border-none outline-none p-1 w-full mr-1 bg-neutral-50" name="boardname" placeholder="Adicionar nova area" type="text" />
                                <button type="submit" className="ml-1"><PlusCircleIcon className="aspect-square w-6" /></button>
                            </form>
                        </div>
                    </details>
                    <Link href="/dashboard/config" className="bg-neutral-50 p-2 flex flex-row items-center">
                        <Cog6ToothIcon className={`${IconStyles} hover:rotate-180 transition-all rotate-0`} />
                        <h1>Configurações</h1>
                    </Link>
                </div>
            </div>
            <div className="shadow-inner grow w-full h-full p-2 bg-neutral-100 rounded-tl-md">
                {children}
            </div>
        </main>
    );
}

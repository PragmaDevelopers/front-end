'use client';

import { useRouter } from "next/navigation";
import { CalendarIcon, ChartPieIcon, ServerStackIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BuildingOffice2Icon } from "@heroicons/react/24/solid";
import { generateRandomString } from "../utils/generators";
import { Cog6ToothIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useUserContext } from "../contexts/userContext";
import { API_BASE_URL } from "../utils/variables";
import ConfirmDelete from "../components/ui/ConfirmDelete";
import { CustomModal, CustomModalButtonAttributes } from "../components/ui/CustomModal";
import { isFlagSet } from "../utils/checkers";

interface BoardMenuEntryProps {
    href: string;
    name: string;
    deleteKanban: any;
    kanbanID: string | number;
    setModalTitle: any;
    setModalDescription: any;
    setModalText: any;
    setModalOptions: any;
    setModalOpen: any;
    setModalBorderColor: any;
    setModalFocusRef: any;
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

    const { userValue, updateUserValue } = useUserContext();

    const deleteCurrEntry = () => {
        props.deleteKanban(props.kanbanID);
        props.setModalOpen(false);
    }


    const noButtonRef = useRef<any>(null);

    const modalOpts: CustomModalButtonAttributes[] = [
        {
            text: "Sim",
            onclickfunc: deleteCurrEntry,
            type: "button",
            className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        },
        {
            text: "Não",
            onclickfunc: () => props.setModalOpen(false),
            ref: noButtonRef,
            type: "button",
            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
        }
    ]

    const modalOptsElements: any = modalOpts.map(
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

    const handleDeleteEntry = () => {
        if (isFlagSet(userValue.userData, "DELETAR_DASHBOARDS")) {
            props.setModalTitle("Deletar Dashboard");
            props.setModalDescription("Esta ação é irreversivel.");
            props.setModalText("Tem certeza que deseja continuar?");
            props.setModalBorderColor("border-red-500");
            props.setModalFocusRef(noButtonRef);
            props.setModalOptions(modalOptsElements);
            props.setModalOpen(true);
        } else {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => props.setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            props.setModalTitle("Ação Negada.");
            props.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            props.setModalText("Fale com seu administrador se isto é um engano.");
            props.setModalBorderColor("border-red-500");
            props.setModalFocusRef(noButtonRef);
            props.setModalOptions(modalOpt);
            props.setModalOpen(true);
        }
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

    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalDescription, setModalDescription] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalOptions, setModalOptions] = useState<any>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalBorderColor, setModalBorderColor] = useState<string>("");
    const [modalFocusRef, setModalFocusRef] = useState<any>();

    const noButtonRef = useRef<any>(null);





    const router = useRouter();

    const [dashboards, setDashboards] = useState<{ kanbanId: string | number, name: string }[]>([]);

    const [kanbanID, setKanbanID] = useState<string>("");

    const IconStyles: string = "w-8 aspect-square mr-2";

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban`, requestOptions).then(response => response.json()).then((data) => {
            setDashboards(data);
            console.log(data);
        })
    }, [setDashboards, userValue]);

    

    useEffect(() => {
        const returnToHome = () => {
            router.push("/");
        }
        if (userValue.token === "") {
            returnToHome();
        }
    }, [userValue, router]);

    const addDashBoard = (event: any) => {
        if (!isFlagSet(userValue.userData, "CRIAR_DASHBOARDS")) {
            const optAttrs: CustomModalButtonAttributes[] = [
                {
                    text: "Entendido.",
                    onclickfunc: () => setModalOpen(false),
                    ref: noButtonRef,
                    type: "button",
                    className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                }
            ];

            const modalOpt: any = optAttrs.map(
                (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

            setModalTitle("Ação Negada.");
            setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            setModalText("Fale com seu administrador se isto é um engano.");
            setModalBorderColor("border-red-500");
            setModalFocusRef(noButtonRef);
            setModalOptions(modalOpt);
            setModalOpen(true);
            return;
        } else {

            event.preventDefault();
            let boardname: string = event.target.boardname.value;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userValue.token}`,
                },
                body: JSON.stringify({
                    "title": boardname,
                }),
            };

            fetch(`${API_BASE_URL}/api/private/user/kanban`, requestOptions).then(response => response.text()).then((data) => {
                console.log("Kanban ID", data);
                setKanbanID(data);

            const dashboardItem: { name: string, kanbanId: string | number } = {
                name: boardname, kanbanId: data,
            }

            if (dashboards !== undefined) {
                if (dashboards?.length >= 0) {
                    setDashboards([...dashboards as unknown as { name: string, kanbanId: string | number }[], dashboardItem]);
                } else {
                    setDashboards([dashboardItem]);
                }
            } else {
                setDashboards([dashboardItem]);
            }
            });

        }
    }

    const deleteKanban = (kanbanID: string | number) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };

        fetch(`${API_BASE_URL}/api/private/user/kanban/${kanbanID}`, requestOptions).then(response => response.text()).then(data => console.log(data));

        setDashboards((dash: { kanbanId: string | number, name: string }[]) => {
            const newDashboardList: { kanbanId: string | number, name: string }[] = dash.filter((ds: { kanbanId: string | number, name: string }) => ds.kanbanId != kanbanID);
            return newDashboardList as { kanbanId: string | number, name: string }[];
        });
    }

    return (
        <main className="w-full h-full flex flex-row items-start justify-between overflow-hidden">
            <CustomModal
                title={modalTitle}
                description={modalDescription}
                text={modalText}
                options={modalOptions}
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                borderColor={modalBorderColor}
                focusRef={modalFocusRef}
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
                                setModalOptions={setModalOptions}
                                setModalOpen={setModalOpen}
                                setModalDescription={setModalDescription}
                                setModalFocusRef={setModalFocusRef}
                                setModalBorderColor={setModalBorderColor}
                                setModalTitle={setModalTitle}
                                setModalText={setModalText}
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

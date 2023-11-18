"use client";
import SwitchButton from "@/app/components/ui/SwitchButton";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface ToggleOptionProps {
    optionText: string;
    srText: string;
    onFunction: any;
    offFunction: any;
    className?: string;
}

function ToggleOption(props: ToggleOptionProps) {
    const { optionText, offFunction, onFunction, srText, className } = props;

    return (
        <div className={className + " my-1 flex justify-between items-center w-fit h-fit"}>
            <p className="mr-4">{optionText}</p>
            <SwitchButton srText={srText} onFunction={onFunction} offFunction={offFunction} />
        </div>
    );
}

/*
 * Criar Cards
 * Mover Cards
 * Deletar Cards
 * Editar Cards
 * Criar Colunas
 * Mover Colunas
 * Deletar Colunas
 * Editar Colunas
 * Criar Checklists
 * Editar Checklists
 * Deletar Checklists
 * Criar Prazos
 * Editar Prazos
 * Deletar Prazos
 * Cargo Administrativo
 * Cargo de Supervisão
 * Criar Comentarios
 * Editar Comentarios Próprios
 * Editar Comentarios Externos
 * Deletar Comentarios
 * */

export default function Page() {
    const router = useRouter();
    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-start relative p-4 w-full h-[80%] overflow-hidden">
                <div className="w-[50%] h-fit p-2 bg-neutral-50 drop-shadow-md rounded-md flex flex-col justify-start items-center overflow-auto">
                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Cards</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Cards" srText="Alternar Permissão de Criar Cards"
                                onFunction={() => console.log("Criar Cards ON")} offFunction={() => console.log("Criar Cards OFF")} />
                            <ToggleOption optionText="Mover Cards" srText="Alternar Permissão de Mover Cards"
                                onFunction={() => console.log("Mover Cards ON")} offFunction={() => console.log("Mover Cards OFF")} />
                            <ToggleOption optionText="Deletar Cards" srText="Alternar Permissão de Deletar Cards"
                                onFunction={() => console.log("Deletar Cards ON")} offFunction={() => console.log("Deletar Cards OFF")} />
                            <ToggleOption optionText="Editar Cards" srText="Alternar Permissão de Editar Cards"
                                onFunction={() => console.log("Editar Cards ON")} offFunction={() => console.log("Editar Cards OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Colunas</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Colunas" srText="Alternar Permissão de Criar Colunas"
                                onFunction={() => console.log("Criar Colunas ON")} offFunction={() => console.log("Criar Colunas OFF")} />
                            <ToggleOption optionText="Mover Colunas" srText="Alternar Permissão de Mover Colunas"
                                onFunction={() => console.log("Mover Colunas ON")} offFunction={() => console.log("Mover Colunas OFF")} />
                            <ToggleOption optionText="Deletar Colunas" srText="Alternar Permissão de Deletar Colunas"
                                onFunction={() => console.log("Deletar Colunas ON")} offFunction={() => console.log("Deletar Colunas OFF")} />
                            <ToggleOption optionText="Editar Colunas" srText="Alternar Permissão de Editar Colunas"
                                onFunction={() => console.log("Editar Colunas ON")} offFunction={() => console.log("Editar Colunas OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Checklists</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Checklists" srText="Alternar Permissão de Criar Checklists"
                                onFunction={() => console.log("Criar Checklists ON")} offFunction={() => console.log("Criar Checklists OFF")} />
                            <ToggleOption optionText="Deletar Checklists" srText="Alternar Permissão de Deletar Checklists"
                                onFunction={() => console.log("Deletar Checklists ON")} offFunction={() => console.log("Deletar Checklists OFF")} />
                            <ToggleOption optionText="Editar Checklists" srText="Alternar Permissão de Editar Checklists"
                                onFunction={() => console.log("Editar Checklists ON")} offFunction={() => console.log("Editar Checklists OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Dashboards</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Dashboards" srText="Alternar Permissão de Criar Dashboards"
                                onFunction={() => console.log("Criar Dashboards ON")} offFunction={() => console.log("Criar Dashboards OFF")} />
                            <ToggleOption optionText="Deletar Dashboards" srText="Alternar Permissão de Deletar Dashboards"
                                onFunction={() => console.log("Deletar Checklists ON")} offFunction={() => console.log("Deletar Dashboards OFF")} />
                            <ToggleOption optionText="Editar Dashboards" srText="Alternar Permissão de Editar Dashboards"
                                onFunction={() => console.log("Editar Dashboards ON")} offFunction={() => console.log("Editar Dashboards OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Prazos</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Prazos" srText="Alternar Permissão de Criar Prazos"
                                onFunction={() => console.log("Criar Prazos ON")} offFunction={() => console.log("Criar Prazos OFF")} />
                            <ToggleOption optionText="Deletar Prazos" srText="Alternar Permissão de Deletar Prazos"
                                onFunction={() => console.log("Deletar Prazos ON")} offFunction={() => console.log("Deletar Prazos OFF")} />
                            <ToggleOption optionText="Editar Prazos" srText="Alternar Permissão de Editar Prazos"
                                onFunction={() => console.log("Editar Prazos ON")} offFunction={() => console.log("Editar Prazos OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Comentários</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Criar Comentários" srText="Alternar Permissão de Criar Comentários"
                                onFunction={() => console.log("Criar Comentários ON")} offFunction={() => console.log("Criar Comentários OFF")} />
                            <ToggleOption optionText="Editar Comentários Próprios" srText="Alternar Permissão de Editar Comentários Próprios"
                                onFunction={() => console.log("Editar Comentários Prop ON")} offFunction={() => console.log("Editar Comentários Prop OFF")} />
                            <ToggleOption optionText="Editar Comentários Externos" srText="Alternar Permissão de Editar Comentários Externos"
                                onFunction={() => console.log("Editar Comentários Ext ON")} offFunction={() => console.log("Editar Comentários Ext OFF")} />
                            <ToggleOption optionText="Deletar Comentários" srText="Alternar Permissão de Deletar Comentários"
                                onFunction={() => console.log("Deletar Comentários ON")} offFunction={() => console.log("Deletar Comentários OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Notificações</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Receber Notificações de Sistema" srText="Receber Notificações de Sistema"
                                onFunction={() => console.log("Notif Sis ON")} offFunction={() => console.log("Notif Sis OFF")} />
                            <ToggleOption optionText="Receber Notificações Push" srText="Receber Notificações Push"
                                onFunction={() => console.log("Notif Push ON")} offFunction={() => console.log("Notif Push OFF")} />
                        </div>
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2">Cargos Especiais</h1>
                        <div className="flex flex-col justify-start items-center">
                            <ToggleOption optionText="Cargo Administrativo" srText="Alternar o Cargo Administrativo"
                                onFunction={() => console.log("Admin ON")} offFunction={() => console.log("Admin OFF")} />
                            <ToggleOption optionText="Cargo Supervisor" srText="Alternar o Cargo de Supervisão"
                                onFunction={() => console.log("Supervisor ON")} offFunction={() => console.log("Supervisor OFF")} />
                        </div>
                    </div>
                </div>
                <button type="button"
                    className="mt-4 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                    Salvar
                </button>
            </div>
        </main>
    );
}


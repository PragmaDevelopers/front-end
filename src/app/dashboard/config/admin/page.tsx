"use client";
import SwitchButton from "@/app/components/ui/SwitchButton";
import { useUserContext } from "@/app/contexts/userContext";
import { userData, userValueDT } from "@/app/types/KanbanTypes";
import { SYSTEM_PERMISSIONS, SYSTEM_PERMISSIONS_BOOLEAN } from "@/app/utils/variables";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

interface ToggleOptionProps {
    optionText: string;
    srText: string;
    onFunction: any;
    offFunction: any;
    className?: string;
    defaultValue: boolean;
}

function binaryStringToPermissions(binaryString: string): { [Key: string]: boolean } {
    let permissions: { [Key: string]: boolean } = { ...SYSTEM_PERMISSIONS_BOOLEAN };

    for (let i = 0; i < binaryString.length; i++) {
        const key = Object.keys(permissions)[i];
        permissions[key] = binaryString[i] === '1';
    }

    return permissions;
}

function isFlagSet(userValue: userData, flag: string): boolean {
    let bitMask: number = SYSTEM_PERMISSIONS[flag];
    let binaryValue: number = parseInt(userValue.permissionLevel, 2);
    return (binaryValue & bitMask) !== 0;
}

function ToggleBitFlag(
    setBit: boolean,
    flag: string,
    updateUserValue: (selectedUser: userData) => void,
    selectedUser: userData): void {

    let tempUsr: userData = selectedUser;

    let binaryNumber = parseInt(tempUsr.permissionLevel, 2);
    const bitmask: number = SYSTEM_PERMISSIONS[flag];
    binaryNumber = setBit ? binaryNumber | bitmask : binaryNumber & ~bitmask;
    tempUsr.permissionLevel = binaryNumber.toString(2);

    console.log(`SETTING FLAG: ${flag} to ${setBit} for user ${tempUsr.name}; current PermsValue: ${tempUsr.permissionLevel}`);
    updateUserValue(tempUsr);
}

function ToggleOption(props: ToggleOptionProps) {
    const { optionText, offFunction, onFunction, srText, className, defaultValue } = props;

    return (
        <div className={className + " my-1 flex justify-between items-center w-full h-fit"}>
            <div className="flex flex-row justify-between items-center w-fit h-fit">
                <SwitchButton defaultValue={defaultValue} srText={srText} onFunction={onFunction} offFunction={offFunction} />
                <p className="ml-4">{optionText}</p>
            </div>
            <div className="p-2 w-fit h-fit">
                <div className="group relative flex flex-row justify-between items-center">
                    <span className="text-sm text-neutral-600 group-hover:opacity-100 opacity-0 mr-2 transition-all">{srText}</span>
                    <InformationCircleIcon className="aspect-square w-6 stroke-blue-300" />
                </div>
            </div>
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


function updateSelectedUser(userValue: userValueDT,
    updateUserValue: (newValue: userValueDT) => void,
    updatedUser: userData): void {
    let tmpUsrVal: userValueDT = userValue;
    tmpUsrVal.usersList.map((user: userData) => user.id === updatedUser.id ? updatedUser : user);

    updateUserValue(tmpUsrVal);
}

export default function Page() {
    const router = useRouter();
    const { userValue, updateUserValue } = useUserContext();
    const [usrPermsVal, setUsrPermsVal] = useState<{ [Key: string]: boolean }>({});
    const [isUserSupervisor, setIsUserSupervisor] = useState<boolean>(false);

    const handleUpdateSelectedUser = (selectedUser: userData) => {
        updateSelectedUser(userValue, updateUserValue, selectedUser);
    }

    let people: userData[] = userValue.usersList;

    const [selected, setSelected] = useState<userData>(people[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? people
            : people.filter((person: userData) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })

    const handleToggleFlag = (flagName: string, value: boolean) => {
        ToggleBitFlag(value, flagName, handleUpdateSelectedUser, selected);
    }

    const handleSetSelect = (value: userData): void => {
        console.log(value);
        setSelected(value);
        const newUserPermsVal: { [Key: string]: boolean } = binaryStringToPermissions(value.permissionLevel);
        setUsrPermsVal(newUserPermsVal);
    }


    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
            </div>

            <div className="w-full flex flex-row justify-center items-center">
                <div className="w-[75%] flex flex-row justify-center items-center">
                    <h1 className="mr-2">Editando permissões para o usuário: </h1>
                    <div className="w-96 ml-2">
                        <Combobox value={selected} onChange={handleSetSelect}>
                            <div className="relative mt-1">
                                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                    <Combobox.Input
                                        className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                        displayValue={(person: userData) => person.name}
                                        onChange={(event: any) => setQuery(event.target.value)}
                                    />
                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </Combobox.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    afterLeave={() => setQuery('')}
                                >
                                    <Combobox.Options className="z-50 form-select absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                        {filteredPeople.length === 0 && query !== '' ? (
                                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                Nothing found.
                                            </div>
                                        ) : (
                                            filteredPeople.map((person) => (
                                                <Combobox.Option
                                                    key={person.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={person}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                            >
                                                                {person.name}
                                                            </span>
                                                            {selected ? (
                                                                <span
                                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-teal-600' : 'text-teal-600'
                                                                        }`}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            ))
                                        )}
                                    </Combobox.Options>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                </div>

            </div>

            <div className="mt-4 flex flex-col items-center justify-start relative p-4 w-full h-[85%] overflow-hidden">
                <div className="w-[75%] h-fit p-2 bg-neutral-50 drop-shadow-md rounded-md flex flex-col justify-start items-center overflow-auto">
                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Cards</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_CARDS"]} optionText="Criar Cards" srText="Alternar Permissão de Criar Cards"
                                onFunction={() => handleToggleFlag("CRIAR_CARDS", true)} offFunction={() => handleToggleFlag("CRIAR_CARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["MOVER_CARDS"]} optionText="Mover Cards" srText="Alternar Permissão de Mover Cards"
                                onFunction={() => handleToggleFlag("MOVER_CARDS", true)} offFunction={() => handleToggleFlag("MOVER_CARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_CARDS"]} optionText="Deletar Cards" srText="Alternar Permissão de Deletar Cards"
                                onFunction={() => handleToggleFlag("DELETAR_CARDS", true)} offFunction={() => handleToggleFlag("DELETAR_CARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_CARDS"]} optionText="Editar Cards" srText="Alternar Permissão de Editar Cards"
                                onFunction={() => handleToggleFlag("EDITAR_CARDS", true)} offFunction={() => handleToggleFlag("EDITAR_CARDS", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Colunas</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_COLUNAS"]} optionText="Criar Colunas" srText="Alternar Permissão de Criar Colunas"
                                onFunction={() => handleToggleFlag("CRIAR_COLUNAS", true)} offFunction={() => handleToggleFlag("CRIAR_COLUNAS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["MOVER_COLUNAS"]} optionText="Mover Colunas" srText="Alternar Permissão de Mover Colunas"
                                onFunction={() => handleToggleFlag("MOVER_COLUNAS", true)} offFunction={() => handleToggleFlag("MOVER_COLUNAS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_COLUNAS"]} optionText="Deletar Colunas" srText="Alternar Permissão de Deletar Colunas"
                                onFunction={() => handleToggleFlag("DELETAR_COLUNAS", true)} offFunction={() => handleToggleFlag("DELETAR_COLUNAS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_COLUNAS"]} optionText="Editar Colunas" srText="Alternar Permissão de Editar Colunas"
                                onFunction={() => handleToggleFlag("EDITAR_COLUNAS", true)} offFunction={() => handleToggleFlag("EDITAR_COLUNAS", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Checklists</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_CHECKLISTS"]} optionText="Criar Checklists" srText="Alternar Permissão de Criar Checklists"
                                onFunction={() => handleToggleFlag("CRIAR_CHECKLISTS", true)} offFunction={() => handleToggleFlag("CRIAR_CHECKLISTS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_CHECKLISTS"]} optionText="Deletar Checklists" srText="Alternar Permissão de Deletar Checklists"
                                onFunction={() => handleToggleFlag("DELETAR_CHECKLISTS", true)} offFunction={() => handleToggleFlag("DELETAR_CHECKLISTS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_CHECKLISTS"]} optionText="Editar Checklists" srText="Alternar Permissão de Editar Checklists"
                                onFunction={() => handleToggleFlag("EDITAR_CHECKLISTS", true)} offFunction={() => handleToggleFlag("EDITAR_CHECKLISTS", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Dashboards</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_DASHBOARDS"]} optionText="Criar Dashboards" srText="Alternar Permissão de Criar Dashboards"
                                onFunction={() => handleToggleFlag("CRIAR_DASHBOARDS", true)} offFunction={() => handleToggleFlag("CRIAR_DASHBOARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_DASHBOARDS"]} optionText="Deletar Dashboards" srText="Alternar Permissão de Deletar Dashboards"
                                onFunction={() => handleToggleFlag("DELETAR_DASHBOARDS", true)} offFunction={() => handleToggleFlag("DELETAR_DASHBOARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_DASHBOARDS"]} optionText="Editar Dashboards" srText="Alternar Permissão de Editar Dashboards"
                                onFunction={() => handleToggleFlag("EDITAR_DASHBOARDS", true)} offFunction={() => handleToggleFlag("EDITAR_DASHBOARDS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["CONVIDAR_PARA_O_KANBAN"]} optionText="Convidar para Dashboards" srText="Alternar Permissão de Convidar para Dashboards"
                                onFunction={() => handleToggleFlag("CONVIDAR_PARA_O_KANBAN", true)} offFunction={() => handleToggleFlag("CONVIDAR_PARA_O_KANBAN", false)} />
                            <ToggleOption defaultValue={usrPermsVal["RETIRAR_DO_KANBAN"]} optionText="Remover da Dashboards" srText="Alternar Permissão de Remover da Dashboards"
                                onFunction={() => handleToggleFlag("RETIRAR_DO_KANBAN", true)} offFunction={() => handleToggleFlag("RETIRAR_DO_KANBAN", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Prazos</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_PRAZOS"]} optionText="Criar Prazos" srText="Alternar Permissão de Criar Prazos"
                                onFunction={() => handleToggleFlag("CRIAR_PRAZOS", true)} offFunction={() => handleToggleFlag("CRIAR_PRAZOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_PRAZOS"]} optionText="Deletar Prazos" srText="Alternar Permissão de Deletar Prazos"
                                onFunction={() => handleToggleFlag("DELETAR_PRAZOS", true)} offFunction={() => handleToggleFlag("DELETAR_PRAZOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_PRAZOS"]} optionText="Editar Prazos" srText="Alternar Permissão de Editar Prazos"
                                onFunction={() => handleToggleFlag("EDITAR_PRAZOS", true)} offFunction={() => handleToggleFlag("EDITAR_PRAZOS", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Comentários</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["CRIAR_COMENTÁRIOS"]} optionText="Criar Comentários" srText="Alternar Permissão de Criar Comentários"
                                onFunction={() => handleToggleFlag("CRIAR_COMENTÁRIOS", true)} offFunction={() => handleToggleFlag("CRIAR_COMENTÁRIOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_COMENTÁRIOS_PRÓPRIOS"]} optionText="Editar Comentários Próprios" srText="Alternar Permissão de Editar os Próprios Comentários"
                                onFunction={() => handleToggleFlag("EDITAR_COMENTÁRIOS_PRÓPRIOS", true)} offFunction={() => handleToggleFlag("EDITAR_COMENTÁRIOS_PRÓPRIOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["EDITAR_COMENTÁRIOS_EXTERNOS"]} optionText="Editar Comentários Externos" srText="Alternar Permissão de Editar Comentários de Outros Usuários"
                                onFunction={() => handleToggleFlag("EDITAR_COMENTÁRIOS_EXTERNOS", true)} offFunction={() => handleToggleFlag("EDITAR_COMENTÁRIOS_EXTERNOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_COMENTÁRIOS_PRÓPRIOS"]} optionText="Deletar Comentários Próprios" srText="Alternar Permissão de Deletar Comentários Próprios"
                                onFunction={() => handleToggleFlag("DELETAR_COMENTÁRIOS_PRÓPRIOS", true)} offFunction={() => handleToggleFlag("DELETAR_COMENTÁRIOS_PRÓPRIOS", false)} />
                            <ToggleOption defaultValue={usrPermsVal["DELETAR_COMENTÁRIOS_EXTERNOS"]} optionText="Deletar Comentários Externos" srText="Alternar Permissão de Deletar Comentários Externos"
                                onFunction={() => handleToggleFlag("DELETAR_COMENTÁRIOS_EXTERNOS", true)} offFunction={() => handleToggleFlag("DELETAR_COMENTÁRIOS_EXTERNOS", false)} />

                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Notificações</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={usrPermsVal["RECEBER_NOTIFICAÇÕES_DE_SISTEMA"]} optionText="Receber Notificações de Sistema" srText="Receber Notificações de Sistema"
                                onFunction={() => handleToggleFlag("RECEBER_NOTIFICAÇÕES_DE_SISTEMA", true)} offFunction={() => handleToggleFlag("RECEBER_NOTIFICAÇÕES_DE_SISTEMA", false)} />
                            <ToggleOption defaultValue={usrPermsVal["RECEBER_NOTIFICAÇÕES_PUSH"]} optionText="Receber Notificações Push" srText="Receber Notificações Push"
                                onFunction={() => handleToggleFlag("RECEBER_NOTIFICAÇÕES_PUSH", true)} offFunction={() => handleToggleFlag("RECEBER_NOTIFICAÇÕES_PUSH", false)} />
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center my-1">
                        <hr className="w-[96%] h-0.5 bg-neutral-200" />
                    </div>

                    <div className="my-4 w-full">
                        <h1 className="font-semibold text-lg mb-2 text-center">Cargos Especiais</h1>
                        <div className="flex flex-col justify-start items-start">
                            <ToggleOption defaultValue={isUserSupervisor} optionText="Cargo Supervisor" srText="Alternar o Cargo de Supervisão"
                                onFunction={() => setIsUserSupervisor(true)} offFunction={() => setIsUserSupervisor(true)} />
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

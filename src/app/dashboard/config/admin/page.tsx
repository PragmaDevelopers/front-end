"use client";
import SwitchButton from "@/app/components/ui/SwitchButton";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ToggleOptionProps {
    optionText: string;
    srText: string;
    onFunction: any;
    offFunction: any;
}

function ToggleOption(props: ToggleOptionProps) {
    const { optionText, offFunction, onFunction, srText } = props;

    return (
        <div className="flex justify-between items-center w-fit h-fit">
            <p className="ml-4">{optionText}</p>
            <SwitchButton srText={srText} onFunction={onFunction} offFunction={offFunction} />
        </div>
    );
}

export default function Page() {
    const router = useRouter();
    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-between relative p-4">
                <div className="w-fit h-fit p-2 bg-neutral-50 drop-shadow-md rounded-md">
                    <ToggleOption optionText="Criar Cards" srText="Alternar Permissão" onFunction={() => console.log("ON")} offFunction={() => console.log("OFF")} />
                </div>
            </div>
        </main>
    );
}


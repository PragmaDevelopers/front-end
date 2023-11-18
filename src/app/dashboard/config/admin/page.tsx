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

export default function Page() {
    const router = useRouter();
    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-start relative p-4 w-full h-full overflow-hidden">
                <div className="p-2 bg-neutral-50 drop-shadow-md rounded-md w-[90%] flex flex-col justify-start items-end overflow-auto">
                    <ToggleOption optionText="Criar Cards" srText="Alternar Permissão"
                        onFunction={() => console.log("Criar Cards ON")} offFunction={() => console.log("Criar Cards OFF")} />
                    <ToggleOption optionText="Mover Cards" srText="Alternar Permissão"
                        onFunction={() => console.log("Mover Cards ON")} offFunction={() => console.log("Mover Cards OFF")} />
                    <ToggleOption optionText="Deletar Cards" srText="Alternar Permissão"
                        onFunction={() => console.log("Deletar Cards ON")} offFunction={() => console.log("Deletar Cards OFF")} />
                </div>
                <button type="button" className="mt-4 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                    Salvar
                </button>
            </div>
        </main>
    );
}


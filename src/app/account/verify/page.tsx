"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/variables";
import Link from "next/link";

export default function Page() {
    const searchParams = useSearchParams();
    const [isValid,setIsValid] = useState<boolean | null>(null);
    useEffect(()=>{
        const requestOptions = {
			method: 'PATCH'
		};
        if(searchParams.get("code") != null){
            fetch(`${API_BASE_URL}/api/public/user/verify/`+searchParams.get("code"), requestOptions)
            .then(response => response.text()).then(() => {
                setIsValid(true);
            });
        }else{
            setIsValid(false);
        }
    },[]);
    return (
        <main className="w-full h-full overflow-x-hidden flex flex-col items-center justify-center">
            <div className="select-none flex justify-start items-start flex-col w-max">
                {
                    isValid == null && (
                        <h1 className="text-neutral-400 text-xl font-semibold my-1">Carregando...</h1>
                    )
                }
                {
                    isValid == true && (
                        <>
                            <h1 className="text-neutral-400 text-xl font-semibold my-1">Sucesso na validação!</h1>
                            <Link href="/" className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md mx-auto mt-3 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all">Tela inicial</Link>
                        </>
                    )
                }
                {
                    isValid == false && (
                        <>
                            <h1 className="text-neutral-400 text-xl font-semibold my-1">Erro na validação!</h1>
                            <Link href="/" className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md mx-auto mt-3 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all">Tela inicial</Link>
                        </>
                    )
                }
            </div>
        </main>
    );
}
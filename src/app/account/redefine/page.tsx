"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/variables";
import Link from "next/link";

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isValid,setIsValid] = useState<boolean | null>(null);
    useEffect(()=>{
        if(searchParams.get("token") != null){
            setIsValid(true);
        }else{
            setIsValid(false);
        }
    },[]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        const requestOptions = {
            method: 'PATCH',
            Authorization: "Bearer "+searchParams.get("token"),
            body: JSON.stringify({
                password: e.target.userpassword.value
            })
		};
        fetch(`${API_BASE_URL}/api/private/user/profile`, requestOptions)
        .then(response => response.text()).then(() => {
            console.log("REDEFINE PASSWORD");
            router.push("/");
        });
        e.target.reset();
    }

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
                            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                                <input name="userpassword" type="password" placeholder="Insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" autoComplete="current-password" />
                                <div className="flex mt-3 justify-between w-full">
                                    <button className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all" type="submit">Salvar</button>
                                    <Link href="/" className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all">Tela inicial</Link>
                                </div>
                            </form>
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
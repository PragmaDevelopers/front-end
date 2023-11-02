"use client";
import { ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { hashString } from "./utils/security";
import { useRouter } from "next/navigation";

interface InfoScreenProps {
    emailState: boolean;
    passwordState: boolean;
    formSubmit: boolean;
}

function InfoScreen(props: InfoScreenProps) {
    const baseStyle: string = "w-max absolute top-0 z-10 select-none";

    if (!props.passwordState && !props.emailState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Bem-Vindo(a)!</h1>
                <h2 className="text-lg text-neutral-500">Insira suas credenciais para acessar o sistema.</h2>
                <div className="fill-blue-300 flex flex-row justify-start items-center mt-2 bg-blue-50 border-l-2 border-blue-300">
                    <InformationCircleIcon className="stroke-blue-400 fill-blue-100 aspect-square w-6 mr-2" />
                    <h3>Caso não esteja cadastrado, ultilize o botão <span className="bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 text-neutral-950">Cadastrar-se</span></h3>
                </div>
            </div>
        );
    } else if (!props.passwordState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Sua senha está incorreta.</h3>
                </div>
            </div>
        );
    } else if (!props.emailState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Seu email está incorreto.</h3>
                </div>
            </div>
        );
    } else {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Seu email e sua senha estão incorretos.</h3>
                </div>
            </div>
        );
    }
}

export default function Page() {
    const [cadastrarSe, setCadastrarSe] = useState<boolean>(false);
    const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    const [userCanLogin, setUserCanLogin] = useState<boolean>(false);
    const [formFirstSubmit, setFormFirstSubmit] = useState<boolean>(false);
    const switchCadastrarSe = () => setCadastrarSe(!cadastrarSe);
    const router = useRouter();

    const loginUser = (e: any) => {
        e.preventDefault();
        setFormFirstSubmit(true);

        const useremail: string = hashString(e?.target?.useremail?.value);
        const userpassword: string = hashString(e?.target?.userpassword?.value);
        let emailcheck: boolean = false;
        let passwcheck: boolean = false;
        if (useremail === "1e23d461552b906fea005f95e067816dc68124b4e9966d9898765a09b327e0ca") {
            setEmailCheck(true);
            emailcheck = true;
        }
        if (userpassword === "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646") {
            setPasswordCheck(true);
            passwcheck = true;
        }

        if (emailcheck && passwcheck) {
            setUserCanLogin(true);
        }

        e.target.reset();
    }

    if (userCanLogin) {
        router.push("/dashboard");
        return;
    }

    return (
        <main className="bg-neutral-50 text-neutral-950 flex flex-row justify-center items-center w-screen h-screen transition-all">
            <div className="h-[90%] w-[60%] relative flex justify-center items-center">
                <InfoScreen emailState={emailCheck} passwordState={passwordCheck} formSubmit={formFirstSubmit} />
                <form className="flex flex-col items-center mb-4 h-48" onSubmit={loginUser}>
                    {cadastrarSe ? (
                        <div className="h-fit bg-neutral-50 drop-shadow-md rounded-md p-2 border-neutral-200 border-[1px]">
                            <div className="flex flex-col">
                                <input type="text" placeholder="Insira seu nome" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                                <input type="email" placeholder="Insira seu email" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                                <input type="text" placeholder="Insira sua nacionalidade" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                                <input type="text" placeholder="Insira seu genero" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <input type="password" placeholder="Insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1 mr-1" autoComplete="current-password" />
                                <input type="password" placeholder="Re-insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1 ml-1" autoComplete="current-password" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-96 flex flex-col bg-neutral-50 drop-shadow-md rounded-md p-2 border-neutral-200 border-[1px]">
                            <input name="useremail" type="email" placeholder="Insira seu email" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                            <input name="userpassword" type="password" placeholder="Insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" autoComplete="current-password" />
                        </div>
                    )}
                    <div className="w-96 flex flex-row justify-between items-center mt-4">
                        <button className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all" type="submit">{cadastrarSe ? 'Finalizar Cadastro' : 'Entrar'}</button>
                        <button className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all" type="button" onClick={switchCadastrarSe}>{cadastrarSe ? 'Voltar' : 'Cadastrar-se'}</button>
                    </div>
                </form>
            </div>
        </main>
    );
}

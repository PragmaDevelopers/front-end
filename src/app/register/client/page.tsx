"use client"

import React, { useState, useEffect, useRef } from "react";
import { AccordionItem } from "@/app/components/register/client/form/Accordion/Accordion";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/variables";
import { useUserContext } from "@/app/contexts/userContext";
import ClientTemplateHandle from "@/app/components/register/client/template/ClientTemplateHandle";
import CreateTemplateInput from "@/app/components/register/client/template/CreateTemplateInput";
import DeleteTemplateInput from "@/app/components/register/client/template/DeleteTemplateInput";
import { CepDataProps } from "@/app/interfaces/RegisterClientInterfaces";
import { CustomModal, CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { useModalContext } from "@/app/contexts/modalContext";
import { CreateClientTemplate } from "@/app/utils/register/client/ClientTemplateModal";

export default function SignUpPageB() {
    const [currentTemplate, setCurrentTemplate] = useState<{ pessoa_fisica: any[], pessoa_juridica: any[] }>({
        pessoa_fisica: [],
        pessoa_juridica: []
    });

    const [templateList, setTemplateList] = useState<{
        id: number,
        name: string,
        template: {
            pessoa_fisica: {title:string,inputs:any[]}[],
            pessoa_juridica: {title:string,inputs:any[]}[]
        }
    }[]>([]);

    const [inputCreateModal, setInputCreateModal] = useState<boolean>(false);
    const [inputRemoveModal, setInputRemoveModal] = useState<boolean>(false);
    const [useDraftModal, setUseDraftModal] = useState<boolean>(false);

    const [typePerson, setTypePerson] = useState<"pessoa_fisica" | "pessoa_juridica">("pessoa_fisica");
    const [cepValue, setCepValue] = useState("")
    const [addressValue, setAddressValue] = useState<CepDataProps>({
        estado: "",
        localidade: "",
        bairro: "",
        logradouro: ""
    })

    const router = useRouter();
    const { userValue } = useUserContext();
    const modalContextProps = useModalContext();

    const returnToHome = () => {
        router.push("/");
    }

    useEffect(() => {
        if (userValue.token === "") {
            returnToHome();
        }
    }, [userValue, router]);

    useEffect(() => {

        if (userValue.token === "") {
            returnToHome();
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            }
        };
        
        fetch(`${API_BASE_URL}/api/private/user/signup/client/templates?value=false`, requestOptions)
        .then(response => response.json()).then((clientTemplates:any) => {
            setTemplateList(clientTemplates);
            if (clientTemplates.length != 0) {
                setCurrentTemplate(clientTemplates[0].template)
            }
        });
    }, [])

    async function searchCep(cep: string) {
        cep = cep.replace(/\D/g, ""); //Substituí o que não é dígito por "", /g é [Global][1]
        if (cep.length <= 8) {
            setCepValue(cep.replace(/^(\d{5})(\d{3})$/g, "$1-$2"));
            if (cep.length == 8) {
                const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`).catch(error => alert(error));
                if (data) {
                    const response = await data.json();
                    setAddressValue({
                        estado: response.uf || "",
                        localidade: response.localidade || "",
                        bairro: response.bairro || "",
                        logradouro: response.logradouro || ""
                    })
                }
            } else {
                setAddressValue({
                    ...addressValue,
                    estado: ""
                })
            }
        }
    }

    const noButtonRef = useRef<HTMLButtonElement>(null);

    const failOption: CustomModalButtonAttributes[] = [
        {
            text: "Entendido.",
            onclickfunc: () => modalContextProps.setModalOpen(false),
            ref: noButtonRef,
            type: "button",
            className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
        }
    ];

    const failModalOption: any = failOption.map(
        (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
    );

    return (
        <div className="w-full h-full overflow-auto flex justify-center items-start bg-neutral-100">
            <CustomModal description={modalContextProps.modalDescription} focusRef={modalContextProps.modalFocusRef} 
                isOpen={modalContextProps.modalOpen} options={modalContextProps.modalOptions} 
                setIsOpen={modalContextProps.setModalOpen} text={modalContextProps.modalText} title={modalContextProps.modalTitle} borderColor={modalContextProps.modalBorderColor} 
            />
            <div className="p-3 w-full max-w-4xl">
                <div className="flex justify-between items-center">
                    <div>
                        <button className="bg-neutral-50 drop-shadow rounded-md p-2 me-3" onClick={() => {
                            setInputCreateModal(!inputCreateModal);
                            setInputRemoveModal(false);
                            setUseDraftModal(false)
                        }} type="button">Criar Input</button>
                        <button className="bg-neutral-50 drop-shadow rounded-md p-2 me-3" onClick={() => {
                            setInputRemoveModal(!inputRemoveModal);
                            setInputCreateModal(false);
                            setUseDraftModal(false)
                        }} type="button">Remover Input</button>
                        <button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
                            setUseDraftModal(!useDraftModal);
                            setInputCreateModal(false);
                            setInputRemoveModal(false);
                        }} type="button">Rascunhos</button>
                    </div>
                </div>
                <div className="flex gap-5">
                    {
                        inputCreateModal && <CreateTemplateInput
                            typePerson={typePerson}
                            currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}
                        />
                    }
                    {
                        inputRemoveModal && <DeleteTemplateInput
                            typePerson={typePerson}
                            currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}
                        />
                    }
                    {
                        useDraftModal && <ClientTemplateHandle
                            templateList={templateList} setTemplateList={setTemplateList}
                            currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}
                        />
                    }
                </div>
                <form onSubmit={(e: any) => {
                    e.preventDefault();

                    let clientSignUp: any = {};
                    for (let i = 0; i < e.target.length; i++) {
                        if(e.target[i].name != "" && e.target[i].name != "nome_identificador"){
                            clientSignUp[e.target[i].name] = e.target[i].value;
                        }
                    }

                    CreateClientTemplate(
                        true,
                        userValue,
                        {
                            name: e.target.nome_identificador.value,
                            template: clientSignUp
                        },
                        templateList,
                        setTemplateList,
                        failModalOption,
                        noButtonRef,
                        modalContextProps
                    );

                    e.target.reset();  
                }}>
                    <div className="flex items-center justify-end mt-3">
                        <input name="nome_identificador" type="text" placeholder="Nome do cliente" />
                        <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center ms-3 border-gray-400" type="submit">Enviar</button>
                    </div>
                {
                    currentTemplate[typePerson].length != 0 ? (
                        currentTemplate[typePerson].map((accordion: any, accordionIndex) => {
                            return <div key={accordionIndex} className="bg-gray-50 drop-shadow rounded-md mt-3 p-5">
                                <AccordionItem className="flex flex-wrap items-center justify-center" title={accordion.title}>
                                    {
                                        accordion.title === "Cliente" && (
                                            <div className="mb-2 w-2/4 border-x-8 border-neutral-50">
                                                <label className="block">Tipo Pessoa (conjunto fixo)</label>
                                                <div onChange={(e: any) => {
                                                    setTypePerson(e.target.value.toLowerCase().replace(" ", "_").replace("í", "i"))
                                                }} className="inline-block">
                                                    <input required className="mx-1" type="radio" id="input-tipo-pessoa-fisica" name="tipo_pessoa" value="Pessoa Física" />
                                                    <label htmlFor="input-tipo-pessoa-fisica">Pessoa física</label>
                                                    <input required className="mx-1" type="radio" id="input-tipo-pessoa-juridica" name="tipo_pessoa" value="Pessoa Jurídica" />
                                                    <label htmlFor="input-tipo-pessoa-juridica">Pessoa jurídica</label>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {accordion.inputs.map((input: any, inputIndex: number) => {
                                        return (
                                            <div className="mb-2 w-2/4 border-x-8 border-neutral-50" key={inputIndex}>
                                                {
                                                    ["radio", "checkbox"].includes(input.type) && (
                                                        <>
                                                            <label className="block">{input.label}</label>
                                                            {
                                                                input.children?.map((value: string, index: number) => {
                                                                    return <div key={index} className="inline-block">
                                                                        <input required className="mx-1" type={input.type} id={"input-" + input.name} value={value} />
                                                                        <label htmlFor={"input-" + input.name}>{value}</label>
                                                                    </div>
                                                                })
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    ["select"].includes(input.type) && (
                                                        <>
                                                            <label htmlFor={"input-" + input.name} className="block">{input.label}</label>
                                                            {input.name == "estado" ?
                                                                <select onChange={(e) => { setAddressValue({ ...addressValue, estado: e.target.value }) }} required value={addressValue.estado} className="w-full" id={"input-" + input.name} name={input.name}>
                                                                    <option disabled value=""> -- Escolha um Estado -- </option>
                                                                    {input.children?.map((value: any, index: number) => <option key={index} value={value.substring(0, 2)}>{value}</option>)}
                                                                </select>
                                                                :
                                                                <select required className="w-full" id={"input-" + input.name} name={input.name}>
                                                                    <option disabled value=""> -- Escolha um Estado -- </option>
                                                                    {input.children?.map((value: string, index: number) => <option key={index} value={value}>{value}</option>)}
                                                                </select>
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    ["search"].includes(input.type) && (
                                                        <>
                                                            <label htmlFor={"input-" + input.name} className="block">{input.label}</label>
                                                            {
                                                                ["cep"].includes(input.name) ?
                                                                    <input onChange={(e) => { searchCep(e.target.value) }} required value={cepValue} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                    :
                                                                    <input required className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    ["text", "email", "number", "date", "tel"].includes(input.type) && (
                                                        <>
                                                            <label htmlFor={"input-" + input.name} className="block">{input.label}</label>
                                                            {
                                                                input.name == "endereco" ? (
                                                                    <input onChange={(e) => setAddressValue({ ...addressValue, logradouro: e.target.value })} required defaultValue={addressValue.logradouro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                ) : input.name == "bairro" ? (
                                                                    <input onChange={(e) => setAddressValue({ ...addressValue, bairro: e.target.value })} required defaultValue={addressValue.bairro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                ) : input.name == "cidade" ? (
                                                                    <input onChange={(e) => setAddressValue({ ...addressValue, localidade: e.target.value })} required defaultValue={addressValue.localidade} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                ) : (
                                                                    <input required className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }
                                                {
                                                    ["textarea"].includes(input.type) && (
                                                        <>
                                                            <label htmlFor={"input-" + input.name} className="block">{input.label}</label>
                                                            <textarea required className="w-full" id={"input-" + input.name} name={input.name}></textarea>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        )
                                    })}
                                </AccordionItem>
                            </div>
                        })
                    ) : (
                        <div className="bg-gray-50 drop-shadow rounded-md mt-3 p-5 h-[100%]"></div>
                    )
                }
                </form>
            </div>
        </div>
    );
}
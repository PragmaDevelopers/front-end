"use client"

import React, { useState, useEffect } from "react";
import { AccordionItem } from "@/app/components/register/client/form/Accordion/Accordion";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/utils/variables";
import { useUserContext } from "@/app/contexts/userContext";
import ClientTemplateHandle from "@/app/components/register/client/template/ClientTemplateHandle";
import CreateTemplateInput from "@/app/components/register/client/template/CreateTemplateInput";
import DeleteTemplateInput from "@/app/components/register/client/template/DeleteTemplateInput";
import { CepDataProps } from "@/app/interfaces/RegisterClientInterfaces";
import states from "@/api/states/states";

export default function SignUpPageB() {
    const [currentTemplate, setCurrentTemplate] = useState<{ pessoa_fisica: any[], pessoa_juridica: any[] }>({
        pessoa_fisica: [],
        pessoa_juridica: []
    });

    const [templateList, setTemplateList] = useState<{
        id: number,
        name: string,
        template: {
            pessoa_fisica: any[],
            pessoa_juridica: any[]
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
        console.log(userValue)
        fetch(`${API_BASE_URL}/api/private/user/signup/client/templates?value=false`, requestOptions)
        .then(response => response.json()).then((clientTemplates:any) => {
            setTemplateList(clientTemplates);
            console.log(clientTemplates)
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

    return (
        <div className="w-full h-full overflow-auto flex justify-center items-start bg-neutral-100">
            <div className="p-3 w-full max-w-4xl">
                <form onSubmit={(e: any) => {
                    e.preventDefault();

                    let clientSignUp: any = {};
                    for (let i = 0; i < e.target.length; i++) {
                        if(e.target[i].name != "" && e.target[i].name != "nome_identificador"){
                            clientSignUp[e.target[i].name] = e.target[i].value;
                        }
                    }
                    sessionStorage.setItem("clientSignUp", JSON.stringify(clientSignUp));
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userValue.token}`,
                        },
                        body: JSON.stringify({
                            name: e.target.nome_identificador.value,
                            template: clientSignUp
                        })
                    };
                    fetch(`${API_BASE_URL}/api/private/user/signup/client/template?value=true`, requestOptions)
                    .then(response => response.json()).then((clientTemplateId) => {
                        console.log("CREATE CLIENT SUCCESS");
                        alert("Cliente Salvo!");
                        sessionStorage.setItem("clientTemplateId_editor",clientTemplateId)
                    });

                    e.target.reset();  
                }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <button className="bg-neutral-50 drop-shadow rounded-md p-2 me-5" onClick={() => {
                                inputCreateModal ? setInputCreateModal(false) : setInputCreateModal(true);
                                setInputRemoveModal(false);
                                setUseDraftModal(false)
                            }} type="button">Criar Input</button>
                            <button className="bg-neutral-50 drop-shadow rounded-md p-2 me-5" onClick={() => {
                                inputRemoveModal ? setInputRemoveModal(false) : setInputRemoveModal(true);
                                setInputCreateModal(false);
                                setUseDraftModal(false)
                            }} type="button">Remover Input</button>
                            <button className="bg-neutral-50 drop-shadow rounded-md p-2 me-5" onClick={() => {
                                useDraftModal ? setUseDraftModal(false) : setUseDraftModal(true);
                                setInputCreateModal(false);
                                setInputRemoveModal(false);
                            }} type="button">Rascunhos</button>
                        </div>
                        <div className="flex items-center">
                            <input name="nome_identificador" type="text" placeholder="Nome do cliente" />
                            <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center ms-3 border-gray-400" type="submit">Enviar</button>
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
                                                                        <>
                                                                            <input onChange={(e) => { searchCep(e.target.value) }} required value={cepValue} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                        </>
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
                                                                        <input onChange={(e) => setAddressValue({ ...addressValue, logradouro: e.target.value })} required value={addressValue.logradouro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                    ) : input.name == "bairro" ? (
                                                                        <input onChange={(e) => setAddressValue({ ...addressValue, bairro: e.target.value })} required value={addressValue.bairro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                    ) : input.name == "cidade" ? (
                                                                        <input onChange={(e) => setAddressValue({ ...addressValue, localidade: e.target.value })} required value={addressValue.localidade} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
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
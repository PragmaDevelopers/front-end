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
        id:number,
        name:string,
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
        fetch(`${API_BASE_URL}/api/private/user/signup/client/templates`, requestOptions)
        .then(response => response.json()).then((
            data: {
                id:number,
                name:string,
                template: {
                    pessoa_fisica: any[],
                    pessoa_juridica: any[]
                } 
            }[]
        ) => {
            setTemplateList(data);
            console.log(data)
            if(data.length != 0){
                setCurrentTemplate(data[0].template)
            }
        })
    }, [])

    async function searchCep(cep:string){
        cep = cep.replace(/\D/g,""); //Substituí o que não é dígito por "", /g é [Global][1]
        if(cep.length <= 8){
            setCepValue(cep.replace(/^(\d{5})(\d{3})$/g,"$1-$2"));
            if(cep.length == 8){
                const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`).catch(error=>alert(error));
                if(data){
                    const response = await data.json();
                    setAddressValue({
                        estado:response.uf || "",
                        localidade:response.localidade || "",
                        bairro:response.bairro || "",
                        logradouro:response.logradouro || ""
                    })
                }
            }else{
                setAddressValue({
                    ...addressValue,
                    estado:"" 
                })
            }
        }
    }

    const [selectedArr, setSelectedArr] = useState<string[]>([]);
    function addItem(item: string) {
        if (!selectedArr.includes(item)) {
            setSelectedArr([item, ...selectedArr]);
        }
    }

    function removeItem(item: string) {
        const selectedFilter = selectedArr.filter(value => value !== item);
        setSelectedArr(selectedFilter);
    }

    return (
        <div className="w-full h-full overflow-auto flex justify-center items-start">
            <div className="px-2 w-full h-full max-w-4xl my-3">
                <button className="bg-gray-200 p-2 mb-4 border-b-2 me-3 border-gray-400" onClick={() => {
                    inputCreateModal ? setInputCreateModal(false) : setInputCreateModal(true);
                    setInputRemoveModal(false);
                    setUseDraftModal(false)
                }} type="button">Criar Input</button>
                <button className="bg-gray-200 p-2 mb-4 border-b-2 me-3 border-gray-400" onClick={() => {
                    inputRemoveModal ? setInputRemoveModal(false) : setInputRemoveModal(true);
                    setInputCreateModal(false);
                    setUseDraftModal(false)
                }} type="button">Remover Input</button>
                <button className="bg-gray-200 p-2 mb-4 border-b-2 me-3 border-gray-400" onClick={() => {
                    useDraftModal ? setUseDraftModal(false) : setUseDraftModal(true);
                    setInputCreateModal(false);
                    setInputRemoveModal(false);
                }} type="button">Rascunhos</button>
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
                <form className="h-full" onSubmit={(e:any)=>{
                    e.preventDefault();
                    let clientSignUp:any = {};
                    for(let i = 0;i < e.target.length;i++){
                        if(e.target[i].name == "procuracao"){
                            if(selectedArr.length != 1){
                                let words = selectedArr.slice(0,selectedArr.length - 1).join(", ");
                                clientSignUp[e.target[i].name] = words+" e "+selectedArr[selectedArr.length - 1];
                            }else{
                                clientSignUp[e.target[i].name] = selectedArr[0];
                            }
                        }else if(e.target[i].name){
                            clientSignUp[e.target[i].name] = e.target[i].value;
                        }
                    }
                    sessionStorage.setItem("clientSignUp",JSON.stringify(clientSignUp));
                    router.push("/pdf/create");                
                }}>
                    {
                        currentTemplate[typePerson].length != 0 ? (
                            currentTemplate[typePerson].map((accordion: any, accordionIndex) => {
                                return <div key={accordionIndex} className="bg-gray-200 p-5 border-b-2 border-gray-400">
                                    <AccordionItem className="flex flex-wrap items-center justify-center" title={accordion.title}>
                                        {
                                            accordion.title === "Cliente" && (
                                                <>
                                                    <div className="mb-2 w-2/4 border-x-8">
                                                        <label className="block">Tipo Pessoa (conjunto fixo)</label>
                                                        <div onChange={(e: any) => {
                                                            setTypePerson(e.target.value.toLowerCase().replace(" ","_").replace("í","i"))
                                                        }} className="inline-block">
                                                            <input required className="mx-1" type="radio" id="input-tipo-pessoa-fisica" name="tipo_pessoa" value="Pessoa Física" />
                                                            <label htmlFor="input-tipo-pessoa-fisica">Pessoa física</label>
                                                            <input required className="mx-1" type="radio" id="input-tipo-pessoa-juridica" name="tipo_pessoa" value="Pessoa Jurídica" />
                                                            <label htmlFor="input-tipo-pessoa-juridica">Pessoa jurídica</label>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 w-2/4 border-x-8">
                                                        <label htmlFor="input-procuracao">Procuração: (conjunto fixo)</label>
                                                        <select required onChange={(e) => { addItem(e.target.value) }} defaultValue="default" name="procuracao" className="w-full" id="input-procuracao">
                                                            <option disabled value="default">-- Escolha um tipo de procuração --</option>
                                                            <option value="Previdenciário">Previdenciário</option>
                                                            <option value="Trabalhista">Trabalhista</option>
                                                            <option value="Administrativo">Administrativo</option>
                                                            <option value="Cível">Cível</option>
                                                        </select>
                                                        <div className="flex gap-2 pt-2 flex-wrap">
                                                            {selectedArr.map(value => {
                                                                return <span onClick={() => removeItem(value)} key={value} className="bg-slate-300 inline-block py-1 px-2 cursor-pointer">{value}</span>
                                                            })}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                        {accordion.inputs.map((input: any, inputIndex: number) => {
                                            return (
                                                <div className="mb-2 w-2/4 border-x-8" key={inputIndex}>
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
                                                            { input.name == "estado" ? 
                                                                <select onChange={(e)=>{setAddressValue({...addressValue,estado:e.target.value})}} required value={addressValue.estado} className="w-full" id={"input-" + input.name} name={input.name}>
                                                                    <option disabled value=""> -- Escolha um Estado -- </option>
                                                                    {input.children?.map((value: any,index:number) => <option key={index} value={value.substring(0,2)}>{value}</option>)}
                                                                </select>
                                                                :
                                                                <select required className="w-full" id={"input-" + input.name} name={input.name}>
                                                                    <option disabled value=""> -- Escolha um Estado -- </option>
                                                                    {input.children?.map((value:string,index:number) => <option key={index} value={value}>{value}</option>)}
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
                                                                        <input onChange={(e)=>{searchCep(e.target.value)}} required value={cepValue} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
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
                                                                        <input onChange={(e)=>setAddressValue({...addressValue,logradouro:e.target.value})} required value={addressValue.logradouro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                    ) : input.name == "bairro" ? (
                                                                        <input onChange={(e)=>setAddressValue({...addressValue,bairro:e.target.value})} required value={addressValue.bairro} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
                                                                    ) : input.name == "cidade" ? (
                                                                        <input onChange={(e)=>setAddressValue({...addressValue,localidade:e.target.value})} required value={addressValue.localidade} className="w-full" id={"input-" + input.name} type={input.type} name={input.name} />
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
                            <div className="bg-gray-200 p-5 border-b-2 border-gray-400 h-[100%]"></div>
                        )
                    }
                    <button className="bg-gray-200 p-2 my-4 border-b-2 me-3 border-gray-400" type="submit">Gerar Contrato/Criar PDF</button>
                </form>
            </div>
        </div>
    );
}
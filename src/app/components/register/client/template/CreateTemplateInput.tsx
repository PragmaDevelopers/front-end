import { ClientTemplateChildrenProps,CreateTemplateInputProps } from "@/app/interfaces/RegisterClientInterfaces";
import { IInputType } from "@/app/types/RegisterClientFormTypes";
import { useState } from "react";

export default function CreateTemplateInput({typePerson,currentTemplate,setCurrentTemplate}:{
    typePerson: "pessoa_fisica" | "pessoa_juridica",
    currentTemplate: ClientTemplateChildrenProps,
    setCurrentTemplate:any
}){

    const [selectedSection, setSelectedSection] = useState<{isNew:boolean,name:string}>({
        isNew: true,
        name: "new-section"
    });

    const [selectedInputType, setSelectedInputType] = useState<IInputType>("text");

    const [selectedSet, setSelectedSet] = useState("");

    const [selectedWichBefore, setWichBefore] = useState("");

    const [handleAlert,setHandleAlert] = useState({
        isTrue: false,
        message: ""
    });

    const [inputToInsertA,setInputToInsertA] = useState<{
        label: string,
        name: string
    }[]>([{
        label: "",
        name: ""
    }])

    const [inputToInsertB,setInputToInsertB] = useState<{
        label: string,
        name: string,
        values: string[]
    }>({
        label: "",
        name: "",
        values: [""]
    })

    function createInputOrSection() {
        const newPersonTemplate = currentTemplate[typePerson];
        if (selectedSection.isNew) {
            let newSection = {};
            if(["new-radio", "new-checkbox", "new-select"].includes(selectedInputType)){
                newSection = {
                    title: selectedSection.name,
                    inputs:[
                        {
                            type: selectedInputType.replace("new-",""),
                            label: inputToInsertB.label,
                            name: inputToInsertB.name,
                            children: inputToInsertB.values
                        }
                    ]
                }
                
            }else{
                const newArr:object[] = [];
                inputToInsertA.forEach((input)=>{
                    newArr.push({
                        type: selectedInputType,
                        label: input.label,
                        name: input.name
                    });
                });
                newSection = {
                    title: selectedSection.name,
                    inputs: newArr
                }
            }
            const sectionIndex = newPersonTemplate.findIndex((section)=>section.title == selectedWichBefore);
            if(sectionIndex != -1){
                newPersonTemplate.splice(sectionIndex,0,newSection);
            }else{
                newPersonTemplate.push(newSection);
            }
        }else{
            const templateIndex = newPersonTemplate.findIndex(template=>template.title == selectedSection.name);
            if(templateIndex != - 1){
                if(["new-radio", "new-checkbox", "new-select","radio", "checkbox", "select"].includes(selectedInputType)){
                    if(selectedInputType.includes("new-")){
                        newPersonTemplate[templateIndex].inputs.push({
                            type: selectedInputType.replace("new-",""),
                            label: inputToInsertB.label,
                            name: inputToInsertB.name,
                            children: inputToInsertB.values
                        });
                    }else{
                        const inputIndex = newPersonTemplate[templateIndex].inputs.findIndex((input:any)=>input.name == selectedSet);
                        if(inputIndex != -1){
                            const childIndex = newPersonTemplate[templateIndex].inputs[inputIndex].children
                            .findIndex((child:string)=>child==selectedWichBefore);
                            if(childIndex != -1){
                                newPersonTemplate[templateIndex].inputs[inputIndex].children.splice(childIndex,0,...inputToInsertB.values)
                            }else{
                                newPersonTemplate[templateIndex].inputs[inputIndex].children.push(...inputToInsertB.values);
                            }
                        }
                    }
                }else{
                    const inputIndex = newPersonTemplate[templateIndex].inputs.findIndex((input:any)=>input.name == selectedWichBefore);
                    const newArr:object[] = [];
                        inputToInsertA.forEach((input)=>{
                            newArr.push({
                                type: selectedInputType,
                                label: input.label,
                                name: input.name
                            });
                        });
                    if(inputIndex != -1){
                        newPersonTemplate[templateIndex].inputs.splice(inputIndex,0,...newArr);
                    }else{
                        newPersonTemplate[templateIndex].inputs.push(...newArr);
                    }
                }
            }
        }
        
        if (typePerson === "pessoa_fisica") {
            setCurrentTemplate({ pessoa_juridica: currentTemplate.pessoa_juridica, pessoa_fisica: newPersonTemplate });
        } else if (typePerson === "pessoa_juridica") {
            setCurrentTemplate({ pessoa_fisica: currentTemplate.pessoa_fisica, pessoa_juridica: newPersonTemplate });
        }

        setWichBefore("default");
        setSelectedSection({isNew:false,name:selectedSection.name});
    }

    return (
        <form className="mt-3 w-2/3 bg-neutral-50 drop-shadow rounded-md p-2 flex flex-col"
            onSubmit={(e) => {
                e.preventDefault();
                if(handleAlert.isTrue){
                    alert(handleAlert.message)
                }else{
                    createInputOrSection();
                }
            }}>
            <div className="mb-3 flex gap-2">
                <label htmlFor="which-section" className="whitespace-nowrap">Adicionar em qual seção: </label>
                <select onChange={(e) => {
                    setHandleAlert({
                        isTrue: false,
                        message: ""
                    })
                    if(e.target.value === "new-section"){
                        setSelectedSection({
                            isNew: true,
                            name: e.target.value
                        });
                    }else{
                        setSelectedSection({
                            isNew: false,
                            name: e.target.value
                        });
                    }
                }} required value={selectedSection.name}
                    className="w-full" name="which_section" id="which-section">
                    <option value="new-section">Nova Seção</option>
                    {currentTemplate[typePerson].map((template, index) => {
                        return <option value={template.title} key={index}>{template.title}</option>
                    })}
                </select>
            </div>
            {selectedSection.isNew &&
                <div className="mb-3 flex gap-2">
                    <label htmlFor="input-section-name" className="whitespace-nowrap">Nome da seção: </label>
                    <input required onChange={(e)=> {
                        if(currentTemplate[typePerson].some((template)=>template.title == e.target.value)){
                            setHandleAlert({
                                isTrue: true,
                                message: "Seção com nome já existente!"
                            })
                        }else{
                            setHandleAlert({
                                isTrue: false,
                                message: ""
                            })
                            setSelectedSection({
                                isNew: selectedSection.isNew,
                                name: e.target.value
                            })
                        }
                    }} className="w-full" name="new_section_name" id="input-section-name" type="text" />
                </div>
            }
            <div className="mb-3 flex gap-2">
                <label htmlFor="data-type" className="whitespace-nowrap">Tipo de input: </label>
                <select onChange={(e) => {
                    if(["radio", "checkbox", "select"].includes(e.target.value)){
                        setSelectedSet("");
                    }
                    setSelectedInputType(e.target.value as IInputType)
                }} className="w-full" value={selectedInputType} name="data_type" id="data-type">
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="email">E-mail</option>
                    <option value="date">Date</option>
                    {!selectedSection.isNew && <option value="checkbox">Caixa de seleção multipla (existente)</option>}
                    <option value="new-checkbox">Caixa de seleção multipla (novo conjunto)</option>
                    {!selectedSection.isNew && <option value="radio">Caixa de seleção única A (existente)</option>}
                    <option value="new-radio">Caixa de seleção única A (novo conjunto)</option>
                    {!selectedSection.isNew && <option value="select">Caixa de seleção única B (existente)</option>}
                    <option value="new-select">Caixa de seleção única B (novo conjunto)</option>
                </select>
            </div>
            {
                ["radio", "checkbox", "select"].includes(selectedInputType) && (
                    <div className="mb-3 flex gap-2">
                        <label className="whitespace-nowrap">Qual é o conjunto? </label>
                        <select onChange={(e) => { setSelectedSet(e.target.value) }} value={selectedSet != "" ? selectedSet : "default"} className="w-full" name="set_identifier">
                                <option disabled value="default"> -- Escolha um conjunto -- </option>
                                {currentTemplate[typePerson].map((accordion) => {
                                if (accordion.title === selectedSection.name) {
                                    return accordion.inputs.map((input: any, index: number) => {
                                        if (input.type === selectedInputType) {
                                            return <option value={input.name} key={index}>{input.label}</option>
                                        }
                                    })
                                }
                            })}
                        </select>
                    </div>
                )
            }
            {
                ["new-radio", "new-checkbox", "new-select"].includes(selectedInputType) && (
                    <>
                        <div className="mb-3 flex gap-2">
                            <label htmlFor="set-title" className="whitespace-nowrap">Titulo do conjunto: </label>
                            <input onChange={(e)=>{
                                setSelectedSet(e.target.value)
                                setInputToInsertB({
                                    label: e.target.value,
                                    name: e.target.value.toLowerCase().replace(/ /g,"_"),
                                    values: inputToInsertB.values
                                })
                            }} className="w-full" name="set_title" id="set-title" type="text" />
                        </div>
                        <div className="mb-3 flex gap-2">
                            <label htmlFor="set-identifier" className="whitespace-nowrap">Identificador do conjunto: </label>
                            <input disabled value={selectedSet.toLowerCase().replace(/ /g,"_")} className="w-full" name="set_identifier" id="set-identifier" type="text" />
                        </div>
                    </>
                )
            }
            <div className="border-y-2 border-slate-400 overflow-y-auto pe-2">
                <div className="max-h-60">
                    {
                        ["new-radio", "new-checkbox", "new-select","radio", "checkbox", "select"].includes(selectedInputType) ?
                            inputToInsertB.values.map((input, index: number) => {
                                return (
                                    <div key={index} className="py-3">
                                        {
                                            <div className="mb-3 flex gap-2">
                                                <label htmlFor="input-title" className="whitespace-nowrap">Valor do input {`(${index + 1})`}: </label>
                                                <input onChange={(e) => {
                                                    const newArr = [...inputToInsertB.values];
                                                    newArr[index] = e.target.value;
                                                    setInputToInsertB({
                                                        label: inputToInsertB.label,
                                                        name: inputToInsertB.name,
                                                        values: newArr
                                                    });
                                                }} className="w-full" id="input-title" type="text" />
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        :
                            inputToInsertA.map((a,index:number)=>{
                                return (
                                    <div key={index} className="py-3">
                                        <div className="mb-3 flex gap-2">
                                            <label htmlFor="input-title" className="whitespace-nowrap">Titulo do input {`(${index + 1})`}: </label>
                                            <input onChange={(e) => {
                                                const newArr = [...inputToInsertA];
                                                newArr[index] = {
                                                    label: e.target.value,
                                                    name: e.target.value.toLowerCase().replace(/ /g,"_")
                                                }
                                                setInputToInsertA(newArr);
                                            }} className="w-full" id="input-title" type="text" />
                                        </div>
                                        <div className="flex gap-2">
                                            <label htmlFor="input-identifier" className="whitespace-nowrap">Identificador do input: </label>
                                            <input disabled value={inputToInsertA[index].name} className="w-full" id="input-identifier" type="text" />
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            <div className="my-3 flex gap-2 justify-between">
                <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center" type="button" onClick={() => {
                    if(["new-radio", "new-checkbox", "new-select","radio", "checkbox", "select"].includes(selectedInputType)){
                        setInputToInsertB({
                            label: inputToInsertB.label,
                            name: inputToInsertB.name,
                            values: [
                                ...inputToInsertB.values,
                                ""
                            ]
                        })
                    }else{
                        setInputToInsertA([
                            ...inputToInsertA,
                            {
                                label: "",
                                name: ""
                            }
                        ])
                    }
                }}>Adiconar</button>
                {
                    ["new-radio", "new-checkbox", "new-select","radio", "checkbox", "select"].includes(selectedInputType) && inputToInsertB.values.length > 1 ?
                        <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center" type="button" onClick={() => {
                            const newArr = [...inputToInsertB.values];
                            newArr.pop();
                            setInputToInsertB({
                                label: inputToInsertB.label,
                                name: inputToInsertB.name,
                                values: newArr
                            });
                        }}>Remover</button>
                    :
                        inputToInsertA.length > 1 && 
                            <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center" type="button" onClick={() => {
                                const newArr = [...inputToInsertA];
                                newArr.pop();
                                setInputToInsertA(newArr);
                            }}>Remover</button> 
                }
            </div>
            <div className="mb-3 flex gap-2">
                {
                    selectedSection.isNew ? (
                        <>
                            <label htmlFor="which-input-before" className="whitespace-nowrap">Adicionar antes de qual seção: </label>
                            <select required onChange={(e)=>setWichBefore(e.target.value)} defaultValue={selectedWichBefore} className="w-full" name="which_input_before" id="which-input-before">
                            <option disabled value=""> -- Escolha uma seção -- </option>
                            {
                                currentTemplate[typePerson].map((accordion: any, index: number) => {
                                    return <option value={accordion.title} key={index}>{accordion.title}</option>
                                })
                            }
                            <option value="final">Final</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <label htmlFor="which-input-before" className="whitespace-nowrap">Adicionar antes de qual input: </label>
                            <select required onChange={(e)=>setWichBefore(e.target.value)} defaultValue={selectedWichBefore} className="w-full" name="which_input_before" id="which-input-before">
                            <option disabled value=""> -- Escolha um input -- </option>
                                {
                                    ["radio", "select", "checkbox"].includes(selectedInputType) ? (
                                        currentTemplate[typePerson].map((template: any) => {
                                            if (selectedSection.name === template.title) {
                                                return template.inputs.map((input: any) => {
                                                    if (input.type === selectedInputType && input.name === selectedSet) {
                                                        return input.children?.map((value: string, index: number) => {
                                                            return <option value={value} key={index}>{value}</option>
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    ) :
                                        (
                                            currentTemplate[typePerson].map((accordion: any) => {
                                                if (selectedSection.name === accordion.title) {
                                                    return accordion.inputs.map((input: any, index: number) => {
                                                        return <option value={input.name} key={index}>{input.label}</option>
                                                    })
                                                }
                                            })
                                        )
                                }
                                <option value="final">Final</option>
                            </select>
                        </>
                    )
                
                }
            </div>
            <button type="submit" className="bg-neutral-100 drop-shadow rounded-md p-2 text-center">Criar</button>
        </form>
    )
}
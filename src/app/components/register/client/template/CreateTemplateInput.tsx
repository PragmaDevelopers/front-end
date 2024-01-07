import { ClientTemplateChildrenProps,CreateTemplateInputProps } from "@/app/interfaces/RegisterClientInterfaces";
import { useState } from "react";

export default function CreateTemplateInput({typePerson,currentTemplate,setCurrentTemplate}:{
    typePerson: "pessoa_fisica" | "pessoa_juridica",
    currentTemplate: ClientTemplateChildrenProps,
    setCurrentTemplate:any
}){

    const [selectedSection, setSelectedSection] = useState("new");
    const [selectedInputType, setSelectedInputType] = useState("text");
    const [selectedSet, setSelectedSet] = useState("new");
    const [inputArr, setInputArr] = useState([{
        label: "",
        valueOrName: ""
    }]);

    function createInputOrSection({ functionType, type,
        accordionIndex, inputIndex, newSectionName, setLabel, setName, valueIndex }: CreateTemplateInputProps) {
        const newAccordion = currentTemplate[typePerson];
        if (functionType === "existing input" && inputIndex !== undefined && accordionIndex !== undefined && valueIndex !== undefined) {
            inputArr.forEach((obj, index) => {
                if (obj.label == "" || obj.valueOrName == "") {
                    return;
                }
                if (valueIndex !== -1 && inputIndex !== -1) {
                    newAccordion[accordionIndex].inputs[inputIndex as number].children.splice(valueIndex + index, 0, {
                        label: obj.label,
                        value: obj.valueOrName
                    })
                } else {
                    newAccordion[accordionIndex].inputs[inputIndex as number].children.push({
                        label: obj.label,
                        value: obj.valueOrName
                    })
                }
            })
        }
        if (type) {
            const isChildren = (setLabel && setName);
            if (functionType === "new input" && type && accordionIndex !== undefined && inputIndex !== undefined) {
                let usePush = false;
                inputArr.forEach((obj, index, arr) => {
                    if (obj.label == "" || obj.valueOrName == "") {
                        return;
                    }
                    if (isChildren) {
                        if (setName == "" || setLabel == "") {
                            return;
                        }
                        if (usePush) {
                            if (inputIndex === -1) {
                                inputIndex = newAccordion[accordionIndex].inputs.length - 1;
                            }
                            newAccordion[accordionIndex].inputs[inputIndex as number].children.push({
                                label: obj.label,
                                value: obj.valueOrName
                            })
                        } else {
                            if (inputIndex !== -1) {
                                newAccordion[accordionIndex].inputs.splice(inputIndex, 0, {
                                    type: type.replace("new-", ""),
                                    name: setName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                    label: setLabel,
                                    children: [{ label: obj.label, value: obj.valueOrName }]
                                })
                            } else {
                                newAccordion[accordionIndex].inputs.push({
                                    type: type.replace("new-", ""),
                                    name: setName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                    label: setLabel,
                                    children: [{ label: obj.label, value: obj.valueOrName }]
                                })
                            }
                            usePush = true;
                        }
                    } else {
                        if (inputIndex !== -1 && inputIndex !== undefined) {
                            newAccordion[accordionIndex].inputs.splice(inputIndex + index, 0, {
                                type: type.replace("new-", ""),
                                name: obj.valueOrName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                label: obj.label
                            })
                        } else {
                            newAccordion[accordionIndex].inputs.push({
                                type: type.replace("new-", ""),
                                name: obj.valueOrName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                label: obj.label
                            })
                        }
                    }
                })
            }
            if (functionType === "new section" && accordionIndex !== undefined && newSectionName !== "") {
                let usePush = false;
                inputArr.forEach((obj, index) => {
                    if (isChildren) {
                        const inputs = []
                        if (setName != "" && setLabel != "" && obj.label != "" && obj.valueOrName != "") {
                            inputs.push({
                                type: type.replace("new-", ""),
                                name: setName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                label: setLabel,
                                children: [{ label: obj.label, value: obj.valueOrName }]
                            })
                        }
                        if (usePush) {
                            if (accordionIndex == -1) {
                                newAccordion[newAccordion.length - 1].inputs[0].children.push({
                                    label: obj.label,
                                    value: obj.valueOrName
                                })
                            } else {
                                newAccordion[accordionIndex].inputs[0].children.push({
                                    label: obj.label,
                                    value: obj.valueOrName
                                })
                            }
                        } else {
                            if (accordionIndex == -1) {
                                newAccordion.push({
                                    title: newSectionName,
                                    inputs: inputs
                                })
                            } else {
                                newAccordion.splice(accordionIndex, 0, {
                                    title: newSectionName,
                                    inputs: inputs
                                })
                            }
                            usePush = true;
                        }
                    } else {
                        const inputs = []
                        if (obj.label != "" && obj.valueOrName != "") {
                            inputs.push({
                                type: type.replace("new-", ""),
                                name: obj.valueOrName.trim().replace(/[ ]{1,}/g, "_").toLowerCase(),
                                label: obj.label
                            })
                        }
                        if (usePush) {
                            if (accordionIndex == -1) {
                                newAccordion[newAccordion.length - 1].inputs.push(inputs)
                            } else {
                                newAccordion[accordionIndex].inputs.push(inputs)
                            }
                        } else {
                            if (accordionIndex == -1) {
                                newAccordion.push({
                                    title: newSectionName,
                                    inputs: inputs
                                })

                            } else {
                                newAccordion.splice(accordionIndex, 0, {
                                    title: newSectionName,
                                    inputs: inputs
                                })
                            }

                            usePush = true;
                        }
                    }
                })
            }
        }
        if (typePerson === "pessoa_fisica") {
            setCurrentTemplate({ pessoa_juridica: currentTemplate.pessoa_juridica, pessoa_fisica: newAccordion });
        } else if (typePerson === "pessoa_juridica") {
            setCurrentTemplate({ pessoa_fisica: currentTemplate.pessoa_fisica, pessoa_juridica: newAccordion });
        }
    }

    return (
        <form className="bg-gray-200 w-3/4 p-2 mb-4 border-b-2 border-gray-400 flex flex-col"
            onSubmit={(e: any) => {
                e.preventDefault();
                const setLabel = e.target?.set_title?.value;
                const setName = e.target?.set_identifier?.value;
                const dataType = e.target.data_type.value;
                const whichSection = e.target.which_section.value;
                const whichInputBefore = e.target.which_input_before.value;

                if (whichSection !== "new") {
                    const accordionIndex = currentTemplate[typePerson].findIndex(accordion => accordion.title === whichSection);                                        if (["radio", "select", "checkbox"].includes(dataType)) {
                        const inputIndex = currentTemplate[typePerson][accordionIndex].inputs.findIndex((input: any) => {
                            return input.name === setName;
                        })
                        const valueIndex = currentTemplate[typePerson][accordionIndex].inputs[inputIndex].children?.findIndex((child: any) => child.value === whichInputBefore);
                        if (valueIndex !== undefined) {
                            createInputOrSection({
                                functionType: "existing input",
                                accordionIndex: accordionIndex,
                                inputIndex: inputIndex,
                                valueIndex: valueIndex
                            })
                        }
                    } else {
                        const inputIndex = currentTemplate[typePerson][accordionIndex].inputs.findIndex((input: any) => {
                            return input.name === whichInputBefore;
                        })
                        createInputOrSection({
                            functionType: "new input",
                            type: dataType,
                            accordionIndex: accordionIndex,
                            inputIndex: inputIndex,
                            setLabel: setLabel,
                            setName: setName
                        })
                    }
                } else {
                    const accordionIndex = currentTemplate[typePerson].findIndex((accordion: any) => {
                        return accordion.title === whichInputBefore;
                    })
                    const newSectionName = e.target.new_section_name.value;
                    createInputOrSection({
                        type: dataType,
                        newSectionName: newSectionName,
                        accordionIndex: accordionIndex,
                        functionType: "new section",
                        setLabel: setLabel,
                        setName: setName
                    })
                }
            }}>
            <div className="mb-3 flex gap-2">
                <label htmlFor="which-section" className="whitespace-nowrap">Adicionar em qual seção: </label>
                <select onChange={(e) => setSelectedSection(e.target.value)} value={selectedSection}
                    className="w-full" name="which_section" id="which-section">
                    {currentTemplate[typePerson].map((accordion, index) => {
                        return <option value={accordion.title} key={index}>{accordion.title}</option>
                    })}
                    <option value="new">Nova Seção</option>
                </select>
            </div>
            {selectedSection === "new" &&
                <div className="mb-3 flex gap-2">
                    <label htmlFor="input-section-name" className="whitespace-nowrap">Nome da seção: </label>
                    <input className="w-full" name="new_section_name" id="input-section-name" type="text" />
                </div>
            }
            <div className="mb-3 flex gap-2">
                <label htmlFor="data-type" className="whitespace-nowrap">Tipo de input: </label>
                <select onChange={(e) => setSelectedInputType(e.target.value)} className="w-full" value={selectedInputType} name="data_type" id="data-type">
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="email">E-mail</option>
                    <option value="date">Date</option>
                    {selectedSection !== "new" && <option value="checkbox">Caixa de seleção multipla (existente)</option>}
                    <option value="new-checkbox">Caixa de seleção multipla (novo conjunto)</option>
                    {selectedSection !== "new" && <option value="radio">Caixa de seleção única A (existente)</option>}
                    <option value="new-radio">Caixa de seleção única A (novo conjunto)</option>
                    {selectedSection !== "new" && <option value="select">Caixa de seleção única B (existente)</option>}
                    <option value="new-select">Caixa de seleção única B (novo conjunto)</option>
                </select>
            </div>
            {
                ["radio", "checkbox", "select"].includes(selectedInputType) && (
                    <div className="mb-3 flex gap-2">
                        <label className="whitespace-nowrap">Qual é o conjunto? </label>
                        <select onChange={(e) => { setSelectedSet(e.target.value) }} className="w-full" name="set_identifier">
                            {currentTemplate[typePerson].map((accordion) => {
                                if (accordion.title === selectedSection) {
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
                            <input className="w-full" name="set_title" id="set-title" type="text" />
                        </div>
                        <div className="mb-3 flex gap-2">
                            <label htmlFor="set-identifier" className="whitespace-nowrap">Identificador do conjunto: </label>
                            <input className="w-full" name="set_identifier" id="set-identifier" type="text" />
                        </div>
                    </>
                )
            }
            <div className="border-y-2 border-slate-400 overflow-y-auto pe-2">
                <div className="max-h-60">
                    {
                        inputArr.map((input, index: number) => {
                            return (
                                <div key={index} className="py-3">
                                    <div className="mb-3 flex gap-2">
                                        <label htmlFor="input-title" className="whitespace-nowrap">Titulo do input {`(${index + 1})`}: </label>
                                        <input onChange={(e) => {
                                            const newArr = [...inputArr];
                                            newArr[index].label = e.target.value;
                                            setInputArr(newArr);
                                        }} className="w-full" id="input-title" type="text" />
                                    </div>
                                    <div className="flex gap-2">
                                        <label htmlFor="input-identifier" className="whitespace-nowrap">Identificador do input: </label>
                                        <input onChange={(e) => {
                                            const newArr = [...inputArr];
                                            newArr[index].valueOrName = e.target.value;
                                            setInputArr(newArr);
                                        }} className="w-full" id="input-identifier" type="text" />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="my-3 flex gap-2 justify-between">
                <button className="bg-gray-300 p-2 border-b-2 me-3 border-gray-400" type="button" onClick={() => {
                    const newArr = [...inputArr];
                    newArr.push({
                        label: "",
                        valueOrName: ""
                    })
                    setInputArr(newArr);
                }}>Adiconar</button>
                {inputArr.length > 1 && <button className="bg-gray-300 p-2 border-b-2 border-gray-400" type="button" onClick={() => {
                    const newArr = [...inputArr];
                    newArr.pop()
                    setInputArr(newArr);
                }}>Remover</button>}
            </div>
            <div className="mb-3 flex gap-2">
                <label htmlFor="which-input-before" className="whitespace-nowrap">Adicionar antes de qual input: </label>
                <select className="w-full" name="which_input_before" id="which-input-before">
                    {
                        selectedSection !== "new" ? (
                            ["radio", "select", "checkbox"].includes(selectedInputType) ? (
                                currentTemplate[typePerson].map((accordion: any) => {
                                    if (selectedSection === accordion.title) {
                                        return accordion.inputs.map((input: any) => {
                                            if (input.type === selectedInputType && input.name === selectedSet) {
                                                return input.children?.map((child: any, index: number) => {
                                                    return <option value={child.value} key={index}>{child.label}</option>
                                                })
                                            }
                                        })
                                    }
                                })
                            ) :
                                (
                                    currentTemplate[typePerson].map((accordion: any) => {
                                        if (selectedSection === accordion.title) {
                                            return accordion.inputs.map((input: any, index: number) => {
                                                return <option value={input.name} key={index}>{input.label}</option>
                                            })
                                        }
                                    })
                                )
                        ) : (
                            currentTemplate[typePerson].map((accordion: any, index: number) => {
                                return <option value={accordion.title} key={index}>{accordion.title}</option>
                            })
                        )
                    }
                    <option value="final">Final</option>
                </select>
            </div>
            <button type="submit" className="bg-gray-400 p-2 text-center">Criar</button>
        </form>
    )
}
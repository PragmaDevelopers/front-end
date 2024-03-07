import { ClientTemplateChildrenProps,CreateTemplateInputProps } from "@/app/interfaces/RegisterClientInterfaces";
import { useState } from "react";

export default function DeleteTemplateInput({typePerson,currentTemplate,setCurrentTemplate}:{
    typePerson: "pessoa_fisica" | "pessoa_juridica",
    currentTemplate: ClientTemplateChildrenProps,
    setCurrentTemplate:any
}){

    const [selectedSection, setSelectedSection] = useState("");

    return (
        <form className="mt-3 w-2/3 bg-neutral-50 drop-shadow rounded-md p-2 flex flex-col"
            onSubmit={(e: any) => {
                e.preventDefault();
                const removeSection = e.target.remove_section.value;
                const removeInput = e.target.remove_input.value;
                const newAccordions = currentTemplate[typePerson];
                const accordionIndex = currentTemplate[typePerson].findIndex(accordion => accordion.title === removeSection);

                if (removeInput === "") {
                    newAccordions.splice(accordionIndex, 1);
                } else {
                    const inputIndex = newAccordions[accordionIndex].inputs.findIndex((input: any) => {
                        return input.name === removeInput;
                    })
                    if (inputIndex !== -1) {
                        newAccordions[accordionIndex].inputs.splice(inputIndex, 1);
                    }
                }
                if (typePerson === "pessoa_fisica") {
                    setCurrentTemplate({ pessoa_juridica: currentTemplate.pessoa_juridica, pessoa_fisica: newAccordions });
                } else if (typePerson === "pessoa_juridica") {
                    setCurrentTemplate({ pessoa_fisica: currentTemplate.pessoa_fisica, pessoa_juridica: newAccordions });
                }
            }}>
            <div className="mb-3 flex gap-2 items-center">
                <label htmlFor="remove-section" className="inline-block whitespace-nowrap">Qual seção: </label>
                <select required onChange={(e) => setSelectedSection(e.target.value)} defaultValue={selectedSection}
                    className="w-full" name="remove_section" id="remove-section">
                    <option disabled value=""> -- Escolha uma seção -- </option>
                    {currentTemplate[typePerson].map((accordion: any, index: number) => {
                        return <option value={accordion.title} key={index}>{accordion.title}</option>
                    })}
                </select>
            </div>
            <div className="mb-3 flex gap-2 items-center">
                <label htmlFor="remove-input" className="whitespace-nowrap">Qual input: </label>
                <select className="w-full" name="remove_input" id="remove-input">
                <option value=""> -- Escolha um input/Excluir seção -- </option>
                    {currentTemplate[typePerson].map((accordion: any) => {
                        if (accordion.title === selectedSection) {
                            return accordion.inputs.map((input: any, index: number) => {
                                return <option value={input.name} key={index}>{input.label}</option>
                            })
                        }
                    })}
                </select>
            </div>
            <button type="submit" className="bg-neutral-100 drop-shadow rounded-md p-2 text-center">Remover</button>
        </form>     
    )
}
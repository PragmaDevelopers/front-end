import { useUserContext } from "@/app/contexts/userContext";
import { ClientTemplateProps } from "@/app/interfaces/RegisterClientInterfaces";
import { ConfirmDeleteClientTemplate } from "@/app/utils/register/client/ClientTemplateModal";
import { API_BASE_URL } from "@/app/utils/variables";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { delete_client_template } from "@/app/utils/fetchs";
import { useModalContext } from "@/app/contexts/modalContext";
import { useRef } from "react";

export default function ClientPdfTemplateHandle({templateList,setTemplateList,currentTemplate,setCurrentTemplate}:{
    templateList:{
        id: number,
        name: string,
        template: any[]
    }[],
    setTemplateList:any,
    currentTemplate: any,
    setCurrentTemplate:any
}){

    const { userValue } = useUserContext();
    const modalContextProps = useModalContext();

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
        <div className="mt-3 w-2/3 bg-neutral-50 drop-shadow rounded-md p-2 flex flex-col">
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const selectedTemplateId = e.target.selected_draft.value;
                const templateIndex = templateList.findIndex((template:any) => template.id == selectedTemplateId)
                if (templateIndex !== -1) {
                    setCurrentTemplate(templateList[templateIndex].template);
                }
            }}>
                <select required defaultValue={currentTemplate.id ? currentTemplate.id : ""} className="w-full" name="selected_draft">
                    <option disabled value=""> -- Escolha um cliente -- </option>
                    {templateList && (
                        templateList.map((template:any) => {
                            return <option key={template.id} value={template.id}>{template.name}</option>
                        })
                    )}
                </select>
                <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center block mt-2">Usar cliente selecionado</button>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const selectedTemplateId = e.target.selected_draft.value;
                const templateIndex = templateList.findIndex((template) => template.id == selectedTemplateId)

                const delClientTemplate = () => {
                    delete_client_template(undefined,selectedTemplateId,userValue.token,(response)=>response.text().then(()=>{
                        if(response.ok){
                            console.log("DELETE CLIENT TEMPLATE SUCCESS");
                        }
                    }));
                    const newTemplateList = templateList;
                        newTemplateList.splice(templateIndex,1);
                        setTemplateList([...newTemplateList]);
                    modalContextProps.setModalOpen(false);
                }
        
                const successOption: CustomModalButtonAttributes[] = [
                    {
                        text: "Sim",
                        onclickfunc: delClientTemplate,
                        type: "button",
                        className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    },
                    {
                        text: "Não",
                        onclickfunc: () => modalContextProps.setModalOpen(false),
                        ref: noButtonRef,
                        type: "button",
                        className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
                    }
                ]
        
                const successModalOption: any = successOption.map(
                    (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
                );

                if (templateIndex !== -1) {
                    ConfirmDeleteClientTemplate(
                        userValue,
                        successModalOption,
                        failModalOption,
                        noButtonRef,
                        modalContextProps
                    )
                }
            }}>
                <select required defaultValue="" className="w-full" name="selected_draft">
                    <option disabled value=""> -- Escolha um cliente -- </option>
                    {templateList && (
                        templateList.map((template:any) => {
                            return <option key={template.id} value={template.id}>{template.name}</option>
                        })
                    )}
                </select>
                <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center mt-2">Deletar cliente selecionado</button>
            </form>
        </div>
    )
}
import { useModalContext } from "@/app/contexts/modalContext";
import { useUserContext } from "@/app/contexts/userContext";
import { EditorLinesProps } from "@/app/interfaces/PdfEditorInterfaces";
import { ClientTemplateProps } from "@/app/interfaces/RegisterClientInterfaces";
import { EditorLine, pdfEditorTemplate } from "@/app/types/PdfEditorTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { useRef } from "react";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { ConfirmDeletePDFTemplate, CreatePDFTemplate } from "@/app/utils/pdf/PdfEditorTemplateModal";
import { delete_pdf_template } from "@/app/utils/fetchs";

export default function PdfEditorTemplateModal({templateList,setTemplateList,currentTemplate,setCurrentTemplate}:{
    templateList:any[],
    setTemplateList:any,
    currentTemplate: EditorLinesProps,
    setCurrentTemplate: (newValue:EditorLinesProps)=>void
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
                const templateIndex = templateList.findIndex((template) => template.id == selectedTemplateId)
                if (templateIndex !== -1) {
                    console.log(templateList[templateIndex])
                    setCurrentTemplate({...currentTemplate,lines:templateList[templateIndex].template});
                }
            }}>
                <select required defaultValue="" className="w-full" name="selected_draft">
                    <option disabled value=""> -- Escolha um rascunho -- </option>
                    {templateList && (
                        templateList.map((template) => {
                            return <option key={template.id} value={template.id}>{template.name}</option>
                        })
                    )}
                </select>
                <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center block mt-2">Usar rascunho selecionado</button>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const selectedTemplateId = e.target.selected_draft.value;
                const templateIndex = templateList.findIndex((template) => template.id == selectedTemplateId)
            
                const delPDFTemplate = () => {
                    delete_pdf_template(undefined,selectedTemplateId,userValue.token,(response)=>response.text().then(()=>{
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
                        onclickfunc: delPDFTemplate,
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
                    ConfirmDeletePDFTemplate(
                        userValue,
                        successModalOption,
                        failModalOption,
                        noButtonRef,
                        modalContextProps
                    )
                }
            }}>
                <select required defaultValue="" className="w-full" name="selected_draft">
                    <option disabled value=""> -- Escolha um rascunho -- </option>
                    {templateList && (
                        templateList.map((template) => {
                            return <option key={template.id} value={template.id}>{template.name}</option>
                        })
                    )}
                </select>
                <button className="bg-neutral-100 drop-shadow rounded-md p-2 text-center mt-2">Deletar rascunho selecionado</button>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault()
                const templateName = e.target.draft_name.value;
                CreatePDFTemplate(
                    userValue,
                    {
                        name: templateName,
                        template: currentTemplate.lines
                    },
                    templateList,
                    setTemplateList,
                    failModalOption,
                    noButtonRef,
                    modalContextProps
                );
            }}>
                <label htmlFor="draft-name">Nome do rascunho: </label>
                <input required className="w-full" id="draft-name" type="text" name="draft_name" />
                <button type="submit" className="bg-neutral-100 drop-shadow rounded-md p-2 text-center mt-2">Salvar rascunho atual</button>
            </form>
        </div>
    )
}
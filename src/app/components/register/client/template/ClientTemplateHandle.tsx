import { useUserContext } from "@/app/contexts/userContext";
import { ClientTemplateProps } from "@/app/interfaces/RegisterClientInterfaces";
import { API_BASE_URL } from "@/app/utils/variables";

export default function ClientTemplateHandle({templateList,setTemplateList,currentTemplate,setCurrentTemplate}:{
    templateList:ClientTemplateProps[],
    setTemplateList:any,
    currentTemplate: any,
    setCurrentTemplate:any
}){

    const { userValue } = useUserContext();

    return (
        <div className="mt-3 bg-gray-200 w-2/4 p-2  border-b-2 border-gray-400 flex flex-col">
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const selectedTemplateId = e.target.selected_draft.value;
                const templateIndex = templateList.findIndex((template) => template.id == selectedTemplateId)
                if (templateIndex !== -1) {
                    setCurrentTemplate(templateList[templateIndex].template);
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
                <button className="bg-gray-400 p-2 text-center block mt-2">Usar rascunho selecionado</button>
            </form>
            <div className="bg-gray-300 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault();
                const selectedTemplateId = e.target.selected_draft.value;
                const templateIndex = templateList.findIndex((template) => template.id == selectedTemplateId)
                if (templateIndex !== -1) {
                    const requestOptions = {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userValue.token}`,
                        }

                    };
                    fetch(`${API_BASE_URL}/api/private/user/signup/client/template/${selectedTemplateId}`, requestOptions)
                    .then(() => {
                        const newTemplateList = templateList;
                        newTemplateList.splice(templateIndex,1);
                        setTemplateList([...newTemplateList]);
                        alert("Rascunho deletado!");
                    })
                }
            }}>
                <select required defaultValue="" className="w-full" name="selected_draft">
                    <option disabled value=""> -- Escolha um rascunho -- </option>
                    {templateList && (
                        templateList.map((template) => {
                            return <option disabled={[1].includes(template.id)} key={template.id} value={template.id}>{template.name}</option>
                        })
                    )}
                </select>
                <button className="bg-gray-400 p-2 text-center block mt-2">Deletar rascunho selecionado</button>
            </form>
            <div className="bg-gray-300 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault()
                const templateName = e.target.draft_name.value;

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userValue.token}`,
                    },
                    body: JSON.stringify({
                        name: templateName,
                        template: currentTemplate
                    })

                };
                fetch(`${API_BASE_URL}/api/private/user/signup/client/template?value=false`, requestOptions)
                .then(response => response.json()).then((id:number) => {
                    setTemplateList([
                        ...templateList,
                        {
                            id,
                            name: templateName,
                            template: currentTemplate
                        }
                    ])
                    alert("Rascunho salvo!");
                })
            }}>
                <label htmlFor="draft-name">Nome do rascunho: </label>
                <input required className="w-full" id="draft-name" type="text" name="draft_name" />
                <button type="submit" className="bg-gray-400 p-2 text-center block mt-2">Salvar rascunho atual</button>
            </form>
        </div>
    )
}
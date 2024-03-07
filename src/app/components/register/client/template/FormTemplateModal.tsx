import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { useModalContext } from "@/app/contexts/modalContext";
import { useUserContext } from "@/app/contexts/userContext";
import { ClientTemplateProps } from "@/app/interfaces/RegisterClientInterfaces";
import { delete_client_template } from "@/app/utils/fetchs";
import { ConfirmDeleteClientTemplate, CreateClientTemplate } from "@/app/utils/register/client/ClientTemplateModal";
import { API_BASE_URL } from "@/app/utils/variables";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState } from "react";

export default function FormTemplateModal({templateList,setTemplateList,currentTemplate,setCurrentTemplate}:{
    templateList:ClientTemplateProps[],
    setTemplateList:any,
    currentTemplate: any,
    setCurrentTemplate:any
}){

    const { userValue } = useUserContext();
    const modalContextProps = useModalContext();
    const [selectedTemplate,setSelectedTemplate] = useState<any>();

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
        <div className="flex flex-col z-50 mt-3 w-2/3 bg-neutral-50 drop-shadow rounded-md p-3">
            <form onSubmit={(e:any)=>{
                e.preventDefault();
                const name = e.target.search_name.value;
                const page = Number(e.target.search_page.value);
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userValue.token}`
                    }
                };
                fetch(`${API_BASE_URL}/api/private/user/signup/client/templates?value=false&name=${name}&page=${page}`, requestOptions)
                .then(response => response.json()).then((clientTemplates:any) => {
                    setTemplateList([...clientTemplates]);
                });
            }} className="w-full flex gap-3 items-center">
                <input required type="text" name="search_name" placeholder="Busque o cliente pelo nome" className="w-full shadow-md border-none py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0" />
                <input required type="number" name="search_page" min="1" defaultValue="1" placeholder="Página de busca" className="shadow-md border-none max-w-24 py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0" />
                <button type="submit" className="rounded-md bg-neutral-50 p-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600">
                    Buscar
                </button>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault();
                if (selectedTemplate?.id != undefined) {
                    setCurrentTemplate(selectedTemplate.template);
                }
            }}>
                <div className="w-full flex gap-3 items-center">
                    <Combobox onChange={(template: any) => setSelectedTemplate(template)}>
                        <div className="relative w-full">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(template: any) => template.name}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => { }}
                            >
                                <Combobox.Options className="form-select absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {templateList?.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                        Nothing found.
                                    </div>
                                    ) : (
                                    templateList?.map((template: any) => (
                                        <Combobox.Option
                                        key={template.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={template}
                                        >
                                        {({ selected, active }: any) => (
                                            <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {template.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-teal-600' : 'text-teal-600'
                                                    }`}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                            </>
                                        )}
                                        </Combobox.Option>
                                    ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>
                    <button className="w-1/4 bg-neutral-100 drop-shadow rounded-md p-2 text-center">Selecionar</button>
                </div>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault();
                if(selectedTemplate?.id != undefined){
                    const templateIndex = templateList.findIndex((template) => template.id == selectedTemplate.id)

                    const delClientTemplate = () => {
                        delete_client_template(undefined,selectedTemplate.id,userValue.token,(response)=>response.text().then(()=>{
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
                }
            }}>
                <div className="w-full flex gap-3 items-center">
                    <Combobox onChange={(template: any) => setSelectedTemplate(template)}>
                        <div className="relative w-full">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(template: any) => template.name}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => { }}
                            >
                                <Combobox.Options className="form-select absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {templateList?.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                        Nothing found.
                                    </div>
                                    ) : (
                                    templateList?.map((template: any) => (
                                        <Combobox.Option
                                        key={template.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={template}
                                        >
                                        {({ selected, active }: any) => (
                                            <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {template.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-teal-600' : 'text-teal-600'
                                                    }`}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                            </>
                                        )}
                                        </Combobox.Option>
                                    ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>
                    <button disabled={[1].includes(selectedTemplate?.id)} className={`${[1].includes(selectedTemplate?.id) && "opacity-50"} w-1/4 bg-neutral-100 drop-shadow rounded-md p-2 text-center`}>Deletar</button>
                </div>
            </form>
            <div className="bg-neutral-200 h-1 rounded-md mt-3 mb-2"></div>
            <form onSubmit={(e: any) => {
                e.preventDefault()
                const templateName = e.target.draft_name.value;
                CreateClientTemplate(
                    false,
                    userValue,
                    {
                        name: templateName,
                        template: currentTemplate
                    },
                    templateList,
                    setTemplateList,
                    failModalOption,
                    noButtonRef,
                    modalContextProps
                );
            }} className="w-full flex gap-3 items-center">
            <input required type="text" name="draft_name" placeholder="Nome do rascunho atual" className="w-full shadow-md border-none py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0" />
            <button type="submit" className="rounded-md bg-neutral-50 p-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600">
                Salvar
            </button>
        </form>
        </div>
    )
}
"use client";

/*
 *  [x] Add Member
 *  [x] Remove Members
 *  [ ] Tags
 *  [ ] Custom Fields
 *  [x] Renomear Kanban
 * */

import { useUserContext } from "@/app/contexts/userContext";
import { CustomFieldsTemplate, Member, SystemID, userData } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface RenameKanbanSectionProps {
    onSubmit: any;
    defaultValue: string;
    submitButtonStyles: string;
    submitButtonText: string;
}
function RenameKanbanSection(props: RenameKanbanSectionProps) {
    const { submitButtonText, submitButtonStyles, defaultValue, onSubmit } = props;
    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Insira um novo nome" defaultValue={defaultValue} name="kanbanname" />
            <button type="submit" className={submitButtonStyles}>{submitButtonText}</button>
        </form>
    );
}

interface RemoveCustomFieldTemplateProps {
    setSelectedTemplates: any;
    selectedTemplates: CustomFieldsTemplate[];
    templates: CustomFieldsTemplate[];
}
function RemoveCustomFieldTemplateSection(props: RemoveCustomFieldTemplateProps) {
    const { setSelectedTemplates, selectedTemplates, templates } = props;    
    const [query, setQuery] = useState('');

    return (
    <Combobox value={selectedTemplates} onChange={setSelectedTemplates} multiple>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(templates: CustomFieldsTemplate[]) =>
                    templates.map((item: CustomFieldsTemplate) => item.name).join(', ')
                }
              onChange={(event) => setQuery(event.target.value)}
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
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {
                templates.map((value: any, index: number) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {value.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    );

}



interface addMemberToDashboardProps {
    selectedPeople: Member[];
    setSelectedPeople: any;
    people: Member[];
}
function AddMemberToDashboardSection(props: addMemberToDashboardProps) {
    const { setSelectedPeople, selectedPeople, people } = props;    
    const [query, setQuery] = useState('');

    return (
    <Combobox value={selectedPeople} onChange={setSelectedPeople} multiple>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(people: Member[]) =>
                    people.map((person: Member) => person.name).join(', ')
                }
              onChange={(event) => setQuery(event.target.value)}
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
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {
                people.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    );
}

interface removeMemberToDashboardProps {
    selectedPeople: Member[];
    setSelectedPeople: any;
    people: Member[];
}
function RemoveMemberFromDashboardSection(props: removeMemberToDashboardProps) {
    const { setSelectedPeople, selectedPeople, people } = props;    
    const [query, setQuery] = useState('');

    return (
    <Combobox value={selectedPeople} onChange={setSelectedPeople} multiple>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(people: Member[]) =>
                    people.map((person: Member) => person.name).join(', ')
                }
              onChange={(event) => setQuery(event.target.value)}
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
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {
                people.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    );
}






export default function Page({ params }: { params: { id: string } }) {
    const { userValue } = useUserContext();
    const router = useRouter();
    const [kanbanTitle, setKanbanTitle] = useState<string>("");
    const [usersArray, setUsersArray] = useState<Member[]>([]);
    const [allUsersArray, setAllUsersArray] = useState<Member[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Member[]>([]);
    const [removeSelectedUsers, setRemoveSelectedUsers] = useState<Member[]>([]);
    const [customFieldsTemplates, setCustomFieldsTemplates] = useState<CustomFieldsTemplate[]>([]);
    const [selectedCustomFieldsTemplates, setSelectedCustomFieldsTemplates] = useState<CustomFieldsTemplate[]>([]);

    useEffect(() => {
        setAllUsersArray(userValue.usersList);

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban`, requestOptions).then(response => response.json()).then((data: {id: SystemID, title:string}[]) => {
            data.forEach((element: { id: SystemID, title: string }) => {
                let id = element.id;
                let title = element.title;
                if ((id as number) === parseInt(params.id as string)) {
                    console.log(title);
                    setKanbanTitle(title);
                }
            });

        })

        const usersRequestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban/${params.id}`, usersRequestOptions).then(response => response.json()).then((data: Member[]) => {
            console.log(data);
            setUsersArray(data);
        })


        const customFieldsTemplatesRequest = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        }
        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/customField/templates`, 
            customFieldsTemplatesRequest).then(response => response.json()).then((data: CustomFieldsTemplate[]) => {
                console.log(data);
                setCustomFieldsTemplates(data);
        })




    }, [userValue, params, setKanbanTitle, setUsersArray, setAllUsersArray, setCustomFieldsTemplates]);

    const updateUsersArray = () => {
        const usersRequestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        };
        fetch(`${API_BASE_URL}/api/private/user/kanban/${params.id}`, usersRequestOptions).then(response => response.json()).then((data: Member[]) => {
            console.log(data);
            setUsersArray(data);
        })
    }

    const handleAddMembersToKanban = () => {
        selectedUsers.forEach((e: userData) => {
            const usersRequestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userValue.token}`,
                },
                body: JSON.stringify({ kanbanId: parseInt(params.id), userId: e.id }),
            };
            fetch(`${API_BASE_URL}/api/private/user/invite/kanban`, usersRequestOptions);
            console.log("convidado usuario", e.name, "para a dashboard", kanbanTitle);
        });
        updateUsersArray();
    }

    const handleRemoveMemberFromKanban = () => {
        removeSelectedUsers.forEach((e: userData) => {
            const usersRequestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userValue.token}`,
                },
            };
            fetch(`${API_BASE_URL}/api/private/user/kanban/${params.id}/remove/user/${e.id}`, usersRequestOptions);
            console.log("removido usuario", e.name, "da dashboard", kanbanTitle);
        });


        updateUsersArray();
    }

    const handleSubmitRenameKanban = (e: any) => {
        e.preventDefault();
        let newTitle: string = e.target.kanbanname.value;
        setKanbanTitle(newTitle);
        const requestOpts = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
            body: JSON.stringify({title: newTitle}),
        }
        fetch(`${API_BASE_URL}/api/private/user/kanban/${params.id}`)
    }

    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <div className="relative w-full flex flex-row justify-center items-center px-2 my-2">
                <h1 className="">Configurações da Dashboard {kanbanTitle}</h1>
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
            </div>


            <div>
                <RenameKanbanSection 
                    onSubmit={handleSubmitRenameKanban}
                    defaultValue={kanbanTitle}
                    submitButtonText="Salvar"
                    submitButtonStyles=""
                />
            </div>






            <div className="flex justify-between items-center p-2 w-fit h-fit">
                <div className="flex flex-col justify-center items-center w-96 h-fit">
                    <div className="w-full">
                        <AddMemberToDashboardSection
                            people={allUsersArray}
                            setSelectedPeople={setSelectedUsers}
                            selectedPeople={selectedUsers}
                        />
                        <button type="button" onClick={handleAddMembersToKanban}>
                            Adicionar Membros a Dashboard
                        </button>
                    </div>
                    <div className="w-full">
                        <RemoveMemberFromDashboardSection
                            people={usersArray}
                            setSelectedPeople={setRemoveSelectedUsers}
                            selectedPeople={removeSelectedUsers}
                        />
                        <button type="button" onClick={handleRemoveMemberFromKanban}>
                            Remover Membros da Dashboard
                        </button>
                    </div>
                </div>
                <div className="w-96 h-fit p-2">
                    <h1>Membros da Dashboard</h1>
                    <div>
                        {usersArray.map((element: Member, i: number) => <h1 key={i}>{element.name}</h1>)}
                    </div>
                </div>
            </div>


            
            <div>
                <RemoveCustomFieldTemplateSection
                    templates={customFieldsTemplates}
                    selectedTemplates={selectedCustomFieldsTemplates}
                    setSelectedTemplates={setSelectedCustomFieldsTemplates}
                />
            </div>





        </main>
    );

}

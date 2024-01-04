"use client";

/*
 *  [x] Add Member
 *  [x] Remove Members
 *  [ ] Tags
 *  [x] Custom Fields
 *  [x] Renomear Kanban
 * */

import { useUserContext } from "@/app/contexts/userContext";
import { CustomFieldsTemplate, Member, SystemID, Tag, userData } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";

interface SelectTagsSectionProps {
    tags: Tag[],
    setSelected: any;
    selected: Tag | undefined,
}
function SelectTagsSection(props: SelectTagsSectionProps) {
    const { selected, setSelected, tags } = props;

    const [query, setQuery] = useState('')

    const filteredTags =
        query === ''
        ? tags
        : tags.filter((tag) =>
            tag.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

    return (
        <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(tag: Tag) => tag.name}
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
              {tags.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredTags.map((tag: Tag) => (
                  <Combobox.Option
                    key={tag.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={tag}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {tag.name}
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
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    );
}









interface RenameKanbanSectionProps {
    onSubmit: any;
    defaultValue: string;
    submitButtonStyles: string;
    submitButtonText: string;
    inputStyles: string;
}
function RenameKanbanSection(props: RenameKanbanSectionProps) {
    const { submitButtonText, submitButtonStyles, defaultValue, onSubmit, inputStyles } = props;
    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Insira um novo nome" defaultValue={defaultValue} name="kanbanname" className={`form-input ${inputStyles}`} />
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
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const [isEditingTag, setIsEditingTag] = useState<boolean>(false);
    const [color, setColor] = useState<string>("");
    const [tagNameDefaultValue, setTagNameDefaultValue] = useState<string>("");


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



        const tagsRequest = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        }
        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tags`, 
            tagsRequest).then(response => response.json()).then((data: Tag[]) => {
                console.log(data);
                setAllTags(data);
        })



    }, [userValue, params, setKanbanTitle, setUsersArray, setAllUsersArray, setCustomFieldsTemplates, setAllTags]);

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
        fetch(`${API_BASE_URL}/api/private/user/kanban/${params.id}`, requestOpts);
    }



    const handleDeleteCustomTemplates = () => {
        const requestOpts = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        }
        selectedCustomFieldsTemplates.forEach((value: CustomFieldsTemplate) => {
            fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/customField/template/${value.name}`, requestOpts);
            console.log(`Template ${value.name} apagado.`);
        })
    }


    const handleDeleteTag = () => {
        const requestOpts = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
        }

        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tag/${selectedTag?.id}`, requestOpts);
        console.log(`Tag ${selectedTag?.name} removida.`);
    }

    const handleEditTag = () => {
        setColor(selectedTag?.color as string);
        setTagNameDefaultValue(selectedTag?.name as string);
        setIsEditingTag(true);
    }

    const handleEditTagSubmit = (e: any) => {
        e.preventDefault();
        let tagTitle: string = e.target.title.value;
        let tagColor: string = color;
        const requestOpts = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
            body: JSON.stringify({name: tagTitle, color: tagColor}),
        }
        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tag/${selectedTag?.id}`, requestOpts);
    }

    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <div className="relative w-full flex flex-row justify-center items-center px-2 mt-2 mb-4">
                <h1 className="text-lg font-semibold">Configurações da Dashboard {kanbanTitle}</h1>
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
            </div>

            <div className="my-2">
                <h1 className="text-lg font-semibold">Renomear Dashboard</h1>
                <RenameKanbanSection 
                    onSubmit={handleSubmitRenameKanban}
                    defaultValue={kanbanTitle}
                    submitButtonText="Salvar"
                    submitButtonStyles="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600"
                    inputStyles="bg-neutral-200 border-[1px] border-neutral-200 rounded-md shadow-inner p-1 my-1"
                />
            </div>

            <div className="my-2 w-full">
            <h1 className="text-lg font-semibold">Gerenciar Membros da Dashboard</h1>
            <div className="flex justify-between items-center p-2 w-full h-fit">
                <div className="flex flex-col justify-center items-center w-fit h-fit">
                    <div className="flex items-center">
                        <AddMemberToDashboardSection
                            people={allUsersArray}
                            setSelectedPeople={setSelectedUsers}
                            selectedPeople={selectedUsers}
                        />
                        <button type="button" onClick={handleAddMembersToKanban} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600">
                            Adicionar Membro
                        </button>
                    </div>
                    <div className="flex items-center">
                        <RemoveMemberFromDashboardSection
                            people={usersArray}
                            setSelectedPeople={setRemoveSelectedUsers}
                            selectedPeople={removeSelectedUsers}
                        />
                        <button type="button" onClick={handleRemoveMemberFromKanban} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-red-600">
                            Remover Membro
                        </button>
                    </div>
                </div>
                <div className="w-96 h-fit p-2">
                    <h1 className="w-full text-center font-semibold">Membros da Dashboard</h1>
                    <div className="bg-neutral-200 border-[1px] border-neutral-200 rounded-md shadow-inner p-1 my-1">
                        {usersArray.map((element: Member, i: number) => <h1 key={i}>{element.name}</h1>)}
                    </div>
                </div>
            </div>
            </div>


            <h1 className="text-lg font-semibold mt-2 mb-1">Templates de Campos Customizados</h1>
            <div className="flex items-center">
                <RemoveCustomFieldTemplateSection
                    templates={customFieldsTemplates}
                    selectedTemplates={selectedCustomFieldsTemplates}
                    setSelectedTemplates={setSelectedCustomFieldsTemplates}
                />
                <button type="button" onClick={handleDeleteCustomTemplates} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-red-600 ml-4">
                    Apagar Templates
                </button>
            </div>



            <div>
                <div className={`${isEditingTag ? 'flex' : 'hidden'} z-[99999999999999999] absolute inset-0 w-screen h-screen justify-center items-center bg-neutral-950/25`}>
                    <div className="w-fit h-fit p-2 rounded-md shadow-md bg-neutral-50">
                        <div className="w-full h-fit flex justify-end items-center mb-2">
                            <h1 className="w-full font-semibold text-center">Editar Tag</h1>
                        <button type="button" onClick={() => setIsEditingTag(false)}>
                            <XCircleIcon className="w-6 aspect-square"/>
                        </button>
                        </div>
                        <form onSubmit={handleEditTagSubmit}>
                            <input defaultValue={tagNameDefaultValue} type='text' name='title' placeholder='Nome da Etiqueta' className='form-input bg-neutral-100 w-48 border-[1px] border-neutral-200 rounded-md p-1 shadow-inner m-2' />
                            <HexColorPicker color={color} onChange={setColor} className='m-2' />
                            <button type='submit' className="bg-neutral-50 p-2 drop-shadow rounded-md my-2">Salvar</button>
                        </form>
                    </div>
                </div>


                <h1 className="text-lg font-semibold mt-2 mb-1">Gerenciar Etiquetas Criadas</h1>
                <div className="flex items-center">

                <SelectTagsSection 
                    tags={allTags}
                    selected={selectedTag}
                    setSelected={setSelectedTag}
                />

                <button type="button" onClick={handleEditTag} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-blue-600 ml-4">
                    editar etiqueta
                </button>

                <button type="button" onClick={handleDeleteTag} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-red-600 ml-4">
                    remover etiqueta
                </button>
                </div>
            </div>





        </main>
    );

}

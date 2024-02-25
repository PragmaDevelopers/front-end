"use client";

/*
 *  [x] Add Member
 *  [x] Remove Members
 *  [ ] Tags
 *  [x] Custom Fields
 *  [x] Renomear Kanban
 * */

import { useUserContext } from "@/app/contexts/userContext";
import { CustomFieldsTemplate, SystemID, Tag, User } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment, RefObject, useRef } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { InviteToKanban, RenameTitleKanban, UninviteFromKanban } from "@/app/utils/dashboard/functions/Page/Kanban";
import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { useModalContext } from "@/app/contexts/modalContext";
import { get_kanban_members } from "@/app/utils/fetchs";

// interface SelectTagsSectionProps {
//   tags: Tag[],
//   setSelected: any;
//   selected: Tag | undefined,
// }
// function SelectTagsSection(props: SelectTagsSectionProps) {
//   const { selected, setSelected, tags } = props;

//   const [query, setQuery] = useState('')

//   const filteredTags =
//     query === ''
//       ? tags
//       : tags.filter((tag) =>
//         tag.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
//       )

//   return (
//     <Combobox value={selected} onChange={setSelected}>
//       <div className="relative mt-1">
//         <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
//           <Combobox.Input
//             className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
//             displayValue={(tag: Tag) => tag.name}
//             onChange={(event) => setQuery(event.target.value)}
//           />
//           <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//             <ChevronUpDownIcon
//               className="h-5 w-5 text-gray-400"
//               aria-hidden="true"
//             />
//           </Combobox.Button>
//         </div>
//         <Transition
//           as={Fragment}
//           leave="transition ease-in duration-100"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//           afterLeave={() => setQuery('')}
//         >
//           <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
//             {tags.length === 0 && query !== '' ? (
//               <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
//                 Nothing found.
//               </div>
//             ) : (
//               filteredTags.map((tag: Tag) => (
//                 <Combobox.Option
//                   key={tag.id}
//                   className={({ active }) =>
//                     `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
//                     }`
//                   }
//                   value={tag}
//                 >
//                   {({ selected, active }) => (
//                     <>
//                       <span
//                         className={`block truncate ${selected ? 'font-medium' : 'font-normal'
//                           }`}
//                       >
//                         {tag.name}
//                       </span>
//                       {selected ? (
//                         <span
//                           className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
//                             }`}
//                         >
//                           <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </Combobox.Option>
//               ))
//             )}
//           </Combobox.Options>
//         </Transition>
//       </div>
//     </Combobox>
//   );
// }



// interface RemoveCustomFieldTemplateProps {
//   setSelectedTemplates: any;
//   selectedTemplates: CustomFieldsTemplate[];
//   templates: CustomFieldsTemplate[];
// }
// function RemoveCustomFieldTemplateSection(props: RemoveCustomFieldTemplateProps) {
//   const { setSelectedTemplates, selectedTemplates, templates } = props;
//   const [query, setQuery] = useState('');

//   return (
//     <Combobox value={selectedTemplates} onChange={setSelectedTemplates} multiple>
//       <div className="relative mt-1">
//         <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
//           <Combobox.Input
//             className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
//             displayValue={(templates: CustomFieldsTemplate[]) =>
//               templates.map((item: CustomFieldsTemplate) => item.name).join(', ')
//             }
//             onChange={(event) => setQuery(event.target.value)}
//           />
//           <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//             <ChevronUpDownIcon
//               className="h-5 w-5 text-gray-400"
//               aria-hidden="true"
//             />
//           </Combobox.Button>
//         </div>
//         <Transition
//           as={Fragment}
//           leave="transition ease-in duration-100"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//           afterLeave={() => setQuery('')}
//         >
//           <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
//             {
//               templates.map((value: any, index: number) => (
//                 <Combobox.Option
//                   key={index}
//                   className={({ active }) =>
//                     `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
//                     }`
//                   }
//                   value={value}
//                 >
//                   {({ selected, active }) => (
//                     <>
//                       <span
//                         className={`block truncate ${selected ? 'font-medium' : 'font-normal'
//                           }`}
//                       >
//                         {value.name}
//                       </span>
//                       {selected ? (
//                         <span
//                           className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
//                             }`}
//                         >
//                           <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </Combobox.Option>
//               ))
//             }
//           </Combobox.Options>
//         </Transition>
//       </div>
//     </Combobox>
//   );

// }

interface RenameKanbanSectionProps {
  failModalOption: any;
  noButtonRef: RefObject<HTMLButtonElement>;
}
function RenameKanbanSection(props: RenameKanbanSectionProps) {
  const { failModalOption,noButtonRef } = props;

  const [title,setTitle] = useState<string>("");
  const { userValue } = useUserContext();
  const { tempKanban, setTempKanban, kanbanList, setKanbanList } = useKanbanContext();
  const modalContextProps = useModalContext();

  function handleRenameTitleKanban(){
    RenameTitleKanban(
      userValue,
      title,
      setTempKanban,
      tempKanban,
      failModalOption,
      noButtonRef,
      modalContextProps
    );
  }

  return (
    <div>
      <input onChange={(e)=>setTitle(e.target.value)} type="text" placeholder="Insira um novo nome" defaultValue={tempKanban.title} name="kanbanname" className={`form-input rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600`} />
      <button type="button" onClick={handleRenameTitleKanban} className="bg-neutral-200 border-[1px] border-neutral-200 rounded-md shadow-inner p-1 my-1">Salvar</button>
    </div>
  );
}

interface InviteToKanbanSectionProps {
  failModalOption: any;
  noButtonRef: RefObject<HTMLButtonElement>;
}
function InviteToKanbanSection(props: InviteToKanbanSectionProps) {

  const { failModalOption, noButtonRef } = props;

  const [selectedMember, setSelectedMember] = useState<User | undefined>();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { userValue } = useUserContext();
  const { tempKanban, setTempKanban } = useKanbanContext();
  const modalContextProps = useModalContext();

  useEffect(()=>{
    get_kanban_members(undefined,tempKanban.id,userValue.token,(response=>response.json().then((members:User[])=>{
        setTempKanban({...tempKanban,members:members});
    })));
  },[])

  useEffect(() => {
    const newFilteredUsers = userValue.userList.filter(user => {
      const isMember = tempKanban.members?.some((member: User) => member.id == user.id);
      return !isMember;
    })
    setFilteredUsers(newFilteredUsers);
    setSelectedMember(undefined);
  }, [tempKanban])

  const handleInviteToKanban = () => {
    InviteToKanban(
      userValue,
      selectedMember,
      setTempKanban,
      tempKanban,
      failModalOption,
      noButtonRef,
      modalContextProps
    )
  }

  return (
    <div className="flex items-center">
      <Combobox defaultValue={selectedMember} onChange={(user) => { setSelectedMember(user) }}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(user: User) => user.name}
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
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {
                filteredUsers?.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
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
      <button type="button" onClick={handleInviteToKanban} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-green-600">
        Adicionar Membro
      </button>
    </div>
  );
}

interface UninviteToKanbanSectionProps {
  failModalOption: any;
  noButtonRef: RefObject<HTMLButtonElement>;
}
function UninviteFromKanbanSection(props: UninviteToKanbanSectionProps) {
  const { failModalOption, noButtonRef } = props;

  const [selectedMember, setSelectedMember] = useState<User>();

  const { userValue } = useUserContext();
  const { tempKanban, setTempKanban } = useKanbanContext();
  const modalContextProps = useModalContext();

  const handleUninviteFromKanban = () => {
    tempKanban.title;
    setTempKanban(tempKanban);
    UninviteFromKanban(
      userValue,
      selectedMember,
      setTempKanban,
      tempKanban,
      failModalOption,
      noButtonRef,
      modalContextProps
    )
  }

  return (
    <div className="flex items-center">
      <Combobox defaultValue={selectedMember} onChange={setSelectedMember}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(user: User) => user.name}
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
          >
            <Combobox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {
                tempKanban.members?.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
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
      <button type="button" onClick={handleUninviteFromKanban} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-red-600">
        Remover Membro
      </button>
    </div>

  );
}

export default function Page() {
  const { tempKanban } = useKanbanContext();
  const modalContextProps = useModalContext();

  const router = useRouter();

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
    <main className="w-full h-full overflow-auto shrink-0 p-2">
      <div className="relative w-full flex flex-row justify-center items-center px-2 mt-2 mb-4">
        <h1 className="text-lg font-semibold">Configurações da Dashboard {tempKanban.title}</h1>
        <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
      </div>

      <div className="my-2 w-full flex flex-col items-center">
        <h1 className="text-lg font-semibold">Renomear Dashboard</h1>
        <RenameKanbanSection
          failModalOption={failModalOption}
          noButtonRef={noButtonRef}
        />
      </div>

      <div className="my-2 w-full flex justify-center gap-2">
        <div>
          <h1 className="text-lg text-center w-full font-semibold">Gerenciar Membros da Dashboard</h1>
          <div className="flex flex-col justify-center items-center w-full">
            <InviteToKanbanSection
              failModalOption={failModalOption}
              noButtonRef={noButtonRef}
            />
            <UninviteFromKanbanSection
              failModalOption={failModalOption}
              noButtonRef={noButtonRef}
            />
          </div>
        </div>
        <div className="w-96 h-fit p-2">
          <h1 className="w-full text-center font-semibold">Membros da Dashboard</h1>
          <div className="bg-neutral-200 border-[1px] border-neutral-200 rounded-md shadow-inner w-full p-2 flex flex-col gap-2 mt-2">
            {tempKanban.members?.map((member: User, index) => {
              return (
                <div key={index} className="bg-neutral-50 p-2 drop-shadow-md rounded-md">
                  <div className="w-full text-center">
                    <h1>{member.name}</h1>
                  </div>
                  <div className="w-full text-center">
                    <h2>{member.email}</h2>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* <h1 className="text-lg font-semibold mt-2 mb-1">Templates de Campos Customizados</h1>
            <div className="flex items-center">
                <RemoveCustomFieldTemplateSection
                    templates={customFieldsTemplates}
                    selectedTemplates={selectedCustomFieldsTemplates}
                    setSelectedTemplates={setSelectedCustomFieldsTemplates}
                />
                <button type="button" onClick={handleDeleteCustomTemplates} className="rounded-md bg-neutral-50 p-2 m-2 shadow-md transition-all hover:scale-110 text-neutral-950 hover:text-red-600 ml-4">
                    Apagar Templates
                </button>
            </div> */}



      {/* <div>
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
            </div> */}

    </main>
  );

}

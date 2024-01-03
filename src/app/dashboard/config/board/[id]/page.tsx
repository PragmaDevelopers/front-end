"use client";

import { useUserContext } from "@/app/contexts/userContext";
import { Member, SystemID } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
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

    }, [userValue, params, setKanbanTitle, setUsersArray, setAllUsersArray]);


    return (
        <main className="w-full h-full overflow-auto shrink-0">
            <div className="relative w-full flex flex-row justify-center items-center px-2 my-2">
                <h1 className="">Configurações da Dashboard {kanbanTitle}</h1>
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
            </div>
            <div>
                <AddMemberToDashboardSection
                    people={allUsersArray}
                    setSelectedPeople={setSelectedUsers}
                    selectedPeople={selectedUsers}
                />
            </div>
            <div>
                {selectedUsers.map((v, i) => <h1 key={i}>{v.name}</h1>)}
            </div>
        </main>
    );

}

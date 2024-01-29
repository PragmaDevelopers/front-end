"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useUserContext } from "@/app/contexts/userContext";
import { User, userValueDT } from "@/app/types/KanbanTypes";
import { SYSTEM_PERMISSIONS, SYSTEM_PERMISSIONS_BOOLEAN } from "@/app/utils/variables";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SwitchButton from "@/app/components/ui/SwitchButton";
import { useRouter } from "next/navigation";

type Permissions = { [Key: string]: boolean };

interface ToggleOptionProps {
  optionText: string;
  srText: string;
  onFunction: () => void;
  offFunction: () => void;
  className?: string;
  defaultValue: boolean;
}

function binaryStringToPermissions(binaryString: string): Permissions {
  let permissions: Permissions = { ...SYSTEM_PERMISSIONS_BOOLEAN };

  for (let i = 0; i < binaryString.length; i++) {
    const key = Object.keys(permissions)[i];
    permissions[key] = binaryString[i] === '1';
  }

  return permissions;
}

function isFlagSet(userValue: User, flag: string): boolean {
  let bitMask: number = SYSTEM_PERMISSIONS[flag];
  let binaryValue: number = parseInt(userValue.permissionLevel, 2);
  return (binaryValue & bitMask) !== 0;
}

function ToggleBitFlag(
  setBit: boolean,
  flag: string,
  setUserValue: (selectedUser: User) => void,
  selectedUser: User
): void {
  let tempUsr: User = { ...selectedUser };

  // let binaryNumber = parseInt(tempUsr.permissionLevel, 2);
  // const bitmask: number = SYSTEM_PERMISSIONS[flag];
  // binaryNumber = setBit ? binaryNumber | bitmask : binaryNumber & ~bitmask;
  // tempUsr.permissionLevel = binaryNumber.toString(2);

  Object.keys(SYSTEM_PERMISSIONS_BOOLEAN).findIndex(permission=>permission)

  console.log(`SETTING FLAG: ${flag} to ${setBit} for user ${tempUsr.name}; current PermsValue: ${tempUsr.permissionLevel}`);
  setUserValue(tempUsr);
}

function ToggleOption(props: ToggleOptionProps) {
  const { optionText, offFunction, onFunction, srText, className, defaultValue } = props;

  return (
    <div className={`${className} my-1 flex justify-between items-center w-full h-fit`}>
      <div className="flex flex-row justify-between items-center w-fit h-fit">
        <SwitchButton defaultValue={defaultValue} srText={srText} onFunction={onFunction} offFunction={offFunction} />
        <p className="ml-4">{optionText}</p>
      </div>
      <div className="p-2 w-fit h-fit">
        <div className="group relative flex flex-row justify-between items-center">
          <span className="text-sm text-neutral-600 group-hover:opacity-100 opacity-0 mr-2 transition-all">{srText}</span>
          <InformationCircleIcon className="aspect-square w-6 stroke-blue-300" />
        </div>
      </div>
    </div>
  );
}

function updateSelectedUser(userValue: userValueDT, setUserValue: (newValue: userValueDT) => void, updatedUser: User): void {
  const tmpUsrVal: userValueDT = {
    ...userValue,
    userList: userValue.userList.map((user: User) => (user.id === updatedUser.id ? updatedUser : user)),
  };

  setUserValue(tmpUsrVal);
}

export default function Page() {
  const { userValue, setUserValue } = useUserContext();
  const [selectedMember, setSelectedMember] = useState<User>();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usrPermsVal, setUsrPermsVal] = useState<Permissions>({});
  const [isUserSupervisor, setIsUserSupervisor] = useState<boolean>(false);
  const [selected, setSelected] = useState<User>(userValue.userList[0]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<Permissions>({});

  const filteredPeople = query === '' ? userValue.userList : userValue.userList.filter((person: User) => person.name.toLowerCase().includes(query.toLowerCase()));
  const router = useRouter();

  useEffect(() => {
    if (selected && selected.permissionLevel) {
      const newUserPermsVal: Permissions = binaryStringToPermissions(selected.permissionLevel);
      setUsrPermsVal(newUserPermsVal);
    }
    console.log(Object.keys(SYSTEM_PERMISSIONS_BOOLEAN))
  }, []);


  const handleToggleFlag = (flagName: string, value: boolean) => {
    ToggleBitFlag(value, flagName, handleUpdateSelectedUser, selected);
  };

  const handleUpdateSelectedUser = (selectedUser: User) => {
    updateSelectedUser(userValue, setUserValue, selectedUser);
  };

  const handleSetSelect = (value: User): void => {
    if (value !== selected) {
      setSelected(value);
      setSelectedMember(value);
      setSelectedUserPermissions(binaryStringToPermissions(value.permissionLevel));
    }

    setIsModalOpen(!isModalOpen);
  };

  return (
    <main className="w-full h-full bg-neutral-100 overflow-hidden">
      <div className="flex flex-row justify-center items-center relative my-2">
        <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}>
          <ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" />
        </button>
        <h1 className="font-bold text-2xl text-neutral-900">Admin</h1>
      </div>

      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-[75%] flex flex-row justify-center items-center">
          <h1 className="mr-2">Editando permissões para o usuário: </h1>
          <div className="w-96 ml-2">
            {/* <Combobox onChange={(user: User) => setSelectedMember(user)}>  */}
            <Combobox onChange={(user: User) => {
              setSelectedMember(user);
              setIsModalOpen(true);
            }}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="form-input w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
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
                  afterLeave={() => { }}
                >
                  <Combobox.Options className="form-select absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {userValue.userList.length === 0 ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      userValue.userList.map((person: any) => (
                        <Combobox.Option
                          key={person.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 rounded-md ${active ? 'bg-teal-50 text-neutral-900' : 'text-gray-900'
                            }`
                          }
                          value={person}
                        >
                          {({ selected, active }: any) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {person.name}
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
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-start relative p-4 w-full h-[85%] overflow-hidden">
        <button
          type="button"
          className="mt-4 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all"
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            setSelectedUserPermissions(binaryStringToPermissions(selected.permissionLevel));
          }}
        >
          Salvar
        </button>

        <Transition
          show={isModalOpen}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                      Permissões para {selectedMember?.name}
                    </h3>
                    <div className="mt-2">
                      {Object.keys(SYSTEM_PERMISSIONS_BOOLEAN).map(permission => {
                        return (
                          <ToggleOption
                            key={permission}
                            optionText={permission}
                            srText={`Toggle ${permission} permission`}
                            onFunction={() => handleToggleFlag(permission, true)}
                            offFunction={() => handleToggleFlag(permission, false)}
                            defaultValue={selectedUserPermissions[permission]}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-neutral-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </main>
  );
}

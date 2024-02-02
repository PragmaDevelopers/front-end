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
import { patch_user_config } from "@/app/utils/fetchs";

type Permissions = { [Key: string]: boolean };

interface ToggleOptionProps {
  optionText: string;
  srText: string;
  onFunction: () => void;
  offFunction: () => void;
  className?: string;
  defaultValue: boolean;
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
  const keys = Object.keys(SYSTEM_PERMISSIONS_BOOLEAN); 
  const index = keys.indexOf(flag);
  if(index !== -1){
    const permission = tempUsr.permissionLevel.split("");
    permission[index] = setBit ? "1" : "0";
    tempUsr.permissionLevel = permission.join("");
    console.log(`SETTING FLAG: ${flag} to ${setBit} for user ${tempUsr.name}; current PermsValue: ${tempUsr.permissionLevel}`);
    setUserValue(tempUsr);
  }
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

export default function Page() {
  const { userValue, setUserValue } = useUserContext();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isUserSupervisor, setIsUserSupervisor] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissionLevel,setPermissionLevel] = useState<{key:string,value:boolean}[]>([]);

  const router = useRouter();

  useEffect(() => {
    const newFilteredUsers = userValue.userList.filter(user => user.id != userValue.profileData.id);
    setFilteredUsers(newFilteredUsers);
  }, []);

  function handleModalConfig(isShow:boolean,user?:User){
    setIsModalOpen(isShow);
    if(user){
      setSelectedUser(user);
      const newPermissions = Object.keys(SYSTEM_PERMISSIONS_BOOLEAN).map((permission,index)=>{
        const isPermission = user.permissionLevel.charAt(index).includes("1");
        return {key:permission,value:isPermission};
      });
      setPermissionLevel(newPermissions);
    }
  }

  const handleToggleFlag = (flagName: string, value: boolean) => {
    if(selectedUser){
      ToggleBitFlag(value, flagName, setSelectedUser, selectedUser);
    }
  };

  function handleToggleIsSupervisor(value:boolean){
    setIsUserSupervisor(value);
    if(selectedUser){
      if(value){
        setSelectedUser({...selectedUser,role:"ROLE_SUPERVISOR"});
      }else{
        setSelectedUser({...selectedUser,role:"ROLE_MEMBER"});
      }
    }
  }

  function handleChangeSave(){
    if(selectedUser){
      patch_user_config({
        permissionLevel:selectedUser.permissionLevel,
        isSupervisor:isUserSupervisor
      },selectedUser.id,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
          console.log("UPDATE PERMISSION USER");
        }
      }));
      const newFilteredUsers = filteredUsers.map((user)=>{
        if(user.id = selectedUser.id){
          user.permissionLevel = selectedUser.permissionLevel;
          user.role = selectedUser.role;
        }
        return user;
      });
      setFilteredUsers([...newFilteredUsers]);
      const newUserList = userValue.userList.map((user)=>{
        if(user.id = selectedUser.id){
          user.permissionLevel = selectedUser.permissionLevel;
          user.role = selectedUser.role;
        }
        return user;
      });
      setUserValue({...userValue,userList:newUserList});
    }
  }

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
            <Combobox onChange={(user: User) => {
              handleModalConfig(true,user);
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
                    {filteredUsers?.length === 0 ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredUsers?.map((person: any) => (
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
          <div className="flex items-center justify-center w-full h-full z-50 fixed left-0 top-0">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              <div
                className="block align-bottom overflow-y-auto p-4 max-w-[90%] max-h-[90%] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="mb-5 flex justify-end items-center">
                  <button
                    type="button"
                    className="p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all"
                    onClick={() => {
                      handleModalConfig(false);
                      handleChangeSave();
                    }}
                  >
                    Salvar
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                      Permissões para {selectedUser?.name}
                    </h3>
                    <div className="mt-2">
                      {
                        userValue.profileData.role == "ROLE_ADMIN" && (
                          <div className={`my-1 flex justify-between items-center w-full h-fit`}>
                            <div className="flex flex-row justify-between items-center w-fit h-fit">
                              <SwitchButton defaultValue={selectedUser?.role == "ROLE_SUPERVISOR"} srText={`Toggle SUPERVISOR permission`} onFunction={()=>handleToggleIsSupervisor(true)} offFunction={()=>handleToggleIsSupervisor(false)} />
                              <p className="ml-4">{`SUPERVISOR`}</p>
                            </div>
                            <div className="p-2 w-fit h-fit">
                              <div className="group relative flex flex-row justify-between items-center">
                                <span className="text-sm text-neutral-600 group-hover:opacity-100 opacity-0 mr-2 transition-all">{`Toggle SUPERVISOR permission`}</span>
                                <InformationCircleIcon className="aspect-square w-6 stroke-blue-300" />
                              </div>
                            </div>
                          </div>
                        )
                      }
                      {permissionLevel.map((permission,index) => {
                        return (
                          <ToggleOption
                            key={index}
                            optionText={permission.key}
                            srText={`Toggle ${permission.key} permission`}
                            onFunction={() => handleToggleFlag(permission.key, true)}
                            offFunction={() => handleToggleFlag(permission.key, false)}
                            defaultValue={permission.value}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </Transition>
      </div>
    </main>
  );
}

"use client";
import SwitchButton from "@/app/components/ui/SwitchButton";
import { useUserContext } from "@/app/contexts/userContext";
import { userData, userValueDT } from "@/app/types/KanbanTypes";
import { SYSTEM_PERMISSIONS, SYSTEM_PERMISSIONS_BOOLEAN } from "@/app/utils/variables";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

interface ToggleOptionProps {
  optionText: string;
  srText: string;
  onFunction: () => void;
  offFunction: () => void;
  className?: string;
  defaultValue: boolean;
}

function binaryStringToPermissions(binaryString: string): { [Key: string]: boolean } {
  let permissions: { [Key: string]: boolean } = { ...SYSTEM_PERMISSIONS_BOOLEAN };

  for (let i = 0; i < binaryString.length; i++) {
    const key = Object.keys(permissions)[i];
    permissions[key] = binaryString[i] === '1';
  }

  return permissions;
}

function isFlagSet(userValue: userData, flag: string): boolean {
  let bitMask: number = SYSTEM_PERMISSIONS[flag];
  let binaryValue: number = parseInt(userValue.permissionLevel, 2);
  return (binaryValue & bitMask) !== 0;
}

function ToggleBitFlag(
  setBit: boolean,
  flag: string,
  updateUserValue: (selectedUser: userData) => void,
  selectedUser: userData
): void {
  let tempUsr: userData = { ...selectedUser };

  let binaryNumber = parseInt(tempUsr.permissionLevel, 2);
  const bitmask: number = SYSTEM_PERMISSIONS[flag];
  binaryNumber = setBit ? binaryNumber | bitmask : binaryNumber & ~bitmask;
  tempUsr.permissionLevel = binaryNumber.toString(2);

  console.log(`SETTING FLAG: ${flag} to ${setBit} for user ${tempUsr.name}; current PermsValue: ${tempUsr.permissionLevel}`);
  updateUserValue(tempUsr);
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

function updateSelectedUser(userValue: userValueDT, updateUserValue: (newValue: userValueDT) => void, updatedUser: userData): void {
  const tmpUsrVal: userValueDT = {
    ...userValue,
    usersList: userValue.usersList.map((user: userData) => (user.id === updatedUser.id ? updatedUser : user)),
  };

  updateUserValue(tmpUsrVal);
}


export default function Page() {
  const router = useRouter();
  const { userValue, updateUserValue } = useUserContext();
  const [usrPermsVal, setUsrPermsVal] = useState<{ [Key: string]: boolean }>({});
  const [isUserSupervisor, setIsUserSupervisor] = useState<boolean>(false);

  const [selected, setSelected] = useState<userData>(userValue.usersList[0]);
  const [query, setQuery] = useState('');

  const filteredPeople = query === '' ? userValue.usersList : userValue.usersList.filter((person: userData) => person.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (selected && selected.permissionLevel) {
      const newUserPermsVal: { [Key: string]: boolean } = binaryStringToPermissions(selected.permissionLevel);
      setUsrPermsVal(newUserPermsVal);
    }
  }, [selected]);

  const handleToggleFlag = (flagName: string, value: boolean) => {
    ToggleBitFlag(value, flagName, handleUpdateSelectedUser, selected);
  };

  const handleUpdateSelectedUser = (selectedUser: userData) => {
    updateSelectedUser(userValue, updateUserValue, selectedUser);
  };

  const handleSetSelect = (value: userData): void => {
    if (value !== selected) {
      setSelected(value);
    }
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
            <Combobox value={selected} onChange={handleSetSelect}>
              <div className="relative mt-1">
              </div>
            </Combobox>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-start relative p-4 w-full h-[85%] overflow-hidden">
        <div className="w-[75%] h-fit p-2 bg-neutral-50 drop-shadow-md rounded-md flex flex-col justify-start items-center overflow-auto">
        </div>
        <button
          type="button"
          className="mt-4 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all"
        >
          Salvar
        </button>
      </div>
    </main>
  );
}

"use client";

import { Switch } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface SwitchButtonProps {
    srText: string;
    onFunction: any;
    offFunction: any;
}

export default function SwitchButton(props: SwitchButtonProps) {
    const [enabled, setEnabled] = useState<boolean>(false);

    const { srText, onFunction, offFunction } = props;

    const handleSwitch = () => {
        setEnabled(!enabled);
        if (enabled) {
            onFunction();
        } else {
            offFunction();
        }
    }

    return (
        <Switch
            checked={enabled}
            onChange={handleSwitch}
            className={`${enabled ? 'bg-green-200' : 'bg-red-100'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
            <span className="sr-only">{srText}</span>
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition flex justify-center items-center`}>
                <CheckIcon className={`${enabled ? 'block' : 'hidden'} h-3 w-3 aspect-square full-green-500 stroke-green-500`} />
                <XMarkIcon className={`${enabled ? 'hidden' : 'block'} h-3 w-3 aspect-square full-red-500 stroke-red-500`} />

            </span>
        </Switch>
    );
}

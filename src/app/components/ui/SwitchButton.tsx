"use client";

import { Switch } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface SwitchButtonProps {
    srText: string;
    onFunction: any;
    offFunction: any;
    defaultValue: boolean;
}

export default function SwitchButton(props: SwitchButtonProps) {
    const { srText, onFunction, offFunction, defaultValue } = props;
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        setEnabled(defaultValue); // Define o estado inicial apenas uma vez
    }, [defaultValue]); //

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
            checked={enabled || false}
            onChange={handleSwitch}
            className={`${enabled ? 'bg-red-100' : 'bg-green-200'
                } relative inline-flex h-6 w-11 items-center rounded-full shadow-inner border-[1px] border-neutral-200`}
        >
            <span className="sr-only">{srText}</span>
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } h-4 w-4 transform rounded-full bg-white transition flex justify-center items-center drop-shadow-sm`}>
                <CheckIcon className={`${enabled ? 'hidden' : 'block'} transition-all h-3 w-3 aspect-square full-green-500 stroke-green-500`} />
                <XMarkIcon className={`${enabled ? 'block' : 'hidden'} transition-all h-3 w-3 aspect-square full-red-500 stroke-red-500`} />
            </span>
        </Switch>
    );
}

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface CustomModalProps {
    title: string,
    description: string,
    text: string,
    options: any,
    isOpen: boolean,
    setIsOpen: any,
    borderColor: string,
    focusRef: any,
}



export function CustomModal(props: CustomModalProps) {
    const {
        title,
        description,
        text,
        options,
        isOpen,
        setIsOpen,
        borderColor,
        focusRef
    } = props;


    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog initialFocus={focusRef} open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[999999999]">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                </Transition.Child>

                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className={`${(borderColor != "" | borderColor != undefined | borderColor != null) ? borderColor : "border-neutral-50"} border-2 w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-50 p-6 text-left align-middle shadow-xl transition-all`}>
                            <Dialog.Title as="h3"
                                className="text-lg font-semibold leading-6 text-neutral-900">{title}</Dialog.Title>
                            <Dialog.Description className="text font-medium leading-6 text-neutral-500">
                                {description}
                            </Dialog.Description>
                            <div className="mt-2">
                                <p className="text-sm text-neutral-500">
                                    {text}
                                </p>
                            </div>

                            {options?.map((el: any) => el)}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
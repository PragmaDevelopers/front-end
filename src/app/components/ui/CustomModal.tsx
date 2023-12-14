import { Fragment, ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface CustomModalProps {
    title: string;
    description: string;
    text: string;
    options: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>[];
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    focusRef: MutableRefObject<any>;
    panelClassName?: string;
    icon?: any;
    borderColor?: string;

}

export type CustomModalButtonAttributes = {
    text: string,
    onclickfunc: any,
    ref?: any,
    type: "button" | "submit" | "reset" | undefined,
    className?: string
};

export function CustomModal(props: CustomModalProps) {
    const { title, description, text, options, setIsOpen, isOpen, focusRef, icon, borderColor } = props;

    return (
        <Transition show={isOpen} as={Fragment} appear={true}>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[99999]" initialFocus={focusRef}>
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
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <div className={`${(borderColor != undefined || icon != null) ? borderColor : 'border-neutral-50'} border-2 w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-50 p-6 text-left align-middle shadow-xl transition-all relative`}>

                            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-neutral-900 font-poppins flex items-center">
                                <div className={`${(icon != undefined || icon != null) ? 'flex' : 'hidden'} mr-2 absolute top-2 left-2`}>
                                    {icon}
                                </div>
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="font-poppins text-sm text-neutral-600 font-medium">
                                {description}
                            </Dialog.Description>

                            <div className='mt-2'>
                                <p className='text-sm text-neutral-500'>
                                    {text}
                                </p>
                            </div>
                            <div className="mt-4 flex flex-row justify-evenly items-center">
                                {options?.map((el: any) => el)}
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition >
    )
}

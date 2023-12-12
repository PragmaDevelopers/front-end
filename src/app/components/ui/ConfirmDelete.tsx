import { ConfirmDeleteProps } from "@/app/interfaces/KanbanInterfaces";

export default function ConfirmDelete(props: ConfirmDeleteProps) {
    return (
        <div className={(props.showPrompt ? 'block' : 'hidden') + ' absolute z-50 top-0 left-0 w-screen h-screen flex justify-center items-center'}>
            <div className='bg-neutral-50 drop-shadow-lg rounded-md p-4 flex justify-center items-center flex-col'>
                <h1 className='mb-4'>{props.message}</h1>
                <div className='m-2'>
                    <button type="button" onClick={props.yesFunction} className='mx-2 p-2 rounded-md border-neutral-950 border-2 bg-neutral-50 text-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 transition-all'>{props.yesText}</button>
                    <button type="button" onClick={props.noFunction} className='mx-2 p-2 rounded-md border-red-600 border-2 bg-neutral-50 text-red-600 hover:bg-red-600 hover:text-neutral-950 transition-all'>{props.noText}</button>
                </div>
            </div>
        </div>
    );
}
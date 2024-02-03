import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { useModalContext } from "@/app/contexts/modalContext";
import { useUserContext } from "@/app/contexts/userContext";
import { InnerCardElementProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, SystemID } from "@/app/types/KanbanTypes";
import { ConfirmDeleteCard, DeleteCard } from "@/app/utils/dashboard/functions/Page/Card";
import { CreateInnerCard, ShowEditInnerCard } from "@/app/utils/dashboard/functions/Page/CreateEditCard";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { RefObject } from "react";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { delete_card } from "@/app/utils/fetchs";

interface InnerCardsSectionProps {
    innerCardArray: Card[];
    failModalOption: any;
    noButtonRef: RefObject<HTMLButtonElement>
}
export function InnerCardSection(props: InnerCardsSectionProps) {
    const { 
       innerCardArray,
       failModalOption,
       noButtonRef
    } = props;

    const { userValue } = useUserContext();
    const { setTempCard, tempCard,cardManager } = useKanbanContext();
    const modalContextProps = useModalContext();

    const handleCreateInnerCard = () => {
        CreateInnerCard(
            userValue,
            setTempCard,
            tempCard,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleEditInnerCard = (card:Card) => {
        ShowEditInnerCard(
            userValue,
            card.id,
            setTempCard,
            tempCard,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    const handleDeleteInnerCard = (innerCardIndex:number) => {
        const delInnerCard = () => {
            delete_card(undefined,tempCard.innerCards[innerCardIndex].id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("DELETE INNER CARD SUCCCESS");
                }
            }))
            const innerCards = innerCardArray;
            innerCards.splice(innerCardIndex,1);
            setTempCard({...tempCard,innerCards:innerCards})
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delInnerCard,
                type: "button",
                className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            },
            {
                text: "Não",
                onclickfunc: () => modalContextProps.setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ]

        const successModalOption: any = successOption.map(
            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
        );
        ConfirmDeleteCard(
            userValue,
            successModalOption,
            failModalOption,
            noButtonRef,
            modalContextProps
        )
    }

    return (
        <div className={(cardManager.isEditElseCreate ? 'block' : 'hidden') +" bg-neutral-100 border-[1px] border-neutral-100 w-full rounded-md shadow-inner p-1 my-1"}>
            <button className={`transition-all flex`} type='button'
                onClick={handleCreateInnerCard}>
                <PlusCircleIcon className='aspect-square w-6 mr-2' />
            </button>
            <div className='overflow-x-auto flex'>
                {innerCardArray?.map((innerCard,index)=>{
                    return (
                        <div key={innerCard.id} className={`${innerCard.id == "" || innerCard.id.toString().includes("|") ? "loading-element" : ""} m-2 min-w-[25%] w-[25%] bg-neutral-50 drop-shadow rounded-md relative`}>
                            <div onClick={()=>handleEditInnerCard(innerCard)} className='p-2 w-[90%] h-full cursor-pointer'>
                                <h1 className='font-black font-lg truncate'>{innerCard.title}</h1>
                            </div>
                            <button onClick={()=>handleDeleteInnerCard(index)} type="button" className='absolute top-2 right-1'>
                                <XCircleIcon className='w-6 aspect-square' />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

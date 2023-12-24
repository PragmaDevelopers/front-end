import { InnerCardElementProps } from "@/app/interfaces/KanbanInterfaces";
import { EditCard } from "@/app/utils/dashboard/functions/InnerCard";

export function InnerCardElement(props: InnerCardElementProps) {
    const {
        card,
        addInnerCard,
        createInnerCard,
        tempCardsArr,
        isCreatingInnerCard,
        setIsCreatingInnerCard,
        setIsEdittingInnerCard,
        isEdittingInnerCard,
        _appendToTempCardsArray,
        _popFromTempCardsArray,
    } = props;

    const handleEditCard = (): void => {
        EditCard(card, tempCardsArr, setIsEdittingInnerCard, _appendToTempCardsArray);
    }

    return (
        <button type='submit' className='mx-2 bg-neutral-50 drop-shadow rounded-md relative' onClick={handleEditCard}>
            <div className='p-2 w-full h-full'>
                <h1 className='font-black font-lg truncate'>{card.title}</h1>
            </div>
        </button>
    );

}
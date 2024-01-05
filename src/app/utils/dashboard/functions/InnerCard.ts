import { Card } from "@/app/types/KanbanTypes";
import { appendAndSetTempCard } from "./Page/InnerCardUtils";

export function EditCard(
    card: Card,
    setIsEdittingInnerCard: (value: boolean) => void,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>
): void {
    setIsEdittingInnerCard(true);
    appendAndSetTempCard(card, tempCard, tempCardsArray, setTempCard, setTempCardsArray);
}

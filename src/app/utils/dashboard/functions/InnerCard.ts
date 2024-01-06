import { Card } from "@/app/types/KanbanTypes";
import { appendAndSetTempCard } from "./Page/InnerCardUtils";

export function EditCard(
    card: Card,
    setIsEdittingInnerCard: (value: boolean) => void,
    appendToTempCardsArray: any,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>
): void {
    console.log("BUG CLICKED ON TEMPCARD START EDITCARD FUNC");
    setIsEdittingInnerCard(true);
    appendToTempCardsArray(card);
    console.log("BUG CLICKED ON TEMPCARD END EDITCARD FUNC");
}

import { Card } from "@/app/types/KanbanTypes";

export function EditCard(card: Card, tempCardsArr: Card[],
    setIsEdittingInnerCard: (value: boolean) => void,
    _appendToTempCardsArray: (value: Card) => void
): void {
    console.log("editing inner card", card);
    console.log(`BEFORE appending`, card, "to", tempCardsArr);
    setIsEdittingInnerCard(true);
    _appendToTempCardsArray(card);
    console.log(`AFTER appending to`, tempCardsArr);
}
import { Card } from "@/app/types/KanbanTypes";

export function EditCard(
    card: Card,
    setIsEdittingInnerCard: (value: boolean) => void,
    appendToTempCardsArray: any,
): void {
    setIsEdittingInnerCard(true);
    appendToTempCardsArray(card);
}

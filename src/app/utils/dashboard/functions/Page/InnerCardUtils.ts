import { Card } from "@/app/types/KanbanTypes";

export function AppendToTempCardsArray(
    newCard: Card,
    tempCardsArr: Card[],
    setTempCardsArr: (arg0: ((arg0: Card[]) => Card[]) | Card[]) => void,
    ) {
    console.log("APPENDING", newCard, "TO", tempCardsArr);
    setTempCardsArr((prevArr: Card[]) => {
        console.log(prevArr);
        console.log(tempCardsArr);
        return [...prevArr, newCard] as Card[];
    });
    console.log(tempCardsArr);
}

export function PopFromTempCardsArray(tempCardsArr: Card[], setTempCardsArr: (arg0: ((arg0: Card[]) => Card[]) | Card[]) => void): Card {
    const retVal = tempCardsArr[tempCardsArr.length - 1];
    setTempCardsArr((prevArr: Card[]) => {
        console.log(prevArr);
        console.log(tempCardsArr);
        const tPrevArr: Card[] = prevArr.slice(0, -1);
        return tPrevArr;
    });
    console.log("POPPING", retVal, "FROM", tempCardsArr);
    return retVal;
}
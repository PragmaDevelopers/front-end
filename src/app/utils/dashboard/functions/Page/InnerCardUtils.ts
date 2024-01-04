import { Card, SystemID } from "@/app/types/KanbanTypes";

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



export function removeCardById(targetId: SystemID, card: Card): Card {
  card.innerCards = card.innerCards.filter(innerCard => innerCard.id !== targetId);

  for (const innerCard of card.innerCards) {
    removeCardById(targetId, innerCard);
  }

  return card;
};

export function appendTempCardToArray (
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
): void {
    let _newTempArray: Card[] = tempCardsArray;
    _newTempArray.push(tempCard);
    let _newTempCard: Card = {
        title: "",
        id: "", // Assuming an appropriate default value for ID
        columnID: tempCard.columnID, // Assuming an appropriate default value for columnID
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        date: "",
        customFields: [],
        innerCards: [],
    }
  setTempCardsArray(_newTempArray);
  setTempCard(_newTempCard);
};

export function popAndAppendTempCard(
  tempCard: Card,
  tempCardsArray: Card[],
  setTempCard: React.Dispatch<React.SetStateAction<Card>>,
  setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>
): void {
    let _newTempArray: Card[] = tempCardsArray;
    const lastCard = _newTempArray[_newTempArray.length - 1];
    if (lastCard) {
        lastCard.innerCards.push(tempCard);
        let _mutatedTempArray: Card[] = _newTempArray.slice(0, -1);
        setTempCardsArray(_mutatedTempArray);
        setTempCard(lastCard);
  }
};

export function appendAndSetTempCardById(
    cardID: SystemID,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>
): void {
    const matchingCard = tempCard.innerCards.find(card => card.id === cardID);
    if (matchingCard) {
        let _newTempArray: Card[] = tempCardsArray;
        _newTempArray.push(tempCard);
        setTempCardsArray(_newTempArray);
        setTempCard(matchingCard);
  }
};


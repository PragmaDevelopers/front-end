import { Card, SystemID } from "@/app/types/KanbanTypes";

export function AppendToTempCardsArray(
    newCard: Card,
    tempCardsArr: Card[],
    setTempCardsArr: any,
    ) {
    let _tmpCard: Card = newCard;
    let _tmpArray: Card[] = tempCardsArr;
    _tmpArray.push(_tmpCard);
    setTempCardsArr(_tmpArray);
}

export function PopFromTempCardsArray(tempCardsArr: Card[], setTempCardsArr: any): Card | undefined {
    let _tmpArray: Card[] = tempCardsArr;
    const retVal = _tmpArray.pop();
    setTempCardsArr(_tmpArray);
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
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _newTempArray: Card[] = tempCardsArray;
    let lastCard = _newTempArray[_newTempArray.length - 1];
    if (lastCard) {
        lastCard.innerCards.push(tempCard);
        let _mutatedTempArray: Card[] = _newTempArray.slice(0, -1);
        setTempCardsArray(_mutatedTempArray);
        setTempCard(lastCard);
        if (callback !== undefined) {
            callback(lastCard);
        }
  }
};

export function appendAndSetTempCardById(
    cardID: SystemID,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
): void {
        let _newTempArray: Card[] = tempCardsArray;
        const matchingCard = tempCard.innerCards.find(card => card.id === cardID);
        if (matchingCard) {
        _newTempArray.push(tempCard);
        setTempCardsArray(_newTempArray);
        setTempCard(matchingCard);
    }
};

export function swapTempCardWithLast(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _cardsArray: Card[] = tempCardsArray;
    let _tmpCard: Card = tempCard;
    const poppedCard = _cardsArray.pop();
    if (poppedCard) {
        _cardsArray.push(_tmpCard);
        setTempCardsArray(_cardsArray);
        setTempCard(poppedCard);
        callback(poppedCard);
    }
};

export function appendTempCardToPoppedInnerCards(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _tmpArray = tempCardsArray;
    const poppedCard = _tmpArray.pop();
    if (poppedCard) {
        const cardIndex = poppedCard.innerCards.findIndex(card => card.id === tempCard.id);
        if (cardIndex !== -1) {
            poppedCard.innerCards[cardIndex] = tempCard;
        } else {
            poppedCard.innerCards.push(tempCard);
        }
        setTempCard(poppedCard);
        setTempCardsArray(_tmpArray);
        if (callback) {
            callback(poppedCard);
        }
    }
};


import { Card, SystemID } from "@/app/types/KanbanTypes";

export function AppendToTempCardsArray(
    newCard: Card,
    tempCardsArr: Card[],
    setTempCardsArr: any,
    ) {
    let _tmpCard: Card = newCard;
    let _tmpArray: Card[] = tempCardsArr;
    
    console.log("[INFO] @ BEGIN AppendToTempCardsArray tempCard value: ", _tmpCard);
    console.log("[INFO] @ BEGIN AppendToTempCardsArray tempCardArray value: ", _tmpArray);


    _tmpArray.push(_tmpCard);
    setTempCardsArr(_tmpArray);

    console.log("[INFO] @ END AppendToTempCardsArray tempCard value: ", _tmpCard);
    console.log("[INFO] @ END AppendToTempCardsArray tempCardArray value: ", _tmpArray);
}

export function PopFromTempCardsArray(tempCardsArr: Card[], setTempCardsArr: any): Card | undefined {
    let _tmpArray: Card[] = tempCardsArr;
    console.log("[INFO] @ BEGIN PopFromTempCardsArray tempCardArray value: ", _tmpArray);
    const retVal = _tmpArray.pop();
    setTempCardsArr(_tmpArray);
    console.log("[INFO] @ END PopFromTempCardsArray tempCardArray value: ", _tmpArray);
    return retVal;
}



export function removeCardById(targetId: SystemID, card: Card): Card {
    const _tmpCard: Card = card;
    _tmpCard.innerCards = card.innerCards.filter((innerCard: Card) => innerCard.id !== targetId);

    for (const innerCard of _tmpCard.innerCards) {
        removeCardById(targetId, innerCard);
    }

    return card;
};





























/*  [01] (CREATE) FIRST FUNCTION TO BE EXECUTED */
export function appendTempCardToArray (
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
): void {
    let _newTempArray: Card[] = tempCardsArray;
    let _tmpCard: Card = tempCard;
    
    console.log("[INFO] [01] (CREATE) @ BEGIN appendTempCardToArray tempCard value: ", _tmpCard);
    console.log("[INFO] [01] (CREATE) @ BEGIN appendTempCardToArray tempCardArray value: ", _newTempArray);

    _newTempArray.push(tempCard);
    let _newTempCard: Card = {
        title: "",
        id: "", // Assuming an appropriate default value for ID
        columnID: _tmpCard.columnID, // Assuming an appropriate default value for columnID
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

    console.log("[INFO] [01] (CREATE) @ END appendTempCardToArray tempCard value: ", _newTempCard);
    console.log("[INFO] [01] (CREATE) @ END appendTempCardToArray tempCardArray value: ", _newTempArray);
};

/*  [02] (CREATE) SECOND FUNCTION TO BE EXECUTED */
export function popAndAppendTempCard(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _newTempArray: Card[] = tempCardsArray;
    let lastCard = _newTempArray[_newTempArray.length - 1];

    console.log("[INFO] [02] (CREATE) @ BEGIN appendTempCardToArray tempCard value: ", tempCard);
    console.log("[INFO] [02] (CREATE) @ BEGIN appendTempCardToArray tempCardArray value: ", _newTempArray);
    console.log("[INFO] [02] (CREATE) @ BEGIN appendTempCardToArray lastCard value: ", lastCard);

    if (lastCard) {
        lastCard.innerCards.push(tempCard);
        let _mutatedTempArray: Card[] = _newTempArray.slice(0, -1);
        setTempCardsArray(_mutatedTempArray);
        setTempCard(lastCard);


        console.log("[INFO] [02] (CREATE) @ END appendTempCardToArray tempCard value: ", tempCard);
        console.log("[INFO] [02] (CREATE) @ END appendTempCardToArray tempCardArray value: ", _mutatedTempArray);
        console.log("[INFO] [02] (CREATE) @ END appendTempCardToArray lastCard value: ", lastCard);

        if (callback !== undefined) {
            callback(lastCard);
        }
    }


};


/*  [01] (EDIT) FIRST FUNCTION TO BE EXECUTED */
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


    console.log("[INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast tempCard value: ", _tmpCard);
    console.log("[INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast tempCardArray value: ", _cardsArray);
    console.log("[INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast poppedCard value: ", poppedCard);

    if (poppedCard) {
        _cardsArray.push(_tmpCard);
        setTempCardsArray(_cardsArray);
        setTempCard(poppedCard);
        callback(poppedCard);

        console.log("[INFO] [01] (EDIT) @ END swapTempCardWithLast tempCard value: ", _tmpCard);
        console.log("[INFO] [01] (EDIT) @ END swapTempCardWithLast tempCardArray value: ", _cardsArray);
        console.log("[INFO] [01] (EDIT) @ END swapTempCardWithLast poppedCard value: ", poppedCard);

    }
};

/*  [02] (EDIT) SECOND FUNCTION TO BE EXECUTED */
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

        console.log("[INFO] [02] (EDIT) @ BEGIN appendTempCardToPoppedInnerCards tempCard value: ", tempCard);
        console.log("[INFO] [02] (EDIT) @ BEGIN appendTempCardToPoppedInnerCards tempCardArray value: ", _tmpArray);
        console.log("[INFO] [02] (EDIT) @ BEGIN appendTempCardToPoppedInnerCards poppedCard value: ", poppedCard);
        console.log("[INFO] [02] (EDIT) @ BEGIN appendTempCardToPoppedInnerCards cardIndex value: ", cardIndex);

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

        console.log("[INFO] [02] (EDIT) @ END appendTempCardToPoppedInnerCards tempCard value: ", tempCard);
        console.log("[INFO] [02] (EDIT) @ END appendTempCardToPoppedInnerCards tempCardArray value: ", _tmpArray);
        console.log("[INFO] [02] (EDIT) @ END appendTempCardToPoppedInnerCards poppedCard value: ", poppedCard);
        console.log("[INFO] [02] (EDIT) @ END appendTempCardToPoppedInnerCards cardIndex value: ", cardIndex);


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

    console.log("[INFO] @ BEGIN appendTempCardToArray tempCard value: ", tempCard);
    console.log("[INFO] @ BEGIN appendTempCardToArray tempCardArray value: ", _newTempArray);
    console.log("[INFO] @ BEGIN appendTempCardToArray matchingCard value: ", matchingCard);

    if (matchingCard) {
        _newTempArray.push(tempCard);
        setTempCardsArray(_newTempArray);
        setTempCard(matchingCard);

        console.log("[INFO] @ END appendTempCardToArray tempCard value: ", tempCard);
        console.log("[INFO] @ END appendTempCardToArray tempCardArray value: ", _newTempArray);
        console.log("[INFO] @ END appendTempCardToArray matchingCard value: ", matchingCard);

    }
};


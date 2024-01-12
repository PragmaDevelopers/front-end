import { Card, SystemID } from "@/app/types/KanbanTypes";
import { generateRandomString } from "@/app/utils/generators";

export function AppendToTempCardsArray(
    newCard: Card,
    tempCardsArr: Card[],
    setTempCardsArr: any,
    ) {
    let _tmpCard: Card = {...newCard};
    let _tmpArray: Card[] = [...tempCardsArr];
    
    console.log("[INFO] BUG @ BEGIN AppendToTempCardsArray tempCard value: ", _tmpCard);
    console.log("[INFO] BUG @ BEGIN AppendToTempCardsArray tempCardArray value: ", _tmpArray);


    _tmpArray.push(_tmpCard);
    setTempCardsArr(_tmpArray);

    console.log("[INFO] BUG @ END AppendToTempCardsArray tempCard value: ", _tmpCard);
    console.log("[INFO] BUG @ END AppendToTempCardsArray tempCardArray value: ", _tmpArray);
}

export function PopFromTempCardsArray(tempCardsArr: Card[], setTempCardsArr: any): Card | undefined {
    let _tmpArray: Card[] = [...tempCardsArr];
    console.log("[INFO] @ BEGIN PopFromTempCardsArray tempCardArray value: ", _tmpArray);
    const retVal = _tmpArray.pop();
    setTempCardsArr(_tmpArray);
    console.log("[INFO] @ END PopFromTempCardsArray tempCardArray value: ", _tmpArray);
    return retVal;
}



export function removeCardById(targetId: SystemID, card: Card): Card {
    const _tmpCard: Card = {...card};
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
    let _newTempArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = {...tempCard};
    
    console.log("[INFO] #02 [01] (CREATE) @ BEGIN appendTempCardToArray tempCard value: ", _tmpCard);
    console.log("[INFO] #02 [01] (CREATE) @ BEGIN appendTempCardToArray tempCardArray value: ", _newTempArray);

    _newTempArray.push(tempCard);
    let _newTempCard: Card = {
        title: "",
        id: generateRandomString(), // Assuming an appropriate default value for ID
        columnID: _tmpCard.columnID, // Assuming an appropriate default value for columnID
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        deadline: {
            category: "",
            date: new Date(),
            id: "",
            overdue: false,
            toColumnId: ""
        },
        customFields: [],
        innerCards: [],
    }
    setTempCardsArray(_newTempArray);
    setTempCard(_newTempCard);

    console.log("[INFO] #02 [01] (CREATE) @ END appendTempCardToArray tempCard value: ", _newTempCard);
    console.log("[INFO] #02 [01] (CREATE) @ END appendTempCardToArray tempCardArray value: ", _newTempArray);
};

/*  [02] (CREATE) SECOND FUNCTION TO BE EXECUTED */
export function popAndAppendTempCard(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _newTempArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = {...tempCard};
    let lastCard = _newTempArray[_newTempArray.length - 1];

    console.log("APPENDING TO PREVIOUS CARD");
    console.log("[INFO] #04 [02] (CREATE) @ BEGIN popAndAppendTempCard tempCard value: ", _tmpCard);
    console.log("[INFO] #04 [02] (CREATE) @ BEGIN popAndAppendTempCard tempCardArray value: ", _newTempArray);
    console.log("[INFO] #04 [02] (CREATE) @ BEGIN popAndAppendTempCard lastCard value: ", lastCard);

    if (lastCard) {
        lastCard.innerCards.push(_tmpCard);
        let _mutatedTempArray: Card[] = _newTempArray.slice(0, -1);
        setTempCardsArray(_mutatedTempArray);
        setTempCard(lastCard);
        _tmpCard = {...lastCard};

        console.log("[INFO] #04 [02] (CREATE) @ END popAndAppendTempCard tempCard value: ", _tmpCard);
        console.log("[INFO] #04 [02] (CREATE) @ END popAndAppendTempCard tempCardArray value: ", _mutatedTempArray);
        console.log("[INFO] #04 [02] (CREATE) @ END popAndAppendTempCard lastCard value: ", lastCard);

        if (callback !== undefined) {
            callback(lastCard);
        }
    }


};


export function appendLastIntoTempInnerCards(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
) {
    let _cardsArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = { ...tempCard };
    const poppedCard = _cardsArray.pop(); // INNER CARD?
    
    console.log("=== TEST === tempCard", _tmpCard);
    console.log("=== TEST === poppedCard", poppedCard);

    if (poppedCard) {
        const updatedOuterCard = findAndReplaceInnerCard(_tmpCard, poppedCard);
        console.log("=== TEST === updatedOuterCard", updatedOuterCard);
        setTempCard(updatedOuterCard);
        setTempCardsArray(_cardsArray);
        if (callback) {
            callback(poppedCard);
        }


        console.log("=== TEST === updatedTempCardsArray", _cardsArray);
        _tmpCard = { ...updatedOuterCard };

    }


}


/*  [01] (EDIT) FIRST FUNCTION TO BE EXECUTED */
export function swapTempCardWithLast(
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
    callback?: any,
): void {
    let _cardsArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = { ...tempCard };
    const poppedCard = _cardsArray.pop();


    console.log("=== EDIT === [INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast tempCard value: ", _tmpCard);
    console.log("=== EDIT === [INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast tempCardArray value: ", _cardsArray);
    console.log("=== EDIT === [INFO] [01] (EDIT) @ BEGIN swapTempCardWithLast poppedCard value: ", poppedCard);

    if (poppedCard) {
        _cardsArray.push(_tmpCard);
        setTempCardsArray(_cardsArray);
        setTempCard(poppedCard);
        _tmpCard = poppedCard;

        if (callback) {
            callback(poppedCard);
        }

        console.log("=== EDIT === [INFO] [01] (EDIT) @ END swapTempCardWithLast tempCard value: ", _tmpCard);
        console.log("=== EDIT === [INFO] [01] (EDIT) @ END swapTempCardWithLast tempCardArray value: ", _cardsArray);
        console.log("=== EDIT === [INFO] [01] (EDIT) @ END swapTempCardWithLast poppedCard value: ", poppedCard);

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
    let _tmpArray = [...tempCardsArray];
    let _tmpCard: Card = { ...tempCard };


    const poppedCard = _tmpArray.pop();
    if (poppedCard) {
        const updatedOuterCard = findAndReplaceInnerCard(poppedCard, tempCard);

        

        setTempCard(updatedOuterCard);
        setTempCardsArray(_tmpArray);
        if (callback) {
            callback(poppedCard);
        }

        _tmpCard = { ...updatedOuterCard };

        console.log("=== EDIT === [INFO] BUG [02] (EDIT) @ END appendTempCardToPoppedInnerCards tempCard value: ", _tmpCard);
        console.log("=== EDIT === [INFO] BUG [02] (EDIT) @ END appendTempCardToPoppedInnerCards tempCardArray value: ", _tmpArray);
        console.log("=== EDIT === [INFO] BUG [02] (EDIT) @ END appendTempCardToPoppedInnerCards poppedCard value: ", poppedCard);


    }
};
























export function appendAndSetTempCard(
    card: Card,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>
): void {
    let _newTempArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = {...tempCard};
    let _card: Card = {...card};
    
    console.log("=== EDIT === [INFO] @ BEGIN appendAndSetTempCard tempCard value: ", _tmpCard);
    console.log("=== EDIT === [INFO] @ BEGIN appendAndSetTempCard tempCardsArray value: ", _newTempArray);
    console.log("=== EDIT === [INFO] @ SINGLE appendAndSetTempCard currentCard value: ", _card);
    

    _newTempArray.push(_tmpCard);
    setTempCard(_card);
    _tmpCard = _card;
    setTempCardsArray(_newTempArray);

    console.log("=== EDIT === [INFO] @ END appendAndSetTempCard tempCard value: ", _tmpCard);
    console.log("=== EDIT === [INFO] @ END appendAndSetTempCard tempCardsArray value: ", _newTempArray);
}




export function appendAndSetTempCardById(
    cardID: SystemID,
    tempCard: Card,
    tempCardsArray: Card[],
    setTempCard: React.Dispatch<React.SetStateAction<Card>>,
    setTempCardsArray: React.Dispatch<React.SetStateAction<Card[]>>,
): void {
    let _newTempArray: Card[] = [...tempCardsArray];
    let _tmpCard: Card = {...tempCard};
    const matchingCard = tempCard.innerCards.find(card => card.id === cardID);

    console.log("[INFO] @ BEGIN appendTempCardToArray tempCard value: ", _tmpCard);
    console.log("[INFO] @ BEGIN appendTempCardToArray tempCardArray value: ", _newTempArray);
    console.log("[INFO] @ BEGIN appendTempCardToArray matchingCard value: ", matchingCard);

    if (matchingCard) {
        _newTempArray.push(tempCard);
        setTempCardsArray(_newTempArray);
        setTempCard(matchingCard);
        _tmpCard = {...matchingCard};
        console.log("[INFO] @ END appendTempCardToArray tempCard value: ", _tmpCard);
        console.log("[INFO] @ END appendTempCardToArray tempCardArray value: ", _newTempArray);
        console.log("[INFO] @ END appendTempCardToArray matchingCard value: ", matchingCard);

    }
};


// Helper function to find and replace inner card in an outer card
export function findAndReplaceInnerCard(outerCard: Card, innerCard: Card): Card {
    let updatedOuterCard: Card = { ...outerCard };
    
    if (outerCard.innerCards && outerCard.innerCards.length > 0) {
      const index = outerCard.innerCards.findIndex((card) => card.id === innerCard.id);
  
      if (index !== -1) {
        updatedOuterCard.innerCards[index] = innerCard;
      } else {
        // Handle case where inner card is not found
        console.error("BUG Inner card not found in the outer card's innerCards array.");
      }
    } else {
      // Handle case where outer card has no inner cards
      console.error("BUG Outer card has no inner cards.");
    }
  
    return updatedOuterCard;
  }

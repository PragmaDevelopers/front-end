import { Card } from "@/app/types/KanbanTypes";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";

export function CreateInnerCard(
    event: any, 
    isEdittingInnerCard: boolean,
    AppendToTempCardsArray: (newCard: Card, tempCardsArr: Card[], setTempCardsArr: (arg0: Card[] | ((arg0: Card[]) => Card[])) => void) => void,
    PopFromTempCardsArray: (tempCardsArr: Card[], setTempCardsArr: (arg0: Card[] | ((arg0: Card[]) => Card[])) => void) => Card,
    tempCard: Card,
    tempCardsArr: Card[],
    editorRef: RefObject<MDXEditorMethods>,
    setEditorText: (arg0: string) => void,
    setTempCard: (arg0: Card) => void,
    setTempCardsArr: (arg0: ((arg0: Card[]) => Card[]) | Card[]) => void,
    setIsCreatingInnerCard: (arg0: boolean) => void,
    ) {
    if (!isEdittingInnerCard) {
        event.preventDefault();
        let localTempCard: Card = tempCard;
        let localTempCardsArray: Card[] = tempCardsArr;
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        // console.log("createInnerCard", "OLD CARD", cardTitle, cardDescription);
        console.log(localTempCard);
        const newCard: Card = {
            ...localTempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
        // console.log("createInnerCard", `APPENDING A CARD TO THE TEMPS CARD ARRAY`, tempCardsArr);
        localTempCardsArray.push(newCard);
        const tCard: Card = {
            id: "",                                         /////////////////////////////////////////////////////////////////////////////
            title: "",
            columnID: tempCard.columnID,
            description: "",
            checklists: [],
            tags: [],
            members: [],
            comments: [],
            dropdowns: [],
            date: 0,
            customFields: [],
            innerCards: [],
        }
        event.target.reset();
        setEditorText("");
        setTempCard(tCard);
        setTempCardsArr(localTempCardsArray);
        setIsCreatingInnerCard(false);
        editorRef.current?.setMarkdown("");
    } else {
        // const selectedInnerCard: Card = PopFromTempCardsArray();
        let localTempCard: Card = tempCard;
        let localTempCardsArray: Card[] = tempCardsArr;
        let selectedInnerCard: Card = tempCardsArr.pop() as unknown as Card;
        event.preventDefault();
        //Outer Card
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        // console.log("createInnerCard tempCard", tempCard);
        // console.log("createInnerCard", "OLD OUTER CARD", cardTitle, cardDescription);
        // console.log(tempCard, selectedInnerCard);
        const newCard: Card = { // OUTER CARD
            ...localTempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
        console.log("createInnerCard", `APPENDING OUTER CARD TO THE TEMPS CARD ARRAY`, localTempCardsArray, newCard);
        //AppendToTempCardsArray(newCard);
        localTempCardsArray.push(newCard);
        console.log("createInnerCard", `APPENDED OUTER CARD TO THE TEMPS CARD ARRAY`, localTempCardsArray);
        //const targetCard = newCard.innerCards.findIndex((card: Card) => card?.id === tempCard.id);
        event.target.reset();
        event.target.title.value = selectedInnerCard.title;
        setEditorText(selectedInnerCard.description);
        editorRef.current?.setMarkdown(selectedInnerCard.description);
        setTempCard(selectedInnerCard);
        setTempCardsArr(localTempCardsArray)
        //setIsCreatingInnerCard(false);
        //setIsEdittingInnerCard(false);
    }
}

export function AddInnerCard(
    event: any, 
    isEdittingInnerCard: boolean,
    AppendToTempCardsArray: (newCard: Card, tempCardsArr: Card[], setTempCardsArr: (arg0: Card[] | ((arg0: Card[]) => Card[])) => void) => void,
    PopFromTempCardsArray: (tempCardsArr: Card[], setTempCardsArr: (arg0: Card[] | ((arg0: Card[]) => Card[])) => void) => Card,
    tempCard: Card,
    tempCardsArr: Card[],
    editorRef: RefObject<MDXEditorMethods>,
    setEditorText: (arg0: string) => void,
    setTempCard: (arg0: Card) => void,
    setTempCardsArr: (arg0: ((arg0: Card[]) => Card[]) | Card[]) => void,
    ) {
    if (!isEdittingInnerCard) {
        event.preventDefault();
        let localTempCard: Card = tempCard;
        let localTempCardsArray: Card[] = tempCardsArr;
        // console.log("isEdittingInnerCard: FALSE", isEdittingInnerCard);
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        // console.log("addInnerCard", cardTitle, cardDescription);
        const newCard: Card = {
            ...localTempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
        // console.log("addInnerCard tempCardsArr", tempCardsArr)
        //const _prevCard: Card = PopFromTempCardsArray();
        let _prevCard: Card = localTempCardsArray.pop() as unknown as Card;
        // console.log("addInnerCard _prevCard", _prevCard)
        // console.log("addInnerCard", "PREVIOUS CARD", _prevCard)
        const _nInnerCardsArr: Card[] = [..._prevCard.innerCards, newCard];
        const ntCard: Card = {
            ..._prevCard,
            innerCards: _nInnerCardsArr,
        }
        event.target.reset();
        setEditorText(ntCard.description);
        setTempCard(ntCard);
        setTempCardsArr(localTempCardsArray);
        // console.log("addInnerCard", "NEW TEMPCARD", ntCard);
        editorRef.current?.setMarkdown(ntCard.description);
    } else {
        event.preventDefault();
        let localTempCard: Card = tempCard;
        let localTempCardsArray: Card[] = tempCardsArr;
        console.log("====================================", localTempCardsArray);
        // console.log("isEdittingInnerCard: TRUE", isEdittingInnerCard);
        // Inner Card
        console.log("addInnerCard INNER_tempCard", localTempCard);
        console.log("AAAAAAAAAAAAAAAAA", localTempCardsArray); // tempCardsArr is empty for some reason.
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        const newCard: Card = { // EDITED INNER CARD
            ...localTempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
        //const _prevOuterCard: Card = PopFromTempCardsArray();
        let _prevOuterCard: Card = localTempCardsArray.pop() as unknown as Card;
        console.log("addInnerCard _prevOuterCard", _prevOuterCard)
        const updatedInnerCardsList = _prevOuterCard?.innerCards?.map((card: Card) => card?.id === newCard?.id ? newCard : card)
        console.log("updatedInnerCardsList", updatedInnerCardsList)
        const ntCard: Card = { // Previous Outer Card
            ..._prevOuterCard,
            innerCards: updatedInnerCardsList,
        }
        console.log("ntCard", ntCard);
        setEditorText(ntCard.description);
        event.target.title.value = ntCard.title;
        editorRef.current?.setMarkdown(ntCard.description);
        setTempCard(ntCard);
        setTempCardsArr(localTempCardsArray);
        console.log("addInnerCard", "NEW TEMPCARD", ntCard);
        event.target.reset();
    }
}
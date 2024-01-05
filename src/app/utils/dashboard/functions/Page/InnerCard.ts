import { Card } from "@/app/types/KanbanTypes";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";
import { appendTempCardToArray, appendTempCardToPoppedInnerCards, popAndAppendTempCard, swapTempCardWithLast } from "./InnerCardUtils";

export function CreateInnerCard( /* This function is called on the create button */
        event: any, 
        isEdittingInnerCard: boolean,
        editorRef: RefObject<MDXEditorMethods>,
        tempCard: Card,
        setEditorText: any,
        setIsCreatingInnerCard: any,
        tempCardsArray: any,
        setTempCardsArray: any,
        setTempCard: any,
    ) {
    event.preventDefault();
    let _tempCard: Card = tempCard;
    let _tmpCardArray: Card[] = tempCardsArray;
    const cardTitle: string = event.target.title.value;
    const cardDescription: string | undefined = editorRef.current?.getMarkdown();
    let newCard: Card = {
        ..._tempCard,
        title: cardTitle,
        description: cardDescription as unknown as string,
    }


    console.log("[INFO] #01 @ BEGIN CreateInnerCard tempCard value: ", newCard);
    console.log("[INFO] #01 @ BEGIN CreateInnerCard tempCardsArray value: ", _tmpCardArray);

    if (isEdittingInnerCard) {
        const callbackFunction = (card: Card) => {
            event.target.title.value = card.title;
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }
        event.target.reset();
        swapTempCardWithLast(newCard, _tmpCardArray, setTempCard, setTempCardsArray, callbackFunction);
    } else {
        appendTempCardToArray(newCard, _tmpCardArray, setTempCard, setTempCardsArray);
        event.target.reset();
        setEditorText("");
        setIsCreatingInnerCard(false);
        editorRef.current?.setMarkdown("");
    }

    newCard = tempCard;

    console.log("[INFO] #01 @ END CreateInnerCard tempCard value: ", newCard);
    console.log("[INFO] #01 @ END CreateInnerCard tempCardsArray value: ", _tmpCardArray);
}

export function AddInnerCard( /*  This function is called on the form submit */
        event: any, 
        isEdittingInnerCard: boolean,
        editorRef: RefObject<MDXEditorMethods>,
        tempCard: Card,
        setEditorText: any,
        tempCardsArray: any,
        setTempCardsArray: any,
        setTempCard: any,
    ) {
    event.preventDefault();
    let _tempCard: Card = tempCard;
    let _tmpCardArray: Card[] = tempCardsArray;
    const cardTitle: string = event.target.title.value;
    const cardDescription: string | undefined = editorRef.current?.getMarkdown();
    let newCard: Card = {
        ..._tempCard,
        title: cardTitle,
        description: cardDescription as unknown as string,
    }

    console.log("[INFO] #03 @ BEGIN AddInnerCard tempCard value: ", newCard);
    console.log("[INFO] #03 @ BEGIN AddInnerCard tempCardsArray value: ", _tmpCardArray);

    if (isEdittingInnerCard) {
        const callbackFunction = (card: Card) => {
            event.target.title.value = card.title;
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }
        event.target.reset();
        appendTempCardToPoppedInnerCards(newCard, _tmpCardArray, setTempCard, setTempCardsArray, callbackFunction);
    } else {
        const callbackFunction = (card: Card) => {
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }

        event.target.reset();
        popAndAppendTempCard(newCard, _tmpCardArray, setTempCard, setTempCardsArray, callbackFunction);
    }

    newCard = tempCard;

    console.log("[INFO] #03 @ END AddInnerCard tempCard value: ", newCard);
    console.log("[INFO] #03 @ END AddInnerCard tempCardsArray value: ", _tmpCardArray);

}

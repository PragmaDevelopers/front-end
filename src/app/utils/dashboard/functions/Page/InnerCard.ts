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
    const cardTitle: string = event.target.title.value;
    const cardDescription: string | undefined = editorRef.current?.getMarkdown();
    const newCard: Card = {
        ..._tempCard,
        title: cardTitle,
        description: cardDescription as unknown as string,
    }

    if (isEdittingInnerCard) {
        const callbackFunction = (card: Card) => {
            event.target.title.value = card.title;
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }
        event.target.reset();
        swapTempCardWithLast(newCard, tempCardsArray, setTempCard, setTempCardsArray, callbackFunction);
    } else {
        appendTempCardToArray(newCard, tempCardsArray, setTempCard, setTempCardsArray);
        event.target.reset();
        setEditorText("");
        setIsCreatingInnerCard(false);
        editorRef.current?.setMarkdown("");
    }
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
    const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        const newCard: Card = {
            ..._tempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }

    if (isEdittingInnerCard) {
        const callbackFunction = (card: Card) => {
            event.target.title.value = card.title;
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }
        event.target.reset();
        appendTempCardToPoppedInnerCards(_tempCard, tempCardsArray, setTempCard, setTempCardsArray, callbackFunction);
    } else {
        const callbackFunction = (card: Card) => {
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }

        event.target.reset();
        popAndAppendTempCard(newCard, tempCardsArray, setTempCard, setTempCardsArray, callbackFunction);
    }
}

import { Card } from "@/app/types/KanbanTypes";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";
import { appendTempCardToArray, popAndAppendTempCard } from "./InnerCardUtils";

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
    let _tempCard: Card = tempCard;
    event.preventDefault();

    if (isEdittingInnerCard) {
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        const newCard: Card = {
            ..._tempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }

    } else {
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        const newCard: Card = {
            ..._tempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
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
    let _tempCard: Card = tempCard;
    event.preventDefault();

    if (isEdittingInnerCard) {
    } else {
        const cardTitle: string = event.target.title.value;
        const cardDescription: string | undefined = editorRef.current?.getMarkdown();
        const newCard: Card = {
            ..._tempCard,
            title: cardTitle,
            description: cardDescription as unknown as string,
        }
        const callbackFunction = (card: Card) => {
            setEditorText(card.description);
            editorRef.current?.setMarkdown(card.description);
        }

        popAndAppendTempCard(newCard, tempCardsArray, setTempCard, setTempCardsArray, callbackFunction);
    }
}

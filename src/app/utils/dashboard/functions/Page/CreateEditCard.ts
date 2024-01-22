import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Comment, SystemID, userValueDT } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { get_card_by_id, post_checklist, post_checklistItem, post_comment, post_comment_answer, post_customField, post_deadline, post_inner_card, post_tag } from "@/app/utils/fetchs";
import { RefObject } from "react";

export async function ShowCreateDeadline(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_PRAZOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateDeadline:true});
}

export async function CreateDeadline(
    userValue: userValueDT,
    date: string,
    setTempCard: (newValue:Card)=>void,
    tempCard: Card,
    setCardManager: (newValue:CardManager)=>void,
    cardManager: CardManager,
    setDateExists: (newValue:boolean)=>void,
){

    setTempCard({...tempCard,deadline:{
        id: "|",
        category: "",
        date: date,
        overdue: false,
        toColumnId: "",
        toKanbanId: ""
    }});

    setDateExists(true);
    setCardManager({...cardManager,isShowCreateDeadline:false})

    post_deadline({cardId:tempCard.id,date:date},userValue.token,(response)=>response.json().then((deadlineId)=>{
        if(response.ok){
            console.log("CREATE DEADLINE SUCCESS");
            setTempCard({...tempCard,deadline:{...tempCard.deadline,id:deadlineId}});
        }
    }));
}

export function ConfirmDeleteDeadline(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_PRAZOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Prazo");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateCustomField(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userData.profileData, "CRIAR_CAMPO")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateCustomField:true});     
};

export function createCustomField(
    userValue: userValueDT,
    fieldType: "text" | "number",
    name: string,
    setTempCard: (newValue:Card)=>void,
    tempCard: Card
){
    const provCustomFieldId = "|"+tempCard.customFields.length;
    const customFields = tempCard.customFields;
    customFields.push({
        id: provCustomFieldId,
        fieldType: fieldType,
        value: "",
        name: name
    });
    setTempCard({...tempCard,customFields:customFields});

    post_customField({
        cardId: tempCard.id,
        fieldType: fieldType,
        value: "",
        name: name
    },userValue.token,(response)=>response.json().then((customFieldId)=>{
        if(response.ok){
            const newCustomFields  = customFields.map(customField=>{
                if(customField.id == provCustomFieldId){
                    customField.id = customFieldId;
                }
                return customField;
            });
            setTempCard({...tempCard,customFields:newCustomFields});
        }
    }));
}

export function ConfirmDeleteCustomField(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CAMPO")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Campo");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateTag(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
): void {
    if (!isFlagSet(userData.profileData, "CRIAR_TAG")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateTag:true});
};

export function CreateTag(
    userValue: userValueDT,
    name: string,
    color: string,
    setTempCard: (newValue:Card)=>void,
    tempCard: Card
){
    const provTagId = tempCard.tags.length;
    const tags = tempCard.tags;
    tags.push({
        id: provTagId,
        name: name,
        color: color
    });
    setTempCard({...tempCard,tags:tags});

    post_tag({cardId:tempCard.id,color:color,name:name},userValue.token,(response)=>response.json().then((tagId)=>{
        if(response.ok){
            console.log("CREATE TAG SUCCESS");
            const newTags = tags.map(tag=>{
                if(tag.id == provTagId){
                    tag.id = tagId;
                }
                return tag;
            });
            setTempCard({...tempCard,tags:newTags});
        }
    }));
}

export function ConfirmDeleteTag(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_TAG")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Etiqueta");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export async function CreateChecklist(
    userValue: userValueDT,
    setTempCard: (newValue: Card) => void,
    tempCard: Card,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_CHECKLISTS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const provChecklistId = "|"+tempCard.checklists.length;
    const checklists = tempCard.checklists;
    checklists.push({
        id: provChecklistId,
        items: [],
        name: ""
    });
    setTempCard({...tempCard,checklists:checklists});
    post_checklist({cardId:tempCard.id,name:""},userValue.token,(response)=>response.json().then((checklistId)=>{
        if(response.ok){
            console.log("CREATE CHECKLIST SUCCESS");
            const newChecklist = checklists.map(checklist=>{
                if(checklist.id == provChecklistId){
                    checklist.id = checklistId;
                }
                return checklist;
            });
            setTempCard({...tempCard,checklists:newChecklist});
        }
    }));
}

export function ConfirmDeleteChecklist(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CHECKLISTS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Lista");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export async function CreateChecklistItem(
    userValue: userValueDT,
    setTempCard: (newValue: Card) => void,
    tempCard: Card,
    checklistIndex: number,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_CHECKLISTITEMS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const checklists = tempCard.checklists;
    const provItemId = "|"+checklists[checklistIndex].items.length;
    checklists[checklistIndex].items.push({
        id: provItemId,
        completed: false,
        name: "",
        checklistId: ""
    });
    setTempCard({...tempCard,checklists:checklists});

    post_checklistItem({checklistId:checklists[checklistIndex].id,name:""},userValue.token,(response)=>response.json().then((itemId)=>{
        if(response.ok){
            console.log("CREATE CHECKLIST ITEM SUCCESS");
            checklists[checklistIndex].items = checklists[checklistIndex].items.map((item)=>{
                if(item.id == provItemId){
                    item.id = itemId;
                }
                return item;
            });
            setTempCard({...tempCard,checklists:checklists});
        }
    }));
}

export function ConfirmDeleteChecklistItem(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_CHECKLISTITEMS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Tarefa");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ShowCreateAnsweredComment(
    userData: userValueDT,
    setCardManager: (newValue: CardManager) => void,
    cardManager: CardManager, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "CRIAR_COMENTÁRIOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    setCardManager({...cardManager,isShowCreateAnsweredComment:true});
}

export function CreateComment(
    userValue: userValueDT,
    content: string,
    setContent: (newValue: string) => void,
    setTempCard: (newValue: Card) => void,
    tempCard: Card, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_COMENTÁRIOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const provCommentId  = "|"+tempCard.comments.length;
    const comments = tempCard.comments;
    comments.push({
        content: content,
        edited: false,
        id: provCommentId,
        registrationDate: new Date().toDateString(),
        user: userValue.profileData,
        answers: []
    });
    setTempCard({...tempCard,comments:comments});
    setContent("");

    const bodyComment = {
        cardId: tempCard.id,
        content: content
    }

    post_comment(bodyComment,userValue.token,(response)=>response.json().then((commentId)=>{
        if(response.ok){
            console.log("CREATE COMMENT SUCCESS");
            const newComments = tempCard.comments.map((comment)=>{
                if(comment.id == provCommentId){
                    comment.id = commentId;
                }
                return comment;
            });
            setTempCard({...tempCard,comments:newComments})
        }
    }))
}

export function CreateCommentAnswer(
    userValue: userValueDT,
    content: string,
    parentCommentId: SystemID,
    setTempCard: (newValue: Card) => void,
    tempCard: Card, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_COMENTÁRIOS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const provCommentId  = "|"+parentCommentId+"|"+tempCard.comments.length
    const newCommentAnswer = {
        content: content,
        edited: false,
        id: provCommentId,
        registrationDate: new Date().toDateString(),
        user: userValue.profileData,
        answers: []
    };
    const newComments = addCommentToAnswersWithoutId(tempCard.comments,parentCommentId,newCommentAnswer);
    setTempCard({...tempCard,comments:newComments});

    const bodyComment = {
        commentId: parentCommentId,
        content: content
    }

    post_comment_answer(bodyComment,userValue.token,(response)=>response.json().then((commentId)=>{
        if(response.ok){
            console.log("CREATE COMMENT ANSWER SUCCESS");
            const newCommentsWithId = addCommentToAnswersWithId(newComments,provCommentId,commentId);
            setTempCard({...tempCard,comments:newCommentsWithId})
        }
    }))
}

function addCommentToAnswersWithoutId(comments: Comment[], parentId: SystemID, newComment: Comment): Comment[] {
    return comments.map(comment => {
        if (comment.id == parentId) {
            // Se encontrarmos o comentário com o ID correspondente, adicionamos o novo comentário às respostas
            return {
                ...comment,
                answers: comment.answers ? [...comment.answers, newComment] : [newComment],
            };
        } else if (comment.answers && comment.answers.length > 0) {
            // Se o comentário tiver respostas, chamamos recursivamente a função para processar as respostas
            return {
                ...comment,
                answers: addCommentToAnswersWithoutId(comment.answers, parentId, newComment)
            };
        } else {
            return comment;
        }
    });
}

function addCommentToAnswersWithId(comments: Comment[], provCommentId: SystemID, newCommentId: SystemID): Comment[] {
    return comments.map(comment => {
        if (comment.id == provCommentId) {
            // Se encontrarmos o comentário com o ID correspondente, adicionamos o novo comentário às respostas
            return {
                ...comment,
                id: newCommentId
            };
        } else if (comment.answers && comment.answers.length > 0) {
            // Se o comentário tiver respostas, chamamos recursivamente a função para processar as respostas
            return {
                ...comment,
                answers: addCommentToAnswersWithId(comment.answers, provCommentId, newCommentId)
            };
        } else {
            return comment;
        }
    });
}

export function ConfirmDeleteOtherComment(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_COMENTÁRIOS_EXTERNOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Comentário");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function ConfirmDeleteYourComment(
    userValue: userValueDT, 
    cardManager: CardManager,
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if(cardManager.isEditElseCreate){
        if (!isFlagSet(userValue.profileData, "DELETAR_COMENTÁRIOS_PRÓPRIOS")) {
            //NÃO TEM AUTORIZAÇÃO
            modalContextProps.setModalTitle("Ação Negada.");
            modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
            modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
            modalContextProps.setModalBorderColor("border-red-500");
            modalContextProps.setModalFocusRef(noButtonRef);
            modalContextProps.setModalOptions(failModalOptions);
            modalContextProps.setModalOpen(true);
            return
        }
    }
    modalContextProps.setModalTitle("Deletar Comentário");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
}

export function CreateInnerCard(
    userValue: userValueDT,
    setTempCard: (newValue: Card) => void,
    tempCard: Card, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "CRIAR_CARDS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    const provInnerCardId = "|"+tempCard.innerCards.length;
    const innerCards = tempCard.innerCards;
    innerCards.push({
        id: provInnerCardId,
        cardParentId: tempCard.id,
        columnID: tempCard.columnID,
        kanbanID: tempCard.kanbanID,
        title: "Inner Card "+tempCard.innerCards.length,
        index: tempCard.innerCards.length,
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        deadline: {
            id: "",
            category: "",
            date: null,
            overdue: false,
            toColumnId: "",
            toKanbanId: ""
        },
        customFields: [],
        innerCards: []
    });
    setTempCard({...tempCard,innerCards:innerCards});

    const bodyInnerCard = {
        cardId: tempCard.id,
        title: "Inner Card "+tempCard.innerCards.length
    }
    post_inner_card(bodyInnerCard,userValue.token,(response)=>response.json().then((innerCardId)=>{
        if(response.ok){
            console.log("CREATE INNER CARD SUCCESS");
            const newInnerCards = tempCard.innerCards.map(innerCard=>{
                if(innerCard.id == provInnerCardId){
                    innerCard.id = innerCardId;
                }
                return innerCard;
            })
            setTempCard({...tempCard,innerCards:newInnerCards});
        }
    }));
}

export function EditInnerCard(
    userValue: userValueDT,
    card: Card,
    setTempCard: (newValue: Card) => void,
    setPreviousCard: (newValue: Card) => void,
    tempCard: Card, 
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userValue.profileData, "EDITAR_CARDS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }

    setPreviousCard(tempCard);

    const cardParentId = tempCard.id;

    setTempCard({
        id: "",
        cardParentId: "",
        columnID: "",
        kanbanID: "",
        title: "",
        index: 0,
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        deadline: {
            id: "",
            category: "",
            date: null,
            overdue: false,
            toColumnId: "",
            toKanbanId: ""
        },
        customFields: [],
        innerCards: []
    });

    get_card_by_id(undefined,card.id,userValue.token,(response)=>response.json().then((dbCard:Card)=>{
        if(response.ok){
            setTempCard({...dbCard,cardParentId:cardParentId});
        }
    }));
}
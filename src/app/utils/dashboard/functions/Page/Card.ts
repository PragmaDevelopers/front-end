import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue, Column, Comment } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_card, get_card_by_id, patch_card, patch_checklist, patch_checklistItem, patch_customField, patch_deadline, post_card, post_checklist, post_checklistItem, post_comment, post_comment_answer, post_customField, post_deadline, post_tag } from "@/app/utils/fetchs";
import { RefObject } from "react";

function updateCardId(kanban:Kanban,columnId:SystemID,cardId:SystemID,type?:string,value?:any,valueIndex?:number,checklistId?:SystemID){
    const newColumns = kanban.columns.map((column)=>{
        if(column.id == columnId){
            const newCards = column.cards.map(card=>{
                if(card.id == cardId){
                    switch(type){
                        case "cardId":
                            card.id = value;
                            break;
                        case "card":
                            card = {...card,...value};
                            break;
                    }
                    return card;
                }else{
                    return card;
                }
            });
            column.cards = newCards;
            return column;
        }else{
            return column;
        }
    });
    kanban.columns = newColumns;
    return kanban;
}

function addCardInColumn(kanban:Kanban,columnId:SystemID,newCard:Card){
    const newColumns = kanban.columns.map((column)=>{
        if(column.id == columnId){
            newCard.index = column.cards.length;
            column.cards.push(newCard);
            return column;
        }else{
            return column;
        }
    });
    kanban.columns = newColumns;
    return kanban;
}

function handleDeadline(tempCard:Card,userValue:userValueDT,cardId:SystemID){
    if(tempCard.deadline?.id == ""){
        const bodyDeadline:{
            cardId: SystemID,
            date: string,
            category?: string,
            toColumnId?: SystemID
        } = {
            cardId: cardId,
            date: tempCard.deadline.date || ""
        }
        if(tempCard.deadline.category != "" && tempCard.deadline.toColumnId != ""){
            bodyDeadline.category = tempCard.deadline.category;
            bodyDeadline.toColumnId = tempCard.deadline.toColumnId;
        }
        console.log(bodyDeadline)
        post_deadline(bodyDeadline,userValue.token,(response)=>response.json().then(()=>{
            if(response.ok){
                console.log("CREATE DEADLINE SUCESSS");
            }
        }));
    }
}

function handleCustomField(tempCard:Card,userValue:userValueDT,cardId:SystemID){
    tempCard.customFields.map((customField)=>{
        if(customField.id == ""){
            const bodyCustomField = {
                cardId: cardId,
                name: customField.name,
                fieldType: customField.fieldType,
                value: customField.value
            }
            post_customField(bodyCustomField,userValue.token,(response)=>response.json().then(()=>{
                if(response.ok){
                    console.log("CREATE CUSTOMFIELD SUCESSS");
                }
            }));
        }else{
            patch_customField({value:customField.value},customField.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("UPDATE CUSTOMFIELD SUCCESS");
                }
            }));
        }
    });
}

function handleTag(tempCard:Card,userValue:userValueDT,cardId:SystemID){
    tempCard.tags.map((tag)=>{
        if(tag.id == ""){
            const bodyTag = {
                cardId: cardId,
                name: tag.name,
                color: tag.color
            }
            post_tag(bodyTag,userValue.token,(response)=>response.json().then((tagId)=>{
                if(response.ok){
                    console.log("CREATE TAG SUCESSS");
                }
            }));
        }
    });
}

function handleChecklist(tempCard:Card,userValue:userValueDT,cardId:SystemID){
    tempCard.checklists.map((checklist)=>{
        if(checklist.id == ""){ //CREATE CHECKLIST
            post_checklist({name:checklist.name,cardId:cardId},userValue.token,(checklistResponse)=>checklistResponse.json().then((checklistId)=>{
                if(checklistResponse.ok){
                    console.log("CREATE CHECKLIST SUCESSS");

                    const items = checklist.items;
                    if(items?.length > 0){
                        items.map((item)=>{
                            post_checklistItem({name:item.name,checklistId:checklistId},userValue.token,(itemResponse)=>itemResponse.json().then((itemId)=>{
                                if(itemResponse.ok){
                                    console.log("CREATE CHECKLIST ITEM SUCCESS");
                                }
                            }));
                        });
                    }
                }
            }));
        }else{ //PATCH CHECKLIST
            patch_checklist({name:checklist.name},checklist.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("UPDATE CHECKLIST SUCCESS");
                }
            }));
            const items = checklist.items;
            if(items?.length > 0){
                items.map((item)=>{
                    if(item.id == ""){
                        post_checklistItem({name:item.name,checklistId:checklist.id},userValue.token,(itemResponse)=>itemResponse.json().then(()=>{
                            if(itemResponse.ok){
                                console.log("CREATE CHECKLIST ITEM SUCCESS");
                            }
                        }));
                    }else{
                        patch_checklistItem({name:item.name,completed:item.completed},item.id,userValue.token,(response)=>response.text().then(()=>{
                            if(response.ok){
                                console.log("UPDATE CHECKLIST ITEM SUCCESS");
                            }
                        }));
                    }
                });
            }
        }
    });
}

function handleComment(tempCard:Card,userValue:userValueDT,cardId:SystemID){
    tempCard.comments.map((comment)=>{
        if(comment.id.toString().includes("|")){
            const bodyComment = {
                cardId: cardId,
                content: comment.content
            }
            post_comment(bodyComment,userValue.token,(response)=>response.json().then(()=>{
                if(response.ok){
                    console.log("CREATE COMMENT SUCCESS");
                }
            }));
        }else{
            if(comment.answers && comment.answers.length > 0){
                handleCommentAnswers(comment.answers,userValue,comment.id);
            }
        }
    });
}

function handleCommentAnswers(
    commentAnswers:Comment[],
    userValue:userValueDT,
    parentCommentId: SystemID
){
    commentAnswers.map(comment=>{
        if(comment.id.toString().includes("|")){
            const bodyCommentAnsewer = {
                commentId: parentCommentId,
                content: comment.content
            }
            post_comment_answer(bodyCommentAnsewer,userValue.token,(response)=>response.json().then((commentAnswerId)=>{
                if(response.ok){
                    console.log("CREATE COMMENT ANSWER SUCCESS");
                    if(comment.answers && comment.answers.length > 0){
                        handleCommentAnswers(comment.answers,userValue,commentAnswerId);
                    }
                }
            }));
        }else{
            if(comment.answers && comment.answers.length > 0){
                handleCommentAnswers(comment.answers,userValue,comment.id);
            }
        }
    });
}

export function ShowCreateCard(
        userData: userValueDT,
        kanbanId: SystemID,
        columnId: SystemID,
        setCardManager: (newValue: CardManager) => void,
        setTempCard: (newValue: Card) => void,
        cardManager: CardManager,
        failModalOptions: any,
        noButtonRef: RefObject<HTMLButtonElement>,
        modalContextProps: ModalContextProps
    ) {
    if (!isFlagSet(userData.profileData, "CRIAR_CARDS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }
    
    setTempCard({
        id: "",
        columnID: columnId,
        kanbanID: kanbanId,
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
    })

    setCardManager({...cardManager,isEditElseCreate:false,isShowCreateCard:true})

    console.log("CREATING CARD");
};

export function CreateCard(
    userValue: userValueDT,
    setTempKanban: (newValue:Kanban)=>void,
    setCardManager: (newValue:CardManager)=>void,
    tempColumn: Column,
    tempCard: Card,
    tempKanban: Kanban,
    cardManager: CardManager
    ) {
        const columnId = tempCard.columnID; // COLUMNID É OBRIGATÓRIO
        const title = tempCard.title; // TITLE É OBRIGATÓRIO
        const description = tempCard.description;
        const members = tempCard.members.map(member=>member.id);

        const provCardId = "|"+tempColumn.cards.length;
        tempCard.id = provCardId;
        const newKanban = addCardInColumn(tempKanban,columnId,tempCard);
        setTempKanban({...newKanban});

        setCardManager({...cardManager,isShowCreateCard:false})

        post_card({columnId,title,description,members},userValue.token,(response)=>response.json().then((cardId)=>{
            if(response.ok){
                console.log("CREATE CARD SUCESSS");

                const date = tempCard.deadline.date;
                console.log(tempCard.deadline)
                if(date != null && date != undefined && date != ""){
                    handleDeadline(tempCard,userValue,cardId);
                }

                const customFields = tempCard.customFields;
                if(customFields.length > 0){
                    handleCustomField(tempCard,userValue,cardId);
                }

                const tags = tempCard.tags;
                if(tags.length > 0){
                    handleTag(tempCard,userValue,cardId);
                }

                const checklists = tempCard.checklists;
                if(checklists.length > 0){
                    handleChecklist(tempCard,userValue,cardId);
                }

                const comments = tempCard.comments;
                if(comments.length > 0){
                    handleComment(tempCard,userValue,cardId);
                }

                const newKanbanWithCardId = updateCardId(tempKanban,columnId,provCardId,"cardId",cardId);
                setTempKanban({...newKanbanWithCardId});
            }
        }));
};

export function ConfirmDeleteCard(
    userValue: userValueDT, 
    trueModalOptions:any,
    failModalOptions:any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
) {
    if (!isFlagSet(userValue.profileData, "DELETAR_CARDS")) {
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
    modalContextProps.setModalTitle("Deletar Card");
    modalContextProps.setModalDescription("Esta ação é irreversivel.");
    modalContextProps.setModalText("Tem certeza que deseja continuar?");
    modalContextProps.setModalBorderColor("border-red-500");
    modalContextProps.setModalFocusRef(noButtonRef);
    modalContextProps.setModalOptions(trueModalOptions);
    modalContextProps.setModalOpen(true);
};

export function DeleteCard(
    cardID: SystemID, 
    columnID: SystemID,
    userValue: userValueDT,
    setTempKanban: (prevState: Kanban) => void,
    tempKanban: Kanban,
) {
    const columnIndex = tempKanban.columns.findIndex(column=>column.id==columnID);
    const cards = tempKanban.columns[columnIndex]?.cards;
    if(cards){
        const filteredCards = cards.filter(card=>card.id!=cardID);
        tempKanban.columns[columnIndex].cards = filteredCards;
        setTempKanban(tempKanban);
        delete_card(undefined,cardID,userValue.token,(response)=>{
            if(response.ok){
                console.log("DELETE CARD SUCCESS");
            }
        });
    }
}

export function ShowEditCard(
    userValue: userValueDT,
    card: Card,
    setCardManager: (newValue: CardManager) => void,
    setTempCard: (newValue: Card) => void,
    cardManager: CardManager,
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

    setTempCard({
        id: "",
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
    })

    get_card_by_id(undefined,card.id,userValue.token,(response)=>response.json().then((card:Card)=>{
        setTempCard({...card});
    }));

    setCardManager({...cardManager,isEditElseCreate:true,isShowCreateCard:true})
    console.log("EDITING CARD");
}

export function EditCard(
    userValue: userValueDT,
    setTempKanban: (newValue:Kanban)=>void,
    setCardManager: (newValue:CardManager)=>void,
    tempColumn: Column,
    tempCard: Card,
    tempKanban: Kanban,
    cardManager: CardManager
){
    const cardId = tempCard.id;
    const title = tempCard.title;
    const description = tempCard.description;
    const members = tempCard.members?.map(member=>member.id) || [];

    const newKanbanWithNewCard = updateCardId(tempKanban,tempCard.columnID,cardId,"card",{id:"|"+cardId,title,description,members});
    setTempKanban(newKanbanWithNewCard);

    setCardManager({...cardManager,isShowCreateCard:false})

    const date = tempCard.deadline?.date;
    if(date != null && date != undefined && date != ""){
        handleDeadline(tempCard,userValue,cardId);
    }

    const customFields = tempCard.customFields;
    if(customFields.length > 0){
        handleCustomField(tempCard,userValue,cardId);
    }
    
    const tags = tempCard.tags;
    if(tags.length > 0){
        handleTag(tempCard,userValue,cardId);
    }

    const checklists = tempCard.checklists;
    if(checklists.length > 0){
        handleChecklist(tempCard,userValue,cardId);
    }

    const comments = tempCard.comments;
    if(comments.length > 0){
        handleComment(tempCard,userValue,cardId);
    }

    patch_card({title,description,members},cardId,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("PATCH CARD SUCCESS");
            const newKanbanWithNewCard = updateCardId(tempKanban,tempCard.columnID,"|"+cardId,"card",{id:cardId,title,description,members});
            setTempKanban({...newKanbanWithNewCard});
        }
    }));
}
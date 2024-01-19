import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue, Column, Comment } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_card, get_card_by_id, patch_card, patch_deadline, post_card, post_checklist, post_checklistItem, post_comment, post_customField, post_deadline, post_tag } from "@/app/utils/fetchs";
import { generateRandomString } from "@/app/utils/generators";
import { API_BASE_URL } from "@/app/utils/variables";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";
import { custom } from "zod";

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
                        case "deadline":
                            card.deadline = value;
                            break;
                        case "customField":
                            if(valueIndex != undefined){
                                card.customFields[valueIndex] = value; 
                            }
                            break;
                        case "tag":
                            if(valueIndex != undefined){
                                card.tags[valueIndex] = value; 
                            }
                            break;
                        case "checklist":
                            if(valueIndex != undefined){
                                card.checklists[valueIndex] = value; 
                            }
                            break;
                        case "checklistItem":
                            card.checklists.map(checklist=>{
                                if(checklist.id == checklistId && valueIndex){
                                    checklist.items[valueIndex] = value;
                                }
                                return checklist;
                            });
                            break;
                        case "comment":
                            if(valueIndex != undefined){
                                card.comments[valueIndex] = value; 
                            }
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

function processComments(comments:Comment[],
    userValue:userValueDT,
    tempKanban:Kanban,
    tempCard:Card,
    columnId:SystemID,
    cardId:SystemID,
    setTempKanban:(newValue:Kanban)=>void,
    asweredCommentId?:SystemID
){
   
}

function handlePostDeadline(tempCard:Card,userValue:userValueDT,tempKanban:Kanban,setTempKanban:(newValue:Kanban)=>void){
    if(tempCard.deadline?.id == ""){
        const bodyDeadline = {
            cardId: tempCard.id,
            date: tempCard.deadline.date || ""
        }
        if(tempCard.deadline.category != "" && tempCard.deadline.toColumnId != ""){
            tempCard.deadline.category = tempCard.deadline.category;
            tempCard.deadline.toColumnId = tempCard.deadline.toColumnId;
        }
        post_deadline(bodyDeadline,userValue.token,(response)=>response.json().then((deadlineId)=>{
            if(response.ok){
                console.log("CREATE DEADLINE SUCESSS");
                const newKanbanWithDeadline = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"deadline",{
                    id: deadlineId,
                    category: tempCard.deadline.category,
                    date: tempCard.deadline.date,
                    overdue: false,
                    toColumnId: tempCard.deadline.toColumnId
                });
                setTempKanban({...newKanbanWithDeadline});
            }
        }));
    }
}

function handlePostCustomField(tempCard:Card,userValue:userValueDT,tempKanban:Kanban,setTempKanban:(newValue:Kanban)=>void){
    tempCard.customFields.map((customField,index)=>{
        if(customField.id == ""){
            const bodyCustomField = {
                name: customField.name,
                fieldType: customField.fieldType,
                value: customField.value
            }
            
            const provCustomFieldId = "prov"+index;
            const newKanbanWithoutCustomFieldId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"customField",{...bodyCustomField,id:provCustomFieldId},index);
            setTempKanban({...newKanbanWithoutCustomFieldId});
    
            post_customField({...bodyCustomField,cardId:tempCard.id},userValue.token,(response)=>response.json().then((customFieldId)=>{
                if(response.ok){
                    console.log("CREATE CUSTOMFIELD SUCESSS");
                    const newKanbanWithCustomFieldId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"customField",{...bodyCustomField,id:customFieldId},index);
                    setTempKanban({...newKanbanWithCustomFieldId});
                }
            }));
        }
    });
}

function handlePostTag(tempCard:Card,userValue:userValueDT,tempKanban:Kanban,setTempKanban:(newValue:Kanban)=>void){
    tempCard.tags.map((tag,index)=>{
        if(tag.id == ""){
            const bodyTag = {
                name: tag.name,
                color: tag.color
            }

            const provTagId = "prov"+index;
            const newKanbanWithoutTagId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"tag",{...bodyTag,id:provTagId},index);
            setTempKanban({...newKanbanWithoutTagId});

            post_tag({...bodyTag,cardId:tempCard.id},userValue.token,(response)=>response.json().then((tagId)=>{
                if(response.ok){
                    console.log("CREATE TAG SUCESSS");
                    const newKanbanWithTagId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"tag",{...bodyTag,id:tagId},index);
                    setTempKanban({...newKanbanWithTagId});
                }
            }));
        }
    });
}

function handlePostChecklist(tempCard:Card,userValue:userValueDT,tempKanban:Kanban,setTempKanban:(newValue:Kanban)=>void){
    tempCard.checklists.map((checklist,checklistindex)=>{
        if(checklist.id == ""){
            const bodyChecklist = {
                name: checklist.name
            }

            const provChecklistId = "prov"+checklistindex;
            const newKanbanWithoutChecklistId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklist",{
                ...bodyChecklist,
                items:[...checklist.items],
                id:provChecklistId
            },checklistindex);

            setTempKanban({...newKanbanWithoutChecklistId});

            post_checklist({...bodyChecklist,cardId:tempCard.id},userValue.token,(checklistResponse)=>checklistResponse.json().then((checklistId)=>{
                if(checklistResponse.ok){
                    console.log("CREATE CHECKLIST SUCESSS");
                    const newKanbanWithChecklistId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklist",{
                        ...bodyChecklist,
                        items:[...checklist.items],
                        id:checklistId
                    },checklistindex);
                    setTempKanban({...newKanbanWithChecklistId});

                    const items = checklist.items;
                    if(items?.length > 0){
                        items.map((item,itemIndex)=>{
                            const bodyItem = {
                                name: item.name
                            }
                            const provItemId = "prov"+itemIndex;
                            const newKanbanWithoutItemId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklistItem",{...bodyItem,id:provItemId},itemIndex,checklistId);
                            setTempKanban({...newKanbanWithoutItemId});

                            post_checklistItem({...bodyItem,checklistId:checklistId},userValue.token,(itemResponse)=>itemResponse.json().then((itemId)=>{
                                if(itemResponse.ok){
                                    console.log("CREATE CHECKLIST ITEM SUCCESS");
                                    const newKanbanWithItemId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklistItem",{...bodyItem,id:itemId},itemIndex,checklistId);
                                    setTempKanban({...newKanbanWithItemId});
                                }
                            }));
                        });
                    }
                }
            }));
        }else{
            const items = checklist.items;
            if(items?.length > 0){
                items.map((item,itemIndex)=>{
                    if(item.id == ""){
                        const bodyItem = {
                            name: item.name
                        }
                        const provItemId = "prov"+itemIndex;
                        const newKanbanWithoutItemId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklistItem",{...bodyItem,id:provItemId},itemIndex,checklist.id);
                        setTempKanban({...newKanbanWithoutItemId});

                        post_checklistItem({...bodyItem,checklistId:checklist.id},userValue.token,(itemResponse)=>itemResponse.json().then((itemId)=>{
                            if(itemResponse.ok){
                                console.log("CREATE CHECKLIST ITEM SUCCESS");
                                const newKanbanWithItemId = updateCardId(tempKanban,tempCard.columnID,tempCard.id,"checklistItem",{...bodyItem,id:itemId},itemIndex,checklist.id);
                                setTempKanban({...newKanbanWithItemId});
                            }
                        }));
                    }
                });
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
            toColumnId: ""
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

        const provCardId = "prov"+tempColumn.cards.length;
        tempCard.id = provCardId;
        const newKanban = addCardInColumn(tempKanban,columnId,tempCard);
        setTempKanban({...newKanban});

        setCardManager({...cardManager,isShowCreateCard:false})

        post_card({columnId,title,description,members},userValue.token,(response)=>response.json().then((cardId)=>{
            if(response.ok){
                console.log("CREATE CARD SUCESSS");
                const newKanbanWithCardId = updateCardId(tempKanban,columnId,provCardId,"cardId",cardId);
                setTempKanban({...newKanbanWithCardId});

                const date = tempCard.deadline.date;

                if(!date && date != ""){
                    handlePostDeadline(tempCard,userValue,tempKanban,setTempKanban);
                }

                const customFields = tempCard.customFields;
                if(customFields.length > 0){
                    handlePostCustomField(tempCard,userValue,tempKanban,setTempKanban);
                }

                const tags = tempCard.tags;
                if(tags.length > 0){
                    handlePostTag(tempCard,userValue,tempKanban,setTempKanban);
                }

                const checklists = tempCard.checklists;
                if(checklists.length > 0){
                    handlePostChecklist(tempCard,userValue,tempKanban,setTempKanban);
                }

                const comments = tempCard.comments;
                if(comments.length > 0){
                    comments.map((comment,commentIndex)=>{
                        const bodyComment = {
                            content: comment.content
                        }
                
                        const provCommentId = "prov"+commentIndex;
                        const newKanbanWithoutCommentId = updateCardId(tempKanban,columnId,cardId,"comment",{
                            ...bodyComment,
                            edited: comment.edited,
                            registrationDate: comment.registrationDate,
                            user: comment.user,
                            id:provCommentId,
                            answers: []
                        },commentIndex);
                        setTempKanban({...newKanbanWithoutCommentId});
                
                        post_comment({...bodyComment,cardId:tempCard.id},userValue.token,(response)=>response.json().then((commentId)=>{
                            if(response.ok){
                                console.log("CREATE COMMENT SUCCESS");
                                const newKanbanWithCommentId = updateCardId(tempKanban,columnId,cardId,"comment",{
                                    ...bodyComment,
                                    edited: comment.edited,
                                    registrationDate: comment.registrationDate,
                                    user: comment.user,
                                    id:commentId,
                                    answers: []
                                },commentIndex);
                                setTempKanban({...newKanbanWithCommentId});
                                if(comment.answers && comment.answers.length > 0){
                                    processComments(comment.answers,userValue,tempKanban,tempCard,columnId,tempKanban.id,setTempKanban,commentId);
                                }
                            }
                        }));
                        
                    });
                }
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
            toColumnId: ""
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

    console.log(tempCard)

    const newKanbanWithNewCard = updateCardId(tempKanban,tempCard.columnID,cardId,"card",{title,description,members});
    setTempKanban(newKanbanWithNewCard);

    setCardManager({...cardManager,isShowCreateCard:false})

    patch_card({title,description,members},cardId,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("PATCH CARD SUCCESS");
        }
    }));

    const date = tempCard.deadline?.date;

    if(date != null && date != undefined && date != ""){
        handlePostDeadline(tempCard,userValue,tempKanban,setTempKanban);
    }

    const customFields = tempCard.customFields;
    if(customFields.length > 0){
        handlePostCustomField(tempCard,userValue,tempKanban,setTempKanban);
    }
    
}
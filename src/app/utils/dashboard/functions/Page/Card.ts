import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue, Column, Comment } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_card, delete_checklist, delete_checklistItem, delete_customField, delete_deadline, delete_tag, get_card_by_id, patch_card, patch_checklist, patch_checklistItem, patch_customField, patch_deadline, post_card, post_checklist, post_checklistItem, post_comment, post_comment_answer, post_customField, post_deadline, post_tag } from "@/app/utils/fetchs";
import { RefObject } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';


dayjs.locale('pt-br');
dayjs.extend(relativeTime);
dayjs.extend(utc);

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
    column: Column,
    tempKanban: Kanban,
) {

    const columnId = column.id; // COLUMNID É OBRIGATÓRIO
    const columnIndex = tempKanban.columns.findIndex(column=>column.id==columnId);
    const columns = tempKanban.columns;

    const title = "Card "+columns[columnIndex].cards.length; // TITLE É OBRIGATÓRIO
    const description = "";
    const members:SystemID[] = [];

    const provCardId = "|"+columns[columnIndex].cards.length;

    columns[columnIndex].cards.push({
        id: provCardId,
        columnID: columnId,
        kanbanID: tempKanban.id,
        title: title,
        index: columns[columnIndex].cards.length,
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

    setTempKanban({...tempKanban,columns:columns});

    post_card({columnId,title,description,members},userValue.token,(response)=>response.json().then((cardId)=>{
        if(response.ok){
            console.log("CREATE CARD SUCESSS");
            const newCards = columns[columnIndex].cards.map(card=>{
                if(card.id == provCardId){
                    card.id = cardId;
                }
                return card;
            });
            columns[columnIndex].cards = newCards;
            setTempKanban({...tempKanban,columns:columns});
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
        const newDate = dayjs.utc(tempCard.deadline.date).format('YYYY-MM-DDTHH:mm:ss.SSSX').replace("X","Z")
        const bodyDeadline:{
            date: string,
            category: string,
            toColumnId: SystemID
        } = {
            date: newDate,
            category: tempCard.deadline.category,
            toColumnId: tempCard.deadline.toColumnId
        }
        patch_deadline(bodyDeadline,tempCard.deadline.id,userValue.token,(response)=>response.text().then(()=>{
            if(response.ok){
                console.log("UPDATE DEADLINE SUCESSS");
            }
        }));
    }

    const customFields = tempCard.customFields;
    if(customFields.length > 0){
        tempCard.customFields.map((customField)=>{
            patch_customField({value:customField.value},customField.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("UPDATE CUSTOMFIELD SUCCESS");
                }
            }));
        });
    }

    const checklists = tempCard.checklists;
    if(checklists.length > 0){
        tempCard.checklists.map((checklist)=>{
            patch_checklist({name:checklist.name},checklist.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("UPDATE CHECKLIST SUCCESS");
                }
            }));
            const items = checklist.items;
            if(items?.length > 0){
                items.map((item)=>{
                    patch_checklistItem({name:item.name,completed:item.completed},item.id,userValue.token,(response)=>response.text().then(()=>{
                        if(response.ok){
                            console.log("UPDATE CHECKLIST ITEM SUCCESS");
                        }
                    }));
                });
            }
        });
    }

    patch_card({title,description,members},cardId,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("PATCH CARD SUCCESS");
            const newKanbanWithNewCard = updateCardId(tempKanban,tempCard.columnID,"|"+cardId,"card",{id:cardId,title,description,members});
            setTempKanban({...newKanbanWithNewCard});
        }
    }));
}
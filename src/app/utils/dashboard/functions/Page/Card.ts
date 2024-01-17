import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue, Column } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_card, patch_card, post_card, post_customField, post_deadline } from "@/app/utils/fetchs";
import { generateRandomString } from "@/app/utils/generators";
import { API_BASE_URL } from "@/app/utils/variables";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";
import { custom } from "zod";

function updateCardId(kanban:Kanban,columnId:SystemID,cardId:SystemID,type?:string,value?:any,valueIndex?:number){
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
                            if(valueIndex){
                                card.customFields[valueIndex] = value; 
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
        function addCardInColumn(kanban:Kanban,columnId:SystemID,newCard:Card){
            const newColumns = kanban.columns.map((column)=>{
                if(column.id == columnId){
                    if(column.cards){
                        column.cards.push(newCard);
                    }else{
                        column.cards  = [newCard];
                    }
                    return column;
                }else{
                    return column;
                }
            });
            kanban.columns = newColumns;
            return kanban;
        }

        const columnId = tempCard.columnID; // COLUMNID É OBRIGATÓRIO
        const title = tempCard.title; // TITLE É OBRIGATÓRIO
        const description = tempCard.description;
        const members = tempCard.members.map(member=>member.id);

        const provCardId = "prov"+tempColumn.cards.length;
        tempCard.id = provCardId;
        const newKanban = addCardInColumn(tempKanban,columnId,tempCard);
        setTempKanban(newKanban);

        setCardManager({...cardManager,isShowCreateCard:false})

        post_card({columnId,title,description,members},userValue.token,(response)=>response.json().then((cardId)=>{
            if(response.ok){
                console.log("CREATE CARD SUCESSS");
                const newKanbanWithCardId = updateCardId(tempKanban,columnId,provCardId,"cardId",cardId);
                setTempKanban(newKanbanWithCardId);

                const date = tempCard.deadline.date;

                if(date){
                    const deadline:any = {
                        cardId: cardId,
                        date: date.toISOString()
                    }
                    if(tempCard.deadline.category != "" && tempCard.deadline.toColumnId != ""){
                        deadline.category = tempCard.deadline.category;
                        deadline.toColumnId = tempCard.deadline.toColumnId;
                    }
                    post_deadline(deadline,userValue.token,(response)=>response.json().then((deadlineId)=>{
                        if(response.ok){
                            console.log("CREATE DEADLINE SUCESSS");
                            const newKanbanWithDeadline = updateCardId(tempKanban,columnId,cardId,"deadline",{
                                id: deadlineId,
                                category: tempCard.deadline.category,
                                date: date,
                                overdue: false,
                                toColumnId: tempCard.deadline.toColumnId
                            });
                            setTempKanban(newKanbanWithDeadline);
                        }
                    }));
                }

                const customFields = tempCard.customFields;
                if(customFields.length > 0){
                    customFields.map((customField,index)=>{
                        const bodyCustomField = {
                            cardId: tempCard.id,
                            name: customField.name,
                            fieldType: customField.fieldType,
                            value: customField.value
                        }
                        post_customField(bodyCustomField,userValue.token,(response)=>response.json().then((customFieldId)=>{
                            if(response.ok){
                                console.log("CREATE CUSTOMFIELD SUCESSS");
                                const newKanbanWithCustomField = updateCardId(tempKanban,columnId,cardId,"customField",{
                                    ...bodyCustomField,
                                    id: customFieldId
                                },index);
                                setTempKanban(newKanbanWithCustomField);
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
    userData: userValueDT,
    card: Card,
    setCardManager: (newValue: CardManager) => void,
    setTempCard: (newValue: Card) => void,
    cardManager: CardManager,
    failModalOptions: any,
    noButtonRef: RefObject<HTMLButtonElement>,
    modalContextProps: ModalContextProps
){
    if (!isFlagSet(userData.profileData, "EDITAR_CARDS")) {
        modalContextProps.setModalTitle("Ação Negada.");
        modalContextProps.setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        modalContextProps.setModalText("Fale com seu administrador se isto é um engano.");
        modalContextProps.setModalBorderColor("border-red-500");
        modalContextProps.setModalFocusRef(noButtonRef);
        modalContextProps.setModalOptions(failModalOptions);
        modalContextProps.setModalOpen(true);
        return;
    }

    setTempCard(card)

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


    const newKanbanWithNewCard = updateCardId(tempKanban,tempCard.columnID,cardId,"card",{title,description,members});
    setTempKanban(newKanbanWithNewCard);

    setCardManager({...cardManager,isShowCreateCard:false})

    patch_card({title,description,members},cardId,userValue.token,(response)=>response.text().then(()=>{
        if(response.ok){
            console.log("PATCH CARD SUCCESS");
        }
    }));

}
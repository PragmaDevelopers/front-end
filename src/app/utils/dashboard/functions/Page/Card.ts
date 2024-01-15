import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue, Column } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { delete_card, post_card, post_deadline } from "@/app/utils/fetchs";
import { generateRandomString } from "@/app/utils/generators";
import { API_BASE_URL } from "@/app/utils/variables";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";

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

    setCardManager({...cardManager,isEditElseCreate:false,isShowCreateCard:true})
    
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

        function updateCardId(kanban:Kanban,columnId:SystemID,cardId:SystemID,type?:string,value?:any){
            const newColumns = kanban.columns.map((column)=>{
                if(column.id == columnId){
                    const newCards = column.cards.map(card=>{
                        if(card.id == cardId){
                            switch(type){
                                case "cardId":
                                    card.id = value;
                                    break;
                                case "deadline":
                                    card.deadline = value;
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

        if(cardManager.isEditElseCreate){

        }else{

            const columnId = tempCard.columnID; // COLUMNID É OBRIGATÓRIO
            const title = tempCard.title; // TITLE É OBRIGATÓRIO
            const description = tempCard.description;
            const members = tempCard.members.map(member=>member.id);

            const provCardId = "prov"+tempColumn.cards.length;
            tempCard.id = provCardId;
            const newKanban = addCardInColumn(tempKanban,columnId,tempCard);
            setTempKanban(newKanban);

            setCardManager({...cardManager,isEditElseCreate:false,isShowCreateCard:false})

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
                }
            }));
        }
    // Check if the card title is not empty before creating the card
    // if (cardTitle.trim() !== "") {
    //     setKanban((prevData: Kanban) => {
    //         let newCard: Card = {
    //             ...tempCard,
    //             title: cardTitle,
    //             description: cardDescription as string,
    //         }
    //         const targetColumn = prevData.columns.find((column) => column?.id === tempColumnID);
    //         if (!targetColumn) {
    //             return prevData;
    //         }

    //         if (!isEdition) {


    //             // CheckList      Fetch [x]
    //             // CheckListItem  Fetch [x]
    //             // Comment        Fetch [ ]
    //             // Comment Answer Fetch [ ]
    //             // InnerCard      Fetch [ ]
    //             // Prazo          Fetch [ ]
    //             // Membro         Fetch [ ]
    //             // Custom Fields  Fetch [ ]

    //             /*
    //             fetch();
    //             fetch();
    //             fetch();
    //             fetch();
    //             fetch();
    //             fetch();
    //             fetch();
    //             fetch();
    //             */

    //             const fetchCard: any = {
    //                 title: newCard.title,
    //                 description: newCard.description,
    //                 //:
    //             }

    //             let tnCard: Card = newCard;




                
    //             // CHECKLISTS FETCH

    //             tnCard.checklists.forEach((element) => {
    //                 let checklistRequest = {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `Bearer ${userValue.token}`,
    //                     },
    //                     body: JSON.stringify({ cardId: newCard.id, name: element.name }),
    //                 }
    //                 fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList`, checklistRequest).then(
    //                     response => response.text()
    //                 ).then((data) => element.id = data);
    //                 console.log(`[INFO]\tPOST Request for CheckList [${element.name}] #${element.id} was sucessfully made.`);
    //             });







    //             // CHECKLISTS ITEMS FETCH


    //             tnCard.checklists.forEach((element: CheckList) => {
    //                 element.items.forEach((e: CheckListItem) => {
    //                     let checklistItemRequest = {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                             'Authorization': `Bearer ${userValue.token}`,
    //                         },
    //                         body: JSON.stringify({ checklistId: element.id, name: e.name }),
    //                     }

    //                     fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, checklistItemRequest).then(
    //                         response => response.text()
    //                     ).then((data) => e.id = data);
    //                     console.log(`[INFO]\tPOST Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
    //                 });

    //                 element.items.forEach((e: CheckListItem) => {
    //                     if (e.completed) {
    //                         let markItemAsCompletedRequest = {
    //                             method: 'PATCH',
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                                 'Authorization': `Bearer ${userValue.token}`,
    //                             },
    //                             body: JSON.stringify({ name: e.name, completed: e.completed }),
    //                         }
    //                         fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, markItemAsCompletedRequest);
    //                         console.log(`[INFO]\tPATCH Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
    //                     }

    //                 })
    //             });




    //             // TAGS FETCH
    //             tnCard.tags.forEach((element: Tag) => {
    //                 let tagRequest = {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': `Bearer ${userValue.token}`,
    //                     },
    //                     body: JSON.stringify({cardId: tnCard.id, name: element.name}),
    //                 }

    //                 fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tag`, tagRequest).then(
    //                     response => response.text()
    //                 ).then((data) => element.id = data);
    //                 console.log(`[INFO]\tPOST Request for Tag [${element.name}] #${element.id} was sucessfully made.`);
    //             })






    //             const cardRequestOptions = {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${userValue.token}`,
    //                 },
    //                 body: JSON.stringify(fetchCard),
    //             };



    //             // NOTE: WORKING ON. working on.
    //             fetch(`${API_BASE_URL}/api/private/user/kanban/column/card`, cardRequestOptions).then(response => response.text()).then(data => newCard.id = data);
    //             console.log(`CARD ${newCard.id} CREATED.`);




    //             const updatedColumn = {
    //                 ...targetColumn,
    //                 cardsList: [...targetColumn.cards, newCard],
    //             };

    //             const updatedColumns = prevData.columns.map((column) =>
    //                 column?.id === tempColumnID ? updatedColumn : column
    //             );

    //             return {
    //                 ...prevData,
    //                 columns: updatedColumns,
    //             };
    //         } else {
    //             console.log(`CARD ${newCard.id} EDITED.`);
    //             const cardIndex = targetColumn.cards.findIndex((card: Card) => card?.id === newCard.id);
    //             if (cardIndex !== -1) {
    //                 const updatedColumnCardList = targetColumn.cards.map((card: Card) => card?.id === newCard.id ? newCard : card)
    //                 console.log(updatedColumnCardList);
    //                 const updatedColumn = {
    //                     ...targetColumn,
    //                     cardsList: updatedColumnCardList,
    //                 };

    //                 const updatedColumns = prevData.columns.map((column) =>
    //                     column?.id === tempColumnID ? updatedColumn : column
    //                 );

    //                 return {
    //                     ...prevData,
    //                     columns: updatedColumns,
    //                 };
    //             }
    //         }
    //     });
    // }
    // event.target.reset();
    // setEditorText("");
    // setTempColumnID("");
    // setTempCard({
    //     id: generateRandomString(),                                         /////////////////////////////////////////////////////////////////////////////
    //     title: "",
    //     columnID: "",
    //     description: "",
    //     checklists: [],
    //     tags: [],
    //     members: [],
    //     comments: [],
    //     dropdowns: [],
    //     date: "",
    //     customFields: [],
    //     innerCards: [],
    // } as Card);
    // setShowCreateCardForm(false);
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

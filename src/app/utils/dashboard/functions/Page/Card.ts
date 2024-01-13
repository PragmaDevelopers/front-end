import { CustomModalButtonAttributes } from "@/app/components/ui/CustomModal";
import { CardManager, ModalContextProps } from "@/app/interfaces/KanbanInterfaces";
import { Card, Kanban, CheckList, CheckListItem, SystemID, userValueDT, Tag, DateValue } from "@/app/types/KanbanTypes";
import { isFlagSet } from "@/app/utils/checkers";
import { generateRandomString } from "@/app/utils/generators";
import { API_BASE_URL } from "@/app/utils/variables";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefObject } from "react";

export function ShowCreateCard(
        userData: userValueDT,
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

    setCardManager({...cardManager,isSubmit:false,isEditElseCreate:false,isShowCreateCard:true})
    
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
            date: new Date(),
            overdue: false,
            toColumnId: ""
        },
        customFields: [],
        innerCards: []
    })

    console.log("CREATING CARD");
};

export function CreateCardForm(
    event: any, 
    isEdition: boolean,
    editorRef: RefObject<MDXEditorMethods>,
    tempColumnID: SystemID,
    tempCard: Card,
    setKanban: (arg0: (prevKanban: Kanban) => Kanban | Kanban | undefined) => void,
    userValue: userValueDT,
    setTempColumnID: (arg0: SystemID) => void,
    setEditorText: (arg0: string) => void,
    setTempCard: (arg0: Card) => void,
    setShowCreateCardForm: (arg0: boolean) => void,
    ) {
    event.preventDefault();
    const cardTitle: string = event.target.title.value;
    //const cardDescription: string = event.target.description.value;
    const cardDescription: string | undefined = editorRef.current?.getMarkdown();
    console.log("CARD TEXT", cardDescription);

    // Check if the card title is not empty before creating the card
    if (cardTitle.trim() !== "") {
        setKanban((prevData: Kanban) => {
            let newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription as string,
            }
            const targetColumn = prevData.columns.find((column) => column?.id === tempColumnID);
            if (!targetColumn) {
                return prevData;
            }

            if (!isEdition) {


                // CheckList      Fetch [x]
                // CheckListItem  Fetch [x]
                // Comment        Fetch [ ]
                // Comment Answer Fetch [ ]
                // InnerCard      Fetch [ ]
                // Prazo          Fetch [ ]
                // Membro         Fetch [ ]
                // Custom Fields  Fetch [ ]

                /*
                fetch();
                fetch();
                fetch();
                fetch();
                fetch();
                fetch();
                fetch();
                fetch();
                */

                const fetchCard: any = {
                    title: newCard.title,
                    description: newCard.description,
                    //:
                }

                let tnCard: Card = newCard;




                
                // CHECKLISTS FETCH

                tnCard.checklists.forEach((element) => {
                    let checklistRequest = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userValue.token}`,
                        },
                        body: JSON.stringify({ cardId: newCard.id, name: element.name }),
                    }
                    fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList`, checklistRequest).then(
                        response => response.text()
                    ).then((data) => element.id = data);
                    console.log(`[INFO]\tPOST Request for CheckList [${element.name}] #${element.id} was sucessfully made.`);
                });







                // CHECKLISTS ITEMS FETCH


                tnCard.checklists.forEach((element: CheckList) => {
                    element.items.forEach((e: CheckListItem) => {
                        let checklistItemRequest = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${userValue.token}`,
                            },
                            body: JSON.stringify({ checklistId: element.id, name: e.name }),
                        }

                        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, checklistItemRequest).then(
                            response => response.text()
                        ).then((data) => e.id = data);
                        console.log(`[INFO]\tPOST Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
                    });

                    element.items.forEach((e: CheckListItem) => {
                        if (e.completed) {
                            let markItemAsCompletedRequest = {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userValue.token}`,
                                },
                                body: JSON.stringify({ name: e.name, completed: e.completed }),
                            }
                            fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/checkList/checkListItem`, markItemAsCompletedRequest);
                            console.log(`[INFO]\tPATCH Request for CheckList Item [${e.name}] #${e.id} was sucessfully made.`);
                        }

                    })
                });




                // TAGS FETCH
                tnCard.tags.forEach((element: Tag) => {
                    let tagRequest = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userValue.token}`,
                        },
                        body: JSON.stringify({cardId: tnCard.id, name: element.name}),
                    }

                    fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tag`, tagRequest).then(
                        response => response.text()
                    ).then((data) => element.id = data);
                    console.log(`[INFO]\tPOST Request for Tag [${element.name}] #${element.id} was sucessfully made.`);
                })






                const cardRequestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userValue.token}`,
                    },
                    body: JSON.stringify(fetchCard),
                };



                // NOTE: WORKING ON. working on.
                fetch(`${API_BASE_URL}/api/private/user/kanban/column/card`, cardRequestOptions).then(response => response.text()).then(data => newCard.id = data);
                console.log(`CARD ${newCard.id} CREATED.`);




                const updatedColumn = {
                    ...targetColumn,
                    cardsList: [...targetColumn.cards, newCard],
                };

                const updatedColumns = prevData.columns.map((column) =>
                    column?.id === tempColumnID ? updatedColumn : column
                );

                return {
                    ...prevData,
                    columns: updatedColumns,
                };
            } else {
                console.log(`CARD ${newCard.id} EDITED.`);
                const cardIndex = targetColumn.cards.findIndex((card: Card) => card?.id === newCard.id);
                if (cardIndex !== -1) {
                    const updatedColumnCardList = targetColumn.cards.map((card: Card) => card?.id === newCard.id ? newCard : card)
                    console.log(updatedColumnCardList);
                    const updatedColumn = {
                        ...targetColumn,
                        cardsList: updatedColumnCardList,
                    };

                    const updatedColumns = prevData.columns.map((column) =>
                        column?.id === tempColumnID ? updatedColumn : column
                    );

                    return {
                        ...prevData,
                        columns: updatedColumns,
                    };
                }
            }
        });
    }
    event.target.reset();
    setEditorText("");
    setTempColumnID("");
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
    setShowCreateCardForm(false);
};


export function DeleteCard(
    columnID: SystemID, 
    cardID: SystemID,
    setKanban: (arg0: (prevKanban: Kanban) => Kanban | Kanban | undefined) => void,
    ) {
    setKanban((prevData: Kanban) => {
        const targetColumn = prevData.columns.find((column) => column?.id === columnID);
        if (!targetColumn) {
            return prevData;
        }

        const updatedCardsList = targetColumn.cards.filter((card) => card.id !== cardID);

        const updatedColumn = {
            ...targetColumn,
            cardsList: updatedCardsList,
        };

        const updatedColumns = prevData.columns.map((column) =>
            column?.id === columnID ? updatedColumn : column
        );

        return {
            ...prevData,
            columns: updatedColumns,
        };
    });
};

export function AddCardDate(dateOBJ: DateValue, tempCard: Card, setTempCard: (arg0: Card) => void) {
    // const newCard: Card  = {
    //     ...tempCard,
    //     date: dateOBJ === undefined ? "" : dateOBJ === null ? "" : dateOBJ.toString(),
    // }
    // setTempCard(newCard);
}

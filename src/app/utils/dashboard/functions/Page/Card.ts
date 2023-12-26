export function createCard(columnID: string | number) {
    if (!isFlagSet(userValue.userData, "CRIAR_CARDS")) {
        const optAttrs: CustomModalButtonAttributes[] = [
            {
                text: "Entendido.",
                onclickfunc: () => setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ];

        const modalOpt: any = optAttrs.map(
            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>);

        setModalTitle("Ação Negada.");
        setModalDescription("Você não tem as permissões necessárias para realizar esta ação.");
        setModalText("Fale com seu administrador se isto é um engano.");
        setModalBorderColor("border-red-500");
        setModalFocusRef(noButtonRef);
        setModalOptions(modalOpt);
        setModalOpen(true);
        return;
    }

    setTempColumnID(columnID);
    setEditorText("");

    setTempCard({
        id: "",
        title: "",
        columnID: columnID,
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        date: 0,
        customFields: [],
        innerCards: [],
        backendID: 0,
    } as Card);
    setIsEdition(false);
    setShowCreateCardForm(true);
    editorRef.current?.setMarkdown("");
    console.log("CREATING CARD");
};

export function createCardForm(event: any, isEdition: boolean) {
    event.preventDefault();
    const cardTitle: string = event.target.title.value;
    //const cardDescription: string = event.target.description.value;
    const cardDescription: string | undefined = editorRef.current?.getMarkdown();
    console.log("CARD TEXT", cardDescription);

    // Check if the card title is not empty before creating the card
    if (cardTitle.trim() !== "") {
        setKanbanData((prevData: KanbanData) => {
            let newCard: Card = {
                ...tempCard,
                title: cardTitle,
                description: cardDescription,
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
                    cardsList: [...targetColumn.cardsList, newCard],
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
                const cardIndex = targetColumn.cardsList.findIndex((card: Card) => card?.id === newCard.id);
                if (cardIndex !== -1) {
                    const updatedColumnCardList = targetColumn.cardsList.map((card: Card) => card?.id === newCard.id ? newCard : card)
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
    setTempCard({
        id: "",                                         /////////////////////////////////////////////////////////////////////////////
        title: "",
        columnID: "",
        description: "",
        checklists: [],
        tags: [],
        members: [],
        comments: [],
        dropdowns: [],
        date: 0,
        customFields: [],
        innerCards: [],
    } as Card);
    setShowCreateCardForm(false);
};


export function deleteCard(columnID: string | number, cardID: string | number) {
    setKanbanData((prevData: KanbanData) => {
        const targetColumn = prevData.columns.find((column) => column?.id === columnID);
        if (!targetColumn) {
            return prevData;
        }

        const updatedCardsList = targetColumn.cardsList.filter((card) => card.id !== cardID);

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
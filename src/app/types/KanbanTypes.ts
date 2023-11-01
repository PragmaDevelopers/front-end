export type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];
export type FieldInputTypes = 'number' | 'text';


export type DropdownItem = {
    name: string,
    id: string,
    dropdownID: string,
    value: string,
}

export type Dropdown = {
    name: string,
    id: string,
    items: DropdownItem[],
}

export type CustomFieldText = {
    name: string,
    value: string,
    id: string,
    fieldType: FieldInputTypes,
}

export type CustomFieldNumber = {
    name: string,
    value: number,
    id: string,
    fieldType: FieldInputTypes,
}

export type CustomFields = {
    field: CustomFieldNumber | CustomFieldText;
}

export type Comment = {
    userID: string,
    date: number,
    content: string,
}

export type CheckList = {
    name: string,
    id: string,
    items: CheckListItem[],
}

export type CheckListItem = {
    name: string,
    completed: boolean,
    checklistId: string,
}

export type Card = {
    title: string,
    id: string,
    columnID: string,
    description: string,
    checklists: CheckList[],
    tags: Tag[],
    members: Member[],
    comments: Comment[],
    dropdowns: Dropdown[],
    date: number,
    customFields: CustomFields[],
}

export type Column = {
    title: string,
    columnType: number,
    id: string,
    cardsList: Card[],
}

export type KanbanData = {
    columns: Column[],
    kanbanId: string,
}

export type Tag = {
    title: string,
    color: string,
    id: string,
}

export type Member = {
    name: string,
    id: string,
}









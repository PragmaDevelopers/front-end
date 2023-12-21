export type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];
export type FieldInputTypes = 'number' | 'text';

export type DropdownItem = {
    name: string;
    id: string | number;
    dropdownID: string;
    value: string;
}

export type Dropdown = {
    name: string;
    id: string | number;
    items: DropdownItem[];
}

export type CustomFieldText = {
    name: string;
    value: string;
    id: string | number;
    fieldType: "text";
}

export type CustomFieldNumber = {
    name: string;
    value: number;
    id: string | number;
    fieldType: "number";
}

export type CustomFields = CustomFieldNumber | CustomFieldText;


export type CheckList = {
    name: string;
    id: string | number;
    items: CheckListItem[];
}

export type CheckListItem = {
    name: string;
    completed: boolean;
    checklistId: string | number;
    id: string | number;
}

export type Card = {
    title: string;
    id: string | number;
    columnID: string;
    description: string;
    checklists: CheckList[];
    tags: Tag[];
    members: Member[];
    comments: Comment[];
    dropdowns: Dropdown[];
    date: number;
    customFields: CustomFields[];
    innerCards: Card[];
}

export type Column = {
    title: string;
    columnType: number;
    id: string | number;
    cardsList: Card[];
}

export type KanbanData = {
    columns: Column[];
    kanbanId: string | number;
}

export type Tag = {
    title: string;
    color: string;
    id: string | number;
}

export type Member = {
    name: string | null;
    email: string | null;
    nacionalidade: string | null;
    password: string | null; // Hash
    gender: string | null;
    accountCreation: string | null; // Date
    profilePicture: string | null;
    pushEmail: string | null;
    generalPermissions: string | null;
    id: number | string | null;
    role: string | null;
    kanban_role: string | null;
}

export type Comment = {
    content: string;
    user: Member;
    creationDate: string | number; // Date
    cardID: number | string;
    id: string | number;
}


export type userData = {
    id: number;
    name: string;
    email: string;
    pushEmail: string | null;
    registrationDate: string;
    nationality: string;
    gender: string;
    role: string;
    permissionLevel: string;
    profilePicture: string | null;
}

export type userValueDT = {
    token: string;
    userData: userData;
    usersList: userData[];
};

export interface UserContextProps {
    userValue: userValueDT;
    updateUserValue: (newValue: userValueDT) => void;
}

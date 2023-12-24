export type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];
export type FieldInputTypes = 'number' | 'text';
export type SystemID = string | number;

export type DropdownItem = {
    name: string;
    id: SystemID;
    dropdownID: string;
    value: string;
}

export type Dropdown = {
    name: string;
    id: SystemID;
    items: DropdownItem[];
}

export type CustomFieldText = {
    name: string;
    value: string;
    id: SystemID;
    fieldType: "text";
}

export type CustomFieldNumber = {
    name: string;
    value: number;
    id: SystemID;
    fieldType: "number";
}

export type CustomFields = CustomFieldNumber | CustomFieldText;


export type CheckList = {
    name: string;
    id: SystemID;
    items: CheckListItem[];
}

export type CheckListItem = {
    name: string;
    completed: boolean;
    checklistId: SystemID;
    id: SystemID;
}

export type Card = {
    title: string;
    id: SystemID;
    columnID: SystemID;
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
    id: SystemID;
    cardsList: Card[];
}

export type KanbanData = {
    columns: Column[];
    kanbanId: SystemID;
}

export type Tag = {
    title: string;
    color: string;
    id: SystemID;
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
    id: SystemID | null;
    role: string | null;
    kanban_role: string | null;
}

export type Comment = {
    user: Member;
    content: string;
    id: SystemID;
    answers: Comment[] | null;
    edited: boolean;
    date: string;
}


export type userData = {
    id: SystemID;
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

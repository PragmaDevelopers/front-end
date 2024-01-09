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
    date: string;
    customFields: CustomFields[];
    innerCards: Card[];
    outerCardID?: SystemID;
}

export type Column = {
    id: SystemID;
    title: string;
    index: number;
    cards: Card[];
}

export type KanbanData = {
    columns: Column[];
    kanbanId: SystemID;
}

export type Tag = {
    name: string;
    color: string;
    id: SystemID;
}

// export type Member = {
//     name: string | null;
//     email: string | null;
//     nacionalidade: string | null;
//     password: string | null; // Hash
//     gender: string | null;
//     accountCreation: string | null; // Date
//     profilePicture: string | null;
//     pushEmail: string | null;
//     generalPermissions: string | null;
//     id: SystemID | null;
//     role: string | null;
//     kanban_role: string | null;
// }

export type Member = userData;

export type Comment = {
    user: Member;
    content: string;
    id: SystemID;
    answers: Comment[];
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

export type Notification = {
    id: SystemID;
    message: string;
    viewed: boolean;
    category: string;
    sender_user_id: SystemID;
    sender_user_name: string;
    recipient_user_id: SystemID | undefined;
    recipient_user_name: string | undefined;
    changed_id: SystemID;
}

type CustomFieldsInput = {
    id: SystemID;
    inputName: string;
    inputType: string;
    index: number;
}

export type CustomFieldsTemplate = {
    name: string;
    inputs: CustomFieldsInput[];
}

export type CustomFieldEntry = {
    name: string;
    inputName: string;
    inputType: string;
    id: SystemID;
}



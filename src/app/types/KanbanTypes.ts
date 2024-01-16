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

export type CustomField = {
    name: string;
    value: string;
    id: SystemID;
    fieldType: "text" | "number";
};


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
    columnID: SystemID,
    kanbanID: SystemID,
    index: number,
    description: string;
    checklists: CheckList[];
    tags: Tag[];
    members: User[];
    comments: Comment[];
    dropdowns: Dropdown[];
    deadline: {
        id: SystemID,
        date: Date | null,
        overdue: boolean,
        category: string,
        toColumnId: SystemID
    };
    customFields: CustomField[];
    innerCards: Card[];
    outerCardID?: SystemID;
}

export type Column = {
    id: SystemID;
    title: string;
    index: number;
    cards: Card[];
}

export type Tag = {
    name: string;
    color: string;
    id: SystemID;
}

export type Comment = {
    user: User;
    content: string;
    id: SystemID;
    answers?: Comment[];
    edited: boolean;
    registrationDate: Date;
}

export type User = {
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
    profileData: User;
    userList: User[];
    notifications: NotificationUser[]
};

export type Kanban = {
    id: SystemID,
    title: string,
    columns: Column[],
    members: User[]
}

export type NotificationUser = {
    id: SystemID;
    message: string;
    viewed: boolean;
    registrationDate: string,
    category: string;
    sender_user_id: SystemID;
    sender_user_name: string;
    recipient_user_id?: SystemID;
    recipient_user_name?: string;
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



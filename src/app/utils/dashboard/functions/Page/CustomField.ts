import { Card, CustomFieldText, CustomFields, CustomFieldNumber} from "@/app/types/KanbanTypes";

export function AddCustomField(
    name: string, 
    value: string | number, 
    fieldType: "text" | "number",
    setTempCard: (arg0: (prevCard: Card) => Card | Card | undefined | any) => void,
    ) {
    setTempCard((prevCard: Card) => {
        console.log(prevCard);
        if (fieldType === "text") {
            const Field: CustomFieldText = {
                name: name,
                value: value as string,
                id: "",                                         /////////////////////////////////////////////////////////////////////////////
                fieldType: "text",
            }
            const newCustomFields: CustomFields[] = [...prevCard.customFields, Field as unknown as CustomFields];
            return {
                ...prevCard,
                customFields: newCustomFields,
            };
        } else {
            const Field: CustomFieldNumber = {
                name: name,
                value: value as number,
                id: "",                                         /////////////////////////////////////////////////////////////////////////////
                fieldType: "number",
            }
            const newCustomFields: CustomFields[] = [...prevCard.customFields, Field as unknown as CustomFields];
            return {
                ...prevCard,
                customFields: newCustomFields,
            };
        }
    });
}
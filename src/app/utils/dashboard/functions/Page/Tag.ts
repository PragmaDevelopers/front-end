import { useUserContext } from "@/app/contexts/userContext";
import { Card, SystemID, Tag } from "@/app/types/KanbanTypes";
import { generateRandomString } from "@/app/utils/generators";

export function AddTag(tagTitle: string, tagColor: string, setTempCard: any, userValue: any) {
    setTempCard((prevCard: Card) => {
        const newTag: Tag = {
            name: tagTitle, color: tagColor, id: generateRandomString(),
        };

        const newTagsList: Tag[] = [...prevCard.tags, newTag];
        return {
            ...prevCard,
            tags: newTagsList,
        } as Card;
    });
}

export function RemoveTag(tagID: SystemID, setTempCard: any) {
    setTempCard((prevCard: Card) => {
        const newTagsList: Tag[] = prevCard.tags.filter((tag: Tag) => tag.id !== tagID);
        console.log("removendo tag", tagID);
        console.log("nova lista de tags", newTagsList);
        return {
            ...prevCard,
            tags: newTagsList,
        } as Card;
    });
}

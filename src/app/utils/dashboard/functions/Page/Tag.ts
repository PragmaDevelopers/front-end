import { Card, SystemID, Tag } from "@/app/types/KanbanTypes";

export function AddTag(tagTitle: string, tagColor: string, setTempCard: any) {
    setTempCard((prevCard: Card) => {
        const newTag: Tag = {
            name: tagTitle, color: tagColor, id: ""
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

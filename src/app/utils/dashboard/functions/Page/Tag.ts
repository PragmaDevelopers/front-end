import { Card, SystemID, Tag } from "@/app/types/KanbanTypes";

export function AddTag(tagTitle: string, tagColor: string, setTempCard: (arg0: (prevCard: Card) => Card | Card) => void) {
    setTempCard((prevCard: Card) => {
        const newTag: Tag = {
            title: tagTitle, color: tagColor, id: ""
        };
        const newTagsList: Tag[] = [...prevCard.tags, newTag];
        return {
            ...prevCard,
            tags: newTagsList,
        } as Card;
    });
}

export function RemoveTag(tagID: SystemID, setTempCard: (arg0: (prevCard: Card) => Card | Card) => void) {
    setTempCard((prevCard: Card) => {
        const newTagsList: Tag[] = prevCard.tags.filter((tag: Tag) => tag.id != tagID);
        return {
            ...prevCard,
            tags: newTagsList,
        } as Card;
    });
}
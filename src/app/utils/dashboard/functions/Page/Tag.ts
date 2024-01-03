import { Card, SystemID, Tag } from "@/app/types/KanbanTypes";

export function AddTag(tagTitle: string, tagColor: string, setTempCard: any) {
    setTempCard((prevCard: Card) => {
        let request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
            body: JSON.stringify({ cardId: prevCard.id, name: tagTitle, color: tagColor }),
        }


        const newTag: Tag = {
            name: tagTitle, color: tagColor, id: ""
        };
        fetch(``, request);
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

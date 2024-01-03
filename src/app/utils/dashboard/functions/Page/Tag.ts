import { useUserContext } from "@/app/contexts/userContext";
import { Card, SystemID, Tag } from "@/app/types/KanbanTypes";
import { API_BASE_URL } from "@/app/utils/variables";

export function AddTag(tagTitle: string, tagColor: string, setTempCard: any) {
    const { userValue } = useUserContext();

    setTempCard((prevCard: Card) => {
        let tmpID = "";
        let request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
            body: JSON.stringify({ cardId: prevCard.id, name: tagTitle, color: tagColor }),
        }

        fetch(`${API_BASE_URL}/api/private/user/kanban/column/card/tag`, request).then(
            response => response.text()
        ).then(data => tmpID = data);

        const newTag: Tag = {
            name: tagTitle, color: tagColor, id: tmpID,
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

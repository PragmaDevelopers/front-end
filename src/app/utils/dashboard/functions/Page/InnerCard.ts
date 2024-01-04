
export function CreateInnerCard( /* This function is called on the create button */
        event: any, 
        isEdittingInnerCard: boolean,
    ) {
    if (isEdittingInnerCard) {
        event.preventDefault();
    } else {
        event.preventDefault();
        
    }
}

export function AddInnerCard( /*  This function is called on the form submit */
        event: any, 
        isEdittingInnerCard: boolean,
    ) {
    if (isEdittingInnerCard) {
        event.preventDefault();

    } else {
        event.preventDefault();
    }
}

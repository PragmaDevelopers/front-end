import { userData } from "../types/KanbanTypes";
import { SYSTEM_PERMISSIONS } from "./variables";

export function isFlagSet(userValue: userData, flag: string): boolean {
    let bitMask: number = SYSTEM_PERMISSIONS[flag];
    let binaryValue: number = parseInt(userValue.permissionLevel, 2);
    return (binaryValue & bitMask) !== 0;
}
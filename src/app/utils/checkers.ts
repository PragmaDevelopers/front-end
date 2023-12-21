import { userData } from "../types/KanbanTypes";
import { PERMISSIONS_LIST, SYSTEM_PERMISSIONS } from "./variables";

export function isFlagSet(userValue: userData, flag: string): boolean {
    //let bitMask: number = SYSTEM_PERMISSIONS[flag];
    //let binaryValue: number = parseInt(userValue.permissionLevel, 2);
    //return (binaryValue & bitMask) !== 0;
    let flagVal: boolean = checkUserPermission(flag, userValue.permissionLevel);
    let isUserAdmin: boolean = userValue.role === "ROLE_ADMIN"; 
    let retVal: boolean = flagVal || isUserAdmin;
    return retVal;
}

export function getkUserPerms(userPerms: string): { [Key: string]: boolean } {
    let userPermissions: { [Key: string]: boolean } = {
        "CRIAR_CARDS": false,
        "MOVER_CARDS": false,
        "DELETAR_CARDS": false,
        "EDITAR_CARDS": false,
        "CRIAR_COLUNAS": false,
        "MOVER_COLUNAS": false,
        "DELETAR_COLUNAS": false,
        "EDITAR_COLUNAS": false,
        "CRIAR_DASHBOARDS": false,
        "DELETAR_DASHBOARDS": false,
        "EDITAR_DASHBOARDS": false,
        "CRIAR_CHECKLISTS": false,
        "DELETAR_CHECKLISTS": false,
        "EDITAR_CHECKLISTS": false,
        "CRIAR_PRAZOS": false,
        "DELETAR_PRAZOS": false,
        "EDITAR_PRAZOS": false,
        "CRIAR_COMENTÁRIOS": false,
        "EDITAR_COMENTÁRIOS_PRÓPRIOS": false,
        "EDITAR_COMENTÁRIOS_EXTERNOS": false,
        "DELETAR_COMENTÁRIOS_PRÓPRIOS": false,
        "DELETAR_COMENTÁRIOS_EXTERNOS": false,
        "RECEBER_NOTIFICAÇÕES_DE_SISTEMA": false,
        "RECEBER_NOTIFICAÇÕES_PUSH": false,
        "CONVIDAR_PARA_O_KANBAN": false,
        "RETIRAR_DO_KANBAN": false,
        "CRIAR_TAG": false,
        "EDITAR_TAG": false,
        "DELETAR_TAG": false,
        "CRIAR_CAMPO": false,
        "DELETAR_CAMPO": false,
    }
    let permsList: string[] = PERMISSIONS_LIST;

    for (let c = 0; c < userPerms.length; c++) {
        let permVal: string = userPerms[c];
        userPermissions[permsList[c]] = permVal === "1";
    }
    console.log(permsList);
    return userPermissions;
}

export function checkUserPermission(permission: string, userPerms: string): boolean {
    const userPermsObj: { [Key: string]: boolean } = getkUserPerms(userPerms);
    return userPermsObj[permission];
}
